import React, { useEffect, useMemo, useRef, useState, MouseEvent } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import { Edit1Icon as TdEdit1Icon } from 'tdesign-icons-react';
import classNames from 'classnames';
import {
  TableRowData,
  PrimaryTableCol,
  PrimaryTableRowEditContext,
  PrimaryTableRowValidateContext,
  TdBaseTableProps,
  PrimaryTableCellParams,
} from './type';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { TableClassName } from './hooks/useClassName';
import { renderCell } from './Cell';
import { validate } from '../form/formModel';
import log from '../_common/js/log';
import { AllValidateResult } from '../form/type';
import useConfig from '../hooks/useConfig';

export interface EditableCellProps {
  row: TableRowData;
  rowIndex: number;
  col: PrimaryTableCol<TableRowData>;
  colIndex: number;
  oldCell: PrimaryTableCol<TableRowData>['cell'];
  tableBaseClass?: TableClassName['tableBaseClass'];
  /** 行编辑需要使用 editable。单元格编辑则无需使用，设置为 undefined */
  editable?: boolean;
  readonly?: boolean;
  errors?: AllValidateResult[];
  cellEmptyContent?: TdBaseTableProps['cellEmptyContent'];
  onChange?: (context: PrimaryTableRowEditContext<TableRowData>) => void;
  onValidate?: (context: PrimaryTableRowValidateContext<TableRowData>) => void;
  onRuleChange?: (context: PrimaryTableRowEditContext<TableRowData>) => void;
}

