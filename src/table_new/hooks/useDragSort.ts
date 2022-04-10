// 表格 行拖拽 + 列拖拽功能
import { MutableRefObject, useEffect, useState } from 'react';
import { SortableEvent } from 'sortablejs';
import get from 'lodash/get';
import { TdPrimaryTableProps } from '../type';
import { TargetDom } from '../interface';
import { setSortableConfig } from '../utils';
import useClassName from './useClassName';
import log from '../../_common/js/log';

export default function useDragSort(props: TdPrimaryTableProps, primaryTableRef: MutableRefObject<any>) {
  const { sortOnRowDraggable, dragSort, columns, data } = props;
  // 判断是否有拖拽列
  const dragCol = columns.find((item) => item.colKey === 'drag');
  // 行拖拽判断条件
  const isRowDraggable = sortOnRowDraggable || dragSort === 'row';
  // 列拖拽判断条件
  const isColDraggable = ['col'].includes(dragSort) && !!dragCol;

  if (props.sortOnRowDraggable) {
    log.warn('Table', "`sortOnRowDraggable` is going to be deprecated, use dragSort='row' instead.");
  }

  const { tableDraggableClasses } = useClassName();
  // 拖拽实例
  const [dragInstance, setDragInstance] = useState(null);
  // 初始顺序
  const [startList, setStartList] = useState([]);

  useEffect(() => {
    // 更新排列顺序
    const newData = data.map((item) => get(item, props.rowKey));
    setStartList(newData);
  }, [data, props.rowKey]);

  // 注册拖拽事件
  const registerDragEvent = (element: TargetDom) => {
    if (!isColDraggable && !isRowDraggable) {
      return;
    }
    const dragContainer = element?.querySelector('tbody');

    const { handle, ghost } = tableDraggableClasses;
    const baseOptions = {
      animation: 150,
      // 放置占位符的类名
      ghostClass: ghost,
      onEnd(evt: SortableEvent) {
        // 拖拽列表恢复原始排序
        dragInstance?.sort(startList);
        const { oldIndex, newIndex } = evt;
        const newData = [...props.data];
        if (newIndex - oldIndex > 0) {
          newData.splice(newIndex + 1, 0, newData[oldIndex]);
          newData.splice(oldIndex, 1);
        } else {
          newData.splice(newIndex, 0, newData[oldIndex]);
          newData.splice(oldIndex + 1, 1);
        }

        const params = {
          currentIndex: evt.oldIndex,
          current: props.data[evt.oldIndex],
          targetIndex: evt.newIndex,
          target: props.data[evt.newIndex],
          currentData: newData,
          e: evt,
        };
        props.onDragSort?.(params);
      },
    };

    const colOptions = {
      handle: `.${handle}`,
      ...baseOptions,
    };
    let dragInstanceTmp = null;
    if (isRowDraggable) {
      dragInstanceTmp = setSortableConfig(dragContainer, { ...baseOptions });
    } else {
      dragInstanceTmp = setSortableConfig(dragContainer, colOptions);
    }
    setDragInstance(dragInstanceTmp);
    setStartList(dragInstanceTmp?.toArray());
  };

  // 注册拖拽事件
  useEffect(() => {
    if (!primaryTableRef || !primaryTableRef.current) return;
    registerDragEvent(primaryTableRef.current?.tableElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryTableRef]);

  return {
    isRowDraggable,
    isColDraggable,
  };
}
