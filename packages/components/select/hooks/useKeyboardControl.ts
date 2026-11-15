import { useEffect, useMemo, useRef, useState } from 'react';

import useConfig from '../../hooks/useConfig';
import { getKeyMapping, getSelectValueArr } from '../util/helper';

import type { SelectOption, SelectValue, SelectValueChangeTrigger, TdOptionProps, TdSelectProps } from '../type';

export type useKeyboardControlType = {
  max: number;
  multiple: boolean;
  keys: TdSelectProps['keys'];
  value: SelectValue<SelectOption>;
  valueType: TdSelectProps['valueType'];
  handleChange: (
    value: SelectValue,
    context: {
      e: React.KeyboardEvent<HTMLInputElement>;
      trigger: SelectValueChangeTrigger;
    },
  ) => void;
  innerPopupVisible: boolean;
  handlePopupVisibleChange: (visible: boolean, ctx: { e: React.KeyboardEvent<HTMLInputElement> }) => void;
  displayOptions: TdOptionProps[];
  onCheckAllChange: (checkAll: boolean, e?: React.KeyboardEvent<HTMLInputElement>) => void;
  selectInputRef: any;
  toggleIsScrolling: (isScrolling: boolean) => void;
  /** Whether keyboard navigation wraps around at the boundaries. Defaults to false. */
  circular?: boolean;
  /** Called when keyboard navigation reaches the first option. */
  onReachTop?: () => void;
  /** Called when keyboard navigation reaches the last option. */
  onReachBottom?: () => void;
};

