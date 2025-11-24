import { useState, KeyboardEvent, useRef, useEffect } from 'react';

import useConfig from '../../hooks/useConfig';
import { getSelectValueArr } from '../util/helper';

import type { SelectOption, TdOptionProps, SelectValue } from '../type';

export type useKeyboardControlType = {
  displayOptions: TdOptionProps[];
  innerPopupVisible: boolean;
  setInnerPopupVisible: any;
  onCheckAllChange: (checkAll: boolean, e?: React.MouseEvent<HTMLLIElement>) => void;
  setInnerValue: Function;
  innerValue: SelectValue<SelectOption>;
  multiple: boolean;
  max: number;
  selectInputRef: any;
};

export default function useKeyboardControl({
  displayOptions,
  innerPopupVisible,
  setInnerPopupVisible,
  setInnerValue,
  innerValue,
  multiple,
  max,
  onCheckAllChange,
  selectInputRef,
}: useKeyboardControlType) {
  const [hoverIndex, changeHoverIndex] = useState(-1);
  const [hoverOption, changeHoverOption] = useState<TdOptionProps>(undefined);

  const { classPrefix } = useConfig();
  // 全选判断
  const isCheckAll = useRef(false);
  useEffect(() => {
    if (!Array.isArray(innerValue)) return;
    isCheckAll.current = innerValue.length === displayOptions.filter((v) => !(v.disabled || v.checkAll)).length;
  }, [innerValue, displayOptions]);

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

  const handleKeyDown = (_value, { e }: { e: KeyboardEvent }) => {
    const optionsListLength = displayOptions.length;

    let newIndex = hoverIndex;

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault();
        if (hoverIndex === -1) {
          newIndex = 0;
        } else if (hoverIndex === 0 || hoverIndex > optionsListLength - 1) {
          newIndex = optionsListLength - 1;
        } else {
          newIndex -= 1;
        }
        if (displayOptions[newIndex]?.disabled) {
          newIndex -= 1;
        }
        changeHoverIndex(newIndex);

        changeHoverOption(displayOptions[newIndex]);
        handleKeyboardScroll(newIndex);
        break;
      case 'ArrowDown':
        e.preventDefault();

        if (hoverIndex === -1 || hoverIndex >= optionsListLength - 1) {
          newIndex = 0;
        } else {
          newIndex += 1;
        }
        if (displayOptions[newIndex]?.disabled) {
          newIndex += 1;
        }
        changeHoverIndex(newIndex);
        changeHoverOption(displayOptions[newIndex]);

        handleKeyboardScroll(newIndex);
        break;
      case 'Enter':
        if (hoverIndex === -1) break;

        if (!innerPopupVisible) {
          setInnerPopupVisible(true, { e });
          break;
        }

        if (!multiple) {
          const selectedOptions = displayOptions[hoverIndex];
          setInnerValue(selectedOptions.value, {
            option: selectedOptions?.[0],
            selectedOptions: displayOptions[hoverIndex],
            trigger: 'check',
            e,
          });
          setInnerPopupVisible(false, { e });
        } else {
          if (hoverIndex === -1) return;

          if (displayOptions[hoverIndex].checkAll) {
            onCheckAllChange(!isCheckAll.current);
            return;
          }

          const optionValue = displayOptions[hoverIndex]?.value;

          if (!optionValue) return;
          const newValue = innerValue as Array<SelectValue>;
          const valueIndex = newValue.indexOf(optionValue);
          const isSelected = valueIndex > -1;

          const values = getSelectValueArr(innerValue, optionValue, isSelected);

          if (max > 0 && values.length > max) return; // 如果已选达到最大值 则不处理
          setInnerValue(values, {
            option: [],
            trigger: !isSelected ? 'check' : 'uncheck',
            e,
          });
        }
        break;
      case 'Escape':
        setInnerPopupVisible(false, { e });
    }
  };

  return {
    handleKeyDown,
    hoverOption,
  };
}
