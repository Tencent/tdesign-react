import React, {
  forwardRef,
  ReactNode,
  CSSProperties,
  useState,
  useEffect,
  cloneElement,
  isValidElement,
  ReactChild,
} from 'react';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import useDefault from '../_util/useDefault';
import useConfig from '../_util/useConfig';
import composeRefs from '../_util/composeRefs';
import usePrevious from '../_util/usePrevious';
import Portal from './Portal';
import useTriggerProps from './useTriggerProps';

export type PopupTrigger = 'hover' | 'click' | 'focus' | 'contextMenu' | 'manual';

export interface PopupProps {
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 浮层出现时相对目标元素的位置
   * @default 'top'
   */
  placement?:
    | 'top'
    | 'left'
    | 'bottom'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'left-top'
    | 'left-bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'right-top'
    | 'right-bottom';

  /**
   * 是否显示浮层，受控
   * @default false
   */
  visible?: boolean;

  /**
   * 浮层状态改变的回调
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * 浮层弹出的触发方式
   * @default 'hover'
   */
  trigger?: PopupTrigger | PopupTrigger[];

  /**
   * 浮层内容
   */
  content?: ReactNode;

  /**
   * 浮层是否显示箭头
   * @default false
   */
  showArrow?: boolean;

  /**
   * 设置渲染的父节点
   */
  getPopupContainer?: () => HTMLDivElement;

  /**
   * 浮层样式
   */
  overlayStyle?: CSSProperties;

  /**
   * 浮层类名
   */
  overlayClassName?: string;

  /**
   * 隐藏时销毁
   * @default false
   */
  destroyOnHide?: boolean;

  /**
   * 触发元素
   */
  children?: React.ReactNode;
}
/**
 * 修复参数对齐popper.js 组件展示方向，与TD组件定义有差异
 */
const placementMap = {
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
    getPopupContainer,
    showArrow = false,
    destroyOnHide = false,
    overlayStyle,
    overlayClassName,
    children,
  } = props;
  const { classPrefix } = useConfig();
  const [visible, setVisible] = useDefault(props.visible, false, props.onVisibleChange);
  const preVisible = usePrevious(visible);

  // refs
  const [triggerRef, setTriggerRef] = useState<HTMLElement>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement>(null);
  const { styles, attributes, update } = usePopper(triggerRef, overlayRef, {
    placement: placementMap[placement],
    modifiers: [{ name: 'arrow', options: { element: arrowRef } }],
  });

  // 设置 style 决定展示与隐藏
  const overlayVisibleStyle: CSSProperties = visible ? { ...overlayStyle } : { ...overlayStyle, display: 'none' };

  // 处理 trigger
  const [triggerProps, popupProps] = useTriggerProps(
    { current: overlayRef },
    Array.isArray(trigger) ? trigger : [trigger],
    visible,
    setVisible,
  );

  // 触发器只能有一个元素
  let triggerNode: ReactChild;
  const [triggerChildNode] = React.Children.toArray(children);
  if (React.Children.count(children) === 1 && isValidElement(triggerChildNode)) {
    triggerNode = triggerChildNode;
  } else {
    triggerNode = <span className={`${classPrefix}-trigger`}>{children}</span>;
  }

  // 代理 trigger 的 ref
  triggerNode = cloneElement(triggerNode, {
    ref: composeRefs((triggerNode as any).ref, setTriggerRef),
    ...triggerProps,
  });

  // portal
  let portal: React.ReactElement = null;

  // 如果要展示，或者已经渲染过，默认不销毁
  if (visible || overlayRef) {
    portal = (
      <Portal getContainer={getPopupContainer}>
        <div
          ref={composeRefs(setOverlayRef, ref)}
          style={styles.popper}
          className={`${classPrefix}-popup`}
          {...attributes.popper}
          {...popupProps}
        >
          <div
            className={classNames(`${classPrefix}-popup-content`, overlayClassName, {
              [`${classPrefix}-popup-content--arrow`]: showArrow,
            })}
            style={overlayVisibleStyle}
          >
            {showArrow && <div ref={setArrowRef} style={styles.arrow} className={`${classPrefix}-popup__arrow`} />}
            {content}
          </div>
        </div>
      </Portal>
    );
  }

  // 强制销毁
  if (!visible && destroyOnHide) {
    portal = null;
  }

  // 弹出框展示的时候，重新计算一下位置
  useEffect(() => {
    if (visible !== preVisible && visible && update) {
      update();
    }
  }, [visible, preVisible, update]);

  return (
    <>
      {triggerNode}
      {portal}
    </>
  );
});

Popup.displayName = 'Popup';

export default Popup;
