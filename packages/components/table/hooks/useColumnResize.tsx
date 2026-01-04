import { useRef, useState } from 'react';
import useConfig from '../../hooks/useConfig';
import useDeepEffect from '../../hooks/useDeepEffect';
import TableResizable from './TableResizable';

import type { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';

type ResizeOptions = {
  enable: boolean;
  columns: BaseTableCol<TableRowData>[];
  affixHeaderTableElement?: HTMLTableElement | null;
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
    affixHeaderTableElement,
    affixFooterTableElement,
    updateThWidthList,
    updateTableAfterColumnResize,
  }: ResizeOptions,
) {
  const { classPrefix } = useConfig();
  const resizableRef = useRef<TableResizable | null>(null);

  const [hasResized, setHasResized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

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
          setHasResized(true);
          setIsResizing(true);
          updateTableAfterColumnResize();
          updateThWidthList?.(ctx.columnsWidth);
        },
        onMouseUp: () => {
          setIsResizing(false);
        },
      },
      affixHeaderTableElement,
      affixFooterTableElement,
    );
    return () => {
      cleanUp();
    };
  }, [classPrefix, columns, enable, tableElement, affixHeaderTableElement, affixFooterTableElement]);

  return { hasResized, isResizing };
}

export default useColumnResize;
