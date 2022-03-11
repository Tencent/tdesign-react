import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';

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
      className={classNames(className, `${classPrefix}-input-group`, {
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
