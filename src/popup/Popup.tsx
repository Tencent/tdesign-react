import React, {
  forwardRef,
  CSSProperties,
  useState,
  cloneElement,
  isValidElement,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import Popper from '@popperjs/core';
import { StyledProps } from '../common';
import useDefault from '../_util/useDefault';
import useConfig from '../_util/useConfig';
import composeRefs from '../_util/composeRefs';
import { TdPopupProps } from './type';
import Portal from './Portal';
import useTriggerProps from './hooks/useTriggerProps';
import usePopupCssTransition from './hooks/usePopupCssTransition';

export interface PopupProps extends TdPopupProps, StyledProps {
  // 是否触发展开收起动画，内部下拉式组件使用
  expandAnimation?: boolean;
}

/**
 * 修复参数对齐popper.js 组件展示方向，与TD组件定义有差异
 */
type PlacementDictionary = {
  [Key in TdPopupProps['placement']]: Popper.Placement;
};

const placementMap: PlacementDictionary = {
  top: 'top',
  'top-left': 'top-start',
  'top-right': 'top-end',
  bottom: 'bottom',
  'bottom-left': 'bottom-start',
  'bottom-right': 'bottom-end',
  left: 'left',
  'left-top': 'left-start',
  'left-bottom': 'left-end',
  right: 'right',
  'right-top': 'right-start',
  'right-bottom': 'right-end',
};

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
  const {
    trigger = 'hover',
    content = null,
    placement = 'top',
    attach = 'body',
    showArrow = false,
    destroyOnClose = false,
    className,
    style,
    overlayClassName,
    overlayStyle,
    triggerElement,
    children = triggerElement,
    disabled,
    defaultVisible = false,
    zIndex,
    onVisibleChange,
    expandAnimation,
  } = props;
  const { classPrefix } = useConfig();
  const [visible, setVisible] = useDefault(props.visible, defaultVisible, onVisibleChange);

  // refs
  const [triggerRef, setTriggerRef] = useState<HTMLElement>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef(null);
  const popperRef = useRef(null);

  // 展开时候动态判断上下左右翻转
  const onPopperFirstUpdate = useCallback((state) => {
    const referenceElmRect = popupRef.current.getBoundingClientRect();
    const { top: referenceElmTop, left: referenceElmLeft, bottom, right } = referenceElmRect;
    const referenceElmBottom = window.innerHeight - bottom;
    const referenceElmRight = window.innerWidth - right;

    const { scrollHeight: contentScrollHeight, offsetWidth: contentOffsetWidth } = contentRef.current;

    let newPlacement = state.options.placement;
    // 底部不够向上翻转
    if (referenceElmBottom < contentScrollHeight && referenceElmTop >= contentScrollHeight) {
      newPlacement = state.options.placement.replace('bottom', 'top');
    }
    // 顶部不够向下翻转
    if (referenceElmTop < contentScrollHeight && referenceElmBottom >= contentScrollHeight) {
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

  popperRef.current = usePopper(triggerRef, overlayRef, {
    placement: placementMap[placement],
    onFirstUpdate: onPopperFirstUpdate,
  });

  const { styles, attributes } = popperRef.current;

  const defaultStyles = useMemo(() => {
    if (triggerRef && typeof overlayStyle === 'function') return { ...overlayStyle(triggerRef), zIndex };
    return { ...overlayStyle, zIndex };
  }, [overlayStyle, zIndex, triggerRef]);

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
  );

  // 触发器只能有一个元素
  const disabledClassName = classNames({ [`${classPrefix}-is-disabled`]: disabled });

  // 代理 trigger 的 ref
  const triggerNode = cloneElement(triggerNodeTemp, {
    ref: composeRefs((triggerNodeTemp as any).ref, setTriggerRef),
    className: classNames(disabledClassName, triggerNodeTemp.props.className),
    ...triggerProps,
  });

  const cssTransitionState = usePopupCssTransition({ contentRef, classPrefix, expandAnimation });

  // 初次不渲染.
  const portal =
    visible || overlayRef ? (
      <Portal attach={attach}>
        <CSSTransition in={visible} appear={true} unmountOnExit={destroyOnClose} {...cssTransitionState.props}>
          <div
            ref={composeRefs(setOverlayRef, ref)}
            style={styles.popper}
            className={`${classPrefix}-popup`}
            {...attributes.popper}
            {...popupProps}
          >
            <div
              className={classNames(`${classPrefix}-popup__content`, overlayClassName, {
                [`${classPrefix}-popup__content--arrow`]: showArrow,
              })}
              style={overlayVisibleStyle}
              ref={contentRef}
            >
              {showArrow ? <div style={styles.arrow} className={`${classPrefix}-popup__arrow`} /> : null}
              {content}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    ) : null;

  return (
    <div className={classNames(`${classPrefix}-popup__reference`, className)} style={style} ref={popupRef}>
      {triggerNode}
      {portal}
    </div>
  );
});

Popup.displayName = 'Popup';

export default Popup;
