import React, { forwardRef } from 'react';
import classNames from 'classnames';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdAlertProps } from './type';
import { StyledProps } from '../common';
import { alertDefaultProps } from './defaultProps';

export interface AlertProps extends TdAlertProps, StyledProps {}

const Alert = forwardRef((props: AlertProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const [local, t] = useLocaleReceiver('alert');
  const { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });

  const { message, title, operation, theme, icon, close, maxLine, onClose, className, ...alertProps } = props;

  const [closed, setClosed] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const iconMap = {
    success: CheckCircleFilledIcon,
    info: InfoCircleFilledIcon,
    error: ErrorCircleFilledIcon,
    warning: ErrorCircleFilledIcon,
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    setClosed(true);
    onClose?.({ e });
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const renderIconNode = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement, {
        className: classNames({
          [icon.props.className]: icon.props.className,
        }),
      });
    }
    return React.createElement(iconMap[theme] || iconMap.info);
  };

  const renderMessage = () => {
    if (+maxLine > 0 && Array.isArray(message)) {
      return (
        <div className={`${classPrefix}-alert__description`}>
          {message.map((item, index) => {
            if (!collapsed) {
              if (index < maxLine) {
                return <div key={index}>{item}</div>;
              }
            } else {
              return <div key={index}>{item}</div>;
            }
            return true;
          })}
          {+maxLine > 0 ? (
            <div className={`${classPrefix}-alert__collapse`} onClick={handleCollapse}>
              {!collapsed ? t(local.expandText) : t(local.collapseText)}
            </div>
          ) : null}
        </div>
      );
    }
    return <div className={`${classPrefix}-alert__description`}>{message}</div>;
  };

  const renderClose = () => (
    <div className={`${classPrefix}-alert__close`} onClick={handleClose}>
      {typeof close === 'boolean' ? <CloseIcon /> : close}
    </div>
  );

  return closed ? null : (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-alert`, `${classPrefix}-alert--${theme}`, className)}
      {...alertProps}
    >
      <div className={`${classPrefix}-alert__icon`}>{renderIconNode()}</div>
      <div className={`${classPrefix}-alert__content`}>
        {title ? <div className={`${classPrefix}-alert__title`}>{title}</div> : null}
        <div className={`${classPrefix}-alert__message`}>
          {renderMessage()}
          {operation ? <div className={`${classPrefix}-alert__operation`}>{operation}</div> : null}
        </div>
      </div>
      {close ? renderClose() : null}
    </div>
  );
});

Alert.displayName = 'Alert';
Alert.defaultProps = alertDefaultProps;

export default Alert;
