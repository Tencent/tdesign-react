import React, { useLayoutEffect, useRef, CSSProperties } from 'react';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import Portal from '../common/Portal';
import { AttachNode } from '../_type/common';
import noop from '../_util/noop';
import { DialogProps } from './Dialog';

enum KEY_CODE {
  ESC = 27,
}

export interface RenderDialogProps extends DialogProps {
  prefixCls?: string;
  classPrefix: string;
  getContainer?: React.ReactElement | AttachNode | boolean;
}

const transitionTime = 300;
const RenderDialog: React.FC<RenderDialogProps> = (props) => {
  const {
    prefixCls,
    getContainer,
    visible,
    mode,
    zIndex,
    showOverlay,
    onKeydownEsc,
    onClosed,
    onClose,
    onClickCloseBtn = noop,
    onClickOverlay = noop,
    preventScrollThrough,
    closeBtn,
  } = props;
  const wrap = useRef<HTMLDivElement>();
  const dialog = useRef<HTMLDivElement>();
  const bodyOverflow = useRef<string>(document.body.style.overflow);
  const isModal = mode === 'modal';
  const canDraggable = props.draggable && mode === 'modeless';

  useLayoutEffect(() => {
    if (visible) {
      if (isModal && bodyOverflow.current !== 'hidden' && preventScrollThrough) {
        document.body.style.overflow = 'hidden';
      }
      if (wrap.current) {
        wrap.current.focus();
      }
    }
  }, [preventScrollThrough, getContainer, visible, mode, isModal]);

  const onAnimateLeave = () => {
    if (wrap.current) {
      wrap.current.style.display = 'none';
    }
    if (isModal && preventScrollThrough) {
      // 还原body的滚动条
      isModal && (document.body.style.overflow = bodyOverflow.current);
    }
    if (!isModal) {
      const { style } = dialog.current;
      style.left = '50%';
      style.top = '50%';
    }
    onClosed && onClosed();
  };

  const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClickOverlay(e);
      onClose({ e, trigger: 'clickOverlay' });
    }
  };

  const onCloseBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickCloseBtn(e);
    onClose({ e, trigger: 'clickCloseBtn' });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === KEY_CODE.ESC) {
      e.stopPropagation();
      onKeydownEsc(e);
      onClose({ e, trigger: 'keydownEsc' });
    }
  };

  const renderDialog = (classNames) => {
    const dest: any = {};
    if (props.width !== undefined) {
      dest.width = props.width;
    }

    const footer = props.footer ? <div className={`${prefixCls}__footer`}>{props.footer}</div> : null;

    const header = <div className={`${prefixCls}__header`}>{props.header}</div>;

    const body = <div className={`${prefixCls}__body`}>{props.body || props.children}</div>;

    const closer = closeBtn && (
      <span onClick={onCloseBtnClick} className={`${prefixCls}__close`}>
        {closeBtn}
      </span>
    );

    const style = { ...dest, ...props.style };
    let dialogOffset = { x: 0, y: 0 };
    const onDialogMove = (e: MouseEvent) => {
      const { style, offsetWidth, offsetHeight, clientHeight, clientWidth } = dialog.current;
      const halfHeight = clientHeight / 2;
      const halfWidth = clientWidth / 2;

      let diffX = e.clientX - dialogOffset.x;
      let diffY = e.clientY - dialogOffset.y;

      if (diffX < halfWidth) {
        diffX = halfWidth;
      }
      if (diffX > window.innerWidth - offsetWidth + halfWidth) {
        diffX = window.innerWidth - offsetWidth + halfWidth;
      }

      if (diffY < halfHeight) {
        diffY = halfHeight;
      }

      if (diffY > window.innerHeight - offsetHeight + halfHeight) {
        diffY = window.innerHeight - offsetHeight + halfHeight;
      }
      style.left = `${diffX}px`;
      style.top = `${diffY}px`;
    };

    const onDialogMoveEnd = () => {
      dialog.current.style.cursor = 'default';
      document.removeEventListener('mousemove', onDialogMove);
      document.removeEventListener('mouseup', onDialogMoveEnd);
    };

    const onDialogMoveStart = (e: React.MouseEvent<HTMLDivElement>) => {
      if (canDraggable) {
        const { offsetLeft, offsetTop } = dialog.current;
        dialog.current.style.cursor = 'move';
        const diffX = e.clientX - offsetLeft;
        const diffY = e.clientY - offsetTop;
        dialogOffset = {
          x: diffX,
          y: diffY,
        };

        document.addEventListener('mousemove', onDialogMove);
        document.addEventListener('mouseup', onDialogMoveEnd);
      }
    };

    const dialogElement = (
      <div
        ref={dialog}
        style={style}
        className={`${prefixCls}${` ${prefixCls}--default`} ${classNames}`}
        onMouseDown={onDialogMoveStart}
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
          <div key="mask" onClick={onMaskClick} className={`${prefixCls}-mask`} />
        </CSSTransition>
      );
    }
    return maskElement;
  };

  const render = () => {
    const style: CSSProperties = {};
    if (visible) {
      style.display = 'block';
    }
    const wrapStyle = {
      ...style,
      zIndex,
    };

    const dialogBody = renderDialog(`${props.placement ? `${prefixCls}--${props.placement}` : ''}`);
    const wrapClass = classnames(props.className, `${prefixCls}-ctx`, `${prefixCls}-ctx--fixed`);
    const dialog = (
      <div ref={wrap} className={wrapClass} style={wrapStyle} onKeyDown={onKeyDown}>
        {mode === 'modal' && renderMask()}
        {dialogBody}
      </div>
    );

    let dom = null;

    if (visible || wrap.current) {
      if (getContainer === false) {
        dom = dialog;
      } else {
        dom = <Portal getContainer={getContainer}>{dialog}</Portal>;
      }
    }

    return dom;
  };

  return render();
};

export default RenderDialog;
