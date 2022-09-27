import React, { cloneElement } from 'react';

const wrapDisabledButton = (children, appendProps = {}) => {
  // disable情况下button不响应mouse事件，但需要展示tooltip，所以要包裹一层
  if (children.type === 'button' && children?.props?.disabled) {
    const displayStyle = children.props?.style?.display ? children.props.style.display : 'inline-block';
    const child = cloneElement(children, {
      style: {
        ...children?.props?.style,
        pointerEvents: 'none',
      },
    });
    return (
      <span {...appendProps} style={{ display: displayStyle, cursor: 'not-allowed' }}>
        {child}
      </span>
    );
  }
  return null;
};

export default wrapDisabledButton;
