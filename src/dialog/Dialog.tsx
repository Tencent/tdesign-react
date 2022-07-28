import React, { forwardRef, useEffect, useMemo, useRef, isValidElement } from 'react';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
} from 'tdesign-icons-react';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Button, { ButtonProps } from '../button';
import { TdDialogProps, DialogInstance } from './type';
import { StyledProps } from '../common';
import noop from '../_util/noop';
import RenderDialog from './RenderDialog';
import useSetState from '../_util/useSetState';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { dialogDefaultProps } from './defaultProps';

export interface DialogProps extends TdDialogProps, StyledProps {
  /**
   * 是否以插件形式调用
   */
  isPlugin?: boolean;
}

const renderDialogButton = (btn: TdDialogProps['cancelBtn'], defaultProps: ButtonProps) => {
  let result = null;

  if (isString(btn)) {
    result = <Button {...defaultProps}>{btn}</Button>;
  } else if (isValidElement(btn)) {
    result = btn;
  } else if (isObject(btn)) {
    result = <Button {...defaultProps} {...(btn as {})} />;
  } else if (isFunction(btn)) {
    result = btn();
  }

  return result;
};

const Dialog = forwardRef((props: DialogProps, ref: React.Ref<DialogInstance>) => {
  const { classPrefix } = useConfig();
  const { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
  });
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
    attach,
    closeBtn,
    footer = true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.header, state.theme, prefixCls, classPrefix]);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCancel({ e });
    onClose({ e, trigger: 'cancel' });
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm({ e });
  };

  const defaultFooter = () => {
    const renderCancelBtn = renderDialogButton(cancelBtn, { variant: 'outline' });
    const renderConfirmBtn = renderDialogButton(confirmBtn, { theme: 'primary' });

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
      footer={footer === true ? defaultFooter() : footer}
      ref={dialogDom}
    />
  );
});

Dialog.displayName = 'Dialog';
Dialog.defaultProps = dialogDefaultProps;

export default Dialog;
