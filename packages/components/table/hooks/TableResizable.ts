/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import type { BaseTableCol, TableRowData, TdBaseTableProps } from '../type';

interface ColumnConfig {
  colKey: string;
  element: HTMLElement;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  disabled?: boolean;
  fixed?: 'left' | 'right';
}

const MIN_WIDTH = 80;
const MAX_WIDTH = Infinity;

const HANDLE_CLASS_SUFFIX = '-table__resize-handle';

class TableResizable {
  private readonly handleClass: string;

  private tableEl: HTMLTableElement;

  private tableContentEl: HTMLDivElement;

  private columns: ColumnConfig[];

  private columnsWidth: number[] = [];

  private activeColumn: number | null = null;

  private startX = 0;

  private startWidth = 0;

  private startTableWidth = 0;

  private minTableWidth = 0;

  private onColumnResizeChange?: TdBaseTableProps['onColumnResizeChange'];

  constructor(
    classPrefix: string,
    table: HTMLTableElement,
    columns: BaseTableCol<TableRowData>[],
    onColumnResizeChange?: TdBaseTableProps['onColumnResizeChange'],
  ) {
    this.handleClass = `${classPrefix}-${HANDLE_CLASS_SUFFIX}`;
    this.tableEl = table;
    this.columns = this.mapColumnsToConfig(columns);
    this.tableContentEl = this.tableEl.closest(`.${classPrefix}-table__content`);
    this.minTableWidth = this.tableContentEl.offsetWidth;
    this.onColumnResizeChange = onColumnResizeChange;
    this.init();
  }

  private mapColumnsToConfig(columns: BaseTableCol<TableRowData>[]) {
    const thElements = this.tableEl.querySelectorAll('thead th');
    if (!thElements) return;
    return columns.map((col, index) => {
      const element = thElements[index] as HTMLElement;

      const resizeConfig = col.resize;
      const minWidth = resizeConfig?.minWidth ?? MIN_WIDTH;
      const maxWidth = resizeConfig?.maxWidth ?? MAX_WIDTH;

      const disabled = col.resizable === false;

      let width: number | undefined;
      if (col.width) {
        width = typeof col.width === 'number' ? col.width : parseInt(col.width, 10);
      }

      return {
        colKey: col.colKey,
        element,
        minWidth,
        maxWidth,
        width,
        disabled,
      } as ColumnConfig;
    });
  }

  private initializeColumnsWidth(): void {
    this.columnsWidth = this.columns.map((col) => {
      if (!col?.element) return 0;
      return col.element.offsetWidth;
    });
  }

  private updateColumnWidth(columnIndex: number, width: number): void {
    const column = this.columns[columnIndex];
    if (!column?.element) return;

    column.element.style.width = `${width}px`;

    const colElements = this.tableEl.querySelectorAll('colgroup col');
    const colElement = colElements[columnIndex] as HTMLElement;
    if (colElement) {
      colElement.style.width = `${width}px`;
    }
  }

  private createResizeHandle(isLastColumn = false): HTMLElement {
    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.top = '0';

    if (isLastColumn) {
      // 最后一列的手柄不向右延伸，避免占据表格外的空间
      handle.style.right = '0px';
      handle.style.width = '8px';
    } else {
      handle.style.right = '-8px';
      handle.style.width = '16px'; // 左右各 8px
    }

    handle.style.cursor = 'col-resize';
    handle.style.height = '100%';
    handle.style.userSelect = 'none';
    handle.classList.add(this.handleClass);
    handle.dataset.resizable = 'true';
    return handle;
  }

  private updateHandleCursor(columnIndex: number, handle: HTMLElement) {
    // 找到最后一个未被禁用的列
    let lastColumnIndex = this.columns.length - 1;
    while (lastColumnIndex >= 0 && this.columns[lastColumnIndex]?.disabled) {
      lastColumnIndex -= 1;
    }

    // 如果是最后一个有效列，检查是否应该显示 not-allowed
    if (columnIndex === lastColumnIndex) {
      const currentTableWidth = this.tableEl.offsetWidth;
      const lastColumn = this.columns[lastColumnIndex];
      const currentColumnWidth = lastColumn.element.offsetWidth;

      // 只有当最后一列已经达到最小宽度且表格宽度小于容器宽度时才显示 not-allowed
      if (currentColumnWidth <= (lastColumn.minWidth || MIN_WIDTH) && currentTableWidth < this.minTableWidth) {
        handle.style.cursor = 'not-allowed';
        return;
      }
    }

    handle.style.cursor = 'col-resize';
  }

