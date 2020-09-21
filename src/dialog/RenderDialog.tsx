import React, { useLayoutEffect, useRef, SyntheticEvent, CSSProperties } from 'react';
import { CSSTransition } from 'react-transition-group';
import DialogPortal from './DialogPortal';
import { DialogProps } from './Dialog';

enum KEY_CODE {
  ESC = 27,
}

export type StringOrElement = string | HTMLElement;

export interface RenderDialogProps extends DialogProps {
  prefixCls?: string;
  height?: number;
  classPrefix: string;
  onClose: (e: SyntheticEvent<HTMLElement>) => any;
  getContainer?: StringOrElement | (() => StringOrElement) | false;
}

const transitionTime = 300;
const RenderDialog: React.FC<RenderDialogProps> = (props) => {
  const { prefixCls, getContainer, visible, mode, zIndex, showOverlay, onKeydownEsc, classPrefix, onClosed } = props;
  const wrap = useRef<HTMLDivElement>();
  const bodyOverflow = useRef<string>(document.body.style.overflow);

  useLayoutEffect(() => {
    if (!!getContainer === false && !visible && wrap) {
      wrap.current.style.display = 'none';
    }
    // 隐藏body的滚动条
    if (visible && mode === 'modal') {
      if (bodyOverflow.current !== 'hidden') {
        document.body.style.overflow = 'hidden';
      }
    }
  }, [getContainer, visible, mode]);

  const close = (e: any) => {
    const { onClose } = props;
    onClose && onClose(e);
  };

  const onAnimateLeave = () => {
    if (wrap.current) {
      wrap.current.style.display = 'none';
    }
    // 还原body的滚动条
    document.body.style.overflow = bodyOverflow.current;
    onClosed && onClosed(null);
  };

  const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const { onClickOverlay } = props;
      onClickOverlay && onClickOverlay();
      close(e);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KEY_CODE.ESC) {
      e.stopPropagation();
      if (onKeydownEsc) {
        onKeydownEsc(e);
      }
      close(e);
    }
  };

  const renderDialog = (styles, classNames) => {
    const dest: any = {};
    const { offset } = props;
    if (props.width !== undefined) {
      dest.width = props.width;
    }
    if (props.height !== undefined) {
      dest.height = props.height;
    }
    if (offset) {
      dest.marginTop = offset.top || 0;
      dest.marginLeft = props.offset.left || 0;
    }

    const footer = props.footer ? <div className={`${prefixCls}__footer`}>{props.footer}</div> : null;

    const header = props.header ? <div className={`${prefixCls}__header`}>{props.header}</div> : null;

    const body = <div className={`${prefixCls}__body`}>{props.body || props.children}</div>;

    const closer = (
      <span onClick={close} className={`${classPrefix}-icon-close`}>
        {props.closeBtn}
      </span>
    );

    const style = { ...dest, ...props.style };
    const dialogElement = (
      <div
        ref={wrap}
        style={{ ...style, ...styles }}
        className={`${prefixCls}${` ${prefixCls}--default`} ${classNames}`}
      >
        {closer}
        {header}
        {body}
        {footer}
      </div>
    );

    return (
      <CSSTransition
        key="dialog"
        in={props.visible}
        appear
        mountOnEnter
        unmountOnExit={props.destroyOnClose}
        timeout={transitionTime}
        classNames={`${prefixCls}-zoom`}
        onEntered={props.onOpened}
        onExited={onAnimateLeave}
      >
        {dialogElement}
      </CSSTransition>
    );
  };

  const getZIndex = () => {
    const style: CSSProperties = {};
    if (zIndex !== undefined) {
      style.zIndex = zIndex;
    }
    return style;
  };

  const renderMask = () => {
    let maskElement;
    if (showOverlay) {
      maskElement = (
        <CSSTransition
          in={visible}
          appear
          timeout={transitionTime}
          classNames="t-dialog-fade"
          mountOnEnter
          unmountOnExit
          key="mask"
        >
          <div key="mask" onKeyDown={onKeyDown} onClick={onMaskClick} className={`${prefixCls}-mask`} />
        </CSSTransition>
      );
    }
    return maskElement;
  };

  const render = () => {
    const style = getZIndex();
    if (visible) {
      style.display = 'inline-block';
    }
    const wrapStyle = {
      zIndex,
      ...style,
    };

    const dialogBody = renderDialog(wrapStyle, `${props.placement ? `${prefixCls}--${props.placement}` : ''}`);
    const dialog = (
      <div className={`${props.class ? `${props.class} ` : ''}${prefixCls}-ctx`} style={getZIndex()}>
        {mode === 'modal' && renderMask()}
        {dialogBody}
      </div>
    );

    let dom = null;

    if (visible || wrap.current) {
      if (getContainer === false) {
        dom = dialog;
      } else {
        dom = <DialogPortal getContainer={getContainer}>{dialog}</DialogPortal>;
      }
    }

    return dom;
  };

  return render();
};

export default RenderDialog;
