import React, { forwardRef, useRef } from 'react';
import classNames from 'classnames';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import { CSSTransition } from 'react-transition-group';
import log from '@tdesign/common-js/log/index';
import noop from '../_util/noop';
import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdAlertProps } from './type';
import { StyledProps } from '../common';
import { alertDefaultProps } from './defaultProps';
import composeRefs from '../_util/composeRefs';
import useDefaultProps from '../hooks/useDefaultProps';

const transitionTime = 200;

export interface AlertProps extends TdAlertProps, StyledProps {}

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const [local, t] = useLocaleReceiver('alert');
  const { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });

  const {
    message,
    title,
    operation,
    theme,
    icon,
    close,
    closeBtn,
    maxLine,
    onClose,
    className,
    onClosed = noop,
    ...alertProps
  } = useDefaultProps(props, alertDefaultProps);

  const [closed, setClosed] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(true);
  const nodeRef = useRef<HTMLDivElement>(null);

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
    setCollapsed((collapsed) => !collapsed);
  };

  const renderIconNode = () => {
    if (React.isValidElement(icon)) return icon;
    return React.createElement(iconMap[theme]);
  };

  const renderMessage = () => {
    if (+maxLine > 0 && Array.isArray(message)) {
      return (
        <div className={`${classPrefix}-alert__description`}>
          {message.map((item, index) => {
            if (collapsed) {
              if (index < +maxLine) {
                return <div key={index}>{item}</div>;
              }
            } else {
              return <div key={index}>{item}</div>;
            }
            return true;
          })}
          {+maxLine < message.length && (
            <div className={`${classPrefix}-alert__collapse`} onClick={handleCollapse}>
              {collapsed ? t(local.expandText) : t(local.collapseText)}
            </div>
          )}
        </div>
      );
    }
    return <div className={`${classPrefix}-alert__description`}>{message}</div>;
  };

  // close 属性变更为 closeBtn，close废弃后可删除。（需兼容标签上直接写close和closeBtn的场景）
  const isUsingClose = Reflect.has(props, 'close');
  const closeNode = isUsingClose ? close : closeBtn;
  if (isUsingClose) {
    log.warnOnce('TAlert', 'prop `close` is going to be deprecated, please use `closeBtn` instead.');
  }
  const renderClose = () => {
    if (closeNode === false) return null;
    return (
      <div className={`${classPrefix}-alert__close`} onClick={handleClose}>
        {parseTNode(closeNode, undefined, <CloseIcon />)}
      </div>
    );
  };

  return (
    <CSSTransition
      in={!closed}
      unmountOnExit
      classNames={{
        exitActive: `${classPrefix}-alert--closing`,
      }}
      nodeRef={nodeRef}
      timeout={transitionTime}
      onExited={onClosed}
    >
      <div
        ref={composeRefs(ref, nodeRef)}
        className={classNames(`${classPrefix}-alert`, `${classPrefix}-alert--${theme}`, className)}
        {...alertProps}
      >
        <div className={`${classPrefix}-alert__icon`}>{renderIconNode()}</div>
        <div className={`${classPrefix}-alert__content`}>
          {title ? <div className={`${classPrefix}-alert__title`}>{title}</div> : null}
          <div className={`${classPrefix}-alert__message`}>
            {renderMessage()}
            {operation ? <div className={`${classPrefix}-alert__operation`}>{parseTNode(operation)}</div> : null}
          </div>
        </div>
        {renderClose()}
      </div>
    </CSSTransition>
  );
});

Alert.displayName = 'Alert';

export default Alert;
