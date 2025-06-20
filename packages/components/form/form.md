:: BASE_DOC ::

### 复杂嵌套数据结构表单

可给 `name` 传入数组整理成对象嵌套数据结构。

{{ nested-data }}

### 动态增减嵌套表单

可使用 `Form.FormList` 组件创建动态表单。

{{ form-list }}

### 字段联动的表单

在某些特定场景，例如修改某个字段值后出现新的字段选项、或者纯粹希望表单任意变化都对某一个区域进行渲染。你可以通过 `shouldUpdate` 修改 `FormItem` 的更新逻辑。

{{ form-field-linkage }}

### 自定义表单控件

可以使用 `Form.FormItem` 包裹自定义组件并在组件中接受 `value` 和 `onChange` 的入参，实现自定义表单控件。

{{ customized-form-controls }}

## Hooks

### Form.useForm

创建 Form 实例，用于管理所有数据状态。


### Form.useWatch

用于直接获取 form 中字段对应的值。

```js
const Demo = () => {
  const [form] = Form.useForm();
  const userName = Form.useWatch('username', form);

  return (
    <Form form={form}>
      <Form.Item name="username">
        <Input />
      </Form.Item>
    </Form>
  );
};
```

## FAQ

### 为什么被 FormItem 包裹的组件 value、defaultValue 没有效果？

Form 组件设计的初衷是为了解放开发者配置大量的 `value`、`onChange` 受控属性，所以 Form.FormItem 被设计成需要拦截嵌套组件的受控属性，如需定义初始值请使用 `initialData` 属性。

由于 Form.FormItem 只会拦截第一层子节点的受控属性，所以如不希望 Form.FormItem 拦截受控属性希望自行管理 state 的话，可以在 Form.FormItem 下包裹一层 `div` 节点脱离 Form.FormItem 的代理，但同时也会失去 Form 组件的校验能力。

### 我只想要 Form 组件的布局效果，校验能力我自己业务来实现可以吗？

可以的，Form 的校验能力只跟 `name` 属性关联，不指定 Form.FormItem 的 `name` 属性是可以当成布局组件来使用的，甚至可以实现各种嵌套自定义内容的布局效果。

```js
// 可以单独使用 FormItem 组件
<Form.FormItem label="姓名">
  <div>可以任意定制内容</div>
  <Input />
  <div>可以任意定制内容</div>
</Form.FormItem>
```

### getFieldsValue 返回的数据如何支持嵌套数据结构？

将 `name` 设置成数组形式可以支持嵌套数据结构。

```js
// ['user', 'name'] => { user: { name: '' } }
<Form.FormItem label="姓名" name={['user', 'name']}>
  <Input />
</Form.FormItem>
```

## API

