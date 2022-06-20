import React, { useEffect, useMemo, useRef, useState, MouseEvent } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import { Edit1Icon } from 'tdesign-icons-react';
import classNames from 'classnames';
import { TableRowData, PrimaryTableCol } from './type';
import useClassName from './hooks/useClassName';
import { renderCell } from './TR';
import { validate } from '../form/formModel';
import log from '../_common/js/log';

export interface EditableCellProps {
  row: TableRowData;
  rowIndex: number;
  col: PrimaryTableCol<TableRowData>;
  colIndex: number;
  oldCell: PrimaryTableCol<TableRowData>['cell'];
}

const EditableCell = (props: EditableCellProps) => {
  const { row, col } = props;
  const { tableBaseClass } = useClassName();
  const tableEditableCellRef = useRef(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState();
  const [errorList, setErrorList] = useState([]);

  const currentRow = useMemo(() => {
    const newRow = { ...row };
    set(newRow, col.colKey, editValue);
    return newRow;
  }, [col.colKey, editValue, row]);

  const cellNode = useMemo(() => {
    const node = renderCell({
      row: currentRow,
      col: { ...col, cell: props.oldCell },
      rowIndex: props.rowIndex,
      colIndex: props.colIndex,
    });
    return node;
  }, [col, currentRow, props.colIndex, props.oldCell, props.rowIndex]);

  const componentProps = useMemo(() => {
    const { edit } = col;
    if (!edit) return {};
    const editProps = { ...edit.props };
    // to remove warn: runtime-core.esm-bundler.js:38 [Vue warn]: Invalid prop: type check failed for prop "onChange". Expected Function, got Array
    delete editProps.onChange;
    delete editProps.value;
    edit.abortEditOnEvent?.forEach((item) => {
      delete editProps[item];
    });
    return editProps;
  }, [col]);

  const isAbortEditOnChange = useMemo(() => {
    const { edit } = col;
    if (!edit) return false;
    return Boolean(edit.abortEditOnEvent?.includes('onChange'));
  }, [col]);

  const validateEdit = () =>
    new Promise((resolve) => {
      if (!col.edit?.rules) {
        resolve(true);
        return;
      }
      validate(editValue, col.edit?.rules).then((result) => {
        const tErrorList = result?.filter((t) => !t.result);
        setErrorList(tErrorList);
        if (!tErrorList || !tErrorList.length) {
          resolve(true);
        } else {
          resolve(tErrorList);
        }
      });
    });

  const isSame = (a: any, b: any) => {
    if (typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
  };

  const updateAndSaveAbort = (outsideAbortEvent: Function, ...args: any) => {
    validateEdit().then((result) => {
      if (result !== true) return;
      // 相同的值无需触发变化
      if (!isSame(editValue, get(row, col.colKey))) {
        outsideAbortEvent?.(...args);
      }
      // 此处必须在事件执行完成后异步销毁编辑组件，否则会导致事件清楚不及时引起的其他问题
      const timer = setTimeout(() => {
        setIsEdit(false);
        clearTimeout(timer);
      }, 0);
    });
  };

  const listeners = useMemo<{ [key: string]: Function }>(() => {
    const { edit } = col;
    if (!isEdit) return;
    if (!edit?.abortEditOnEvent?.length) return {};
    // 自定义退出编辑态的事件
    const tListeners = {};
    edit.abortEditOnEvent.forEach((itemEvent) => {
      if (itemEvent === 'onChange') return;
      const outsideAbortEvent = edit.props[itemEvent];
      tListeners[itemEvent] = (...args: any) => {
        updateAndSaveAbort(
          outsideAbortEvent,
          {
            trigger: itemEvent,
            newRowData: currentRow,
            rowIndex: props.rowIndex,
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
    if (isAbortEditOnChange) {
      const outsideAbortEvent = col.edit?.onEdited;
      updateAndSaveAbort(
        outsideAbortEvent,
        {
          trigger: 'onChange',
          newRowData: currentRow,
          rowIndex: props.rowIndex,
        },
        ...args,
      );
    }
  };

  const documentClickHandler = (e: PointerEvent) => {
    if (!col.edit || !col.edit.component) return;
    if (!isEdit || !tableEditableCellRef?.current) return;
    // @ts-ignore
    if (e.path?.includes(tableEditableCellRef?.current)) return;
    const outsideAbortEvent = col.edit.onEdited;
    updateAndSaveAbort(outsideAbortEvent, {
      trigger: 'document',
      newRowData: currentRow,
      rowIndex: props.rowIndex,
    });
  };

  useEffect(() => {
    let val = get(row, col.colKey);
    if (typeof val === 'object') {
      val = val instanceof Array ? [...val] : { ...val };
    }
    setEditValue(val);
  }, [col.colKey, row]);

  useEffect(() => {
    if (!col.edit || !col.edit.component) return;
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

  // 这是非编辑态
  if (!isEdit) {
    return (
      <div
        className={classNames(tableBaseClass.cellEditable)}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          setIsEdit(true);
          e.stopPropagation();
        }}
      >
        {cellNode}
        <Edit1Icon size="12px" />
      </div>
    );
  }
  const Component = col.edit?.component;
  if (!Component) {
    log.error('Table', 'edit.component is required.');
    return null;
  }
  const errorMessage = errorList?.[0]?.message;
  return (
    <div
      className={tableBaseClass.cellEditWrap}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Component
        ref={tableEditableCellRef}
        status={errorMessage ? errorList?.[0]?.type || 'error' : undefined}
        tips={errorMessage}
        {...componentProps}
        {...listeners}
        // @ts-ignore
        value={editValue}
        onChange={onEditChange}
      />
    </div>
  );
};

EditableCell.displayName = 'EditableCell';

export default EditableCell;
