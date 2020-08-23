import React, { forwardRef } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { CloseIcon, PromptFillIcon, SuccessFillIcon, WarningFillIcon } from '../icon';

export interface AlertProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  /**
   * 告警主要内容
   */
  message: React.ReactNode;

  /**
   * 告警内容主题
   */
  title?: React.ReactNode;

  /**
   * 跟在告警内容后面的操作区
   */
  operation?: React.ReactNode;

  /**
   * 类型
   * @default 'info'
   */
  theme?: 'success' | 'info' | 'warning' | 'error';

  /**
   * 是否显示图标
   */
  icon?: boolean | React.ReactNode;

  /**
   * 是否显示关闭按钮
   * @default false
   */
  close?: boolean | string | React.ReactNode;

  /**
   * 内容显示最大行数
   * @default 0
   */
  maxLine?: number;

  /**
   * 点击关闭之前调用
   * @default () => true
   */
  beforeClose?: (resolve) => void;
}

const Alert = forwardRef((props: AlertProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    message,
    title,
    operation,
    theme = 'info',
    icon,
    close,
    maxLine,
    beforeClose,
    onClose = noop,
    ...alertProps
  } = props;

  const [closed, setClosed] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const { classPrefix } = useConfig();
  const iconMap = {
    success: SuccessFillIcon,
    info: PromptFillIcon,
    error: WarningFillIcon,
    warning: WarningFillIcon,
  };

  const handleClose = () => {
    if (beforeClose) {
      const fn = new Promise((resolve) => {
        beforeClose(resolve);
      });
      fn.then((value) => {
        if (value) {
          setClosed(true);
          onClose?.();
        }
      });
    } else {
      setClosed(true);
      onClose?.();
    }
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const renderIconNode = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        className: classNames(`${classPrefix}-alert__icon`, {
          [(icon as any).props.className]: (icon as any).props.className,
        }),
      });
    }
    return React.createElement(iconMap[theme], {
      className: `${classPrefix}-alert__icon`,
    });
  };

  const renderMessage = () => {
    if (+maxLine > 0 && Object.prototype.toString.call(message) === '[object Array]') {
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
      {icon ? renderIconNode() : null}
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
