import React from 'react';
import { TdPrimaryTableProps, TdEnhancedTableProps } from '../type';
import PrimaryTable from '../primary/Table';
import useTree from './useTree';
import { EnhancedTableContextProvider } from './TableContext';

export type EnhancedTableProps = TdEnhancedTableProps & TdPrimaryTableProps;

export default function EnhancedTable(props: EnhancedTableProps) {
  const { treeColumns, useFlattenData, useFlattenRowData, getFlattenPageData } = useTree(props);

  const mergeColumns = treeColumns;

  return (
    <EnhancedTableContextProvider
      value={{
        checkStrictly: props?.tree?.checkStrictly,
        childrenKey: props?.tree?.childrenKey,
        useFlattenData,
        useFlattenRowData,
        getFlattenPageData,
      }}
    >
      <PrimaryTable {...props} columns={mergeColumns} />
    </EnhancedTableContextProvider>
  );
}
