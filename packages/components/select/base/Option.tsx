import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { get, isNumber, isString } from 'lodash-es';

import useConfig from '../../hooks/useConfig';
import useDomRefCallback from '../../hooks/useDomRefCallback';
import useRipple from '../../hooks/useRipple';
import { isAllSelected } from '../util/checkAll';
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
  isHovered?: boolean;
  currentOptions?: SelectOption[];
  valueType?: TdSelectProps['valueType'];
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
    isHovered,
    currentOptions,
    valueType,
  } = props;

  const label = propLabel || value;
  const disabled = propDisabled || (multiple && Array.isArray(selectedValue) && max && selectedValue.length >= max);

  let selected: boolean;
  let indeterminate: boolean;

  const titleContent = useMemo(() => {
    const controlledTitle = Reflect.has(props, 'title');
    if (controlledTitle) return propTitle;
    if (typeof label === 'string') return label;
    return null;
  }, [propTitle, label, props]);

  const { classPrefix } = useConfig();

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
    if (checkAll && currentOptions) {
      // 使用工具函数计算当前是否全选
      const allSelected = isAllSelected(currentOptions, selectedValue, keys, valueType);
      props.onCheckAllChange?.(!allSelected, event);
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
        [`${classPrefix}-is-selected`]: selected && !isHovered,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
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
