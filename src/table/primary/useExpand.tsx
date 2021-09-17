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
 * 2.返回展开行 Array[]
 * 3.返回改变展开行数组内容的方法
 */
function useExpand(props: PrimaryTableProps): [PrimaryTableCol[], RowkeyType, Function] {
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
  const [thisExpandRowKeys, setThisExpandRowKeys] = useState<RowkeyType>(
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

  //  渲染展开单元格内容
  function renderExpandIconCell({ row = {} }: Record<string, any>) {
    const rowKeyValue = get(row, rowKey);
    if (!Array.isArray(thisExpandRowKeys)) {
      console.error(`ExpandedRowKeys type error`);
      return;
    }
    const isShowExpanded = thisExpandRowKeys?.includes(rowKeyValue);
    return (
      <ExpandBox
        expanded={isShowExpanded}
        row={row}
        rowKeyValue={rowKeyValue}
        showExpandArrow={showExpandArrow}
        expandOnRowClick={expandOnRowClick}
        handleExpandChange={handleExpandChange}
      />
    );
  }

  // 触发展开回调
  function handleExpandChange(row, rowKeyValue) {
    let thisExpandRowKeysNew: RowkeyType;
    const isExpanded = thisExpandRowKeys?.includes(rowKeyValue);
    if (isExpanded) {
      thisExpandRowKeysNew = thisExpandRowKeys.filter((item) => item !== rowKeyValue);
    } else {
      thisExpandRowKeysNew = [...thisExpandRowKeys, rowKeyValue];
    }

    if (!isControlled) {
      setThisExpandRowKeys([...thisExpandRowKeysNew]);
    }

    // 触发回调
    typeof onExpandChange === 'function' && onExpandChange(thisExpandRowKeysNew, { expandedRowData: row });
  }

  const transformedExpandColumns = transformedExpandColumnsFun();

  return [transformedExpandColumns, thisExpandRowKeys, handleExpandChange];
}

export default useExpand;
