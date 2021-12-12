/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * updated at 2021-12-12 18:01:23
 * */

import { IsEmailOptions } from 'validator/es/lib/isEmail';
import { IsURLOptions } from 'validator/es/lib/isURL';
import { TNode, FormResetEvent, FormSubmitEvent } from '../common';

export interface TdFormProps<FormData extends Data = Data> {
  /**
   * 是否在表单标签字段右侧显示冒号
   * @default false
   */
  colon?: boolean;
  /**
   * 表单字段标签对齐方式：左对齐、右对齐、顶部对齐
   * @default right
   */
  labelAlign?: 'left' | 'right' | 'top';
  /**
   * 可以整体设置label标签宽度，默认为100px
   * @default '100px'
   */
  labelWidth?: string | number;
  /**
   * 表单布局，有两种方式：纵向布局 和 行内布局
   * @default vertical
   */
  layout?: 'vertical' | 'inline';
  /**
   * 是否阻止表单提交默认事件，即提交后会刷新页面
   * @default true
   */
  preventSubmitDefault?: boolean;
  /**
   * 是否显示必填符号，默认显示
   */
  requiredMark?: boolean;
  /**
   * 重置表单的方式，值为 empty 表示重置表单为空，值为 initial 表示重置表单数据为初始值
   * @default empty
   */
  resetType?: 'empty' | 'initial';
  /**
   * 表单字段校验规则
   */
  rules?: { [field in keyof FormData]: Array<FormRule> };
  /**
   * 表单校验不通过时，是否自动滚动到第一个校验不通过的字段，平滑滚动或是瞬间直达。值为空则表示不滚动
   */
  scrollToFirstError?: 'smooth' | 'auto';
  /**
   * 校验不通过时，是否显示错误提示信息
   * @default true
   */
  showErrorMessage?: boolean;
  /**
   * 表单尺寸
   * @default medium
   */
  size?: 'medium' | 'large';
  /**
   * 校验状态图标
   */
  statusIcon?: boolean | TNode<TdFormItemProps>;
  /**
   * 表单重置时触发
   */
  onReset?: (context: { e?: FormResetEvent }) => void;
  /**
   * 表单提交时触发。其中 context.validateResult 表示校验结果，context .firstError 表示校验不通过的第一个规则提醒。context.validateResult 值为 true 表示校验通过；如果校验不通过，context.validateResult 值为校验结果列表
   */
  onSubmit?: (context: SubmitContext<FormData>) => void;
}

export interface TdFormItemProps {
  /**
   * label 原生属性
   * @default ''
   */
  for?: string;
  /**
   * 表单项说明内容
   * @default ''
   */
  help?: string;
  /**
   * 表单初始数据，重置时所需初始数据
   */
  initialData?: string | boolean;
  /**
   * 字段标签名称
   * @default ''
   */
  label?: TNode;
  /**
   * 表单字段标签对齐方式：左对齐、右对齐、顶部对齐。默认使用 Form 的对齐方式，优先级高于 Form.labelAlign
   */
  labelAlign?: 'left' | 'right' | 'top';
  /**
   * 可以整体设置标签宽度，优先级高于 Form.labelWidth
   */
  labelWidth?: string | number;
  /**
   * 表单字段名称
   * @default ''
   */
  name?: string;
  /**
   * 是否显示必填符号，优先级高于 Form.requiredMark
   */
  requiredMark?: boolean;
  /**
   * 表单字段校验规则
   * @default []
   */
  rules?: Array<FormRule>;
  /**
   * 校验状态图标。优先级高级 Form 的 statusIcon
   */
  statusIcon?: TNode;
  /**
   * 是否显示校验成功的边框，默认不显示
   * @default false
   */
  successBorder?: boolean;
}

