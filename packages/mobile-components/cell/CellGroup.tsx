import React, { ReactNode, useMemo } from 'react';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdCellGroupProps } from './type';
import { cellGroupDefaultProps } from './defaultProps';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import useDefaultProps from '../hooks/useDefaultProps';
import parseTNode from '../_util/parseTNode';

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
