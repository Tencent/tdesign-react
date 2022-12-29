import React, { Children, Ref, forwardRef, isValidElement, cloneElement } from 'react';
import classNames from 'classnames';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getSelectValueArr } from '../util/helper';
import { TdSelectProps, SelectValue, TdOptionProps, SelectValueChangeTrigger } from '../type';
import useConfig from '../../hooks/useConfig';
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
}

const PopupContent = forwardRef((props: SelectPopupProps, ref: Ref<HTMLDivElement>) => {
  const {
    onChange,
    value,
    size,
    max,
    multiple,
    showPopup,
    setShowPopup,
    options,
    empty,
    loadingText,
    loading,
    valueType,
    children,
    keys,
    panelTopContent,
    panelBottomContent,
    onCheckAllChange,
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('select');
  const emptyText = t(local.empty);

  const { classPrefix } = useConfig();
  if (!children && !props.options) return null;

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
  const renderOptions = () => {
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

  const isEmpty = (Array.isArray(childrenWithProps) && !childrenWithProps.length) || (options && options.length === 0);

  return (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-select__dropdown-inner`, {
        [`${classPrefix}-select__dropdown-inner--size-s`]: size === 'small',
        [`${classPrefix}-select__dropdown-inner--size-l`]: size === 'large',
        [`${classPrefix}-select__dropdown-inner--size-m`]: size === 'medium',
      })}
    >
      {panelTopContent}
      {loading && <div className={`${classPrefix}-select__loading-tips`}>{loadingText}</div>}
      {!loading && isEmpty && (
        <div className={`${classPrefix}-select__empty`}>{empty ? empty : <p>{emptyText}</p>}</div>
      )}
      {!loading && !isEmpty && renderOptions()}
      {panelBottomContent}
    </div>
  );
});

export default PopupContent;
