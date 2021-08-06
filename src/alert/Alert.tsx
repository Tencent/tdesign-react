import React, { forwardRef } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import CloseIcon from '../icon/icons/CloseIcon';
import InfoCircleFilledIcon from '../icon/icons/InfoCircleFilledIcon';
import CheckCircleFilledIcon from '../icon/icons/CheckCircleFilledIcon';
import ErrorCircleFilledIcon from '../icon/icons/ErrorCircleFilledIcon';
import { TdAlertProps } from '../_type/components/alert';
import { StyledProps } from '../_type';

export interface AlertProps extends TdAlertProps, StyledProps {}

const Alert = forwardRef((props: AlertProps, ref: React.Ref<HTMLDivElement>) => {
  const { message, title, operation, theme = 'info', icon, close, maxLine, onClose = noop, ...alertProps } = props;

  const [closed, setClosed] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const { classPrefix } = useConfig();
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
        className: classNames(`${classPrefix}-alert__icon`, {
          [icon.props.className]: icon.props.className,
        }),
      });
    }
    return React.createElement(iconMap[theme], {
      className: `${classPrefix}-alert__icon`,
    });
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
              {!collapsed ? '展开更多' : '收起'}
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
      className={classNames(`${classPrefix}-alert`, {
        [`${classPrefix}-alert--${theme}`]: true,
      })}
      {...alertProps}
    >
      {renderIconNode()}
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

export default Alert;
