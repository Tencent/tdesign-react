import React, { forwardRef, ReactNode, FunctionComponent } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';

/**
 * Addon 组件支持的属性。
 *
 * 除表格中列出的属性外，支持透传原生 `<div>` 标签支持的属性。
 */
export interface AddonProps extends React.HTMLAttributes<HTMLDivElement> {
  prepend?: number | string | ReactNode | FunctionComponent;
  append?: number | string | ReactNode | FunctionComponent;
}

const renderAddon = (type, classPrefix, Content) => {
  let result: ReactNode;

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

const Addon = forwardRef(
  (props: AddonProps, ref: React.Ref<HTMLDivElement>) => {
    const { classPrefix } = useConfig();
    const { prepend, append, children, className, ...wrapperProps } = props;
    return (
      <div
        ref={ref}
        className={classNames(className, `${classPrefix}-addon`)}
        {...wrapperProps}
      >
        {renderAddon('prepend', classPrefix, prepend)}
        {children}
        {renderAddon('append', classPrefix, append)}
      </div>
    );
  }
);

Addon.displayName = 'Addon';

export default Addon;
