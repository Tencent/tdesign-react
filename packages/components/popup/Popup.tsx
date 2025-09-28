import { Placement, type Options } from '@popperjs/core';
import classNames from 'classnames';
import { debounce, isFunction } from 'lodash-es';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { getRefDom } from '../_util/ref';
import { getCssVarsValue } from '../_util/style';
import Portal from '../common/Portal';
import useAnimation from '../hooks/useAnimation';
import useAttach from '../hooks/useAttach';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useMutationObserver from '../hooks/useMutationObserver';
import usePopper from '../hooks/usePopper';
import useWindowSize from '../hooks/useWindowSize';
import { popupDefaultProps } from './defaultProps';
import useTrigger from './hooks/useTrigger';
import type { TdPopupProps } from './type';
import { getTransitionParams } from './utils/transition';

export interface PopupProps extends TdPopupProps {
  // 是否触发展开收起动画，内部下拉式组件使用
  expandAnimation?: boolean;
  // 更新内容区域滚动条
  updateScrollTop?: (content: HTMLDivElement) => void;
}

export interface PopupRef {
  /** 获取 popper 实例 */
  getPopper: () => ReturnType<typeof usePopper>;
  /** 获取 Popup dom 元素 */
  getPopupElement: () => HTMLDivElement;
  /** 获取 portal dom 元素 */
  getPortalElement: () => HTMLDivElement;
  /** 获取内容区域 dom 元素 */
  getPopupContentElement: () => HTMLDivElement;
  /** 设置 popup 显示隐藏 */
  setVisible: (visible: boolean) => void;
}

const Popup = forwardRef<PopupRef, PopupProps>((originalProps, ref) => {
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

  const [popupElement, setPopupElement] = useState(null);
  const triggerRef = useRef(null); // 记录 trigger 元素
  const popupRef = useRef(null); // popup dom 元素，css transition 需要用
  const portalRef = useRef(null); // portal dom 元素
  const contentRef = useRef(null); // 内容部分
  const popperRef = useRef(null); // 保存 popper 实例

  // 默认动画时长
  const DEFAULT_TRANSITION_TIMEOUT = 180;

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

  const { getTriggerNode, getPopupProps, getTriggerDom } = useTrigger({
    triggerRef,
    content,
    disabled,
    trigger,
    visible,
    delay,
    onVisibleChange,
  });

  const popperOptions = props.popperOptions as Options;
  popperRef.current = usePopper(getRefDom(triggerRef), popupElement, {
    placement: popperPlacement,
    ...popperOptions,
  });
  /**
   * 是否启用 popper.js 的 arrow 修饰符
   * - 会自动根据属性 data-popper-arrow 来识别箭头元素
   * - 从而支持使用 padding 调整箭头位置
   * @ see https://popper.js.org/docs/v2/modifiers/arrow/
   */
  const hasArrowModifier = popperOptions?.modifiers?.some((modifier) => modifier.name === 'arrow');
  const { styles, attributes } = popperRef.current;

  const triggerNode = isFunction(children) ? getTriggerNode(children({ visible })) : getTriggerNode(children);

  const updateTimeRef = useRef(null);
  // 监听 trigger 节点或内容变化动态更新 popup 定位
  useMutationObserver(getRefDom(triggerRef), () => {
    const isDisplayNone = getCssVarsValue('display', getRefDom(triggerRef)) === 'none';
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
    if (!triggerRef.current) triggerRef.current = getTriggerDom();
    if (visible) {
      updateScrollTop?.(contentRef.current);
    }
  }, [visible, updateScrollTop, getTriggerDom]);


  // 监听 trigger 位置变化调整位置
  // 缺陷：无法监听鼠标滚动。
  const positionState = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const triggerEl = getRefDom(triggerRef);
    if (!visible || !triggerEl) {
      return;
    }

    const checkPosition = (once: boolean = false) => {
      const { x, y, width, height } = triggerEl.getBoundingClientRect();
      if (
        x !== positionState.current.x ||
        y !== positionState.current.y ||
        width !== positionState.current.width ||
        height !== positionState.current.height
      ) {
        popperRef.current?.update?.();
        positionState.current = { x, y, width, height };
      }

      if (!once) {
        // 持续请求下一帧
        frameIdRef.current = requestAnimationFrame(() => checkPosition(once));
      }
    };

    const startLoop = () => {
      if (frameIdRef.current === null) {
        checkPosition();
      }
    };

    const stopLoop = () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };


    window.addEventListener('pointerdown', startLoop);
    window.addEventListener('pointerup', stopLoop);

    return () => {
      stopLoop();
      window.removeEventListener('pointerdown', startLoop);
      window.removeEventListener('pointerup', stopLoop);
    };
  }, [visible]);


  // 对 React Flow 的特殊适配，可同时支持滚动、缩放等场景
  useEffect(() => {
    const triggerEl = getRefDom(triggerRef);
    if (!visible || !triggerEl) {
      return;
    }

    const viewportEl = triggerEl.closest('.react-flow__viewport');

    if (!viewportEl) {
      return;  // 未检测到 react-flow，不用管了。
    }
    
    const observer = new MutationObserver(() => {
      popperRef.current?.update?.();
    });

    observer.observe(viewportEl, {
      attributes: true,
      attributeFilter: ['style'], // 只关心 'style' 这一个属性，性能更好。
    });
    
    return () => {
      observer.disconnect();
    };
  }, [visible]);


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
      <Portal triggerNode={getRefDom(triggerRef)} attach={popupAttach} ref={portalRef}>
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
              {showArrow && (
                <div
                  style={styles.arrow}
                  className={`${classPrefix}-popup__arrow`}
                  {...(hasArrowModifier && { 'data-popper-arrow': '' })}
                />
              )}
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

export default Popup;
