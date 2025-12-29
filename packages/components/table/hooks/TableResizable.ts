import type { BaseTableCol, TableRowData } from '../type';

interface ColumnConfig {
  colKey: string;
  element?: HTMLElement;
  affixElement?: HTMLElement;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  disabled?: boolean;
  fixed?: 'left' | 'right';
  children?: ColumnConfig[];
  isLeaf?: boolean;
  // Indices of leaf columns that belong to this column (for parent columns)
  leafIndices?: number[];
}

interface CallbackContext {
  columnsWidth: { [colKey: string]: number };
}

interface ResizeCallbackParams {
  onMouseMove?: (e: MouseEvent, ctx: CallbackContext) => void;
}

const MIN_WIDTH = 80;
const MAX_WIDTH = Infinity;

const HANDLE_CLASS_SUFFIX = '-table__resize-handle';

class TableResizable {
  private readonly handleClass: string;

  private tableEl: HTMLTableElement;

  private affixTableEl: HTMLTableElement | null;

  private tableContentEl: HTMLDivElement;

  private columns: ColumnConfig[];

  // Flat list of leaf columns for width calculations
  private leafColumns: ColumnConfig[] = [];

  private columnsWidth: number[] = [];

  private activeColumn: number | null = null;

  private startX = 0;

  private startWidth = 0;

  private startTableWidth = 0;

  private minTableWidth = 0;

  private callback: ResizeCallbackParams;

  constructor(
    classPrefix: string,
    table: HTMLTableElement,
    columns: BaseTableCol<TableRowData>[],
    callback: ResizeCallbackParams,
    affixTable?: HTMLTableElement | null,
  ) {
    this.handleClass = `${classPrefix}-${HANDLE_CLASS_SUFFIX}`;
    this.tableEl = table;
    this.affixTableEl = affixTable || null;
    this.tableContentEl = this.tableEl.closest(`.${classPrefix}-table__content`);
    this.minTableWidth = this.tableContentEl.offsetWidth;
    this.callback = callback;
    this.columns = this.mapColumnsToConfig(columns);
    this.leafColumns = this.getLeafColumns(this.columns);
    this.init();
  }

  private mapColumnsToConfig(columns: BaseTableCol<TableRowData>[]): ColumnConfig[] {
    // Build a map of colKey -> th element for leaf columns
    // and track header row structure for parent columns
    const headerRows = this.tableEl.querySelectorAll('thead tr');
    const thByColKey = new Map<string, HTMLElement>();

    // Process each header row to map th elements to their colKeys
    headerRows.forEach((row) => {
      const ths = row.querySelectorAll('th');
      ths.forEach((th) => {
        // Try to get colKey from class name (format: xxx-table__th-{colKey})
        const classMatch = Array.from(th.classList).find((cls) => cls.includes('-table__th-'));
        if (classMatch) {
          const colKey = classMatch.split('-table__th-')[1];
          if (colKey) {
            thByColKey.set(colKey, th as HTMLElement);
          }
        }
      });
    });

    // Also process affix table header if exists
    if (this.affixTableEl) {
      const affixHeaderRows = this.affixTableEl.querySelectorAll('thead tr');
      affixHeaderRows.forEach((row) => {
        const ths = row.querySelectorAll('th');
        ths.forEach((th) => {
          const classMatch = Array.from(th.classList).find((cls) => cls.includes('-table__th-'));
          if (classMatch) {
            const colKey = classMatch.split('-table__th-')[1];
            if (colKey) {
              // Store affix th element with a special key to distinguish from main table
              thByColKey.set(`affix-${colKey}`, th as HTMLElement);
            }
          }
        });
      });
    }

    let leafIndex = 0;

    const mapColumn = (col: BaseTableCol<TableRowData>): ColumnConfig => {
      const hasChildren = col.children && col.children.length > 0;
      const element = thByColKey.get(col.colKey) || null;
      const affixElement = thByColKey.get(`affix-${col.colKey}`) || null;

      const resizeConfig = col.resize;
      const minWidth = resizeConfig?.minWidth ?? MIN_WIDTH;
      const maxWidth = resizeConfig?.maxWidth ?? MAX_WIDTH;

      const disabled = col.resizable === false;

      let width: number | undefined;
      if (col.width) {
        width = typeof col.width === 'number' ? col.width : parseInt(col.width, 10);
      }

      const config: ColumnConfig = {
        colKey: col.colKey,
        element,
        minWidth,
        maxWidth,
        width,
        disabled,
        fixed: col.fixed,
        isLeaf: !hasChildren,
        leafIndices: [],
        affixElement,
      } as any;

      if (hasChildren) {
        config.children = col.children.map((child) => mapColumn(child));
        // Collect all leaf indices for this parent column
        config.leafIndices = this.collectLeafIndices(config.children);
      } else {
        // This is a leaf column, assign its index
        config.leafIndices = [leafIndex];
        leafIndex += 1;
      }

      return config;
    };

    return columns.map((col) => mapColumn(col));
  }