### Form Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
colon | Boolean | false | 是否在表单标签字段右侧显示冒号 | N
disabled | Boolean | undefined | 是否禁用整个表单 | N
errorMessage | Object | - | 表单错误信息配置，示例：`{ idcard: '请输入正确的身份证号码', max: '字符长度不能超过 ${max}' }`。TS 类型：`FormErrorMessage` | N
form | Object | - | 经 `Form.useForm()` 创建的 form 控制实例。TS 类型：`FormInstanceFunctions` | N
formControlledComponents | Array | - | 允许表单统一控制禁用状态的自定义组件名称列表。默认会有组件库的全部输入类组件：TInput、TInputNumber、TCascader、TSelect、TOption、TSwitch、TCheckbox、TCheckboxGroup、TRadio、TRadioGroup、TTreeSelect、TDatePicker、TTimePicker、TUpload、TTransfer、TSlider。对于自定义组件，组件内部需要包含可以控制表单禁用状态的变量 `formDisabled`。示例：`['CustomUpload', 'CustomInput']`。TS 类型：`Array<string>` | N
id | String | undefined | 表单原生的id属性，支持用于配合非表单内的按钮通过form属性来触发表单事件 | N
initialData | Object | - | 表单初始数据，重置时所需初始数据，优先级小于 FormItem 设置的 initialData | N
labelAlign | String | right | 表单字段标签对齐方式：左对齐、右对齐、顶部对齐。可选项：left/right/top | N
labelWidth | String / Number | '100px' | 可以整体设置label标签宽度，默认为100px | N
layout | String | vertical | 表单布局，有两种方式：纵向布局 和 行内布局。可选项：vertical/inline | N
preventSubmitDefault | Boolean | true | 是否阻止表单提交默认事件（表单提交默认事件会刷新页面），设置为 `true` 可以避免刷新 | N
requiredMark | Boolean | true | 是否显示必填符号（*），默认显示 | N
requiredMarkPosition | String | left | 表单必填符号（*）显示位置。可选项：left/right | N
resetType | String | empty | 重置表单的方式，值为 empty 表示重置表单为空，值为 initial 表示重置表单数据为初始值。可选项：empty/initial | N
rules | Object | - | 表单字段校验规则。TS 类型：`FormRules<FormData>` `type FormRules<T extends Data = any> = { [field in keyof T]?: Array<FormRule> }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
scrollToFirstError | String | - | 表单校验不通过时，是否自动滚动到第一个校验不通过的字段，平滑滚动或是瞬间直达。值为空则表示不滚动。可选项：''/smooth/auto | N
showErrorMessage | Boolean | true | 校验不通过时，是否显示错误提示信息，统一控制全部表单项。如果希望控制单个表单项，请给 FormItem 设置该属性 | N
statusIcon | TNode | undefined | 校验状态图标，值为 `true` 显示默认图标，默认图标有 成功、失败、警告 等，不同的状态图标不同。`statusIcon` 值为 `false`，不显示图标。`statusIcon` 值类型为渲染函数，则可以自定义右侧状态图标。TS 类型：`boolean \| TNode<TdFormItemProps>`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
submitWithWarningMessage | Boolean | false | 【讨论中】当校验结果只有告警信息时，是否触发 `submit` 提交事件 | N
supportNumberKey | Boolean | true | 是否支持使用数字作为表单键值，在1.9.3版本后表单组件支持数字作为键值，若仍需要保留数字作为数组下标，请关闭此API或使用 FormList | N
onReset | Function |  | TS 类型：`(context: { e?: FormResetEvent }) => void`<br/>表单重置时触发 | N
onSubmit | Function |  | TS 类型：`(context: SubmitContext<FormData>) => void`<br/>表单提交时触发。其中 `context.validateResult` 表示校验结果，`context.firstError` 表示校验不通过的第一个规则提醒。`context.validateResult` 值为 `true` 表示校验通过；如果校验不通过，`context.validateResult` 值为校验结果列表。<br />【注意】⚠️ 默认情况，输入框按下 Enter 键会自动触发提交事件，如果希望禁用这个默认行为，可以给输入框添加  enter 事件，并在事件中设置 `e.preventDefault()`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)。<br/>`interface SubmitContext<T extends Data = Data> { e?: FormSubmitEvent; validateResult: FormValidateResult<T>; firstError?: string; fields?: any }`<br/><br/>`type FormValidateResult<T> = boolean \| ValidateResultObj<T>`<br/><br/>`type ValidateResultObj<T> = { [key in keyof T]: boolean \| ValidateResultList }`<br/><br/>`type ValidateResultList = Array<AllValidateResult>`<br/><br/>`type AllValidateResult = CustomValidateObj \| ValidateResultType`<br/><br/>`interface ValidateResultType extends FormRule { result: boolean }`<br/><br/>`type ValidateResult<T> = { [key in keyof T]: boolean \| ErrorList }`<br/><br/>`type ErrorList = Array<FormRule>`<br/> | N
onValuesChange | Function |  | TS 类型：`(changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void`<br/>字段值更新时触发的回调事件 | N

### FormInstanceFunctions 组件实例方法

名称 | 参数 | 返回值 | 描述
-- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
clearValidate | `(fields?: Array<keyof FormData>)` | \- | 必需。清空校验结果。可使用 fields 指定清除部分字段的校验结果，fields 值为空则表示清除所有字段校验结果。清除邮箱校验结果示例：`clearValidate(['email'])`
currentElement | \- | `HTMLFormElement` | 必需。获取 form dom 元素
getFieldValue | `(field: NamePath) ` | `unknown` | 必需。获取单个字段值
getFieldsValue | \- | `getFieldsValue<FormData>` | 必需。获取一组字段名对应的值，当调用 getFieldsValue(true) 时返回所有表单数据。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)。<br/>`interface getFieldsValue<T>{ (nameList: true): T; (nameList: any[]): Record<keyof T, unknown>;}`<br/>
reset | `(params?: FormResetParams<FormData>)` | \- | 必需。重置表单，表单里面没有重置按钮`<button type=\"reset\" />`时可以使用该方法，默认重置全部字段为空，该方法会触发 `reset` 事件。<br />如果表单属性 `resetType='empty'` 或者 `reset.type='empty'` 会重置为空；<br />如果表单属性 `resetType='initial'` 或者 `reset.type='initial'` 会重置为表单初始值。<br />`reset.fields` 用于设置具体重置哪些字段，示例：`reset({ type: 'initial', fields: ['name', 'age'] })`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)。<br/>`interface FormResetParams<FormData> { type?: 'initial' \| 'empty'; fields?: Array<keyof FormData> }`<br/>
setFields | `(fields: FieldData[])` | \- | 必需。设置多组字段状态。TS 类型：`(fields: FieldData[]) => void` `interface FieldData { name: NamePath; value?: unknown, status?: string, validateMessage?: { type?: string, message?: string } }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)
setFieldsValue | `(field: Data)` | \- | 必需。设置表单字段值
setValidateMessage | `(message: FormValidateMessage<FormData>)` | \- | 必需。设置自定义校验结果，如远程校验信息直接呈现。注意需要在组件挂载结束后使用该方法。`FormData` 指表单数据泛型。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)。<br/>`type FormValidateMessage<FormData> = { [field in keyof FormData]: FormItemValidateMessage[] }`<br/><br/>`interface FormItemValidateMessage { type: 'warning' \| 'error'; message: string }`<br/>
getValidateMessage | `(fields?: Array<keyof FormData>)` | `Array<FormRule> \| void` | 必需。获取校验结果，当调用 getValidateMessage() 时返回所有校验结果。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)。<br/>
submit | `(params?: { showErrorMessage?: boolean })` | \- | 必需。提交表单，表单里面没有提交按钮`<button type=\"submit\" />`时可以使用该方法。`showErrorMessage` 表示是否在提交校验不通过时显示校验不通过的原因，默认显示。该方法会触发 `submit` 事件
validate | `(params?: FormValidateParams)` | `Promise<FormValidateResult<FormData>>` | 必需。校验函数，包含错误文本提示等功能。泛型 `FormData` 表示表单数据 TS 类型。<br/>【关于参数】`params.fields` 表示校验字段，如果设置了 `fields`，本次校验将仅对这些字段进行校验。`params.trigger` 表示本次触发校验的范围，'params.trigger = blur' 表示只触发校验规则设定为 trigger='blur' 的字段，'params.trigger = change' 表示只触发校验规则设定为 trigger='change' 的字段，默认触发全范围校验。`params.showErrorMessage` 表示校验结束后是否显示错误文本提示，默认显示。<br />【关于返回值】返回值为 true 表示校验通过；如果校验不通过，返回值为校验结果列表。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts)。<br/>`interface FormValidateParams { fields?: Array<string>; showErrorMessage?: boolean; trigger?: ValidateTriggerType }`<br/><br/>`type ValidateTriggerType = 'blur' \| 'change' \| 'submit' \| 'all'`<br/>
validateOnly | `(params?: Pick<FormValidateParams, 'fields' \| 'trigger'>)` | `Promise<FormValidateResult<FormData>>` | 必需。纯净的校验函数，仅返回校验结果，不对组件进行任何操作。泛型 `FormData` 表示表单数据 TS 类型。参数和返回值含义同 `validate` 方法


