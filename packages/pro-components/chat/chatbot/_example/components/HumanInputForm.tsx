import React, { useState } from 'react';
import { Card, Input, Select, Checkbox, Button, Space } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

export interface FormField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'multiselect';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
}

export interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
}

interface HumanInputFormProps {
  formConfig: FormConfig;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const HumanInputForm: React.FC<HumanInputFormProps> = ({ formConfig, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // 清除错误
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formConfig.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label}是必填项`;
        }
      }

      // 数字类型验证
      if (field.type === 'number' && formData[field.name]) {
        const numValue = Number(formData[field.name]);
        if (isNaN(numValue)) {
          newErrors[field.name] = '请输入有效的数字';
        } else if (field.min !== undefined && numValue < field.min) {
          newErrors[field.name] = `最小值不能小于${field.min}`;
        } else if (field.max !== undefined && numValue > field.max) {
          newErrors[field.name] = `最大值不能大于${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrors({});
    onCancel();
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const error = errors[field.name];

    switch (field.type) {
      case 'number':
        return (
          <div className="field-wrapper">
            <Input
              type="number"
              value={value || ''}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              onChange={(val) => handleInputChange(field.name, val)}
              status={error ? 'error' : undefined}
              tips={error}
            />
          </div>
        );

      case 'select':
        return (
          <div className="field-wrapper">
            <Select
              value={value || ''}
              placeholder={field.placeholder || `请选择${field.label}`}
              onChange={(val) => handleInputChange(field.name, val)}
              status={error ? 'error' : undefined}
              tips={error}
            >
              {field.options?.map((option) => (
                <Select.Option key={option.value} value={option.value} label={option.label} />
              ))}
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div className="field-wrapper">
            <div className="checkbox-group">
              {field.options?.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v) => v !== option.value);
                    handleInputChange(field.name, newValues);
                  }}
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="human-input-form" size="small">
      <div className="form-header">
        <UserIcon size="medium" />
        <span className="form-title">{formConfig.title}</span>
      </div>

      <div className="form-description">{formConfig.description}</div>

      <div className="form-fields">
        {formConfig.fields.map((field) => (
          <div key={field.name} className="form-field">
            <label className="field-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <Space>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            取消
          </Button>
          <Button theme="primary" onClick={handleSubmit} loading={loading}>
            提交
          </Button>
        </Space>
      </div>
    </Card>
  );
};
