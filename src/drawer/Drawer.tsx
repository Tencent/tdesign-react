import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import classnames from 'classnames';

import { ConfigContext } from '../config-provider';
import getScrollbarWidth from '../_util/getScrollbarWidth';
import hasScrollBar from '../_util/hasScrollBar';
import { Icon } from '../icon';
import DrawerWrapper from './DrawerWrapper';
import { PortalProps, getAttach } from './Portal';
import { getWidthOrHeightBySize } from './_util';

export enum CloseTriggerType {
  CLICK_MASK = 'clickMask',
  CLICK_CLOSE_BTN = 'clickCloseBtn',
  KEYDOWN_ESC = 'keydownEsc',
}

export interface DrawerProps {
  /**
   * Drawer 是否可见
   */
  visible?: boolean;
  /**
   * Drawer 标题，如果不需要 header 请设置 header 属性为 false
   */
  title?: React.ReactNode;
  /**
   * 是否显示右上角的关闭按钮
   * @default true
   */
  closeBtn?: boolean | React.ReactNode;
  /**
   * Drawer 页脚
   */
  footer?: React.ReactNode;
  /**
   * 动画时长，单位为毫秒
   * @default 300
   */
  duration?: number;
  /**
   * 点击蒙层是否允许关闭
   * @default true
   */
  closeOnClickOverlay?: boolean;
  /**
   * Drawer 外层容器的 className，作用节点包括 mask
   */
  className?: string;
  /**
   * Drawer 外层容器的样式，作用节点包括 mask
   */
  style?: React.CSSProperties;
  /**
   * 设置 Drawer 的 z-index
   * @default 1500
   */
  zIndex?: number;
  /**
   * 抽屉方向
   * @default 'right'
   */
  placement?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * 抽屉大小，可以是 large/middle/small/300px/500px/80%/50%/300/500 等等
   * @default 'small'
   */
  size?: number | string;
  /**
   * 展示方式，push（推开内容区域）或者 overlay（在内容上展示）
   * @default 'overlay'
   */
  mode?: 'push' | 'overlay';
  /**
   * 关闭时销毁 Drawer 内的子元素
   * @default false
   */
  destroyOnClose?: boolean;
  /**
   * 预渲染 Drawer 内的元素
   * @default false
   */
  forceRender?: boolean;
  /**
   * 指定 Drawer 挂载的 HTML 节点, false 为挂载在当前 dom
   * @default document.body
   */
  attach?: PortalProps['getContainer'] | false;
  /**
   * 是否显示遮罩层
   * @default fasle
   */
  showOverlay?: boolean;
  /**
   * 是否支持键盘 ESC 关闭
   * @default true
   */
  keydownEsc?: boolean;
  /**
   * 控制 header 是否显示，默认为 true，当此项为 true 时，title 无效。
   * @default true
   */
  header?: boolean | React.ReactElement;
  /**
   * Drawer 关闭回调，一个对象参数
   * {
   *  event: React.MouseEvent;
   *  trigger: 'clickMask' | 'keydownEsc' | 'clickCloseBtn';
   *  close: () => void;
   * }
   *
   * 当使用这个回调函数的时候，需要使用 close 函数手动关闭。
   */
  onClose?: ({ event, trigger }: { event: React.MouseEvent; trigger: CloseTriggerType }) => void;
  /**
   * 点击遮罩层的回调函数
   */
  onClickOverlay?: (event: React.MouseEvent) => void;
  /**
   * 打开 Drawer 动画结束回调。
   */
  onOpened?: (event: React.TransitionEvent) => void;
  /**
   * 关闭 Drawer 动画结束回调。
   */
  onClosed?: (event: React.TransitionEvent) => void;
  /**
   * Drawer 子元素
   */
  children: React.ReactNode;
}

