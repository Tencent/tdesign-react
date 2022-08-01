import React, { FC } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';

export interface TipsProps {
  type?: 'error' | 'default';
}

const Tips: FC<TipsProps> = (props) => {
  const { type = 'default', children } = props;
  const { classPrefix } = useConfig();
  const tipsClass = classNames(
    `${classPrefix}-upload__tips`,
    `${classPrefix}-size-s`,
    type === 'error' ? `${classPrefix}-upload__tips-error` : null,
  );
  return <small className={tipsClass}>{children}</small>;
};

export default Tips;
