import { useRef, useState } from 'react';
import useConfig from '../../hooks/useConfig';
import useDeepEffect from '../../hooks/useDeepEffect';
import TableResizable from './TableResizable';

import type { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';

type Options = {
  enable: boolean;
  columns: BaseTableCol<TableRowData>[];
  affixTableElement?: HTMLTableElement | null;
  affixFooterTableElement?: HTMLTableElement | null;
  updateTableAfterColumnResize?: () => void;
  updateThWidthList?: (trList: HTMLCollection | { [colKey: string]: number }) => { [colKey: string]: number };
  onColumnResizeChange?: TdBaseTableProps['onColumnResizeChange'];
};

function useColumnResize(
  tableElement: HTMLTableElement,
  {
    enable,
    columns,
    affixTableElement,
    affixFooterTableElement,
    updateThWidthList,
    updateTableAfterColumnResize,
  }: Options,
) {
  const { classPrefix } = useConfig();
  const resizableRef = useRef<TableResizable | null>(null);
  // Track whether user has triggered resize operation
  const [hasResized, setHasResized] = useState(false);

  const cleanUp = () => {
    resizableRef.current?.destroy();
    resizableRef.current = null;
  };

  useDeepEffect(() => {
    if (!tableElement || !enable) return;
    if (resizableRef.current) cleanUp();
    resizableRef.current = new TableResizable(
      classPrefix,
      tableElement,
      columns,
      {
        onMouseMove: (_, ctx) => {
          // Mark that user has triggered resize
          setHasResized(true);
          updateTableAfterColumnResize();
          updateThWidthList?.(ctx.columnsWidth);
        },
      },
      affixTableElement,
      affixFooterTableElement,
    );
    return () => {
      cleanUp();
    };
  }, [classPrefix, columns, enable, tableElement, affixTableElement, affixFooterTableElement]);

  return { hasResized };
}

export default useColumnResize;
