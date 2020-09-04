import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { TableProps } from '../TableProps';
import useConfig from '../../_util/useConfig';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableLoadingBody from './TableLoadingBody';
import { TableContextValue, TableContext } from './TableContext';

export default function Table<T>(props: TableProps<T>): any {
  const { classPrefix } = useConfig();
  const [separate, setSeparate] = useState<TableContextValue['separate']>(false);

  const {
    bordered = true,
    stripe = false,
    hover = true,
    // tableLayout = 'fixed',
    verticalAlign = 'center',
    size = 'default',
    height,
    columns,
    loading,
  } = props;

  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 判断header、body是否需要独立的table
  if (!separate && (height || columns.filter((column) => column.fixed).length > 0)) {
    setSeparate(true);
  }

  // 表头、表格的基础内容
  const baseTableContent = (
    <TableContext.Provider value={{ separate }}>
      <TableHeader ref={headerRef} {...props} />
      <TableBody ref={bodyRef} {...props} />
    </TableContext.Provider>
  );

  return (
    <div
      className={classNames(
        `${classPrefix}-table`,
        // `${classPrefix}-table--layout-${tableLayout}`,
        {
          [`${classPrefix}-table__header--fixed`]: height,
          [`${classPrefix}-table--striped`]: stripe,
          [`${classPrefix}-table--bordered`]: bordered,
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-table--hoverable`]: hover,
          [`${classPrefix}-table-valign__${verticalAlign}`]: verticalAlign,
        },
      )}
    >
      <div className={`${classPrefix}-table-content`}>
        {separate ? baseTableContent : <table>{baseTableContent}</table>}
        {loading && <TableLoadingBody />}
      </div>
    </div>
  );
}
