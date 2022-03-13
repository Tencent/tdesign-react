import { useCallback, useRef } from 'react';
import {
  TableSort,
  FilterValue,
  TableChangeData,
  TdPrimaryTableProps,
  TableChangeTrigger,
  TableChangeContext,
  DataType,
} from '../type';
import { PaginationProps } from '../../pagination';

type ChangeDataValue = TableSort | FilterValue | PaginationProps;

export interface UseChangeResult {
  triggerOnChange?: (changeKeyValue: TableChangeData, context: TableChangeContext<Array<DataType>>) => void;
  setTableChangeData?: (changeDataKey: TableChangeTrigger, changeDataValue: ChangeDataValue) => void;
}

function useChange(props: TdPrimaryTableProps): UseChangeResult {
  const { onChange } = props;
  const isHasOnChange = typeof onChange === 'function';
  const tableChangeDataRef = useRef({});

  const setTableChangeData = useCallback((changeDataKey: TableChangeTrigger, changeDataValue: ChangeDataValue) => {
    if (!isHasOnChange) return;

    tableChangeDataRef.current[changeDataKey] = changeDataValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerOnChange = useCallback(
    (changeKeyValue: TableChangeData, context: TableChangeContext<Array<DataType>>) => {
      if (!isHasOnChange) return;

      const tableChangeData: TableChangeData = {
        ...tableChangeDataRef.current,
        ...changeKeyValue,
      };
      tableChangeDataRef.current = tableChangeData;
      onChange?.(tableChangeData, context);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { triggerOnChange, setTableChangeData };
}

export default useChange;
