import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import isString from 'lodash/isString';
import { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } from 'tdesign-icons-react';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Button from '../button';
import { TdDialogProps, DialogInstance } from './type';
import { StyledProps } from '../common';
import noop from '../_util/noop';
import RenderDialog from './RenderDialog';
import useSetState from '../_util/useSetState';
import useConfig from '../_util/useConfig';
import { dialogDefaultProps } from './defaultProps';

export interface DialogProps extends TdDialogProps, StyledProps {
  /**
   * 是否以插件形式调用
   */
  isPlugin?: boolean;
}

const Dialog = forwardRef((props: DialogProps, ref: React.Ref<DialogInstance>) => {
  const { classPrefix } = useConfig();
  const dialogDom = useRef<HTMLDivElement>();
  const [state, setState] = useSetState<DialogProps>({
    width: 520,
    visible: false,
    zIndex: 2500,
    placement: 'center',
    mode: 'modal',
    showOverlay: true,
    destroyOnClose: false,
    draggable: false,
    preventScrollThrough: true,
    isPlugin: false,
    ...props,
  });

  const [local, t] = useLocaleReceiver('dialog');
  const confirmText = t(local.confirm);
  const cancelText = t(local.cancel);

  const {
    visible,
    attach = 'body',
    closeBtn,
    footer,
    onCancel = noop,
    onConfirm = noop,
    cancelBtn = cancelText,
    confirmBtn = confirmText,
    onClose = noop,
    isPlugin = false,
    ...restState
  } = state;

  useEffect(() => {
    // 插件式调用不会更新props, 只有组件式调用才会更新props
    if (!isPlugin) {
      setState((prevState) => ({
        ...prevState,
        ...props,
      }));
    }
  }, [props, setState, isPlugin]);

  const prefixCls = `${classPrefix}-dialog`;
  const renderCloseIcon = () => {
    if (closeBtn === false) return null;
    if (closeBtn === true) return <CloseIcon style={{ verticalAlign: 'unset' }} />;
    return closeBtn || <CloseIcon style={{ verticalAlign: 'unset' }} />;
  };

  React.useImperativeHandle(ref, () => ({
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
      setState((prevState) => ({
        ...prevState,
        ...(newOptions as DialogProps),
      }));
    },
  }));

  const renderHeader = useMemo(() => {
    if (!state.header) return null;

    const iconMap = {
      info: <InfoCircleFilledIcon className={`${classPrefix}-is-info`} />,
      warning: <InfoCircleFilledIcon className={`${classPrefix}-is-warning`} />,
      error: <InfoCircleFilledIcon className={`${classPrefix}-is-error`} />,
      success: <CheckCircleFilledIcon className={`${classPrefix}-is-success`} />,
    };
    return (
      <div className={`${prefixCls}__header`}>
        {iconMap[state.theme]}
        {state.header}
      </div>
    );
  }, [state.header, state.theme, prefixCls, classPrefix]);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCancel({ e });
    onClose({ e, trigger: 'cancel' });
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm({ e });
  };

  const defaultFooter = () => {
    let renderCancelBtn = cancelBtn && (
      <Button variant="outline">{isString(cancelBtn) ? cancelBtn : cancelText}</Button>
    );

    let renderConfirmBtn = confirmBtn && (
      <Button theme="primary">{isString(confirmBtn) ? confirmBtn : confirmText}</Button>
    );

    if (React.isValidElement(cancelBtn)) {
      renderCancelBtn = cancelBtn;
    }

    if (React.isValidElement(confirmBtn)) {
      renderConfirmBtn = confirmBtn;
    }

    if (typeof cancelBtn === 'function') {
      renderCancelBtn = cancelBtn();
    }

    if (typeof confirmBtn === 'function') {
      renderConfirmBtn = confirmBtn();
    }
    return (
      <>
        {renderCancelBtn &&
          React.cloneElement(renderCancelBtn, {
            onClick: handleCancel,
            ...renderCancelBtn.props,
          })}
        {renderConfirmBtn &&
          React.cloneElement(renderConfirmBtn, {
            onClick: handleConfirm,
            ...renderConfirmBtn.props,
          })}
      </>
    );
  };

  return (
    <RenderDialog
      {...restState}
      visible={visible}
      prefixCls={prefixCls}
      header={renderHeader}
      attach={attach}
      closeBtn={renderCloseIcon()}
      classPrefix={classPrefix}
      onClose={onClose}
      footer={footer === undefined ? defaultFooter() : footer}
      ref={dialogDom}
    />
  );
});

Dialog.displayName = 'Dialog';
Dialog.defaultProps = dialogDefaultProps;

export default Dialog;
