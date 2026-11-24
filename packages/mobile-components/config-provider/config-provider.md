:: BASE_DOC ::

## API

### ConfigProvider Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
globalConfig | Object | - | 全局配置。TS 类型：`GlobalConfigProvider` | N

### GlobalConfigProvider

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
actionSheet | Object | - | 动作面板全局配置。TS 类型：`ActionSheetConfig` | N
calendar | Object | - | 日历组件全局配置。TS 类型：`CalendarConfig` | N
cascader | Object | - | 级联选择器全局配置。TS 类型：`CascaderConfig` | N
classPrefix | String | t | CSS 类名前缀 | N
comment | Object | - | 评论组件全局配置。TS 类型：`CommentConfig` | N
dateTimePicker | Object | - | 时间选择器全局配置。TS 类型：`DateTimePickerConfig` | N
dropdownMenu | Object | - | 下拉菜单全局配置。TS 类型：`DropdownMenuConfig` | N
form | Object | - | 表单组件全局配置。TS 类型：`FormConfig` | N
guide | Object | - | 引导全局配置。TS 类型：`GuideConfig` | N
list | Object | - | 列表组件全局配置。TS 类型：`ListConfig` | N
picker | Object | - | 选择器全局配置。TS 类型：`PickerConfig` | N
pullDownRefresh | Object | - | 下拉刷新全局配置。TS 类型：`PullDownRefreshConfig` | N
qrcode | Object | - | 二维码全局配置。TS 类型：`QRCodeConfig` | N
rate | Object | - | 评分全局配置。TS 类型：`RateConfig` | N
tabBar | Object | - | 标签栏全局配置。TS 类型：`TabBarConfig` | N
table | Object | - | 表格组件全局配置。TS 类型：`TableConfig` | N
typography | Object | - | 排版组件全局配置。TS 类型：`TypographyConfig` | N
upload | Object | - | 上传组件全局配置。TS 类型：`UploadConfig` | N

### ActionSheetConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
cancel | String | - | 语言配置，“取消” 按钮描述文本 | N

### CalendarConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
confirm | String | - | 语言配置，“确定” 按钮描述文本 | N
monthTitle | String | - | 语言配置，日期月面板标题描述文本。示例：“{year} / {month}” | N
months | Array | - | 月文本描述，默认值：['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月']。TS 类型：`string[]` | N
title | String | - | 语言配置，组件标题“请选择日期”描述文本 | N
weekdays | Array | - | 星期文本描述，默认值：['日', '一', '二', '三', '四', '五', '六']。TS 类型：`string[]` | N

### CascaderConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
empty | String | - | 语言配置，“暂无数据”描述文本 | N
filterPlaceholder | String | - | 语言配置，“搜索框”占位描述文本 | N
placeholder | String | - | 语言配置，未选中时的提示文案“选择选项”描述文本 | N
title | String | - | 语言配置，组件标题“选择地址”描述文本 | N

### CommentConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
collapseText | String | - | 语言配置，“收起”描述文本 | N
collapsedText | String | - | 语言配置，折叠状态下“展开回复”描述文本 | N
expandMoreText | String | - | 语言配置，半展开状态下“展开更多回复”描述文本 | N

### DateTimePickerConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
cancel | String | - | 语言配置，“取消”按钮描述文本 | N
confirm | String | - | 语言配置，“确定”按钮描述文本 | N
dateLabel | String | - | 语言配置，“日” 描述文本 | N
format | String | 'YYYY-MM-DD HH:mm:ss' | 日期格式化规则 | N
hourLabel | String | - | 语言配置，“时” 描述文本 | N
minuteLabel | String | - | 语言配置，“分” 描述文本 | N
monthLabel | String | - | 语言配置，“月” 描述文本 | N
secondLabel | String | - | 语言配置，“秒” 描述文本 | N
title | String | - | 语言配置，组件标题“选择时间”描述文本 | N
yearLabel | String | - | 语言配置，“年” 描述文本 | N

### DropdownMenuConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
confirm | String | - | 语言配置，“确定” 按钮描述文本 | N
reset | String | - | 语言配置，“重置” 按钮描述文本 | N

### FormConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
colonText | String | - | 字段旁边的冒号，中文为“：” | N
errorMessage | Object | - | 表单错误信息配置，示例：`{ idcard: '请输入正确的身份证号码', max: '字符长度不能超过 ${max}' }`。TS 类型：`FormErrorMessage`，[Form API Documents](./form?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/config-provider/type.ts) | N
requiredMark | Boolean | true | 是否显示必填符号（*），默认显示 | N
requiredMarkPosition | String | left | 表单必填符号（*）显示位置。可选项：left/right | N

### GuideConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
back | String | - | 语言配置， “返回” 描述文本 | N
finish | String | - | 语言配置， “完成” 描述文本 | N
next | String | - | 语言配置， “下一步” 描述文本 | N
skip | String | - | 语言配置， “跳过” 描述文本 | N

### ImageConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
errorText | String | - | 图片加载失败显示的文本，中文默认为“图片无法显示” | N
loadingText | String | - | 图片加载中显示的文本，中文默认为“图片加载中” | N
replaceImageSrc | Function | - | 统一替换图片 `src` 地址，参数为组件的全部属性，返回值为新的图片地址。TS 类型：`(params: ImageProps) => string`，[Image API Documents](./image?tab=api)。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/config-provider/type.ts) | N

### InputConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
placeholder | String | - | 语言配置，“请输入”占位符描述文本 | N

### ListConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
loading | String | - | 语言配置，“加载中”描述文本 | N
loadingMoreText | String | - | 语言配置，'点击加载更多' 描述文本 | N
loosing | String | - | 语言配置，“释放即可刷新”描述文本 | N
pulling | String | - | 语言配置，“下拉即可刷新”描述文本 | N
success | String | - | 语言配置，“刷新成功”描述文本 | N

### PickerConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
cancel | String | - | 语言配置，“取消” 按钮描述文本 | N
confirm | String | - | 语言配置，“确认” 按钮描述文本 | N

### PullDownRefreshConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
loadingTexts | Array | - | 提示文本描述，默认值：['下拉刷新', '松手刷新', '正在刷新', '刷新完成']。TS 类型：`string[]` | N

### QRCodeConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
expiredText | String | - | 语言配置，“二维码过期”描述文本 | N
refreshText | String | - | 语言配置，“点击刷新”描述文本 | N
scannedText | String | - | 语言配置，“已扫描”描述文本 | N

### RateConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
noValueText | String | - | 语言配置，“未评分”描述文本 | N
valueText | String | - | 语言配置，评分值描述文本。示例：“{value} 分” | N

### TabBarConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
haveMoreNewsAriaLabel | String | - | 语言配置，“有n+条新的消息”描述文本。示例：“有 {value}+ 条消息” | N
haveNewsAriaLabel | String | - | 语言配置，“有n条新的消息”描述文本。示例：“有 {value} 条消息” | N
moreNewsAriaLabel | String | - | 语言配置，“有很多消息”描述文本 | N
newsAriaLabel | String | - | 语言配置，“有新的消息”描述文本 | N

### TableConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
clearFilterResultButtonText | String | - | 语言配置，过滤功能中，“清空筛选” 描述文本 | N
confirmText | String | - | 语言配置，“确认” 描述文本 | N
empty | TNode | - | 语言配置，“暂无数据” 描述文本。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
filterIcon | TElement | undefined | 过滤图标，如果没有配置，会使用组件内置的默认图标。TS 类型：`TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
hideSortTips | Boolean | false | 隐藏排序文本提示 | N
loadingText | String | - | 语言配置，“正在加载中，请稍后” 描述文本 | N
resetText | String | - | 语言配置，“重置” 描述文本 | N
searchResultText | String | - | 语言配置，过滤功能中，过滤条件和结果描述文本，示例：'搜索“{result}”，找到 {count} 条结果' | N

### TypographyConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
collapseText | String | - | 语言配置，“收起”描述文本 | N
copiedText | String | - | 语言配置，“复制成功”描述文本 | N
expandText | String | - | 语言配置，“展开”描述文本 | N

### UploadConfig

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
progress | Object | - | 语言配置，上传进度相关。示例：{ uploadText: '上传中', waitingText: '待上传', 'failText': '上传失败', successText: '上传成功' }。TS 类型：`UploadConfigProgress` | N

### UploadConfigProgress

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
failText | String | - | 语言配置，“上传失败”文本描述 | N
successText | String | - | 语言配置，“上传成功”文本描述 | N
uploadingText | String | - | 语言配置，“上传中”文本描述 | N
waitingText | String | - | 语言配置，“待上传”文本描述 | N
