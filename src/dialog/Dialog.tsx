import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdDialogProps, DialogInstance } from './type';
import { StyledProps } from '../common';
import Portal from '../common/Portal';
import useSetState from '../_util/useSetState';
import useConfig from '../hooks/useConfig';
import { dialogDefaultProps } from './defaultProps';
import DialogCard from './DialogCard';
import useDialogEsc from './hooks/useDialogEsc';
import useLockStyle from './hooks/useLockStyle';
import useDialogPosition from './hooks/useDialogPosition';
import useDialogDrag from './hooks/useDialogDrag';
import { parseValueToPx } from './utils';
import log from '../_common/js/log';

export interface DialogProps extends TdDialogProps, StyledProps {
  isPlugin?: boolean; // 是否以插件形式调用
}

const Dialog = forwardRef((props: DialogProps, ref: React.Ref<DialogInstance>) => {
  const { classPrefix } = useConfig();

  const componentCls = `${classPrefix}-dialog`;
  const wrapRef = useRef<HTMLDivElement>();
  const maskRef = useRef();
  const contentClickRef = useRef(false);
  const dialogCardRef = useRef();
  const dialogPosition = useRef();
  const portalRef = useRef();
  const [state, setState] = useSetState<DialogProps>({ isPlugin: false, ...props });
  const [local] = useLocaleReceiver('dialog');

  const {
    style,
    width,
    mode,
    zIndex,
    visible,
    attach,
    onOpened,
    onCancel,
    onConfirm,
    onClose,
    onClosed,
    isPlugin,
    draggable,
    onOverlayClick,
    onEscKeydown,
    closeOnEscKeydown,
    confirmOnEnter,
    showOverlay,
    showInAttachedElement,
    closeOnOverlayClick,
    destroyOnClose,
    preventScrollThrough,
    ...restState
  } = state;

  useLockStyle({ preventScrollThrough, visible, mode, showInAttachedElement });
  useDialogEsc(visible, wrapRef);
  useDialogPosition(visible, dialogCardRef);
  const { onDialogMoveStart } = useDialogDrag({
    dialogCardRef,
    contentClickRef,
    canDraggable: draggable && mode === 'modeless',
  });

  useEffect(() => {
    if (isPlugin) return;
    // 插件式调用不会更新props, 只有组件式调用才会更新props
    setState((prevState) => ({ ...prevState, ...props }));
  }, [props, setState, isPlugin]);

  useImperativeHandle(ref, () => ({
    show() {
      setState({ visible: true });
    },
    hide() {
      setState({ visible: false });
    },
    destroy() {
      setState({ visible: false, destroyOnClose: true });
    },
    update(newOptions) {
      setState((prevState) => ({ ...prevState, ...newOptions }));
    },
  }));

  // @ts-ignore 兼容旧版本 2.0 移除
  if (props.mode === 'normal') {
    log.error('Dialog', 'mode="normal" is not supported, please use DialogCard.');
    return <DialogCard {...props} />;
  }

  const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showOverlay && (closeOnOverlayClick ?? local.closeOnOverlayClick)) {
      // 判断点击事件初次点击是否为内容区域
      if (contentClickRef.current) {
        contentClickRef.current = false;
      } else if (e.target === dialogPosition.current) {
        onOverlayClick?.({ e });
        onClose?.({ e, trigger: 'overlay' });
      }
    }
  };

  const handleCancel = ({ e }) => {
    onCancel?.({ e });
    onClose?.({ e, trigger: 'cancel' });
  };

  const handleClose = ({ e }) => {
    onClose?.({ e, trigger: 'close-btn' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    if (e.key === 'Escape') {
      e.stopPropagation();
      onEscKeydown?.({ e });
      if (closeOnEscKeydown ?? local.closeOnEscKeydown) {
        onClose?.({ e, trigger: 'esc' });
      }
    } else if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      // 回车键触发点击确认事件
      e.stopPropagation();
      confirmOnEnter && onConfirm?.({ e });
    }
  };

  const onAnimateLeave = () => {
    onClosed?.();

    if (!wrapRef.current) return;
    wrapRef.current.style.display = 'none';
  };

  const onAnimateStart = () => {
    onOpened?.();

    if (!wrapRef.current) return;
    wrapRef.current.style.display = 'block';
  };

  const renderMask = () => {
    if (mode !== 'modal') return null;

    return showOverlay ? (
      <CSSTransition
        in={visible}
        appear
        timeout={300}
        classNames={`${componentCls}-fade`}
        mountOnEnter
        unmountOnExit
        nodeRef={maskRef}
      >
        <div ref={maskRef} className={`${componentCls}__mask`} />
      </CSSTransition>
    ) : null;
  };

  return (
    <CSSTransition
      in={visible}
      appear
      timeout={300}
      mountOnEnter
      unmountOnExit={destroyOnClose}
      nodeRef={portalRef}
      onEnter={onAnimateStart}
      onExited={onAnimateLeave}
    >
      <Portal attach={attach} ref={portalRef}>
        <div
          ref={wrapRef}
          className={classNames(props.className, `${componentCls}__ctx`, `${componentCls}__${mode}`, {
            [`${componentCls}__ctx--fixed`]: !showInAttachedElement,
            [`${componentCls}__ctx--absolute`]: showInAttachedElement,
          })}
          style={{ ...style, zIndex, width: parseValueToPx(width) }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {renderMask()}
          <div className={`${componentCls}__wrap`}>
            <div
              ref={dialogPosition}
              className={classNames(`${componentCls}__position`, {
                [`${componentCls}--top`]: !!props.top,
                [`${componentCls}--${props.placement}`]: props.placement && !props.top,
              })}
              style={{ paddingTop: parseValueToPx(props.top) }}
              onClick={onMaskClick}
            >
              <CSSTransition
                in={visible}
                appear
                mountOnEnter
                timeout={300}
                classNames={`${componentCls}-zoom`}
                nodeRef={dialogCardRef}
              >
                <DialogCard
                  ref={dialogCardRef}
                  {...restState}
                  onConfirm={onConfirm}
                  onCancel={handleCancel}
                  onCloseBtnClick={handleClose}
                  onMouseDown={onDialogMoveStart}
                />
              </CSSTransition>
            </div>
          </div>
        </div>
      </Portal>
    </CSSTransition>
  );
});

Dialog.displayName = 'Dialog';
Dialog.defaultProps = dialogDefaultProps;

export default Dialog;
