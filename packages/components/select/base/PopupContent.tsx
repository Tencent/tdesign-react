import React, { Children, isValidElement, cloneElement, useRef, CSSProperties, useMemo } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash-es';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getSelectValueArr } from '../util/helper';
import {
  TdSelectProps,
  SelectValue,
  TdOptionProps,
  SelectValueChangeTrigger,
  SelectOption,
  SelectOptionGroup,
} from '../type';
import useConfig from '../../hooks/useConfig';
import usePanelVirtualScroll from '../hooks/usePanelVirtualScroll';
import Option, { SelectOptionProps } from './Option';
import OptionGroup from './OptionGroup';

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
  /**
   * 是否展示popup
   */
  showPopup: boolean;
  /**
   * 控制popup展示的函数
   */
  setShowPopup: (show: boolean) => void;
  children?: React.ReactNode;
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
  } = props;

  // 国际化文本初始化
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

  // 全部可选选项
  const selectableOptions = useMemo<TdOptionProps[]>(() => {
    const uniqueOptions = {};
    propsOptions?.forEach((option: SelectOption) => {
      if ((option as SelectOptionGroup).group) {
        (option as SelectOptionGroup).children.forEach((item) => {
          if (!item.disabled && !item.checkAll) {
            uniqueOptions[item.value] = item;
          }
        });
      } else if (!(option as TdOptionProps).disabled && !(option as TdOptionProps).checkAll) {
        uniqueOptions[(option as TdOptionProps).value] = option;
      }
    });
    return Object.values(uniqueOptions);
  }, [propsOptions]);

  // 全选是否选中
  const checkAllStatus = useMemo(() => {
    if (!multiple || !value) {
      return { checked: false, indeterminate: false };
    }

    if (!selectableOptions?.length) {
      return { checked: true, indeterminate: false };
    }

    const isValObj = valueType === 'object';
    const selectedValues: SelectValue[] = isValObj
      ? (value as SelectValue[])?.map((item) => item[keys?.value || 'value'])
      : (value as SelectValue[]);

    const checked = selectableOptions?.every((option) => selectedValues?.includes?.(option[keys?.value || 'value']));

    const indeterminate =
      !checked && selectableOptions?.some((option) => selectedValues?.includes?.(option[keys?.value || 'value']));

    return { checked, indeterminate };
  }, [multiple, value, selectableOptions, valueType, keys]);

  const { classPrefix } = useConfig();
  if (!children && !propsOptions) {
    return null;
  }

  const onSelect: SelectOptionProps['onSelect'] = (selectedValue, { label, selected, event, restData }) => {
    const isValObj = valueType === 'object';
    let objVal = {};
    if (isValObj) {
      objVal = { ...restData };
      if (!keys?.label) {
        Object.assign(objVal, { label });
      }
      if (!keys?.value) {
        Object.assign(objVal, { value: selectedValue });
      }
    }

    if (!Object.keys(objVal).length) {
      Object.assign(objVal, { [keys?.label || 'label']: label, [keys?.value || 'value']: selectedValue });
    }

    if (multiple) {
      // calc multiple select values
      const values = getSelectValueArr(value, selectedValue, selected, valueType, keys, objVal);
      onChange(values, { label, value: selectedValue, e: event, trigger: selected ? 'uncheck' : 'check' });
    } else {
      // calc single select value
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

  // 渲染 options
  const renderOptions = (options: SelectOption[]) => {
    if (options) {
      // 通过 options API配置的
      return (
        <ul className={`${classPrefix}-select__list`}>
          {options.map((item, index) => {
            const { group, divider, ...rest } = item as SelectOptionGroup;
            if (group) {
              return (
                <OptionGroup label={group} divider={divider} key={index}>
                  {renderOptions(rest.children)}
                </OptionGroup>
              );
            }

            const { value: optionValue, label, disabled, content, children, ...restData } = item as TdOptionProps;
            return (
              <Option
                key={index}
                max={max}
                label={label}
                value={optionValue}
                onSelect={onSelect}
                selectedValue={value}
                checkAllStatus={checkAllStatus}
                multiple={multiple}
                size={size}
                disabled={disabled}
                restData={restData}
                keys={keys}
                content={content}
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
              >
                {children}
              </Option>
            );
          })}
        </ul>
      );
    }
    return <ul className={`${classPrefix}-select__list`}>{childrenWithProps}</ul>;
  };

  const isEmpty =
    (Array.isArray(childrenWithProps) && !childrenWithProps.length) || (propsOptions && propsOptions.length === 0);

  const renderPanel = (renderedOptions: SelectOption[], extraStyle?: CSSProperties) => (
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

  return (
    <>
      {panelTopContent}
      {renderPanel(propsOptions)}
      {panelBottomContent}
    </>
  );
});

export default PopupContent;