  // eslint-disable-next-line class-methods-use-this
  private collectLeafIndices(children: ColumnConfig[]) {
    const indices: number[] = [];
    const collect = (cols: ColumnConfig[]) => {
      cols.forEach((col) => {
        if (col.children && col.children.length > 0) {
          collect(col.children);
        } else {
          indices.push(...(col.leafIndices || []));
        }
      });
    };
    collect(children);
    return indices;
  }

  // eslint-disable-next-line class-methods-use-this
  private getLeafColumns(columns: ColumnConfig[]) {
    const leaves: ColumnConfig[] = [];
    const collect = (cols: ColumnConfig[]) => {
      cols.forEach((col) => {
        if (col.children && col.children.length > 0) {
          collect(col.children);
        } else {
          leaves.push(col);
        }
      });
    };
    collect(columns);
    return leaves;
  }

  private initColumnsWidth(): void {
    // Get colgroup col elements for accurate width reading
    const colElements = this.tableEl.querySelectorAll('colgroup col');
    this.columnsWidth = this.leafColumns.map((col, index) => {
      // Prefer colgroup width, fallback to element offsetWidth
      const colEl = colElements[index] as HTMLElement;
      if (colEl?.style?.width) {
        return parseInt(colEl.style.width, 10);
      }
      if (!col?.element) return 0;
      return col.element.offsetWidth;
    });
  }

