import React, {
  forwardRef,
  Ref,
  FunctionComponent,
  ReactNode,
  CSSProperties,
  useState,
  useEffect,
  cloneElement,
  isValidElement,
  ReactChild,
} from 'react';
import { usePopper } from 'react-popper';
import useConfig from '../_util/useConfig';
import composeRefs from '../_util/composeRefs';
import Portal from './Portal';
import useTriggerProps from './useTriggerProps';

export type PopupTrigger =
  | 'hover'
  | 'click'
  | 'focus'
  | 'contextMenu'
  | 'manual';

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
  placement?: 'top' | 'left' | 'bottom' | 'right';

  /**
   * 是否显示浮层，受控
   * @default false
   */
  visible?: boolean;

  /**
   * 浮层弹出的触发方式
   * @default 'hover'
   */
  trigger?: PopupTrigger | PopupTrigger[];

  /**
   * 浮层内容
   * @default null
   */
  content?: ReactNode;

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
}

export type PopupRef = Ref<HTMLDivElement>;

const Popup: FunctionComponent<PopupProps> = forwardRef(
  (props, ref: PopupRef) => {
    const {
      trigger = 'hover',
      content = null,
      placement = 'top',
      getPopupContainer,
      destroyOnHide = false,
      overlayStyle,
      overlayClassName,
      children,
    } = props;
    const { classPrefix } = useConfig();
    const [visible, setVisible] = useState(props.visible || false);

    // refs
    const [triggerRef, setTriggerRef] = useState<HTMLElement>(null);
    const [overlayRef, setOverlayRef] = useState<HTMLDivElement>(null);
    const { styles, attributes } = usePopper(triggerRef, overlayRef, {
      placement,
    });

    // 设置 style 决定展示与隐藏
    const overlayVisibleStyle: CSSProperties = visible
      ? { ...overlayStyle }
      : { ...overlayStyle, display: 'none' };

    // 响应 props 变化
    useEffect(() => setVisible(props.visible), [props.visible]);

    // 处理 trigger
    const [triggerProps, popupProps] = useTriggerProps(
      { current: overlayRef },
      Array.isArray(trigger) ? trigger : [trigger],
      visible,
      setVisible
    );

    // 触发器只能有一个元素
    let triggerNode: ReactChild;
    const [triggerChildNode] = React.Children.toArray(children);
    if (
      React.Children.count(children) === 1 &&
      isValidElement(triggerChildNode)
    ) {
      triggerNode = triggerChildNode;
    } else {
      triggerNode = (
        <span className={`${classPrefix}-trigger`}>{children}</span>
      );
    }

    // 代理 trigger 的 ref
    triggerNode = cloneElement(triggerNode, {
      ref: composeRefs((triggerNode as any).ref, setTriggerRef),
      ...triggerProps,
    });

    // portal
    let $portal: React.ReactElement = null;

    // 如果要展示，或者已经渲染过，默认不销毁
    if (visible || overlayRef) {
      $portal = (
        <Portal classPrefix={classPrefix} getContainer={getPopupContainer}>
          <div
            ref={composeRefs(setOverlayRef, ref)}
            style={{ ...styles.popper, ...overlayVisibleStyle }}
            className={overlayClassName}
            {...attributes.popper}
            {...popupProps}
          >
            {content}
          </div>
        </Portal>
      );
    }

    // 强制销毁
    if (!visible && destroyOnHide) {
      $portal = null;
    }

    return (
      <>
        {triggerNode}
        {$portal}
      </>
    );
  }
);

Popup.displayName = 'Popup';

export default Popup;
