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
}: useKeyboardControlType) {
  const { classPrefix } = useConfig();

  const isCheckAll = useRef(false);
  const [hoverIndex, changeHoverIndex] = useState(-1);

  const isObjectType = useMemo(() => valueType === 'object', [valueType]);
  const { valueKey, disabledKey } = useMemo(() => getKeyMapping(keys), [keys]);

  useEffect(() => {
    if (!innerPopupVisible) {
      changeHoverIndex(-1);
    } else if (!multiple) {
      // 单选时，hoverIndex 初始值为选中值的索引
      const index = displayOptions.findIndex((option) => option.value === value);
      changeHoverIndex(index >= 0 ? index : -1);
    } else {
      changeHoverIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerPopupVisible]);

  useEffect(() => {
    if (!Array.isArray(value)) return;
    isCheckAll.current =
      value.length === displayOptions.filter((v) => !((v.disabled || v.checkAll) && !value.includes(v.value))).length;
  }, [value, displayOptions]);

  const handleKeyboardScroll = (hoverIndex: number) => {
    const popupContent = selectInputRef.current.getPopupContentElement();

    const optionSelector = `.${classPrefix}-select-option`;
    const selector = `.${classPrefix}-select-option__hover`;
    const firstSelectedNode: HTMLDivElement = popupContent.querySelector(selector);
    if (firstSelectedNode) {
      // 避免与 updateScrollTop 冲突
      toggleIsScrolling(true);

      // 小于0时不需要特殊处理，会被设为0
      const scrollHeight = popupContent.querySelector(optionSelector).clientHeight * hoverIndex;

      popupContent.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleKeyDown = (_value: string, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    const optionsListLength = displayOptions.length;

    let newIndex = hoverIndex;

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault();
        if (hoverIndex === -1) newIndex = 0;
        else if (hoverIndex === 0 || hoverIndex > optionsListLength - 1) newIndex = optionsListLength - 1;
        else newIndex -= 1;

        if (displayOptions[newIndex]?.[disabledKey]) newIndex -= 1;

        changeHoverIndex(newIndex);
        handleKeyboardScroll(newIndex);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (hoverIndex === -1 || hoverIndex >= optionsListLength - 1) newIndex = 0;
        else newIndex += 1;

        if (displayOptions[newIndex]?.disabled) newIndex += 1;

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