  private init(): void {
    // 初始化所有列的宽度
    this.initializeColumnsWidth();

    // 找到最后一个未被禁用的列
    let lastEnabledColumnIndex = -1;
    for (let i = this.columns.length - 1; i >= 0; i--) {
      if (this.columns[i] && !this.columns[i].disabled) {
        lastEnabledColumnIndex = i;
        break;
      }
    }

    this.columns.forEach((col, index) => {
      if (!col?.element) return;
      // 如果列被禁用，添加禁用样式但不添加拖拽手柄
      if (col.disabled) {
        col.element.style.cursor = 'not-allowed';
        return;
      }

      const isLastColumn = index === lastEnabledColumnIndex;
      const handle = this.createResizeHandle(isLastColumn);
      col.element.style.position = 'relative';
      col.element.appendChild(handle);

      handle.addEventListener('mousedown', (e) => this.onMouseDown(e, index));
    });

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseDown = (e: MouseEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const column = this.columns[columnIndex];
    if (column.disabled) {
      return;
    }

    // 找到最后一个未被禁用的列
    let lastColumnIndex = this.columns.length - 1;
    while (lastColumnIndex >= 0 && this.columns[lastColumnIndex]?.disabled) {
      lastColumnIndex -= 1;
    }

    // 如果是最后一个有效列，检查是否允许拖拽
    if (columnIndex === lastColumnIndex) {
      const currentTableWidth = this.tableEl.offsetWidth;
      const currentColumnWidth = column.element.offsetWidth;

      // 只有当最后一列已经达到最小宽度且表格宽度小于容器宽度时，阻止拖拽
      if (currentColumnWidth <= (column.minWidth || MIN_WIDTH) && currentTableWidth < this.minTableWidth) {
        return;
      }
    }

    this.activeColumn = columnIndex;
    this.startX = e.pageX;
    this.startWidth = column.element.offsetWidth;
    this.startTableWidth = this.tableEl.offsetWidth;

    this.columnsWidth = this.columns.map((col) => col?.element?.offsetWidth || 0);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.activeColumn === null) return;

    const col = this.columns[this.activeColumn];
    const diff = e.pageX - this.startX;

    const newWidth = this.startWidth + diff;
    let actualWidth = newWidth;

    if (col.minWidth !== undefined) {
      actualWidth = Math.max(actualWidth, col.minWidth);
    }
    if (col.maxWidth !== undefined) {
      actualWidth = Math.min(actualWidth, col.maxWidth);
    }

    // 检查是否达到边界，更新光标
    const reachedBoundary = actualWidth !== newWidth;
    if (reachedBoundary) {
      document.body.style.cursor = 'not-allowed';
    } else {
      document.body.style.cursor = 'col-resize';
    }

    this.updateColumnWidth(this.activeColumn, actualWidth);

    // 找到最后一个未被禁用的列
    let lastColumnIndex = this.columns.length - 1;
    while (lastColumnIndex >= 0 && this.columns[lastColumnIndex]?.disabled) {
      lastColumnIndex -= 1;
    }

    // 计算新的表格宽度（不包含最后一列的调整）
    let newTableWidth = this.startTableWidth + (actualWidth - this.startWidth);

    // 如果找到了有效的最后一列，且不是当前拖拽的列
    if (lastColumnIndex >= 0 && lastColumnIndex !== this.activeColumn) {
      const lastColumn = this.columns[lastColumnIndex];
      const lastColumnOriginalWidth = this.columnsWidth[lastColumnIndex];

      // 先设置新的表格宽度，然后检查是否溢出
      this.tableEl.style.width = `${newTableWidth}px`;

      // 检查表格是否真正溢出（产生滚动条）
      const isOverflow = this.isTableOverflow();

      // 计算表格宽度与容器宽度的差值
      const widthDiff = newTableWidth - this.minTableWidth;

      if (widthDiff < 0) {
        // 情况1：表格宽度小于容器宽度，需要填充最后一列以充满容器
        const lastColumnNewWidth = lastColumnOriginalWidth - widthDiff;

        // 应用最后一列的宽度限制
        let finalLastColumnWidth = lastColumnNewWidth;
        if (lastColumn.minWidth !== undefined) {
          finalLastColumnWidth = Math.max(finalLastColumnWidth, lastColumn.minWidth);
        }
        if (lastColumn.maxWidth !== undefined) {
          finalLastColumnWidth = Math.min(finalLastColumnWidth, lastColumn.maxWidth);
        }

        this.updateColumnWidth(lastColumnIndex, finalLastColumnWidth);
        // 重新计算表格宽度
        newTableWidth =
          this.startTableWidth + (actualWidth - this.startWidth) + (finalLastColumnWidth - lastColumnOriginalWidth);
      } else if (isOverflow) {
        // 情况2：表格已经溢出，不需要压缩最后一列，保持原始宽度
        this.updateColumnWidth(lastColumnIndex, lastColumnOriginalWidth);
        // 表格宽度保持当前计算值，允许无限溢出
      } else {
        // 情况3：表格宽度大于等于容器宽度，但还没有真正溢出
        // 恢复最后一列的原始宽度，让表格自然增长
        this.updateColumnWidth(lastColumnIndex, lastColumnOriginalWidth);
      }
    } else if (lastColumnIndex >= 0 && lastColumnIndex === this.activeColumn) {
      // 如果当前拖拽的就是最后一列，需要确保表格始终填满容器
      const widthDiff = newTableWidth - this.minTableWidth;
      if (widthDiff < 0) {
        // 表格宽度小于容器宽度，调整当前列宽度以填满容器
        const adjustedWidth = actualWidth - widthDiff;

        // 应用宽度限制
        let finalWidth = adjustedWidth;
        if (col.minWidth !== undefined) {
          finalWidth = Math.max(finalWidth, col.minWidth);
        }
        if (col.maxWidth !== undefined) {
          finalWidth = Math.min(finalWidth, col.maxWidth);
        }

        // 如果调整后的宽度不同于计算的宽度，说明受到了限制
        if (finalWidth !== adjustedWidth) {
          // 受到限制时，保持原宽度，但确保表格至少等于容器宽度
          newTableWidth = Math.max(newTableWidth, this.minTableWidth);
        } else {
          this.updateColumnWidth(this.activeColumn, finalWidth);
          newTableWidth = this.minTableWidth;
        }
      }
    }

    // 确保表格宽度不小于容器宽度
    newTableWidth = Math.max(newTableWidth, this.minTableWidth);
    this.tableEl.style.width = `${newTableWidth}px`;
  };

