import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';

export interface AddonProps extends React.HTMLAttributes<HTMLDivElement> {
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  children?: React.ReactNode;
}

const renderAddon = (type, classPrefix, Content) => {
  let result: React.ReactNode;

  if (typeof Content === 'function') {
    result = <Content />;
  } else if (typeof Content !== 'undefined') {
    result = Content;
  }

  if (result || typeof result === 'number') {
    result = <span className={`${classPrefix}-addon__${type}`}>{result}</span>;
  }

  return result;
};

const Addon = forwardRef((props: AddonProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { prepend, append, children, className, style, ...wrapperProps } = props;

  function renderChildren() {
    return React.Children.map(children, (child) => {
      if (!child) return null;
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { ...wrapperProps });
      }
      return child;
    });
  }

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(className, `${classPrefix}-addon`, {
        [`${classPrefix}-addon--prepend`]: !!prepend,
        [`${classPrefix}-addon--append`]: !!append,
      })}
    >
      {renderAddon('prepend', classPrefix, prepend)}
      {renderChildren()}
      {renderAddon('append', classPrefix, append)}
    </div>
  );
});

Addon.displayName = 'Addon';

export default Addon;
