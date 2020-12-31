import * as React from 'react';
import { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } from '../icon';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import {
  NotificationRef,
  NotificationTheme,
  NotificationPlacement,
  NotificationInstance,
  NotificationComponent,
  NotificationOpenOptions,
} from './NotificationInterface';
import { fetchListInstance, listMap } from './NotificationList';

const blockName = 'notification';

const Notification: NotificationComponent = React.forwardRef((props, ref: NotificationRef) => {
  const {
    className = '',
    style = {},
    title = null,
    content = null,
    theme = null,
    icon = null,
    closeBtn = true,
    footer = null,
    duration = 0,
    onClickCloseBtn,
    onDurationEnd = noop,
    close = noop,
  } = props;

  const { classPrefix } = useConfig();
  const prefixCls = React.useCallback(
    (...args: (string | [string, string?, string?])[]) => {
      let className = '';
      args.forEach((item, index) => {
        if (item && index > 0) className = className.concat(' ');
        if (item instanceof Array) {
          const [block, element, modifier] = item;
          className = className.concat(classPrefix, '-', block);
          if (element) className = className.concat('__', element);
          if (modifier) className = className.concat('--', modifier);
        } else if (typeof item === 'string') {
          className = className.concat(classPrefix, '-', item);
        }
      });
      return className;
    },
    [classPrefix],
  );

  const onClose = React.useCallback(
    (event: React.MouseEvent) => {
      if (typeof onClickCloseBtn === 'function') {
        onClickCloseBtn(event, { close });
      } else {
        close();
      }
    },
    [onClickCloseBtn, close],
  );

  React.useImperativeHandle(ref as React.Ref<NotificationInstance>, () => ({ close }), [close]);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    let timer;
    if (duration > 0) {
      timer = setTimeout(() => {
        clearTimeout(timer);
        onDurationEnd({ close });
        close();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const renderIcon = () => {
    const IconWrapper = ({ children }) => <div className={`${classPrefix}-notification__icon`}>{children}</div>;
    if (theme && theme === 'success') {
      return (
        <IconWrapper>
          <CheckCircleFilledIcon className={prefixCls('is-success')} />
        </IconWrapper>
      );
    }
    if (theme && ['info', 'warning', 'error'].indexOf(theme) >= 0) {
      return (
        <IconWrapper>
          <InfoCircleFilledIcon className={prefixCls(`is-${theme}`)} />
        </IconWrapper>
      );
    }
    if (React.isValidElement(icon)) return icon;
    return null;
  };

  return (
    <div ref={ref} className={prefixCls(blockName).concat(' ', className)} style={style}>
      {renderIcon()}
      <div className={prefixCls([blockName, 'main'])}>
        <div className={prefixCls([blockName, 'title__wrap'])}>
          <span className={prefixCls([blockName, 'title'])}>{title}</span>
          {((): React.ReactNode => {
            if (typeof closeBtn === 'boolean' && closeBtn) {
              return <CloseIcon className={prefixCls('icon-close')} onClick={onClose} />;
            }
            if (React.isValidElement(closeBtn)) {
              return <div onClick={onClose}>{closeBtn}</div>;
            }
            return null;
          })()}
        </div>
        {((): React.ReactNode => {
          if (typeof content === 'string') {
            return <div className={prefixCls([blockName, 'content'])}>{content}</div>;
          }
          if (React.isValidElement(content)) return content;
          return null;
        })()}
        {React.isValidElement(footer) && <div className={prefixCls([blockName, 'detail'])}>{footer}</div>}
        {typeof footer === 'function' && <div className={prefixCls([blockName, 'detail'])}>{footer()}</div>}
      </div>
    </div>
  );
});

Notification.open = (options: NotificationOpenOptions = {}) => {
  if (typeof options !== 'object') return;

  const placement: NotificationPlacement = (() => {
    if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(options.placement) >= 0) {
      return options.placement;
    }
    return 'top-right';
  })();

  const attach: HTMLElement = (() => {
    if (options.attach && typeof options.attach === 'string') {
      const element: Element = document.querySelector(options.attach);
      if (element instanceof HTMLElement) return element;
    }

    if (options.attach instanceof HTMLElement) return options.attach;

    const containerId = `tdesign-notification-${placement}`;
    const container = document.querySelector(`#${containerId}`);
    if (container && container instanceof HTMLElement) {
      return container;
    }

    const element: HTMLDivElement = document.createElement('div');
    element.setAttribute('id', containerId);
    document.body.appendChild(element);
    return element;
  })();

  const zIndex = options.zIndex || 6000;

  return new Promise((resolve) => {
    fetchListInstance(placement, attach, zIndex).then((listInstance) => {
      listInstance.push(options).then(resolve);
    });
  });
};

['info', 'success', 'warning', 'error'].forEach((theme: NotificationTheme) => {
  Notification[theme] = (options: NotificationOpenOptions) => Notification.open({ ...options, theme });
});

Notification.close = (promise) => promise.then((instance) => instance.close());

Notification.closeAll = () => listMap.forEach((list) => list.removeAll());

export default Notification;