const EditableCell = (props: EditableCellProps) => {
  const { row, col, colIndex, rowIndex, errors, editable, tableBaseClass } = props;
  const { Edit1Icon } = useGlobalIcon({ Edit1Icon: TdEdit1Icon });
  const tableEditableCellRef = useRef(null);
  const [isEdit, setIsEdit] = useState(props.col.edit?.defaultEditable || false);
  const [editValue, setEditValue] = useState();
  const [errorList, setErrorList] = useState<AllValidateResult[]>([]);
  const { classPrefix } = useConfig();

  const getCurrentRow = (row: TableRowData, colKey: string, value: any) => {
    const newRow = { ...row };
    set(newRow, colKey, value);
    return newRow;
  };

  const cellParams: PrimaryTableCellParams<TableRowData> = useMemo(
    () => ({
      col,
      row,
      colIndex,
      rowIndex,
    }),
    [col, row, colIndex, rowIndex],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentRow = useMemo(() => getCurrentRow(row, col.colKey, editValue), [col.colKey, editValue, row]);

  const editOnListeners = useMemo(
    () => col.edit?.on?.({ ...cellParams, editedRow: currentRow }) || {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cellParams, currentRow],
  );

  const cellNode = useMemo(() => {
    const node = renderCell(
      {
        row: currentRow,
        col: { ...col, cell: props.oldCell },
        rowIndex: props.rowIndex,
        colIndex: props.colIndex,
      },
      { cellEmptyContent: props.cellEmptyContent },
    );
    return node;
  }, [col, currentRow, props.cellEmptyContent, props.colIndex, props.oldCell, props.rowIndex]);

  const componentProps = useMemo(() => {
    const { edit } = col;
    if (!edit) return {};
    const editProps = isFunction(edit.props) ? edit.props({ ...cellParams, editedRow: currentRow }) : { ...edit.props };
    // to remove warn: runtime-core.esm-bundler.js:38 [Vue warn]: Invalid prop: type check failed for prop "onChange". Expected Function, got Array
    delete editProps.onChange;
    delete editProps.value;
    edit.abortEditOnEvent?.forEach((item) => {
      delete editProps[item];
    });
    return editProps;
  }, [currentRow, cellParams, col]);

  const isAbortEditOnChange = useMemo(() => {
    const { edit } = col;
    if (!edit) return false;
    return Boolean(edit.abortEditOnEvent?.includes('onChange'));
  }, [col]);

  const validateEdit = (trigger: 'self' | 'parent', newVal: any) =>
    new Promise((resolve) => {
      const params: PrimaryTableRowValidateContext<TableRowData> = {
        result: [
          {
            ...cellParams,
            errorList: [],
            value: newVal,
          },
        ],
        trigger,
      };
      const rules = isFunction(col.edit.rules) ? col.edit.rules(cellParams) : col.edit.rules;
      if (!col.edit || !rules || !rules.length) {
        props.onValidate?.(params);
        resolve(true);
        return;
      }
      validate(newVal, rules).then((result) => {
        const list = result?.filter((t) => !t.result);
        params.result[0].errorList = list;
        props.onValidate?.(params);
        if (!list || !list.length) {
          setErrorList([]);
          resolve(true);
        } else {
          setErrorList(list);
          resolve(list);
        }
      });
    });

  const isSame = (a: any, b: any) => {
    if (typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
  };

  const updateAndSaveAbort = (outsideAbortEvent: Function, eventName: string, ...args: any) => {
    validateEdit('self', args[0].value).then((result) => {
      if (result !== true) return;
      const oldValue = get(row, col.colKey);
      // 相同的值无需触发变化
      if (!isSame(args[0].value, oldValue)) {
        // 恢复数据，保持受控
        setEditValue(oldValue);
        outsideAbortEvent?.(...args);
      }
      editOnListeners[eventName]?.(args[2]);
      // 此处必须在事件执行完成后异步销毁编辑组件，否则会导致事件清除不及时引起的其他问题
      const timer = setTimeout(() => {
        setIsEdit(false);
        setErrorList([]);
        clearTimeout(timer);
      }, 0);
    });
  };

  const listeners = useMemo<{ [key: string]: Function }>(() => {
    const { edit } = col;
    const isCellEditable = props.editable === undefined;
    if (!isEdit || !isCellEditable) return;
    if (!edit?.abortEditOnEvent?.length) return {};
    // 自定义退出编辑态的事件
    const tListeners = {};
    const outsideAbortEvent = edit?.onEdited;
    edit.abortEditOnEvent.forEach((itemEvent) => {
      if (itemEvent === 'onChange') return;
      tListeners[itemEvent] = (...args: any) => {
        updateAndSaveAbort(
          outsideAbortEvent,
          itemEvent,
          {
            ...cellParams,
            value: editValue,
            trigger: itemEvent,
            newRowData: currentRow,
          },
          ...args,
        );
      };
    });
    return tListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col, currentRow, isEdit, props.rowIndex]);

  const onEditChange = (val: any, ...args: any) => {
    setEditValue(val);
    const params = {
      ...cellParams,
      value: val,
      editedRow: { ...props.row, [props.col.colKey]: val },
    };
    props.onChange?.(params);
    props.onRuleChange?.(params);
    editOnListeners.onChange?.(params);
    const isCellEditable = props.editable === undefined;
    if (isCellEditable && isAbortEditOnChange) {
      const outsideAbortEvent = col.edit?.onEdited;
      // editValue 和 currentRow 更新完成后再执行这个函数
      updateAndSaveAbort(
        outsideAbortEvent,
        'change',
        {
          value: val,
          trigger: 'onChange',
          newRowData: getCurrentRow(currentRow, col.colKey, val),
          rowIndex: props.rowIndex,
        },
        ...args,
      );
    }
    // 数据变化时，实时校验
    if (col.edit?.validateTrigger === 'change') {
      validateEdit('self', val);
    }
  };

  const documentClickHandler: EventListener = (e) => {
    if (!col.edit || !col.edit.component) return;
    if (!isEdit) return;
    // @ts-ignore some browser is also only support e.path
    const path = e.composedPath?.() || e.path || [];
    const node = path.find((node: HTMLElement) => node.classList?.contains(`${classPrefix}-popup__content`));
    if (node) return;
    const outsideAbortEvent = col.edit.onEdited;
    updateAndSaveAbort(outsideAbortEvent, '', {
      value: editValue,
      trigger: 'document',
      newRowData: currentRow,
      rowIndex: props.rowIndex,
    });
  };

  const cellValue = useMemo(() => get(row, col.colKey), [row, col.colKey]);

  useEffect(() => {
    let val = cellValue;
    if (typeof val === 'object' && val !== null) {
      val = val instanceof Array ? [...val] : { ...val };
    }
    setEditValue(val);
  }, [cellValue]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isCellEditable = props.editable === undefined;
    if (!col.edit || !col.edit.component || !isCellEditable) return;
    if (isEdit) {
      document.addEventListener('click', documentClickHandler);
    } else {
      document.removeEventListener('click', documentClickHandler);
    }
    return () => {
      document.removeEventListener('click', documentClickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col.edit, isEdit, editValue]);

  useEffect(() => {
    // 退出编辑态时，恢复原始值，等待父组件传入新的 data 值
    if (props.editable === false) {
      setEditValue(cellValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellValue, editable]);

  useEffect(() => {
    if (props.editable === true) {
      props.onRuleChange?.({
        ...cellParams,
        value: cellValue,
        editedRow: currentRow || row,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editable, cellValue, row, col, cellParams, currentRow]);

  useEffect(() => {
    setErrorList(errors);
  }, [errors]);

  if (props.readonly) {
    return cellNode || null;
  }

  // 这是非编辑态
  if ((props.editable === undefined && !isEdit) || editable === false) {
    return (
      <div
        className={classNames(tableBaseClass.cellEditable)}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          setIsEdit(true);
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        {cellNode}
        {col.edit?.showEditIcon !== false && <Edit1Icon />}
      </div>
    );
  }
  const Component = col.edit?.component;
  if (!Component) {
    log.error('Table', 'edit.component is required.');
    return null;
  }
  const errorMessage = errorList?.[0]?.message;

  const tmpEditOnListeners = { ...editOnListeners };
  delete tmpEditOnListeners.onChange;
  // remove conflict events
  if (col.edit?.abortEditOnEvent?.length) {
    col.edit.abortEditOnEvent.forEach((onEventName) => {
      if (tmpEditOnListeners[onEventName]) {
        delete tmpEditOnListeners[onEventName];
      }
    });
  }
  return (
    <div
      className={tableBaseClass.cellEditWrap}
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      <Component
        ref={tableEditableCellRef}
        status={errorMessage ? errorList?.[0]?.type || 'error' : undefined}
        tips={errorMessage}
        {...componentProps}
        {...listeners}
        {...tmpEditOnListeners}
        value={editValue}
        onChange={onEditChange}
      />
    </div>
  );
};

EditableCell.displayName = 'EditableCell';

export default EditableCell;