export interface FormRule {
  /**
   * 内置校验方法，校验值类型是否为布尔类型
   */
  boolean?: boolean;
  /**
   * 内置校验方法，校验值是否为日期格式，[参数文档](https://github.com/validatorjs/validator.js)
   */
  date?: boolean | IsDateOptions;
  /**
   * 内置校验方法，校验值是否为邮件格式，[参数文档](https://github.com/validatorjs/validator.js)
   */
  email?: boolean | IsEmailOptions;
  /**
   * 内置校验方法，校验值是否属于枚举值中的值。示例，enum: ['primary', 'info', 'warning']
   */
  enum?: Array<string>;
  /**
   * 内置校验方法，校验值是否为身份证号码
   */
  idcard?: boolean;
  /**
   * 内置校验方法，校验值固定长度，如：len: 10 表示值的字符长度只能等于 10 ，中文表示 2 个字符，英文为 1 个字符
   */
  len?: number | boolean;
  /**
   * 内置校验方法，校验值最大长度，如：max: 100 表示值最多不能超过 100 个字符，中文表示 2 个字符，英文为 1 个字符
   */
  max?: number | boolean;
  /**
   * 校验未通过时呈现的错误信息，值为空则不显示
   * @default ''
   */
  message?: string;
  /**
   * 内置校验方法，校验值最小长度，如：min: 10 表示值最多不能少于 10 个字符，中文表示 2 个字符，英文为 1 个字符
   */
  min?: number | boolean;
  /**
   * 内置校验方法，校验值是否为数字（1.2 、 1e5  都算数字）
   */
  number?: boolean;
  /**
   * 内置校验方法，校验值是否符合正则表达式匹配结果
   */
  pattern?: RegExp;
  /**
   * 内置校验方法，校验值是否已经填写。该值为 true，默认显示必填标记
   */
  required?: boolean;
  /**
   * 内置校验方法，校验值是否为手机号码
   */
  telnumber?: boolean;
  /**
   * 校验触发方式
   * @default change
   */
  trigger?: 'change' | 'blur';
  /**
   * 校验未通过时呈现的错误信息类型，有 告警信息提示 和 错误信息提示 等两种
   * @default error
   */
  type?: 'error' | 'warning';
  /**
   * 内置校验方法，校验值是否为网络链接地址，[参数文档](https://github.com/validatorjs/validator.js)
   */
  url?: boolean | IsURLOptions;
  /**
   * 自定义校验规则
   */
  validator?: CustomValidator;
}

export interface FormInstance {
  /**
   * 获取全部表单数据
   */
  getAllFieldsValue?: () => Record<string, unknown>;
  /**
   * 获取单个字段值
   */
  getFieldValue?: (field: string) => unknown;
  /**
   * 重置表单，与点击 reset 按钮效果相同
   */
  reset?: () => void;
  /**
   * 设置多组字段状态
   */
  setFields?: (fields: FieldData[]) => void;
  /**
   * 设置表单字段值
   */
  setFieldsValue?: (field: FieldOption) => void;
  /**
   * 提交表单，与点击 submit 按钮效果相同
   */
  submit?: () => void;
  /**
   * 校验
   */
  validate?: () => ValidateResult<{ [key: string]: boolean | ErrorList }>;
}

export interface SubmitContext<T extends Data = Data> {
  e?: FormSubmitEvent;
  validateResult: FormValidateResult<T>;
  firstError?: string;
}

export type FormValidateResult<T> = boolean | ValidateResultObj<T>;

export type ValidateResultObj<T> = { [key in keyof T]: boolean | ValidateResultList };

export type ValidateResultList = Array<AllValidateResult>;

export type AllValidateResult = CustomValidateObj | ValidateResultType;

export interface ValidateResultType extends FormRule {
  result: boolean;
}

export type ValidateResult<T> = { [key in keyof T]: boolean | ErrorList };

export type ErrorList = Array<FormRule>;

export type Data = { [key: string]: any };

export interface IsDateOptions {
  format: string;
  strictMode: boolean;
  delimiters: string[];
}

export type CustomValidator = (val: ValueType) => CustomValidateResolveType | Promise<CustomValidateResolveType>;

export type CustomValidateResolveType = boolean | CustomValidateObj;

export interface CustomValidateObj {
  result: boolean;
  message: string;
  type?: 'error' | 'warning' | 'success';
}

export type ValueType = any;

export interface FieldData {
  name: string;
  value: unknown;
  status: string;
}

export type FieldOption = Record<string, unknown>;
