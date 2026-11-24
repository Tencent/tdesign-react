:: BASE_DOC ::

## API

### Form Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
colon | Boolean | false | \- | N
contentAlign | String | left | options: left/center/right | N
disabled | Boolean | undefined | \- | N
errorMessage | Object | - | Typescript: `FormErrorMessage` | N
form | Object | - | Typescript: `FormInstanceFunctions` | N
id | String | undefined |  native id attribute of the form，which supports being used in conjunction with non-form buttons through the form attribute to trigger form events | N
initialData | Object | - | \- | N
labelAlign | String | right | options: left/right/top | N
labelWidth | String / Number | '81px' | \- | N
preventSubmitDefault | Boolean | true | \- | N
readonly | Boolean | undefined | \- | N
requiredMark | Boolean | true | \- | N
requiredMarkPosition | String | left | Display position of required symbols. options: left/right | N
resetType | String | empty | options: empty/initial | N
rules | Object | - | Typescript: `FormRules<FormData>` `type FormRules<T extends Data = any> = { [field in keyof T]?: Array<FormRule> }`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
scrollToFirstError | String | - | options: ''/smooth/auto | N
showErrorMessage | Boolean | true | \- | N
submitWithWarningMessage | Boolean | false | \- | N
onReset | Function |  | Typescript: `(context: { e?: FormResetEvent }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
onSubmit | Function |  | Typescript: `(context: SubmitContext<FormData>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts). <br/>`interface SubmitContext<T extends Data = Data> { e?: FormSubmitEvent; validateResult: FormValidateResult<T>; firstError?: string; fields?: any }`<br/><br/>`type FormValidateResult<T> = boolean \| ValidateResultObj<T>`<br/><br/>`type ValidateResultObj<T> = { [key in keyof T]: boolean \| ValidateResultList }`<br/><br/>`type ValidateResultList = Array<AllValidateResult>`<br/><br/>`type AllValidateResult = CustomValidateObj \| ValidateResultType`<br/><br/>`interface ValidateResultType extends FormRule { result: boolean }`<br/><br/>`type ValidateResult<T> = { [key in keyof T]: boolean \| ErrorList }`<br/><br/>`type ErrorList = Array<FormRule>`<br/> | N
onValidate | Function |  | Typescript: `(result: ValidateResultContext<FormData>) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts). <br/>`type ValidateResultContext<T extends Data> = Omit<SubmitContext<T>, 'e'>`<br/> | N
onValuesChange | Function |  | Typescript: `(changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void`<br/> | N

### FormInstanceFunctions 组件实例方法

name | params | return | description
-- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
clearValidate | `(fields?: Array<keyof FormData>)` | \- | required
currentElement | \- | `HTMLFormElement` | \-
getCurrentElement | \- | `HTMLFormElement` | \-
getFieldsValue | `(nameList: string[] \| boolean)` | `getFieldsValue<FormData>` | required. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts). <br/>`interface getFieldsValue<T>{ (nameList: true): T; (nameList: any[]): Record<keyof T, unknown>;}`<br/>
getFieldValue | `(field: NamePath)` | `unknown` | required
getValidateMessage | `(fields?: Array<keyof FormData>)` | `Array<FormRule> \| void` | required
reset | `(params?: FormResetParams<FormData>)` | \- | required. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts). <br/>`interface FormResetParams<FormData> { type?: 'initial' \| 'empty'; fields?: Array<keyof FormData> }`<br/>
setFields | `(fields: FieldData[])` | \- | required. Typescript: `(fields: FieldData[]) => void` `interface FieldData { name: NamePath; value?: unknown, status?: string, validateMessage?: { type?: string, message?: string } }`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts)
setFieldsValue | `(field: Data)` | \- | required
setValidateMessage | `(message: FormValidateMessage<FormData>)` | \- | required. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts). <br/>`type FormValidateMessage<FormData> = { [field in keyof FormData]: FormItemValidateMessage[] }`<br/><br/>`interface FormItemValidateMessage { type: 'warning' \| 'error'; message: string }`<br/>
submit | `(params?: { showErrorMessage?: boolean })` | \- | required
validate | `(params?: FormValidateParams)` | `Promise<FormValidateResult<FormData>>` | required. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts). <br/>`interface FormValidateParams { fields?: Array<string>; showErrorMessage?: boolean; trigger?: ValidateTriggerType }`<br/><br/>`type ValidateTriggerType = 'blur' \| 'change' \| 'submit' \| 'all'`<br/>
validateOnly | `(params?: Pick<FormValidateParams, 'fields' \| 'trigger'>)` | `Promise<FormValidateResult<FormData>>` | required


### FormItem Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
arrow | Boolean | false | \- | N
contentAlign | String | - | options: left/center/right | N
for | String | - | \- | N
help | TNode | - | Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
initialData | String / Number / Object / Array | - | Typescript: `InitialData` `type InitialData = any`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
label | TNode | '' | Typescript: `string \| TNode`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
labelAlign | String | - | options: left/right/top | N
labelWidth | String / Number | - | \- | N
name | String / Number / Array | - | Typescript: `NamePath` `type NamePath = string \| number \| Array<string \| number>`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
requiredMark | Boolean | undefined | \- | N
rules | Array | - | Typescript: `Array<FormRule>` | N
shouldUpdate | Boolean / Function | false | Typescript: `boolean \| ((prevValue, curValue) => boolean)` | N
showErrorMessage | Boolean | undefined | \- | N

### FormRule

name | type | default | description | required
-- | -- | -- | -- | --
boolean | Boolean | - | \- | N
date | Boolean / Object | - | Typescript: `boolean \| IsDateOptions` `interface IsDateOptions { format: string; strictMode: boolean; delimiters: string[] }`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
email | Boolean / Object | - | Typescript: `boolean \| IsEmailOptions` `import { IsEmailOptions } from 'validator/es/lib/isEmail'`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
enum | Array | - | Typescript: `Array<string>` | N
idcard | Boolean | - | \- | N
len | Number / Boolean | - | \- | N
max | Number / Boolean | - | \- | N
message | String | - | \- | N
min | Number / Boolean | - | \- | N
number | Boolean | - | \- | N
pattern | String / Object | - | Typescript: `RegExp \| string` | N
required | Boolean | - | \- | N
telnumber | Boolean | - | \- | N
trigger | String | change | Typescript: `ValidateTriggerType` | N
type | String | error | options: error/warning | N
url | Boolean / Object | - | Typescript: `boolean \| IsURLOptions` `import { IsURLOptions } from 'validator/es/lib/isURL'`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
validator | Function | - | Typescript: `CustomValidator` `type CustomValidator = (val: ValueType, context?: { formData: Data , name: string }) => CustomValidateResolveType \| Promise<CustomValidateResolveType>` `type CustomValidateResolveType = boolean \| CustomValidateObj` `interface CustomValidateObj { result: boolean; message: string; type?: 'error' \| 'warning' \| 'success' }` `type ValueType = any`. [see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/form/type.ts) | N
whitespace | Boolean | - | \- | N

### FormErrorMessage

name | type | default | description | required
-- | -- | -- | -- | --
boolean | String | - | \- | N
date | String | - | \- | N
enum | String | - | \- | N
idcard | String | - | \- | N
len | String | - | \- | N
max | String | - | \- | N
min | String | - | \- | N
number | String | - | \- | N
pattern | String | - | \- | N
required | String | - | \- | N
telnumber | String | - | \- | N
url | String | - | \- | N
validator | String | - | \- | N
whitespace | String | - | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-form-item-arrow-align | center | -
--td-form-item-arrow-color | @text-color-placeholder | -
--td-form-item-arrow-size | 24px | -
--td-form-label-font | @font-body-large | -
