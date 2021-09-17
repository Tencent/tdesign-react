import React, { FC } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';

export interface TipsProps {
  type?: 'error' | 'default';
}

const Tips: FC<TipsProps> = (props) => {
  const { type = 'default', children } = props;
  const { classPrefix } = useConfig();
  const tipsClass = classNames(
    `${classPrefix}-upload__tips`,
    `${classPrefix}-upload__small`,
    type === 'error' ? `${classPrefix}-upload__tips-error` : null,
  );
  return <small className={tipsClass}>{children}</small>;
};

export default Tips;
