import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否拆分
   * @default false
   */
  separate?: boolean;
}

const InputGroup = forwardRef((props: InputGroupProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { separate, children, className, ...wrapperProps } = props;
  return (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-input-group`, className, {
        [`${classPrefix}-input-group--separate`]: separate,
      })}
      {...wrapperProps}
    >
      {children}
    </div>
  );
});

InputGroup.displayName = 'InputGroup';

export default InputGroup;