### FormItem Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
for | String | - | label 原生属性 | N
help | TNode | - | 表单项说明内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
initialData | String / Number / Object / Array | - | 表单初始数据，重置时所需初始数据。TS 类型：`InitialData` `type InitialData = any`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
label | TNode | '' | 字段标签名称。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
labelAlign | String | - | 表单字段标签对齐方式：左对齐、右对齐、顶部对齐。默认使用 Form 的对齐方式，优先级高于 Form.labelAlign。可选项：left/right/top | N
labelWidth | String / Number | - | 可以整体设置标签宽度，优先级高于 Form.labelWidth | N
name | String | - | 表单字段名称 | N
requiredMark | Boolean | undefined | 是否显示必填符号（*），优先级高于 Form.requiredMark | N
rules | Array | - | 表单字段校验规则。TS 类型：`Array<FormRule>` | N
shouldUpdate | Boolean / Function | false | TS 类型：`boolean \| ((prevValue, curValue) => boolean)` | N
showErrorMessage | Boolean | undefined | 校验不通过时，是否显示错误提示信息，优先级高于 `Form.showErrorMessage` | N
status | String | - | 校验状态，可在需要完全自主控制校验状态时使用。TS 类型：`'error' \| 'warning' \| 'success' \| 'validating'` | N
statusIcon | TNode | undefined | 校验状态图标，值为 `true` 显示默认图标，默认图标有 成功、失败、警告 等，不同的状态图标不同。`statusIcon` 值为 `false`，不显示图标。`statusIcon` 值类型为渲染函数，则可以自定义右侧状态图标。优先级高级 Form 的 statusIcon。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
successBorder | Boolean | false | 是否显示校验成功的边框，默认不显示 | N
tips | TNode | - | 自定义提示内容，样式跟随 `status` 变动，可在需要完全自主控制校验规则时使用。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/common.ts) | N
valueFormat | Function | - | 当用户交互产生数据变化时触发，用于格式化数据。TS 类型：`FormItemFormatType` `type FormItemFormatType = (value: any) => any`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N


