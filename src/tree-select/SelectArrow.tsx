import classNames from 'classnames';
import React from 'react';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../_util/useConfig';

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
      overlayClassName={classNames({
        [`${classPrefix}-fake-arrow--highlight`]: isHighlight,
        [`${classPrefix}-fake-arrow--disable`]: disabled,
      })}
    />
  );
};
