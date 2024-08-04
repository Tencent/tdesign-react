import React, { forwardRef } from 'react';
import classNames from 'classnames';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import useConfig from '../hooks/useConfig';
import { TdInputAdornmentProps } from './type';
import { StyledProps } from '../common';

export interface InputAdornmentProps extends TdInputAdornmentProps, StyledProps {
  children?: React.ReactNode;
}

const InputAdornment = forwardRef<HTMLDivElement, InputAdornmentProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const { prepend, append, children, className, style, ...wrapperProps } = props;

  const renderAddon = (type: string, classPrefix: string, Content) => {
    if (typeof Content === 'undefined') return null;

    let addonNode: React.ReactNode;
    const isContentNode = isString(Content) || isNumber(Content);

    if (typeof Content === 'function') {
      addonNode = <Content />;
    } else {
      addonNode = isContentNode ? <span className={`${classPrefix}-input-adornment__text`}>{Content}</span> : Content;
    }

    return addonNode ? <span className={`${classPrefix}-input-adornment__${type}`}>{addonNode}</span> : addonNode;
  };

  const renderChildren = () =>
    React.Children.map(children, (child) => {
      if (!child) return null;
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...wrapperProps,
          ...child.props,
          onChange: (...args) => {
            // @ts-ignore
            wrapperProps?.onChange?.call?.(null, ...args);
            child.props?.onChange?.call?.(null, ...args);
          },
        });
      }
      return child;
    });

  return (
    <div ref={ref} style={style} className={classNames(`${classPrefix}-input-adornment`, className)}>
      {renderAddon('prepend', classPrefix, prepend)}
      {renderChildren()}
      {renderAddon('append', classPrefix, append)}
    </div>
  );
});

InputAdornment.displayName = 'InputAdornment';

export default InputAdornment;
