import { useState, useMemo } from 'react';
import { get, isFunction } from 'lodash-es';
import { getEditableKeysMap } from '@tdesign/common-js/table/utils';
import { PrimaryTableProps } from '../interface';
import { validate } from '../../form/formModel';
import { AllValidateResult } from '../../form';
import { PrimaryTableRowEditContext, TableRowData, TableErrorListMap } from '../type';

export type ErrorListObjectType = PrimaryTableRowEditContext<TableRowData> & { errorList: AllValidateResult[] };

export interface TablePromiseErrorData {
  errors: ErrorListObjectType[];
  errorMap: TableErrorListMap;
}

export function useEditableRow(props: PrimaryTableProps) {
  const cellRuleMap = useMemo(() => new Map<any, PrimaryTableRowEditContext<TableRowData>[]>(), []);
  const { editableRowKeys } = props;
  // 校验不通过的错误信息，其中 key 值为 [rowValue, col.colKey].join('__')
  const [errorListMap, setErrorListMap] = useState<TableErrorListMap>({});
  const editableKeysMap = useMemo(
    () => editableRowKeys && getEditableKeysMap(editableRowKeys, props.data, props.rowKey || 'id'),
    [editableRowKeys, props.data, props.rowKey],
  );

  const getErrorListMapByErrors = (errors: ErrorListObjectType[]): TableErrorListMap => {
    const errorMap: TableErrorListMap = {};
    errors.forEach(({ row, col, errorList }) => {
      const rowValue = get(row, props.rowKey || 'id');
      const key = [rowValue, col.colKey].join('__');
      if (errorList?.length) {
        errorMap[key] = errorList;
      } else {
        delete errorMap[key];
      }
    });
    return errorMap;
  };

  // 校验一行的数据
  const validateOneRowData = (rowValue: any) => {
    const rowRules = cellRuleMap.get(rowValue);
    if (!rowRules) return;
    const list = rowRules.map(
      (item) =>
        new Promise<ErrorListObjectType>((resolve) => {
          const { editedRow, col } = item;
          const rules = isFunction(col.edit.rules) ? col.edit.rules(item) : col.edit.rules;
          if (!col.edit || !rules || !rules) {
            resolve({ ...item, errorList: [] });
            return;
          }
          validate(get(editedRow, col.colKey), rules).then((r) => {
            resolve({ ...item, errorList: r.filter((t) => !t.result) });
          });
        }),
    );
    return new Promise<TablePromiseErrorData>((resolve, reject) => {
      Promise.all(list).then((errors) => {
        resolve({
          errors: errors.filter((t) => t.errorList?.length),
          errorMap: getErrorListMapByErrors(errors),
        });
      }, reject);
    });
  };

  /**
   * 校验表格单行数据（对外开放方法，修改时需慎重）
   * @param rowValue 行唯一标识
   */
  const validateRowData = (rowValue: any) =>
    new Promise((resolve, reject) => {
      validateOneRowData(rowValue).then(({ errors, errorMap }) => {
        setErrorListMap(errorMap);
        // 缺少校验文本显示
        const tTrigger = 'parent';
        props.onRowValidate?.({ trigger: tTrigger, result: errors });
        resolve({ trigger: tTrigger, result: errors });
      }, reject);
    });

  /**
   * 校验整个表格数据（对外开放方法，修改时需慎重）
   */
  const validateTableData = () => {
    const promiseList: Promise<TablePromiseErrorData>[] = [];
    const data = props.data || [];
    for (let i = 0, len = data.length; i < len; i++) {
      const rowValue = get(data[i], props.rowKey || 'id');
      promiseList.push(validateOneRowData(rowValue));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promiseList).then((rList) => {
        const allErrorListMap: TableErrorListMap = {};
        rList.forEach(({ errorMap } = { errors: [], errorMap: {} }) => {
          errorMap && Object.assign(allErrorListMap, errorMap);
        });
        setErrorListMap(allErrorListMap);
        props.onValidate?.({ result: allErrorListMap });
        resolve({ result: allErrorListMap });
      }, reject);
    });
  };

  const onRuleChange = (context: PrimaryTableRowEditContext<TableRowData>) => {
    // 编辑行，预存校验信息，方便最终校验
    if (props.editableRowKeys) {
      const rowValue = get(context.row, props.rowKey || 'id');
      const rules = cellRuleMap.get(rowValue);
      if (rules) {
        const index = rules.findIndex((t) => t.col.colKey === context.col.colKey);
        if (index === -1) {
          rules.push(context);
        } else {
          rules[index] = context;
        }
        cellRuleMap.set(rowValue, rules);
      } else {
        cellRuleMap.set(rowValue, [context]);
      }
    }
  };

  const clearValidateData = () => {
    setErrorListMap({});
  };

  return {
    errorListMap,
    editableKeysMap,
    validateRowData,
    validateTableData,
    clearValidateData,
    onRuleChange,
  };
}