const Drawer = forwardRef((props: DrawerProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    visible,
    className,
    style,
    attach,
    showOverlay,
    size,
    placement,
    onClose,
    onClickOverlay,
    onOpened,
    onClosed,
    closeOnClickOverlay,
    forceRender,
    children,
    title,
    header,
    footer,
    duration,
    closeBtn,
    zIndex,
    destroyOnClose,
    keydownEsc,
    mode,
  } = props;
  const currentAttach = useMemo(() => attach !== false && getAttach(attach), [attach]);
  const { classPrefix } = useContext(ConfigContext);
  const containerRef = useRef<HTMLDivElement>();
  const contentWrapperRef = useRef<HTMLDivElement>();
  const drawerWrapperRef = useRef<HTMLElement>(); // 即最终的 attach dom，默认为 document.body
  const prefixCls = `${classPrefix}-drawer`;
  const isTopOrBottom = placement === 'top' || placement === 'bottom';
  const isTopOrLeft = placement === 'top' || placement === 'left';
  const width = !isTopOrBottom ? getWidthOrHeightBySize(size) : undefined;
  const height = isTopOrBottom ? getWidthOrHeightBySize(size) : undefined;
  const transform = visible ? 'translate(0px)' : '';
  const closeIcon = React.isValidElement(closeBtn) ? closeBtn : <Icon name="close" />;

  useImperativeHandle(ref, () => containerRef.current);
  useEffect(() => {
    let documentBodyCssText = '';

    if (visible) {
      if (attach !== false && hasScrollBar()) {
        // 处理滚动条宽度导致晃动的问题。
        const scrollbarWidth = getScrollbarWidth();
        documentBodyCssText = `
          overflow: hidden;
          width: calc(100% - ${scrollbarWidth}px);
        `;

        if (mode !== 'push') {
          // 这里做简单的性能优化，如果是 body 那么在下面 mode=push 的模式下，一起使用 cssText 设置，减少重绘重排
          document.body.style.cssText = documentBodyCssText;
        }
      }
    }

    if (mode === 'push') {
      if (visible) {
        let tranformPos = isTopOrBottom ? `-${height}` : `-${width}`;
        if (isTopOrLeft) {
          tranformPos = isTopOrBottom ? height : width;
        }
        if (drawerWrapperRef.current) {
          // 由于会改变元素位置会重置，所以不使用 transfrom
          let margin = '';
          if (isTopOrBottom) {
            margin = `${tranformPos} 0 0 0`;
          } else {
            margin = `0 0 0 ${tranformPos}`;
          }
          const drawerWrapperRefCssText = drawerWrapperRef.current.style.cssText;
          drawerWrapperRef.current.style.cssText = `
            ${documentBodyCssText};
            ${drawerWrapperRefCssText};
            transition: margin ${duration}ms cubic-bezier(0.7, 0.3, 0.1, 1);
            margin: ${margin};
          `;
        }
      } else {
        if (drawerWrapperRef.current) {
          drawerWrapperRef.current.style.margin = '';
        }
      }
    }

    if (contentWrapperRef.current) {
      // 聚焦到 Drawer 最外层元素即 containerRef.current，KeyDown 事件才有效。
      containerRef.current.focus();

      contentWrapperRef.current.style.transform = transform;
    }
  }, [attach, currentAttach, duration, height, isTopOrBottom, isTopOrLeft, mode, transform, visible, width]);

  function onMaskClick(event: React.MouseEvent) {
    onClose?.({ event, trigger: CloseTriggerType.CLICK_MASK });
    onClickOverlay?.(event);
  }
  function onCloseBtnClick(event: React.MouseEvent) {
    onClose?.({ event, trigger: CloseTriggerType.CLICK_CLOSE_BTN });
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (onClose) {
        onClose({ event: e as any, trigger: CloseTriggerType.KEYDOWN_ESC });
      }
    }
  }
  function onTransitionEnd(event: React.TransitionEvent) {
    if (!visible) {
      // 重置样式
      document.body.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.display = 'block';
      onClosed?.(event);
    } else {
      onOpened?.(event);
    }
  }

  return (
    <DrawerWrapper visible={visible} attach={attach} forceRender={forceRender} ref={drawerWrapperRef}>
      <div
        className={classnames(prefixCls, className, `${prefixCls}-${placement}`, {
          [`${prefixCls}-open`]: visible,
          [`${prefixCls}-attach`]: attach !== undefined && currentAttach !== document.body,
          [`${prefixCls}-no-mask`]: !showOverlay,
        })}
        style={{ zIndex, ...style, width: !showOverlay ? width : '' }}
        ref={containerRef}
        // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
        tabIndex={-1}
        onKeyDown={keydownEsc && visible ? onKeyDown : undefined}
        onTransitionEnd={onTransitionEnd}
      >
        {showOverlay && (
          <div
            className={`${prefixCls}__mask`}
            onClick={closeOnClickOverlay ? onMaskClick : undefined}
            style={{
              transitionDuration: `${duration}ms`,
            }}
          />
        )}
        <div
          className={classnames(`${prefixCls}__content-wrapper`, `${prefixCls}__content-wrapper-${placement}`)}
          ref={contentWrapperRef}
          style={{
            transitionDuration: `${duration}ms`,
            width,
            height,
          }}
        >
          <Header className={`${prefixCls}__header`} title={title} header={header} />
          {closeBtn && (
            <div onClick={onCloseBtnClick} className={`${prefixCls}__close-btn`}>
              {closeIcon}
            </div>
          )}
          <div className={`${prefixCls}__body`}>
            {destroyOnClose && visible && children}
            {!destroyOnClose && children}
          </div>
          {footer && <div className={`${prefixCls}__footer`}>{footer}</div>}
        </div>
      </div>
    </DrawerWrapper>
  );
});

function Header(props: { className?: string; title?: React.ReactNode; header: DrawerProps['header'] }) {
  const { className, title, header } = props;

  if (!header) {
    return null;
  }

  if (React.isValidElement(header)) {
    return header;
  }

  return <h5 className={className}>{title}</h5>;
}

Drawer.defaultProps = {
  closeBtn: true,
  duration: 300,
  closeOnClickOverlay: true,
  zIndex: 1500,
  size: 'small',
  placement: 'right',
  mode: 'overlay',
  destroyOnClose: false,
  forceRender: false,
  showOverlay: true,
  keydownEsc: true,
  header: true,
};

Drawer.displayName = 'Drawer';

export default Drawer;
