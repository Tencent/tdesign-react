import React, { forwardRef, isValidElement } from 'react';
import {
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
} from 'tdesign-icons-react';
import classNames from 'classnames';
import { isFunction, isObject, isString } from 'lodash-es';

import parseTNode from '../_util/parseTNode';
import Button, { type ButtonProps } from '../button';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { dialogCardDefaultProps } from './defaultProps';

import type { TdDialogCardProps } from './type';
import type { StyledProps } from '../common';

export interface DialogCardProps extends TdDialogCardProps, StyledProps, React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  mode?: 'modal' | 'modeless' | 'full-screen';
}

const renderDialogButton = (btn: DialogCardProps['cancelBtn'], defaultProps: ButtonProps) => {
  let result = null;

  if (isString(btn)) {
    result = <Button {...defaultProps}>{btn}</Button>;
  } else if (isValidElement(btn)) {
    result = btn;
  } else if (isObject(btn)) {
    result = <Button {...defaultProps} {...(btn as ButtonProps)} />;
  } else if (isFunction(btn)) {
    result = btn();
  }

  return result;
};

const DialogCard = forwardRef<HTMLDivElement, DialogCardProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const componentCls = `${classPrefix}-dialog`;
  const { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
  });
  const [local, t] = useLocaleReceiver('dialog');
  const confirmText = t(local.confirm);
  const cancelText = t(local.cancel);

  const {
    theme,
    header,
    closeBtn,
    footer,
    body,
    children,
    className,
    onCancel,
    onConfirm,
    onCloseBtnClick,
    cancelBtn = cancelText,
    confirmBtn = confirmText,
    confirmLoading,
    mode,
    ...otherProps
  } = useDefaultProps<DialogCardProps>(props, dialogCardDefaultProps);

  const isFullScreen = mode === 'full-screen';

  const renderHeaderContent = () => {
    const iconMap = {
      info: <InfoCircleFilledIcon className={`${classPrefix}-is-info`} />,
      warning: <InfoCircleFilledIcon className={`${classPrefix}-is-warning`} />,
      // error is going to deprecated
      error: <InfoCircleFilledIcon className={`${classPrefix}-is-error`} />,
      danger: <InfoCircleFilledIcon className={`${classPrefix}-is-error`} />,
      success: <CheckCircleFilledIcon className={`${classPrefix}-is-success`} />,
    };

    return (
      <div className={`${componentCls}__header-content`}>
        {iconMap[theme]}
        {header}
      </div>
    );
  };

  const renderCloseBtn = () => {
    if (!closeBtn) {
      return null;
    }

    const closeIcon = () => (closeBtn === true ? <CloseIcon /> : closeBtn);

    return (
      <span
        className={classNames(`${componentCls}__close`, {
          [`${componentCls}__close--fullscreen`]: isFullScreen,
        })}
        style={{
          marginLeft: 'auto',
        }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => onCloseBtnClick?.({ e })}
      >
        {closeIcon()}
      </span>
    );
  };

  const renderHeader = () => (
    <div
      className={classNames(`${componentCls}__header`, {
        [`${componentCls}__header--fullscreen`]: isFullScreen,
      })}
    >
      {renderHeaderContent()}
      {renderCloseBtn()}
    </div>
  );

  const renderFooter = () => {
    const defaultFooter = () => {
      const renderCancelBtn = renderDialogButton(cancelBtn, {
        variant: 'outline',
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => onCancel?.({ e }),
        className: classNames(`${componentCls}__cancel`, cancelBtn?.props?.className),
      });
      const renderConfirmBtn = renderDialogButton(confirmBtn, {
        theme: 'primary',
        loading: confirmLoading,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => onConfirm?.({ e }),
        className: classNames(`${componentCls}__confirm`, confirmBtn?.className),
      });

      return (
        <>
          {renderCancelBtn}
          {renderConfirmBtn}
        </>
      );
    };

    return (
      <div
        className={classNames(`${componentCls}__footer`, {
          [`${componentCls}__footer--fullscreen`]: isFullScreen,
        })}
      >
        {parseTNode(footer, null, defaultFooter())}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      {...otherProps}
      className={classNames(
        componentCls,
        `${componentCls}--default`,
        {
          [`${componentCls}__fullscreen`]: isFullScreen,
        },
        className,
      )}
    >
      {!!header && renderHeader()}
      <div
        className={classNames(`${componentCls}__body`, {
          [`${componentCls}__body--fullscreen`]: isFullScreen && !!footer,
          [`${componentCls}__body--fullscreen--without-footer`]: isFullScreen && !footer,
        })}
      >
        {body || children}
      </div>
      {!!footer && renderFooter()}
    </div>
  );
});

DialogCard.displayName = 'DialogCard';

export default DialogCard;
