/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TdInputProps } from './type';

export const inputDefaultProps: TdInputProps = {
  align: 'left',
  allowInputOverMax: false,
  autoWidth: false,
  autocomplete: undefined,
  autofocus: false,
  borderless: false,
  // 是否允许输入，默认是 true，表示组件内部的 input 元素允许输入；readonly 为 true 时，此值失效
  allowInput: true,
  // 是否可清空，值为 true 时，输入框后会有一个清空按钮，点击后清空输入框；readonly 为 true 时，此值失效
  clearable: false,
  placeholder: undefined,
  // 是否只读，在只读模式下，输入框不能输入，且没有清除按钮，优先级高于 allowInput、clearable
  readonly: false,
  showClearIconOnEmpty: false,
  showLimitNumber: false,
  size: 'medium',
  spellCheck: false,
  status: 'default',
  type: 'text',
  defaultValue: '',
};
