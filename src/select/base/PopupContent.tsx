import React, { Children, isValidElement, cloneElement } from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getSelectValueArr } from '../util/helper';
import { TdSelectProps, SelectValue, TdOptionProps } from '../type';
import useConfig from '../../_util/useConfig';
import Option, { SelectOptionProps } from './Option';

type OptionsType = TdOptionProps[];

interface SelectPopupProps
  extends Pick<
    TdSelectProps,
    'value' | 'size' | 'multiple' | 'empty' | 'options' | 'max' | 'loadingText' | 'loading' | 'valueType' | 'keys'
  > {
  onChange?: (value: SelectValue, context?: { label?: string | number; restData?: Record<string, any> }) => void;
  /**
   * 是否展示popup
   */
  showPopup: boolean;
  /**
   * 控制popup展示的函数
   */
  setShowPopup: (show: boolean) => void;
  children?: React.ReactNode;
}

const PopupContent = (props: SelectPopupProps) => {
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
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('select');
  const emptyText = t(local.empty);

  const { classPrefix } = useConfig();
  if (!children && !props.options) return null;

  const onSelect: SelectOptionProps['onSelect'] = (selectedValue, { label, selected, restData }) => {
    if (selectedValue) {
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

      if (multiple) {
        // calc multiple select values
        const values = getSelectValueArr(value, selectedValue, selected, valueType, keys, objVal);
        onChange(values, { label });
        requestAnimationFrame(() => setShowPopup(true));
      } else {
        // calc single select value
        const selectVal = valueType === 'object' ? objVal : selectedValue;

        onChange(selectVal, { label });
        setShowPopup(!showPopup);
      }
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
      // 通过options API配置的
      return (
        <ul>
          {(options as OptionsType).map(({ value: optionValue, label, disabled, ...restData }, index) => (
            <Option
              key={index}
              max={max}
              label={label}
              value={optionValue}
              onSelect={onSelect}
              selectedValue={value}
              multiple={multiple}
              size={size}
              disabled={disabled}
              restData={restData}
              keys={keys}
            />
          ))}
        </ul>
      );
    }
    return <ul>{childrenWithProps}</ul>;
  };

  const isEmpty = (Array.isArray(childrenWithProps) && !childrenWithProps.length) || (options && options.length === 0);

  if (isEmpty) {
    return <div className={`${classPrefix}-select-empty`}>{empty ? empty : <p>{emptyText}</p>}</div>;
  }

  if (loading) {
    return <div className={`${classPrefix}-select-loading-tips`}>{loadingText}</div>;
  }
  return <div>{renderOptions()}</div>;
};

export default PopupContent;
