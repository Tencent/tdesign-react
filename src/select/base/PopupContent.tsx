import React, { Children, isValidElement, cloneElement } from 'react';
import { getSelectValueArr } from '../util/helper';
import { TdSelectProps, SelectValue } from '../../_type/components/select';
import Option, { SelectOptionProps } from './Option';

interface SelectPopupProps
  extends Pick<TdSelectProps, 'value' | 'size' | 'multiple' | 'empty' | 'options' | 'max' | 'loadingText' | 'loading'> {
  onChange?: (value: SelectValue, context?: { label?: string | number }) => void;
  children?: React.ReactNode;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
}

const PopupContent = (props: SelectPopupProps) => {
  const { onChange, value, size, max, multiple, showPopup, setShowPopup, options, empty, loadingText, loading } = props;

  if (!props.children && !props.options) return null;

  const onSelect: SelectOptionProps['onSelect'] = (selectedValue, { label, selected }) => {
    if (selectedValue) {
      if (multiple) {
        const values = getSelectValueArr(value, selectedValue, label, selected);
        onChange(values, { label });
        requestAnimationFrame(() => setShowPopup(true));
      } else {
        onChange(selectedValue, { label });
        setShowPopup(!showPopup);
      }
    }
  };

  const childrenWithProps = Children.map(props.children, (child) => {
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
          {options.map(({ value: optionValue, label }, index) => (
            <Option
              key={index}
              max={max}
              label={label}
              value={optionValue}
              onSelect={(_, { event }) => onSelect(optionValue, { label, event })}
              selectedValue={value}
            />
          ))}
        </ul>
      );
    }
    return <ul>{childrenWithProps}</ul>;
  };

  const isEmpty = Array.isArray(childrenWithProps) && !childrenWithProps.length;

  if (isEmpty) {
    return (
      <div
        style={{
          height: '180px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {empty ? empty : <p>无数据</p>}
      </div>
    );
  }

  if (loading) {
    return <div>{loadingText}</div>;
  }
  return <div>{renderOptions()}</div>;
};

export default PopupContent;
