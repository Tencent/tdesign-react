import React, { forwardRef, useContext } from 'react';
import classNames from 'classnames';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
} from 'tdesign-icons-react';
import { NotificationRemoveContext } from './NotificationList';
import noop from '../_util/noop';
import renderTNode from '../_util/renderTNode';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { NotificationInstance, TdNotificationProps } from './type';
import { StyledProps } from '../common';
import { notificationDefaultProps } from './defaultProps';

export interface NotificationProps extends TdNotificationProps, StyledProps {
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
    className,
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
    if (typeof icon === 'boolean' && !icon) return null;

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

  const renderCloseBtn = () => {
    if (typeof closeBtn === 'boolean') {
      return (
        closeBtn && (
          <CloseIcon
            className={`${classPrefix}-icon-close`}
            onClick={(e) => {
              onCloseBtnClick({ e });
            }}
          />
        )
      );
    }
    return (
      <div
        className={`${classPrefix}-close`}
        onClick={(e) => {
          onCloseBtnClick({ e });
        }}
      >
        {renderTNode(closeBtn)}
      </div>
    );
  };

  return (
    <div
      className={classNames(className, `${classPrefix}-notification`, {
        [`${classPrefix}-is-${theme}`]: theme,
      })}
      style={style}
    >
      {renderIcon()}
      <div className={`${classPrefix}-notification__main`}>
        <div className={`${classPrefix}-notification__title__wrap`}>
          <span className={`${classPrefix}-notification__title`}>{title}</span>
          {renderCloseBtn()}
        </div>
        {content && <div className={`${classPrefix}-notification__content`}>{renderTNode(content)}</div>}
        {footer && <div className={`${classPrefix}-notification__detail`}>{renderTNode(footer)}</div>}
      </div>
    </div>
  );
});

Notification.displayName = 'Notification';
Notification.defaultProps = notificationDefaultProps;

export default Notification;
