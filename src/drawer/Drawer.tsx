import React, { forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import classnames from 'classnames';

import { ConfigContext } from '../config-provider';
import getScrollbarWidth from '../_util/getScrollbarWidth';
import hasScrollBar from '../_util/hasScrollBar';
import CloseIcon from '../icon/icons/CloseIcon';
import { TdDrawerProps, DrawerEventSource } from '../_type/components/drawer';
import { StyledProps } from '../_type';
import { getAttach } from '../common/Portal';
import DrawerWrapper from './DrawerWrapper';
import { getWidthOrHeightBySize } from './_util';

export const CloseTriggerType: { [key: string]: DrawerEventSource } = {
  CLICK_OVERLAY: 'overlay',
  CLICK_CLOSE_BTN: 'close-btn',
  CLICK_CANCEL_BTN: 'cancel',
  KEYDOWN_ESC: 'esc',
};

export interface DrawerProps extends TdDrawerProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
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
    onCloseBtnClick,
    onOverlayClick,
    onEscKeydown,
    closeOnOverlayClick,
    closeOnEscKeydown,
    children,
    header,
    footer,
    closeBtn,
    zIndex,
    destroyOnClose,
    mode,
  } = props;
  const currentAttach = useMemo(() => attach !== '' && getAttach(attach), [attach]);
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
  const closeIcon = React.isValidElement(closeBtn) ? closeBtn : <CloseIcon />;

  useImperativeHandle(ref, () => containerRef.current);
  useEffect(() => {
    let documentBodyCssText = '';

    if (visible) {
      if (attach !== '' && hasScrollBar()) {
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
            transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1);
            margin: ${margin};
          `;
        }
      } else if (drawerWrapperRef.current) {
        drawerWrapperRef.current.style.margin = '';
      }
    }

    if (contentWrapperRef.current) {
      // 聚焦到 Drawer 最外层元素即 containerRef.current，KeyDown 事件才有效。
      containerRef.current.focus();

      contentWrapperRef.current.style.transform = transform;
    }
  }, [attach, currentAttach, height, isTopOrBottom, isTopOrLeft, mode, transform, visible, width]);

  function onMaskClick(e: React.MouseEvent<HTMLDivElement>) {
    onClose?.({ e, trigger: CloseTriggerType.CLICK_OVERLAY });
    onOverlayClick?.({ e });
  }
  function onClickCloseBtn(e: React.MouseEvent<HTMLDivElement>) {
    onClose?.({ e, trigger: CloseTriggerType.CLICK_CLOSE_BTN });
    onCloseBtnClick?.({ e });
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose?.({ e, trigger: CloseTriggerType.KEYDOWN_ESC });
      onEscKeydown?.({ e });
    }
  }
  function onTransitionEnd() {
    if (!visible) {
      // 重置样式
      document.body.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.display = 'block';
    }
  }

  return (
    <DrawerWrapper visible={visible} attach={attach} ref={drawerWrapperRef}>
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
        onKeyDown={closeOnEscKeydown && visible ? onKeyDown : undefined}
        onTransitionEnd={onTransitionEnd}
      >
        {showOverlay && (
          <div
            className={`${prefixCls}__mask`}
            onClick={closeOnOverlayClick ? onMaskClick : undefined}
            style={{
              transitionDuration: '300ms',
            }}
          />
        )}
        <div
          className={classnames(`${prefixCls}__content-wrapper`, `${prefixCls}__content-wrapper-${placement}`)}
          ref={contentWrapperRef}
          style={{
            transitionDuration: '300ms',
            width,
            height,
          }}
        >
          <Header className={`${prefixCls}__header`} header={header} />
          {closeBtn && (
            <div onClick={onClickCloseBtn} className={`${prefixCls}__close-btn`}>
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
  const { className, header } = props;

  if (!header) {
    return null;
  }

  if (React.isValidElement(header)) {
    return <div className={className}>{header}</div>;
  }

  return <h5 className={className}>Drawer</h5>;
}

Drawer.defaultProps = {
  closeBtn: true,
  closeOnOverlayClick: true,
  closeOnEscKeydown: true,
  zIndex: 1500,
  size: 'small',
  placement: 'right',
  mode: 'overlay',
  destroyOnClose: false,
  showOverlay: true,
  header: true,
};

Drawer.displayName = 'Drawer';

export default Drawer;
