import React, { useLayoutEffect, useRef, CSSProperties, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import Portal from '../common/Portal';
import { AttachNode } from '../common';
import noop from '../_util/noop';
import { DialogProps } from './Dialog';

enum KeyCode {
  ESC = 27,
}

export interface RenderDialogProps extends DialogProps {
  prefixCls?: string;
  classPrefix: string;
  getContainer?: React.ReactElement | AttachNode | boolean;
}

const transitionTime = 300;
let mousePosition: { x: number; y: number } | null;
const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};
if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  document.documentElement.addEventListener('click', getClickPosition, true);
}
const RenderDialog: React.FC<RenderDialogProps> = (props) => {
  const {
    prefixCls,
    getContainer,
    visible,
    mode,
    zIndex,
    showOverlay,
    onEscKeydown = noop,
    onClosed = noop,
    onClose = noop,
    onCloseBtnClick = noop,
    onOverlayClick = noop,
    preventScrollThrough,
    closeBtn,
  } = props;
  const wrap = useRef<HTMLDivElement>();
  const dialog = useRef<HTMLDivElement>();
  const maskRef = useRef<HTMLDivElement>();
  const bodyOverflow = useRef<string>(document.body.style.overflow);
  const bodyCssTextRef = useRef<string>(document.body.style.cssText);
  const isModal = mode === 'modal';
  const canDraggable = props.draggable && mode === 'modeless';

  useLayoutEffect(() => {
    if (visible) {
      if (isModal && bodyOverflow.current !== 'hidden' && preventScrollThrough) {
        const scrollWidth = window.innerWidth - document.body.offsetWidth;
        // 减少回流
        if (bodyCssTextRef.current === '') {
          let bodyCssText = 'overflow: hidden;';
          if (scrollWidth > 0) {
            bodyCssText += `position: relative;width: calc(100% - ${scrollWidth}px);`;
          }
          document.body.style.cssText = bodyCssText;
        } else {
          if (scrollWidth > 0) {
            document.body.style.width = `calc(100% - ${scrollWidth}px)`;
            document.body.style.position = 'relative';
          }
          document.body.style.overflow = 'hidden';
        }
      }
      if (wrap.current) {
        wrap.current.focus();
      }
    } else if (isModal) {
      document.body.style.cssText = bodyCssTextRef.current;
    }
  }, [preventScrollThrough, getContainer, visible, mode, isModal]);

  useEffect(() => {
    if (visible) {
      if (mousePosition && dialog.current) {
        dialog.current.style.transformOrigin = `${mousePosition.x - dialog.current.offsetLeft}px ${
          mousePosition.y - dialog.current.offsetTop
        }px`;
      }
    }
  }, [visible]);

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
      onOverlayClick({ e });
      onClose({ e, trigger: 'overlay' });
    }
  };

  const handleCloseBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onCloseBtnClick({ e });
    onClose({ e, trigger: 'close-btn' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    if (+e.code === KeyCode.ESC || e.keyCode === KeyCode.ESC) {
      e.stopPropagation();
      onEscKeydown({ e });
      onClose({ e, trigger: 'esc' });
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
      <span onClick={handleCloseBtnClick} className={`${prefixCls}__close`}>
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
        className={classnames(`${prefixCls}`, `${prefixCls}--default`, classNames)}
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
        nodeRef={dialog}
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
          classNames={`${prefixCls}-dialog-fade`}
          mountOnEnter
          unmountOnExit
          key="mask"
          nodeRef={maskRef}
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
      <div ref={wrap} className={wrapClass} style={wrapStyle} onKeyDown={handleKeyDown}>
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
