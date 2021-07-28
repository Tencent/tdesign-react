import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否拆分
   * @default false
   */
  seperate?: boolean;
}

const InputGroup = forwardRef((props: InputGroupProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { seperate, children, className, ...wrapperProps } = props;
  return (
    <div
      ref={ref}
      className={classNames(className, `${classPrefix}-input-group`, {
        [`${classPrefix}-input-group--seperate`]: seperate,
      })}
      {...wrapperProps}
    >
      {children}
    </div>
  );
});

InputGroup.displayName = 'InputGroup';

export default InputGroup;
