import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Placement, type Options } from '@popperjs/core';
import classNames from 'classnames';
import { debounce, isFunction } from 'lodash-es';

import { getCssVarsValue } from '../_util/style';
import Portal from '../common/Portal';
import useAnimation from '../hooks/useAnimation';
import useAttach from '../hooks/useAttach';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useMutationObserver from '../hooks/useMutationObserver';
import usePopper, { type InnerPopperInstance } from '../hooks/usePopper';
import useWindowSize from '../hooks/useWindowSize';
import { popupDefaultProps } from './defaultProps';
import useTrigger from './hooks/useTrigger';
import { getTransitionParams } from './utils/transition';

import type { PopupInstanceFunctions, TdPopupProps } from './type';

export interface PopupProps extends TdPopupProps {
  // 是否触发展开收起动画，内部下拉式组件使用
  expandAnimation?: boolean;
  // 更新内容区域滚动条
  updateScrollTop?: (content: HTMLDivElement) => void;
}

export interface PopupRef extends PopupInstanceFunctions {
  /** @internal 获取 Popup DOM 元素 */
  getPopupElement: () => HTMLDivElement;
  /** @internal 获取 Portal DOM 元素 */
  getPortalElement: () => HTMLDivElement;
  /** @internal 获取内容区域 DOM 元素 */
  getPopupContentElement: () => HTMLDivElement;
  /** @internal 设置 Popup 显示隐藏 */
  setVisible: (visible: boolean) => void;
}

// 默认动画时长
const DEFAULT_TRANSITION_TIMEOUT = 180;

