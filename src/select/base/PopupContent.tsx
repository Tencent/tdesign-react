import React, { Children, isValidElement, cloneElement } from 'react';
import { getSelectValueArr } from '../util/helper';
import { SelectPopupProps, SelectOption } from '../SelectProps';
import Option from './Option';

const PopupContent = (props: SelectPopupProps) => {
  const { onChange, value, size, multiple, showPopup, setShowPopup, options, notFoundContent } = props;

  if (!props.children && !props.options) return null;

  const onSelect: SelectOption['onSelect'] = (selectedValue, { label, selected, event }) => {
    if (selectedValue) {
      if (multiple) {
        const values = getSelectValueArr(value, selectedValue, label, selected);
        onChange(values, { event });
        requestAnimationFrame(() => setShowPopup(true));
      } else {
        onChange(selectedValue, { label, event });
        setShowPopup(!showPopup);
      }
    }
  };

  const childrenWithProps = Children.map(props.children, (child) => {
    if (isValidElement(child)) {
      const addedProps = { size, multiple, selectedValue: value, onSelect };
      return cloneElement(child, { ...addedProps });
    }
    return child;
  });

  // 渲染 options
  const renderOptions = () => {
    if (options) {
      return (
        <ul>
          {options.map(({ value, label }, index) => (
            <Option
              key={index}
              label={label}
              value={value}
              onSelect={(_, { event }) => onSelect(value, { label, event })}
              selectedValue={value}
            />
          ))}
        </ul>
      );
    }
    return <ul>{childrenWithProps}</ul>;
  };

  const renderEmptyData = () => {
    if (typeof notFoundContent === 'function') {
      return notFoundContent();
    }
    return <p>无数据</p>;
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
        {renderEmptyData()}
      </div>
    );
  }
  return <div>{renderOptions()}</div>;
};

export default PopupContent;
