import { useState, KeyboardEvent } from 'react';
import type { SelectOption, TdOptionProps, SelectValue } from '../type';
import { getSelectValueArr } from '../util/helper';

export type useKeyboardControlType = {
  displayOptions: TdOptionProps[];
  innerPopupVisible: boolean;
  setInnerPopupVisible: any;
  setInnerValue: Function;
  innerValue: SelectValue<SelectOption>;
  multiple: boolean;
  max: number;
};
export default function useKeyboardControl({
  displayOptions,
  innerPopupVisible,
  setInnerPopupVisible,
  setInnerValue,
  innerValue,
  multiple,
  max,
}: useKeyboardControlType) {
  const [hoverIndex, changeHoverIndex] = useState(-1);
  const filteredOptions = useState([]); // 处理普通场景选项过滤键盘选中的问题
  const virtualFilteredOptions = useState([]); // 处理虚拟滚动下选项过滤通过键盘选择的问题

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
            // onCheckAllChange(!isCheckAll);
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
    hoverIndex,
    filteredOptions,
    virtualFilteredOptions,
  };
}
