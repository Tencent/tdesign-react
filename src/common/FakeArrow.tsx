import React from 'react';
import classNames from 'classnames';
import { ClassName } from '../common';

import useConfig from '../hooks/useConfig';

// 翻转箭头统一组件
function FakeArrow(props: {
  className?: ClassName;
  isActive?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const { classPrefix } = useConfig();
  return (
    <svg
      style={props.style}
      className={classNames(
        `${classPrefix}-fake-arrow`,
        {
          [`${classPrefix}-fake-arrow--active`]: props?.isActive && !props?.disabled,
        },
        props?.className,
      )}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.75 5.7998L7.99274 10.0425L12.2361 5.79921" stroke="black" strokeOpacity="0.9" strokeWidth="1.3" />
    </svg>
  );
}

export default FakeArrow;
