import classNames from 'classnames';
import React from 'react';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../hooks/useConfig';

interface SelectArrowProps {
  isActive: boolean;
  isHighlight: boolean;
  disabled: boolean;
}

export const SelectArrow = ({ isActive, isHighlight, disabled }: SelectArrowProps) => {
  const { classPrefix } = useConfig();
  return (
    <FakeArrow
      isActive={isActive}
      disabled={disabled}
      className={classNames({
        [`${classPrefix}-fake-arrow--highlight`]: isHighlight,
        [`${classPrefix}-fake-arrow--disable`]: disabled,
      })}
    />
  );
};
