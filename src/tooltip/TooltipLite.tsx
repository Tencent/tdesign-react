import React, { ReactNode, useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { StyledProps } from '../common';
import useSwitch from '../_util/useSwitch';
import Portal from '../common/Portal';
import useConfig from '../hooks/useConfig';
import getPosition from '../_common/js/utils/getPosition';
import { TdTooltipLiteProps } from './type';
import { tooltipLiteDefaultProps } from './defaultProps';

export interface TooltipLiteProps extends TdTooltipLiteProps, StyledProps {
  children?: ReactNode;
}

const TooltipLite: React.FC<TooltipLiteProps> = (props) => {
  const { style, className, placement, showArrow, theme, children, triggerElement, content, showShadow } = props;
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const { classPrefix } = useConfig();
  const [hover, hoverAction] = useSwitch();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (triggerRef.current && contentRef.current) {
      setPosition(getPosition(triggerRef.current, contentRef.current, placement));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRef.current, contentRef.current, placement, hover]);

  const getTriggerChildren = (children) => {
    const appendProps = {
      ref: triggerRef,
      onMouseEnter: hoverAction.on,
      onMouseLeave: hoverAction.off,
    };

    const displayName = children.type?.displayName;
    // disable情况下button不响应mouse事件，但需要展示tooltip，所以要包裹一层
    if ((children.type === 'button' || displayName === 'Button') && children?.props?.disabled) {
      const displayStyle = children.props?.style?.display ? children.props.style.display : 'inline-block';
      const child = React.cloneElement(children, {
        ...appendProps,
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

    if (!React.isValidElement(children)) {
      return React.cloneElement(<div>{children}</div>, { ...appendProps });
    }
    return React.cloneElement(children, { ...appendProps });
  };

  return (
    <div>
      {getTriggerChildren(children || triggerElement)}
      {hover && (
        <Portal>
          <div
            className={classnames(
              `${classPrefix}-popup`,
              `${classPrefix}-tooltip`,
              {
                [`${classPrefix}-tooltip--${theme}`]: theme,
                [`${classPrefix}-tooltip--noshadow`]: !showShadow,
              },
              className,
            )}
            data-popper-placement={placement}
          >
            <div
              className={classnames(`${classPrefix}-popup__content`, {
                [`${classPrefix}-popup__content--arrow`]: showArrow,
              })}
              style={{
                position: 'absolute',
                left: position?.left,
                top: position?.top,
                ...style,
              }}
              ref={contentRef}
            >
              {content}
              {showArrow && <div className={`${classPrefix}-popup__arrow`} />}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

TooltipLite.displayName = 'Tooltiplite';
TooltipLite.defaultProps = tooltipLiteDefaultProps;

export default React.memo(TooltipLite);
