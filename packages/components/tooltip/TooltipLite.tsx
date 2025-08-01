import classnames from 'classnames';
import { throttle } from 'lodash-es';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import getPosition from '@tdesign/common-js/utils/getPosition';
import { StyledProps } from '../common';
import Portal from '../common/Portal';
import useAnimation from '../hooks/useAnimation';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useSwitch from '../hooks/useSwitch';
import { getTransitionParams } from '../popup/utils/transition';
import { tooltipLiteDefaultProps } from './defaultProps';
import type { TdTooltipLiteProps } from './type';

export interface TooltipLiteProps extends TdTooltipLiteProps, StyledProps {
  children?: ReactNode;
  zIndex?: number;
}

const DEFAULT_TRANSITION_TIMEOUT = 180;

const TooltipLite: React.FC<TooltipLiteProps> = (originalProps) => {
  const props = useDefaultProps<TooltipLiteProps>(originalProps, tooltipLiteDefaultProps);
  const { style, className, placement, showArrow, theme, children, triggerElement, content, showShadow } = props;
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const popupRef = useRef(null);
  const { classPrefix } = useConfig();
  const [hover, hoverAction] = useSwitch();
  const [clientX, setHoverClientX] = useState(0);
  const [clientY, setHoverClientY] = useState(0);
  const [position, setPosition] = useState(null);
  const { keepFade } = useAnimation();

  useEffect(() => {
    if (triggerRef.current && contentRef.current) {
      setPosition(getPosition(triggerRef.current, contentRef.current, placement, clientX, clientY));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRef.current, contentRef.current, placement, hover, clientX, clientY]);

  const updatePosition = (position: Pick<MouseEvent, 'clientX' | 'clientY'>) => {
    const { clientX, clientY } = position;
    setHoverClientX(clientX);
    setHoverClientY(clientY);
  };

  const onSwitchHover = (action: String, e: MouseEvent) => {
    const { clientX, clientY } = e;
    updatePosition({ clientX, clientY });
    hoverAction.set(action === 'on');
  };

  const showTipArrow = showArrow && placement !== 'mouse';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSwitchMove = useCallback(
    throttle((e) => updatePosition(e), 16.7, { trailing: true }),
    [],
  );

  const getTriggerChildren = (children: ReactNode) => {
    const appendProps = {
      ref: triggerRef,
      onMouseMove: (e: MouseEvent) => {
        const { clientX, clientY } = e;
        return onSwitchMove({ clientX, clientY });
      },
      onMouseEnter: (e: MouseEvent) => onSwitchHover('on', e),
      onMouseLeave: (e: MouseEvent) => onSwitchHover('off', e),
    };
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
          <CSSTransition
            appear
            timeout={{
              appear: DEFAULT_TRANSITION_TIMEOUT,
            }}
            in={hover}
            nodeRef={popupRef}
            {...getTransitionParams({
              classPrefix,
              fadeAnimation: keepFade,
            })}
          >
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
              style={{
                position: 'absolute',
                left: position?.left,
                top: position?.top,
                zIndex: props.zIndex,
              }}
              data-popper-placement={placement}
              ref={popupRef}
            >
              <div
                className={classnames(`${classPrefix}-popup__content`, {
                  [`${classPrefix}-popup__content--arrow`]: showTipArrow,
                })}
                ref={contentRef}
                style={style}
              >
                {content}
                {showTipArrow && <div className={`${classPrefix}-popup__arrow`} />}
              </div>
            </div>
          </CSSTransition>
        </Portal>
      )}
    </div>
  );
};

TooltipLite.displayName = 'Tooltiplite';

export default React.memo(TooltipLite);
