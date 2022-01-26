import React, { isValidElement, useState, useMemo } from 'react';
import { AddRectangleIcon, MinusRectangleIcon } from 'tdesign-icons-react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import useConfig from '../../_util/useConfig';
import { TdPrimaryTableProps, PrimaryTableCol, PrimaryTableRenderParams, DataType } from '../type';
import { EnhancedTableProps } from './Table';

type Columns = TdPrimaryTableProps['columns'];
type Data = TdPrimaryTableProps['data'];
type CellParams = PrimaryTableRenderParams<DataType>;
type Column = PrimaryTableCol<DataType>;

function useTree(props: EnhancedTableProps): [Columns, Function] {
  const { columns, tree, rowKey } = props;
  const { classPrefix } = useConfig();
  const childrenKey = tree?.childrenKey || 'children';
  const indent = tree?.indent || 24;

  const [innerExpandedKeys, setInnerExpandedKeys] = useState([]);
  const mergedExpandedKeys = React.useMemo(() => new Set(innerExpandedKeys || []), [innerExpandedKeys]);

  const treeNodeColumnIndex = getTreeNodeColumnIndex();
  const transformedTreeColumns = getTreeColumns(columns);

  function useTreeData(pageData) {
    const expandedData = useMemo(() => flattenData(pageData), [pageData]);
    return expandedData;
  }

  function flattenData(data: Data, level = 0): Data {
    const flatData = [];
    data.forEach((row) => {
      flatData.push({ ...row, level });
      const childrenNodes = get(row, childrenKey);
      const rowValue = get(row, rowKey);
      const needExpand = Array.isArray(childrenNodes) && childrenNodes.length && mergedExpandedKeys.has(rowValue);
      if (needExpand) {
        flatData.push(...flattenData(childrenNodes, level + 1));
      }
    });
    return flatData;
  }

  function getTreeNodeColumnIndex() {
    let treeNodeColumnIndex = tree?.treeNodeColumnIndex || 0;
    if (columns[treeNodeColumnIndex]?.type) {
      treeNodeColumnIndex += 1;
    }
    return treeNodeColumnIndex;
  }

  function getTreeColumns(columns: Columns): Columns {
    return columns.map((column, index) => {
      if (treeNodeColumnIndex !== index) {
        return column;
      }

      const cell = (cellParams: CellParams) => {
        const originCellResult = getOriginCellResult(column, cellParams);
        const { row } = cellParams;
        const childrenNodes = get(row, childrenKey);
        const colStyle = { paddingLeft: row.level * indent };

        if (Array.isArray(childrenNodes) && childrenNodes.length) {
          const rowValue = get(row, rowKey);
          const expanded = mergedExpandedKeys.has(rowValue);
          const style = { marginRight: 8 };
          return (
            <div className={`${classPrefix}-table__tree-col`} style={colStyle}>
              {expanded ? (
                <MinusRectangleIcon
                  style={style}
                  onClick={() => {
                    foldTree(rowValue);
                  }}
                />
              ) : (
                <AddRectangleIcon
                  style={style}
                  onClick={() => {
                    expandTree(rowValue);
                  }}
                />
              )}
              {originCellResult}
            </div>
          );
        }
        return <div style={colStyle}>{originCellResult}</div>;
      };
      return {
        ...column,
        cell,
      };
    });
  }

  function expandTree(rowValue) {
    const expandedKeys = [...mergedExpandedKeys, rowValue];
    setInnerExpandedKeys(expandedKeys);
  }

  function foldTree(rowValue) {
    mergedExpandedKeys.delete(rowValue);
    const expandedKeys = [...mergedExpandedKeys];
    setInnerExpandedKeys(expandedKeys);
  }

  function getOriginCellResult(column: Column, cellParams: CellParams) {
    const { colKey, cell, render } = column;
    if (typeof cell === 'string' || isValidElement(cell)) {
      return cell;
    }
    if (isFunction(cell)) {
      return cell(cellParams);
    }
    if (isFunction(render)) {
      return render(cellParams);
    }
    return get(cellParams.row, colKey);
  }

  return [transformedTreeColumns, useTreeData];
}

export default useTree;
