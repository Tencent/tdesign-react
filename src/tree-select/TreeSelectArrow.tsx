import classNames from 'classnames';
import React from 'react';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../_util/useConfig';

interface TreeSelectArrowProps {
  isActive: boolean;
  isHighlight: boolean;
  disabled: boolean;
}

export const TreeSelectArrow = ({ isActive, isHighlight, disabled }: TreeSelectArrowProps) => {
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
