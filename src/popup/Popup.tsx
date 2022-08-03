import React, {
  forwardRef,
  CSSProperties,
  useState,
  cloneElement,
  isValidElement,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';
import { StyledProps } from '../common';
import useControlled from '../hooks/useControlled';
import useAnimation from '../_util/useAnimation';
import useConfig from '../hooks/useConfig';
import composeRefs from '../_util/composeRefs';
import { TdPopupProps } from './type';
import Portal from '../common/Portal';
import useTriggerProps from './hooks/useTriggerProps';
import getTransitionParams from './utils/getTransitionParams';
import useMutationObserver from '../_util/useMutationObserver';
import useWindowSize from '../_util/useWindowSize';
import { popupDefaultProps } from './defaultProps';

export interface PopupProps extends TdPopupProps, StyledProps {
  // 是否触发展开收起动画，内部下拉式组件使用
  expandAnimation?: boolean;
  // 初始化 popper 的可定制 option
  popperModifiers?: Array<{ name: string; options: Object }>;
  updateScrollTop?: (content: HTMLDivElement) => void;
}

function getPopperPlacement(placement: TdPopupProps['placement']) {
  return placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement;
}

const Popup = forwardRef((props: PopupProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    trigger,
    content,
    placement,
    attach,
    showArrow,
    destroyOnClose,
    className,
    style,
    overlayClassName,
    overlayStyle,
    triggerElement,
    children = triggerElement,
    disabled,
    zIndex,
    onVisibleChange,
    onScroll,
    expandAnimation,
    popperModifiers = [],
    updateScrollTop,
  } = props;
  const { classPrefix } = useConfig();

  // 全局配置
  const { keepExpand, keepFade } = useAnimation();

  const [visible, setVisible] = useControlled(props, 'visible', onVisibleChange);

  const { height: windowHeight, width: windowWidth } = useWindowSize();

  // refs
  const [triggerRef, setTriggerRef] = useState<HTMLElement>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const referenceRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef(null);

  const popperRef = useRef(null);
  const portalRef = useRef(null);

  // 展开时候动态判断上下左右翻转
  const onPopperFirstUpdate = useCallback((state) => {
    const referenceElmRect = referenceRef.current.getBoundingClientRect();
    const { top: referenceElmTop, left: referenceElmLeft, bottom, right } = referenceElmRect;
    const referenceElmBottom = window.innerHeight - bottom;
    const referenceElmRight = window.innerWidth - right;

    const { offsetHeight: contentOffsetHeight, offsetWidth: contentOffsetWidth } = contentRef.current;

    let newPlacement = state.options.placement;
    // 底部不够向上翻转
    if (referenceElmBottom < contentOffsetHeight && referenceElmTop >= contentOffsetHeight) {
      newPlacement = state.options.placement.replace('bottom', 'top');
    }
    // 顶部不够向下翻转
    if (referenceElmTop < contentOffsetHeight && referenceElmBottom >= contentOffsetHeight) {
      newPlacement = state.options.placement.replace('top', 'bottom');
    }
    // 左侧不够向右翻转
    if (referenceElmLeft < contentOffsetWidth && referenceElmRight >= contentOffsetWidth) {
      newPlacement = state.options.placement.replace('left', 'right');
    }
    // 右侧不够向左翻转
    if (referenceElmRight < contentOffsetWidth && referenceElmLeft >= contentOffsetWidth) {
      newPlacement = state.options.placement.replace('right', 'left');
    }
    Object.assign(state.options, { ...state.options, placement: newPlacement });
    popperRef.current.update();
  }, []);

  const options = useMemo(
    () => ({
      placement: getPopperPlacement(placement),
      onFirstUpdate: onPopperFirstUpdate,
      modifiers: popperModifiers,
    }),
    [onPopperFirstUpdate, placement, popperModifiers],
  );

  popperRef.current = usePopper(triggerRef, overlayRef, options);

  const { styles, attributes } = popperRef.current;
  const defaultStyles = useMemo(() => {
    if (triggerRef && typeof overlayStyle === 'function') return { ...overlayStyle(triggerRef, overlayRef) };
    return { ...overlayStyle };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayStyle, triggerRef, overlayRef, visible]);

  // 设置 style 决定展示与隐藏
  const overlayVisibleStyle: CSSProperties = defaultStyles;

  const triggerNodeTemp = useMemo(() => {
    const [triggerChildNode] = React.Children.toArray(children);

    if (React.Children.count(children) === 1 && isValidElement(triggerChildNode)) {
      return triggerChildNode;
    }
    return <span className={`${classPrefix}-trigger`}>{children}</span>;
  }, [children, classPrefix]);

  const [triggerProps, popupProps] = useTriggerProps(
    { current: overlayRef },
    { current: triggerRef },
    [trigger],
    visible,
    setVisible,
    disabled,
    triggerNodeTemp,
    content,
  );

  // 代理 trigger 的 ref
  const triggerNode = cloneElement(triggerNodeTemp, {
    ref: composeRefs((triggerNodeTemp as any).ref, setTriggerRef),
    ...triggerProps,
  });

  const handleExited = () => {
    if (!destroyOnClose) {
      portalRef.current.style.display = 'none';
    }
  };
  const handleEnter = () => {
    if (!destroyOnClose) {
      portalRef.current.style.display = 'block';
    }
  };

  // 监听 trigger 节点或内容变化动态更新 popup 定位
  useMutationObserver(triggerRef, () => {
    popperRef.current.update?.();
  });
  useEffect(() => {
    popperRef.current.update?.();
  }, [content, visible, windowHeight, windowWidth]);

  useEffect(() => {
    if (visible && overlayRef) {
      updateScrollTop?.(contentRef?.current);
    }
  }, [visible, overlayRef, updateScrollTop]);

  // 初次不渲染.
  const portal =
    visible || overlayRef ? (
      <CSSTransition
        appear
        in={visible}
        timeout={180}
        nodeRef={popupRef}
        unmountOnExit={destroyOnClose}
        onEnter={handleEnter}
        onExited={handleExited}
      >
        <Portal triggerNode={triggerRef} attach={attach} ref={portalRef}>
          <CSSTransition
            appear
            timeout={0}
            in={visible}
            nodeRef={popupRef}
            {...getTransitionParams({
              classPrefix,
              expandAnimation: expandAnimation && keepExpand,
              fadeAnimation: keepFade,
            })}
          >
            <div
              ref={composeRefs(setOverlayRef, ref, popupRef)}
              style={{ ...styles.popper, zIndex }}
              className={`${classPrefix}-popup`}
              {...attributes.popper}
              {...popupProps}
            >
              <div
                className={classNames(
                  `${classPrefix}-popup__content`,
                  {
                    [`${classPrefix}-popup__content--arrow`]: showArrow,
                  },
                  overlayClassName,
                )}
                style={overlayVisibleStyle}
                ref={contentRef}
                onScroll={(e) => onScroll?.({ e: e as React.WheelEvent<HTMLDivElement> })}
              >
                {showArrow ? <div style={styles.arrow} className={`${classPrefix}-popup__arrow`} /> : null}
                {content}
              </div>
            </div>
          </CSSTransition>
        </Portal>
      </CSSTransition>
    ) : null;

  return (
    <div className={classNames(`${classPrefix}-popup__reference`, className)} style={style} ref={referenceRef}>
      {triggerNode}
      {portal}
    </div>
  );
});

Popup.displayName = 'Popup';
Popup.defaultProps = popupDefaultProps;

export default Popup;
