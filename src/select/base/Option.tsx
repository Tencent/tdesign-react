import React, { useRef } from 'react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import get from 'lodash/get';

import useConfig from '../../hooks/useConfig';
import useRipple from '../../_util/useRipple';
import { StyledProps } from '../../common';
import { SelectValue, TdOptionProps, TdSelectProps, SelectKeysType } from '../type';

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
    context: { label?: string; selected?: boolean; event: React.MouseEvent; restData?: Record<string, any> },
  ) => void;
  restData?: Record<string, any>;
  keys?: SelectKeysType;
}

const componentType = 'select';

const Option = (props: SelectOptionProps) => {
  const {
    disabled: propDisabled,
    label: propLabel,
    selectedValue,
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
  } = props;

  let selected: boolean;
  const label = propLabel || value;
  const disabled = propDisabled || (multiple && Array.isArray(selectedValue) && max && selectedValue.length >= max);

  const { classPrefix } = useConfig();
  const optionRef = useRef();
  // 使用斜八角动画
  useRipple(optionRef);

  // 处理单选场景
  if (!multiple) {
    selected =
      isNumber(selectedValue) || isString(selectedValue)
        ? value === selectedValue
        : value === get(selectedValue, keys?.value || 'value');
  }

  // 处理多选场景
  if (multiple && Array.isArray(selectedValue)) {
    selected = selectedValue.some((item) => {
      if (isNumber(item) || isString(item)) {
        // 如果非 object 类型
        return item === value;
      }
      return get(item, keys?.value || 'value') === value;
    });
  }

  const handleSelect = (event: React.MouseEvent) => {
    if (!disabled) {
      onSelect(value, { label: String(label), selected, event, restData });
    }
  };

  const renderItem = (children: React.ReactNode) => {
    if (multiple) {
      return (
        <label
          className={classNames(`${classPrefix}-checkbox`, {
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-checked`]: selected,
          })}
        >
          <input
            type="checkbox"
            className={classNames(`${classPrefix}-checkbox__former`)}
            value=""
            disabled={disabled && !selected}
            onClick={(e) => e.stopPropagation()}
          />
          <span className={classNames(`${classPrefix}-checkbox__input`)}></span>
          <span className={classNames(`${classPrefix}-checkbox__label`)}>{children || label}</span>
        </label>
      );
    }
    return <span>{children || content || label}</span>;
  };

  return (
    <li
      className={classNames(className, `${classPrefix}-${componentType}-option`, {
        [`${classPrefix}-is-disabled`]: disabled,
        [`${classPrefix}-is-selected`]: selected,
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-size-l`]: size === 'large',
      })}
      key={value}
      onClick={handleSelect}
      ref={optionRef}
      style={style}
    >
      {renderItem(children)}
    </li>
  );
};

export default Option;
