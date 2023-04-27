import React, { Children, Ref, forwardRef, isValidElement, cloneElement, useRef, CSSProperties } from 'react';
import classNames from 'classnames';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getSelectValueArr } from '../util/helper';
import { TdSelectProps, SelectValue, TdOptionProps, SelectValueChangeTrigger, SelectOption } from '../type';
import useConfig from '../../hooks/useConfig';
import usePanelVirtualScroll from '../hooks/usePanelVirtualScroll';
import Option, { SelectOptionProps } from './Option';

type OptionsType = TdOptionProps[];

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

const PopupContent = forwardRef((props: SelectPopupProps, ref: Ref<HTMLDivElement>) => {
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
    options: propsOptions,
    scroll: propsScroll,
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('select');
  const emptyText = t(local.empty);
  const popupContentRef = useRef<HTMLElement>(null);

  popupContentRef.current = props.getPopupInstance();

  const { visibleData, handleRowMounted, isVirtual, panelStyle, cursorStyle } = usePanelVirtualScroll({
    popupContentRef,
    scroll: propsScroll,
    options: propsOptions,
  });

  const { classPrefix } = useConfig();
  if (!children && !propsOptions) return null;

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
      onChange(values, { label, e: event, trigger: 'check' });
    } else {
      // calc single select value
      const selectVal = valueType === 'object' ? objVal : selectedValue;

      onChange(selectVal, { label, e: event, trigger: 'check' });
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
      const uniqueOptions = [];
      options.forEach((option: SelectOptionProps) => {
        const index = uniqueOptions.findIndex((item) => item.label === option.label && item.value === option.value);
        if (index === -1) {
          uniqueOptions.push(option);
        }
      });
      const selectableOption = uniqueOptions.filter((v) => !v.disabled && !v.checkAll);
      // 通过 options API配置的
      return (
        <ul className={`${classPrefix}-select__list`}>
          {(uniqueOptions as OptionsType).map(
            ({ value: optionValue, label, disabled, content, children, ...restData }, index) => (
              <Option
                key={index}
                max={max}
                label={label}
                value={optionValue}
                onSelect={onSelect}
                selectedValue={value}
                optionLength={selectableOption.length}
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
                      bufferSize: props.scroll?.bufferSize,
                      scrollType: props.scroll?.type,
                    }
                  : {})}
                {...restData}
              >
                {children}
              </Option>
            ),
          )}
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
