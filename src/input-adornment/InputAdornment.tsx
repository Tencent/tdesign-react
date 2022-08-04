import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdInputAdornmentProps } from './type';
import { StyledProps } from '../common';

export interface InputAdornmentProps extends TdInputAdornmentProps, StyledProps {
  children?: React.ReactNode;
}

const InputAdornment = forwardRef((props: InputAdornmentProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { prepend, append, children, className, style, ...wrapperProps } = props;

  const renderAddon = (type: string, classPrefix: string, Content) => {
    let result: React.ReactNode;

    if (typeof Content === 'function') {
      result = <Content />;
    } else if (typeof Content !== 'undefined') {
      result = Content;
    }

    if (result || typeof result === 'number') {
      result = <span className={`${classPrefix}-input-adornment__${type}`}>{result}</span>;
    }

    return result;
  };

  const renderChildren = () =>
    React.Children.map(children, (child) => {
      if (!child) return null;
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { ...wrapperProps });
      }
      return child;
    });

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(`${classPrefix}-input-adornment`, className, {
        [`${classPrefix}-input-adornment--prepend`]: !!prepend,
        [`${classPrefix}-input-adornment--append`]: !!append,
      })}
    >
      {renderAddon('prepend', classPrefix, prepend)}
      {renderChildren()}
      {renderAddon('append', classPrefix, append)}
    </div>
  );
});

InputAdornment.displayName = 'InputAdornment';

export default InputAdornment;
