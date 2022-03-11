import React, { isValidElement, useState, useMemo, useCallback } from 'react';
import classnames from 'classnames';
import { AddRectangleIcon, MinusRectangleIcon } from 'tdesign-icons-react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import useConfig from '../../_util/useConfig';
import { TdPrimaryTableProps, PrimaryTableCol, PrimaryTableRenderParams, DataType } from '../type';
import { EnhancedTableProps } from './Table';

type Columns = TdPrimaryTableProps['columns'];
type Data = TdPrimaryTableProps['data'];
interface CellParams extends PrimaryTableRenderParams<DataType> {
  className?: string;
}
type Column = PrimaryTableCol<DataType>;

interface UseTreeResult {
  treeColumns: Columns;
  getFlattenData: Function;
  getFlattenRowData: Function;
  getFlattenPageData: Function;
}

function useTree(props: EnhancedTableProps): UseTreeResult {
  const { columns, tree, rowKey, data } = props;
  const { classPrefix } = useConfig();
  const childrenKey = tree?.childrenKey || 'children';

  const [innerExpandedKeys, setInnerExpandedKeys] = useState([]);
  const mergedExpandedKeys = useMemo(() => new Set(innerExpandedKeys || []), [innerExpandedKeys]);
  const treeColumns = useMemo(() => {
    const indent = tree?.indent || 24;

    function getTreeColumns(columns: Columns, tree, mergedExpandedKeys): Columns {
      const treeNodeColumnIndex = getTreeNodeColumnIndex(tree, columns);

      return columns.map((column, index) => {
        if (treeNodeColumnIndex !== index) {
          return column;
        }

        const cell = (cellParams: CellParams) => {
          const originCellResult = getOriginCellResult(column, cellParams);
          const { row, className } = cellParams;
          const childrenNodes = get(row, childrenKey);
          const colStyle = { paddingLeft: row.level * indent };

          if (Array.isArray(childrenNodes) && childrenNodes.length) {
            const rowValue = get(row, rowKey);
            const expanded = mergedExpandedKeys.has(rowValue);
            const style = { marginRight: 8 };
            return (
              <div className={classnames(`${classPrefix}-table__tree-col`, className)} style={colStyle}>
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
          return (
            <div className={className} style={colStyle}>
              {originCellResult}
            </div>
          );
        };

        return {
          ...column,
          cell,
          ...(column.ellipsis === true
            ? { ellipsis: (cellParams: CellParams) => getOriginCellResult(column, cellParams) }
            : {}),
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

    function getTreeNodeColumnIndex(tree, columns) {
      let treeNodeColumnIndex = tree?.treeNodeColumnIndex || 0;
      if (columns[treeNodeColumnIndex]?.type) {
        treeNodeColumnIndex += 1;
      }
      return treeNodeColumnIndex;
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

    return getTreeColumns(columns, tree, mergedExpandedKeys);
  }, [columns, tree, mergedExpandedKeys, childrenKey, classPrefix, rowKey]);

  const flatData = useCallback(
    (data: Data, level = 0, needParentRowKey?, parentRowKey?) => {
      const flattenData = [];
      data?.forEach((row) => {
        flattenData.push({ ...row, level, parentRowKey });
        const childrenNodes = get(row, childrenKey);
        flattenData.push(...flatData(childrenNodes, level + 1, needParentRowKey, row[rowKey]));
      });
      return flattenData;
    },
    [childrenKey, rowKey],
  );

  const getFlattenData = useCallback(
    (pageData) => {
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
      const flattenData = flatVisibleData(pageData);
      return flattenData;
    },
    [childrenKey, mergedExpandedKeys, rowKey],
  );

  const getFlattenRowData = useCallback((needFlat) => (needFlat ? flatData(data) : data), [data, flatData]);
  const getFlattenPageData = useCallback((pageData) => flatData(pageData, 0, true), [flatData]);

  return { treeColumns, getFlattenData, getFlattenRowData, getFlattenPageData };
}

export default useTree;
