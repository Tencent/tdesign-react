import { useMemo } from 'react';
import { BaseTableProps, PrimaryTableProps } from '../interface';
import { ClassName, Styles } from '../../common';
import useClassName from './useClassName';
import useCommonClassName from '../../hooks/useCommonClassName';

export function formatCSSUnit(unit: string | number) {
  if (!unit) return unit;
  return isNaN(Number(unit)) ? unit : `${unit}px`;
}

export default function useStyle(props: BaseTableProps | PrimaryTableProps) {
  const { className, size, bordered, stripe, hover, verticalAlign, height, maxHeight, tableContentWidth } = props;

  const { tableBaseClass, tableAlignClasses } = useClassName();
  const { sizeClassNames } = useCommonClassName();

  const tableClasses = useMemo<ClassName>(
    () => [
      tableBaseClass.table,
      size !== 'medium' && sizeClassNames[size],
      verticalAlign !== 'middle' && tableAlignClasses[verticalAlign],
      {
        [tableBaseClass.bordered]: bordered,
        [tableBaseClass.striped]: stripe,
        [tableBaseClass.hover]: hover,
        [tableBaseClass.loading]: props.loading,
        [tableBaseClass.affixedHeader]: props.headerAffixedTop,
        [tableBaseClass.rowspanAndColspan]: props.rowspanAndColspan,
      },
      className,
    ],
    [
      className,
      bordered,
      hover,
      props.loading,
      props.headerAffixedTop,
      props.rowspanAndColspan,
      size,
      sizeClassNames,
      stripe,
      tableAlignClasses,
      tableBaseClass,
      verticalAlign,
    ],
  );

  const tableContentStyles = useMemo<Styles>(
    () => ({
      height: formatCSSUnit(height),
      maxHeight: formatCSSUnit(maxHeight),
    }),
    [height, maxHeight],
  );

  const tableElementStyles = useMemo<Styles>(
    () => ({
      width: formatCSSUnit(tableContentWidth),
    }),
    [tableContentWidth],
  );

  return {
    tableClasses,
    sizeClassNames,
    tableElementStyles,
    tableContentStyles,
  };
}
