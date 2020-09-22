import React, { Children, isValidElement, cloneElement } from 'react';

const OptionGroup = (props: any) => {
  const { children, label, selectedValue, onSelect } = props;
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      const addedProps = { selectedValue, onSelect };
      return cloneElement(child, { ...addedProps });
    }
    return child;
  });

  return (
    <>
      <ul className="t-option-group-header">{label}</ul>
      <ul>{childrenWithProps}</ul>
    </>
  );
};

export default OptionGroup;
