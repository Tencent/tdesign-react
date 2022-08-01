import React, { forwardRef, useContext } from 'react';
import classNames from 'classnames';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
} from 'tdesign-icons-react';
import { NotificationRemoveContext } from './NotificationList';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';

import { NotificationInstance, TdNotificationProps } from './type';
import { Styles } from '../common';
import { notificationDefaultProps } from './defaultProps';

export interface NotificationProps extends TdNotificationProps {
  style?: Styles;
  id?: string;
}

export const Notification = forwardRef<any, NotificationProps>((props, ref) => {
  const {
    title,
    content,
    theme,
    icon,
    closeBtn,
    footer,
    duration,
    onCloseBtnClick = noop,
    onDurationEnd = noop,
    style,
    id,
  } = props;

  const { classPrefix } = useConfig();
  const { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
  });

  const remove = useContext(NotificationRemoveContext);
  React.useImperativeHandle(ref as React.Ref<NotificationInstance>, () => ({ close: () => remove(id) }));

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    let timer;
    if (duration > 0) {
      timer = setTimeout(() => {
        clearTimeout(timer);
        onDurationEnd();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const renderIcon = () => {
    const IconWrapper = ({ children }) => <div className={`${classPrefix}-notification__icon`}>{children}</div>;

    // 调整优先级，icon 优先级最高
    if (React.isValidElement(icon)) {
      return <IconWrapper>{icon}</IconWrapper>;
    }

    if (theme && theme === 'success') {
      return (
        <IconWrapper>
          <CheckCircleFilledIcon className={`${classPrefix}-is-success`} />
        </IconWrapper>
      );
    }
    if (theme && ['info', 'warning', 'error'].indexOf(theme) >= 0) {
      return (
        <IconWrapper>
          <InfoCircleFilledIcon className={`${classPrefix}-is-${theme}`} />
        </IconWrapper>
      );
    }
    return null;
  };

  return (
    <div
      className={classNames(`${classPrefix}-notification`, {
        [`${classPrefix}-is-${theme}`]: theme,
      })}
      style={style}
    >
      {renderIcon()}
      <div className={`${classPrefix}-notification__main`}>
        <div className={`${classPrefix}-notification__title__wrap`}>
          <span className={`${classPrefix}-notification__title`}>{title}</span>
          {((): React.ReactNode => {
            if (typeof closeBtn === 'boolean' && closeBtn) {
              return (
                <CloseIcon
                  className={`${classPrefix}-icon-close`}
                  onClick={(e) => {
                    onCloseBtnClick({ e });
                  }}
                />
              );
            }
            if (React.isValidElement(closeBtn)) {
              return (
                <div
                  onClick={(e) => {
                    onCloseBtnClick({ e });
                  }}
                >
                  {closeBtn}
                </div>
              );
            }
            return null;
          })()}
        </div>
        {((): React.ReactNode => {
          if (typeof content === 'string') {
            return <div className={`${classPrefix}-notification__content`}>{content}</div>;
          }
          if (React.isValidElement(content)) return content;
          return null;
        })()}
        {React.isValidElement(footer) && <div className={`${classPrefix}-notification__detail`}>{footer}</div>}
        {typeof footer === 'function' && <div className={`${classPrefix}-notification__detail`}>{footer()}</div>}
      </div>
    </div>
  );
});

Notification.displayName = 'Notification';
Notification.defaultProps = notificationDefaultProps;

export default Notification;
