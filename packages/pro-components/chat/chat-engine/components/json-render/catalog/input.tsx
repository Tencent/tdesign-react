/**
 * TDesign Input 组件适配 json-render
 * 
 * 这是纯净的 json-render Input 组件，不包含 A2UI 协议绑定逻辑
 * 如需 A2UI 支持，请使用 a2uiRegistry 中的 A2UITextField
 */

import React from 'react';
import { Input, Space } from 'tdesign-react';
import type { InputProps } from 'tdesign-react';
import type { ComponentRenderProps } from '../types';
import { useData } from '../';
import { getByPath } from '@json-render/core';

/**
 * json-render Input 组件（基础版本，不带数据绑定）
 */
export const JsonRenderInput: React.FC<ComponentRenderProps> = ({ element }) => {
  const {
    value,
    defaultValue,
    placeholder,
    disabled = false,
    readonly = false,
    size = 'medium',
    type = 'text',
    maxlength,
    clearable = false,
    status,
    onChange,
    onBlur,
    onFocus,
    onEnter,
    onClear,
    ...restProps
  } = element.props as InputProps;

  return (
    <Input
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      readonly={readonly}
      size={size}
      type={type}
      maxlength={maxlength}
      clearable={clearable}
      status={status}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onEnter={onEnter}
      onClear={onClear}
      {...restProps}
    />
  );
};

JsonRenderInput.displayName = 'JsonRenderInput';

/**
 * json-render TextField 组件（带 label 和 valuePath 数据绑定）
 * 
 * 这是标准 json-render 的 TextField，支持 valuePath 但不支持 A2UI 的 disabledPath
 * 如需完整 A2UI 支持，请使用 a2uiRegistry 中的 A2UITextField
 */
export const JsonRenderTextField: React.FC<ComponentRenderProps> = ({ element }) => {
  const {
    label,
    valuePath,
    placeholder,
    type = 'text',
    disabled = false,
    size = 'medium',
    ...restProps
  } = element.props as InputProps & {
    label?: string;
    valuePath?: string;
  };

  const { data, set } = useData();

  const value = valuePath ? (getByPath(data, valuePath) as string) ?? '' : '';

  const handleChange = (newValue: string) => {
    if (valuePath) {
      set(valuePath, newValue);
    }
  };

  if (label) {
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <label style={{ fontSize: '14px', fontWeight: 500 }}>{label}</label>
        <Input
          value={value}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          size={size}
          onChange={handleChange}
          {...restProps}
        />
      </Space>
    );
  }

  return (
    <Input
      value={value}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      size={size}
      onChange={handleChange}
      {...restProps}
    />
  );
};

JsonRenderTextField.displayName = 'JsonRenderTextField';

export default JsonRenderInput;
