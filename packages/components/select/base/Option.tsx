import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { get, isNumber, isString } from 'lodash-es';

import useConfig from '../../hooks/useConfig';
import useDomRefCallback from '../../hooks/useDomRefCallback';
import useRipple from '../../hooks/useRipple';
import { getKeyMapping } from '../util/helper';

import type { StyledProps } from '../../common';
import type { SelectKeysType, SelectOption, SelectValue, TdOptionProps, TdSelectProps } from '../type';

/**
 * Option 组件属性
 */
export interface SelectOptionProps
  extends StyledProps,
    TdOptionProps,
    Pick<TdSelectProps, 'size' | 'multiple' | 'max'> {
  selectedValue?: SelectValue;
  children?: React.ReactNode;
  onSelect?: (
    value: string | number,
    context: {
      label?: string;
      selected?: boolean;
      event: React.MouseEvent<HTMLLIElement>;
      restData?: Record<string, any>;
    },
  ) => void;
  onCheckAllChange?: (checkAll: boolean, e: React.MouseEvent<HTMLLIElement>) => void;
  restData?: Record<string, any>;
  keys?: SelectKeysType;
  optionLength?: number;
  isVirtual?: boolean;
  onRowMounted?: (rowData: { ref: HTMLElement; data: SelectOption }) => void;
  isKeyboardHovered?: boolean;
}

const componentType = 'select';

const Option: React.FC<SelectOptionProps> = (props) => {
  const {
    disabled: propDisabled,
    label: propLabel,
    title: propTitle,
    selectedValue,
    checkAll,
    multiple,
    size,
    max,
    keys,
    value,
    onSelect,
    children,
    content,
    restData,
    style,
    className,
    isVirtual,
    isKeyboardHovered,
  } = props;

  const label = propLabel || value;
  const disabled = propDisabled || (multiple && Array.isArray(selectedValue) && max && selectedValue.length >= max);
  const initCheckedStatus = !(Array.isArray(selectedValue) && selectedValue.length === props.optionLength);

  let selected: boolean;
  let indeterminate: boolean;
  // 处理存在禁用项时，全选状态无法来回切换的问题
  const [allSelectableChecked, setAllSelectableChecked] = useState(initCheckedStatus);

  const titleContent = useMemo(() => {
    // 外部设置 props，说明希望受控
    const controlledTitle = Reflect.has(props, 'title');
    if (controlledTitle) return propTitle;
    if (typeof label === 'string') return label;
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propTitle, label]);

  const { classPrefix } = useConfig();

  // 使用斜八角动画
  const [optionRef, setRefCurrent] = useDomRefCallback();
  useRipple(optionRef);

  useEffect(() => {
    if (isVirtual && optionRef) {
      props.onRowMounted?.({
        ref: optionRef,
        data: props,
      });
    }
    // eslint-disable-next-line
  }, [isVirtual, optionRef]);

  const { valueKey } = getKeyMapping(keys);
  // 处理单选场景
  if (!multiple) {
    selected =
      isNumber(selectedValue) || isString(selectedValue)
        ? value === selectedValue
        : value === get(selectedValue, valueKey);
  }

  // 处理多选场景
  if (multiple && Array.isArray(selectedValue)) {
    selected = selectedValue.some((item) => {
      if (isNumber(item) || isString(item)) {
        // 如果非 object 类型
        return item === value;
      }
      return get(item, valueKey) === value;
    });
    if (props.checkAll) {
      selected = selectedValue.length === props.optionLength;
      indeterminate = selectedValue.length > 0 && !selected;
    }
  }

  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    if (!disabled && !checkAll) {
      onSelect(value, { label: String(label), selected, event, restData });
    }
    if (checkAll) {
      props.onCheckAllChange?.(allSelectableChecked, event);
      setAllSelectableChecked(!allSelectableChecked);
    }
  };

  const renderItem = () => {
    const displayContent = children || content || label;
    if (multiple) {
      return (
        <label
          className={classNames(`${classPrefix}-checkbox`, {
            [`${classPrefix}-is-indeterminate`]: indeterminate,
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-checked`]: selected,
          })}
          title={titleContent}
        >
          <input
            type="checkbox"
            className={classNames(`${classPrefix}-checkbox__former`)}
            value=""
            disabled={disabled && !selected}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          />
          <span className={classNames(`${classPrefix}-checkbox__input`)}></span>
          <span className={classNames(`${classPrefix}-checkbox__label`)}>{displayContent}</span>
        </label>
      );
    }
    return <span title={titleContent}>{displayContent}</span>;
  };

  return (
    <li
      className={classNames(className, `${classPrefix}-${componentType}-option`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-selected`]: selected,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
        [`${classPrefix}-${componentType}-option__hover`]: isKeyboardHovered,
      })}
      key={value}
      onClick={handleSelect}
      ref={setRefCurrent}
      style={style}
    >
      {renderItem()}
    </li>
  );
};

export default Option;
