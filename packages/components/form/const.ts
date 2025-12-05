export const enum ValidateStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  VALIDATING = 'validating',
}

export const TD_READONLY_COMP = [
  'AutoComplete',
  'Cascader',
  'Checkbox',
  'CheckboxGroup',
  'Input',
  'InputNumber',
  'Radio',
  'RadioGroup',
  'RangeInput',
  'Select',
  'SelectInput',
  'TagInput',
  'Textarea',
  'TreeSelect',
];

/**
 * 原生支持 value 属性的组件
 */
export const NATIVE_INPUT_COMP = ['input', 'textarea', 'select', 'progress'];
