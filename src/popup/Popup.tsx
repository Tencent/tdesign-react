import React, {
  forwardRef,
  CSSProperties,
  useState,
  useEffect,
  cloneElement,
  isValidElement,
  useMemo,
  useImperativeHandle,
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
import usePrevious from '../_util/usePrevious';
import { TdPopupProps } from './type';
import Portal from './Portal';
import useTriggerProps from './useTriggerProps';

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
    attach,
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
  const preVisible = usePrevious(visible);

  // refs
  const [triggerRef, setTriggerRef] = useState<HTMLElement>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement>(null);
  const contentRef = useRef(null);

  // https://popper.js.org/react-popper/v2/faq/
  const [firstUpdate, setFirstUpdate] = useState<boolean>(false);
  const onPopperFirstUpdate = useMemo(
    () => () => {
      setFirstUpdate(true);
    },
    [],
  );

  const { styles, attributes, update } = usePopper(triggerRef, overlayRef, {
    placement: placementMap[placement],
    onFirstUpdate: onPopperFirstUpdate,
  });

  useImperativeHandle(ref, (): any => ({
    setVisible,
    getContentRef: contentRef?.current,
  }));

  const defaulstStyles = useMemo(() => {
    if (triggerRef && typeof overlayStyle === 'function') return { ...overlayStyle(triggerRef), zIndex };
    return { ...overlayStyle, zIndex };
  }, [overlayStyle, zIndex, triggerRef]);
  // 设置 style 决定展示与隐藏
  const overlayVisibleStyle: CSSProperties = defaulstStyles;

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

  const resetStyle = () => {
    // reset all style on exited/entered
    const contentEle = contentRef?.current;
    contentEle.style.overflow = '';
    contentEle.style.maxHeight = '';
  };
  const handleEnter = () => {
    const contentEle = contentRef?.current;
    if (contentEle) {
      contentEle.style.overflow = 'hidden';
      contentEle.style.maxHeight = '0';
    }
  };

  const handleEntering = () => {
    const contentEle = contentRef?.current;
    if (contentEle) {
      const { scrollHeight } = contentEle;
      contentEle.style.maxHeight = `${scrollHeight}px`;
    }
  };

  const handleBeforeExit = () => {
    console.log('trigger before exit');
    const contentEle = contentRef?.current;
    if (contentEle) {
      const { scrollHeight } = contentEle;
      contentEle.style.maxHeight = `${scrollHeight}px`;
      contentEle.style.overflow = 'hidden';
    }
  };

  const handleExiting = () => {
    console.log('trigger before exiting');
    const contentEle = contentRef?.current;
    if (contentEle) {
      contentEle.style.maxHeight = '0';
    }
  };

  // portal
  let portal: React.ReactElement = null;
  // 如果要展示，或者已经渲染过，默认不销毁
  if (visible || overlayRef) {
    portal = (
      <Portal attach={attach}>
        <CSSTransition
          in={visible}
          appear={expandAnimation}
          timeout={200}
          nodeRef={contentRef}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={resetStyle}
          onExit={handleBeforeExit}
          onExiting={handleExiting}
          onExited={resetStyle}
        >
          <div
            ref={composeRefs(setOverlayRef, ref)}
            style={styles.popper}
            className={classNames(
              `${classPrefix}-popup`,
              `${classPrefix}-popup_animation-enter-active`,
              visible ? `${classPrefix}-popup_animation-leave` : `${classPrefix}-popup_animation-leave-to`,
            )}
            {...attributes.popper}
            {...popupProps}
          >
            <div
              className={classNames(`${classPrefix}-popup-content`, overlayClassName, {
                [`${classPrefix}-popup-content--arrow`]: showArrow,
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
    );
  }

  // 强制销毁
  if (!visible && destroyOnClose) {
    portal = null;
  }

  // 弹出框展示的时候，重新计算一下位置
  useEffect(() => {
    if ((visible || firstUpdate) && update) {
      update();
    }
  }, [visible, preVisible, update, children, firstUpdate]);

  const handlePopupWrapperMouseDown = () => {
    const removeUpdate = () => window.removeEventListener('mousemove', update);
    window.removeEventListener('mouseup', removeUpdate);
    window.addEventListener('mousemove', update);
    window.addEventListener('mouseup', removeUpdate);
  };

  return (
    <div
      className={classNames(`${classPrefix}-popup-reference`, className)}
      onMouseDown={handlePopupWrapperMouseDown}
      style={style}
    >
      {triggerNode}
      {portal}
    </div>
  );
});

Popup.displayName = 'Popup';

export default Popup;
