import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';
import useControlled from '../hooks/useControlled';
import useAnimation from '../_util/useAnimation';
import useConfig from '../hooks/useConfig';
import { TdPopupProps } from './type';
import Portal from '../common/Portal';
import useTrigger from './hooks/useTrigger';
import { getTransitionParams } from './utils/transition';
import useMutationObserver from '../_util/useMutationObserver';
import useWindowSize from '../_util/useWindowSize';
import { popupDefaultProps } from './defaultProps';

export interface PopupProps extends TdPopupProps {
  // 是否触发展开收起动画，内部下拉式组件使用
  expandAnimation?: boolean;
  // 初始化 popper 的可定制 option
  popperModifiers?: Array<{ name: string; options: Object }>;
  // 更新内容区域滚动条
  updateScrollTop?: (content: HTMLDivElement) => void;
}

function getPopperPlacement(placement: TdPopupProps['placement']) {
  return placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement;
}

const Popup = forwardRef((props: PopupProps, ref) => {
  const {
    trigger,
    content,
    placement,
    attach,
    showArrow,
    destroyOnClose,
    overlayClassName,
    overlayInnerClassName,
    overlayStyle,
    overlayInnerStyle,
    triggerElement,
    children = triggerElement,
    disabled,
    zIndex,
    onScroll,
    expandAnimation,
    popperModifiers = [],
    updateScrollTop,
  } = props;
  const { classPrefix } = useConfig();

  // 全局配置
  const { keepExpand, keepFade } = useAnimation();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const [visible, onVisibleChange] = useControlled(props, 'visible', props.onVisibleChange);

  const [popupElement, setPopupElement] = useState(null);
  const triggerRef = useRef(null); // 记录 trigger 元素
  const popupRef = useRef(null); // popup dom 元素，css transition 需要用
  const portalRef = useRef(null); // portal dom 元素
  const contentRef = useRef(null); // 内容部分
  const popperRef = useRef(null); // 保存 popper 实例

  const { getTriggerNode, getPopupProps, getTriggerDom } = useTrigger({
    triggerRef,
    content,
    disabled,
    trigger,
    visible,
    onVisibleChange,
  });

  const triggerNode = getTriggerNode(children);

  // 监听 trigger 节点或内容变化动态更新 popup 定位
  useMutationObserver(triggerRef.current, () => {
    popperRef.current?.update?.();
  });

  // 窗口尺寸变化时调整位置
  useEffect(() => {
    popperRef.current?.update?.();
  }, [visible, content, windowHeight, windowWidth]);

  // 下拉展开时更新内部滚动条
  useEffect(() => {
    if (!triggerRef.current) triggerRef.current = getTriggerDom();
    visible && updateScrollTop?.(contentRef.current);
  }, [visible, updateScrollTop, getTriggerDom]);

  function handleExited() {
    !destroyOnClose && popupElement && (popupElement.style.display = 'none');
  }
  function handleEnter() {
    !destroyOnClose && popupElement && (popupElement.style.display = 'block');
  }

  const popperOptions = {
    modifiers: popperModifiers,
    placement: getPopperPlacement(placement),
  };
  popperRef.current = usePopper(triggerRef.current, popupElement, popperOptions);
  const { styles, attributes } = popperRef.current;

  // 整理浮层样式
  function getOverlayStyle(overlayStyle: TdPopupProps['overlayStyle']) {
    if (triggerRef.current && popupRef.current && typeof overlayStyle === 'function') {
      return { ...overlayStyle(triggerRef.current, popupRef.current) };
    }
    return { ...overlayStyle };
  }

  const portal = (visible || popupElement) && (
    <CSSTransition
      appear
      in={visible}
      timeout={180}
      nodeRef={portalRef}
      unmountOnExit={destroyOnClose}
      onEnter={handleEnter}
      onExited={handleExited}
    >
      <Portal triggerNode={triggerRef.current} attach={attach} ref={portalRef}>
        <CSSTransition
          appear
          timeout={0}
          in={visible}
          nodeRef={popupRef}
          {...getTransitionParams({
            classPrefix,
            fadeAnimation: keepFade,
            expandAnimation: expandAnimation && keepExpand,
          })}
        >
          <div
            ref={(node) => {
              if (node) {
                popupRef.current = node;
                setPopupElement(node);
              }
            }}
            style={{ ...styles.popper, zIndex, ...getOverlayStyle(overlayStyle) }}
            className={classNames(`${classPrefix}-popup`, overlayClassName)}
            {...attributes.popper}
            {...getPopupProps()}
          >
            <div
              ref={contentRef}
              className={classNames(
                `${classPrefix}-popup__content`,
                {
                  [`${classPrefix}-popup__content--arrow`]: showArrow,
                },
                overlayInnerClassName,
              )}
              style={getOverlayStyle(overlayInnerStyle)}
              onScroll={(e) => onScroll?.({ e: e as React.WheelEvent<HTMLDivElement> })}
            >
              {showArrow ? <div style={styles.arrow} className={`${classPrefix}-popup__arrow`} /> : null}
              {content}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    </CSSTransition>
  );

  useImperativeHandle(ref, () => ({
    getPopper: () => popperRef.current,
    getPopupElement: () => popupRef.current,
    getPortalElement: () => portalRef.current,
  }));

  return (
    <React.Fragment>
      {triggerNode}
      {portal}
    </React.Fragment>
  );
});

Popup.displayName = 'Popup';
Popup.defaultProps = popupDefaultProps;

export default Popup;
