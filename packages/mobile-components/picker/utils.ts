import { isArray, get as lodashGet } from 'lodash-es';
import { PickerColumn } from './type';
import { KeysType } from '../common';

export const isMultipleArray = (arr: PickerColumn | PickerColumn[]) => isArray(arr[0]);

export const getPickerColumns = (columns: any): PickerColumn[] => (isMultipleArray(columns) ? columns : [columns]);

/**
 * 将num限制在给定的最大值（max）和最小值（min）之间
 */
export const limitNumberInRange = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

export function findIndexOfEnabledOption(options: PickerColumn, startIndex: number, keys?: KeysType): number {
  // 确保起始索引在合法范围内
  const limitStartIndex = limitNumberInRange(startIndex, 0, options.length - 1);

  // Forward Search
  const forwardIndex = options.findIndex(
    (opt, idx) => !lodashGet(opt, keys?.disabled ?? 'disabled') && idx >= limitStartIndex,
  );
  if (forwardIndex !== -1) {
    return forwardIndex;
  }

  // Backward Search
  const backwardIndex = options
    .slice(0, limitStartIndex)
    .reverse()
    .findIndex((opt) => !lodashGet(opt, keys?.disabled ?? 'disabled'));
  if (backwardIndex !== -1) {
    return limitStartIndex - 1 - backwardIndex;
  }

  return 0;
}
