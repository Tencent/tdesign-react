import { isFunction } from 'util';
import React, { Children, isValidElement, cloneElement } from 'react';
import { getSelectValueArr } from '../util/helper';
import { PopupProps } from '../SelectProps';
import Option from './Option';

const PopupContent = (props: PopupProps) => {
  const { change, value, size, multiple, showPopup, setShowPopup, options, notFoundContent } = props;

  if (!props.children && !props.options) return null;

  const onSelect = (selectedValue: string | number, label?: string, selected?: boolean) => {
    if (selectedValue) {
      if (multiple) {
        const values = getSelectValueArr(value, selectedValue, label, selected);
        change(values);
      } else {
        change(selectedValue, label);
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
          {options.map((item, index) => (
            <Option
              key={index}
              label={item.label}
              value={item.value}
              onSelect={() => onSelect(item.value, item.label)}
              selectedValue={value}
            />
          ))}
        </ul>
      );
    }
    return <ul>{childrenWithProps}</ul>;
  };

  const renderEmptyData = () => {
    if (isFunction(notFoundContent)) {
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
