import React from 'react';
import isString from 'lodash/isString';
import { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } from '../icon';
import { ConfigContext } from '../config-provider';
import Button from '../button';
import { TdDialogProps } from '../_type/components/dialog';
import { StyledProps } from '../_type';
import noop from '../_util/noop';
import RenderDialog from './RenderDialog';

export interface DialogProps extends TdDialogProps, StyledProps {}

const Dialog: React.FC<DialogProps> = (props) => {
  const { classPrefix } = React.useContext(ConfigContext);
  const {
    attach: getContainer = 'body',
    closeBtn,
    footer,
    onCancel = noop,
    onConfirm = noop,
    cancelBtn = '取消',
    confirmBtn = '确定',
    onClose = noop,
    ...restProps
  } = props;

  const prefixCls = `${classPrefix}-dialog`;
  const renderCloseIcon = () => {
    if (closeBtn === false) return null;
    if (closeBtn === true) return <CloseIcon style={{ verticalAlign: 'unset' }} />;
    return closeBtn || <CloseIcon style={{ verticalAlign: 'unset' }} />;
  };

  const renderHeader = () => {
    const { header, theme } = props;
    if (!header) return null;

    const iconMap = {
      info: <InfoCircleFilledIcon className="t-is-info" />,
      warning: <InfoCircleFilledIcon className="t-is-warning" />,
      error: <InfoCircleFilledIcon className="t-is-error" />,
      success: <CheckCircleFilledIcon className="t-is-success" />,
    };
    return (
      <div className={`${prefixCls}__header`}>
        {iconMap[theme]}
        {header}
      </div>
    );
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCancel({ e });
    onClose({ e, trigger: 'cancel' });
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm({ e });
  };

  const defaultFooter = () => {
    let renderCancelBtn = cancelBtn && <Button variant="outline">{isString(cancelBtn) ? cancelBtn : '取消'}</Button>;

    let renderConfirmBtn = confirmBtn && <Button theme="primary">{isString(confirmBtn) ? confirmBtn : '确定'}</Button>;

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
        {React.cloneElement(renderCancelBtn, {
          onClick: handleCancel,
          ...renderCancelBtn.props,
        })}
        {React.cloneElement(renderConfirmBtn, {
          onClick: handleConfirm,
          ...renderConfirmBtn.props,
        })}
      </>
    );
  };

  return (
    <RenderDialog
      {...restProps}
      prefixCls={prefixCls}
      header={renderHeader()}
      getContainer={getContainer}
      closeBtn={renderCloseIcon()}
      classPrefix={classPrefix}
      onClose={onClose}
      footer={footer === undefined ? defaultFooter() : footer}
    />
  );
};

Dialog.defaultProps = {
  width: 520,
  visible: false,
  zIndex: 2500,
  placement: 'center',
  mode: 'modal',
  showOverlay: true,
  destroyOnClose: false,
  draggable: false,
  preventScrollThrough: true,
};

export default Dialog;
