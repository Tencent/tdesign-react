import React, { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import classNames from 'classnames';
import { StyledProps } from '../common';
import { TdAffixProps } from './type';
import useConfig from '../hooks/useConfig';
import { affixDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { getScrollContainer } from '../_util/scroll';
import useEventCallback from '../hooks/useEventCallback';
import { getTargetRect } from '../_util/dom';
import { getFixedBottom, getFixedTop } from './utils';
import useResizeObserver from '../hooks/useResizeObserver';

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

interface AffixState {
  affixStyle?: React.CSSProperties;
  placeholderStyle?: React.CSSProperties;
}

export interface AffixProps extends TdAffixProps, StyledProps {}

export interface AffixRef {
  handleScroll: () => void;
}

const Affix = forwardRef<AffixRef, AffixProps>((props, ref) => {
  const {
    children,
    content,
    zIndex,
    container,
    offsetBottom,
    offsetTop,
    className,
    style,
    onFixedChange,
    ...restProps
  } = useDefaultProps(props, affixDefaultProps);

  const { classPrefix } = useConfig();

  const [affixStyle, setAffixStyle] = useState<React.CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>();

  const placeholderNodeRef = useRef<HTMLDivElement>(null);
  const fixedNodeRef = useRef<HTMLDivElement>(null);

  const scrollContainer = container ?? getDefaultTarget;

  const internalOffsetTop = offsetBottom === undefined && offsetTop === undefined ? 0 : offsetTop;

  const measure = () => {
    if (!fixedNodeRef.current || !placeholderNodeRef.current || !scrollContainer) {
      return;
    }

    const targetNode = getScrollContainer(scrollContainer);
    if (targetNode) {
      const newState: Partial<AffixState> = {};
      const placeholderRect = getTargetRect(placeholderNodeRef.current);

      if (
        placeholderRect.top === 0 &&
        placeholderRect.left === 0 &&
        placeholderRect.width === 0 &&
        placeholderRect.height === 0
      ) {
        return;
      }

      const targetRect = getTargetRect(targetNode);
      const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop);
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);
      let top = 0;
      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderRect.width,
          height: placeholderRect.height,
          zIndex,
        };
        newState.placeholderStyle = {
          width: placeholderRect.width,
          height: placeholderRect.height,
        };
        top = fixedTop;
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderRect.width,
          height: placeholderRect.height,
          zIndex,
        };
        newState.placeholderStyle = {
          width: placeholderRect.width,
          height: placeholderRect.height,
        };
        top = fixedBottom;
      }

      setAffixStyle(newState.affixStyle);
      setPlaceholderStyle(newState.placeholderStyle);
      onFixedChange?.(!!newState.affixStyle, {
        top,
      });
    }
  };

  const onScroll = useEventCallback(() => {
    measure();
  });

  useResizeObserver(placeholderNodeRef, measure);

  useResizeObserver(fixedNodeRef, measure);

  useEffect(() => {
    const scrollContainer = getScrollContainer(container);
    if (scrollContainer) {
      onScroll();
      scrollContainer.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }
  }, [container, onScroll]);

  useImperativeHandle(ref, () => ({
    handleScroll: onScroll,
  }));

  const rootCls = classNames(`${classPrefix}-affix`);

  const mergedCls = classNames({ [rootCls]: affixStyle });

  return (
    <div style={style} className={className} ref={placeholderNodeRef} {...restProps}>
      {affixStyle && <div style={placeholderStyle} aria-hidden="true" />}
      <div className={mergedCls} ref={fixedNodeRef} style={affixStyle}>
        {children || content}
      </div>
    </div>
  );
});

Affix.displayName = 'Affix';

export default Affix;