  private onMouseUp = () => {
    if (this.activeColumn !== null) {
      const col = this.columns[this.activeColumn];
      const handle = col.element.getElementsByClassName(this.handleClass)[0] as HTMLElement;
      if (handle) {
        this.updateHandleCursor(this.activeColumn, handle);
      }

      // 更新保存的列宽 - 更新所有列的实际宽度，确保下次拖拽时使用正确的宽度
      this.columnsWidth = this.columns.map((col) => col?.element?.offsetWidth || 0);

      // 更新所有列的拖拽手柄光标状态
      this.updateAllHandleCursors();

      this.onColumnResizeChange?.({
        columnsWidth: this.columns.reduce((acc, col, index) => {
          acc[col.colKey] = this.columnsWidth[index];
          return acc;
        }, {} as Record<string, number>),
      });
    }

    this.activeColumn = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  private updateAllHandleCursors() {
    this.columns.forEach((col, index) => {
      if (col?.disabled) return;
      const handle = col.element.getElementsByClassName(this.handleClass)[0] as HTMLElement;
      if (handle) {
        this.updateHandleCursor(index, handle);
      }
    });
  }

  private isTableOverflow(): boolean {
    if (!this.tableContentEl) return false;
    return this.tableContentEl.scrollWidth > this.tableContentEl.clientWidth;
  }

  public destroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    this.columns.forEach((col) => {
      const handle = col.element.getElementsByClassName(this.handleClass)[0] as HTMLElement;
      if (handle) {
        handle.remove();
      }
    });
  }
}

export default TableResizable;
