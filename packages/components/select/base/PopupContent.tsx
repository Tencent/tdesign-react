import React, { Children, cloneElement, isValidElement, useMemo, useRef } from 'react';

import classNames from 'classnames';
import { isEqual } from 'lodash-es';

import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import usePanelVirtualScroll from '../hooks/usePanelVirtualScroll';
import { getKeyMapping, getSelectValueArr } from '../util/helper';
import Option, { type SelectOptionProps } from './Option';
import OptionGroup from './OptionGroup';

import type {
  SelectOption,
  SelectOptionGroup,
  SelectValue,
  SelectValueChangeTrigger,
  TdOptionProps,
  TdSelectProps,
} from '../type';

interface SelectPopupProps
  extends Pick<
    TdSelectProps,
    | 'value'
    | 'size'
    | 'multiple'
    | 'empty'
    | 'options'
    | 'max'
    | 'loadingText'
    | 'loading'
    | 'valueType'
    | 'keys'
    | 'panelTopContent'
    | 'panelBottomContent'
    | 'scroll'
  > {
  onChange?: (
    value: SelectValue,
    context?: {
      label?: string | number;
      value?: SelectValue;
      restData?: Record<string, any>;
      e: React.MouseEvent<HTMLLIElement>;
      trigger: SelectValueChangeTrigger;
    },
  ) => void;
  hoverIndex: number;
  children?: React.ReactNode;
  /**
   * 是否展示popup
   */
  showPopup: boolean;
  /**
   * 控制popup展示的函数
   */
  setShowPopup: (show: boolean) => void;
  onCheckAllChange?: (checkAll: boolean, e: React.MouseEvent<HTMLLIElement>) => void;
  getPopupInstance?: () => HTMLDivElement;
}

const PopupContent = React.forwardRef<HTMLDivElement, SelectPopupProps>((props, ref) => {
  const {
    value,
    size,
    max,
    multiple,
    showPopup,
    setShowPopup,
    empty,
    loadingText,
    loading,
    valueType,
    children,
    keys,
    panelTopContent,
    panelBottomContent,
    onChange,
    onCheckAllChange,
    getPopupInstance,
    options: propsOptions,
    scroll: propsScroll,
    hoverIndex,
  } = props;
  const { classPrefix } = useConfig();

  const [local, t] = useLocaleReceiver('select');
  const emptyText = t(local.empty);

  const popupContentRef = useRef<HTMLDivElement>(null);
  popupContentRef.current = getPopupInstance();

  const { visibleData, handleRowMounted, isVirtual, panelStyle, cursorStyle } = usePanelVirtualScroll({
    popupContentRef,
    scroll: propsScroll,
    options: propsOptions,
    size,
  });

  const isObjectType = useMemo(() => valueType === 'object', [valueType]);
  const { valueKey, labelKey } = useMemo(() => getKeyMapping(keys), [keys]);

  const optionsExcludedCheckAll = useMemo(() => {
    const uniqueOptions = {};
    propsOptions?.forEach((option: SelectOption) => {
      if ((option as SelectOptionGroup).group) {
        (option as SelectOptionGroup).children.forEach((item) => {
          if (!item.checkAll) {
            uniqueOptions[item.value] = item;
          }
        });
      } else if (!(option as TdOptionProps).checkAll) {
        uniqueOptions[(option as TdOptionProps).value] = option;
      }
    });
    return Object.values(uniqueOptions);
  }, [propsOptions]);

  const onSelect: SelectOptionProps['onSelect'] = (selectedValue, { label, selected, event, restData }) => {
    const objVal = {
      ...(isObjectType ? { ...restData } : {}),
      [labelKey]: label,
      [valueKey]: selectedValue,
    };

    if (multiple) {
      const values = getSelectValueArr(value, selectedValue, selected, valueType, keys, objVal);
      onChange(values, { label, value: selectedValue, e: event, trigger: selected ? 'uncheck' : 'check' });
    } else {
      const selectVal = valueType === 'object' ? objVal : selectedValue;
      if (!isEqual(value, selectVal)) {
        onChange(selectVal, { label, value: selectVal, e: event, trigger: 'check' });
      }
      setShowPopup(!showPopup);
    }
  };

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const addedProps = { size, max, multiple, selectedValue: value, onSelect };
      return cloneElement(child, { ...addedProps });
    }
    return child;
  });

  const isEmpty =
    (Array.isArray(childrenWithProps) && !childrenWithProps.length) || (propsOptions && propsOptions.length === 0);

  // 渲染 options
  const renderOptions = (options: SelectOption[], startIndex = 0) => {
    if (options) {
      let currentIndex = startIndex;
      // 通过 options API配置的
      return (
        <ul className={`${classPrefix}-select__list`}>
          {options.map((item, index) => {
            const { group, divider, ...rest } = item as SelectOptionGroup;
            if (group) {
              const groupElement = (
                <OptionGroup label={group} divider={divider} key={index} {...rest}>
                  {renderOptions(rest.children, currentIndex)}
                </OptionGroup>
              );
              // group 的 children 数量需要累加
              currentIndex += rest.children.length;
              return groupElement;
            }

            const { value: optionValue, label, disabled, children, ...restData } = item as TdOptionProps;
            // 当 keys 属性配置 content 作为 value 或 label 时，确保 restData 中也包含它, 不参与渲染计算
            const { content } = item as TdOptionProps;
            const shouldOmitContent = Object.values(keys || {}).includes('content');

            const isKeyboardHovered = hoverIndex === currentIndex;
            currentIndex += 1;

            const optionElement = (
              <Option
                key={index}
                max={max}
                label={label}
                value={optionValue}
                onSelect={onSelect}
                selectedValue={value}
                optionLength={optionsExcludedCheckAll.length}
                multiple={multiple}
                size={size}
                disabled={disabled}
                restData={restData}
                keys={keys}
                isKeyboardHovered={isKeyboardHovered}
                onCheckAllChange={onCheckAllChange}
                onRowMounted={handleRowMounted}
                {...(isVirtual
                  ? {
                      isVirtual,
                      bufferSize: propsScroll?.bufferSize,
                      scrollType: propsScroll?.type,
                    }
                  : {})}
                {...restData}
                content={shouldOmitContent ? null : content}
              >
                {children}
              </Option>
            );
            return optionElement;
          })}
        </ul>
      );
    }
    return <ul className={`${classPrefix}-select__list`}>{childrenWithProps}</ul>;
  };

  const renderPanel = (renderedOptions: SelectOption[], extraStyle?: React.CSSProperties) => (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-select__dropdown-inner`, {
        [`${classPrefix}-select__dropdown-inner--size-s`]: size === 'small',
        [`${classPrefix}-select__dropdown-inner--size-l`]: size === 'large',
        [`${classPrefix}-select__dropdown-inner--size-m`]: size === 'medium',
      })}
      style={extraStyle}
    >
      {loading && <div className={`${classPrefix}-select__loading-tips`}>{loadingText}</div>}
      {!loading && isEmpty && (
        <div className={`${classPrefix}-select__empty`}>{empty ? empty : <p>{emptyText}</p>}</div>
      )}
      {!loading && !isEmpty && renderOptions(renderedOptions)}
    </div>
  );

  if (isVirtual) {
    return (
      <>
        {panelTopContent}
        <div>
          <div style={cursorStyle}></div>
          {renderPanel(visibleData, panelStyle)}
        </div>
        {panelBottomContent}
      </>
    );
  }

  if (!children && !propsOptions) return null;

  return (
    <>
      {panelTopContent}
      {renderPanel(propsOptions)}
      {panelBottomContent}
    </>
  );
});

export default PopupContent;
