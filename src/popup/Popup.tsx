import React, { forwardRef, useState, useRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { CSSTransition } from 'react-transition-group';
import isFunction from 'lodash/isFunction';
import debounce from 'lodash/debounce';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';
import useControlled from '../hooks/useControlled';
import useAnimation from '../_util/useAnimation';
import useConfig from '../hooks/useConfig';
import usePrevious from '../hooks/usePrevious';
import { TdPopupProps } from './type';
import Portal from '../common/Portal';
import useTrigger from './hooks/useTrigger';
import { getRefDom } from './utils/ref';
import { getTransitionParams } from './utils/transition';
import useMutationObserver from '../_util/useMutationObserver';
import useWindowSize from '../_util/useWindowSize';
import { popupDefaultProps } from './defaultProps';

export interface PopupProps extends TdPopupProps {
  // 是否触发展开收起动画，内部下拉式组件使用
  expandAnimation?: boolean;
  // 更新内容区域滚动条
  updateScrollTop?: (content: HTMLDivElement) => void;
}

export interface PopupRef {
  // 获取popper实例
  getPopper: () => ReturnType<typeof usePopper>;
  // 获取Popup dom元素
  getPopupElement: () => HTMLDivElement;
  // 获取portal dom元素
  getPortalElement: () => HTMLDivElement;
}

const Popup = forwardRef((props: PopupProps, ref: React.RefObject<PopupRef>) => {
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
    onScrollToBottom,
    expandAnimation,
    delay,
    hideEmptyPopup,
    popperOptions,
    updateScrollTop,
  } = props;
  const { classPrefix } = useConfig();

  // 全局配置
  const { keepExpand, keepFade } = useAnimation();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const [visible, onVisibleChange] = useControlled(props, 'visible', props.onVisibleChange);
  const prevVisible = usePrevious(visible);

  const [popupElement, setPopupElement] = useState(null);
  const triggerRef = useRef(null); // 记录 trigger 元素
  const popupRef = useRef(null); // popup dom 元素，css transition 需要用
  const portalRef = useRef(null); // portal dom 元素
  const contentRef = useRef(null); // 内容部分
  const popperRef = useRef(null); // 保存 popper 实例

  // 默认动画时长
  const DEFAULT_TRANSITION_TIMEOUT = 180;

  // 判断展示浮层
  const showOverlay = useMemo(() => {
    if (hideEmptyPopup && !content) return false;
    return visible || popupElement;
  }, [hideEmptyPopup, content, visible, popupElement]);

  // 转化 placement
  const popperPlacement = useMemo(
    () => placement.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end') as Placement,
    [placement],
  );

  const { getTriggerNode, getPopupProps, getTriggerDom } = useTrigger({
    triggerRef,
    content,
    disabled,
    trigger,
    visible,
    delay,
    onVisibleChange,
  });

  popperRef.current = usePopper(getRefDom(triggerRef), popupElement, {
    placement: popperPlacement,
    ...popperOptions,
  });
  const { styles, attributes } = popperRef.current;

  const triggerNode = isFunction(children) ? getTriggerNode(children({ visible })) : getTriggerNode(children);

  const updateTimeRef = useRef(null);
  // 监听 trigger 节点或内容变化动态更新 popup 定位
  useMutationObserver(getRefDom(triggerRef), () => {
    clearTimeout(updateTimeRef.current);
    updateTimeRef.current = setTimeout(() => popperRef.current?.update?.(), 0);
  });
  useEffect(() => () => clearTimeout(updateTimeRef.current), []);

  // 窗口尺寸变化时调整位置
  useEffect(() => {
    requestAnimationFrame(() => popperRef.current?.update?.());
  }, [visible, content, windowHeight, windowWidth]);

  // 下拉展开时更新内部滚动条
  useEffect(() => {
    if (!triggerRef.current) triggerRef.current = getTriggerDom();
    if (prevVisible !== visible && visible) {
      updateScrollTop?.(contentRef.current);
    }
  }, [visible, prevVisible, updateScrollTop, getTriggerDom]);

  function handleExited() {
    !destroyOnClose && popupElement && (popupElement.style.display = 'none');
  }
  function handleEnter() {
    !destroyOnClose && popupElement && (popupElement.style.display = 'block');
  }

  function handleScroll(e: React.WheelEvent<HTMLDivElement>) {
    onScroll?.({ e });

    // 防止多次触发添加截流
    const debounceOnScrollBottom = debounce((e) => onScrollToBottom?.({ e }), 100);

    const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLDivElement;
    // windows 下滚动会出现小数，所以这里取整
    if (clientHeight + Math.floor(scrollTop) === scrollHeight) {
      // touch bottom
      debounceOnScrollBottom(e);
    }
  }

  // 整理浮层样式
  function getOverlayStyle(overlayStyle: TdPopupProps['overlayStyle']) {
    if (getRefDom(triggerRef) && popupRef.current && typeof overlayStyle === 'function') {
      return { ...overlayStyle(getRefDom(triggerRef), popupRef.current) };
    }
    return { ...overlayStyle };
  }

  const overlay = showOverlay && (
    <CSSTransition
      appear
      in={visible}
      timeout={DEFAULT_TRANSITION_TIMEOUT}
      nodeRef={portalRef}
      unmountOnExit={destroyOnClose}
      onEnter={handleEnter}
      onExited={handleExited}
    >
      <Portal triggerNode={getRefDom(triggerRef)} attach={attach} ref={portalRef}>
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
              onScroll={handleScroll}
            >
              {content}
              {showArrow ? <div style={styles.arrow} className={`${classPrefix}-popup__arrow`} /> : null}
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
    getPopupContentElement: () => contentRef.current,
    setVisible: (visible: boolean) => onVisibleChange(visible, { trigger: 'document' }),
  }));

  return (
    <React.Fragment>
      {triggerNode}
      {overlay}
    </React.Fragment>
  );
});

Popup.displayName = 'Popup';
Popup.defaultProps = popupDefaultProps;

export default Popup;
