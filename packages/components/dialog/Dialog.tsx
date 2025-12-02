import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { isUndefined } from 'lodash-es';
import log from '@tdesign/common-js/log/index';
import { pxCompat } from '@tdesign/common-js/utils/helper';
import Portal from '../common/Portal';
import useAttach from '../hooks/useAttach';
import useConfig from '../hooks/useConfig';
import useDeepEffect from '../hooks/useDeepEffect';
import useDefaultProps from '../hooks/useDefaultProps';
import useSetState from '../hooks/useSetState';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { dialogDefaultProps } from './defaultProps';
import DialogCard from './DialogCard';
import useDialogDrag from './hooks/useDialogDrag';
import useDialogEsc from './hooks/useDialogEsc';
import useDialogPosition from './hooks/useDialogPosition';
import useLockStyle from './hooks/useLockStyle';

import type { StyledProps } from '../common';
import type { DialogInstance, TdDialogProps } from './type';

export interface DialogProps extends TdDialogProps, StyledProps {
  isPlugin?: boolean; // 是否以插件形式调用
}

const Dialog = forwardRef<DialogInstance, DialogProps>((originalProps, ref) => {
  const props = useDefaultProps<DialogProps>(originalProps, dialogDefaultProps);
  const { children, ...restProps } = props;

  const { classPrefix } = useConfig();
  const componentCls = `${classPrefix}-dialog`;

  const wrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentClickRef = useRef(false);
  const dialogCardRef = useRef<HTMLDivElement>(null);
  const dialogPosition = useRef(null);
  const portalRef = useRef(null);

  const [state, setState] = useSetState<DialogProps>({ isPlugin: false, ...restProps });
  const [local] = useLocaleReceiver('dialog');

  const {
    className,
    dialogClassName,
    style,
    width,
    mode,
    zIndex,
    visible,
    attach,
    onBeforeOpen,
    onBeforeClose,
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
    onCloseBtnClick,
    forceRender,
    lazy,
    ...restState
  } = state;

  const isModeless = mode === 'modeless';
  const isFullScreen = mode === 'full-screen';

  const dialogAttach = useAttach('dialog', attach);

  useLockStyle({ preventScrollThrough, visible, mode, showInAttachedElement });
  useDialogEsc(visible, wrapRef);
  useDialogPosition(visible, dialogCardRef);
  const { isInputInteracting } = useDialogDrag({
    dialogCardRef,
    canDraggable: !isFullScreen && draggable,
  });

  useDeepEffect(() => {
    if (isPlugin) return;
    // 插件式调用不会更新props, 只有组件式调用才会更新props
    setState((prevState) => ({ ...prevState, ...props }));
  }, [props, setState]);

  useImperativeHandle(ref, () => ({
    show() {
      setState({ visible: true });
    },
    hide() {
      setState({ visible: false });
    },
    setConfirmLoading: (loading: boolean) => {
      setState({ confirmLoading: loading });
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
    if (isModeless || isInputInteracting) return;

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
    onCloseBtnClick?.({ e });
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
    if (!wrapRef.current) return;
    onBeforeOpen?.();
    wrapRef.current.style.display = 'block';
  };

  const onInnerAnimateStart = () => {
    if (!dialogCardRef.current) return;
    dialogCardRef.current.style.display = 'block';
  };

  const onInnerAnimateLeave = () => {
    if (!dialogCardRef.current) return;
    dialogCardRef.current.style.display = 'none';
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
      mountOnEnter={isUndefined(forceRender) ? lazy : !forceRender}
      unmountOnExit={destroyOnClose}
      nodeRef={portalRef}
      onEnter={onAnimateStart}
      onEntered={onOpened}
      onExit={() => onBeforeClose?.()}
      onExited={onAnimateLeave}
    >
      <Portal attach={dialogAttach} ref={portalRef}>
        <div
          ref={wrapRef}
          className={classNames(className, `${componentCls}__ctx`, `${componentCls}__${mode}`, {
            [`${componentCls}__ctx--fixed`]: !showInAttachedElement,
            [`${componentCls}__ctx--absolute`]: showInAttachedElement,
            [`${componentCls}__ctx--modeless`]: isModeless,
          })}
          style={{ zIndex, display: 'none' }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {renderMask()}
          <div className={`${componentCls}__wrap`}>
            <div
              ref={dialogPosition}
              className={classNames(
                isFullScreen ? `${componentCls}__position_fullscreen` : `${componentCls}__position`,
                {
                  [`${componentCls}--top`]: !isFullScreen && (!!props.top || props.placement === 'top'),
                  [`${componentCls}--center`]: !isFullScreen && props.placement === 'center' && !props.top,
                },
              )}
              style={{ paddingTop: isFullScreen ? undefined : pxCompat(props.top) }}
              onClick={onMaskClick}
            >
              <CSSTransition
                in={visible}
                appear
                timeout={300}
                classNames={`${componentCls}-zoom`}
                nodeRef={dialogCardRef}
                onEnter={onInnerAnimateStart}
                onExited={onInnerAnimateLeave}
              >
                <DialogCard
                  ref={dialogCardRef}
                  {...restState}
                  mode={mode}
                  className={dialogClassName}
                  style={{ ...style, width: pxCompat(width || style?.width) }}
                  onConfirm={onConfirm}
                  onCancel={handleCancel}
                  onCloseBtnClick={handleClose}
                >
                  {children}
                </DialogCard>
              </CSSTransition>
            </div>
          </div>
        </div>
      </Portal>
    </CSSTransition>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
