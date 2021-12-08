import * as React from 'react';
import { CheckCircleFilledIcon, CloseIcon, InfoCircleFilledIcon } from 'tdesign-icons-react';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';

import { NotificationInstance, TdNotificationProps } from './type';
import { Styles } from '../common';

const blockName = 'notification';

export interface NotificationProps extends TdNotificationProps {
  style?: Styles;
}

export const NotificationComponent = React.forwardRef<any, NotificationProps>((props, ref) => {
  const {
    title = null,
    content = null,
    theme = null,
    icon = null,
    closeBtn,
    footer = null,
    duration = 3000,
    onCloseBtnClick = noop,
    onDurationEnd = noop,
    style,
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

  React.useImperativeHandle(ref as React.Ref<NotificationInstance>, () => ({ close }), []);

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
    return null;
  };

  return (
    <div ref={ref} className={prefixCls(blockName)} style={style}>
      {renderIcon()}
      <div className={prefixCls([blockName, 'main'])}>
        <div className={prefixCls([blockName, 'title__wrap'])}>
          <span className={prefixCls([blockName, 'title'])}>{title}</span>
          {((): React.ReactNode => {
            if (typeof closeBtn === 'boolean' && closeBtn) {
              return (
                <CloseIcon
                  className={prefixCls('icon-close')}
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

export default NotificationComponent;
