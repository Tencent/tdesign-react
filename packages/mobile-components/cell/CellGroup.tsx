import React, { useMemo } from 'react';
import classnames from 'classnames';

import parseTNode from '../_util/parseTNode';
import withNativeProps from '../_util/withNativeProps';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { cellGroupDefaultProps } from './defaultProps';

import type { ReactNode } from 'react';
import type { NativeProps } from '../_util/withNativeProps';
import type { TdCellGroupProps } from './type';

export type CellGroupProps = TdCellGroupProps &
  NativeProps & {
    children?: ReactNode;
  };

const CellGroup: React.FC<CellGroupProps> = (originProps) => {
  const props = useDefaultProps(originProps, cellGroupDefaultProps);
  const { children, bordered, title, theme } = props;
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-cell-group`;

  const classNames = useMemo(
    () => [
      name,
      `${name}--${theme}`,
      {
        [`${name}--bordered`]: bordered,
      },
    ],
    [name, bordered, theme],
  );

  return withNativeProps(
    props,
    <div>
      {title && <div className={`${name}__title`}>{title}</div>}
      <div className={classnames(classNames)}>{parseTNode(children)}</div>
    </div>,
  );
};

CellGroup.displayName = 'CellGroup';

export default CellGroup;
