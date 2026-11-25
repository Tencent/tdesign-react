import React, { isValidElement, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { get, isArray, isFunction, isObject, isString } from 'lodash-es';
import { CloseIcon } from 'tdesign-icons-react';

import parseTNode from '../_util/parseTNode';
import Button from '../button';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import Popup from '../popup';
import { dialogDefaultProps } from './defaultProps';

import type { ReactNode } from 'react';
import type { ButtonProps } from '../button';
import type { StyledProps } from '../common';
import type { TdDialogProps } from './type';

export interface DialogProps extends TdDialogProps, StyledProps {
  children?: ReactNode;
}

export const Dialog: React.FC<DialogProps> = (props) => {
  const {
    className,
    showOverlay,
    destroyOnClose,
    onOverlayClick,
    overlayProps,
    closeOnOverlayClick,
    buttonLayout,
    onClose,
    visible,
    title,
    content,
    children,
    actions,
    cancelBtn,
    confirmBtn,
    onCancel,
    onClosed,
    onConfirm,
    preventScrollThrough,
    zIndex,
    style,
    width,
    closeBtn,
    middle,
    top,
  } = useDefaultProps(props, dialogDefaultProps);

  const dialogClass = usePrefixClass('dialog');
  const rootStyles = useMemo(() => ({ width: isString(width) ? width : `${width}px` }), [width]);
  const isTextStyleBtn = useMemo(
    () => [confirmBtn, cancelBtn, ...(actions || [])].some((item) => get(item, 'variant') === 'text'),
    [actions, cancelBtn, confirmBtn],
  );
  const footerClass = useMemo(
    () =>
      classNames(`${dialogClass}__footer`, {
        [`${dialogClass}__footer--column`]: buttonLayout === 'vertical',
        [`${dialogClass}__footer--full`]: isTextStyleBtn && get(actions, 'length', 0) === 0,
      }),
    [actions, buttonLayout, dialogClass, isTextStyleBtn],
  );
  const buttonClass = useMemo(
    () =>
      classNames(`${dialogClass}__button`, {
        [`${dialogClass}__button--${buttonLayout}`]: !isTextStyleBtn,
        [`${dialogClass}__button--text`]: isTextStyleBtn,
      }),
    [buttonLayout, dialogClass, isTextStyleBtn],
  );

  const [active, setActive] = useState(visible);
  useEffect(() => {
    setActive(visible);
  }, [visible]);

  // 蒙层点击事件
  const onOverlayClickHandle = useCallback(
    (e) => {
      if (typeof onOverlayClick === 'function') {
        onOverlayClick({ e });
      }

      if (closeOnOverlayClick && typeof onClose === 'function') {
        onClose({ trigger: 'overlay', e });
      }
    },
    [onOverlayClick, closeOnOverlayClick, onClose],
  );

  const onCloseButtonClickHandle = useCallback(
    (e) => {
      if (typeof onClose === 'function') {
        onClose({ trigger: 'close-btn', e });
      }
    },
    [onClose],
  );

  const onCancelButtonClickHandle = useCallback(
    (e) => {
      if (typeof onClose === 'function') {
        onClose({ trigger: 'cancel', e });
      }
      if (typeof onCancel === 'function') {
        onCancel({ e });
      }
    },
    [onCancel, onClose],
  );

  const onConfirmButtonClickHandle = useCallback(
    (e) => {
      if (typeof onConfirm === 'function') {
        onConfirm(e);
      }
    },
    [onConfirm],
  );

  const renderContentNode = () => {
    const contentNode = parseTNode(children, null, parseTNode(content));
    if (!contentNode) {
      return null;
    }

    return (
      <div className={`${dialogClass}__body`}>
        <div className={`${dialogClass}__body-text`}>{contentNode}</div>
      </div>
    );
  };

  const renderDialogButton = (btn: DialogProps['cancelBtn'] | DialogProps['actions'], defaultProps: ButtonProps) => {
    let result = null;

    if (isString(btn)) {
      result = <Button {...defaultProps}>{btn}</Button>;
    } else if (isArray(btn)) {
      result = btn.map((item) => renderDialogButton(item, { ...defaultProps }));
    } else if (isValidElement(btn)) {
      result = btn;
    } else if (isObject(btn)) {
      result = <Button {...defaultProps} {...(btn as ButtonProps)} />;
    } else if (isFunction(btn)) {
      result = btn();
    }

    return result;
  };

  const renderFooter = () => {
    const renderActionsNode = () => {
      const renderActionsBtn = renderDialogButton(actions, {
        className: buttonClass,
        onClick: onCancelButtonClickHandle,
      });

      return <>{renderActionsBtn}</>;
    };

    const defaultFooter = () => {
      const renderCancelBtn = renderDialogButton(cancelBtn, {
        className: buttonClass,
        theme: isTextStyleBtn ? 'default' : 'light',
        onClick: onCancelButtonClickHandle,
      });
      const renderConfirmBtn = renderDialogButton(confirmBtn, {
        className: buttonClass,
        theme: 'primary',
        onClick: onConfirmButtonClickHandle,
      });

      return (
        <>
          {renderCancelBtn}
          {renderConfirmBtn}
        </>
      );
    };
    return <>{actions ? renderActionsNode() : defaultFooter()}</>;
  };

  return (
    <Popup
      visible={active}
      placement="center"
      showOverlay={showOverlay}
      preventScrollThrough={preventScrollThrough}
      overlayProps={overlayProps}
      destroyOnClose={destroyOnClose}
      zIndex={zIndex}
      onClose={onOverlayClickHandle}
      onClosed={onClosed}
    >
      <div className={`${dialogClass} ${className}`} style={{ ...rootStyles, ...style }}>
        {parseTNode(top)}
        {closeBtn && (
          <div className={`${dialogClass}__close-btn`}>
            <CloseIcon onClick={onCloseButtonClickHandle} />
          </div>
        )}
        <div className={`${dialogClass}__content`}>
          {title && <div className={`${dialogClass}__header`}>{parseTNode(title)}</div>}
          {renderContentNode()}
        </div>
        {parseTNode(middle)}
        <div className={footerClass}>{renderFooter()}</div>
      </div>
    </Popup>
  );
};

Dialog.displayName = 'Dialog';

export default Dialog;
