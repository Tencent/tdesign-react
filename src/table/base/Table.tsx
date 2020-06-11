import React, { useRef } from 'react';
import { TableProps } from '../TableProps';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { useConfig } from '../../_util/use-config';
import classNames from 'classnames';

export default function Table<T>(props: TableProps<T>): any {
  const { classPrefix } = useConfig();

  const {
    bordered = true,
    stripe = false,
    hover = true,
    tableLayout = 'fixed',
    verticalAlign = 'center',
  } = props;

  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={classNames(
        `${classPrefix}-table`,
        `${classPrefix}-table--layout-${tableLayout}`,
        {
          [`${classPrefix}-table--bordered`]: bordered,
          [`${classPrefix}-table--stripe`]: stripe,
          [`${classPrefix}-table--hover`]: hover,
          [`${classPrefix}-align-${verticalAlign}`]: verticalAlign,
        }
      )}
    >
      <TableHeader ref={headerRef} {...props} />
      <TableBody ref={bodyRef} {...props} />
    </div>
  );
}