export default function useKeyboardControl({
  max,
  multiple,
  keys,
  value,
  valueType,
  handleChange,
  innerPopupVisible,
  handlePopupVisibleChange,
  displayOptions,
  onCheckAllChange,
  selectInputRef,
  toggleIsScrolling,
  circular = false,
  onReachTop,
  onReachBottom,
}: useKeyboardControlType) {
  const { classPrefix } = useConfig();

  const isCheckAll = useRef(false);
  const [hoverIndex, changeHoverIndex] = useState(-1);

  const isObjectType = useMemo(() => valueType === 'object', [valueType]);
  const { valueKey, disabledKey } = useMemo(() => getKeyMapping(keys), [keys]);

  // Track whether the user is actively navigating with keyboard
  const isKeyboardNavigating = useRef(false);
  const prevFirstOptionValueRef = useRef<unknown>(undefined);
  // Ref to handleKeyboardScroll so it can be called inside useEffect
  const handleKeyboardScrollRef = useRef<(targetIndex: number) => void>(null);

  useEffect(() => {
    if (!innerPopupVisible) {
      isKeyboardNavigating.current = false;
      prevFirstOptionValueRef.current = undefined;
      changeHoverIndex(-1);
      return;
    }

    const firstValue = displayOptions[0]?.value;

    if (isKeyboardNavigating.current) {
      // Options prepended at top:
      // first item changed → shift hoverIndex by the prepended count
      if (prevFirstOptionValueRef.current !== undefined && prevFirstOptionValueRef.current !== firstValue) {
        const prependedCount = displayOptions.findIndex((o) => o.value === prevFirstOptionValueRef.current);
        if (prependedCount > 0) {
          changeHoverIndex((prev) => prev + prependedCount);
          // Delay scroll until after React re-renders the hover class onto the DOM,
          // otherwise querySelector('.t-select-option__hover') returns null and scroll is skipped
          setTimeout(() => handleKeyboardScrollRef.current?.(hoverIndex + prependedCount), 0);
        }
      }
    } else if (!multiple) {
      // 单选时，hoverIndex 初始值为选中值的索引
      const index = displayOptions.findIndex((option) => option.value === value);
      changeHoverIndex(index >= 0 ? index : -1);
    } else {
      changeHoverIndex(-1);
    }

    prevFirstOptionValueRef.current = firstValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerPopupVisible, displayOptions]);

  useEffect(() => {
    if (!Array.isArray(value)) return;
    isCheckAll.current =
      value.length === displayOptions.filter((v) => !((v.disabled || v.checkAll) && !value.includes(v.value))).length;
  }, [value, displayOptions]);

  const handleKeyboardScroll = (targetIndex: number) => {
    const popupContent = selectInputRef.current.getPopupContentElement();
    if (!popupContent) return;

    const optionSelector = `.${classPrefix}-select-option`;
    const allOptions: NodeListOf<HTMLDivElement> = popupContent.querySelectorAll(optionSelector);
    const targetNode = allOptions[targetIndex];
    if (!targetNode) return;

    // 避免与 updateScrollTop 冲突
    toggleIsScrolling(true);

    const { top: containerTop, bottom: containerBottom } = popupContent.getBoundingClientRect();
    const { top: optionTop, bottom: optionBottom } = targetNode.getBoundingClientRect();

    if (optionTop < containerTop) {
      // option 在可视区域上方，滚动使其出现在顶部
      popupContent.scrollTop -= containerTop - optionTop;
    } else if (optionBottom > containerBottom) {
      // option 在可视区域下方，滚动使其出现在底部
      popupContent.scrollTop += optionBottom - containerBottom;
    }
    // option 已在可视区域内，不滚动
  };
  handleKeyboardScrollRef.current = handleKeyboardScroll;

  const handleKeyDown = (_value: string, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    const optionsListLength = displayOptions.length;

    let newIndex = hoverIndex;

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault();
        isKeyboardNavigating.current = true;
        if (hoverIndex === -1) newIndex = 0;
        else if (hoverIndex === 0 || hoverIndex > optionsListLength - 1)
          newIndex = circular ? optionsListLength - 1 : 0;
        else newIndex -= 1;

        if (displayOptions[newIndex]?.[disabledKey]) newIndex -= 1;

        changeHoverIndex(newIndex);
        handleKeyboardScroll(newIndex);

        if (newIndex === 0) {
          onReachTop?.();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        isKeyboardNavigating.current = true;
        if (hoverIndex === -1 || hoverIndex >= optionsListLength - 1) newIndex = circular ? 0 : optionsListLength - 1;
        else newIndex += 1;

        if (displayOptions[newIndex]?.disabled) newIndex += 1;

        if (newIndex === optionsListLength - 1 && hoverIndex === optionsListLength - 1) {
          onReachBottom?.();
        }

        changeHoverIndex(newIndex);
        handleKeyboardScroll(newIndex);
        break;
      case 'Enter': {
        if (!innerPopupVisible) {
          handlePopupVisibleChange(true, { e });
          break;
        }

        if (hoverIndex === -1) return;

        if (displayOptions[hoverIndex].checkAll) {
          onCheckAllChange(!isCheckAll.current, e);
          return;
        }

        const selectedOptions = displayOptions[hoverIndex];
        const optionValue = isObjectType ? selectedOptions : selectedOptions[valueKey];

        if (!multiple) {
          handleChange(optionValue, {
            trigger: 'check',
            e,
          });
          handlePopupVisibleChange(false, { e });
          changeHoverIndex(-1);
          handleKeyboardScroll(0);
        } else {
          const valueIndex = (value as SelectValue[]).indexOf(optionValue);
          const isSelected = valueIndex > -1;
          const values = getSelectValueArr(value, optionValue, isSelected, valueType, keys, selectedOptions);

          if (max > 0 && values.length > max) return; // 如果已选达到最大值 则不处理

          handleChange(values, {
            trigger: !isSelected ? 'check' : 'uncheck',
            e,
          });
        }
        break;
      }
      case 'Escape':
        handlePopupVisibleChange(false, { e });
        changeHoverIndex(-1);
        handleKeyboardScroll(0);
    }
  };

  return {
    hoverIndex,
    handleKeyDown,
  };
}
