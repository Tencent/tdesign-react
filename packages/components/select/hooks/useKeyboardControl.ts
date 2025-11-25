import { useEffect, useRef, useState } from 'react';

import useConfig from '../../hooks/useConfig';
import { getSelectValueArr } from '../util/helper';

import type { SelectOption, SelectValue, SelectValueChangeTrigger, TdOptionProps } from '../type';

export type useKeyboardControlType = {
  max: number;
  multiple: boolean;
  value: SelectValue<SelectOption>;
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
};

export default function useKeyboardControl({
  max,
  multiple,
  value,
  handleChange,
  innerPopupVisible,
  handlePopupVisibleChange,
  displayOptions,
  onCheckAllChange,
  selectInputRef,
}: useKeyboardControlType) {
  const [hoverIndex, changeHoverIndex] = useState(-1);
  const [hoverOption, changeHoverOption] = useState<TdOptionProps>(undefined);

  const { classPrefix } = useConfig();
  // 全选判断
  const isCheckAll = useRef(false);
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
      // 小于0时不需要特殊处理，会被设为0
      const scrollHeight = popupContent.querySelector(optionSelector).clientHeight * hoverIndex;

      popupContent.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!innerPopupVisible) {
      changeHoverIndex(-1);
    }
  }, [innerPopupVisible]);

  useEffect(() => {
    changeHoverOption(hoverIndex === -1 ? undefined : displayOptions[hoverIndex]);
  }, [hoverIndex, displayOptions]);

  const handleKeyDown = (_value: string, { e }: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    const optionsListLength = displayOptions.length;

    let newIndex = hoverIndex;

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault();
        if (hoverIndex === -1) newIndex = 0;
        else if (hoverIndex === 0 || hoverIndex > optionsListLength - 1) newIndex = optionsListLength - 1;
        else newIndex -= 1;

        if (displayOptions[newIndex]?.disabled) newIndex -= 1;

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
      case 'Enter':
        if (!innerPopupVisible) {
          handlePopupVisibleChange(true, { e });
          break;
        }

        if (hoverIndex === -1) return;

        if (!multiple) {
          const selectedOptions = displayOptions[hoverIndex];

          if (selectedOptions)
            handleChange(selectedOptions.value, {
              trigger: 'check',
              e,
            });
          handlePopupVisibleChange(false, { e });
          changeHoverIndex(-1);
          handleKeyboardScroll(0);
        } else {
          if (displayOptions[hoverIndex].checkAll) {
            onCheckAllChange(!isCheckAll.current);
            return;
          }

          const optionValue = displayOptions[hoverIndex]?.value;

          if (!optionValue) return;
          const newValue = value as Array<SelectValue>;
          const valueIndex = newValue.indexOf(optionValue);
          const isSelected = valueIndex > -1;

          const values = getSelectValueArr(value, optionValue, isSelected);

          if (max > 0 && values.length > max) return; // 如果已选达到最大值 则不处理
          handleChange(values, {
            trigger: !isSelected ? 'check' : 'uncheck',
            e,
          });
        }
        break;
      case 'Escape':
        handlePopupVisibleChange(false, { e });
        changeHoverIndex(-1);
        handleKeyboardScroll(0);
    }
  };

  return {
    handleKeyDown,
    hoverOption,
  };
}
