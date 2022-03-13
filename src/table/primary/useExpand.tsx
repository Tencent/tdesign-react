import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import get from 'lodash/get';
import { PrimaryTableCol } from '../type';
import { PrimaryTableProps } from './Table';
import ExpandBox from './expand-box';
import useConfig from '../../_util/useConfig';

const expandedColKey = 'expanded-icon-cell';

export type RowkeyType = PrimaryTableProps['expandedRowKeys'];

/**
 * 展开收起hook
 * 1.返回加入展开icon的列配置 Array[]
 * 2.返回展开回调方法
 * 3.返回渲染行展开方法
 */
function useExpand(props: PrimaryTableProps): [PrimaryTableCol[], Function, Function, RowkeyType] {
  const {
    columns,
    rowKey,
    defaultExpandedRowKeys,
    expandedRowKeys,
    expandedRow,
    onExpandChange,
    expandIcon = true,
    expandOnRowClick = false,
  } = props;
  const { classPrefix } = useConfig();
  const isControlled = typeof expandedRowKeys !== 'undefined'; // 是否受控
  const [innerExpandRowKeys, setInnerExpandRowKeys] = useState<RowkeyType>(
    expandedRowKeys || defaultExpandedRowKeys || [],
  );

  const onExpandChangeRef = useRef(onExpandChange);
  const expandedRowRef = useRef(expandedRow);
  const expandOnRowClickRef = useRef(expandOnRowClick);
  // 导出：触发展开回调方法
  const handleExpandChange = useCallback(
    (row, rowKeyValue) => {
      let innerExpandRowKeysNew: RowkeyType;
      const isExpanded = innerExpandRowKeys?.includes(rowKeyValue);
      if (isExpanded) {
        innerExpandRowKeysNew = innerExpandRowKeys.filter((item) => item !== rowKeyValue);
      } else {
        innerExpandRowKeysNew = [...innerExpandRowKeys, rowKeyValue];
      }

      if (!isControlled) {
        setInnerExpandRowKeys([...innerExpandRowKeysNew]);
      }

      // 触发回调
      onExpandChangeRef.current?.(innerExpandRowKeysNew, { expandedRowData: row });
    },
    [innerExpandRowKeys, isControlled],
  );

  const transformedExpandColumns = useMemo(() => {
    // 导出：添加展开图标后的columns
    const getExpandColumns = (columns, innerExpandRowKeys) =>
      expandedRowRef.current
        ? [
            {
              colKey: expandedColKey,
              width: 25,
              className: [`${classPrefix}-table__expandable-icon-cell`],
              cell: ({ row }) => renderExpandIconCell({ row, innerExpandRowKeys }),
            },
            ...columns,
          ]
        : columns;

    // 渲染展开单元格内容
    function renderExpandIconCell({ row = {}, innerExpandRowKeys }: Record<string, any>) {
      const rowKeyValue = get(row, rowKey);
      if (!Array.isArray(innerExpandRowKeys)) {
        console.error('ExpandedRowKeys type error');
        return;
      }
      return (
        <ExpandBox
          expanded={innerExpandRowKeys?.includes(rowKeyValue)}
          row={row}
          rowKeyValue={rowKeyValue}
          expandIcon={expandIcon}
          expandOnRowClick={expandOnRowClickRef.current}
          handleExpandChange={handleExpandChange}
        />
      );
    }

    return getExpandColumns(columns, innerExpandRowKeys);
  }, [classPrefix, columns, expandIcon, handleExpandChange, innerExpandRowKeys, rowKey]);

  const renderExpandRow = useCallback(
    (row, index, rowKeyValue) => (
      <tr
        className={`${classPrefix}-table__expanded-cell`}
        style={innerExpandRowKeys?.includes?.(rowKeyValue) ? {} : { display: 'none' }}
      >
        <td colSpan={transformedExpandColumns?.length}>{expandedRowRef.current?.({ row, index, columns })}</td>
      </tr>
    ),
    [classPrefix, innerExpandRowKeys, transformedExpandColumns?.length, columns],
  );

  useEffect(() => {
    if (Array.isArray(expandedRowKeys)) {
      setInnerExpandRowKeys([...expandedRowKeys]);
    }
  }, [expandedRowKeys]);

  return [transformedExpandColumns, handleExpandChange, renderExpandRow, innerExpandRowKeys];
}

export default useExpand;
