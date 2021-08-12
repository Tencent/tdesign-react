import React, {
  forwardRef,
  CSSProperties,
  useState,
  useEffect,
  cloneElement,
  isValidElement,
  ReactChild,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { usePopper } from 'react-popper';
import Popper from '@popperjs/core';
import useDefault from '../_util/useDefault';
import useConfig from '../_util/useConfig';
import composeRefs from '../_util/composeRefs';
import usePrevious from '../_util/usePrevious';
import { TdPopupProps } from '../_type/components/popup';
import Portal from './Portal';
import useTriggerProps from './useTriggerProps';

export interface PopupProps extends TdPopupProps {}
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
    overlayClassName,
    overlayStyle,
    triggerElement,
    children = triggerElement,
    disabled,
    defaultVisible = false,
    zIndex,
    onVisibleChange,
  } = props;
  const { classPrefix } = useConfig();
  const [visible, setVisible] = useDefault(props.visible, defaultVisible, onVisibleChange);
  const preVisible = usePrevious(visible);

  // refs
  const [triggerRef, setTriggerRef] = useState<HTMLElement>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement>(null);
  const [arrowRef, setArrowRef] = useState<HTMLDivElement>(null);
  const { styles, attributes, update } = usePopper(triggerRef, overlayRef, {
    placement: placementMap[placement],
    modifiers: [{ name: 'arrow', options: { element: arrowRef } }],
  });

  const defaulstStyles = useMemo(() => {
    if (triggerRef && typeof overlayStyle === 'function') return { ...overlayStyle(triggerRef), zIndex };
    return { ...overlayStyle, zIndex };
  }, [overlayStyle, zIndex, triggerRef]);
  // 设置 style 决定展示与隐藏
  const overlayVisibleStyle: CSSProperties = visible ? defaulstStyles : { ...defaulstStyles, display: 'none' };

  // 处理 trigger
  const [triggerProps, popupProps] = useTriggerProps({ current: overlayRef }, [trigger], visible, setVisible, disabled);

  // 触发器只能有一个元素
  let triggerNode: ReactChild;
  const [triggerChildNode] = React.Children.toArray(children);
  const disabledClassName = classNames({ [`${classPrefix}-is-disabled`]: disabled });
  if (React.Children.count(children) === 1 && isValidElement(triggerChildNode)) {
    triggerNode = triggerChildNode;
  } else {
    triggerNode = <span className={`${classPrefix}-trigger`}>{children}</span>;
  }

  // 代理 trigger 的 ref
  triggerNode = cloneElement(triggerNode, {
    ref: composeRefs((triggerNode as any).ref, setTriggerRef),
    className: classNames(disabledClassName, triggerNode.props.className),
    ...triggerProps,
  });

  // portal
  let portal: React.ReactElement = null;
  // 如果要展示，或者已经渲染过，默认不销毁
  if (visible || overlayRef) {
    portal = (
      <Portal attach={attach}>
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
  if (!visible && destroyOnClose) {
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
