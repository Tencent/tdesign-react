import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IconFont, PromptFillIcon, SuccessFillIcon } from '../icon';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';

export type NotificationTheme = '' | 'info' | 'success' | 'warning' | 'error';

export interface NotificationProps {
  /**
   * 通知标题
   * @default ''
   */
  title?: string;
  /**
   * 自定义内容
   * @default ''
   */
  content?: React.ReactNode;
  /**
   * 消息类型 info/success/warning/error
   * @default ''
   */
  theme?: NotificationTheme;
  /**
   * 自定义图标。当 theme 存在，取默认图标
   * @default ''
   */
  icon?: React.ReactNode;
  /**
   * 是否显示关闭按钮/自定义关闭图标
   * @default true
   */
  closeBtn?: boolean | React.ReactNode;
  /**
   * 自定义底部详情
   * @default ''
   */
  footer?: React.ReactNode;
  /**
   * 显示时间，毫秒，置 0 则不会自动关闭
   * @default 0
   */
  duration?: number;
  /**
   * 内部仅触发事件，不处理关闭
   * @default noop
   */
  onClickCloseBtn?: (
    event: React.MouseEvent,
    instance: { close: () => void }
  ) => void;
  /**
   * 内部仅触发事件，不处理关闭
   * @default noop
   */
  onDurationEnd?: (instance: { close: () => void }) => void;
}

export type NotificationPlacement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

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

export interface NotificationInstance {
  close: () => void;
}

export type NotificationOpen = (
  options?: NotificationOpenOptions
) => Promise<{ close: () => void }>;

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
  close?: (promise: Promise<{ close: () => void }>) => void;
  /**
   * 关闭所有通知提醒框
   */
  closeAll?: () => void;
}

type NotificationComponent = React.ForwardRefExoticComponent<
  NotificationProps & React.RefAttributes<NotificationInstance>
> &
  NotificationMethods;

const Notification: NotificationComponent = React.forwardRef((props, ref) => {
  const {
    title,
    content,
    theme,
    icon,
    closeBtn,
    footer,
    duration,
    onClickCloseBtn,
    onDurationEnd,
    close,
    style,
  } = props as NotificationProps & NotificationInstance & { style: object };

  const { classPrefix } = useConfig();
  const blockName = React.useMemo<string>(() => 'notification', []);
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

  React.useImperativeHandle(ref, () => ({ close }), [close]);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        onDurationEnd({ close });
        close();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div ref={ref as any} className={prefixCls(blockName)} style={style}>
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
              <div className={prefixCls([blockName, 'content'])}>{content}</div>
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
});

Notification.defaultProps = {
  title: '',
  content: '',
  theme: '',
  icon: '',
  closeBtn: true,
  footer: '',
  duration: 0,
  onClickCloseBtn: noop,
  onDurationEnd: noop,
};

class NotificationList extends React.Component<
  { attach: HTMLElement; placement: NotificationPlacement },
  { list: NotificationProps[] }
> {
  static seed = 0;
  static listMap: Map<NotificationPlacement, NotificationList> = new Map();

  public state = { list: [] };
  public notificationMap: Map<
    string,
    React.RefObject<NotificationInstance>
  > = new Map();

  public push = (props: NotificationOpenOptions) =>
    new Promise((resolve) => {
      const { notificationMap } = this;
      const { list } = this.state;
      const key = String((NotificationList.seed += 1));
      const style = (() => {
        const offset = Object.assign(
          { top: 16, bottom: 16, left: 16, right: 16 },
          props.offset
        );
        return {
          marginTop: `${offset.top}px`,
          marginBottom: `${offset.bottom}px`,
          marginLeft: `${offset.left}px`,
          marginRight: `${offset.right}px`,
        };
      })();
      list.push({ ...props, key, style });
      notificationMap.set(key, React.createRef());
      this.setState({ list: [...list] }, () => {
        if (notificationMap.get(key) && notificationMap.get(key).current) {
          resolve(notificationMap.get(key).current);
        }
      });
    });

  public remove = (key: string) => {
    const { list } = this.state;
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].key === key) {
        list.splice(i, 1);
        this.setState({ list: [...list] });
        this.notificationMap.delete(key);
        if (this.notificationMap.size === 0) {
          NotificationList.listMap.delete(this.props.placement);
        }
        break;
      }
    }
  };

  public render() {
    return (
      <>
        {this.state.list.map((props) => (
          <Notification
            ref={this.notificationMap.get(props.key)}
            key={props.key}
            {...props}
            close={() => this.remove(props.key)}
          />
        ))}
      </>
    );
  }
}

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
      return document.querySelector(options.attach) as HTMLElement;
    }

    if (options.attach instanceof HTMLElement) return options.attach;

    const listClassName = `.t-notification__show--${placement}`;
    if (document.querySelector(listClassName) instanceof HTMLElement) {
      return document.querySelector(listClassName) as HTMLElement;
    }

    const div: HTMLDivElement = document.createElement('div');
    div.setAttribute('class', listClassName.slice(1));
    document.body.appendChild(div);
    return div;
  })();

  attach.style['z-index'] = String(options.zIndex || 6000);

  const fetchListInstance = (): Promise<NotificationList> =>
    new Promise((resolve) => {
      if (NotificationList.listMap.has(placement)) {
        resolve(NotificationList.listMap.get(placement));
      } else {
        ReactDOM.render(
          <NotificationList
            attach={attach}
            placement={placement}
            ref={(instance) => {
              NotificationList.listMap.set(placement, instance);
              resolve(instance);
            }}
          />,
          attach
        );
      }
    });

  return new Promise((resolve) => {
    fetchListInstance().then((listInstance) => {
      listInstance.push(options).then(resolve);
    });
  });
};

['info', 'success', 'warning', 'error'].forEach((theme: NotificationTheme) => {
  Notification[theme] = (options: NotificationOpenOptions) =>
    Notification.open({ ...options, theme });
});

Notification.close = (promise) => promise.then((instance) => instance.close());

Notification.closeAll = () => {
  NotificationList.listMap.forEach((list) => {
    list.notificationMap.forEach((notification) => {
      if (notification && notification.current && notification.current.close) {
        notification.current.close();
      }
    });
  });
};

export default Notification;
