import { useState, useRef, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import type { TdUploadProps, UploadFile, UploadChangeContext } from '../type';

/* eslint-disable no-underscore-dangle, no-param-reassign */
interface UploadFileWithUid extends UploadFile {
  __uid?: string;
}

let globalUidCounter = 0;
const keySeeds = new Map<string, number>();

function setDragKey(file: UploadFileWithUid, existing: Set<string>): string {
  if (file.__uid) return file.__uid;

  const parts = [file.name, file.size, file.lastModified, file.type, file.url].filter(
    (p) => p !== undefined && p !== null && p !== '',
  );
  globalUidCounter += 1;
  let base = parts.length > 0 ? `u_${encodeURIComponent(parts.join('|'))}` : `u_${globalUidCounter}`;

  if (existing.has(base)) {
    const seed = keySeeds.get(base) ?? 0;
    let n = seed + 1;
    while (existing.has(`${base}-${n}`)) {
      n += 1;
    }
    keySeeds.set(base, n);
    base = `${base}-${n}`;
  }

  file.__uid = base;
  existing.add(base);
  return base;
}
/* eslint-enable no-underscore-dangle, no-param-reassign */

export interface UseDragReturn {
  /** 是否处于拖拽中 */
  dragging: boolean;
  /** 被拖 item 在 sortedFiles 中的当前 index */
  dragIndex: number;
  /** 拖拽排序用的本地文件数组 */
  sortedFiles: UploadFile[];
  /** 浮动 clone 是否可见 */
  cloneVisible: boolean;
  /** 浮动 clone 的内联样式 */
  cloneStyle: CSSProperties;
  /** clone 显示的文件内容 */
  cloneFile: UploadFile | null;
  /** 获取 file 的唯一 key */
  getDragKey: (file: UploadFileWithUid) => string;
  /** 同步 sortedFiles 与 displayFiles（非拖拽时调用） */
  syncFiles: (files: UploadFile[]) => void;
  /** 触摸开始：启动长按定时器 */
  onTouchstart: (e: React.TouchEvent, index: number) => void;
  /** 触摸移动：更新 clone 位置 + 碰撞检测 */
  onTouchmove: (e: React.TouchEvent) => void;
  /** 触摸结束：归位动画 + 提交排序结果 */
  onTouchend: (e: React.TouchEvent) => void;
  /** 触摸取消：清理状态 */
  onTouchcancel: (e: React.TouchEvent) => void;
  /** 拖拽刚结束 300ms 内为 true，用于屏蔽误触预览 */
  dragEnded: boolean;
}

export default function useDrag(
  props: TdUploadProps,
  uploadClass: string,
  setUploadValue: (value: UploadFile[], context: UploadChangeContext) => void,
): UseDragReturn {
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(-1);
  const [sortedFiles, setSortedFiles] = useState<UploadFile[]>([]);
  const [cloneVisible, setCloneVisible] = useState(false);
  const [cloneStyle, setCloneStyle] = useState<CSSProperties>({});
  const [cloneFile, setCloneFile] = useState<UploadFile | null>(null);
  const [dragEnded, setDragEnded] = useState(false);

  const TIMEOUT_DURATION = 300;
  const MOVE_TRANSITION = 'transform 0.3s ease';

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragEndedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cachedItemWidthRef = useRef(0);
  const cachedItemHeightRef = useRef(0);
  const startFingerXRef = useRef(0);
  const startFingerYRef = useRef(0);
  const hasMovedRef = useRef(false);
  const longPressTargetRef = useRef<HTMLElement | null>(null);
  const draggingRef = useRef(false);
  const dragIndexRef = useRef(-1);
  const sortedFilesRef = useRef<UploadFile[]>([]);
  const cloneFileRef = useRef<UploadFile | null>(null);
  // 原生非 passive 监听器引用，用于阻止拖拽时页面滚动
  const nativeTouchmoveRef = useRef<((e: TouchEvent) => void) | null>(null);
  const nativeTouchendRef = useRef<((e: TouchEvent) => void) | null>(null);
  const nativeTouchcancelRef = useRef<((e: TouchEvent) => void) | null>(null);
  // 在途 FLIP 动画的 rAF 句柄与被打了 transform 的元素，用于拖拽结束时结算/取消
  const flipRafIdsRef = useRef<number[]>([]);
  const flipElementsRef = useRef<Set<HTMLElement>>(new Set());

  // 拖拽开始时的布局参数
  const layoutRef = useRef<{
    containerLeft: number;
    containerTop: number;
    columns: number;
    cellWidth: number;
    cellHeight: number;
    itemTops: number[];
    itemHeights: number[];
  } | null>(null);

  // 保持 ref 与 state 同步
  const updateDragging = useCallback((val: boolean) => {
    draggingRef.current = val;
    setDragging(val);
  }, []);

  const updateDragIndex = useCallback((val: number) => {
    dragIndexRef.current = val;
    setDragIndex(val);
  }, []);

  const updateSortedFiles = useCallback((val: UploadFile[]) => {
    sortedFilesRef.current = val;
    setSortedFiles(val);
  }, []);

  const updateCloneFile = useCallback((val: UploadFile | null) => {
    cloneFileRef.current = val;
    setCloneFile(val);
  }, []);

  // eslint-disable-next-line no-underscore-dangle
  const getDragKey = (file: UploadFileWithUid): string => file?.__uid || '';

  const removeNativeListeners = useCallback(() => {
    if (nativeTouchmoveRef.current) {
      document.removeEventListener('touchmove', nativeTouchmoveRef.current);
      nativeTouchmoveRef.current = null;
    }
    if (nativeTouchendRef.current) {
      document.removeEventListener('touchend', nativeTouchendRef.current);
      nativeTouchendRef.current = null;
    }
    if (nativeTouchcancelRef.current) {
      document.removeEventListener('touchcancel', nativeTouchcancelRef.current);
      nativeTouchcancelRef.current = null;
    }
  }, []);

  // 结算/取消在途的 FLIP 动画：取消未执行的 rAF，并把已打上 transform 的元素立即复位
  const cancelFlip = useCallback(() => {
    flipRafIdsRef.current.forEach((id) => cancelAnimationFrame(id));
    flipRafIdsRef.current = [];
    Array.from(flipElementsRef.current).forEach((el) => {
      el.style.setProperty('transition', '');
      el.style.setProperty('transform', '');
    });
    flipElementsRef.current.clear();
  }, []);

  useEffect(
    () => () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (dragEndedTimerRef.current) clearTimeout(dragEndedTimerRef.current);
      removeNativeListeners();
      cancelFlip();
    },
    [removeNativeListeners, cancelFlip],
  );

  const syncFiles = useCallback(
    (files: UploadFile[]) => {
      if (!draggingRef.current) {
        const existing = new Set<string>();
        files.forEach((f) => setDragKey(f as UploadFileWithUid, existing));
        updateSortedFiles([...files]);
      }
    },
    [updateSortedFiles],
  );

  const resetState = useCallback(() => {
    removeNativeListeners();
    cancelFlip();
    updateDragging(false);
    updateDragIndex(-1);
    setCloneVisible(false);
    updateCloneFile(null);
    setCloneStyle({});
    hasMovedRef.current = false;
    cachedItemWidthRef.current = 0;
    cachedItemHeightRef.current = 0;
    longPressTargetRef.current = null;
    layoutRef.current = null;
  }, [removeNativeListeners, cancelFlip, updateDragging, updateDragIndex, updateCloneFile]);

  /**
   * FLIP 位移动画（First-Last-Invert-Play）：仅让「非拖拽项」平滑让位。
   * 被拖拽项由浮动 clone 表示，其占位节点通过 draggedKey 排除在动画之外
   */
  const flipAnimate = useCallback(
    (container: Element, beforeRects: Map<string, DOMRect>, draggedKey: string) => {
      const outerId = requestAnimationFrame(() => {
        container.querySelectorAll('[data-drag-key]').forEach((el) => {
          const htmlEl = el as HTMLElement;
          const key = htmlEl.dataset.dragKey;
          if (!key || key === draggedKey) return;
          const before = beforeRects.get(key);
          if (!before) return;

          const after = htmlEl.getBoundingClientRect();
          const dx = before.left - after.left;
          const dy = before.top - after.top;

          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

          // Invert：瞬间偏移回旧位置（记录元素，便于拖拽结束时统一复位）
          htmlEl.style.transition = 'none';
          htmlEl.style.transform = `translate(${dx}px, ${dy}px)`;
          flipElementsRef.current.add(htmlEl);

          // Play：下一帧移除偏移，触发 CSS transition 归零
          const innerId = requestAnimationFrame(() => {
            htmlEl.style.transition = MOVE_TRANSITION;
            htmlEl.style.transform = '';
          });
          flipRafIdsRef.current.push(innerId);
        });
      });
      flipRafIdsRef.current.push(outerId);
    },
    [MOVE_TRANSITION],
  );

  /** 排序前快照所有 item 的 First 位置 */
  const snapshotRects = useCallback((container: Element): Map<string, DOMRect> => {
    const map = new Map<string, DOMRect>();
    container.querySelectorAll('[data-drag-key]').forEach((el) => {
      const key = (el as HTMLElement).dataset.dragKey;
      if (key) map.set(key, (el as HTMLElement).getBoundingClientRect());
    });
    return map;
  }, []);

  const onLongPress = useCallback(
    (index: number) => {
      const target = longPressTargetRef.current;
      if (!target) return;

      const files = sortedFilesRef.current;
      const file = files[index];
      if (!file) return;

      const rect = target.getBoundingClientRect();
      cachedItemWidthRef.current = rect.width;
      cachedItemHeightRef.current = rect.height;

      const container = target.closest(`.${uploadClass}`);
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const dragItems = container.querySelectorAll('[data-drag-key]');

        if (props.theme === 'list') {
          const itemTops: number[] = [];
          const itemHeights: number[] = [];
          dragItems.forEach((el) => {
            const r = (el as HTMLElement).getBoundingClientRect();
            itemTops.push(r.top - containerRect.top);
            itemHeights.push(r.height);
          });
          layoutRef.current = {
            containerLeft: containerRect.left,
            containerTop: containerRect.top,
            columns: 1,
            cellWidth: containerRect.width,
            cellHeight: cachedItemHeightRef.current,
            itemTops,
            itemHeights,
          };
        } else {
          let columns = 4;
          let cellWidth = containerRect.width / 4;
          let cellHeight = cachedItemHeightRef.current;

          if (dragItems.length >= 2) {
            const firstRect = (dragItems[0] as HTMLElement).getBoundingClientRect();
            for (let i = 1; i < dragItems.length; i += 1) {
              const r = (dragItems[i] as HTMLElement).getBoundingClientRect();
              if (r.top === firstRect.top && r.left > firstRect.left) {
                cellWidth = r.left - firstRect.left;
                columns = Math.round(containerRect.width / cellWidth) || 4;
                break;
              }
            }
            for (let i = columns; i < dragItems.length; i += 1) {
              const r = (dragItems[i] as HTMLElement).getBoundingClientRect();
              if (r.top > firstRect.top) {
                cellHeight = r.top - firstRect.top;
                break;
              }
            }
          }

          layoutRef.current = {
            containerLeft: containerRect.left,
            containerTop: containerRect.top,
            columns,
            cellWidth,
            cellHeight,
            itemTops: [],
            itemHeights: [],
          };
        }
      }

      updateDragging(true);
      updateDragIndex(index);
      setCloneVisible(true);
      updateCloneFile(file);
      hasMovedRef.current = false;

      const isList = props.theme === 'list';
      setCloneStyle({
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: isList ? undefined : 'scale(1.05)',
        boxShadow: isList ? '0 4px 16px rgba(0, 0, 0, 0.15)' : '0 8px 24px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        borderRadius: isList ? undefined : '8px',
        overflow: 'hidden',
      });

      props.onDrag?.({ file, index });

      // 注册原生非 passive touchmove，确保 preventDefault 可以阻止页面滚动
      const nativeTouchmove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
      };
      const nativeTouchend = () => removeNativeListeners();
      const nativeTouchcancel = () => removeNativeListeners();
      document.addEventListener('touchmove', nativeTouchmove, { passive: false });
      document.addEventListener('touchend', nativeTouchend, { once: true });
      document.addEventListener('touchcancel', nativeTouchcancel, { once: true });
      nativeTouchmoveRef.current = nativeTouchmove;
      nativeTouchendRef.current = nativeTouchend;
      nativeTouchcancelRef.current = nativeTouchcancel;
    },
    [uploadClass, props, removeNativeListeners, updateDragging, updateDragIndex, updateCloneFile],
  );

  const detectGridSlot = useCallback((relX: number, relY: number, count: number): number => {
    const layout = layoutRef.current;
    if (!layout) return -1;
    const col = Math.floor(relX / (layout.cellWidth || 1));
    const row = Math.floor(relY / (layout.cellHeight || 1));
    const targetIndex = row * layout.columns + col;
    return Math.max(0, Math.min(targetIndex, count - 1));
  }, []);

  const detectListSlot = useCallback((relY: number, count: number): number => {
    const layout = layoutRef.current;
    if (!layout || count === 0) return -1;

    const itemH = layout.cellHeight;
    const gap = layout.itemTops.length > 1 ? layout.itemTops[1] - layout.itemTops[0] - (layout.itemHeights[0] || 0) : 0;
    const slotSize = itemH + gap;
    if (slotSize <= 0) return 0;

    const firstItemTop = layout.itemTops[0] || 0;
    const adjustedY = relY - firstItemTop - itemH / 2;
    if (adjustedY < 0) return 0;

    const slotIndex = Math.floor(adjustedY / slotSize);
    if (slotIndex >= count) return count - 1;

    const posInSlot = adjustedY - slotIndex * slotSize;
    return posInSlot > itemH / 2 ? Math.min(slotIndex + 1, count - 1) : slotIndex;
  }, []);

  const detectTargetSlot = useCallback(
    (fingerX: number, fingerY: number): number => {
      const layout = layoutRef.current;
      if (!layout) return -1;
      const count = sortedFilesRef.current.length;
      if (count <= 1) return -1;

      const relX = fingerX - layout.containerLeft;
      const relY = fingerY - layout.containerTop;

      if (layout.itemTops.length > 0) {
        return detectListSlot(relY, count);
      }
      return detectGridSlot(relX, relY, count);
    },
    [detectListSlot, detectGridSlot],
  );

  const onTouchstart = useCallback(
    (e: React.TouchEvent, index: number) => {
      if (!props.draggable || draggingRef.current) return;

      const touch = e.touches?.[0];
      if (!touch) return;

      startFingerXRef.current = touch.clientX;
      startFingerYRef.current = touch.clientY;
      hasMovedRef.current = false;
      longPressTargetRef.current = e.currentTarget as HTMLElement;

      longPressTimerRef.current = setTimeout(() => onLongPress(index), TIMEOUT_DURATION);
    },
    [props.draggable, onLongPress],
  );

  const onTouchmove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches?.[0] || e.changedTouches?.[0];
      if (!touch) return;

      if (!draggingRef.current) {
        const dx = Math.abs(touch.clientX - startFingerXRef.current);
        const dy = Math.abs(touch.clientY - startFingerYRef.current);
        if (dx > 10 || dy > 10) {
          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          longPressTargetRef.current = null;
        }
        return;
      }

      // 滚动阻止由原生非 passive touchmove 监听器负责（已在 onLongPress 中注册）
      hasMovedRef.current = true;

      setCloneStyle((prev) => ({
        ...prev,
        left: `${touch.clientX - cachedItemWidthRef.current / 2}px`,
        top: `${touch.clientY - cachedItemHeightRef.current / 2}px`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }));

      if (!layoutRef.current) return;
      const targetIndex = detectTargetSlot(touch.clientX, touch.clientY);
      if (targetIndex === -1 || targetIndex === dragIndexRef.current) return;

      // 每轮 FLIP 前先结算上一轮的残留 transform，避免污染本轮位置测量
      cancelFlip();

      const container = longPressTargetRef.current?.closest(`.${uploadClass}`);
      const beforeRects = container ? snapshotRects(container) : null;

      const newFiles = [...sortedFilesRef.current];
      const [moved] = newFiles.splice(dragIndexRef.current, 1);
      newFiles.splice(targetIndex, 0, moved);
      updateSortedFiles(newFiles.filter(Boolean));
      updateDragIndex(targetIndex);

      if (container && beforeRects) {
        flipAnimate(container, beforeRects, getDragKey(moved as UploadFileWithUid));
      }
    },
    [uploadClass, detectTargetSlot, updateSortedFiles, updateDragIndex, snapshotRects, flipAnimate, cancelFlip],
  );

  const onTouchend = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_e: React.TouchEvent) => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

      // 未进入拖拽状态，说明是普通点击（tap），不应屏蔽后续 click 触发的预览
      if (!draggingRef.current) {
        longPressTargetRef.current = null;
        return;
      }

      // 拖拽刚结束，300ms 内置 true，屏蔽误触预览
      setDragEnded(true);
      dragEndedTimerRef.current = setTimeout(() => {
        setDragEnded(false);
      }, TIMEOUT_DURATION);

      if (!hasMovedRef.current) {
        resetState();
        return;
      }

      const dragFileSnap = cloneFileRef.current;
      const dragKey = dragFileSnap ? getDragKey(dragFileSnap) : '';

      requestAnimationFrame(() => {
        // 先结算在途 FLIP，让所有 item 落到最终布局位置，再计算 clone 归位坐标
        cancelFlip();

        const container = longPressTargetRef.current?.closest(`.${uploadClass}`);
        const targetEl = container?.querySelector(`[data-drag-key="${dragKey}"]`) as HTMLElement;

        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          setCloneStyle((prev) => ({
            ...prev,
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            transform: 'scale(1)',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
          }));
        } else {
          setCloneStyle((prev) => ({
            ...prev,
            opacity: '0',
            transition: 'opacity 0.3s ease',
          }));
        }

        const finalFiles = [...sortedFilesRef.current];
        props.onDrop?.(finalFiles);
        setUploadValue(finalFiles, { trigger: 'sort' as any, files: finalFiles });
        resetState();
      });
    },
    [uploadClass, props, setUploadValue, resetState, cancelFlip],
  );

  const onTouchcancel = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_e: React.TouchEvent) => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      resetState();
      longPressTargetRef.current = null;
    },
    [resetState],
  );

  return {
    dragging,
    dragIndex,
    sortedFiles,
    cloneVisible,
    cloneStyle,
    cloneFile,
    getDragKey,
    syncFiles,
    onTouchstart,
    onTouchmove,
    onTouchend,
    onTouchcancel,
    dragEnded,
  };
}
