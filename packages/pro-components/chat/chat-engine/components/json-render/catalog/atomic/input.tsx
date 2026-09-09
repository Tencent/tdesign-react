/**
 * TDesign Input 组件适配 json-render
 *
 * 这是纯净的 json-render Input 组件，不包含 A2UI 协议绑定逻辑
 * 如需 A2UI 支持，请使用 a2uiRegistry 中的 A2UITextField
 */

import React from 'react';
import { Input, Space } from 'tdesign-react';

import { useDataBinding } from '../..';
import { sanitizeProps } from '../../utils/sanitize-props';

import type { InputProps } from 'tdesign-react';
import type { ComponentRenderProps } from '../../types';

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

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps);

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
      {...safeRestProps}
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

  // 细粒度订阅 + 稳定的 setValue（类似 useState 的 API）
  const [value = '', setValue] = useDataBinding<string>(valuePath);

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps);

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
          onChange={setValue}
          {...safeRestProps}
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
      onChange={setValue}
      {...safeRestProps}
    />
  );
};

JsonRenderTextField.displayName = 'JsonRenderTextField';

export default JsonRenderInput;
