
### Upload Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
accept | String | - | 接受上传的文件类型，[查看 W3C示例](https://www.w3schools.com/tags/att_input_accept.asp)，[查看 MDN 示例](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/file) | N
action | String | - | 上传接口 | N
autoUpload | Boolean | true | 是否选取文件后自动上传 | N
beforeUpload | Function | - | 上传文件之前的钩子，参数为上传的文件，返回值决定是否上传。TS 类型：`(file: File | UploadFile) => boolean | Promise<boolean>` | N
children | TNode | - | 触发上传的内容，同 trigger。TS 类型：`string | TNode`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts) | N
data | Object | - | 上传文件时所需的额外数据。TS 类型：`Record<string, any> | ((file: File) => Record<string, any>)` | N
disabled | Boolean | false | 是否禁用 | N
draggable | Boolean | false | 是否启用拖拽上传 | N
files | Array | - | 已上传文件列表。TS 类型：`Array<UploadFile>` | N
defaultFiles | Array | - | 已上传文件列表。非受控属性。TS 类型：`Array<UploadFile>` | N
format | Function | - | 文件上传前转换文件数据。TS 类型：`(file: File) => UploadFile` | N
formatResponse | Function | - | 用于格式化文件上传后的响应数据。error 用于显示错误提示；url 用于上传文件/图片地址。TS 类型：`(response: any) => ResponseType `。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/upload/index.ts) | N
headers | Object | - | 设置上传的请求头部。TS 类型：`{[key: string]: string}` | N
max | Number | 0 | 用于控制文件上传数量，值为 0 则不限制 | N
method | String | POST | 上传接口方法。可选项：POST/GET/PUT/OPTION | N
multiple | Boolean | false | 是否支持多选文件 | N
name | String | 'file' | 文件上传时的名称 | N
placeholder | String | - | 占位符 | N
sizeLimit | Number | - | 图片文件大小限制，单位 Byte | N
theme | String | file | 组件风格。custom 表示完全自定义风格；file 表示默认文件上传风格；file-input 表示输入框形式的文件上传；file-flow 表示文件批量上传；image 表示默认图片上传风格；image-flow 表示图片批量上传。可选项：custom/file/file-input/file-flow/image/image-flow | N
tips | String | - | 小文本提示 | N
trigger | TNode | - | 触发上传的内容。TS 类型：`string | TNode<TriggerContext>`。[通用类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/common.ts)。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/upload/index.ts) | N
withCredentials | Boolean | false | 上传请求时是否携带 cookie | N
onChange | Function |  | 已上传文件列表发生变化时触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/upload/index.ts)。`(value: Array<UploadFile>, context: UploadChangeContext) => {}` | N
onDragenter | Function |  | 进入拖拽区域时触发。`(context: { e: DragEvent }) => {}` | N
onDragleave | Function |  | 拖拽结束时触发。`(context: { e: DragEvent }) => {}` | N
onFail | Function |  | 上传失败后触发。`(options: { e: ProgressEvent; file: UploadFile }) => {}` | N
onPreview | Function |  | 点击预览时触发。`(options: { file: UploadFile; e: MouseEvent }) => {}` | N
onProgress | Function |  | 上传进度变化时触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/upload/index.ts)。`(options: ProgressContext) => {}` | N
onRemove | Function |  | 移除文件时触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/upload/index.ts)。`(context: UploadRemoveContext) => {}` | N
onSuccess | Function |  | 上传成功后触发。[详细类型定义](https://github.com/TDesignOteam/tdesign-react/blob/main/src/_type/components/upload/index.ts)。`(context: SuccessContext) => {}` | N


### UploadFile
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
lastModified | Number | - | 必需。上一次变更的时间 | Y
name | String | - | 必需。文件名称 | Y
percent | Number | - | 下载进度 | N
raw | Object | - | 原始文件对象。TS 类型：`File` | N
response | Object | - | 上传接口返回的数据 | N
size | Number | - | 必需。文件大小 | Y
status | String | - | 文件上传状态：上传成功，上传失败，上传中，等待上传。TS 类型：` 'success' | 'fail' | 'progress' | 'waiting'` | N
type | String | - | 必需。文件类型 | Y
url | String | - | 文件上传成功后的下载/访问地址 | N
File | - | - | 继承 `File` 中的全部 API | N
