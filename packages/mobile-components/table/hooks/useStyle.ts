import cx from 'classnames';
import useClassName from './useClassName';

import type { TdBaseTableProps } from '../type';

export function formatCSSUnit(unit: string | number | undefined) {
  if (!unit) return unit;
  return isNaN(Number(unit)) ? unit : `${unit}px`;
}

export default function useStyle(
  props: TdBaseTableProps,
  {
    isFixedHeader,
    isFixedColumn,
    showColumnShadow,
  }: {
    isFixedHeader?: boolean;
    isFixedColumn?: boolean;
    showColumnShadow?: { left?: boolean; right?: boolean };
  },
) {
  const { bordered, stripe, verticalAlign, height, maxHeight, tableContentWidth, loading, rowspanAndColspan } = props;

  const { tableBaseClass, tableAlignClasses, tableColFixedClasses } = useClassName();

  const tableClasses = cx([
    tableBaseClass.table,
    [tableAlignClasses[verticalAlign || 'middle']],
    {
      [tableBaseClass.bordered]: bordered,
      [tableBaseClass.striped]: stripe,
      [tableBaseClass.loading]: loading,
      [tableBaseClass.rowspanAndColspan]: !!rowspanAndColspan,
      [tableBaseClass.headerFixed]: isFixedHeader,
      [tableBaseClass.columnFixed]: isFixedColumn,
      [tableColFixedClasses.leftShadow]: showColumnShadow.left,
      [tableColFixedClasses.rightShadow]: showColumnShadow.right,
    },
  ]);

  const tableContentStyles: React.CSSProperties = {
    height: formatCSSUnit(height),
    maxHeight: formatCSSUnit(maxHeight),
  };

  const tableElementStyles: React.CSSProperties = {
    width: formatCSSUnit(tableContentWidth),
  };

  return {
    tableClasses,
    tableElementStyles,
    tableContentStyles,
  };
}