  private updateColumnWidth(columnIndex: number, width: number): void {
    const column = this.leafColumns[columnIndex];
    if (!column?.element) return;

    // Update main table header th element
    column.element.style.width = `${width}px`;

    // Update main table colgroup col element
    const colElements = this.tableEl.querySelectorAll('colgroup col');
    const colElement = colElements[columnIndex] as HTMLElement;
    if (colElement) {
      colElement.style.width = `${width}px`;
    }

    // Also update affix table elements to keep resize handles in sync
    // This ensures immediate visual feedback during resize operations
    if (this.affixTableEl && column.affixElement) {
      // Update affix table header th element
      column.affixElement.style.width = `${width}px`;

      // Update affix table colgroup col element
      const affixColElements = this.affixTableEl.querySelectorAll('colgroup col');
      const affixColElement = affixColElements[columnIndex] as HTMLElement;
      if (affixColElement) {
        affixColElement.style.width = `${width}px`;
      }
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

    // 如果是affix 再添加zIndex？(css 变量以+1计算？)
    handle.style.zIndex = '52';
    handle.style.cursor = 'col-resize';
    handle.style.height = '100%';
    handle.style.userSelect = 'none';

    handle.classList.add(this.handleClass);
    handle.dataset.resizable = 'true';
    return handle;
  }

  private updateHandleCursor(columnIndex: number, handle: HTMLElement) {
    // 寻找最后一列非禁用列
    let lastColumnIndex = this.leafColumns.length - 1;
    while (lastColumnIndex >= 0 && this.leafColumns[lastColumnIndex]?.disabled) {
      lastColumnIndex -= 1;
    }

    // If this is the last valid column, check if we should show not-allowed
    if (columnIndex === lastColumnIndex) {
      const currentTableWidth = this.tableEl.offsetWidth;
      const lastColumn = this.leafColumns[lastColumnIndex];
      const currentColumnWidth = lastColumn.element?.offsetWidth || 0;

      if (currentColumnWidth <= (lastColumn.minWidth || MIN_WIDTH) && currentTableWidth < this.minTableWidth) {
        // eslint-disable-next-line no-param-reassign
        handle.style.cursor = 'not-allowed';
        return;
      }
    }

    // eslint-disable-next-line no-param-reassign
    handle.style.cursor = 'col-resize';
  }

  private init(): void {
    this.initColumnsWidth();

    this.leafColumns.forEach((col, index) => {
      if (col?.width && col?.element) {
        this.updateColumnWidth(index, col.width);
      }
    });

    // Add resize handles to all columns (both leaf and parent)
    this.initResizeHandles(this.columns);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private initResizeHandles(columns: ColumnConfig[], isTopLevel = true): void {
    // Find the last non-disabled column at this level
    let lastEnabledColumnIndex = -1;
    for (let i = columns.length - 1; i >= 0; i--) {
      if (columns[i] && !columns[i].disabled) {
        lastEnabledColumnIndex = i;
        break;
      }
    }

    columns.forEach((col, index) => {
      if (!col?.element) return;

      // Recursively add handles to children
      if (col.children && col.children.length > 0) {
        this.initResizeHandles(col.children, false);
      }

      // If column is disabled, still add handle but with disabled cursor
      if (col.disabled) {
        const handle = this.createResizeHandle(false);
        handle.style.cursor = 'not-allowed';
        col.element.appendChild(handle);

        // Also add to affix element if exists
        if (col.affixElement) {
          const affixHandle = this.createResizeHandle(false);
          affixHandle.style.cursor = 'not-allowed';
          col.affixElement.appendChild(affixHandle);
        }
        return;
      }

      const isLastColumn = index === lastEnabledColumnIndex && isTopLevel;
      const handle = this.createResizeHandle(isLastColumn);
      col.element.appendChild(handle);

      handle.addEventListener('mousedown', (e) => this.onMouseDownColumn(e, col));

      // Also add resize handle to affix element if exists
      if (col.affixElement) {
        const affixHandle = this.createResizeHandle(isLastColumn);
        col.affixElement.appendChild(affixHandle);
        affixHandle.addEventListener('mousedown', (e) => this.onMouseDownColumn(e, col));
      }
    });
  }

  private onMouseDownColumn = (e: MouseEvent, column: ColumnConfig) => {
    e.preventDefault();
    e.stopPropagation();

    if (column.disabled) {
      return;
    }

    const isParentColumn = column.children && column.children.length > 0;
    const leafIndices = column.leafIndices || [];

    if (leafIndices.length === 0) return;

    // Find the last non-disabled leaf column
    let lastLeafIndex = this.leafColumns.length - 1;
    while (lastLeafIndex >= 0 && this.leafColumns[lastLeafIndex]?.disabled) {
      lastLeafIndex -= 1;
    }

    // Check if this column contains the last leaf column
    const containsLastLeaf = leafIndices.includes(lastLeafIndex);

    if (containsLastLeaf) {
      const currentTableWidth = this.tableEl.offsetWidth;
      // Calculate total width of all leaf columns in this parent
      const totalWidth = leafIndices.reduce((sum, idx) => sum + (this.leafColumns[idx]?.element?.offsetWidth || 0), 0);
      const totalMinWidth = leafIndices.reduce((sum, idx) => sum + (this.leafColumns[idx]?.minWidth || MIN_WIDTH), 0);

      // Block drag if at minimum and table is smaller than container
      if (totalWidth <= totalMinWidth && currentTableWidth < this.minTableWidth) {
        return;
      }
    }

    // Store active column info
    (this as any).activeColumnConfig = column;
    (this as any).isParentDrag = isParentColumn;

    // For parent columns, calculate the combined starting width
    if (isParentColumn) {
      this.startWidth = leafIndices.reduce((sum, idx) => sum + (this.leafColumns[idx]?.element?.offsetWidth || 0), 0);
    } else {
      // For leaf columns, use the first (and only) leaf index
      // this.activeColumn = leafIndices[0];
      [this.activeColumn] = leafIndices;

      this.startWidth = this.leafColumns[this.activeColumn]?.element?.offsetWidth || 0;
    }

    this.startX = e.pageX;
    this.startTableWidth = this.tableEl.offsetWidth;

    // Capture current widths of all leaf columns
    this.columnsWidth = this.leafColumns.map((col) => col?.element?.offsetWidth || 0);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  private onMouseDown = (e: MouseEvent, columnIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const column = this.leafColumns[columnIndex];
    if (column.disabled) {
      return;
    }

    // Find the last non-disabled leaf column
    let lastColumnIndex = this.leafColumns.length - 1;
    while (lastColumnIndex >= 0 && this.leafColumns[lastColumnIndex]?.disabled) {
      lastColumnIndex -= 1;
    }

    // If this is the last valid column, check if drag is allowed
    if (columnIndex === lastColumnIndex) {
      const currentTableWidth = this.tableEl.offsetWidth;
      const currentColumnWidth = column.element?.offsetWidth || 0;

      // Block drag when last column is at min width and table width is less than container
      if (currentColumnWidth <= (column.minWidth || MIN_WIDTH) && currentTableWidth < this.minTableWidth) {
        return;
      }
    }

    this.activeColumn = columnIndex;
    (this as any).activeColumnConfig = null;
    (this as any).isParentDrag = false;
    this.startX = e.pageX;
    this.startWidth = column.element?.offsetWidth || 0;
    this.startTableWidth = this.tableEl.offsetWidth;

    this.columnsWidth = this.leafColumns.map((col) => col?.element?.offsetWidth || 0);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  private onMouseMove = (e: MouseEvent) => {
    const activeColumnConfig = (this as any).activeColumnConfig as ColumnConfig | null;
    const isParentDrag = (this as any).isParentDrag as boolean;

    // Handle parent column drag (proportional resize)
    if (activeColumnConfig && isParentDrag) {
      this.handleParentColumnResize(e, activeColumnConfig);
      return;
    }

    // Handle leaf column drag (original logic)
    if (this.activeColumn === null) return;

    const col = this.leafColumns[this.activeColumn];
    const diff = e.pageX - this.startX;

    const newWidth = this.startWidth + diff;
    let actualWidth = newWidth;

    if (col.minWidth !== undefined) {
      actualWidth = Math.max(actualWidth, col.minWidth);
    }
    if (col.maxWidth !== undefined) {
      actualWidth = Math.min(actualWidth, col.maxWidth);
    }

    // Check if boundary is reached (column min/max constraint)
    let reachedBoundary = actualWidth !== newWidth;

    // Also check if table width constraint is reached
    // When shrinking a column, if the table width would go below minTableWidth and we can't compensate
    // by expanding the last column, we've reached a boundary
    if (!reachedBoundary && diff < 0) {
      // Find the last non-disabled leaf column
      let lastColumnIndex = this.leafColumns.length - 1;
      while (lastColumnIndex >= 0 && this.leafColumns[lastColumnIndex]?.disabled) {
        lastColumnIndex -= 1;
      }

      const projectedTableWidth = this.startTableWidth + (actualWidth - this.startWidth);

      if (projectedTableWidth < this.minTableWidth) {
        // Table would be smaller than container, check if last column can compensate
        if (lastColumnIndex === this.activeColumn) {
          // This is the last column, can't shrink if already at table min width
          reachedBoundary = true;
        } else if (lastColumnIndex >= 0) {
          // Check if last column can expand enough to compensate
          const lastColumn = this.leafColumns[lastColumnIndex];
          const lastColumnOriginalWidth = this.columnsWidth[lastColumnIndex];
          const widthDeficit = this.minTableWidth - projectedTableWidth;
          const lastColumnNewWidth = lastColumnOriginalWidth + widthDeficit;

          // If last column would exceed its maxWidth, we've reached a boundary
          if (lastColumn.maxWidth !== undefined && lastColumnNewWidth > lastColumn.maxWidth) {
            reachedBoundary = true;
          }
        }
      }
    }

    if (reachedBoundary) {
      document.body.style.cursor = 'not-allowed';
    } else {
      document.body.style.cursor = 'col-resize';
    }

    this.updateColumnWidth(this.activeColumn, actualWidth);

    // Find the last non-disabled leaf column
    let lastColumnIndex = this.leafColumns.length - 1;
    while (lastColumnIndex >= 0 && this.leafColumns[lastColumnIndex]?.disabled) {
      lastColumnIndex -= 1;
    }

    // Calculate new table width
    let newTableWidth = this.startTableWidth + (actualWidth - this.startWidth);

    // Handle last column adjustment logic
    if (lastColumnIndex >= 0 && lastColumnIndex !== this.activeColumn) {
      const lastColumn = this.leafColumns[lastColumnIndex];
      const lastColumnOriginalWidth = this.columnsWidth[lastColumnIndex];

      this.tableEl.style.width = `${newTableWidth}px`;
      if (this.affixTableEl) {
        this.affixTableEl.style.width = `${newTableWidth}px`;
      }
      const isOverflow = this.isTableOverflow();
      const widthDiff = newTableWidth - this.minTableWidth;

      if (widthDiff < 0) {
        const lastColumnNewWidth = lastColumnOriginalWidth - widthDiff;
        let finalLastColumnWidth = lastColumnNewWidth;
        if (lastColumn.minWidth !== undefined) {
          finalLastColumnWidth = Math.max(finalLastColumnWidth, lastColumn.minWidth);
        }
        if (lastColumn.maxWidth !== undefined) {
          finalLastColumnWidth = Math.min(finalLastColumnWidth, lastColumn.maxWidth);
        }

        this.updateColumnWidth(lastColumnIndex, finalLastColumnWidth);
        newTableWidth =
          this.startTableWidth + (actualWidth - this.startWidth) + (finalLastColumnWidth - lastColumnOriginalWidth);
      } else if (isOverflow) {
        this.updateColumnWidth(lastColumnIndex, lastColumnOriginalWidth);
      } else {
        this.updateColumnWidth(lastColumnIndex, lastColumnOriginalWidth);
      }
    } else if (lastColumnIndex >= 0 && lastColumnIndex === this.activeColumn) {
      const widthDiff = newTableWidth - this.minTableWidth;
      if (widthDiff < 0) {
        const adjustedWidth = actualWidth - widthDiff;
        let finalWidth = adjustedWidth;
        if (col.minWidth !== undefined) {
          finalWidth = Math.max(finalWidth, col.minWidth);
        }
        if (col.maxWidth !== undefined) {
          finalWidth = Math.min(finalWidth, col.maxWidth);
        }

        if (finalWidth !== adjustedWidth) {
          newTableWidth = Math.max(newTableWidth, this.minTableWidth);
        } else {
          this.updateColumnWidth(this.activeColumn, finalWidth);
          newTableWidth = this.minTableWidth;
        }
      }
    }

    newTableWidth = Math.max(newTableWidth, this.minTableWidth);
    this.tableEl.style.width = `${newTableWidth}px`;
    if (this.affixTableEl) {
      this.affixTableEl.style.width = `${newTableWidth}px`;
    }

    // Use current actual widths from DOM elements, not the initial widths
    const columnsWidth = this.leafColumns.reduce((acc, col) => {
      acc[col.colKey] = col?.element?.offsetWidth || 0;
      return acc;
    }, {} as Record<string, number>);
    this.callback.onMouseMove?.(e, { columnsWidth });
  };

  private handleParentColumnResize(e: MouseEvent, column: ColumnConfig): void {
    const leafIndices = column.leafIndices || [];
    if (leafIndices.length === 0) return;

    const diff = e.pageX - this.startX;
    const newTotalWidth = this.startWidth + diff;

    // Calculate total min/max width for all children
    const totalMinWidth = leafIndices.reduce((sum, idx) => sum + (this.leafColumns[idx]?.minWidth || MIN_WIDTH), 0);
    const totalMaxWidth = leafIndices.reduce((sum, idx) => {
      const maxW = this.leafColumns[idx]?.maxWidth;
      return sum + (maxW !== undefined ? maxW : MAX_WIDTH);
    }, 0);

    // Clamp the new total width
    const actualTotalWidth = Math.max(totalMinWidth, Math.min(totalMaxWidth, newTotalWidth));

    // Check boundary (column min/max constraint)
    let reachedBoundary = actualTotalWidth !== newTotalWidth;

    // Also check if table width constraint is reached when shrinking
    if (!reachedBoundary && diff < 0) {
      // Find the last non-disabled leaf column
      let lastLeafIndex = this.leafColumns.length - 1;
      while (lastLeafIndex >= 0 && this.leafColumns[lastLeafIndex]?.disabled) {
        lastLeafIndex -= 1;
      }

      const widthChange = actualTotalWidth - this.startWidth;
      const projectedTableWidth = this.startTableWidth + widthChange;
      const containsLastLeaf = leafIndices.includes(lastLeafIndex);

      if (projectedTableWidth < this.minTableWidth) {
        if (containsLastLeaf) {
          // This parent contains the last column, can't shrink if already at table min width
          reachedBoundary = true;
        } else if (lastLeafIndex >= 0) {
          // Check if last column can expand enough to compensate
          const lastColumn = this.leafColumns[lastLeafIndex];
          const lastColumnOriginalWidth = this.columnsWidth[lastLeafIndex];
          const widthDeficit = this.minTableWidth - projectedTableWidth;
          const lastColumnNewWidth = lastColumnOriginalWidth + widthDeficit;

          // If last column would exceed its maxWidth, we've reached a boundary
          if (lastColumn.maxWidth !== undefined && lastColumnNewWidth > lastColumn.maxWidth) {
            reachedBoundary = true;
          }
        }
      }
    }

    if (reachedBoundary) {
      document.body.style.cursor = 'not-allowed';
    } else {
      document.body.style.cursor = 'col-resize';
    }

    // Store original widths for this parent's children
    const originalWidths = leafIndices.map((idx) => this.columnsWidth[idx]);
    const originalTotal = originalWidths.reduce((sum, w) => sum + w, 0);

    // Distribute width proportionally to each child
    let remainingWidth = actualTotalWidth;
    leafIndices.forEach((idx, i) => {
      const leafCol = this.leafColumns[idx];
      const proportion = originalWidths[i] / originalTotal;
      let targetWidth = Math.round(actualTotalWidth * proportion);

      // Apply min/max constraints
      if (leafCol.minWidth !== undefined) {
        targetWidth = Math.max(targetWidth, leafCol.minWidth);
      }
      if (leafCol.maxWidth !== undefined) {
        targetWidth = Math.min(targetWidth, leafCol.maxWidth);
      }

      // For the last child, use remaining width to avoid rounding errors
      if (i === leafIndices.length - 1) {
        targetWidth = remainingWidth;
        if (leafCol.minWidth !== undefined) {
          targetWidth = Math.max(targetWidth, leafCol.minWidth);
        }
        if (leafCol.maxWidth !== undefined) {
          targetWidth = Math.min(targetWidth, leafCol.maxWidth);
        }
      }

      this.updateColumnWidth(idx, targetWidth);
      remainingWidth -= targetWidth;
    });

    // Handle table width adjustment
    const widthChange = actualTotalWidth - this.startWidth;
    let newTableWidth = this.startTableWidth + widthChange;

    // Find the last non-disabled leaf column
    let lastLeafIndex = this.leafColumns.length - 1;
    while (lastLeafIndex >= 0 && this.leafColumns[lastLeafIndex]?.disabled) {
      lastLeafIndex -= 1;
    }

    // If the dragged parent doesn't contain the last column, adjust last column
    const containsLastLeaf = leafIndices.includes(lastLeafIndex);

    if (!containsLastLeaf && lastLeafIndex >= 0) {
      const lastColumn = this.leafColumns[lastLeafIndex];
      const lastColumnOriginalWidth = this.columnsWidth[lastLeafIndex];

      this.tableEl.style.width = `${newTableWidth}px`;
      if (this.affixTableEl) {
        this.affixTableEl.style.width = `${newTableWidth}px`;
      }
      const widthDiff = newTableWidth - this.minTableWidth;

      if (widthDiff < 0) {
        // Table is narrower than container, expand last column
        const lastColumnNewWidth = lastColumnOriginalWidth - widthDiff;
        let finalLastColumnWidth = lastColumnNewWidth;
        if (lastColumn.minWidth !== undefined) {
          finalLastColumnWidth = Math.max(finalLastColumnWidth, lastColumn.minWidth);
        }
        if (lastColumn.maxWidth !== undefined) {
          finalLastColumnWidth = Math.min(finalLastColumnWidth, lastColumn.maxWidth);
        }

        this.updateColumnWidth(lastLeafIndex, finalLastColumnWidth);
        newTableWidth = this.startTableWidth + widthChange + (finalLastColumnWidth - lastColumnOriginalWidth);
      } else {
        this.updateColumnWidth(lastLeafIndex, lastColumnOriginalWidth);
      }
    }

    newTableWidth = Math.max(newTableWidth, this.minTableWidth);
    this.tableEl.style.width = `${newTableWidth}px`;
    if (this.affixTableEl) {
      this.affixTableEl.style.width = `${newTableWidth}px`;
    }

    // Trigger callback
    const columnsWidth = this.leafColumns.reduce((acc, col, index) => {
      acc[col.colKey] = this.leafColumns[index]?.element?.offsetWidth || 0;
      return acc;
    }, {} as Record<string, number>);
    this.callback.onMouseMove?.(e, { columnsWidth });
  }

  private onMouseUp = () => {
    const activeColumnConfig = (this as any).activeColumnConfig as ColumnConfig | null;

    if (this.activeColumn !== null || activeColumnConfig) {
      // Update saved column widths
      this.columnsWidth = this.leafColumns.map((col) => col?.element?.offsetWidth || 0);

      // Update all handle cursors
      this.updateAllHandleCursors();
    }

    this.activeColumn = null;
    (this as any).activeColumnConfig = null;
    (this as any).isParentDrag = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  private updateAllHandleCursors() {
    const updateHandles = (columns: ColumnConfig[]) => {
      columns.forEach((col) => {
        if (col?.disabled) return;

        // Update this column's handle if it exists
        if (col.element) {
          const handle = col.element.getElementsByClassName(this.handleClass)[0] as HTMLElement;
          if (handle && col.isLeaf) {
            const leafIndex = col.leafIndices?.[0];
            if (leafIndex !== undefined) {
              this.updateHandleCursor(leafIndex, handle);
            }
          }
        }

        // Recursively update children
        if (col.children && col.children.length > 0) {
          updateHandles(col.children);
        }
      });
    };
    updateHandles(this.columns);
  }

  private isTableOverflow(): boolean {
    if (!this.tableContentEl) return false;
    return this.tableContentEl.scrollWidth > this.tableContentEl.clientWidth;
  }

  public destroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    const removeHandles = (columns: ColumnConfig[]) => {
      columns.forEach((col) => {
        if (col.element) {
          const handle = col.element.getElementsByClassName(this.handleClass)[0] as HTMLElement;
          if (handle) {
            handle.remove();
          }
        }
        // Also remove from affix element if exists
        if (col.affixElement) {
          const affixHandle = col.affixElement.getElementsByClassName(this.handleClass)[0] as HTMLElement;
          if (affixHandle) {
            affixHandle.remove();
          }
        }
        if (col.children && col.children.length > 0) {
          removeHandles(col.children);
        }
      });
    };
    removeHandles(this.columns);
  }
}

export default TableResizable;
