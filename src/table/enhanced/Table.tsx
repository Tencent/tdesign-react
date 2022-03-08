import React, { useMemo } from 'react';
import { TdPrimaryTableProps, TdEnhancedTableProps } from '../type';
import PrimaryTable from '../primary/Table';
import useTree from './useTree';
import { EnhancedTableContextProvider } from './TableContext';

export type EnhancedTableProps = TdEnhancedTableProps & TdPrimaryTableProps;

export default function EnhancedTable(props: EnhancedTableProps) {
  const { treeColumns, getFlattenData, getFlattenRowData, getFlattenPageData } = useTree(props);
  const enhancedTableContextValue = useMemo(
    () => ({
      checkStrictly: props?.tree?.checkStrictly,
      childrenKey: props?.tree?.childrenKey,
      getFlattenData,
      getFlattenRowData,
      getFlattenPageData,
    }),
    [props?.tree.checkStrictly, props?.tree?.childrenKey, getFlattenData, getFlattenRowData, getFlattenPageData],
  );

  const mergeColumns = treeColumns;

  return (
    <EnhancedTableContextProvider value={enhancedTableContextValue}>
      <PrimaryTable {...props} columns={mergeColumns} />
    </EnhancedTableContextProvider>
  );
}
