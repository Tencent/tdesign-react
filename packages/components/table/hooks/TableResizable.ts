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
  leafIndices?: number[];
}

interface CallbackContext {
  columnsWidth: { [colKey: string]: number };
}

interface ResizeCallbackParams {
  onMouseMove?: (e: MouseEvent, ctx: CallbackContext) => void;
  onMouseUp?: (e: MouseEvent) => void;
}

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 600;

const HANDLE_CLASS_SUFFIX = 'table__resize-handle';

class TableResizable {
  private readonly handleClass: string;

  private tableEl: HTMLTableElement;

  private affixHeaderTableEl: HTMLTableElement | null;

  private affixFooterTableEl: HTMLTableElement | null;

  private columns: ColumnConfig[];

  private leafColumns: ColumnConfig[] = [];

  private columnsWidth: number[] = [];

  private activeColumn: number | null = null;

  private startX = 0;

  private startWidth = 0;

  private startTableWidth = 0;

  private callback: ResizeCallbackParams;

  constructor(
    classPrefix: string,
    table: HTMLTableElement,
    columns: BaseTableCol<TableRowData>[],
    callback: ResizeCallbackParams,
    affixHeaderTable?: HTMLTableElement | null,
    affixFooterTable?: HTMLTableElement | null,
  ) {
    this.handleClass = `${classPrefix}-${HANDLE_CLASS_SUFFIX}`;
    this.tableEl = table;
    this.affixHeaderTableEl = affixHeaderTable || null;
    this.affixFooterTableEl = affixFooterTable || null;
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
    if (this.affixHeaderTableEl) {
      const affixHeaderRows = this.affixHeaderTableEl.querySelectorAll('thead tr');
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
      const minWidth = resizeConfig?.minWidth ?? DEFAULT_MIN_WIDTH;
      const maxWidth = resizeConfig?.maxWidth ?? DEFAULT_MAX_WIDTH;

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

  /**
   * Initialize min-width and max-width for columns that have these constraints.
   * This prevents the "jump" effect when user first resizes a column
   * whose initial width is less than its minWidth or greater than its maxWidth.
   */
  private initColumnMinMaxWidth(): void {
    const applyMinMaxWidth = (el: HTMLElement, minWidth?: number, maxWidth?: number) => {
      if (!el) return;

      if (minWidth !== undefined) {
        // eslint-disable-next-line no-param-reassign
        el.style.minWidth = `${minWidth}px`;
      }
      if (maxWidth !== undefined) {
        // eslint-disable-next-line no-param-reassign
        el.style.maxWidth = `${maxWidth}px`;
      }
    };

    const colElements = this.tableEl.querySelectorAll('colgroup col');
    const affixColElements = this.affixHeaderTableEl?.querySelectorAll('colgroup col');
    const affixFooterColElements = this.affixFooterTableEl?.querySelectorAll('colgroup col');

    this.leafColumns.forEach((col, index) => {
      const { minWidth, maxWidth } = col;

      if (minWidth === undefined && maxWidth === undefined) return;

      const targets: Array<HTMLElement | null | undefined> = [
        col.element,
        colElements[index] as HTMLElement | undefined,
        col.affixElement,
        affixColElements?.[index] as HTMLElement | undefined,
        affixFooterColElements?.[index] as HTMLElement | undefined,
      ];

      targets.forEach((el) => {
        applyMinMaxWidth(el, minWidth, maxWidth);
      });
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
    if (this.affixHeaderTableEl && column.affixElement) {
      // Update affix table header th element
      column.affixElement.style.width = `${width}px`;

      // Update affix table colgroup col element
      const affixColElements = this.affixHeaderTableEl.querySelectorAll('colgroup col');
      const affixColElement = affixColElements[columnIndex] as HTMLElement;
      if (affixColElement) {
        affixColElement.style.width = `${width}px`;
      }
    }

    // Also update affix footer table colgroup col element
    // This ensures footer columns stay aligned with header during resize
    if (this.affixFooterTableEl) {
      const affixFooterColElements = this.affixFooterTableEl.querySelectorAll('colgroup col');
      const affixFooterColElement = affixFooterColElements[columnIndex] as HTMLElement;
      if (affixFooterColElement) {
        affixFooterColElement.style.width = `${width}px`;
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

  private init(): void {
    this.initColumnsWidth();

    // Note: We intentionally do NOT set column widths during initialization.
    // This allows the table to maintain its natural responsive behavior.
    // Column widths will only be explicitly set after user triggers a resize action.
    // However, we set min-width to ensure columns don't shrink below their minWidth
    // constraint, which prevents the "jump" effect on first resize.
    this.initColumnMinMaxWidth();

    // Add resize handles to all columns (both leaf and parent)
    this.initResizeHandles(this.columns);

    // can use dom
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

      handle.addEventListener('mousedown', (e) => this.onMouseDown(e, col));

      // Also add resize handle to affix element if exists
      if (col.affixElement) {
        const affixHandle = this.createResizeHandle(isLastColumn);
        col.affixElement.appendChild(affixHandle);
        affixHandle.addEventListener('mousedown', (e) => this.onMouseDown(e, col));
      }
    });
  }

  private onMouseDown = (e: MouseEvent, column: ColumnConfig) => {
    e.preventDefault();
    e.stopPropagation();

    if (column.disabled) {
      return;
    }

    const isParentColumn = column.children && column.children.length > 0;
    const leafIndices = column.leafIndices || [];

    if (leafIndices.length === 0) return;

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

    // Capture current widths of all leaf columns
    this.columnsWidth = this.leafColumns.map((col) => col?.element?.offsetWidth || 0);

    // On first resize, we need to lock all column widths to their current values
    // This prevents the "jump" effect when table transitions from auto to fixed width
    const hasExplicitWidth = !!this.tableEl.style.width;
    if (!hasExplicitWidth) {
      // Lock all column widths before setting table width
      this.columnsWidth.forEach((width, index) => {
        this.updateColumnWidth(index, width);
      });
    }

    // Use the actual table width (now that all columns are locked)
    this.startTableWidth = this.tableEl.offsetWidth;

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
    const reachedBoundary = actualWidth !== newWidth;

    if (reachedBoundary) {
      document.body.style.cursor = 'not-allowed';
    } else {
      document.body.style.cursor = 'col-resize';
    }

    this.updateColumnWidth(this.activeColumn, actualWidth);

    // Calculate new table width - simply adjust by the column width change
    const newTableWidth = this.startTableWidth + (actualWidth - this.startWidth);
    this.tableEl.style.width = `${newTableWidth}px`;
    if (this.affixHeaderTableEl) {
      this.affixHeaderTableEl.style.width = `${newTableWidth}px`;
    }
    if (this.affixFooterTableEl) {
      this.affixFooterTableEl.style.width = `${newTableWidth}px`;
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
    const totalMinWidth = leafIndices.reduce(
      (sum, idx) => sum + (this.leafColumns[idx]?.minWidth || DEFAULT_MIN_WIDTH),
      0,
    );
    const totalMaxWidth = leafIndices.reduce((sum, idx) => {
      const maxW = this.leafColumns[idx]?.maxWidth;
      return sum + (maxW !== undefined ? maxW : DEFAULT_MAX_WIDTH);
    }, 0);

    // Clamp the new total width
    const actualTotalWidth = Math.max(totalMinWidth, Math.min(totalMaxWidth, newTotalWidth));

    // Check boundary (column min/max constraint)
    const reachedBoundary = actualTotalWidth !== newTotalWidth;

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

    // Handle table width adjustment - simply adjust by the total width change
    const widthChange = actualTotalWidth - this.startWidth;
    const newTableWidth = this.startTableWidth + widthChange;
    this.tableEl.style.width = `${newTableWidth}px`;
    if (this.affixHeaderTableEl) {
      this.affixHeaderTableEl.style.width = `${newTableWidth}px`;
    }
    if (this.affixFooterTableEl) {
      this.affixFooterTableEl.style.width = `${newTableWidth}px`;
    }

    // Trigger callback
    const columnsWidth = this.leafColumns.reduce((acc, col, index) => {
      acc[col.colKey] = this.leafColumns[index]?.element?.offsetWidth || 0;
      return acc;
    }, {} as Record<string, number>);
    this.callback.onMouseMove?.(e, { columnsWidth });
  }

  private onMouseUp = (e: MouseEvent) => {
    const activeColumnConfig = (this as any).activeColumnConfig as ColumnConfig | null;

    if (this.activeColumn !== null || activeColumnConfig) {
      // Update saved column widths
      this.columnsWidth = this.leafColumns.map((col) => col?.element?.offsetWidth || 0);

      // Update all handle cursors
      this.updateAllHandleCursors();
      this.callback.onMouseUp?.(e);
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

        if (col.element) {
          const handle = col.element.getElementsByClassName(this.handleClass)[0] as HTMLElement;
          if (handle && col.isLeaf) {
            const leafIndex = col.leafIndices?.[0];
            if (leafIndex !== undefined) {
              handle.style.cursor = 'col-resize';
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

  /**
   * Update affix table references dynamically.
   * This is useful when affix header/footer tables are conditionally rendered
   * and become available after the initial TableResizable instance is created.
   */
  public updateAffixTables(
    affixHeaderTable?: HTMLTableElement | null,
    affixFooterTable?: HTMLTableElement | null,
  ): void {
    const headerChanged = affixHeaderTable !== undefined && affixHeaderTable !== this.affixHeaderTableEl;
    const footerChanged = affixFooterTable !== undefined && affixFooterTable !== this.affixFooterTableEl;

    if (!headerChanged && !footerChanged) return;

    if (headerChanged) {
      this.affixHeaderTableEl = affixHeaderTable || null;
    }

    if (footerChanged) {
      this.affixFooterTableEl = affixFooterTable || null;
    }

    // Re-apply min/max width constraints to the new affix tables
    this.initColumnMinMaxWidth();

    // Sync current column widths to the new affix tables
    this.syncAffixTableWidths();
  }

  /**
   * Sync current column widths from main table to affix tables.
   * This ensures affix tables stay aligned when they are dynamically added.
   */
  private syncAffixTableWidths(): void {
    const colElements = this.tableEl.querySelectorAll('colgroup col');
    const tableWidth = this.tableEl.style.width;

    // Sync table width
    if (tableWidth) {
      if (this.affixHeaderTableEl) {
        this.affixHeaderTableEl.style.width = tableWidth;
      }
      if (this.affixFooterTableEl) {
        this.affixFooterTableEl.style.width = tableWidth;
      }
    }

    // Sync column widths
    colElements.forEach((colEl, index) => {
      const { width } = (colEl as HTMLElement).style;
      if (!width) return;

      // Update affix header
      if (this.affixHeaderTableEl) {
        const affixColElements = this.affixHeaderTableEl.querySelectorAll('colgroup col');
        const affixColElement = affixColElements[index] as HTMLElement;
        if (affixColElement) {
          affixColElement.style.width = width;
        }

        // Also update th element
        const col = this.leafColumns[index];
        if (col?.affixElement) {
          col.affixElement.style.width = width;
        }
      }

      // Update affix footer
      if (this.affixFooterTableEl) {
        const affixFooterColElements = this.affixFooterTableEl.querySelectorAll('colgroup col');
        const affixFooterColElement = affixFooterColElements[index] as HTMLElement;
        if (affixFooterColElement) {
          affixFooterColElement.style.width = width;
        }
      }
    });
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
