import React, { useContext, useEffect, useState } from 'react';
import get from 'lodash/get';
import { ConfigContext } from '../../config-provider';
import { PrimaryTableCol } from '../../_type/components/table';
import { PrimaryTableProps } from './Table';
import ExpandBox from './expand-box';

const expandedColKey = 'expanded-icon-cell';

export type RowkeyType = PrimaryTableProps['expandedRowKeys'];

/**
 * 展开收起hook
 * 1.返回加入展开icon的列配置 Array[]
 * 2.返回展开回调方法
 * 3.返回渲染行展开方法
 */
function useExpand(props: PrimaryTableProps): [PrimaryTableCol[], Function, Function] {
  const {
    columns,
    rowKey,
    defaultExpandedRowKeys,
    expandedRowKeys,
    expandedRow,
    onExpandChange,
    showExpandArrow = true,
    expandOnRowClick = false,
  } = props;
  const { classPrefix } = useContext(ConfigContext);
  const isControlled = typeof expandedRowKeys !== 'undefined'; // 是否受控
  const [innerExpandRowKeys, setThisExpandRowKeys] = useState<RowkeyType>(
    expandedRowKeys || defaultExpandedRowKeys || [],
  );

  useEffect(() => {
    if (Array.isArray(expandedRowKeys)) {
      setThisExpandRowKeys([...expandedRowKeys]);
    }
  }, [expandedRowKeys]);

  // 导出：添加展开图标后的columns
  const transformedExpandColumnsFun = () =>
    expandedRow
      ? [
          {
            colKey: expandedColKey,
            width: 15,
            className: [`${classPrefix}-table-expandable-icon-cell`],
            render: ({ row }) => renderExpandIconCell({ row }),
          },
          ...columns,
        ]
      : columns;

  const transformedExpandColumns = transformedExpandColumnsFun();

  // 渲染展开单元格内容
  function renderExpandIconCell({ row = {} }: Record<string, any>) {
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
        showExpandArrow={showExpandArrow}
        expandOnRowClick={expandOnRowClick}
        handleExpandChange={handleExpandChange}
      />
    );
  }

  // 导出：触发展开回调方法
  function handleExpandChange(row, rowKeyValue) {
    let innerExpandRowKeysNew: RowkeyType;
    const isExpanded = innerExpandRowKeys?.includes(rowKeyValue);
    if (isExpanded) {
      innerExpandRowKeysNew = innerExpandRowKeys.filter((item) => item !== rowKeyValue);
    } else {
      innerExpandRowKeysNew = [...innerExpandRowKeys, rowKeyValue];
    }

    if (!isControlled) {
      setThisExpandRowKeys([...innerExpandRowKeysNew]);
    }

    // 触发回调
    typeof onExpandChange === 'function' && onExpandChange(innerExpandRowKeysNew, { expandedRowData: row });
  }

  // 导出：渲染行展开方法
  function renderExpandRow(row, index, rowKeyValue) {
    return (
      <tr
        className={`${classPrefix}-table-expanded-cell`}
        style={innerExpandRowKeys?.includes?.(rowKeyValue) ? {} : { display: 'none' }}
      >
        <td colSpan={transformedExpandColumns?.length}>{expandedRow && expandedRow({ row, index })}</td>
      </tr>
    );
  }

  return [transformedExpandColumns, handleExpandChange, renderExpandRow];
}

export default useExpand;