### FormList Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
children | Function | - | 渲染函数。TS 类型：`(fields: FormListField[], operation: FormListFieldOperation) => React.ReactNode` `type FormListField = { key: number; name: number; isListField: boolean }` `type FormListFieldOperation = { add: (defaultValue?: any, insertIndex?: number) => void, remove: (index: number \| number[]) => void, move: (from: number, to: number) => void  }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
initialData | Array | - | 设置子元素默认值，如果与 FormItem 的 initialData 冲突则以 FormItem 为准。TS 类型：`Array<any>` | N
name | String / Number / Array | - | 表单字段名称。TS 类型：`NamePath` | N
rules | Object / Array | - | 表单字段校验规则。TS 类型：`{ [field in keyof FormData]: Array<FormRule> } \| Array<FormRule>` | N

### FormRule

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
boolean | Boolean | - | 内置校验方法，校验值类型是否为布尔类型，示例：`{ boolean: true, message: '数据类型必须是布尔类型' }` | N
date | Boolean / Object | - | 内置校验方法，校验值是否为日期格式，[参数文档](https://github.com/validatorjs/validator.js)，示例：`{ date: { delimiters: '-' }, message: '日期分隔线必须是短横线（-）' }`。TS 类型：`boolean \| IsDateOptions` `interface IsDateOptions { format: string; strictMode: boolean; delimiters: string[] }`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
email | Boolean / Object | - | 内置校验方法，校验值是否为邮件格式，[参数文档](https://github.com/validatorjs/validator.js)，示例：`{ email: { ignore_max_length: true }, message: '请输入正确的邮箱地址' }`。TS 类型：`boolean \| IsEmailOptions` `import { IsEmailOptions } from 'validator/es/lib/isEmail'`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
enum | Array | - | 内置校验方法，校验值是否属于枚举值中的值。示例：`{ enum: ['primary', 'info', 'warning'], message: '值只能是 primary/info/warning 中的一种' }`。TS 类型：`Array<string>` | N
idcard | Boolean | - | 内置校验方法，校验值是否为身份证号码，组件校验正则为 `/^(\\d{18,18}\|\\d{15,15}\|\\d{17,17}x)$/i`，示例：`{ idcard: true, message: '请输入正确的身份证号码' }` | N
len | Number / Boolean | - | 内置校验方法，校验值固定长度，如：len: 10 表示值的字符长度只能等于 10 ，中文表示 2 个字符，英文为 1 个字符。示例：`{ len: 10, message: '内容长度不对' }`。<br />如果希望字母和中文都是同样的长度，示例：`{ validator: (val) => val.length === 10, message: '内容文本长度只能是 10 个字' }` | N
max | Number / Boolean | - | 内置校验方法，校验值最大长度，如：max: 100 表示值最多不能超过 100 个字符，中文表示 2 个字符，英文为 1 个字符。示例：`{ max: 10, message: '内容超出' }`。<br />如果希望字母和中文都是同样的长度，示例：`{ validator: (val) => val.length <= 10, message: '内容文本长度不能超过 10 个字' }`<br />如果数据类型数字（Number），则自动变为数字大小的比对 | N
message | String | - | 校验未通过时呈现的错误信息，值为空则不显示 | N
min | Number / Boolean | - | 内置校验方法，校验值最小长度，如：min: 10 表示值最多不能少于 10 个字符，中文表示 2 个字符，英文为 1 个字符。示例：`{ min: 10, message: '内容长度不够' }`。<br />如果希望字母和中文都是同样的长度，示例：`{ validator: (val) => val.length >= 10, message: '内容文本长度至少为 10 个字' }`。<br />如果数据类型数字（Number），则自动变为数字大小的比对 | N
number | Boolean | - | 内置校验方法，校验值是否为数字（1.2 、 1e5  都算数字），示例：`{ number: true, message: '请输入数字' }` | N
pattern | Object | - | 内置校验方法，校验值是否符合正则表达式匹配结果，示例：`{ pattern: /@qq.com/, message: '请输入 QQ 邮箱' }`。TS 类型：`RegExp` | N
required | Boolean | - | 内置校验方法，校验值是否已经填写。该值为 true，默认显示必填标记，可通过设置 `requiredMark: false` 隐藏必填标记 | N
telnumber | Boolean | - | 内置校验方法，校验值是否为手机号码，校验正则为 `/^1[3-9]\d{9}$/`，示例：`{ telnumber: true, message: '请输入正确的手机号码' }` | N
trigger | String | change | 校验触发方式。TS 类型：`ValidateTriggerType` | N
type | String | error | 校验未通过时呈现的错误信息类型，有 告警信息提示 和 错误信息提示 等两种。可选项：error/warning | N
url | Boolean / Object | - | 内置校验方法，校验值是否为网络链接地址，[参数文档](https://github.com/validatorjs/validator.js)，示例：`{ url: { protocols: ['http','https','ftp'] }, message: '请输入正确的 Url 地址' }`。TS 类型：`boolean \| IsURLOptions` `import { IsURLOptions } from 'validator/es/lib/isURL'`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
validator | Function | - | 自定义校验规则，示例：`{ validator: (val) => val.length > 0, message: '请输入内容'}`。TS 类型：`CustomValidator` `type CustomValidator = (val: ValueType) => CustomValidateResolveType \| Promise<CustomValidateResolveType>` `type CustomValidateResolveType = boolean \| CustomValidateObj` `interface CustomValidateObj { result: boolean; message: string; type?: 'error' \| 'warning' \| 'success' }` `type ValueType = any`。[详细类型定义](https://github.com/Tencent/tdesign-react/blob/develop/packages/components/form/type.ts) | N
whitespace | Boolean | - | 内置校验方法，校验值是否为空格。示例：`{ whitespace: true, message: '值不能为空' }` | N

### FormErrorMessage

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
boolean | String | - | 布尔类型校验不通过时的表单项显示文案，全局配置默认是：`'${name}数据类型必须是布尔类型'` | N
date | String | - | 日期校验规则不通过时的表单项显示文案，全局配置默认是：`'请输入正确的${name}'` | N
enum | String | - | 枚举值校验规则不通过时的表单项显示文案，全局配置默认是：`${name}只能是${validate}等` | N
idcard | String | - | 身份证号码校验不通过时的表单项显示文案，全局配置默认是：`'请输入正确的${name}'` | N
len | String | - | 值长度校验不通过时的表单项显示文案，全局配置默认是：`'${name}字符长度必须是 ${validate}'` | N
max | String | - | 值的长度太长或值本身太大时，校验不通过的表单项显示文案，全局配置默认是：`'${name}字符长度不能超过 ${validate} 个字符，一个中文等于两个字符'` | N
min | String | - | 值的长度太短或值本身太小时，校验不通过的表单项显示文案，全局配置默认是：`'${name}字符长度不能少于 ${validate} 个字符，一个中文等于两个字符'` | N
number | String | - | 数字类型校验不通过时的表单项显示文案，全局配置默认是：`'${name}必须是数字'` | N
pattern | String | - | 正则表达式校验不通过时的表单项显示文案，全局配置默认是：`'请输入正确的${name}'` | N
required | String | - | 没有填写必填项时的表单项显示文案，全局配置默认是：`'${name}必填'` | N
telnumber | String | - | 手机号号码校验不通过时的表单项显示文案，全局配置默认是：`'请输入正确的${name}'` | N
url | String | - | 链接校验规则不通过时的表单项显示文案，全局配置默认是：`'请输入正确的${name}'` | N
validator | String | - | 自定义校验规则校验不通过时的表单项显示文案，全局配置默认是：'${name}不符合要求' | N
whitespace | String | - | 值为空格校验不通过时表单项显示文案，全局配置默认是：`'${name}不能为空` | N
