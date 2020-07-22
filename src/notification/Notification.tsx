import * as React from 'react';
import { IconFont, PromptFillIcon, SuccessFillIcon } from '../icon';
import { fetchListInstance, listMap } from './NotificationList';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type/StyledProps';

export type NotificationTheme = 'info' | 'success' | 'warning' | 'error';

export type NotificationPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface NotificationInstance {
  /**
   * 关闭当前通知提醒框
   */
  close?: () => void;
}

export interface NotificationProps extends StyledProps {
  /**
   * 通知标题
   */
  title?: React.ReactNode;
  /**
   * 自定义内容
   */
  content?: React.ReactNode;
  /**
   * 消息类型 info/success/warning/error
   */
  theme?: NotificationTheme;
  /**
   * 自定义图标。当 theme 存在，取默认图标
   */
  icon?: React.ReactNode;
  /**
   * 是否显示关闭按钮/自定义关闭图标
   * @default true
   */
  closeBtn?: boolean | React.ReactNode;
  /**
   * 自定义底部详情
   */
  footer?: React.ReactNode;
  /**
   * 显示时间，毫秒，置 0 则不会自动关闭
   * @default 0
   */
  duration?: number;
  /**
   * 关闭按钮点击时触发
   */
  onClickCloseBtn?: (
    event: React.MouseEvent,
    instance: NotificationInstance
  ) => void;
  /**
   * 计时结束的时候触发
   */
  onDurationEnd?: (instance: NotificationInstance) => void;
}

export interface NotificationOpenOptions extends NotificationProps {
  /**
   * 消息提示的位置
   * @default 'top-right'
   */
  placement?: NotificationPlacement;
  /**
   * 偏移量（结合属性 placement ）
   */
  offset?: { left?: number; top?: number; bottom?: number; right?: number };
  /**
   * 指定弹框挂载节点，字符串类型表示DOM选择器（querySelector）
   */
  attach?: HTMLElement | string;
  /**
   * 自定义层级
   * @default 6000
   */
  zIndex?: number;
}

export type NotificationOpen = (
  options?: NotificationOpenOptions
) => Promise<NotificationInstance>;

export interface NotificationMethods {
  /**
   * 打开通知提醒框，返回Promise<NotificationInstance>
   */
  open?: NotificationOpen;
  /**
   * 打开 info 主题通知提醒框，返回Promise<NotificationInstance>
   */
  info?: NotificationOpen;
  /**
   * 打开 success 主题通知提醒框，返回Promise<NotificationInstance>
   */
  success?: NotificationOpen;
  /**
   * 打开 warning 主题通知提醒框，返回Promise<NotificationInstance>
   */
  warning?: NotificationOpen;
  /**
   * 打开 error 主题通知提醒框，返回Promise<NotificationInstance>
   */
  error?: NotificationOpen;
  /**
   * 关闭指定的通知提醒框，传入Promise<NotificationInstance>
   */
  close?: (promise: Promise<NotificationInstance>) => void;
  /**
   * 关闭所有通知提醒框
   */
  closeAll?: () => void;
}

export type NotificationRef = React.RefObject<React.ElementRef<'div'>> &
  React.RefObject<NotificationInstance>;

interface NotificationPropsWithClose extends NotificationProps {
  close?: () => void;
}

export type NotificationComponent = React.ForwardRefExoticComponent<
  NotificationPropsWithClose & React.RefAttributes<HTMLDivElement>
> &
  NotificationMethods;

const blockName = 'notification';

const Notification: NotificationComponent = React.forwardRef(
  (props, ref: NotificationRef) => {
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
      onClickCloseBtn = noop,
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
      [classPrefix]
    );

    const onClose = React.useCallback(
      (event: React.MouseEvent) => onClickCloseBtn(event, { close }),
      [onClickCloseBtn, close]
    );

    React.useImperativeHandle(
      ref as React.Ref<NotificationInstance>,
      () => ({ close }),
      [close]
    );

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

    return (
      <div
        ref={ref}
        className={prefixCls(blockName).concat(' ', className)}
        style={style}
      >
        {((): React.ReactNode => {
          if (theme && theme === 'success') {
            return <SuccessFillIcon className={prefixCls('is-success')} />;
          }
          if (theme && ['info', 'warning', 'error'].indexOf(theme) >= 0) {
            return <PromptFillIcon className={prefixCls(`is-${theme}`)} />;
          }
          if (React.isValidElement(icon)) return icon;
          return null;
        })()}
        <div className={prefixCls([blockName, 'main'])}>
          <div className={prefixCls([blockName, 'title__wrap'])}>
            <span className={prefixCls([blockName, 'title'])}>{title}</span>
            {((): React.ReactNode => {
              if (typeof closeBtn === 'boolean' && closeBtn) {
                return <IconFont name="close" onClick={onClose} />;
              }
              if (typeof closeBtn === 'string') {
                return <div onClick={onClose}>{closeBtn}</div>;
              }
              if (React.isValidElement(closeBtn)) return closeBtn;
              return null;
            })()}
          </div>
          {((): React.ReactNode => {
            if (typeof content === 'string') {
              return (
                <div className={prefixCls([blockName, 'content'])}>
                  {content}
                </div>
              );
            }
            if (React.isValidElement(content)) return content;
            return null;
          })()}
          {React.isValidElement(footer) && (
            <div className={prefixCls([blockName, 'detail'])}>{footer}</div>
          )}
          {typeof footer === 'function' && (
            <div className={prefixCls([blockName, 'detail'])}>{footer()}</div>
          )}
        </div>
      </div>
    );
  }
);

Notification.open = (options: NotificationOpenOptions = {}) => {
  if (typeof options !== 'object') return;

  const placement: NotificationPlacement = (() => {
    if (
      ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(
        options.placement
      ) >= 0
    ) {
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
  Notification[theme] = (options: NotificationOpenOptions) =>
    Notification.open({ ...options, theme });
});

Notification.close = (promise) => promise.then((instance) => instance.close());

Notification.closeAll = () => listMap.forEach((list) => list.removeAll());

export default Notification;