const Popup = forwardRef<PopupInstanceFunctions, PopupProps>((originalProps, ref) => {
  const props = useDefaultProps<PopupProps>(originalProps, popupDefaultProps);
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
    updateScrollTop,
  } = props;
  const { classPrefix } = useConfig();
  const popupAttach = useAttach('popup', attach);

  // 全局配置
  const { keepExpand, keepFade } = useAnimation();
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const [visible, onVisibleChange] = useControlled(props, 'visible', props.onVisibleChange);

  const [isOverlayHover, setIsOverlayHover] = useState(false);
  const [popupElement, setPopupElement] = useState<HTMLDivElement>(null);

  const popupRef = useRef<HTMLDivElement>(null); // popup dom 元素，css transition 需要用
  const portalRef = useRef(null); // portal dom 元素
  const contentRef = useRef<HTMLDivElement>(null); // 内容部分
  const popperRef = useRef<InnerPopperInstance>(null); // 保存 popper 实例

  // 处理切换 panel 为 null 和正常内容动态切换的情况
  useEffect(() => {
    if (!content && hideEmptyPopup) {
      requestAnimationFrame(() => setPopupElement(null));
    }
  }, [content, hideEmptyPopup]);

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

  const { triggerElementIsString, getTriggerElement, getTriggerNode } = useTrigger({
    triggerElement,
    content,
    disabled,
    trigger,
    visible,
    delay,
    onVisibleChange,
  });
  const triggerEl = getTriggerElement();

  const popperOptions = useMemo(() => {
    const baseOptions = { ...(props.popperOptions as Options) };
    const modifiers = baseOptions.modifiers || [];
    const hasArrowModifiers = modifiers.some((m) => m.name === 'arrow');
    // https://popper.js.org/docs/v2/modifiers/arrow/
    if (showArrow && !hasArrowModifiers) {
      modifiers.push({ name: 'arrow' });
    }
    return {
      ...baseOptions,
      modifiers,
    };
  }, [props.popperOptions, showArrow]);

  popperRef.current = usePopper(triggerEl, popupElement, {
    placement: popperPlacement,
    ...popperOptions,
  });

  const { styles, attributes } = popperRef.current;

  const triggerNode = isFunction(children) ? getTriggerNode(children({ visible })) : getTriggerNode(children);

  const updateTimeRef = useRef(null);
  // 监听 trigger 节点或内容变化动态更新 popup 定位
  useMutationObserver(triggerEl, () => {
    const isDisplayNone = getCssVarsValue('display', triggerEl) === 'none';
    if (visible && !isDisplayNone) {
      clearTimeout(updateTimeRef.current);
      updateTimeRef.current = setTimeout(() => popperRef.current?.update?.(), 0);
    }
  });
  useEffect(() => () => clearTimeout(updateTimeRef.current), []);

  // 窗口尺寸变化时调整位置
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => popperRef.current?.update?.());
    }
  }, [visible, content, windowHeight, windowWidth]);

  // 下拉展开时更新内部滚动条
  useEffect(() => {
    if (visible && popupElement) {
      updateScrollTop?.(contentRef.current);
    }
  }, [visible, popupElement, updateScrollTop]);

  function handleExited() {
    setIsOverlayHover(false);
    !destroyOnClose && popupElement && (popupElement.style.display = 'none');
  }
  function handleEnter() {
    setIsOverlayHover(true);
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
    if (triggerEl && popupRef.current && typeof overlayStyle === 'function') {
      return { ...overlayStyle(triggerEl, popupRef.current) };
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
      <Portal triggerNode={triggerEl} attach={popupAttach} ref={portalRef}>
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
            onClick={(e) => props.onOverlayClick?.({ e })}
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
              {showArrow && (
                <div
                  style={styles.arrow}
                  className={`${classPrefix}-popup__arrow`}
                  {...(showArrow && { 'data-popper-arrow': '' })}
                />
              )}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    </CSSTransition>
  );

  // 处理 shadow root（web component）和 trigger 隐藏的情况
  function updatePopper() {
    const popper = popperRef.current;
    // 如果没有渲染弹层或不可见则不触发更新
    if (!popper || !visible) return;

    try {
      // web component 的元素可能在 shadow root 内，需要特殊处理
      const root = triggerEl?.getRootNode();
      if (root && root instanceof ShadowRoot) {
        // popper 的实例内部结构可能是 state.elements.reference
        // 尝试兼容不同实现，先赋值再更新
        if (popper.state) popper.state.elements.reference = triggerEl;
        popper.update();
      } else {
        const rect = triggerEl?.getBoundingClientRect();
        let parent = triggerEl as HTMLElement | null;
        while (parent && parent !== document.body) {
          parent = parent.parentElement;
        }
        const isHidden = parent !== document.body || (rect && rect.width === 0 && rect.height === 0);
        if (!isHidden) {
          if (popper.state) popper.state.elements.reference = triggerEl;
          popper.update();
        } else {
          // trigger 不在文档流内或被隐藏，则隐藏浮层
          onVisibleChange(false, { trigger: 'document' });
        }
      }
    } catch (e) {
      // 直接尝试更新
      popper.update();
    }
  }

  useImperativeHandle(ref, () => ({
    // 未公开
    getPopupElement: () => popupRef.current,
    // 未公开
    getPortalElement: () => portalRef.current,
    // 未公开
    getPopupContentElement: () => contentRef.current,
    // 未公开
    setVisible: (visible: boolean) => onVisibleChange(visible, { trigger: 'document' }),
    /** 获取 popper 实例 */
    getPopper: () => {
      const popper = popperRef.current;
      if (!popper) return null;
      // 返回不含内部 styles 和 attributes 的对象
      return {
        state: popper.state,
        update: popper.update,
        forceUpdate: popper.forceUpdate,
        destroy: popper.destroy,
        setOptions: popper.setOptions,
      };
    },
    /** 获取浮层元素 */
    getOverlay: () => portalRef.current,
    /** 获取浮层悬浮状态 */
    getOverlayState: () => ({ hover: isOverlayHover }),
    /** 更新浮层内容 */
    update: () => updatePopper(),
  }));

  return (
    <React.Fragment>
      {triggerElementIsString ? null : triggerNode}
      {overlay}
    </React.Fragment>
  );
});

Popup.displayName = 'Popup';

export default Popup;
