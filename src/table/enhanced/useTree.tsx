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

interface UseTreeResult {
  treeColumns: Columns;
  useFlattenData: Function;
  useFlattenRowData: Function;
  getFlattenPageData: Function;
}

function useTree(props: EnhancedTableProps): UseTreeResult {
  const { columns, tree, rowKey, data } = props;
  const { classPrefix } = useConfig();
  const childrenKey = tree?.childrenKey || 'children';
  const indent = tree?.indent || 24;

  const [innerExpandedKeys, setInnerExpandedKeys] = useState([]);
  const mergedExpandedKeys = React.useMemo(() => new Set(innerExpandedKeys || []), [innerExpandedKeys]);

  const treeNodeColumnIndex = getTreeNodeColumnIndex();
  const treeColumns = getTreeColumns(columns);

  function useFlattenData(pageData) {
    const flattenData = useMemo(() => flatVisibleData(pageData), [pageData]);
    return flattenData;
  }

  function useFlattenRowData(needFlat) {
    return needFlat ? flatData(data) : data;
  }

  function getFlattenPageData(pageData) {
    return flatData(pageData, 0, true);
  }

  function flatData(data: Data, level = 0, needParentRowKey?, parentRowKey?): Data {
    const flattenData = [];
    data?.forEach((row) => {
      flattenData.push({ ...row, level, parentRowKey });
      const childrenNodes = get(row, childrenKey);
      flattenData.push(...flatData(childrenNodes, level + 1, needParentRowKey, row[rowKey]));
    });
    return flattenData;
  }

  function flatVisibleData(data: Data, level = 0, parentRowKey?): Data {
    const flattenData = [];
    data?.forEach((row) => {
      flattenData.push({ ...row, level, parentRowKey });
      const childrenNodes = get(row, childrenKey);
      const rowValue = get(row, rowKey);
      const needExpand = Array.isArray(childrenNodes) && childrenNodes.length && mergedExpandedKeys.has(rowValue);
      if (needExpand) {
        flattenData.push(...flatVisibleData(childrenNodes, level + 1, rowValue));
      }
    });
    return flattenData;
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

  return { treeColumns, useFlattenData, useFlattenRowData, getFlattenPageData };
}

export default useTree;
