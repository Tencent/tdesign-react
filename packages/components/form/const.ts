export const enum ValidateStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  VALIDATING = 'validating',
}

export const TD_CTRL_PROP_MAP = new Map<string, string>([
  ['Checkbox', 'checked'],
  ['CheckTag', 'checked'],
  ['Upload', 'files'],
]);

const TD_BOOLEAN_COMP = ['Checkbox'];
const TD_ARRAY_COMP = [
  'Tree',
  'Upload',
  'Transfer',
  'TagInput',
  'RangeInput',
  'CheckboxGroup',
  'DateRangePicker',
  'TimeRangePicker',
];
export const TD_DEFAULT_VALUE_MAP = (() => {
  const map = new Map<string, any>();

  TD_ARRAY_COMP.forEach((componentName) => {
    map.set(componentName, []);
  });

  TD_BOOLEAN_COMP.forEach((componentName) => {
    map.set(componentName, false);
  });

  return map;
})();

/**
 * 原生支持 value 属性的组件
 */
export const NATIVE_INPUT_COMP = ['input', 'textarea', 'select', 'progress'];
