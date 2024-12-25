---
title: 更新日志
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.10.4 `2024-12-25` 
### 🚀 Features
- `Tree`:  支持 `onScroll` API，用于处理滚动事件回调 @HaixingOoO ([#3295](https://github.com/Tencent/tdesign-react/pull/3295))
- `Tooltip`: tooltip-lite 的`mouse` 模式下优化为完全跟随鼠标位置，更符合 API 描述 @moecasts ([#3267](https://github.com/Tencent/tdesign-react/pull/3267))
### 🐞 Bug Fixes
- `Select`: 修复全选默认返回值错误的问题 @uyarn ([#3298](https://github.com/Tencent/tdesign-react/pull/3298))
- `Upload`: 优化部分尺寸上传组件图片展示的样式问题 @huangchen1031 ([#3290](https://github.com/Tencent/tdesign-react/pull/3290))
### 📝 Documentation
- `Stackblitz`: 调整`Stackblitz`示例的启动方式，并修复部分示例无法使用`stackblitz`或`codesandbox`运行的问题 @uyarn ([#3297](https://github.com/Tencent/tdesign-react/pull/3297))



## 🌈 1.10.2 `2024-12-19`

### 🚀 Features

- `Alert`: 在 `maxLine >= message` 数组长度的情况下，不再展示 `展开更多/收起` 的按钮 @miownag ([#3281](https://github.com/Tencent/tdesign-react/pull/3281))
- `ConfigProvider`: `attach` 属性支持配置 `drawer` 组件，支持全局配置`drawer`的挂载位置 @HaixingOoO ([#3272](https://github.com/Tencent/tdesign-react/pull/3272))
- `DatePicker`: 多选模式支持周选择和年选择的场景 @HaixingOoO @uyarn  ([#3264](https://github.com/Tencent/tdesign-react/pull/3264))
- `Form`: 新增`supportNumberKey` API，支持在`1.9.3`版本后不支持数字键值的场景使用，若不需要支持数字类型作为表单键值请关闭此 API @uyarn ([#3277](https://github.com/Tencent/tdesign-react/pull/3277))
- `Radio`: 新增 `Radio` 及 `RadioGroup` 的 `reaonly`属性的支持 @liweijie0812 ([#3280](https://github.com/Tencent/tdesign-react/pull/3280))
- `Tree`: 实例新增 `setIndeterminate` 方法，支持手动设置半选的功能 @uyarn ([#3261](https://github.com/Tencent/tdesign-react/pull/3261))
- `label`: `DatePicker`、`TimePicker`、`RangeInput`支持`label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))

### 🐞 Bug Fixes

- `DateRangePicker`: 修复日期区间选择器在跨年的场景下的展示异常问题 @huangchen1031 ([#3275](https://github.com/Tencent/tdesign-react/pull/3275))
- `Menu`: 优化菜单项点击事件的绑定问题避免边界触发异常的问题 @huangchen1031 ([#3241](https://github.com/Tencent/tdesign-react/pull/3241))
- `ImageViewer`: 修复不受控时，`visable`改变时都会触发`onClose`的问题 @HaixingOoO ([#3244](https://github.com/Tencent/tdesign-react/pull/3244))
- `CheckboxGroup`: 修复复选框组的子元素不是复选框导致的问题 @HaixingOoO ([#3253](https://github.com/Tencent/tdesign-react/pull/3253))
- `Form`: 修复`1.9.3`版本后，多级表单字段使用 `setFieldValues` 功能异常的问题 @l123wx ([#3279](https://github.com/Tencent/tdesign-react/pull/3279))
- `Form`: 修复当规则为中涉及 `0` 判断时，验证不生效的问题 @RSS1102 ([#3283](https://github.com/Tencent/tdesign-react/pull/3283))
- `Select`: 修复 `valueType` 为 `object`选中全选的展示异常及回调参数缺少的问题 @uyarn ([#3287](https://github.com/Tencent/tdesign-react/pull/3287))
- `SelectInput`: 修复没有 `label` 都会渲染节点导致垂直对齐的问题 @huangchen1031 ([#3278](https://github.com/Tencent/tdesign-react/pull/3278))
- `TextArea`: 优化 `TextArea` 初始化时 `autosize` 下计算高度的逻辑 @HaixingOoO ([#3286](https://github.com/Tencent/tdesign-react/pull/3286))

### 🚧 Others
- `Alert`: 优化测试用例代码类型和添加对于 `className`、`style` 的测试 @RSS1102 ([#3284](https://github.com/Tencent/tdesign-react/pull/3284))




## 🌈 1.10.1 `2024-11-28` 
### 🚀 Features
- `DatePicker`: 新增`multiple` API，用于支持日期选择器多选功能，具体使用请参考示例 @HaixingOoO ([#3199](https://github.com/Tencent/tdesign-react/pull/3199))
- `DatePicker`: 新增`disableTime` API，用于更方便地设置禁用时间部分 @HaixingOoO ([#3226](https://github.com/Tencent/tdesign-react/pull/3226))
- `Dialog`: 新增 `beforeClose` 和 `beforeOpen` API，用于在打开和关闭弹窗时执行更多回调操作 @Wesley-0808  ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
- `Drawer`: 新增 `beforeClose` 和 `beforeOpen` API，用于在打开和关闭抽屉时执行更多回调操作 @Wesley-0808  ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
### 🐞 Bug Fixes

- `ColorPicker`: 修复 `colorMode` 部分文案没有支持国际化的问题 @l123wx ([#3221](https://github.com/Tencent/tdesign-react/pull/3221))
- `Form`: 修复`setFieldsValue`和`setFields` 没有触发`onValuesChange`的问题 @uyarn ([#3232](https://github.com/Tencent/tdesign-react/pull/3232))
- `Notification`: 修改 `NotificationPlugin` 的 `offset` 属性默认值，使其更符合常规习惯 @huangchen1031  ([#3231](https://github.com/Tencent/tdesign-react/pull/3231))
- `Select`: 修复 `collapsedItems`  的参数  `collapsedSelectedItems` 的错误 @RSS1102 ([#3214](https://github.com/Tencent/tdesign-react/pull/3214))
- `Select`: 修复多选下拉框全选功能失效的问题 @huangchen1031 ([#3216](https://github.com/Tencent/tdesign-react/pull/3216))
- `Table`: 修复可过滤表格在处理`null`类型的异常问题 @2ue ([#3197](https://github.com/Tencent/tdesign-react/pull/3197))
- `Table`: 修复单元格为数字 0 且开启省略时渲染异常的问题 @uyarn ([#3233](https://github.com/Tencent/tdesign-react/pull/3233))
- `Tree`: 修复`scrollTo`方法滚动的异常行为 @uyarn ([#3235](https://github.com/Tencent/tdesign-react/pull/3235))
### 📝 Documentation
- `Dialog`: 修复代码示例的错误 @RSS1102 ([#3229](https://github.com/Tencent/tdesign-react/pull/3229))
### 🚧 Others
- `TextArea`: 优化 `TextArea` 事件类型 @HaixingOoO ([#3211](https://github.com/Tencent/tdesign-react/pull/3211))

## 🌈 1.10.0 `2024-11-15` 
### 🚀 Features
- `Select`: `collapsedItems` 方法的参数 `collapsedSelectedItems` 扩充为 `options`，使用`collapsedItems`请注意此变更 @RSS1102 ([#3185](https://github.com/Tencent/tdesign-react/pull/3185))
- `Icon`: 图标库发布 `0.4.0`版本，新增 907 个新图标；命名优化`blockchain` 重命名改为`transform-1`,`gesture-pray-1`重命名为`gesture-open`,`gesture-ranslation-1`重命名为`wave-bye`, `gesture-up-1`重命名为`gesture-typing`,`gesture-up-2`重命名为`gesture-right-slip`,`logo-wechat`重命名为`logo-wechat-stroke-filled`，移除`tree-list`、`logo-adobe-photoshop-1` 等错误图标 @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Cascader`: 单选模式下当`trigger`为`hover`时，选中选项后自动关闭面板 @uyarn ([#3188](https://github.com/Tencent/tdesign-react/pull/3188))
- `Checkbox`: 新增 `title` API, 用于在选项展示禁用原因等场景 @uyarn ([#3207](https://github.com/Tencent/tdesign-react/pull/3207))
- `Menu`: 新增`tooltipProps` API，作用于一级菜单收起聚焦出现的节点 @uyarn ([#3201](https://github.com/Tencent/tdesign-react/pull/3201))
- `Switch`: 新增 `before-change` API @centuryPark ([#3167](https://github.com/Tencent/tdesign-react/pull/3167))
- `Form`: 新增 `getValidateMessage` 实例方法 @moecasts ([#3180](https://github.com/Tencent/tdesign-react/pull/3180))

### 🐞 Bug Fixes
- `TagInput`: 修复在`readonly`模式下仍可以通过Backspace按键删除已选项的缺陷 @RSS1102 ([#3172](https://github.com/Tencent/tdesign-react/pull/3172))
- `Form`: 修复`1.9.3`版本 `FormItem` 在`Form`外设置了`name`属性有异常的问题 @l123wx ([#3183](https://github.com/Tencent/tdesign-react/pull/3183))
- `Select`: 修复 valueType 为 object 时，点击全选按钮后 onChange 回调参数类型错误的问题 @l123wx ([#3193](https://github.com/Tencent/tdesign-react/pull/3193))
- `Table`: 修复动态设置`expandTreeNode`没有正常展示子节点的问题 @uyarn ([#3202](https://github.com/Tencent/tdesign-react/pull/3202))
- `Tree`: 修复动态切换`expandAll`的功能异常问题 @uyarn ([#3204](https://github.com/Tencent/tdesign-react/pull/3204))
- `Drawer`: 修复无法自定义`confirmBtn` 和 `closeBtn`内容的问题 @RSS1102 ([#3191](https://github.com/Tencent/tdesign-react/pull/3191))
### 📝 Documentation
- `Icon`: 优化图标检索功能，支持中英文搜索图标 @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Popup`: 新增`popperOption`使用示例 @HaixingOoO  ([#3200](https://github.com/Tencent/tdesign-react/pull/3200))


## 🌈 1.9.3 `2024-10-31` 
### 🐞 Bug Fixes
- `Select`: 修复`valueDisplay`下的`onClose`回调问题 @uyarn ([#3154](https://github.com/Tencent/tdesign-react/pull/3154))
- `Typography`: 修复 `Typography` 的`Ellipsis` 功能在中文下的问题 @HaixingOoO ([#3158](https://github.com/Tencent/tdesign-react/pull/3158))
- `Form`: 修复 `FormList` 或 `FormItem` 数据中的 `getFieldsValue` 问题 @HaixingOoO ([#3149](https://github.com/Tencent/tdesign-react/pull/3149))
- `Form`: 修复动态渲染表单无法使用 `setFieldsValue` 预设数据的问题 @l123wx ([#3145](https://github.com/Tencent/tdesign-react/pull/3145))
- `lib`: 修复`1.9.2`升级依赖改动导致`lib`错误携带`style`导致在`next`下不可用的异常 @honkinglin ([#3165](https://github.com/Tencent/tdesign-react/pull/3165))



## 🌈 1.9.2 `2024-10-17` 
### 🚀 Features
- `TimePicker`: 新增 `autoSwap` API，支持`1.9.0` 版本之后仍可以保持选定的左右侧时间大小顺序 @uyarn ([#3146](https://github.com/Tencent/tdesign-react/pull/3146))
### 🐞 Bug Fixes
- `Tabs`: 修复`TabPanel` 的`label`改变时，激活的选项卡底部横线没更新 @HaixingOoO ([#3134](https://github.com/Tencent/tdesign-react/pull/3134))
- `Drawer`: 修复打开 `drawer` 时页面抖动的问题 @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Dialog`: 修复打开 `dialog` 时页面抖动的问题 @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Select`: 修复使用 `OptionGroup `时无法自动定位到选中项问题 @moecasts ([#3139](https://github.com/Tencent/tdesign-react/pull/3139))
### 🚧 Others
- `Loading`: 优化 live demo 展示效果 @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))
- `DatePicker`: 移除文档中错误的`value` 类型描述 @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))

## 🌈 1.9.1 `2024-09-26` 
### 🚀 Features
- `ImageViewer`: 优化图片预览旋转的重置效果 @sylsaint ([#3108](https://github.com/Tencent/tdesign-react/pull/3108))
- `Table`: 可展开收起场景下新增 `t-table__row--expanded` 和 `t-table__row--folded` 用于区分展开和收起的行 @uyarn ([#3099](https://github.com/Tencent/tdesign-react/pull/3099))
- `TimePicker`: 支持时间区间选择器自动调整左右区间 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Rate`: 新增`clearable` API，用于清空评分 @HaixingOoO ([#3114](https://github.com/Tencent/tdesign-react/pull/3114))
### 🐞 Bug Fixes
- `Dropdown`: 修复设置`panelTopContent`后子菜单`top`计算错误的问题 @moecasts ([#3106](https://github.com/Tencent/tdesign-react/pull/3106))
- `TreeSelect`: 修改多选状态下默认点击父节点选项的行为为选中，如果需要点击展开，请配置`treeProps.expandOnClickNode` @HaixingOoO ([#3111](https://github.com/Tencent/tdesign-react/pull/3111))
- `Menu`: 修复二级菜单展开收起状态没有关联右侧箭头变化的问题 @uyarn ([#3110](https://github.com/Tencent/tdesign-react/pull/3110))
- `DateRangePicker`: 修复日期区间选择器配置时间相关格式时，没有正确处理`defaultTime`的问题 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `DatePicker`: 修复周选择器下，年份边界日期返回格式错误的问题 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `ColorPicker`: 修复部分场景下子组件存在重复渲染的异常问题 @uyarn ([#3118](https://github.com/Tencent/tdesign-react/pull/3118))
- `ColorPicker`: 修复渐变模式下，明度滑块和渐变滑块颜色不联动的问题 @huangchen1031  ([#3109](https://github.com/Tencent/tdesign-react/pull/3109))
### 🚧 Others
- `Site`: 站点切换语言时组件跟随切换语言 @RSS1102 ([#3100](https://github.com/Tencent/tdesign-react/pull/3100))
- `Form`: 新增自定义表单控件的文档说明和示例 @miownag  ([#3112](https://github.com/Tencent/tdesign-react/pull/3112))

## 🌈 1.9.0 `2024-09-12` 

### 🚀 Features

- `Tag`: 修改 `maxWidth`生效的 DOM 节点，方便控制文本内容长度，有基于此特性修改样式的请注意此变更 @liweijie0812 ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `Form`: 修复 `name` 使用下划线拼接的导致使用下划线做 `name` 的计算错误，有使用特殊字符做表单项的`name`的请注意此变更 @HaixingOoO ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
- `Card`: `loading`属性增加 `TNode`支持 @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Cascader`: 新增`panelTopContent`和`panelBottomContent`，用于自定应该面板顶部和底部内容 @HaixingOoO ([#3096](https://github.com/Tencent/tdesign-react/pull/3096))
- `Checkbox`: 修复 `readonly` 下的样式问题 @HaixingOoO ([#3077](https://github.com/Tencent/tdesign-react/pull/3077))
- `Form`: 添加 `whitespace` 校验默认错误信息 @liweijie0812 ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
- `Form`: 支持原生的`id`属性，用于配合`Button`原生`Form`属性实现表单提交的功能 @HaixingOoO ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Tag`: 新增支持`title` api，支持自定义`title`配置 @HaixingOoO ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `Tree`: 新增 `allowDrop` API，用于限制拖拽的场景使用 @uyarn ([#3098](https://github.com/Tencent/tdesign-react/pull/3098))

### 🐞 Bug Fixes

- `Card`: 修复`loading` 切换状态会导致子节点重新渲染的问题 @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Dialog`: 修复`Header`为`null`，配置`closeBtn`仍然渲染`Header`的问题 @HaixingOoO ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Input`: 修复计算`emoji`字符错误的问题 @novlan1 ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Popup`: 修复`1.8.0`版本后针对`Popup`的优化导致 16.x 版本下的异常问题 @moecasts ([#3091](https://github.com/Tencent/tdesign-react/pull/3091))
- `Statistic`: 修复`Statistic`组件 `classname` 和 `style` 未透传功能异常的问题 @liweijie0812 ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TimePicker`: 修复 `format` 仅支持 HH:mm:ss 格式的问题 @liweijie0812 ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))


## 🌈 1.8.1 `2024-08-23` 
### 🐞 Bug Fixes
- `Select`: 修复自定义`content`时的渲染的问题 @uyarn ([#3058](https://github.com/Tencent/tdesign-react/pull/3058))
- `Rate`: 修复`1.8.0` 版本中评分描述不显示的问题 @liweijie0812 ([#3060](https://github.com/Tencent/tdesign-react/pull/3060))
- `Popup`: 修复`panel` 为 null 场景下的部分事件回调缺失和错误的问题 @uyarn ([#3061](https://github.com/Tencent/tdesign-react/pull/3061))

## 🌈 1.8.0 `2024-08-22` 
### 🚀 Features
- `Empty`: 新增 `Empty` 空状态组件 @ZWkang @HaixingOoO @double-deng ([#2817](https://github.com/Tencent/tdesign-react/pull/2817))
- `ConfigProvider`: 支持 `colonText` 属性配置 `Description`、`Form` 组件的 `colon` 属性 @liweijie0812 ([#3055](https://github.com/Tencent/tdesign-react/pull/3055))

### 🐞 Bug Fixes
- `ColorPicker`: 修复 `slider` 部分在鼠标移入移出的缺陷 @Jippp ([#3042](https://github.com/Tencent/tdesign-react/pull/3042))
- `useVirtualScroll`: 修改 `visibleData` 计算方式，解决可视区域过高时，滚动后底部留白的问题 @huangchen1031 ([#2999](https://github.com/Tencent/tdesign-react/pull/2999))
- `Table`: 修复拖拽排序时，祖先节点内的顺序错误的问题 @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `InputNumber`: 修复小数点精度计算，以 0 开头的计算边界逻辑缺失导致计算错误的问题 @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Popup`: 修复 `popup` 某些场景下，隐藏时定位会闪烁的问题 @HaixingOoO ([#3052](https://github.com/Tencent/tdesign-react/pull/3052))

### 🚧 Others
- `Popup`: 修复官网`Popup`的位置展示问题 @HaixingOoO ([#3048](https://github.com/Tencent/tdesign-react/pull/3048))
- `DatePicker`: 修复 presets 示例代码错误的问题 @uyarn ([#3050](https://github.com/Tencent/tdesign-react/pull/3050))

## 🌈 1.7.9 `2024-08-07` 
### 🐞 Bug Fixes
- `Tree`:  修复`1.7.8`版本更新导致的展开收起功能的缺陷 @HaixingOoO ([#3039](https://github.com/Tencent/tdesign-react/pull/3039))


## 🌈 1.7.8 `2024-08-01` 
### 🚀 Features
- `ConfigProvider`: 新增 `attach` API， 支持全局配置attach或全局配置部分组件的attach @HaixingOoO ([#3001](https://github.com/Tencent/tdesign-react/pull/3001))
- `DatePicker`: 新增 `needConfirm` API，支持日期时间选择器不需要点击确认按钮保存选择时间 @HaixingOoO ([#3011](https://github.com/Tencent/tdesign-react/pull/3011))
- `borderless`: `RangeInput` `DateRangePicker`  `TimeRangePicker` 支持无边框模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Description`: layout 类型定义调整为字符串多类型 @liweijie0812 ([#3021](https://github.com/Tencent/tdesign-react/pull/3021))
- `Rate`: 评分组件支持国际化配置 @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
### 🐞 Bug Fixes
- `Upload`: 修复部分图标不支持全局替换的问题 @uyarn ([#3009](https://github.com/Tencent/tdesign-react/pull/3009))
- `Select`: 修复 `Select` 的 `label` 和 `prefixIcon` 的多选状态下的显示问题 @HaixingOoO ([#3019](https://github.com/Tencent/tdesign-react/pull/3019))
- `Tree`: 修复部分场景下首个子节点设置 `checked` 后导致整个树初始化状态异常的问题 @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
- `Dropdown`: 修复`DropdownItem`的禁用状态影响子组件本身响应行为的缺陷 @uyarn ([#3024](https://github.com/Tencent/tdesign-react/pull/3024))
- `TagInput`: `onDragSort` 中使用 `useRef` 导致的上下文错误 @Heising ([#3003](https://github.com/Tencent/tdesign-react/pull/3003))
### 🚧 Others
- `Dialog`: 修复`Dialog`的位置示例错误问题 @novlan1 ([#3005](https://github.com/Tencent/tdesign-react/pull/3005))
- `RangeInput`: 增加`liveDemo` @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))

## 🌈 1.7.7 `2024-07-18` 
### 🚀 Features
- `Icon`: 新增有序列表图标 `list-numbered`，优化`lock-off`的绘制路径 @
DOUBLE-DENG ([icon#9f4acfd](https://github.com/Tencent/tdesign-icons/commit/9f4acfdda58f84f9bca71a22f033e27127dd26db))
- `Breadcrumb`: `BreadcrumbItem`增加`tooltipProps`扩展，方便定制内置的`tooltip`的相关属性 @carolin913 ([#2990](https://github.com/Tencent/tdesign-react/pull/2990))
- `Imageviewer`: 新增 `attach` API，支持自定义 ImageViewer 的挂载节点 @HaixingOoO ([#2995](https://github.com/Tencent/tdesign-react/pull/2995))
- `Drawer`: 新增 `onSizeDragEnd` API，用于需要拖拽缩放回调的场景 @NWYLZW ([#2975](https://github.com/Tencent/tdesign-react/pull/2975))

### 🐞 Bug Fixes
- `Icon`: 修复图标`chart-column`的命名错误问题 @uyarn ([#2979](https://github.com/Tencent/tdesign-react/pull/2979))
- `Input`: 修复禁用状态下仍可以切换明文密文的问题 @uyarn ([#2991](https://github.com/Tencent/tdesign-react/pull/2991))
- `Table`: @uyarn 
    - 修复只存在一列可拖拽的表格缩小时的样式异常问题 ([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
    - 修复部分场景下向前缩放时的报错的问题([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
    - 修复空数据下展示内容没有居中展示的问题 ([#2996](https://github.com/Tencent/tdesign-react/pull/2996))
### 🚧 Others
- docs(Checkbox): 优化`Checkbox`文档内容 @Heising  ([common#1835](https://github.com/Tencent/tdesign-common/pull/1835))


## 🌈 1.7.6 `2024-06-27` 
### 🚀 Features
- `Tabs`: 支持通过滚轮或者触摸板进行滚动操作，新增 `scrollPosition` API，支持配置选中滑块滚动最终停留位置 @oljc ([#2954](https://github.com/Tencent/tdesign-react/pull/2954))
- `ImageViewer`: 新增 `isSvg` 属性，支持原生 `SVG` 预览显示，用于对 `SVG` 进行操作的场景 @HaixingOoO ([#2958](https://github.com/Tencent/tdesign-react/pull/2958))
- `Input`: 新增 `spellCheck` API @NWYLZW ([#2941](https://github.com/Tencent/tdesign-react/pull/2941))

### 🐞 Bug Fixes
- `DatePicker`: 修复单独使用 `DateRangePickerPanel` 面板头部点击逻辑与 `DateRangePicker` 不一致的问题 @uyarn ([#2944](https://github.com/Tencent/tdesign-react/pull/2944))
- `Form`: 修复嵌套 `FormList` 场景下使用 `shouldUpdate` 导致循环渲染的问题 @moecasts ([#2948](https://github.com/Tencent/tdesign-react/pull/2948))
- `Tabs`: 修复 `1.7.4` 版本后，`Tabs` 的 className 影响 `TabItem` 的问题 @uyarn ([#2946](https://github.com/Tencent/tdesign-react/pull/2946))
- `Table`: 修复 `usePagination` 中 `pagination` 动态变化的功能问题 @HaixingOoO ([#2960](https://github.com/Tencent/tdesign-react/pull/2960))
- `Table`: 修复鼠标右键表格也可以触发列宽拖拽的问题 @HaixingOoO ([#2961](https://github.com/Tencent/tdesign-react/pull/2961))
- `Table`: 修复只存在一列可被 resize 的使用场景下，拖拽功能异常的问题 @uyarn ([#2959](https://github.com/Tencent/tdesign-react/pull/2959))

### 🚧 Others
- 站点全量新增 TypeScript 示例代码 @uyarn @HaixingOoO @ZWkang  ([#2871](https://github.com/Tencent/tdesign-react/pull/2871))


## 🌈 1.7.5 `2024-05-31` 
### 🐞 Bug Fixes
- `DatePicker`: 修复点击`jump`按钮的逻辑没有同步下拉选择的改动的缺陷 @uyarn ([#2934](https://github.com/Tencent/tdesign-react/pull/2934))

## 🌈 1.7.4 `2024-05-30` 
### 🚀 Features
- `DatePicker`: 优化日期区间选择器头部区间的变化逻辑，选择后左侧区间大于右侧区间，则默认调整为左侧区间始终比右侧区间小 1 @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
### 🐞 Bug Fixes
- `Cascader`: 修复 `Cascader` 搜索时 `checkStrictly` 模式父节点不显示 @HaixingOoO ([#2914](https://github.com/Tencent/tdesign-react/pull/2914))
- `Select`: 修复半选状态的全选选项展示样式问题 @uyarn ([#2915](https://github.com/Tencent/tdesign-react/pull/2915))
- `Menu`: 修复`HeadMenu`下`MenuItem` 类名透传失效的问题 @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Tabs`: 修复`TabPanel` 类名透传失效的问题 @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Breadcrumb`: 修复暗色模式下的分隔符不可见问题 @NWYLZW ([#2920](https://github.com/Tencent/tdesign-react/pull/2920))
- `Checkbox`:
   - 修复无法渲染为值为 0 的选项 @NWYLZW ([#2925](https://github.com/Tencent/tdesign-react/pull/2925))
   - 修复受控状态无法被 onChange 回调中正确消费的问题 @NWYLZW ([#2926](https://github.com/Tencent/tdesign-react/pull/2926))
- `SelectInput`: 修复`SelectInput` 的 `interface.d.ts` 文件缺少 `size` 类型的问题 @HaixingOoO ([#2930](https://github.com/Tencent/tdesign-react/pull/2930))
- `DatePicker`: 
   - 修复单独使用面板没有兼容无 `onMonthChange` 回调的场景的问题 @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
  - 修复DateRangePickerPanel组件，在下拉框中选择年/月时选择出现日期改变错乱的问题 @liyucang-git ([#2922](https://github.com/Tencent/tdesign-react/pull/2922))
- `InputNumber`: 修复 `allowInputOverLimit=false` 大小值判断时，value 为 undefined 时，会出现显示 Infinity 的问题 @HaixingOoO ([common#1802](https://github.com/Tencent/tdesign-common/pull/1802))

## 🌈 1.7.3 `2024-05-18` 
### 🐞 Bug Fixes
- `Menu`: 修复二级及以下 `SubMenu`没有处理classname的缺陷 @uyarn ([#2911](https://github.com/Tencent/tdesign-react/pull/2911))
- `Upload`: 修复手动上传的bug @HaixingOoO ([#2912](https://github.com/Tencent/tdesign-react/pull/2912))
- `Avatar`: 修复配合Popup使用浮层不展示的异常 @uyarn

## 🌈 1.7.1 `2024-05-16`

### 🚀 Features

- `Avatar`: 新增`Click`、`Hover`和`Contextmenu`等鼠标事件，支持对头像操作的场景使用 @NWYLZW ([#2906](https://github.com/Tencent/tdesign-react/pull/2906))
- `Dialog`: 支持 `setConfirmLoading` 的使用 @ZWkang ([#2883](https://github.com/Tencent/tdesign-react/pull/2883))
- `SelectInput`: `SelectInput` 支持 `Size` 属性 @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `TimePicker`: 新增支持`onPick`事件 和 `presets` API @ZWkang ([#2902](https://github.com/Tencent/tdesign-react/pull/2902))
- `Borderless`: `Input`、`AutoComplete`、`ColorPicker`、`DatePicker`、`TagInput`、`TimePicker`新增`borderless` API，支持无边框模式 @uyarn ([#2884](https://github.com/Tencent/tdesign-react/pull/2884)) ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Scroll`: 调整`1.6.0`后针对 Chrome 滚动条样式的兼容方法，不依赖`autoprefixer`的版本 @loopzhou ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
### 🐞 Bug Fixes
- `ColorPicker`: 修复切换预览颜色时，通道按钮位置不变的问题 @fennghuang ([#2880](https://github.com/Tencent/tdesign-react/pull/2880))
- `Form`: 修复由于 `FormItem`的修改，没有触发监听`FormList`的`useWatch`的问题 @HaixingOoO ([#2904](https://github.com/Tencent/tdesign-react/pull/2904))
- `Menu`: @uyarn 
  - 修复使用`dist`样式因为样式优先级问题导致子菜单位置偏移的问题 ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
  - 提升 `t-popup__menu` 的样式优先级，解决 dist 内样式优先级一致导致样式异常的问题 ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Pagination`: 修复当前页输入小数后没有自动调整的问题 @uyarn ([#2886](https://github.com/Tencent/tdesign-react/pull/2886))
- `Select`: 
   - 修复`creatable`功能异常问题 @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - 修复`reserveKeyword`配合`Option Children`用法的异常问题 @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - 优化已选样式覆盖已禁用样式的问题 @fython ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Slider`: 修复 `sliderRef.current` 可能为空的问题 @ZWkang ([#2868](https://github.com/Tencent/tdesign-react/pull/2868))
- `Table`: 
  - 修复卸载表格时数据为空导致报错的异常 @duxphp ([#2900](https://github.com/Tencent/tdesign-react/pull/2900))
  - 修复`1.5.0`版本后部分场景下使用固定列导致异常的问题 @uyarn ([#2889](https://github.com/Tencent/tdesign-react/pull/2889))
- `TagInput`:
  - 修复没有透传`tagProps`到折叠选项的问题 @uyarn ([#2869](https://github.com/Tencent/tdesign-react/pull/2869))
  - 扩展 `collapsedItems` 的删除功能 @HaixingOoO ([#2881](https://github.com/Tencent/tdesign-react/pull/2881))
- `TreeSelect`: 修复需要通过 `treeProps` 设置 `keys` 属性才生效的问题 @ZWkang ([#2896](https://github.com/Tencent/tdesign-react/pull/2896))
- `Upload`: 
  - 修复手动修改上传进度的 bug @HaixingOoO ([#2901](https://github.com/Tencent/tdesign-react/pull/2901))
  - 修复图片上传错误类型下的样式异常的问题 @uyarn ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
### 🚧 Others
- `TagInput`: 补充`Size`属性的相关文档 @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Typography`: 删除多余的`defaultProps` @HaixingOoO ([#2866](https://github.com/Tencent/tdesign-react/pull/2866))
- `Upload`: 修复文档中关于 OPTIONS 方法的说明 @Summer-Shen ([#2865](https://github.com/Tencent/tdesign-react/pull/2865))
  
## 🌈 1.7.0 `2024-04-25` 
### 🚀 Features
- `Typography`: 新增 `Typography` 排版组件 @insekkei ([#2821](https://github.com/Tencent/tdesign-react/pull/2821))
### 🐞 Bug Fixes
- `Table`: 在 `effect` 异步里执行获取数据时和更新数据，可能会导致一些 bug @HaixingOoO ([#2848](https://github.com/Tencent/tdesign-react/pull/2848))
- `DatePicker`: 修复日期选择器中月份选择回跳初始状态的异常 @uyarn ([#2854](https://github.com/Tencent/tdesign-react/pull/2854))
- `Form`: `useWatch` 在一定情况下，name 的不同会导致视图问题的缺陷 @HaixingOoO ([#2853](https://github.com/Tencent/tdesign-react/pull/2853))
- `Drawer`: 修复 `1.6.0` closeBtn 属性默认值丢失的问题 @uyarn ([#2856](https://github.com/Tencent/tdesign-react/pull/2856))
- `Dropdown`: 修复选项长度为空仍展示浮层的问题 @uyarn ([#2860](https://github.com/Tencent/tdesign-react/pull/2860))
- `Dropdown`: 优化 `Dropdown` 的 `children` 透传 `disabled` @HaixingOoO ([#2862](https://github.com/Tencent/tdesign-react/pull/2862))
- `SelectInput`: 修复非受控属性 `defaultPopupVisible` 不生效的问题 @uyarn ([#2861](https://github.com/Tencent/tdesign-react/pull/2861))
- `Style`: 修复部分节点前缀无法统一替换的缺陷 @ZWkang  @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))
- `Upload`: 修复 `method` 枚举值 `options` 错误的问题 @summer-shen @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))

## 🌈 1.6.0 `2024-04-11` 
### 🚀 Features
- `Portal`: `Portal` 新增懒加载 `forceRender` ,默认为`lazy`模式 ,优化性能，兼容 `SSR` 渲染，对 `Dialog` 和 `Drawer` 组件可能存在破坏性影响 @HaixingOoO ([#2826](https://github.com/Tencent/tdesign-react/pull/2826))
### 🐞 Bug Fixes
- `ImageViewer`: 修复 `imageReferrerpolicy` 没有对顶部缩略图生效的问题 @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))
- `Descriptions`: 修复 `props` 缺少 `className` 和 `style` 属性的问题 @HaixingOoO ([#2818](https://github.com/Tencent/tdesign-react/pull/2818))
- `Layout`: 修复 `Layout` 添加 `Aside` 页面布局会跳动的问题 @HaixingOoO ([#2824](https://github.com/Tencent/tdesign-react/pull/2824))
- `Input`: 修复在 `React16` 版本下阻止冒泡失败的问题 @HaixingOoO ([#2833](https://github.com/Tencent/tdesign-react/pull/2833))
- `DatePicker`: 修复 `1.5.3` 版本之后处理Date类型和周选择器的异常 @uyarn ([#2841](https://github.com/Tencent/tdesign-react/pull/2841))
- `Guide`:  
     - 优化`SSR`下的使用问题 @HaixingOoO ([#2842](https://github.com/Tencent/tdesign-react/pull/2842))
     - 修复`SSR`场景下 `Guide`组件初始化渲染位置异常的问题 @uyarn ([#2832](https://github.com/Tencent/tdesign-react/pull/2832))
- `Scroll`: 修复由于`Chrome 121` 版本支持 scroll width 之后导致`Table`、`Select`及部分出现滚动条组件的样式异常问题 @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765)) @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Locale`: 优化 `DatePicker` 部分模式的语言包 @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Tree`: 修复初始化后 `draggable` 属性丢失响应式的问题 @Liao-js ([#2838](https://github.com/Tencent/tdesign-react/pull/2838))
- `Style`: 支持通过`less`总入口打包样式的需求 @NWYLZW @uyarn  ([common#1757](https://github.com/Tencent/tdesign-common/pull/1757)) ([common#1766](https://github.com/Tencent/tdesign-common/pull/1766))


## 🌈 1.5.5 `2024-03-28` 
### 🐞 Bug Fixes
- `ImageViewer`: 修复 `imageReferrerpolicy` 没有对顶部缩略图生效的问题 @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))

## 🌈 1.5.4 `2024-03-28` 
### 🚀 Features
- `ImageViewer`: 新增`imageReferrerpolicy` API，支持配合 Image 组件的需要配置 Referrerpolicy 的场景 @uyarn ([#2813](https://github.com/Tencent/tdesign-react/pull/2813))
### 🐞 Bug Fixes
- `Select`: 修复 `onRemove` 事件没有正常触发的问题 @Ali-ovo ([#2802](https://github.com/Tencent/tdesign-react/pull/2802))
- `Skeleton`: 修复`children`为必须的类型问题 @uyarn ([#2805](https://github.com/Tencent/tdesign-react/pull/2805))
- `Tabs`: 提供 `action` 区域默认样式 @HaixingOoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Locale`: 修复`image`和`imageViewer` 英语语言包异常的问题 @uyarn  @HaixingOoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Image`: `referrerpolicy` 参数被错误传递到外层 `div` 上，实际传递目标为原生 `image` 标签 @NWYLZW ([#2811](https://github.com/Tencent/tdesign-react/pull/2811))

## 🌈 1.5.3 `2024-03-14` 
### 🚀 Features
- `Breadcrumb`: `BreadcrumbItem` 支持 `onClick` 事件 @HaixingOoO ([#2795](https://github.com/Tencent/tdesign-react/pull/2795))
- `tag`: `Tag`组件新增`color`API，支持自定义颜色 @maoyiluo  @uyarn ([#2799](https://github.com/Tencent/tdesign-react/pull/2799))
### 🐞 Bug Fixes
- `FormList`: 修复多个`FormList` 卡死的问题 @HaixingOoO ([#2788](https://github.com/Tencent/tdesign-react/pull/2788))
- `DatePicker`: 修复 `format` 与 `valueType` 不一致的场景下计算错误的问题 @uyarn ([#2798](https://github.com/Tencent/tdesign-react/pull/2798))
### 🚧 Others
- `Portal`: 添加Portal测试用例 @HaixingOoO ([#2791](https://github.com/Tencent/tdesign-react/pull/2791))
- `List`: 完善 List 测试用例 @HaixingOoO ([#2792](https://github.com/Tencent/tdesign-react/pull/2792))
- `Alert`: 完善 Alert 测试,优化代码 @HaixingOoO ([#2793](https://github.com/Tencent/tdesign-react/pull/2793))

## 🌈 1.5.2 `2024-02-29` 
### 🚀 Features
- `Cascader`: 新增`valueDisplay`和`label` API的支持 @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Descriptions`: `Descriptions` 组件支持嵌套 @HaixingOoO ([#2777](https://github.com/Tencent/tdesign-react/pull/2777))
- `Tabs`: 调整激活 `Tab`下划线与 `TabHeader`边框的层级关系 @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
### 🐞 Bug Fixes
- `Grid`: 尺寸计算错误，宽度兼容异常 @NWYLZW ([#2738](https://github.com/Tencent/tdesign-react/pull/2738))
- `Cascader`: 修复`clearable`点击清除按钮触发三次`onChange`的问题 @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Dialog`: 修复`useDialogPosition`渲染多次绑定事件 @HaixingOoO ([#2749](https://github.com/Tencent/tdesign-react/pull/2749))
- `Guide`: 修复`Guide`自定义内容功能失效 @zhangpaopao0609 ([#2752](https://github.com/Tencent/tdesign-react/pull/2752))
- `Tree`: 修复设置 `keys.children` 后展开图标没有正常变化的问题 @uyarn ([#2746](https://github.com/Tencent/tdesign-react/pull/2746))
- `Tree`: 修复`Tree` 自定义label `setData` 没有渲染的问题 @HaixingOoO ([#2776](https://github.com/Tencent/tdesign-react/pull/2776))
- `Tree`: 修复设置 `Tree` 宽度，`TreeItem` 的 `checkbox` 会被压缩，`label` 省略号失效的问题 @HaixingOoO  @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
- `Select`: @uyarn 
     - 修复通过滚动加载选项选中后滚动行为异常的问题 ([#2779](https://github.com/Tencent/tdesign-react/pull/2779))
     - 修复使用`size` API时，虚拟滚动的功能异常问题  ([#2756](https://github.com/Tencent/tdesign-react/pull/2756))

## 🌈 1.5.1 `2024-01-25` 
### 🚀 Features
- `Popup`: 支持`Plugin`方式使用。 @HaixingOoO ([#2717](https://github.com/Tencent/tdesign-react/pull/2717))
- `Transfer`: 支持 `direction` API @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Tabs`: 新增`action` API，支持自定义右侧区域 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
### 🐞 Bug Fixes
- `Pagination`: `Jump to`调整为大写，保持一致性 @wangyewei ([#2716](https://github.com/Tencent/tdesign-react/pull/2716))
- `Table`: 修复`Modal`里的`Form`表单，使用`shouldUpdate`卸载有时无法找到表单的方法。 @duxphp ([#2675](https://github.com/Tencent/tdesign-react/pull/2675))
- `Table`: 列宽调整和行展开场景，修复行展开时，会重置列宽调整结果问题 @chaishi ([#2722](https://github.com/Tencent/tdesign-react/pull/2722)
- `Select`: 修复`Select`多选状态下选中内容滚动的问题。 @HaixingOoO ([#2721](https://github.com/Tencent/tdesign-react/pull/2721))
- `Transfer`: 修复`disabled` API功能异常的问题 @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `swiper`: 修复`Swiper`向左切换轮播动画时顺序错乱的问题 @HaixingOoO ([#2725](https://github.com/Tencent/tdesign-react/pull/2725))
- `Form`: 修复计算`^`字符异常的问题 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Loading`: 修复未设置 `z-index` 默认值的问题 @betavs ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Tag`: 修复设置`CheckTag`的className会覆盖全部已有类名的缺陷  @uyarn ([#2730](https://github.com/Tencent/tdesign-react/pull/2730))
- `TreeSelect`: 修复`onEnter`事件不触发的问题 @uyarn ([#2731](https://github.com/Tencent/tdesign-react/pull/2731))
- `Menu`: 修复`collapsed`的`scroll`样式 @Except10n ([#2718](https://github.com/Tencent/tdesign-react/pull/2718))
- `Cascader` 修复长列表场景下，在 `Safari`中使用的样式异常问题 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))

## 🌈 1.5.0 `2024-01-11` 
### 🚀 Features
- `Descriptions`: 新增 `Descriptions` 描述组件 @HaixingOoO ([#2706](https://github.com/Tencent/tdesign-react/pull/2706))
- `Dialog`: 添加了 `dialogClassName` 用于处理内部 dialog 节点样式。建议之前通过 `className` 直接修改弹窗本体样式的用户切换使用为 `dialogClassName` @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
### 🐞 Bug Fixes
- `Cascader`: 修复 Cascader 的 `trigger=hover` 过滤之后，选择操作存在异常 bug @HaixingOoO ([#2702](https://github.com/Tencent/tdesign-react/pull/2702))
- `Upload`: 修复 Upload 的 `uploadFilePercent` 类型未定义 @betavs ([#2703](https://github.com/Tencent/tdesign-react/pull/2703))
- `Dialog`: 修复了 Dialog 的 `className` 进行的多次节点挂载错误，`className` 将仅被挂载至 ctx 元素上 @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
- `Tree Select`: 修复了 `Tree Select` 的 suffixIcon 错误并添加了相关示例 @Ali-ovo ([#2692](https://github.com/Tencent/tdesign-react/pull/2692))
### Breaking Changes
- 该版本将 Dialog 的 `className` 错误挂载进行了修复，现在的 className 只会被挂载到 Dialog 的上层容器元素 Context 之中，如果你需要直接修改 Dialog 本体的样式可以切换使用为 `dialogClassName` 进行修改。

## 🌈 1.4.3 `2024-01-02` 
### 🐞 Bug Fixes
- `AutoComplete`: 修复`ActiveIndex=-1`没匹配时，回车会报错的问题 @Ali-ovo ([#2300](https://github.com/Tencent/tdesign-react/pull/2300))
- `Cascader`: 修复`1.4.2` Cascader单选过滤下不触发选中的缺陷 @HaixingOoO ([#2700](https://github.com/Tencent/tdesign-react/pull/2700))


## 🌈 1.4.2 `2023-12-28` 
### 🚀 Features
- `Card`: Card组件添加`LoadingProps`属性 @HaixingOoO ([#2677](https://github.com/Tencent/tdesign-react/pull/2677))
- `DateRangePicker`: 新增`cancelRangeSelectLimit`，支持不限制RangePicker选择的前后范围 @uyarn ([#2684](https://github.com/Tencent/tdesign-react/pull/2684))
- `Space`: 元素为空时，不再渲染一个子元素 @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Upload`: @chaishi
  - 新增支持使用 `uploadPastedFiles` 粘贴上传文件([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 输入框类型的上传组件，新增类名 `t-upload--theme-file-input`([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 新增支持 `uploadPastedFiles`，表示允许粘贴上传文件 ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 新增 `cancelUploadButton` 和 `uploadButton`，支持自定义上传按钮和取消上传按钮 ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 新增 `imageViewerProps`，透传图片预览组件全部属性 ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 新增 `showImageFileName`，用于控制是否显示图片名称 ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 支持传入默认值为非数组形式，[#2471](https://github.com/Tencent/tdesign-react/issues/2471)([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 支持 `fileListDisplay=null` 时，隐藏文件列表；并新增更加完整的 `fileListDisplay` 参数，用于自定义 UI ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
### 🐞 Bug Fixes
- `Table`:  异步获取最新的树形结构数据时，优先使用`window.requestAnimationFrame`函数，以防闪屏 @lazybonee ([#2668](https://github.com/Tencent/tdesign-react/pull/2668))
- `Table`: 修复筛选值为 `0/false` 时，筛选图标不能高亮问题 @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Cascader`: 修复Cascader组件在 filter 之后进行选择操作和清除内容存在异常bug @HaixingOoO ([#2674](https://github.com/Tencent/tdesign-react/pull/2674))
- `ColorPicker`: 全局设置border-box后造成颜色列表样式问题 @carolin913
- `Pagination`: 将总数单位 `项` 改为 `条` , 保持内容一致性  @dinghuihua ([#2679](https://github.com/Tencent/tdesign-react/pull/2679))
- `InputNumber`: 修复 `min=0` 或 `max=0` 限制无效问题，[tdesign-vue#2516](https://github.com/Tencent/tdesign-vue/issues/2516) @chaishi ([#2352](https://github.com/Tencent/tdesign-react/pull/2352))
- `Watermark`: 修复行内style引起的无法sticky定位问题 @carolin913 ([#2685](https://github.com/Tencent/tdesign-react/pull/2685))
- `Calendar`: 修复卡片模式下未正常展示周信息的缺陷 @uyarn ([#2686](https://github.com/Tencent/tdesign-react/pull/2686))
- `Upload`: @chaishi 
  - 修复手动上传时，无法更新上传进度问题 ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 修复 `uploadFilePercent` 参数类型问题  ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
    
 ## 🌈 1.4.1 `2023-12-14` 
### 🚀 Features
- `Radio`: 支持通过空格键(Space)选中选项 @liweijie0812 ([#2638](https://github.com/Tencent/tdesign-react/pull/2638))
- `Dropdown`: 移除对left的item样式特殊处理 @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
### 🐞 Bug Fixes
- `AutoComplete`: 修复部分特殊字符匹配报错的问题  @ZWkang ([#2631](https://github.com/Tencent/tdesign-react/pull/2631))
- `DatePicker`: 修复日期点击清空内容时弹窗会闪烁的缺陷 @HaixingOoO ([#2641](https://github.com/Tencent/tdesign-react/pull/2641))
- `DatePicker`: 修复日期选择禁用后，后缀图标颜色改变的问题 @HaixingOoO  @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
- `DatePicker`: 修复禁用状态下点击组件边缘仍能显示`Panel` @Zz-ZzzZ ([#2653](https://github.com/Tencent/tdesign-react/pull/2653))
- `Dropdown`: 修复下拉菜单禁用状态可点击的问题 @betavs ([#2648](https://github.com/Tencent/tdesign-react/pull/2648))
- `Dropdown`: 修复`DropdownItem`子组件遗漏`Divider`类型的缺陷 @uyarn ([#2649](https://github.com/Tencent/tdesign-react/pull/2649))
- `Popup`: 修复 `disabled` 属性未生效的缺陷 @uyarn ([#2665](https://github.com/Tencent/tdesign-react/pull/2665))
- `Select`: 修复`InputChange`事件在blur时trigger异常的问题 @uyarn ([#2664](https://github.com/Tencent/tdesign-react/pull/2664))
- `SelectInput`: 修复`SelectInput`的popup内容宽度计算问题 @HaixingOoO ([#2647](https://github.com/Tencent/tdesign-react/pull/2647))
- `ImageViewer`: 图片预览添加默认的缩放比例和按下 ESC 时是否触发图片预览器关闭事件 @HaixingOoO ([#2652](https://github.com/Tencent/tdesign-react/pull/2652))
- `Table`: @chaishi 
    - 修复 `EnhancedTable` 树节点无法正常展开问题 ([#2661](https://github.com/Tencent/tdesign-react/pull/2661))
    - 修复虚拟滚动场景，树节点无法展开问题 ([#2659](https://github.com/Tencent/tdesign-react/pull/2659))

 ## 🌈 1.4.0 `2023-11-30`
### 🚀 Features

- `Space`: 兼容支持组件间距在低级浏览器中的呈现 @chaishi ([#2602](https://github.com/Tencent/tdesign-react/pull/2602))
- `Statistic`: 新增统计数值组件 @HaixingOoO ([#2596](https://github.com/Tencent/tdesign-react/pull/2596))

### 🐞 Bug Fixes

- `ColorPicker`: 修复 format 为`hex`时，配合`enableAlpha` 调整透明度不生效的问题 @uyarn ([#2628](https://github.com/Tencent/tdesign-react/pull/2628))
- `ColorPicker`: 修复修改颜色上方滑杆按钮颜色不变 @HaixingOoO ([#2615](https://github.com/Tencent/tdesign-react/pull/2615))
- `Table`: 修复 `lazyLoad` 懒加载效果 @chaishi ([#2605](https://github.com/Tencent/tdesign-react/pull/2605))
- `Tree`: 修复树组件节点的 `open class` 状态控制逻辑错误导致的样式异常 @NWYLZW ([#2611](https://github.com/Tencent/tdesign-react/pull/2611))
- `Tree`: 指定滚动到特定节点 API 中的`key`和`index`应为可选 @uyarn ([#2626](https://github.com/Tencent/tdesign-react/pull/2626))
- `Drawer`: 修复 Drawer 的 mode 为`push`时,推开内容区域为 drawer 节点的父节点。 @HaixingOoO ([#2614](https://github.com/Tencent/tdesign-react/pull/2614))
- `Radio`: 修复表单 disabled 未生效在 Radio 上的问题 @li-jia-nan ([#2397](https://github.com/Tencent/tdesign-react/pull/2397))
- `Pagination`: 修复当 `total` 为 0 并且 `pageSize` 改变时， `current` 值为 0 的问题 @betavs ([#2624](https://github.com/Tencent/tdesign-react/pull/2624))
- `Image`: 修复图片在 SSR 模式下不会触发原生事件 @HaixingOoO ([#2616](https://github.com/Tencent/tdesign-react/pull/2616))

 ## 🌈 1.3.1 `2023-11-15` 
### 🚀 Features
- `Upload`: 拖拽上传文件场景，即使文件类型错误，也触发 `drop` 事件 @chaishi ([#2591](https://github.com/Tencent/tdesign-react/pull/2591))
### 🐞 Bug Fixes
- `Tree`: 
    - 修复不添加activable参数也可触发onClick事件 @HaixingOoO ([#2568](https://github.com/Tencent/tdesign-react/pull/2568))
    - 修复可编辑表格编辑组件之间的联动不生效。 @HaixingOoO ([#2572](https://github.com/Tencent/tdesign-react/pull/2572))
- `Notification`: 
    - 修复连续弹两个Notification,第一次实际只显示一个。 @HaixingOoO ([#2595](https://github.com/Tencent/tdesign-react/pull/2595))
    - 使用flushSync在useEffect中会警告，现在替换flushSycn，改用循环setTimeout来处理。 @HaixingOoO ([#2597](https://github.com/Tencent/tdesign-react/pull/2597))
- `Dialog`: 
    - 修复Dialog中引入Input组件，从Input中间输入光标会跳转到最后 @HaixingOoO ([#2485](https://github.com/Tencent/tdesign-react/pull/2485))
    - 修复弹窗的头部标题显示影响了取消按钮的位置 @HaixingOoO ([#2593](https://github.com/Tencent/tdesign-react/pull/2593))
- `Popup`: 修复PopupRef的类型缺失问题 @Ricinix ([#2577](https://github.com/Tencent/tdesign-react/pull/2577))
- `Tabs`: 修复重复点击激活的选项卡，也会触发 onChange 事件。 @HaixingOoO ([#2588](https://github.com/Tencent/tdesign-react/pull/2588))
- `Rdio`: Radio 根据对应 variant 选择 Radio.Button 进行展示 @NWYLZW ([#2589](https://github.com/Tencent/tdesign-react/pull/2589))
- `Input`: 修复Input设置最大长度后回删的异常行为 @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Link`: 修复前后图标没有垂直居中的问题 @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Select`: 修复`inputchange`事件context参数异常的问题 @uyarn ([#2600](https://github.com/Tencent/tdesign-react/pull/2600))
- `DatePicker`: 修复`PaginationMini `未更新导致切换行为异常的问题 @Ricinix ([#2587](https://github.com/Tencent/tdesign-react/pull/2587))
- `Form`: 修复 setFields 触发 onValuesChange 导致的死循环 @honkinglin ([#2570](https://github.com/Tencent/tdesign-react/pull/2570))

 ## 🌈 1.3.0 `2023-10-19` 
### 🚀 Features
- `Timeline`: TimelineItem添加点击事件。 @Zzongke ([#2545](https://github.com/Tencent/tdesign-react/pull/2545))
- `Tag`:
    - 支持多种风格标签配置 @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
    - 支持标签组`CheckTagGroup`的使用，详见示例文档  @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
### 🐞 Bug Fixes
- `locale`: 添加缺失it_IT、ru_RU、zh_TW 的语言环境 @Zzongke ([#2542](https://github.com/Tencent/tdesign-react/pull/2542))
- `Cascader`: `change` 事件中 `source` 异常问题 @betavs ([#2544](https://github.com/Tencent/tdesign-react/pull/2544))
- `Tree`: 修复`allowFoldNodeOnFilter`为true下过滤后节点的展示结果 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TagInput`: 修复在只有一个选项时，删除过滤文字会误删已选项的缺陷 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TreeSelect`: 调整过滤选项后的交互行为，与其他实现框架保持一致 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Rate`: 修复鼠标快速移动，会出现多个text显示的问题 @Jon-Millent ([#2551](https://github.com/Tencent/tdesign-react/pull/2551))

 ## 🌈 1.2.6 `2023-09-28` 
### 🚀 Features
- `Table`: 优化渲染次数 @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `card`: title使用`div`取代`span` 在自定义场景下更符合规范 @uyarn ([#2517](https://github.com/Tencent/tdesign-react/pull/2517))
- `Tree`: Tree支持通过key匹配单一value指定滚动到特定位置，具体使用方式请参考示例代码 @uyarn ([#2519](https://github.com/Tencent/tdesign-react/pull/2519))
### 🐞 Bug Fixes
- `Form`: 修复 formList 嵌套数据获取异常 @honkinglin ([#2529](https://github.com/Tencent/tdesign-react/pull/2529))
- `Table`: 修复数据切换时 `rowspanAndColspan` 渲染问题，[issue#2513](https://github.com/Tencent/tdesign-react/issues/2513) @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Cascader`: hover 没有子节点数据的父节点时未更新子节点 @betavs ([#2528](https://github.com/Tencent/tdesign-react/pull/2528))
- `Datepicker`: 修复切换月份失效问题 @honkinglin ([#2531](https://github.com/Tencent/tdesign-react/pull/2531))
- `Dropdown`: 修复`Dropdown` disabled API失效的问题 @uyarn ([#2532](https://github.com/Tencent/tdesign-react/pull/2532))

 ## 🌈 1.2.5 `2023-09-14` 
### 🚀 Features
- `steps`: 全局配置添加步骤条的已完成图标自定义 @Zzongke ([#2491](https://github.com/Tencent/tdesign-react/pull/2491))
- `Table`: 可筛选表格，`onFilterChange` 事件新增参数 `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'`，表示触发筛选条件变化的来源 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
- `Form`: trigger新增`submit`选项 @honkinglin ([#2507](https://github.com/Tencent/tdesign-react/pull/2507))
- `ImageViewer`: `onIndexChange` 事件新增 `trigger` 枚举值 `current` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Image`:
    - 新增 `fallback`，表示图片的兜底图，原始图片加载失败时会显示兜底图 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
    - 新增支持 `src` 类型为 `File`，支持通过 `File` 预览图片 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Upload`: 文案列表支持显示缩略图 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`:
    - 支持虚拟滚动场景下通过`key`滚动到特定节点 @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
    - 虚拟滚动下 低于`threshold` 仍可运行scrollTo操作 @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
### 🐞 Bug Fixes
- `GlobalConfig`: 修复切换多语言失效的问题 @uyarn ([#2501](https://github.com/Tencent/tdesign-react/pull/2501))
- `Table`:
    - 可筛选表格，修复 `resetValue` 在清空筛选时，未能重置到指定 `resetValue` 值的问题 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - 树形结构表格，修复 expandedTreeNodes.sync 和 @expanded-tree-nodes-change 使用 expandTreeNodeOnClick  时无效问题 [tdesign-vue#2756](https://github.com/Tencent/tdesign-vue/issues/2756) @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - 单元格在编辑模式下，保存的时候对于链式的colKey处理错误，未能覆盖原来的值 @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
    - 可编辑表格，修复多个可编辑表格同时存在时，校验互相影响问题 @chaishi ([#2498](https://github.com/Tencent/tdesign-react/pull/2498))
    - 单元格在编辑模式下，保存的时候对于链式的colKey处理错误，未能覆盖原来的值 @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
    - 修复使用 list 传 props 且 destroyOnHide 为 false 下， 会丢失 panel 内容的问题 @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `TagInput`: 修复折叠展示选项尺寸大小问题 @uyarn ([#2503](https://github.com/Tencent/tdesign-react/pull/2503))
- `Tabs`: 修复使用 list 传 props 且 destroyOnHide 为 false 下， 会丢失 panel 内容的问题 @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `menu`: 修复菜单expandType默认模式下menuitem传递onClick不触发的问题 @Zzongke ([#2502](https://github.com/Tencent/tdesign-react/pull/2502))
- `ImageViewer`: 修复无法通过 `visible` 直接打开预览弹框问题 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: 修复1.2.0版本后部分`TreeNodeModel`的操作失效的异常 @uyarn

 ## 🌈 1.2.4 `2023-08-31` 
### 🚀 Features
- `Table`: 树形结构，没有设置 `expandedTreeNodes` 情况下，data 数据发生变化时，自动重置收起所有展开节点（如果希望保持展开节点，请使用属性 `expandedTreeNodes` 控制，[tdesign-vue#2735](https://github.com/Tencent/tdesign-vue/issues/2735) @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
### 🐞 Bug Fixes
- `Watermark`: watermark组件，修改水印节点，都不影响水印展示 @tingtingcheng6 ([#2459](https://github.com/Tencent/tdesign-react/pull/2459))
- `Table`:
    - 拖拽排序 + 本地数据分页场景，修复拖拽排序事件参数 `currentIndex/targetIndex/current/target` 等不正确问题 @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
    - 拖拽排序 + 本地数据分页场景，修复在第二页以后的分页数据中拖拽调整顺序后，会自动跳转到第一页问题 @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
    - 支持分页非受控用法的拖拽排序场景 @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
- `Slider`: 修复初始值为0 时，label位置错误的缺陷 @Zzongke ([#2477](https://github.com/Tencent/tdesign-react/pull/2477))
- `Tree`: 支持`store.children`调用getChildren方法 @uyarn ([#2480](https://github.com/Tencent/tdesign-react/pull/2480)) 

## 🌈 1.2.3 `2023-08-24` 
### 🐞 Bug Fixes
- `Table`: 修复 usePrevious 报错 @honkinglin ([#2464](https://github.com/Tencent/tdesign-react/pull/2464))
- `ImageViewer`: 修复引入文件路径报错 @honkinglin ([#2465](https://github.com/Tencent/tdesign-react/pull/2465)) 

## 🌈 1.2.2 `2023-08-24` 
### 🚀 Features
- `Table`:
    - 树形结构，新增组件实例方法 `removeChildren`，用于移除子节点 @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
    - 树形结构，支持通过属性 `expandedTreeNodes.sync` 自由控制展开节点，非必传属性 @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `Tree`: 新增`scrollTo`方法 支持在虚拟滚动场景下滚动到指定节点的需求 @uyarn ([#2460](https://github.com/Tencent/tdesign-react/pull/2460))
### 🐞 Bug Fixes
- `taginput`: fix when entering Chinese, it will be blocked by the previous label @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Table`:
    - 点击行展开/点击行选中，修复 `expandOnRowClick`和 `selectOnRowClick` 无法独立控制行点击执行交互问题 [issue#3254](https://github.com/Tencent/tdesign-vue-next/issues/3254) @chaishi ([#2452](https://github.com/Tencent/tdesign-react/pull/2452))
    - 树形结构，修复组件实例方法 展开全部 `expandAll` 问题 @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `TagInput`: 修复中文展示问题 @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Form`: 修复FormList组件使用form setFieldsValue、reset异常 @nickcdon ([#2406](https://github.com/Tencent/tdesign-react/pull/2406)) 

## 🌈 1.2.1 `2023-08-16` 
### 🚀 Features
- `Anchor`: 新增 `getCurrentAnchor` 支持自定义高亮锚点 @ontheroad1992 ([#2436](https://github.com/Tencent/tdesign-react/pull/2436))
- `Menu`: MenuItem onClick 事件增加value返回值 @dexterBo ([#2441](https://github.com/Tencent/tdesign-react/pull/2441))
- `Form`:  FormItem 新增 valueFormat 函数支持格式化数据 @honkinglin ([#2445](https://github.com/Tencent/tdesign-react/pull/2445))
### 🐞 Bug Fixes
- `Dialog`: 修复闪烁问题 @linjunc ([#2435](https://github.com/Tencent/tdesign-react/pull/2435))
- `Select`: 
    - 修复多选丢失title的问题 @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
    - 开启远程搜索时不执行内部过滤 @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
- `Popconfirm`: invalid className and style props @betavs ([#2420](https://github.com/Tencent/tdesign-react/pull/2420))
- `DatePicker`: 修复 hover cell 造成不必要的渲染 @j10ccc ([#2440](https://github.com/Tencent/tdesign-react/pull/2440)) 

 ## 🌈 1.2.0 `2023-08-10` 

### ❗ Breaking Changes
- `Icon`: 新增 960 个图标；调整图标命名 `photo` 为 `camera`，`books`为`bookmark`, `stop-cirle-1`为`stop-circle-stroke`；移除`money-circle`图标，具体请查看图标页面  @uyarn ([#2429](https://github.com/Tencent/tdesign-react/pull/2429))

### 🚀 Features
- `Table`:
    - 新增 `lazyLoad` 用于懒加载整个表格 @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - 可编辑单元格，新增 `edit.keepEditMode` ，用于保持单元格始终为编辑模式 @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - 可筛选表格，支持透传 `attrs/style/classNames` 属性、样式、类名等信息到自定义组件，[tdesign-vue#2627](https://github.com/Tencent/tdesign-vue/issues/2627) @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    -  可筛选表格，当前 `filterValue` 未设置过滤值的默认值时，不再透传 undefined 到筛选器组件，某些组件的默认值必须为数组，不允许是 undefined @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
### 🐞 Bug Fixes
- `Cascader`:  传入的 value 不在 options中时会直接报错 @peng-yin ([#2414](https://github.com/Tencent/tdesign-react/pull/2414))
- `menu`: 修复同一个MenuItem多次触发onChange的问题 @leezng ([#2424](https://github.com/Tencent/tdesign-react/pull/2424))
- `Drawer`: 抽屉组件在 visible 默认为 true 时，无法正常显示 @peng-yin ([#2415](https://github.com/Tencent/tdesign-react/pull/2415))
- `Table`:
    - 虚拟滚动场景，修复表头宽度和表内容宽度不一致问题 @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - 虚拟滚动场景，修复默认的滚动条长度（位置）和滚动后的不一致问题 @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402)) 

## 🌈 1.1.17 `2023-07-28`
### 🐞 Bug Fixes
- `tabs`: 修复tabs组件list传空数组时的js报错 @zhenglianghan ([#2393](https://github.com/Tencent/tdesign-react/pull/2393))
- `list`: 修复ListItemMeta组件description传递自定义元素 @qijizh ([#2396](https://github.com/Tencent/tdesign-react/pull/2396))
- `Tree`: 修复开启虚拟滚动时部分场景下节点回滚的交互异常问题 @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))
- `Tree`: 修复1.1.15后基于`level`属性的操作无法正常工作的问题 @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))

## 🌈 1.1.16 `2023-07-26`
### 🚀 Features
- `TimePicker`:
    - disableTime回调新增毫秒参数 @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
    - 优化展示不可选时间选项时滚动到不可选选项的体验 @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
- `Dropdown`: 新增panelTopContent及 panelBottomContent 支持需要上下额外节点的场景使用 @uyarn ([#2387](https://github.com/Tencent/tdesign-react/pull/2387))

### 🐞 Bug Fixes
- `Table`:
    - 可编辑表格场景，支持设置 `colKey` 值为链式属性，如：`a.b.c` @chaishi ([#2381](https://github.com/Tencent/tdesign-react/pull/2381))
    - 树形结构表格，修复当 `selectedRowKeys` 中的值在 data 数据中不存在时报错问题，[issue#2375](https://github.com/Tencent/tdesign-react/issues/2375) @chaishi ([#2385](https://github.com/Tencent/tdesign-react/pull/2385))
- `Guide`: 修复设置step为 -1 时需要隐藏组件的功能 @uyarn ([#2389](https://github.com/Tencent/tdesign-react/pull/2389)) 

 ## 🌈 1.1.15 `2023-07-19` 
### 🚀 Features
- `DatePicker`: 优化关闭浮层后重置默认选中区域 @honkinglin ([#2371](https://github.com/Tencent/tdesign-react/pull/2371))
### 🐞 Bug Fixes
- `Dialog`: 修复 `theme=danger` 无效问题，[issue#2364](https://github.com/Tencent/tdesign-react/issues/2364) @chaishi ([#2365](https://github.com/Tencent/tdesign-react/pull/2365))
- `Popconfirm`: 当 `confirmBtn/cancelBtn` 值类型为 `Object` 时未透传 @imp2002 ([#2361](https://github.com/Tencent/tdesign-react/pull/2361)) 

## 🌈 1.1.14 `2023-07-12` 
### 🚀 Features
- `Tree`: 支持虚拟滚动 @uyarn ([#2359](https://github.com/Tencent/tdesign-react/pull/2359))
- `Table`: 树形结构，添加行层级类名，方便业务设置不同层级的样式 @chaishi ([#2354](https://github.com/Tencent/tdesign-react/pull/2354))
- `Radio`: 优化选项组换行情况 @ontheroad1992 ([#2358](https://github.com/Tencent/tdesign-react/pull/2358))
- `Upload`:
    - 新增组件实例方法，`uploadFilePercent` 用于更新文件上传进度 @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
    - `theme=image`，支持使用 `fileListDisplay` 自定义 UI 内容 @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
    - `theme=image`，支持点击名称打开新窗口访问图片，[tdesign-vue#2338](https://github.com/Tencent/tdesign-vue/issues/2338) @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
    - 拖拽上传场景，支持 `accept` 文件类型限制，[tdesign-vue-next#3075](https://github.com/Tencent/tdesign-vue-next/issues/3075) @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

### 🐞 Bug Fixes
- `Upload`: 自定义上传方法，修复未能正确返回上传成功或失败后的文件问题 @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

## 🌈 1.1.13 `2023-07-05` 
### 🐞 Bug Fixes
- `Tag`: 修复 Tag children 为数字 0 时的渲染异常 @HelKyle ([#2335](https://github.com/Tencent/tdesign-react/pull/2335))
- `Input`: 修复 `limitNumber` 部分在 `disabled` 状态下的样式问题 @uyarn ([#2338](https://github.com/Tencent/tdesign-react/pull/2338))
- `TagInput`: 修复前置图标的样式缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))
- `SelectInput`: 修复失焦时未清空输入内容的缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))

## 🌈 1.1.12 `2023-06-29` 

### 🚀 Features
- `Site`: 支持英文站点 @uyarn ([#2316](https://github.com/Tencent/tdesign-react/pull/2316))

### 🐞 Bug Fixes
- `Slider`: 修复数字输入框 `theme` 固定为 `column` 的问题 @Ali-ovo ([#2289](https://github.com/Tencent/tdesign-react/pull/2289))
- `Table`: 列宽调整和自定义列共存场景，修复通过自定义列配置表格列数量变少时，表格总宽度无法再恢复变小，[tdesign-vue-next#2951](https://github.com/Tencent/tdesign-vue-next/issues/2951) @chaishi ([#2325](https://github.com/Tencent/tdesign-react/pull/2325))

## 🌈 1.1.11 `2023-06-20` 
### 🐞 Bug Fixes
- `Table`:
    - 可拖拽调整列宽场景，修复 `resizable=false` 无效问题，默认值为 false @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - 本地数据排序场景，修复异步拉取数据时，取消排序数据会导致空列表问题 @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - 修复固定表格 + 固定列 + 虚拟滚动场景，表头不对齐问题，[issue#2126](https://github.com/Tencent/tdesign-react/issues/2126) @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - 可编辑单元格/可编辑行场景，修复数据始终校验上一个值问题，调整为校验最新输入值，[issue#2219](https://github.com/Tencent/tdesign-react/issues/2219) @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - 修复本地数据排序，多字段排序场景，示例代码缺失问题，[issue#1966](https://github.com/Tencent/tdesign-react/issues/1966) @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
- `ColorPicker`:
    - 初始化为渐变模式时 支持空字符串作为初始值 @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
    - 修复 `recentColors` 等字段的类型问题 @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
    - 修复内部下拉选项未透传 `popupProps` 的缺陷 @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))


## 🌈 1.1.10 `2023-06-13` 
### 🚀 Features
- `Menu`:
    - Submenu 新增 popupProps 属性，允许透传设置底层 Popup 弹窗属性 @xiaosansiji ([#2284](https://github.com/Tencent/tdesign-react/pull/2284))
    - 弹出菜单使用 Popup 重构 @xiaosansiji ([#2274](https://github.com/Tencent/tdesign-react/pull/2274))

### 🐞 Bug Fixes
- `InputNumber`: 初始值为 undefined/null，且存在 decimalPlaces 时，不再进行小数点纠正 @chaishi ([#2273](https://github.com/Tencent/tdesign-react/pull/2273))
- `Select`: 修复`onBlur`方法回调参数异常的问题 @Ali-ovo ([#2281](https://github.com/Tencent/tdesign-react/pull/2281))
- `Dialog`: 修复 Dialog 在 SSR 环境下报错 @night-c ([#2280](https://github.com/Tencent/tdesign-react/pull/2280))
-  `Table`:  修复组件设置 `expandOnRowClick` 为 `true` 时，点击整行报错 @pe-3 ([#2275](https://github.com/Tencent/tdesign-react/pull/2275))

## 🌈 1.1.9 `2023-06-06` 
### 🚀 Features
- `DatePicker`: 支持 onConfirm 事件 @honkinglin ([#2260](https://github.com/Tencent/tdesign-react/pull/2260))
- `Menu`: 优化侧边导航菜单收起时，`Tooltip` 展示菜单内容 @xiaosansiji ([#2263](https://github.com/Tencent/tdesign-react/pull/2263))
- `Swiper`: navigation 类型支持 `dots` `dots-bar` @carolin913 ([#2246](https://github.com/Tencent/tdesign-react/pull/2246))
- `Table`: 新增 `onColumnResizeChange` 事件 @honkinglin ([#2262](https://github.com/Tencent/tdesign-react/pull/2262))

### 🐞 Bug Fixes
- `TreeSelect`: 修复`keys`属性没有透传给 Tree 的问题 @uyarn ([#2267](https://github.com/Tencent/tdesign-react/pull/2267))
- `InputNumber`:  修复部分小数点数字无法输入问题 @chaishi ([#2264](https://github.com/Tencent/tdesign-react/pull/2264))
- `ImageViewer`: 修复触控板缩放操作异常问题 @honkinglin ([#2265](https://github.com/Tencent/tdesign-react/pull/2265))
- `TreeSelect`: 修复当 label 是 reactNode 场景下展示问题 @Ali-ovo ([#2258](https://github.com/Tencent/tdesign-react/pull/2258))

## 🌈 1.1.8 `2023-05-25` 
### 🚀 Features
- `TimePicker`: 没有选中值时不允许点击确认按钮 @uyarn ([#2240](https://github.com/Tencent/tdesign-react/pull/2240))

### 🐞 Bug Fixes
- `Form`: 修复 `FormList` 数据透传问题 @honkinglin ([#2239](https://github.com/Tencent/tdesign-react/pull/2239))

## 🌈 1.1.7 `2023-05-19` 
### 🐞 Bug Fixes
- `Tooltip`: 修复箭头偏移问题 @uyarn ([#1347](https://github.com/Tencent/tdesign-common/pull/1347))

## 🌈 1.1.6 `2023-05-18` 
### 🚀 Features
- `TreeSelect`:  支持 `panelConent` API @ArthurYung ([#2182](https://github.com/Tencent/tdesign-react/pull/2182))

### 🐞 Bug Fixes
- `Select`: 修复可创建重复 label 的选项的缺陷 @uyarn ([#2221](https://github.com/Tencent/tdesign-react/pull/2221))
- `Skeleton`: 修复使用`rowCol`时额外多渲染一行theme的缺陷 @uyarn ([#2223](https://github.com/Tencent/tdesign-react/pull/2223))
- `Form`:
    - 修复异步渲染使用 `useWatch` 报错问题 @honkinglin ([#2220](https://github.com/Tencent/tdesign-react/pull/2220))
    - 修复 `FormList` 初始值赋值失效问题 @honkinglin ([#2222](https://github.com/Tencent/tdesign-react/pull/2222))

## 🌈 1.1.5 `2023-05-10` 
### 🚀 Features
- `Cascader`: 支持 `suffix`、`suffixIcon` @honkinglin ([#2200](https://github.com/Tencent/tdesign-react/pull/2200))

### 🐞 Bug Fixes
- `SelectInput`: 修复 `loading` 在 `disabled` 状态下隐藏问题  @honkinglin ([#2196](https://github.com/Tencent/tdesign-react/pull/2196))
- `Image`: 修复 Image 组件不支持 ref 的问题 @li-jia-nan ([#2198](https://github.com/Tencent/tdesign-react/pull/2198))
- `BackTop`:  支持 ref 透传 @li-jia-nan ([#2202](https://github.com/Tencent/tdesign-react/pull/2202))

## 🌈 1.1.4 `2023-04-27` 
### 🚀 Features
- `Select`: 支持panelTopContent在虚拟滚动等需要滚动下拉框场景的使用 具体使用方式请看示例 @uyarn ([#2184](https://github.com/Tencent/tdesign-react/pull/2184))

### 🐞 Bug Fixes
- `DatePicker`: 修复第二次点击面板关闭异常问题 @honkinglin ([#2183](https://github.com/Tencent/tdesign-react/pull/2183))
- `Table`:  修复 `useResizeObserver` ssr error @chaishi ([#2175](https://github.com/Tencent/tdesign-react/pull/2175))

## 🌈 1.1.3 `2023-04-21` 
### 🚀 Features
- `DatePicker`: 支持 `onPresetClick` 事件 @honkinglin ([#2165](https://github.com/Tencent/tdesign-react/pull/2165))
- `Switch`: `onChange` 支持返回 `event` 参数 @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
- `Collapse`: `onChange` 支持返回 `event` 参数 @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
### 🐞 Bug Fixes
- `Form`: 
    - 修复主动 reset 不触发 `onReset` 逻辑 @honkinglin ([#2150](https://github.com/Tencent/tdesign-react/pull/2150))
    - 修复 `onValuesChange` 事件返回参数问题 @honkinglin ([#2169](https://github.com/Tencent/tdesign-react/pull/2169))
- `Select`: 修复多选模式 `size` 属性未生效的问题 @uyarn ([#2163](https://github.com/Tencent/tdesign-react/pull/2163))
- `Collapse`:
    - 修复 radio 禁用判断 @duanbaosheng ([#2161](https://github.com/Tencent/tdesign-react/pull/2161))
    - 修复 `value` 有默认值时受控问题 @moecasts ([#2152](https://github.com/Tencent/tdesign-react/pull/2152))
- `Icon`: 修复 manifest 统一入口导出 esm 模块，文档为及时更新的问题 @Layouwen ([#2160](https://github.com/Tencent/tdesign-react/pull/2160))

## 🌈 1.1.2 `2023-04-13` 
### 🚀 Features
- `DatePicker`: 优化周选择器高亮判断逻辑性能问题 @honkinglin ([#2136](https://github.com/Tencent/tdesign-react/pull/2136))
### 🐞 Bug Fixes
- `Dialog`: 
    - 修复设置style width 不生效问题 @honkinglin ([#2132](https://github.com/Tencent/tdesign-react/pull/2132))
    - 修复 footer 渲染 null 问题 @honkinglin ([#2131](https://github.com/Tencent/tdesign-react/pull/2131))
- `Select`: 修复多选分组展示样式异常的问题 @uyarn ([#2138](https://github.com/Tencent/tdesign-react/pull/2138))
- `Popup`: 
    - 修复 windows 下 scrollTop 出现小数导致判断滚动底部失效 @honkinglin ([#2142](https://github.com/Tencent/tdesign-react/pull/2142))
    - 修复临界点初次定位问题 @honkinglin ([#2134](https://github.com/Tencent/tdesign-react/pull/2134))
- `ColorPicker`: 修复 Frame 中无法拖拽饱和度和 slider 的问题 @insekkei ([#2140](https://github.com/Tencent/tdesign-react/pull/2140))

## 🌈 1.1.1 `2023-04-06` 
### 🚀 Features
- `StickyTool`: 新增`sticky-tool`组件 @ZekunWu ([#2065](https://github.com/Tencent/tdesign-react/pull/2065))

### 🐞 Bug Fixes
- `TagInput`: 修复基于`TagInput`的组件使用筛选时删除关键词时会删除已选值的问题 @2513483494 ([#2113](https://github.com/Tencent/tdesign-react/pull/2113))
- `InputNumber`: 修复输入小数以0结尾时的功能异常问题 @uyarn ([#2127](https://github.com/Tencent/tdesign-react/pull/2127))
- `tree`: 修复 tree 组件 data 属性不受控问题 @PBK-B ([#2119](https://github.com/Tencent/tdesign-react/pull/2119))
- `TagInput`: 修复基于`TagInput`的组件使用筛选时删除关键词时会删除已选值的问题 @2513483494 ([#2113](https://github.com/Tencent/tdesign-react/pull/2113))
- `Form`: 修复初始数据设置问题 @honkinglin ([#2124](https://github.com/Tencent/tdesign-react/pull/2124))
- `TreeSelect`: 修复过滤后无法展开问题 @honkinglin ([#2128](https://github.com/Tencent/tdesign-react/pull/2128))
- `Popup`: 修复右键展示浮层触发浏览器默认事件 @honkinglin ([#2120](https://github.com/Tencent/tdesign-react/pull/2120))

## 🌈 1.1.0 `2023-03-30` 
### 🚀 Features
- `Table`:
    - 支持使用 `filterIcon` 支持不同列显示不同的筛选图标，[tdesign-vue#2088](https://github.com/Tencent/tdesign-vue/issues/2088) @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - 支持横向滚动到固定列，[tdesign-vue#1992](https://github.com/Tencent/tdesign-vue/issues/1992) @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
- `Button`: 支持禁用态不触发 href 跳转逻辑 @honkinglin ([#2095](https://github.com/Tencent/tdesign-react/pull/2095))
- `BackTop`: 新增 BackTop 组件  @meiqi502 ([#2037](https://github.com/Tencent/tdesign-react/pull/2037))
- `Form`: submit 支持返回数据 @honkinglin ([#2096](https://github.com/Tencent/tdesign-react/pull/2096))

### 🐞 Bug Fixes
- `Table`:
    - 修复 SSR 环境中，document is not undefined 问题 @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - 修复在列显示控制场景中，无法拖拽交换列顺序问题 @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - 单行选中功能，修复 `allowUncheck: false` 无效问题，[tdesign-vue-next#2561](https://github.com/Tencent/tdesign-vue-next/issues/2561) @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
- `Dialog`: 修复 Dialog onOpen 事件调用时机问题 @honkinglin ([#2090](https://github.com/Tencent/tdesign-react/pull/2090))
- `DatePicker`: 修复format为12小时制时功能异常的问题 @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Alert`: 修复关闭按钮为文字时的居中和字体大小问题 @Wen1kang  @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Watermark`: 修复 loading 组合使用问题 @duanbaosheng ([#2094](https://github.com/Tencent/tdesign-react/pull/2094))
- `Notification`: 修复获取实例问题 @honkinglin ([#2103](https://github.com/Tencent/tdesign-react/pull/2103))
- `Radio`:  修复 ts 类型问题 @honkinglin ([#2102](https://github.com/Tencent/tdesign-react/pull/2102))


## 🌈 1.0.5 `2023-03-23` 
### 🚀 Features
- `TimePicker`: 新增 size API , 用于控制时间输入框大小 @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))

### 🐞 Bug Fixes
- `Form`: 修复 formList 初始数据获取问题 @honkinglin ([#2067](https://github.com/Tencent/tdesign-react/pull/2067))
- `Watermark`: fix document undefined in nextjs @carolin913 ([#2073](https://github.com/Tencent/tdesign-react/pull/2073))
- `ColorPicker`:
    - 修复HEX色值无法手动输入的问题 @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
    - 修复最近使用颜色无法删除的问题 @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
- `Dialog`: 修复`onCloseBtnClick`事件无效的问题 @ArthurYung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))
- `BreadCrumb`: 修复通过 options 属性无法配置 Icon 的问题 @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))
- `Dialog`: 修复`onCloseBtnClick`事件无效的问题 @ArthurYung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))



## 🌈 1.0.4 `2023-03-16` 
### 🚀 Features
- `Table`:
    - 列宽调整功能，更新列宽调整规则为：列宽较小没有超出时，列宽调整表现为当前列和相邻列的变化；列宽超出存在横向滚动条时，列宽调整仅影响当前列和列总宽。 @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 可编辑单元格(行)功能，支持编辑模式下，数据变化时实时校验，`col.edit.validateTrigger`， [issue#2445](https://github.com/Tencent/tdesign-vue-next/issues/2445) @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 只有固定列存在时，才会出现类名 `.t-table__content--scrollable-to-left` 和 `.t-table__content--scrollable-to-right` @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 拖拽功能，支持禁用固定列不可拖拽调整顺序，[tdesign-vue-next#2333](https://github.com/Tencent/tdesign-vue-next/issues/2333) @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `Upload`: `theme=file-input` 文件为空时，悬浮时不显示清除按钮 @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `InputNumber`: 支持千分位粘贴 @uyarn ([#2058](https://github.com/Tencent/tdesign-react/pull/2058))
- `DatePicker`: 支持 size 属性 @honkinglin ([#2055](https://github.com/Tencent/tdesign-react/pull/2055))
### 🐞 Bug Fixes
- `Form`: 修复重置默认值数据类型错误 @honkinglin ([#2046](https://github.com/Tencent/tdesign-react/pull/2046))
- `Timeline`: 导出TimelineItem类型 @southorange0929 ([#2053](https://github.com/Tencent/tdesign-react/pull/2053))
- `Table`:
    - 修复表格宽度抖动问题 @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 列宽调整功能，修复 Dialog 中列宽调整问题，[tdesign-vue-next#2359](https://github.com/Tencent/tdesign-vue-next/issues/2359) @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 可编辑单元格，修复下拉选择类组件 `abortEditOnEvent` 没有包含 `onChange` 时，依然会在数据变化时触发退出编辑态问题 @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 修复 lazy-load reset bug @MrWeilian ([#2041](https://github.com/Tencent/tdesign-react/pull/2041))
- `ColorPicker`:  修复输入框无法输入的问题 @insekkei ([#2061](https://github.com/Tencent/tdesign-react/pull/2061))
- `Affix`: 修复 fixed 判断问题 @lio-mengxiang ([#2048](https://github.com/Tencent/tdesign-react/pull/2048))

## 🌈 1.0.3 `2023-03-09` 
### 🚀 Features
- `Message`: 鼠标悬停时不自动关闭 @HelKyle ([#2036](https://github.com/Tencent/tdesign-react/pull/2036))
- `DatePicker`:  支持defaultTime @honkinglin ([#2038](https://github.com/Tencent/tdesign-react/pull/2038))

### 🐞 Bug Fixes
- `DatePicker`: 修复月份为0时展示当前月份问题 @honkinglin ([#2032](https://github.com/Tencent/tdesign-react/pull/2032))
- `Upload`: 修复 upload method 无效问题 @i-tengfei ([#2034](https://github.com/Tencent/tdesign-react/pull/2034))
- `Select`: 修复多选全选初始值为空时选中报错的问题 @uyarn ([#2042](https://github.com/Tencent/tdesign-react/pull/2042))
- `Dialog`: 修复弹窗垂直居中问题 @KMethod ([#2043](https://github.com/Tencent/tdesign-react/pull/2043))

## 🌈 1.0.2 `2023-03-01` 
### 🚀 Features
- `Image`:
    - 图片组件支持特殊格式的地址 `.avif` 和 `.webp` @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
    - 新增图片全局配置 `globalConfig.image.replaceImageSrc`，用于统一替换图片地址 @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `List`: `listItemMeta` 支持 `className`、`style` 属性 @honkinglin ([#2005](https://github.com/Tencent/tdesign-react/pull/2005))

### 🐞 Bug Fixes
- `Form`:
    - 修复校验信息沿用错误缓存问题 @honkinglin ([#2014](https://github.com/Tencent/tdesign-react/pull/2014))
    - 移除 formItem 多余事件通知逻辑 @honkinglin ([#2024](https://github.com/Tencent/tdesign-react/pull/2024))
- `Drawer`: 修复 drawer 拖拽后页面出现滚动条问题 @honkinglin ([#2012](https://github.com/Tencent/tdesign-react/pull/2012))
- `Input`: 修复异步渲染宽度计算问题 @honkinglin ([#2010](https://github.com/Tencent/tdesign-react/pull/2010))
- `Textarea`: 调整 limit 展示位置，修复与tips 共存时样式问题 @duanbaosheng ([#2015](https://github.com/Tencent/tdesign-react/pull/2015))
- `Checkbox`: 修复 ts 类型问题 @NWYLZW ([#2023](https://github.com/Tencent/tdesign-react/pull/2023))


## 🌈 1.0.1 `2023-02-21` 
### 🚀 Features
- `Popup`: 新增`onScrollToBottom` 事件 @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Select`:
    - 支持虚拟滚动的使用 @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
    - 支持`autofocus`、`suffix`，`suffixIcon`等API，`onSearch`新增回调参数 @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
    - Option子组件支持自定义`title`API @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Icon`:  加载时注入样式，避免在 next 环境中报错的问题 @uyarn ([#1990](https://github.com/Tencent/tdesign-react/pull/1990))
- `Avatar`: 组件内部图片，使用 Image 组件渲染，支持透传 `imageProps` 到 Image 图片组件 @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Dialog`: plugin 调用支持自定义 visbile @moecasts ([#1998](https://github.com/Tencent/tdesign-react/pull/1998))
- `Tabs`:  支持拖拽能力 @duanbaosheng ([#1979](https://github.com/Tencent/tdesign-react/pull/1979))

### 🐞 Bug Fixes
- `Select`: 修复`onInputchange`触发时机的问题 @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Radio`: 修复 radio disabled 默认值问题  @honkinglin ([#1977](https://github.com/Tencent/tdesign-react/pull/1977))
- `Table`: editable cell keep edit state @moecasts ([#1988](https://github.com/Tencent/tdesign-react/pull/1988))
- `TagInput`: 修复0.45.4版本后TagInput增加blur行为导致Select/Cascader/TreeSelect无法过滤多选的问题 @uyarn ([#1989](https://github.com/Tencent/tdesign-react/pull/1989))
- `Avatar`: 修复图片无法显示问题 @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Image`: 修复事件类型问题 @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Tree`: 修复子节点被折叠后无法被搜索问题 @honkinglin ([#1999](https://github.com/Tencent/tdesign-react/pull/1999))
- `Popup`:  修复浮层显隐死循环问题 @honkinglin ([#1991](https://github.com/Tencent/tdesign-react/pull/1991))
- `Form`:  修复 formList onValuesChange 获取不到最新数据问题 @honkinglin ([#1992](https://github.com/Tencent/tdesign-react/pull/1992))
- `Drawer`:  修复 `drawer`、`Dialog` 滚动条检测问题 @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))


## 🌈 1.0.0 `2023-02-13` 
### 🚀 Features
- `Dropdown`: submenu层级结构调整，增加一层`t-dropdown__submenu-wrapper` @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

### 🐞 Bug Fixes
- `Tree`: 修复使用 setItem 设置节点expanded 时，不触发 onExpand 的问题 @genyuMPj ([#1956](https://github.com/Tencent/tdesign-react/pull/1956))
- `Dropdown`: 修复多层超长菜单的位置异常问题 @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))


## 🌈 0.45.6 `2023-02-08` 
### 🚀 Features
- `Input`: 点击 Input 输入框中的任意元素，自动触发聚焦 @chaishi ([#1950](https://github.com/Tencent/tdesign-react/pull/1950))
- `TagInput`: `collapsedItems` 的参数 `count` 含义更为折叠的数量 @chaishi ([#1950](https://github.com/Tencent/tdesign-react/pull/1950))
### 🐞 Bug Fixes
- `Loading`: 修复loading在部分windows设备中晃动的问题 @uyarn ([#1943](https://github.com/Tencent/tdesign-react/pull/1943))
- `InputNumber`: 修复小数点后面不能连续输入两个 0 的问题 @chaishi ([#1950](https://github.com/Tencent/tdesign-react/pull/1950))
- `TreeSelect`:
    - `onBlur` 和 `onFocus` 的事件参数 `value` 调整为和文档保持一致，始终等于组件选中的值 @chaishi ([#1950](https://github.com/Tencent/tdesign-react/pull/1950))
    - 修复 `collapsedItems` 的第一个参数缺少 label 信息问题（可能存在 Breaking Change) @chaishi ([#1950](https://github.com/Tencent/tdesign-react/pull/1950))
- `Dialog & Drawer`: 修复在 next 中 document 报错问题 @honkinglin ([#1944](https://github.com/Tencent/tdesign-react/pull/1944))
- `ColorPicker`: 修复 slider 初始化 thumb 位置计算问题 @MrWeilian ([#1907](https://github.com/Tencent/tdesign-react/pull/1907))

## 🌈 0.45.5 `2023-02-01` 
### 🚀 Features
- `Timeline`: 
    - `labelAlign` 默认值由 `left` 更为  `right` @chaishi ([#1905](https://github.com/Tencent/tdesign-react/pull/1905))
    - `dotColor` 默认值由 `default` 更为 `primary` @chaishi ([#1905](https://github.com/Tencent/tdesign-react/pull/1905))
- `TreeSelect`: `data` 中的 `label` 属性，支持 `ReactNode`，修复使用 label 定义下拉选项报错问题 @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
- `Guide`: 
    - 新增 `GuideStep.popupProps` 透传全部属性到 Popup 组件 @chaishi ([#1915](https://github.com/Tencent/tdesign-react/pull/1915))
    - 去除步骤数非必要的包裹元素 `span` @chaishi ([#1915](https://github.com/Tencent/tdesign-react/pull/1915))
    - 支持 `children`，含义同 `content` @chaishi ([#1915](https://github.com/Tencent/tdesign-react/pull/1915))
- `Upload`:
    - 可拖拽的单图片/单文件上传，支持自定义文件信息内容 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 一个请求上传多个文件时，去除重复参数 `file`，保留 `file[0]` `file[1]` 即可，同时新增参数 `length` 表示本次上传文件的数量 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - `onError/onSuccess/onProgress` 添加关键事件参数 `XMLHttpRequest`，用于获取上传请求更详细的信息 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - `tips` 支持 `ReactNode` @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 新增上传请求超时也会执行 `onError` @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 支持事件 `onCancelUpload` @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 支持 `mockProgressDuration`，用于设置模拟上传进度间隔时间，大文件大一点，小文件小一点 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
- `Avatar`: 图标类名由 `.t-avatar-icon` 更为 `.t-avatar__icon` @chaishi ([#1931](https://github.com/Tencent/tdesign-react/pull/1931))

### 🐞 Bug Fixes
- `dialog`:
    - 修复 dialog footer 渲染丢失包裹块问题 @honkinglin ([#1904](https://github.com/Tencent/tdesign-react/pull/1904))
- `TreeSelect`:
    - 多选场景，修复搜索功能点击输入框报错问题 @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
    - 没有触发事件 `onPopupVisibleChange` @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
    - 修复 onInputChange 触发时机不正确问题，不应该在初始渲染且用户没有进行任何操作时就触发 @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
    - 修复过滤功能中，输入关键词发生变化时，没有触发 `onSearch` 问题 @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
    - 期望远程搜索事件 onSearch 优先级比本地搜索 filter 高，当前组件表现不符合预期 @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
    - 修复 onSearch 事件第一个参数不正确问题，第一个参数期望是输入的关键词，而非当前选中的值 @chaishi ([#1899](https://github.com/Tencent/tdesign-react/pull/1899))
    - 修复 empty text 显示异常 & onClear 后 value 重置问题 @genyuMPj ([#1903](https://github.com/Tencent/tdesign-react/pull/1903))
- `Image`:  组件内中文改为 `localeProvider` 提供配置 @carolin913 ([#1909](https://github.com/Tencent/tdesign-react/pull/1909))
- `imageViewer`:  组件内中文改为 localeprovider 提供配置 @carolin913 ([#1909](https://github.com/Tencent/tdesign-react/pull/1909))
- `SelectInput`: 修复下拉弹窗状态未改变时，重复触发 `onPopupVisibleChange` 事件的问题 @xiaosansiji ([#1902](https://github.com/Tencent/tdesign-react/pull/1902))
- `Guide`: 修复自定义 `highlightContent` 节点中的类名消失问题 @chaishi ([#1915](https://github.com/Tencent/tdesign-react/pull/1915))
- `ColorPicker`: 修复打开Mode选择器状态下关闭面板没有正确隐藏Mode选择器的问题 @MrWeilian ([#1914](https://github.com/Tencent/tdesign-react/pull/1914))
- `Upload`:
    - 修复 `onSelectChange` 事件第二个参数 `currentSelectedFiles` 不正确问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复 `autoUpload=false` 场景下，即使 `beforeUpload` 函数全部返回 `false` 依然会触发 `onChange` 事件问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复 `data` 为函数时，参数为空问题，补充参数 `files` @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复 `theme=image-flow` 时，无法使用 `fileListDisplay` 自定义图片列表问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复文件数量超出 `max` 时，且没有可继续上传的文件，依然触发 change 事件问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复 `theme=file` 或者 `theme=image-flow` 时，`abridgeName` 无效问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复 `theme=image-flow` 且 `autoUpload=false` 时，change 事件第一个参数丢失 file.url 问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
    - 修复非自动上传场景 `change` 事件第二个参数 `file` 值并非当前文件问题 @chaishi ([#1918](https://github.com/Tencent/tdesign-react/pull/1918))
- `TimePicker`: 修复自定义 onInput 未触发问题 @carolin913 ([#1912](https://github.com/Tencent/tdesign-react/pull/1912))
- `DatePicker`: 修复 dayjs 国际化设置问题 @honkinglin ([#1925](https://github.com/Tencent/tdesign-react/pull/1925))
- `Table`: 修复拖拽滚动条回到顶部白屏问题 @MrWeilian ([#1921](https://github.com/Tencent/tdesign-react/pull/1921))

## 🌈 0.45.4 `2023-01-17` 
### 🚀 Features
- `Image`: `onLoad` 和 `onError` 事件新增 `Event` 参数 @chaishi ([#1890](https://github.com/Tencent/tdesign-react/pull/1890))
### 🐞 Bug Fixes
- `Cascader`: 修复 checkbox 样式丢失 @honkinglin ([#1893](https://github.com/Tencent/tdesign-react/pull/1893))
- `AutoComplete`:
    - 修复键盘操作时，上下箭头切换失效问题 @chaishi ([#1889](https://github.com/Tencent/tdesign-react/pull/1889))
    - 没有 `options` 的情况，不显示下拉框所有元素 @chaishi ([#1889](https://github.com/Tencent/tdesign-react/pull/1889))
- `Avatar`:
    - 修复 `icon` `content` 自定义节点无效问题 @chaishi ([#1887](https://github.com/Tencent/tdesign-react/pull/1887))
    - 修复 AvatarGroup.size 设置无效问题 @chaishi ([#1887](https://github.com/Tencent/tdesign-react/pull/1887))
- `Tag`:
    - 修复文本超出省略时缺少 `title` 属性问题 @chaishi ([#1892](https://github.com/Tencent/tdesign-react/pull/1892))
    - 修复禁用状态依然显示关闭图标问题 @chaishi ([#1892](https://github.com/Tencent/tdesign-react/pull/1892))
- `Watermark`: 修复水印默认可删除问题 @haishancai ([#1885](https://github.com/Tencent/tdesign-react/pull/1885))
- `Cascader`: value is zero can be selected @MrWeilian ([#1884](https://github.com/Tencent/tdesign-react/pull/1884))

### 🚧 Others
- `package`: 移除 use-resize-observer 依赖 @honkinglin ([#1888](https://github.com/Tencent/tdesign-react/pull/1888))
- `Image`: 输出完整的测试用例 @chaishi ([#1890](https://github.com/Tencent/tdesign-react/pull/1890))
- `Input`: 输出完整的测试用例 @chaishi ([#1889](https://github.com/Tencent/tdesign-react/pull/1889))
- `AutoComplete`: 输出完整的测试用例 @chaishi ([#1889](https://github.com/Tencent/tdesign-react/pull/1889))
- `Message`: 添加完整的测试用例 @MrWeilian ([#1879](https://github.com/Tencent/tdesign-react/pull/1879))
- `Tag`: 添加完整的测试用例 @chaishi ([#1892](https://github.com/Tencent/tdesign-react/pull/1892))
- `TagInput`: 添加完整的测试用例 @chaishi ([#1892](https://github.com/Tencent/tdesign-react/pull/1892))
- `SelectInput`: 添加部分测试用例 @chaishi ([#1892](https://github.com/Tencent/tdesign-react/pull/1892))

## 🌈 0.45.3 `2023-01-11` 
### 🚀 Features
- `Radio`:
    - 新增键盘事件支持，tab 键切换选项，enter 键选中 @chaishi ([#1865](https://github.com/Tencent/tdesign-react/pull/1865))
    - Radio.Group 新增 `allowUncheck`，支持取消选中（Radio. allowUncheck 本身已支持） @chaishi ([#1865](https://github.com/Tencent/tdesign-react/pull/1865))
    - `onClick` 参数由 `(e: MouseEvent)` 调整为 `({'\u007B'} e: MouseEvent {'\u007d'})` @chaishi ([#1865](https://github.com/Tencent/tdesign-react/pull/1865))

### 🐞 Bug Fixes
- `Radio`: 修复 Radio.Group 不支持 `name` 属性问题 @chaishi ([#1865](https://github.com/Tencent/tdesign-react/pull/1865))
- `Form`: 修复 `FormList` `add` `remove` 未触发 `onValuesChange` 事件 @honkinglin ([#1871](https://github.com/Tencent/tdesign-react/pull/1871))
- `TreeSelect`:
    - 修复选项文案过程样式的异常 @uyarn ([#1875](https://github.com/Tencent/tdesign-react/pull/1875))
    - 修复 value 为 0 无法选中问题 @honkinglin ([#1869](https://github.com/Tencent/tdesign-react/pull/1869))
- `Popup`: 修复滚动事件执行时机问题 @honkinglin ([#1870](https://github.com/Tencent/tdesign-react/pull/1870))


## 🌈 0.45.2 `2023-01-05` 
### 🚀 Features
- `语言包`: 新增阿拉伯语的语言包 @Ylushen ([common #1097](https://github.com/Tencent/tdesign-common/pull/1097))
- `AutoComplete`:
    - 新增清空功能 `clearable` @chaishi ([#1845](https://github.com/Tencent/tdesign-react/pull/1845))
    - 新增自动聚焦功能 `autofocus` @chaishi ([#1845](https://github.com/Tencent/tdesign-react/pull/1845))
    - 支持 `style` 和 `className` @chaishi ([#1845](https://github.com/Tencent/tdesign-react/pull/1845))
    - 新增 `enter/blur/compositionend/compositionstar`t 等事件，及相关参数和文档保持一致 @chaishi ([#1845](https://github.com/Tencent/tdesign-react/pull/1845))
- `Breadcrumb`:  超长文本省略支持悬浮查看完整内容 @yaogengzhu ([#1837](https://github.com/Tencent/tdesign-react/pull/1837))
- `Popup`:  新增 trigger=mousedown 功能 @honkinglin ([#1857](https://github.com/Tencent/tdesign-react/pull/1857))

### 🐞 Bug Fixes
- `table`: 修正 onDragSort 使用过期变量的问题 @lich-yoo ([#1844](https://github.com/Tencent/tdesign-react/pull/1844))
- `AutoComplete`: 修复 `options` 不存在时，组件因缺少判空报错问题 @chaishi ([#1845](https://github.com/Tencent/tdesign-react/pull/1845))
- `Dialog`: 修复 `style` 透传问题 @honkinglin ([#1859](https://github.com/Tencent/tdesign-react/pull/1859))
- `Form`: 修复 `unsafe-eval`报错的问题 @honkinglin ([#1860](https://github.com/Tencent/tdesign-react/pull/1860))
- `Select`: 修复`readonly`状态下可以通过选项的关闭按钮移除选项的问题 @uyarn ([#1862](https://github.com/Tencent/tdesign-react/pull/1862))
- `DatePicker`:
    - 修复输入框变化面板未响应问题 @honkinglin ([#1858](https://github.com/Tencent/tdesign-react/pull/1858))
    - 修复年份面板禁用样式问题 @honkinglin ([#1861](https://github.com/Tencent/tdesign-react/pull/1861))
- `ImageViewer`:  z-index层级调整，修复窗口模式拖拽问题 @Ylushen ([#1851](https://github.com/Tencent/tdesign-react/pull/1851))


## 🌈 0.45.1 `2022-12-29` 
### 🚀 Features
- `Select`: 支持选项`checkAll` 功能 @uyarn ([#1841](https://github.com/Tencent/tdesign-react/pull/1841))

### 🐞 Bug Fixes
- `TooltipLite`: 修复层叠上下文样式问题 @moecasts ([#1838](https://github.com/Tencent/tdesign-react/pull/1838))
- `DatePicker`: 修复年份选择器区间错误 @honkinglin ([#1833](https://github.com/Tencent/tdesign-react/pull/1833))
- `Table`: 修复 onPageChange 回调参数错误 @chaishi ([#1840](https://github.com/Tencent/tdesign-react/pull/1840))

## 🌈 0.45.0 `2022-12-22` 

### ❗ Breaking Changes
- `Dialog`: 重构 Dialog，兼容 mode="normal" 属性更改为 DialogCard 实现，新增控制台警告 @honkinglin ([#1830](https://github.com/Tencent/tdesign-react/pull/1830))

### 🚀 Features
- `Table`:
    - 支持设置 `col.stopPropagation` 阻止整列事件冒泡 @chaishi ([#1816](https://github.com/Tencent/tdesign-react/pull/1816))
    - 可筛选表格，新增 `filter.popupProps` ，支持透传 Popup 组件全部属性，[tdesign-vue-next#2088](https://github.com/Tencent/tdesign-vue-next/issues/2088) @chaishi ([#1817](https://github.com/Tencent/tdesign-react/pull/1817))
    - 选中行表格，新增 `selectOnRowClick`，支持点击行选中，[tdesign-vue-next#1954](https://github.com/Tencent/tdesign-vue-next/issues/1954) @chaishi ([#1817](https://github.com/Tencent/tdesign-react/pull/1817))
    - 本地排序功能，支持对默认数据进行排序 @chaishi ([#1817](https://github.com/Tencent/tdesign-react/pull/1817))
- `Menu`: 弹出菜单中箭头不再翻转，间距等样式与 Dropdown 子菜单对齐 @xiaosansiji ([#1813](https://github.com/Tencent/tdesign-react/pull/1813))
- `Dialog`: 重构 Dialog，新增 DialogCard 子组件 @honkinglin ([#1830](https://github.com/Tencent/tdesign-react/pull/1830))

### 🐞 Bug Fixes
- `Input`: 修复 input 动态宽度计算问题 @honkinglin ([#1806](https://github.com/Tencent/tdesign-react/pull/1806))
- `Table`:
    - 修复固定表头缺少在数据没有溢出时，缺少背景色问题 @chaishi ([#1812](https://github.com/Tencent/tdesign-react/pull/1812))
    - 设置展开图标阻止事件冒泡，避免点击展开图标时触发行点击事件，进而触发其他特性 @chaishi ([#1816](https://github.com/Tencent/tdesign-react/pull/1816))
    - 虚拟滚动支持表格高度动态变化，[tdesign-vue-next#1374](https://github.com/Tencent/tdesign-vue-next/issues/1374) @chaishi ([#1827](https://github.com/Tencent/tdesign-react/pull/1827))
    - 修复表格宽度过小时抖动问题 @chaishi ([#1827](https://github.com/Tencent/tdesign-react/pull/1827))
- `Dropdown`: 修复多级菜单过长无法选择的问题 @uyarn ([#1821](https://github.com/Tencent/tdesign-react/pull/1821))
- `Tree`: 修复叶子节点的label区域无法触发选中的问题 @uyarn ([#1822](https://github.com/Tencent/tdesign-react/pull/1822))
- `Form`:
    - 修复异步渲染 form 组件赋值失败问题 @honkinglin ([#1824](https://github.com/Tencent/tdesign-react/pull/1824))
    - 修复 formList 嵌套赋值问题 @honkinglin ([#1819](https://github.com/Tencent/tdesign-react/pull/1819))
- `Guide`: 部分默认属性通过全局配置获取 @zhangpaopao0609 ([#1808](https://github.com/Tencent/tdesign-react/pull/1808))
- `Progress`: 修复 label 展示问题 @honkinglin ([#1809](https://github.com/Tencent/tdesign-react/pull/1809))
- `TreeSelect`:  修复 input 宽度展示问题 @honkinglin ([#1820](https://github.com/Tencent/tdesign-react/pull/1820))
- `ColorPicker`:  修复 swatchs panel 默认标题错误 @josonyang ([#1810](https://github.com/Tencent/tdesign-react/pull/1810))


## 🌈 0.44.2 `2022-12-14` 
### 🚀 Features
- `Table`:
    - 支持任意行高虚拟滚动和树形结构虚拟滚动、支持滚动定位到任意元素 @chaishi ([#1798](https://github.com/Tencent/tdesign-react/pull/1798))
    - 树形结构，支持点击行展开树节点 @chaishi ([#1800](https://github.com/Tencent/tdesign-react/pull/1800))
    - 树形结构，点击树节点展开图标的时候，不再冒泡到行点击事件 `onRowClick` @chaishi ([#1800](https://github.com/Tencent/tdesign-react/pull/1800))

### 🐞 Bug Fixes
- `SelectInput`: 修复 `selectInput` 出现异常的`tips` 节点 @pengYYYYY ([#1792](https://github.com/Tencent/tdesign-react/pull/1792))
- `Form`: 修复 formList 下 error 跳转问题 @honkinglin ([#1794](https://github.com/Tencent/tdesign-react/pull/1794))
- `Guide`: skip 和 finish 事件正确返回 current；相对元素位置不正确； @zhangpaopao0609 ([#1803](https://github.com/Tencent/tdesign-react/pull/1803))
- `DatePicker`: 修复右侧面板月份展示错误 @honkinglin ([#1802](https://github.com/Tencent/tdesign-react/pull/1802))
- `Dialog`:  修复滚动条判断问题 @honkinglin ([#1795](https://github.com/Tencent/tdesign-react/pull/1795))

## 🌈 0.44.1 `2022-12-08` 
### 🚀 Features
- `TimePicker`: 新增`status`、`tips`和`onPick` API @uyarn ([#1786](https://github.com/Tencent/tdesign-react/pull/1786))
- `ColorPicker`: 新增`showPrimaryColorPreview` API 控制色彩选择条右侧主色区块的展示 @uyarn ([#1788](https://github.com/Tencent/tdesign-react/pull/1788))
- `Upload`:
    - `onProgress/onSuccess/onFail` 等事件参数添加 `XMLHttpRequest`，用于获取 http status 等数据 @chaishi ([#1781](https://github.com/Tencent/tdesign-react/pull/1781))
    - `fileListDisplay` 支持自定义多文件列表 @chaishi ([#1781](https://github.com/Tencent/tdesign-react/pull/1781))

### 🐞 Bug Fixes
- `InputNumber`:
    - 无法输入小数点后面的第一位数字 `0`，[tdesign-vue-next#2103](https://github.com/Tencent/tdesign-vue-next/issues/2103) @chaishi ([#1780](https://github.com/Tencent/tdesign-react/pull/1780))
    - 修复无法使用清空按钮清除输入数字问题，[issue#1855](https://github.com/Tencent/tdesign-vue/issues/1855) @chaishi ([#1780](https://github.com/Tencent/tdesign-react/pull/1780))
    - 修复 status 默认值缺失 @honkinglin ([#1790](https://github.com/Tencent/tdesign-react/pull/1790))
- `Popup`: 快速移动鼠标弹出层闪烁 @HelKyle ([#1769](https://github.com/Tencent/tdesign-react/pull/1769))
- `dialog`: 修复 dialog instance ts 类型警告 @moecasts ([#1783](https://github.com/Tencent/tdesign-react/pull/1783))
- `affix`: 新增 content @ontheroad1992 ([#1778](https://github.com/Tencent/tdesign-react/pull/1778))
- `TimePicker`: 修复打开面板时无法直接清空时间的交互问题 @uyarn ([#1786](https://github.com/Tencent/tdesign-react/pull/1786))
- `Select`: 修复`onEnter`事件回调参数异常的问题 @uyarn ([#1789](https://github.com/Tencent/tdesign-react/pull/1789))
- `Form`: 修复 ts 类型警告 @honkinglin ([#1775](https://github.com/Tencent/tdesign-react/pull/1775))
- `Anchor`: 修复 container 默认值问题 @ontheroad1992 ([#1776](https://github.com/Tencent/tdesign-react/pull/1776))
- `InputAdornment`: 修复样式问题 @honkinglin ([#1784](https://github.com/Tencent/tdesign-react/pull/1784))
- `Dialog`: 修复滚动条宽度计算问题 @honkinglin ([#1787](https://github.com/Tencent/tdesign-react/pull/1787))


## 🌈 0.44.0 `2022-11-30` 
### ❗ Breaking Changes
- `Jumper`: Jumper 更名为 PaginationMini 组件，正在使用 Jumper 组件的同学请从 Pagination 中导出替换 @honkinglin ([#1749](https://github.com/Tencent/tdesign-react/pull/1749))
- `Tooltip`: 移除 placement 的 mouse 模式，该场景请使用 TooltipLite @carolin913 ([#1751](https://github.com/Tencent/tdesign-react/pull/1751))

### 🚀 Features
- `TooltipLite`: placement 支持 mouse 模式，实现原生title体验 @carolin913 ([#1751](https://github.com/Tencent/tdesign-react/pull/1751))
- `Table`: 选中行功能，新增 `reserveSelectedRowOnPaginate`，用于支持在分页场景中，仅选中当前页数据，切换分页时清空选中结果，全选仅选中当前页数据 @chaishi ([#1755](https://github.com/Tencent/tdesign-react/pull/1755))
- `Drawer`: 默认不显示关闭按钮，有取消和确认按钮足矣，同其他框架保持一致 @chaishi ([#1746](https://github.com/Tencent/tdesign-react/pull/1746))
- `AutoComplete`: 新增组件 `AutoComplete` @chaishi ([#1752](https://github.com/Tencent/tdesign-react/pull/1752))
- `Calendar`: 调整卡片类型的控制面板尺寸大小 @uyarn ([#1766](https://github.com/Tencent/tdesign-react/pull/1766))

### 🐞 Bug Fixes
- `Table`:
    - 减少表格重渲染  #1688 @jsonz1993 ([#1704](https://github.com/Tencent/tdesign-react/pull/1704))
    - 修复本地数据分页场景中，切换分页大小，`onPageChange` 事件参数返回的数据不正确问题 @chaishi ([#1755](https://github.com/Tencent/tdesign-react/pull/1755))
    - 序号列支持跨分页显示，[issue#1726](https://github.com/Tencent/tdesign-react/issues/1726)，[tdesign-vue-next#2072](https://github.com/Tencent/tdesign-vue-next/issues/2072) @chaishi ([#1755](https://github.com/Tencent/tdesign-react/pull/1755))
    - 修复分页场景下，设置 max-height 和 bordered 之后，边框线位置不正确 [tdesign-vue-next#2062](https://github.com/Tencent/tdesign-vue-next/issues/2062) @chaishi ([#1755](https://github.com/Tencent/tdesign-react/pull/1755))
- `Card`: 修复 Card 组件 loading 高度塌陷 @HelKyle ([#1754](https://github.com/Tencent/tdesign-react/pull/1754))
- `TagInput`:
    - 标签边距和图标位置调整 @chaishi ([#1758](https://github.com/Tencent/tdesign-react/pull/1758))
    - 右侧图标会和标签重合问题 @chaishi ([#1758](https://github.com/Tencent/tdesign-react/pull/1758))
    - 修复 `onRemove` 事件参数未能返回最新 `value` 问题 @chaishi ([#1758](https://github.com/Tencent/tdesign-react/pull/1758))
- `Calendar`: 修复控制面板对齐的问题 @uyarn ([#1766](https://github.com/Tencent/tdesign-react/pull/1766))
- `Menu`: 修复纵向类型二级菜单左边间距丢失的问题 @uyarn ([#1766](https://github.com/Tencent/tdesign-react/pull/1766))
- `Dropdown`:  修复透传 className 和 style 的问题 @insekkei ([#1745](https://github.com/Tencent/tdesign-react/pull/1745))
- `Message`:  修复在 offset 不存在时 style 生效 @kenzyyang ([#1762](https://github.com/Tencent/tdesign-react/pull/1762))
- `TreeSelect`: 修复 valueDisplay 清空按钮不展示问题 @honkinglin ([#1757](https://github.com/Tencent/tdesign-react/pull/1757))
- `SelectInput`: 修复某些场景下select-input 无法输入的问题 @HelKyle ([#1760](https://github.com/Tencent/tdesign-react/pull/1760))
- `Drawer`: 修复动画效果异常 @honkinglin ([#1761](https://github.com/Tencent/tdesign-react/pull/1761))


## 🌈 0.43.1 `2022-11-23` 
### 🚀 Features
- `Select`: Select option子组件搜索以label优先 支持复杂children为node节点的搜索 @uyarn ([#1717](https://github.com/Tencent/tdesign-react/pull/1717))
- `ColorPicker`: 增加对OnChange事件区分最近使用和预设的颜色的点击事件 @josonyang ([#1722](https://github.com/Tencent/tdesign-react/pull/1722))
- `InputNumber`:
    - 支持 `allowInputOverLimit`，用于设置是否允许输入数字超过 `max` `min` 范围的值 @chaishi ([#1723](https://github.com/Tencent/tdesign-react/pull/1723))
    -  新增和减少按钮支持 `allowInputOverLimit ` @chaishi ([#1727](https://github.com/Tencent/tdesign-react/pull/1727))
- `ColorPicker`: 增加对OnChange事件区分最近使用和预设的颜色的点击事件 @josonyang ([#1722](https://github.com/Tencent/tdesign-react/pull/1722))
- `Table`: 减少表格渲染次数，[issue#1731](https://github.com/Tencent/tdesign-react/issues/1731) @chaishi ([#1732](https://github.com/Tencent/tdesign-react/pull/1732))
- `TreeSelect`: 优化`checkable`时点击非叶子节点选中的问题 @uyarn ([#1734](https://github.com/Tencent/tdesign-react/pull/1734))
- `Dialog`:  优化关闭动画不流畅问题 @honkinglin ([#1729](https://github.com/Tencent/tdesign-react/pull/1729))
- `Other`: 兼容 React 18 render 警告 @honkinglin ([#1718](https://github.com/Tencent/tdesign-react/pull/1718))

### 🐞 Bug Fixes
- `InputNumber`: 修复上个版本无法输入小数点问题 @chaishi ([#1723](https://github.com/Tencent/tdesign-react/pull/1723))
- `Select`: 支持valueDisplay API在单选模式的使用 @uyarn ([#1733](https://github.com/Tencent/tdesign-react/pull/1733))
- `Table`: 
    - 吸底表尾默认位置不正确 @chaishi ([#1737](https://github.com/Tencent/tdesign-react/pull/1737))
    - 添加依赖到 `onRuleChange`，以保证数据最新 @chaishi ([#1739](https://github.com/Tencent/tdesign-react/pull/1739))
- `Popup`: 修复 `delay` 无效问题 @honkinglin ([#1740](https://github.com/Tencent/tdesign-react/pull/1740))


## 🌈 0.43.0 `2022-11-17` 
### ❗ Breaking Changes
- `Comment/Slider/ImageViewer`: 组件 DOM 结构调整，有覆盖样式的同学请关注 @honkinglin ([#1785](https://github.com/Tencent/tdesign-react/pull/1707)、[#1794](https://github.com/Tencent/tdesign-react/pull/1708)、[#1788](https://github.com/Tencent/tdesign-react/pull/1711))
- 部分组件间距、尺寸等样式统一调整，支持使用尺寸相关Design Token调整间距、尺寸大小 @uyarn ([common #993](https://github.com/Tencent/tdesign-common/pull/993)) @Wen1kang ([common #977](https://github.com/Tencent/tdesign-common/pull/977)) 

### 🚀 Features
- `Breadcrumb`: 新增`icon` API @uyarn ([#1702](https://github.com/Tencent/tdesign-react/pull/1702))
- `Select`: 支持使用Option Children形式时使用过滤等功能 @uyarn ([#1715](https://github.com/Tencent/tdesign-react/pull/1715))
### 🐞 Bug Fixes
- `swiper`: swiper控制current交互和正常保持一致 @duenyang ([#1693](https://github.com/Tencent/tdesign-react/pull/1693))
- `Loading`: 处理loading在dialog等场景中样式异常的问题 @uyarn ([#1694](https://github.com/Tencent/tdesign-react/pull/1694))
- `Breadcrumbe`: 修复文字省略样式丢失的问题 @uyarn ([#1702](https://github.com/Tencent/tdesign-react/pull/1702))
- `popconfirm`: 修复官网demo气泡框描述文案字体颜色 @iLunZ ([#1705](https://github.com/Tencent/tdesign-react/pull/1705))
- `InputNumber`: 组件支持受控 @chaishi ([#1703](https://github.com/Tencent/tdesign-react/pull/1703))
- `Form`: 修复拦截 checkbox 默认值为 undefined 控制台警告问题 @honkinglin ([#1682](https://github.com/Tencent/tdesign-react/pull/1682))
- `popconfirm`: 修复官网demo气泡框描述文案字体颜色 @iLunZ ([#1705](https://github.com/Tencent/tdesign-react/pull/1705))
- `TreeSelect`:
    - 当 valueType="object" 且 value 不在 tree.data 中时, 优先展示  @moecasts ([#1681](https://github.com/Tencent/tdesign-react/pull/1681))
    - 修复浮层样式问题 @honkinglin ([#1689](https://github.com/Tencent/tdesign-react/pull/1689))
    - 暴露 treeRef 的方法 @moecasts ([#1698](https://github.com/Tencent/tdesign-react/pull/1698))
- `Tooltip`: 修复非受控问题 @honkinglin ([#1712](https://github.com/Tencent/tdesign-react/pull/1712))

## 🌈 0.42.6 `2022-11-07` 
### 🚀 Features
- `Guide`: support guide component @Yilun-Sun ([#1581](https://github.com/Tencent/tdesign-react/pull/1581))

### 🐞 Bug Fixes
- `Table`: 当禁用resizable时，基础表格表头默认使用用户定义的列宽 @ZTao-z ([#1662](https://github.com/Tencent/tdesign-react/pull/1662))
- `Dropdown`: 修复Children变化时没有重新渲染的异常 @uyarn ([#1673](https://github.com/Tencent/tdesign-react/pull/1673))
- `Select`:
    - 修复选项文案过程内容未正确显示的问题 @uyarn ([#1676](https://github.com/Tencent/tdesign-react/pull/1676))
    - 修复可过滤选择器选中项目失去焦点选中失败问题 @honkinglin ([#1675](https://github.com/Tencent/tdesign-react/pull/1675))
- `InputNumber`: 修复最小值为0仍可点击减号至-1的问题 @lilonghe @uyarn ([#1676](https://github.com/Tencent/tdesign-react/pull/1676))
- `Input`: 修复在输入框进行预渲染处于 `display: none` 状态时，宽度计算不正确问题，[tdesign-vue#1678](https://github.com/Tencent/tdesign-vue/issues/1678) @chaishi ([#1669](https://github.com/Tencent/tdesign-react/pull/1669))
- `Pagination`: 修复 `selectProps` warn @chaishi ([#1669](https://github.com/Tencent/tdesign-react/pull/1669))
- `Form`: 修复提交后 onChange 校验不清除状态问题 @honkinglin ([#1664](https://github.com/Tencent/tdesign-react/pull/1664))
- `TreeSelect`: 修复 valueDisplay 和 filterable 同时设置时的显示问题 @moecasts ([#1674](https://github.com/Tencent/tdesign-react/pull/1674))

## 🌈 0.42.5 `2022-11-02` 
### 🚀 Features
- `Collapse`: 支持 expandIcon 属性 @asbstty ([#1651](https://github.com/Tencent/tdesign-react/pull/1651))
- `Pagination`: 透传`selectProps` 和 `selectProps.popupProps` 到组件 `Pagination`，以便实现挂载节点等复杂场景需求， [issue#1611](https://github.com/Tencent/tdesign-react/issues/1611) @chaishi ([#1638](https://github.com/Tencent/tdesign-react/pull/1638))
- `Input`:
    - 支持在输入框实时显示数字限制 @chaishi ([#1635](https://github.com/Tencent/tdesign-react/pull/1635))
    - 支持对 `unicode` 字符长度的判定 @chaishi ([#1635](https://github.com/Tencent/tdesign-react/pull/1635))

### 🐞 Bug Fixes
- `Form`: 修复不同 trigger 下校验结果互相覆盖问题 @honkinglin ([#1630](https://github.com/Tencent/tdesign-react/pull/1630))
- `Cascader`: 修复出现重复的 `options` @pengYYYYY ([#1628](https://github.com/Tencent/tdesign-react/pull/1628))
- `Table`:
    - 提高 `dragSortOptions` 优先级，以便父组件自定义全部参数，[issue#1556](https://github.com/Tencent/tdesign-react/issues/1556) @chaishi ([#1638](https://github.com/Tencent/tdesign-react/pull/1638))
    - 修复可编辑表格，行编辑，数据校验问题，[issue#1514](https://github.com/Tencent/tdesign-react/issues/1514) @chaishi ([#1638](https://github.com/Tencent/tdesign-react/pull/1638))
    - 修复吸顶表头超出省略问题，[tdesign-vue#1639](https://github.com/Tencent/tdesign-vue/issues/1639) @chaishi ([#1638](https://github.com/Tencent/tdesign-react/pull/1638))
- `Input`:
    - 输入框达到数量 `maxlength` 时，无法删除且无法修改输入框内容，[issue#1633](https://github.com/Tencent/tdesign-react/issues/1633) @chaishi ([#1635](https://github.com/Tencent/tdesign-react/pull/1635))
    - 修复聚焦的时候未恢复 format 之前的值问题 [issue#1634](https://github.com/Tencent/tdesign-react/issues/1634) @chaishi ([#1635](https://github.com/Tencent/tdesign-react/pull/1635))
- `Datepicker`: 修复 `popupProps.onVisibleChange` 方法不能正常触发的问题 @xiaosansiji ([#1644](https://github.com/Tencent/tdesign-react/pull/1644))
- `Button`: 修复动画在disabled状态切换后失效的问题 @uyarn ([#1653](https://github.com/Tencent/tdesign-react/pull/1653))
- `Pagination`: 修复相同页码也会触发onChange的问题 @honkinglin ([#1650](https://github.com/Tencent/tdesign-react/pull/1650))
- `Message`: 支持异步渲染组件 @kenzyyang ([#1641](https://github.com/Tencent/tdesign-react/pull/1641))
- `DatePicker`: 修复单选日期时间无法确定问题 @honkinglin ([#1645](https://github.com/Tencent/tdesign-react/pull/1645))

## 🌈 0.42.4 `2022-10-26` 
### 🚀 Features
- `Tag`: 样式优化，实现 light-outline 风格 @HelKyle ([#1590](https://github.com/Tencent/tdesign-react/pull/1590))
- `Upload`: 多图片上传，图片文件名支持 `abridgeName` @chaishi ([#1616](https://github.com/Tencent/tdesign-react/pull/1616))
- `Comment`: 样式优化 @zhangpaopao0609 ([#1614](https://github.com/Tencent/tdesign-react/pull/1614))
- `InputAdornment`: 样式优化 @zhangpaopao0609 ([#1606](https://github.com/Tencent/tdesign-react/pull/1606))

### 🐞 Bug Fixes
- `Drawer`: 修复浮层关闭后聚焦问题 @NWYLZW ([#1591](https://github.com/Tencent/tdesign-react/pull/1591))
- `Input`: 修复 input 限制字符无效问题 @honkinglin ([#1624](https://github.com/Tencent/tdesign-react/pull/1624))
- `Slider`: 修复 slider marks 为 object 时刻度位置异常 @HelKyle ([#1600](https://github.com/Tencent/tdesign-react/pull/1600))
- `Popup`: 兼容 trigger 元素获取异常报错问题 @honkinglin ([#1626](https://github.com/Tencent/tdesign-react/pull/1626))
- `Form`: 调整 `requireMark `、`showErrorMessage`等默认值 @honkinglin ([#1602](https://github.com/Tencent/tdesign-react/pull/1602))
- `Select`: 修复 onChange 回调参数缺失问题 @uyarn ([#1603](https://github.com/Tencent/tdesign-react/pull/1603))
- `Swiper`: 当轮播只有一个时，点击左侧按钮后，按钮失效问题 @yatessss ([#1604](https://github.com/Tencent/tdesign-react/pull/1604))
- `Dropdown`:
    - 修复子组件平铺渲染时渲染异常的问题 @uyarn ([#1599](https://github.com/Tencent/tdesign-react/pull/1599))
    - 修复无法使用三元表达式渲染item组件的问题 @uyarn ([#1599](https://github.com/Tencent/tdesign-react/pull/1599))
- `Upload`:
    - 修复 `name` 无效问题 @chaishi ([#1616](https://github.com/Tencent/tdesign-react/pull/1616))
    - 图片上传，自定义上传方法不支持图片回显问题 @chaishi ([#1616](https://github.com/Tencent/tdesign-react/pull/1616))
    - 修复结果无法识别 `interface` 文件问题，[issue#1586](https://github.com/Tencent/tdesign-react/issues/1586) @chaishi ([#1616](https://github.com/Tencent/tdesign-react/pull/1616))
    - 修复 Form 控制禁用状态失效问题 @chaishi ([#1621](https://github.com/Tencent/tdesign-react/pull/1621))
- `Tabs`:
    - 支持 list api @NWYLZW ([#1598](https://github.com/Tencent/tdesign-react/pull/1598))
    - 修复 activeId 下划线不能跟随内容变动而变化的问题 @insekkei ([#1607](https://github.com/Tencent/tdesign-react/pull/1607))

### 🚧 Others
- 测试框架切换至 vitest @honkinglin ([#1596](https://github.com/Tencent/tdesign-react/pull/1596))

## 🌈 0.42.3 `2022-10-14` 
### 🚀 Features
- `Form`: 调整 requiredMark api 可独立控制星号展示 @honkinglin ([#1580](https://github.com/Tencent/tdesign-react/pull/1580))
### 🐞 Bug Fixes
- `Table`:
    - 唯一 key 不再和 rowIndex 相加，避免重复问题 @chaishi ([#1594](https://github.com/Tencent/tdesign-react/pull/1594))
    - 拖拽排序失效问题，primaryTableRef 丢失 @chaishi ([#1594](https://github.com/Tencent/tdesign-react/pull/1594))
-  `DatePicker`: 修复 range 数据格式化异常问题 @honkinglin ([#1587](https://github.com/Tencent/tdesign-react/pull/1587))
- `Collapse`:  修复 defaultExpandAll 属性没有生效 & 包含 form 表单的时候样式出现溢出问题 @duanbaosheng ([#1579](https://github.com/Tencent/tdesign-react/pull/1579))
- `Form`: 修复 `getInternalHooks` 警告问题 @honkinglin ([#1577](https://github.com/Tencent/tdesign-react/pull/1577))

## 🌈 0.42.2 `2022-10-09` 
### 🚀 Features
- `Select`: 调整下拉交互 允许输入时不关闭下拉面板 减少相关交互问题 @uyarn ([#1570](https://github.com/Tencent/tdesign-react/pull/1570))
- `DatePicker`: 支持`valueType` API @honkinglin ([#1554](https://github.com/Tencent/tdesign-react/pull/1554))
- `Table`:
    - 新增 `showHeader`，支持隐藏表头 @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 新增 `column.colKey = serial-number`，支持序号列功能，[#1517](https://github.com/Tencent/tdesign-vue-next/issues/1517) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 新增 `showSortColumnBgColor`，用于控制是否显示排序列背景色 @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 支持属性 `tree.treeNodeColumnIndex` 动态修改， [#1487](https://github.com/Tencent/tdesign-vue-next/issues/1487) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 表格列属性 `attrs` 支持自定义任意单元格属性 @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 新增列属性 `colspan`，用于设置单行表头合并 @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 超出省略功能，支持同时设置省略浮层内容 `ellipsis.content` 和属性透传 `ellipsis.props` @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 支持泛型 @chaishi ([#1552](https://github.com/Tencent/tdesign-react/pull/1552))

### 🐞 Bug Fixes
- `InputNumber`: 输入中文或特殊符号时，清空数字为 `undefined` @chaishi ([#1553](https://github.com/Tencent/tdesign-react/pull/1553))
- `Upload`:
    - 请求支持带上自定义 `headers` @chaishi ([#1553](https://github.com/Tencent/tdesign-react/pull/1553))
    - 请求支持 `withCredentials` @chaishi ([#1553](https://github.com/Tencent/tdesign-react/pull/1553))
    - 添加参数 `response` 到事件 `onSuccess`，单文件是对象，多文件是数组，[tdesign-vue-next#1774](https://github.com/Tencent/tdesign-vue-next/issues/1774) @chaishi ([#1558](https://github.com/Tencent/tdesign-react/pull/1558))
- `Card`: 修复`shadow` API不生效的问题 @Flower-F ([#1555](https://github.com/Tencent/tdesign-react/pull/1555))
- `Select`: 修复新创建的条目与已有项重复时重复显示的问题 @samhou1988 ([#1550](https://github.com/Tencent/tdesign-react/pull/1550))
- `TreeSelect`: 修复 filterable 时，点击 treeselect 闪的问题 @HelKyle ([#1569](https://github.com/Tencent/tdesign-react/pull/1569))
- `Form`: 修复 FormList 动态设置节点初始值丢失问题 @honkinglin ([#1571](https://github.com/Tencent/tdesign-react/pull/1571))
- `Input`: 兼容异步渲染组件计算宽度异常情况 @honkinglin ([#1568](https://github.com/Tencent/tdesign-react/pull/1568))
- `Table`:
    - 筛选功能，修复 `filterRow={null}` 无法隐藏过滤行问题，[issue#1438](https://github.com/Tencent/tdesign-react/issues/1438) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 树形结构，叶子节点缩进距离修正 @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 超出省略功能，`ellipsisTitle`优先级应当高于 `ellipsis`， [tdesign-vue#1404](https://github.com/Tencent/tdesign-vue/issues/1404) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 行选中功能，修复 `column.type=single` 时，`column.title` 无效问题，[issue#1372](https://github.com/Tencent/tdesign-vue/issues/1372) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 过滤功能，`list.value` 值为 `number` 无法高亮过滤图标问题 @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 行选中功能，数据变化时，选中的数据依旧是变化前的数据，[#1722](https://github.com/Tencent/tdesign-vue-next/issues/1722) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
    - 不提供`expandedRowKeys`的绑定会报错 ，缺少判空，[#1704](https://github.com/Tencent/tdesign-vue-next/issues/1704) @chaishi ([#1566](https://github.com/Tencent/tdesign-react/pull/1566))
- `Dialog`: 修复初次点击内容区域移到 mask 区域后关闭弹窗问题 @honkinglin ([#1573](https://github.com/Tencent/tdesign-react/pull/1573))
- `Pagination`: 修复 `jumper` 输入框联动问题 @honkinglin ([#1574](https://github.com/Tencent/tdesign-react/pull/1574))


## 🌈 0.42.1 `2022-09-27` 
### 🚀 Features
- `Form`: 
    - `FormList` name 支持传入数组 @honkinglin ([#1518](https://github.com/Tencent/tdesign-react/pull/1518))
    - `FormItem` 支持函数渲染子节点 @honkinglin ([#1518](https://github.com/Tencent/tdesign-react/pull/1518))
    - `FormItem` 支持 shouldUpdate api 自定义控制渲染时机 @honkinglin ([#1518](https://github.com/Tencent/tdesign-react/pull/1518))
- `Upload`:
    - 所有风格支持 `tips` 和 `status`，用于定义说明文本 @chaishi ([#1524](https://github.com/Tencent/tdesign-react/pull/1524))
    - 支持 `files` 数据类型泛型 @chaishi ([#1524](https://github.com/Tencent/tdesign-react/pull/1524))
- `Table`: 新增 column.resizable 支持自定义任意列是否可拖拽调整宽度 @ZTao-z ([#1535](https://github.com/Tencent/tdesign-react/pull/1535))
- `Tooltip`: 新增lite模式子组件，rate/imageviewer改用lite版本 @carolin913 ([#1546](https://github.com/Tencent/tdesign-react/pull/1546))
- `TimePicker`:  优化边距 ui @wanghanzhen ([#1531](https://github.com/Tencent/tdesign-react/pull/1531))
- `ImageViewer`:  优化内部 dom 节点class bem 命名规范 @Ylushen ([#1533](https://github.com/Tencent/tdesign-react/pull/1533))

### 🐞 Bug Fixes
- `Upload`:
    - 修复无法多次拖拽上传文件问题 @chaishi ([#1524](https://github.com/Tencent/tdesign-react/pull/1524))
    - 修复文件大小超出时无法显示错误问题 @chaishi ([#1524](https://github.com/Tencent/tdesign-react/pull/1524))
    - 修复文件上传进度仅显示 0% 和 100%，缺少中间进度 问题 @chaishi ([#1524](https://github.com/Tencent/tdesign-react/pull/1524))
- `Input`:
    - 修复input的 autoWidth 配置开启下,计算宽度时取的 placeholder不正确问题 @yusongH ([#1537](https://github.com/Tencent/tdesign-react/pull/1537))
    - 修复默认状态提示文字颜色错误问题 @xiaosansiji ([#1486](https://github.com/Tencent/tdesign-react/pull/1486))
- `TimePicker`: 修复部分场景滚动异常无法选中23:59:59的问题 @uyarn ([#1511](https://github.com/Tencent/tdesign-react/pull/1511))
- `Dropdown`: 修复点击选项没有触发onVisibleChange的问题 @uyarn ([#1516](https://github.com/Tencent/tdesign-react/pull/1516))
- `Tree`: 支持树可拖拽 @HelKyle ([#1534](https://github.com/Tencent/tdesign-react/pull/1534))
- `Select`: 修复Select组件多选情况下禁用组件后还能点击删除选项的问题 @AqingCyan ([#1529](https://github.com/Tencent/tdesign-react/pull/1529))
- `TagInput`: 修复 react 16 版本 event 对象缺失 code 属性判断错误 @honkinglin ([#1526](https://github.com/Tencent/tdesign-react/pull/1526))
- `DatePicker`:  修复输入框清空后关闭弹窗未重置问题 @honkinglin ([#1543](https://github.com/Tencent/tdesign-react/pull/1543))

## 🌈 0.42.0 `2022-09-20` 
### ❗ Breaking Changes
- `DatePicker`: 移除 `valueType` api，可使用返回的 dayjs 对象自行格式化 @honkinglin ([#1487](https://github.com/Tencent/tdesign-react/pull/1487))
- `Select`: 移除 `onVisibleChange`、`bordered` 多余 api，可使用 `onPopupVisibleChange`、`borderless` 替代 @honkinglin ([#1505](https://github.com/Tencent/tdesign-react/pull/1505))

### 🚀 Features
- `Form`: 新增 `useWatch` hook @honkinglin ([#1490](https://github.com/Tencent/tdesign-react/pull/1490))
- `DatePicker`:
    - 优化动态更新年份滚动交互体验 @honkinglin ([#1502](https://github.com/Tencent/tdesign-react/pull/1502))
    - 优化二次修改日期不规范时清空另一侧数据 @honkinglin ([#1492](https://github.com/Tencent/tdesign-react/pull/1492))

### 🐞 Bug Fixes
- `Icon`: 修复使用 `classprefix` 替换组件前缀对图标的影响 [#common842](https://github.com/Tencent/tdesign-common/pull/842) @uyarn @honkinglin ([#1500](https://github.com/Tencent/tdesign-react/pull/1500))
- `Cascader`: 修复 `options` 动态设置为空失效 @pengYYYYY ([#1501](https://github.com/Tencent/tdesign-react/pull/1501))
- `Checkbox`: 修复非规范属性引起的告警  @leosxie ([#1496](https://github.com/Tencent/tdesign-react/pull/1496))
- `TagInput`: 修复清除按钮未调用 `onClear ` 事件 @pengYYYYY ([#1506](https://github.com/Tencent/tdesign-react/pull/1506))
- `Select`: 修复透传 `tagProps` 属性失败问题 @honkinglin ([#1497](https://github.com/Tencent/tdesign-react/pull/1497))
- `Notification`: 修复 offset 定位问题 @kenzyyang ([#1504](https://github.com/Tencent/tdesign-react/pull/1504))
- `SelectInput`:
    - 修复select-input使用valueDisplay渲染自定义tag筛选项展示居中错误 @AqingCyan ([#1503](https://github.com/Tencent/tdesign-react/pull/1503))
    - 修复 SelectInput 自适应换行问题 @honkinglin ([#1500](https://github.com/Tencent/tdesign-react/pull/1500))

### 🚧 Others
- 修复 lodash 全量导入问题 @honkinglin ([#1491](https://github.com/Tencent/tdesign-react/pull/1491))

## 🌈 0.41.1 `2022-09-14` 
### 🚀 Features
- `Upload`:
    - 自定义方法 `requestMethod`参数在单文件时文件对象，多文件上传时，是数组文件对象 @chaishi ([#1484](https://github.com/Tencent/tdesign-react/pull/1484))
    - `trigger/dragContent` 参数使用 `files` 而非 `displayFiles` @chaishi ([#1484](https://github.com/Tencent/tdesign-react/pull/1484))
- `ImageViewer`:
    - 新增 `title`属性，作为相册标题展示 @Ylushen ([#1471](https://github.com/Tencent/tdesign-react/pull/1471))
    - 适配移动端展示 @honkinglin ([#1480](https://github.com/Tencent/tdesign-react/pull/1480))
- `DatePicker`: 支持二次更改时间选择器时可单次变更日期 @honkinglin ([#1478](https://github.com/Tencent/tdesign-react/pull/1478))
- `Table`: 优化列宽调整策略 @ZTao-z ([#1483](https://github.com/Tencent/tdesign-react/pull/1483))

### 🐞 Bug Fixes
- `TreeSelect`: 修复 data 异步更新，input 值没有及时更新的问题 @HelKyle ([#1481](https://github.com/Tencent/tdesign-react/pull/1481))


## 🌈 0.41.0 `2022-09-13` 
### ❗ Breaking Changes
- 支持 `es module` 导出不带样式产物，调整 lib 包内容，新增 `cjs` 产物支持 `commonjs` 导出不带样式产物 @honkinglin ([#1455](https://github.com/Tencent/tdesign-react/pull/1455))

### 🚀 Features
- `Popup`: 支持 `popperOptions`、`delay`、`hideEmptyPopup` api @honkinglin ([#1444](https://github.com/Tencent/tdesign-react/pull/1444))
- `Upload`: 
    -  重构 upload 组件，修复众多问题，支持更多 api
    - `UploadFile` 对象新增 `uploadTime` 属性，用于表示上传时间 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - `theme=file` 支持多文件上传 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 文件上传前处理函数 `beforeUpload` 存在时，依然支持 `sizeLimit` 检测 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 新增`beforeAllFilesUpload`，所有文件上传之前执行，支持一次性判定所有文件是否继续上传。已经存在的 `beforeUpload` 用于判定单个文件的是否继续上传 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 新增事件 `onValidate`，文件校验不通过时触发，可能情况有：自定义全文件校验不通过、文件数量校验不通过、文件数量校验不通过、文件名重复（允许重复文件名场景下不会触发）等 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 新增事件 `onOneFileSuccess` ，多文件上传场景下，在单个文件上传成功后触发 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 新增事件 `onOneFileFail` ，多文件上传场景下，在单个文件上传失败后触发 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 新增 `formatRequest` 用于新增或修改上传请求参数（现有的 `format` 用于格式化文件对象） @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
    - 新增 `triggerButtonProps` 用于指定文件选择触发按钮风格 @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))

### 🐞 Bug Fixes
- `Dropdown`:
    - 优化dropdown样式细节 @uyarn ([#1440](https://github.com/Tencent/tdesign-react/pull/1440))
    - 修复 value 缺失点击异常 @HelKyle ([#1465](https://github.com/Tencent/tdesign-react/pull/1465))
- `RangeInput`: 优化 icon 居中展示的问题 @honkinglin ([#1447](https://github.com/Tencent/tdesign-react/pull/1447))
- `DatePicker`: 修复 `cellClick` 返回日期错误 @honkinglin ([#1458](https://github.com/Tencent/tdesign-react/pull/1458))
- `Tabs`: 修复未替换部分classPrefix导致样式异常的问题 @uyarn ([#1476](https://github.com/Tencent/tdesign-react/pull/1476))
- `tree`: 修复 `disabled` 下不可展开的问题 @uyarn ([#1474](https://github.com/Tencent/tdesign-react/pull/1474))
- `Upload`: 修复 `autoUpload=false` 时，没有触发 `onChange` 事件问题（可能存在 breaking change） @chaishi ([#1461](https://github.com/Tencent/tdesign-react/pull/1461))
- `Popup`: 修复 ref 透传丢失属性问题 @honkinglin ([#1468](https://github.com/Tencent/tdesign-react/pull/1468))
- `Select`: 修复布尔值选中没有显示对应的文字问题 @samhou1988 ([#1441](https://github.com/Tencent/tdesign-react/pull/1441))


## 🌈 0.40.6 `2022-09-06` 
### 🚀 Features
- `Table`:
    - 树形结构，新增 `getTreeExpandedRow`，用于获取展开的树形节点，[issue#1309](https://github.com/Tencent/tdesign-react/issues/1309) @chaishi ([#1420](https://github.com/Tencent/tdesign-react/pull/1420))
    - 可编辑单元格，`edit.rules` 新增数据类型 `function`，用于动态设置校验规则，[tdesign-vue-next#1472](https://github.com/Tencent/tdesign-vue-next/issues/1472) @chaishi ([#1420](https://github.com/Tencent/tdesign-react/pull/1420))
    - 文本超出省略由 `Popup` 更为 `Tooltip`，方便定义提醒文本主题色，[issue#1369](https://github.com/Tencent/tdesign-react/issues/1369) @chaishi ([#1420](https://github.com/Tencent/tdesign-react/pull/1420))
- `Dropdown`:  
    - 支持下拉菜单项自定义不同主题 @Isabella327 @uyarn ([#1434](https://github.com/Tencent/tdesign-react/pull/1434))
    - 支持下拉菜单项向左展开 @uyarn  @uyarn ([#1434](https://github.com/Tencent/tdesign-react/pull/1434))
    - 优化下拉菜单的样式 @Isabella327 @uyarn  @uyarn ([#1434](https://github.com/Tencent/tdesign-react/pull/1434))
- `Nofitication`: 插件模式支持config @carolin913 ([#1417](https://github.com/Tencent/tdesign-react/pull/1417))

### 🐞 Bug Fixes
- `InputAdornment`: 修复formItem 包裹 inputAdornment 组件 onChange 冲突问题 @honkinglin ([#1419](https://github.com/Tencent/tdesign-react/pull/1419))
- `TimePicker`: 修复边界滚动异常问题 @HelKyle ([#1426](https://github.com/Tencent/tdesign-react/pull/1426))
- `Cascader`:
    - 修复 `loadingText` 无效 ([vue-next #1555](https://github.com/Tencent/tdesign-vue-next/issues/1555)) @pengYYYYY ([#1428](https://github.com/Tencent/tdesign-react/pull/1428))
    - 修复 `value` 为 `number` 类型时有告警 ([vue-next #1570](https://github.com/Tencent/tdesign-vue-next/issues/1570)) @pengYYYYY ([#1428](https://github.com/Tencent/tdesign-react/pull/1428))
    - 修复在输入时 `entry` 键会默认全选第一个选项的全部内容 ([vue-next #1529](https://github.com/Tencent/tdesign-vue-next/issues/1529)) @pengYYYYY ([#1428](https://github.com/Tencent/tdesign-react/pull/1428))
    - 修复通过 `SelectInputProps`  透传方法属性导致传入 `SelectInput` 的数据变成的数组 ([vue-next #1502](https://github.com/Tencent/tdesign-vue-next/issues/1502)) @pengYYYYY ([#1428](https://github.com/Tencent/tdesign-react/pull/1428))
    - 修复多选状态下点击 `label` 展开子级表现异常 @pengYYYYY ([#1428](https://github.com/Tencent/tdesign-react/pull/1428))
- `Nofitication`: 修复 classname 透传问题，closebtn/icon 无法支持 bool 设置 @carolin913 ([#1417](https://github.com/Tencent/tdesign-react/pull/1417))
- `Table`: 
    - 修复 `editableCellState` 返回值与期望相反问题（Breaking Change） @chaishi ([#1420](https://github.com/Tencent/tdesign-react/pull/1420))
    - 修复表格部分元素无法随 table 变化而变化，如：空数据，[issue#1319](https://github.com/Tencent/tdesign-react/issues/1319) @chaishi ([#1420](https://github.com/Tencent/tdesign-react/pull/1420))
    - 修复全选时，事件参数`selectedRowData` 为空的问题 @chaishi ([#1420](https://github.com/Tencent/tdesign-react/pull/1420))
- `Alert`: 修复 close 不支持 function 类型 @carolin913 ([#1433](https://github.com/Tencent/tdesign-react/pull/1433))
- `Tabs`: 修复 debounce 问题 @HelKyle ([#1424](https://github.com/Tencent/tdesign-react/pull/1424))
- `TimePicker`: 修复 debounce 问题 @HelKyle ([#1424](https://github.com/Tencent/tdesign-react/pull/1424))
- `Table`: 修复 debounce 问题 @HelKyle ([#1424](https://github.com/Tencent/tdesign-react/pull/1424))
- `Popup`: 修复 debounce 问题 @HelKyle ([#1424](https://github.com/Tencent/tdesign-react/pull/1424))
- `Radio`:  修复 `onChange` 触发两次问题 @Lmmmmmm-bb ([#1422](https://github.com/Tencent/tdesign-react/pull/1422))
- `Button`: 调整loading状态的样式问题 @uyarn ([#1437](https://github.com/Tencent/tdesign-react/pull/1437))
- `Form`:
    - 兼容 FormItem 未定义字段调用 setFields 方法异常场景 @honkinglin ([#1394](https://github.com/Tencent/tdesign-react/pull/1394))
    - 禁用 input 输入框回车自动提交表单 @honkinglin ([#1403](https://github.com/Tencent/tdesign-react/pull/1403))
- `DatePicker`:
    - 修复 cell-click 事件失效问题 @honkinglin ([#1399](https://github.com/Tencent/tdesign-react/pull/1399))
    - 修复传入空字符串导致页面崩溃问题 @honkinglin ([#1418](https://github.com/Tencent/tdesign-react/pull/1418))
- `Message`: 修复更改前缀后插件调用展示异常问题 @kenzyyang ([#1431](https://github.com/Tencent/tdesign-react/pull/1431))


## 🌈 0.40.5 `2022-08-29` 
### 🚀 Features
- `Form`: 新增 `useForm` hook 获取 form 实例 & 支持 `initialData` 全局设置初始值 @honkinglin ([#1351](https://github.com/Tencent/tdesign-react/pull/1351))
- `DatePicker`: 优化不设置 `valueType` 场景下与 `format` 一致 @honkinglin ([#1382](https://github.com/Tencent/tdesign-react/pull/1382))
- `Dialog`:  非模态对话框优化拖拽事件鼠标表现 @huoyuhao ([#1355](https://github.com/Tencent/tdesign-react/pull/1355))
- `Transfer`: 支持 `showCheckAll` api @HelKyle ([#1385](https://github.com/Tencent/tdesign-react/pull/1385))

### 🐞 Bug Fixes
- `InputAdornment`: 修复在 form 组件下 disabled 设置问题 @honkinglin ([#1381](https://github.com/Tencent/tdesign-react/pull/1381))
- `Slider`: 修复点击 marks 触发 cannot read properties of null 异常 @PBK-B ([#1297](https://github.com/Tencent/tdesign-react/pull/1297))
- `Upload`: 支持受控使用时`files`可设置为null @uyarn ([#1358](https://github.com/Tencent/tdesign-react/pull/1358))
- `Popup`: 修复 popup 显示状态点击页面事件重复触发问题 @honkinglin ([#1371](https://github.com/Tencent/tdesign-react/pull/1371))
- `Alert`: 增加关闭动画 && 修复 `onClosed` 回调事件 @HelKyle ([#1368](https://github.com/Tencent/tdesign-react/pull/1368))
- `Select`: option 设置 content 未生效问题 @carolin913 ([#1383](https://github.com/Tencent/tdesign-react/pull/1383))
- `Table`:
    - 修复 tree-select 首次渲染出现 key 为 undefined 的问题 @HelKyle ([#1332](https://github.com/Tencent/tdesign-react/pull/1332))
    - 修复排序按钮的样式问题 @uyarn ([#1384](https://github.com/Tencent/tdesign-react/pull/1384))
    - 允许在表头分割线一定范围内触发列宽调整逻辑 @ZTao-z ([#1378](https://github.com/Tencent/tdesign-react/pull/1378))

## 🌈 0.40.4 `2022-08-22` 
### 🚀 Features
- `Table`: 
    - BaseTable 新增组件实例方法 `refreshTable`，用于父组件在特殊场景刷新表格 DOM 信息 @chaishi ([#1312](https://github.com/Tencent/tdesign-react/pull/1312))
    - PrimaryTable 新增 BaseTable 的全部组件实例方法 @chaishi ([#1312](https://github.com/Tencent/tdesign-react/pull/1312))
    - 支持行拖拽排序和列拖拽排序同时存在，[issue#1290](https://github.com/Tencent/tdesign-vue/issues/1290) @chaishi ([#1341](https://github.com/Tencent/tdesign-react/pull/1341))
    - 可编辑单元格/行功能，新增 `editableCellState` 用于控制单元格是否可编辑，([issue#1387](https://github.com/Tencent/tdesign-vue-next/issues/1387)) @chaishi ([#1341](https://github.com/Tencent/tdesign-react/pull/1341))
    - 可编辑单元格/行功能，新增 `edit.defaultEditable` 用于设置初始状态是否为编辑态 @chaishi ([#1341](https://github.com/Tencent/tdesign-react/pull/1341))
    - 行展开功能，新增事件参数 `currentRowData`，表示当前展开行，[issue#1296](https://github.com/Tencent/tdesign-react/issues/1296) @chaishi ([#1341](https://github.com/Tencent/tdesign-react/pull/1341))
- `Dialog`: 新增 `confirmOnEnter` API @huoyuhao ([#1328](https://github.com/Tencent/tdesign-react/pull/1328))
-  `Popup`: 支持 `overlayInnerClassName` api @honkinglin ([#1347](https://github.com/Tencent/tdesign-react/pull/1347))
- `Timeline`: 新增 `Timeline` 组件 @southorange1228 ([#1156](https://github.com/Tencent/tdesign-react/pull/1156))

### 🐞 Bug Fixes
- `Table`:
    - [吸顶表头，最后一列有 1px 未对齐](https://github.com/Tencent/tdesign-vue-next/issues/1434) @chaishi ([#1312](https://github.com/Tencent/tdesign-react/pull/1312))
    - 窗口变动时，固定列阴影效果更新 @chaishi ([#1312](https://github.com/Tencent/tdesign-react/pull/1312))
    - 修复可编辑行，联动数据校验问题，([issue#1444](https://github.com/Tencent/tdesign-vue-next/issues/1444)) @chaishi ([#1341](https://github.com/Tencent/tdesign-react/pull/1341))
    - 修复行选中功能，多选，分页数据异步加载，`onSelectChange` 参数 `selectedRowData` 数据不完整问题 @chaishi ([#1341](https://github.com/Tencent/tdesign-react/pull/1341))
- `Textarea`:
    - 修复 `maxlength` safari 浏览器兼容性问题 @carolin913 ([#1324]
    - 修复 `maxcharactor` 设置后中文拼音无法输入问题 @carolin913 ([#1324](https://github.com/Tencent/tdesign-react/pull/1324))
    - 修复出现在 dialog 无法 autosize 问题 @carolin913 ([#1324](https://github.com/Tencent/tdesign-react/pull/1324))
    - 修正 emoji 字符长度计算 @HelKyle ([#1331](https://github.com/Tencent/tdesign-react/pull/1331))
- `Cascader`: 修复 `value` 不是 options 的健值会报错 ([issue #1293](https://github.com/Tencent/tdesign-react/issues/1293)) @pengYYYYY ([#1342](https://github.com/Tencent/tdesign-react/pull/1342))
- `select`: 调整loading态显示优先于empty属性 @skytt ([#1343](https://github.com/Tencent/tdesign-react/pull/1343))
- `Input`: 修正 emoji 字符长度计算 @HelKyle ([#1331](https://github.com/Tencent/tdesign-react/pull/1331))

### 🚧 Others
- `Link`: 完善组件单元测试 @sommouns ([#1339](https://github.com/Tencent/tdesign-react/pull/1339))
- `Space`: 完善组件单元测试 @StephenArk30 ([#1337](https://github.com/Tencent/tdesign-react/pull/1337))
- `Steps`: 完善组件单元测试 @insekkei ([#1317](https://github.com/Tencent/tdesign-react/pull/1317))
- `Radio`: 完善组件单元测试 @Skyenought ([#1334](https://github.com/Tencent/tdesign-react/pull/1334))

## 🌈 0.40.3 `2022-08-17` 
### 🐞 Bug Fixes
- `Message`:  修复 `message` 主题设置失效 @kenzyyang ([#1310](https://github.com/Tencent/tdesign-react/pull/1310))
- `Tooltip`: 修复 `tooltip` 主题失效 @honkinglin ([#749](https://github.com/Tencent/tdesign-common/pull/749))

## 🌈 0.40.2 `2022-08-16` 
### 🐞 Bug Fixes
- `DatePicker`: 
    - 修复点击空白区域输入框被清空问题 @honkinglin ([#1306](https://github.com/Tencent/tdesign-react/pull/1306))
    - 修复 safari 下周选择器样式问题 @honkinglin ([#742](https://github.com/Tencent/tdesign-common/pull/742/files))

## 🌈 0.40.1 `2022-08-16` 
### 🐞 Bug Fixes
- `DatePicker`:  修复在左侧输入框聚焦时右侧面板切换月份失效问题 @honkinglin ([#1292](https://github.com/Tencent/tdesign-react/pull/1292))
- `Form`:  修复 FormItem status 受控问题 @honkinglin ([#1298](https://github.com/Tencent/tdesign-react/pull/1298))
- `Radio`:  修复 `Radio.Group` 反选问题 @carolin913 ([#1304](https://github.com/Tencent/tdesign-react/pull/1304))
- `Dropdown`:  
    - 修复 `DropdownMenu` 属性透传问题 @carolin913 ([#1304](https://github.com/Tencent/tdesign-react/pull/1304))
    - 修复下拉菜单展开位置的异常 @uyarn ([#1300](https://github.com/Tencent/tdesign-react/pull/1300))


## 🌈 0.40.0 `2022-08-15` 
### ❗ Breaking Changes
- `Popup` : 重构了该组件，修复了较多问题 @honkinglin ([#1256](https://github.com/Tencent/tdesign-react/pull/1256)):  
    - 不再生成 div 节点包裹 trigger 元素，`className`、`style` 属性废弃，可自行包裹 div 节点调整 `className`、`style` 属性。
    - `overlayStyle` 调整为控制 `t-popup` 层级，新增 `overlayInnerStyle` 控制 `t-popup__content` 层级与原先 `overlayStyle` 效果一致。
    - `overlayClassName` 调整为控制 `t-popup` 层级。

### 🚀 Features
- `Image`:  新增 `Image` 组件 @insekkei ([#1209](https://github.com/Tencent/tdesign-react/pull/1209))
- `Link`:  新增 `Link` 组件 @zFitness ([#1277](https://github.com/Tencent/tdesign-react/pull/1277))
- `Table`:
    - 支持使用插槽 `footer-summary` 定义通栏表尾，同时支持同名属性 Props `footer-summary` 渲染通栏表尾 @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    - 由于表格支持定义多行表尾，因而本次支持使用 `rowspanAndColspanInFooter` 定义表尾行数据合并单元格，使用方法同 `rowspanAndColspan` @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    - 支持 `min-width` 透传到元素 `<col>` @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    -  新增 `cellEmptyContent`，当列数据为空时显示指定值 @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    - 可编辑行功能，新增实例方法 `validate`，支持校验表格内的全部数据 @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
- `DatePicker`: 
    - 支持季度国际化配置 @honkinglin ([#1261](https://github.com/Tencent/tdesign-react/pull/1261))
    - 支持滚动年份选择器自动加载更多年份 @honkinglin ([#1263](https://github.com/Tencent/tdesign-react/pull/1263))
- `InputNumber`:  重构组件，支持16 位大数字 @honkinglin ([#1266](https://github.com/Tencent/tdesign-react/pull/1266))
- `Icon`: 新增 qq、wechat、wecom、relativity 和 pin-filled 等图标 @uyarn ([#1289](https://github.com/Tencent/tdesign-react/pull/1289))
- `Message`:  支持 `config` api @kenzyyang ([#1239](https://github.com/Tencent/tdesign-react/pull/1239))
- `Form`:  `FormItem` 支持 `status`、`tips` 自定义控制校验状态及提示信息 @honkinglin ([#1288](https://github.com/Tencent/tdesign-react/pull/1288))

### 🐞 Bug Fixes
- `Table`:
    - 行选中会触发重置列宽调整的结果 @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    - 可编辑行功能，提交校验时只校验了第一列 @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    - 列配置功能，带边框模式，移除分页组件边框下方多余的边框 @chaishi ([#1259](https://github.com/Tencent/tdesign-react/pull/1259))
    - 列宽度和小于表宽的情况下，调整列宽的结果与预期不符 @ZTao-z ([#1284](https://github.com/Tencent/tdesign-react/pull/1284))
- `Progress`: 修复`progress` style属性失效的问题 @NWYLZW ([#1260](https://github.com/Tencent/tdesign-react/pull/1260))
- `Cascader`: 修复点击清除按钮无法一次性清空所有选项 ([issue #1236](https://github.com/Tencent/tdesign-react/issues/1236)) @pengYYYYY ([#1275](https://github.com/Tencent/tdesign-react/pull/1275))
- `Select`: 修复autoWidth在multiple模式下失效的问题 @uyarn ([#1279](https://github.com/Tencent/tdesign-react/pull/1279))
- `Tabs`: 修复动态渲染 `panel` 下划线丢失问题 @NWYLZW ([#1258](https://github.com/Tencent/tdesign-react/pull/1258))
- `Layout`:  修复 `width`、`height` 不生效问题 @southorange1228 ([#1287](https://github.com/Tencent/tdesign-react/pull/1287))
- `Popup`: 修复函数组件未透传 ref 导致气泡失效问题 @honkinglin ([#1256](https://github.com/Tencent/tdesign-react/pull/1256))


## 🌈 0.39.0 `2022-08-08` 
### ❗ Breaking Changes
- `Pagination`: 调整快速跳转样式，`simple` 主题下合并分页控制器与快速跳转控制器 @honkinglin ([#1242](https://github.com/Tencent/tdesign-react/pull/1242))
- `Tooltip`: 调整 `theme` 主题文字颜色和背景色  @honkinglin([#703](https://github.com/Tencent/tdesign-common/pull/703))

### 🚀 Features
- 新增字体相关CSS Token，支持通过CSS Token修改字体相关配置 具体请参考 [font tokens](https://github.com/Tencent/tdesign-common/blob/develop/style/web/theme/_font.less)
- 主题生成器: 支持字体相关配置
- `Icon`: 优化全局 `Icon` 属性类型 @uyarn ([#1219](https://github.com/Tencent/tdesign-react/pull/1219))
- `form`: `setFields` 支持 `validateMessage` 参数 @honkinglin ([#1226](https://github.com/Tencent/tdesign-react/pull/1226))
- `ImageViewer`: 新增ImageViewer组件 @Ylushen ([#954](https://github.com/Tencent/tdesign-react/pull/954))
- `Rate`: 支持 `icon` 属性 @honkinglin ([#1211](https://github.com/Tencent/tdesign-react/pull/1211))
- `Popup`: 优化内容为空时不展示气泡 @southorange1228 ([#1222](https://github.com/Tencent/tdesign-react/pull/1222))
- `ColorPicker`: 面板 ui 优化 @insekkei ([#1048](https://github.com/Tencent/tdesign-react/pull/1048))

### 🐞 Bug Fixes
- `Table`: 
    - 多级表头场景下，修复表尾信息不对齐问题 @chaishi ([#1207](https://github.com/Tencent/tdesign-react/pull/1207))
    - 树形结构，修复某些场景下无法完全重置数据的问题 @chaishi ([#1207](https://github.com/Tencent/tdesign-react/pull/1207))
    - 树形结构，修复懒加载节点重置时（即调用 setData）没有清空子节点信息问题 @chaishi ([#1207](https://github.com/Tencent/tdesign-react/pull/1207))
    - 树形结构，展开全部功能，不应该展开懒加载节点 @chaishi ([#1207](https://github.com/Tencent/tdesign-react/pull/1207))
    - 修复吸顶的多级表头，缺少左侧边线问题 @chaishi ([#1207](https://github.com/Tencent/tdesign-react/pull/1207))
    - 行内有多条规则时，只生效第一条规则 @yatessss ([#1244](https://github.com/Tencent/tdesign-react/pull/1244))
- `DatePicker`:
    - 修复年份范围和面板年份不一致问题 @CodingOnStar ([#1218](https://github.com/Tencent/tdesign-react/pull/1218))
    - 修复面板初始化月份问题 @honkinglin ([#1225](https://github.com/Tencent/tdesign-react/pull/1225))
- `Jumper`: 修复 `onChange` 报错问题 @southorange1228 ([#1224](https://github.com/Tencent/tdesign-react/pull/1224))
- `Upload`: 修复 `onRemove` 失效问题 @honkinglin ([#1245](https://github.com/Tencent/tdesign-react/pull/1245))
- `tooltip`: disable状态及popup为trigger时不响应问题 @carolin913 ([#1203](https://github.com/Tencent/tdesign-react/pull/1203))


## 🌈 0.38.0 `2022-08-01` 

### ❗ Breaking Changes
- 调整全局 `border-radius` token，`@border-radius` 改名为 `@border-radius-default`，支持更多圆角 token。 使用 esm 包修改 less token 的业务需要注意。 @mingrutough1 (https://github.com/Tencent/tdesign-common/pull/666) (https://github.com/Tencent/tdesign-common/pull/648)

### 🚀 Features
- 支持全局替换 `tdesign` 内置 `Icon` @honkinglin ([#1181](https://github.com/Tencent/tdesign-react/pull/1181))
- `DatePicker`: 支持季度选择器 @honkinglin ([#1178](https://github.com/Tencent/tdesign-react/pull/1178))
- `Rate`: 新增 rate组件 @RedDevi1s ([#1014](https://github.com/Tencent/tdesign-react/pull/1014)) @honkinglin ([#1195](https://github.com/Tencent/tdesign-react/pull/1195))
- `Select`:  展开面板后二次点击输入框调整为关闭面板 @honkinglin ([#1174](https://github.com/Tencent/tdesign-react/pull/1174))
- `Grid`:  `col` 组件支持跨层级响应 `gutter` 配置 @honkinglin ([#1171](https://github.com/Tencent/tdesign-react/pull/1171))

### 🐞 Bug Fixes
- `Cascader`: 修复在异步获取 `option` 的情况下，参数校验导致用户行为异常 @pengYYYYY ([#1170](https://github.com/Tencent/tdesign-react/pull/1170))
- `Select`: 修复回删空字符串不触发`onSearch`的缺陷 @uyarn ([#1176](https://github.com/Tencent/tdesign-react/pull/1176))
- `Select`: 修复过滤时输入值为空未显示全部选项的问题 @southorange1228 ([#1157](https://github.com/Tencent/tdesign-react/pull/1157))
- `Dropdown`:  修复 className 继承问题 @CodingOnStar ([#1187](https://github.com/Tencent/tdesign-react/pull/1187))
- `Tree`:  修复更改 data 数据后展开状态丢失问题 @CodingOnStar ([#1168](https://github.com/Tencent/tdesign-react/pull/1168))


## 🌈 0.37.1 `2022-07-25` 
### 🚀 Features
- `Upload`: 支持单组件的文案配置 @uyarn ([#1158](https://github.com/Tencent/tdesign-react/pull/1158))
- `DatePicker`: 支持周选择器 @honkinglin ([#1138](https://github.com/Tencent/tdesign-react/pull/1138))
- `Chekbox`: 优化 label 为空字符串不渲染节点 @Blackn-L ([#1131](https://github.com/Tencent/tdesign-react/pull/1131))
- 支持通过CSS Token配置组件圆角 @mingrutough1 ([common#648](https://github.com/Tencent/tdesign-common/pull/648))

### 🐞 Bug Fixes
- `Form`: 修复 form 数字字符串长度校验错误问题 @honkinglin ([#1129](https://github.com/Tencent/tdesign-react/pull/1129))
- `List`: 修复 ListItem 透传 style 问题 @honkinglin ([#1161](https://github.com/Tencent/tdesign-react/pull/1161))
- `DatePicker`: 修复重置日期后面板月份未重置问题 @honkinglin ([#1133](https://github.com/Tencent/tdesign-react/pull/1133))
- `ColorPicker`:  修复添加颜色受控/非受控不能点击的问题 @insekkei ([#1134](https://github.com/Tencent/tdesign-react/pull/1134))


## 🌈 0.37.0 `2022-07-18` 

### ❗ Breaking Changes
- `DatePicker`: 调整组件dom 节点 class 命名 @honkinglin ([#1101](https://github.com/Tencent/tdesign-react/pull/1101))

### 🚀 Features
- `Icon`: 新增`mirror`和`rotation`图标 @uyarn ([#1075](https://github.com/Tencent/tdesign-react/pull/1075))
- `DatePicker`: 支持面板年月动态响应 value 变化 @honkinglin ([#1077](https://github.com/Tencent/tdesign-react/pull/1077))
- `Form`: form 支持同步获取最新数据 @honkinglin ([#1081](https://github.com/Tencent/tdesign-react/pull/1081))
- `table`: 树形结构，支持同时添加多个根节点 @chaishi ([#1099](https://github.com/Tencent/tdesign-react/pull/1099))
- `table`: 可编辑单元格/可编辑行，新增 `showEditIcon`，用于控制是否显示编辑图标 @chaishi ([#1108](https://github.com/Tencent/tdesign-react/pull/1108))
- `table`: 新增可编辑行的表格 @chaishi ([#1108](https://github.com/Tencent/tdesign-react/pull/1108))
- `table`: 可调整列宽，无边框表格，悬浮到表头时显示边框，方便用户寻找调整列宽的位置 @chaishi ([#1108](https://github.com/Tencent/tdesign-react/pull/1108))
- `Button`: 支持 href、tag、suffix API @honkinglin ([#1120](https://github.com/Tencent/tdesign-react/pull/1120))

### 🐞 Bug Fixes
- `Icon`: 修复iconfont高级用法由于t-icon的干扰导致渲染异常的情况 @uyarn ([#1075](https://github.com/Tencent/tdesign-react/pull/1075))
- `table`: 修复可选中行table组件，data为空数据时，默认全选按钮会选中的问题 @qdzhaoxiaodao ([#1061](https://github.com/Tencent/tdesign-react/pull/1061))
- `table`: 列宽拖拽调整到边界时无法重新调整 @chaishi ([#1086](https://github.com/Tencent/tdesign-react/pull/1086))
- `table`: 多级表头场景下的列配置，无法全选 @chaishi ([#1086](https://github.com/Tencent/tdesign-react/pull/1086))
- `Pagination`: 修复左右切换禁用失效问题 @honkinglin ([#1089](https://github.com/Tencent/tdesign-react/pull/1089))
- `table`: 修复树形结构，懒加载顺序问题 @chaishi ([#1097](https://github.com/Tencent/tdesign-react/pull/1097))
- `TagInput`: 修复hover时组件换行的样式异常 @uyarn ([#1118](https://github.com/Tencent/tdesign-react/pull/1118))
- `drawer`: 修复开启 destroyOnClose 时多次打开关闭时动效丢失问题 @LittlehorseXie ([#1119](https://github.com/Tencent/tdesign-react/pull/1119))
- `table`: 可编辑单元格，修复无法透传 ReactNode 属性到组件 @chaishi ([#1108](https://github.com/Tencent/tdesign-react/pull/1108))
- `table`: 可编辑单元格，修复 `onEnter` 无法触发 `onEdited` 问题，[issue#1084](https://github.com/Tencent/tdesign-react/issues/1084) @chaishi ([#1108](https://github.com/Tencent/tdesign-react/pull/1108))
- `table`: 可编辑单元格，一旦校验不通过，后续编辑无法退出编辑态问题，[issue#1106](https://github.com/Tencent/tdesign-react/issues/1106) @chaishi ([#1108](https://github.com/Tencent/tdesign-react/pull/1108))
- `card`: card component header render issues @weikee94 ([#1125](https://github.com/Tencent/tdesign-react/pull/1125))
- `Select`:  修复手动控制 popupVisible 展示空白内容 @samhou1988 ([#1105](https://github.com/Tencent/tdesign-react/pull/1105))
-  `ColorPicker`: 修复切换渐变节点 hue 饱和度未更新的问题 @insekkei ([#1121](https://github.com/Tencent/tdesign-react/pull/1121))
- `Form`: 修复 React 18 useEffect 触发两次导致表单自动校验问题 @honkinglin ([#1076](https://github.com/Tencent/tdesign-react/pull/1076))
- `Form`: 修复 rule min max 不支持数组校验 @honkinglin ([#1127](https://github.com/Tencent/tdesign-react/pull/1127))


## 🌈 0.36.4 `2022-07-11` 
### 🚀 Features
- `Table`: 树形结构，支持懒加载 @chaishi ([#1046](https://github.com/Tencent/tdesign-react/pull/1046))
- `CascaderPanel`: 增加 `cascader-panel` 组件 @pengYYYYY ([#1045](https://github.com/Tencent/tdesign-react/pull/1045))
- `Cascader`: 增加 `inputProps`, ` tagInputProps`, `tagProps` 属性 @pengYYYYY ([#1045](https://github.com/Tencent/tdesign-react/pull/1045))
- `Dialog`: 修复打开对话框，出现滚动条([#1163](https://github.com/Tencent/tdesign-vue-next/issues/1163)) @pengYYYYY ([#1045](https://github.com/Tencent/tdesign-react/pull/1045))
- `Form`: 支持 formList 初始化渲染initialData 数据 @honkinglin ([#1058](https://github.com/Tencent/tdesign-react/pull/1058))
- `Drawer`: 新增`sizeDraggable` 支持通过拖拽改变抽屉宽度/高度 @uyarn ([#1059](https://github.com/Tencent/tdesign-react/pull/1059))
- `TimePicker`: 支持毫秒场景使用 @uyarn ([#1069](https://github.com/Tencent/tdesign-react/pull/1069))

### 🐞 Bug Fixes
- `Table`: 可编辑功能，值为 `null` 时会导致页面报错，如清除 Select 数据，[issue#1043](https://github.com/Tencent/tdesign-react/issues/1043)，[dac72dfd](https://github.com/Tencent/tdesign-react/pull/1046/commits/dac72dfd58c47ec46cfa7d00e9ae13365c81edfa) @chaishi ([#1046](https://github.com/Tencent/tdesign-react/pull/1046))
- `Dialog`: 修复 dialog 阻止冒泡导致 popup 无法正常关闭 @honkinglin ([#1057](https://github.com/Tencent/tdesign-react/pull/1057))
- `Input`: 修复在 dialog 内中文输入导致光标定位错误问题 @honkinglin ([#1066](https://github.com/Tencent/tdesign-react/pull/1066))
- `Button`: 修复渲染空字符串样式问题 @honkinglin ([#1063](https://github.com/Tencent/tdesign-react/pull/1063))
- `Form`: 修复 getFieldsValue 类型定义 @zousandian ([#1020](https://github.com/Tencent/tdesign-react/pull/1020))

## 🌈 0.36.3 `2022-07-05` 

### 🚀 Features
- `TimePicker`: 优化可输入改动时的体验 @honkinglin ([#1040](https://github.com/Tencent/tdesign-react/pull/1040))
- `DatePicker`: 新增 `panelPreselection` api @honkinglin ([#1040](https://github.com/Tencent/tdesign-react/pull/1040))

### 🐞 Bug Fixes
- `Select`: 修复多选模式filter失效的问题 @uyarn ([#1039](https://github.com/Tencent/tdesign-react/pull/1039))
- `Space`: 更改Space组件children属性为React.ReactNode @vikeychen ([#1042](https://github.com/Tencent/tdesign-react/pull/1042))
- `DatePicker`: 修复左右切换面板时间跳动问题 @honkinglin ([#1040](https://github.com/Tencent/tdesign-react/pull/1040))
- `DatePicker`: 修复输入框更改时间异常问题 @honkinglin ([#1040](https://github.com/Tencent/tdesign-react/pull/1040))


## 🌈 0.36.2 `2022-07-04` 
### 🚀 Features
- `Form`: 添加内置校验方法 whitespace @pengYYYYY ([#1011](https://github.com/Tencent/tdesign-react/pull/1011))
- `Table`: 新增 `indeterminateSelectedRowKeys` ，用于控制选中行半选状态 @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 可编辑单元格，支持编辑组件联动， [issue#995](https://github.com/Tencent/tdesign-react/issues/995) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 树形结构行选中，支持中层节点半选状态，[issue#996](https://github.com/Tencent/tdesign-react/issues/996)，[issue#1004](https://github.com/Tencent/tdesign-react/issues/1004) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: EnhancedTable 新增对外实例对象 `treeDataMap` @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Cascader`: 增加 `popupVisible, readonly, selectInputProps, onPopupVisibleChange` 属性，具体描述查看文档  @pengYYYYY ([#990](https://github.com/Tencent/tdesign-react/pull/990))
- `Jumper`: 新增 jumper 组件 @honkinglin ([#998](https://github.com/Tencent/tdesign-react/pull/998))
- `Space`:  优化空元素渲染 @zFitness ([#1009](https://github.com/Tencent/tdesign-react/pull/1009))
- `Cascader`: 基于 `select-input` 重构, 文本过长省略使用原生 title 展示全文本，不再使用 `tooltip` 组件。 @pengYYYYY ([#990](https://github.com/Tencent/tdesign-react/pull/990))

### 🐞 Bug Fixes
- `table`: 表头吸顶显示问题 @chaishi ([#1003](https://github.com/Tencent/tdesign-react/pull/1003))
- `table`: `paginationAffixedBottom` 支持配置 Affix 组件全部特性 @chaishi ([#1003](https://github.com/Tencent/tdesign-react/pull/1003))
- `treeselect`:  默认lazy异步加载开启，与api保持一致 @carolin913 ([#1017](https://github.com/Tencent/tdesign-react/pull/1017))
- `DatePicker`: 修复 presetsPlacement 不生效的问题 @honkinglin ([#1013](https://github.com/Tencent/tdesign-react/pull/1013))
- `Tree`: 优化 tree 组件的类型问题 @honkinglin ([#1006](https://github.com/Tencent/tdesign-react/pull/1006))
- `colorpicker`: 修复最近使用颜色的功能 @LittlehorseXie ([#1019](https://github.com/Tencent/tdesign-react/pull/1019))
- `Table`: 树形结构行选中，没有配置 `tree`，则当作普通表格行选中处理，[issue#1001](https://github.com/Tencent/tdesign-react/issues/1001) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 修复树形数据表格，选中子节点时，会导致父节点自动折叠问题，[issue#999](https://github.com/Tencent/tdesign-react/issues/999)，[871f42f6](https://github.com/Tencent/tdesign-react/pull/1028/commits/871f42f6a85f21e4bd0f2887e762021a188d28e6) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 修复合并单元格，动态数据显示异常问题，[issue#966](https://github.com/Tencent/tdesign-react/issues/966)，[8c05f53d](https://github.com/Tencent/tdesign-react/pull/1028/commits/8c05f53ddeb9b5af3ac0ab49abea8ae36eb330fb) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 可编辑功能，数据更新不及时问题，[issue#994](https://github.com/Tencent/tdesign-react/issues/994)，[4f5c851c](https://github.com/Tencent/tdesign-react/pull/1028/commits/4f5c851ca6a3df57121c21591352862655cd8302) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 可编辑单元格，支持 React 16 [issue#993](https://github.com/Tencent/tdesign-react/issues/993) @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Table`: 树形结构，缩进 `indent` 支持 `0` @chaishi ([#1028](https://github.com/Tencent/tdesign-react/pull/1028))
- `Cascader`: 修复数据中 `value` 的数据类型为 `number` 时，`clearable` 失效 @pengYYYYY ([#990](https://github.com/Tencent/tdesign-react/pull/990))
- `Dialog`: 修复滚动失效问题 @honkinglin ([#1021](https://github.com/Tencent/tdesign-react/pull/1021))
- `select`: 修复多选下换行提前占满一行的问题 @uyarn ([#1032](https://github.com/Tencent/tdesign-react/pull/1032))
- `Upload`: 修复 disabled 依然可删除问题 @honkinglin ([#1036](https://github.com/Tencent/tdesign-react/pull/1036))
- `colorPicker`: 修复在ColorTrigger输入色值时，自动format输入值并回填的问题 @LittlehorseXie ([#1000](https://github.com/Tencent/tdesign-react/pull/1000))
- `table`: 兼容树状表格未传入tree属性的场景 @southorange1228 ([#1002](https://github.com/Tencent/tdesign-react/pull/1002))


## 🌈 0.36.1 `2022-06-27`

### 🐞 Bug Fixes
- `Style`: 修复 reset 文件移除后组件样式错乱问题


## 🌈 0.36.0 `2022-06-27` 

### ❗ Breaking Changes
- `reset`: 默认移除全局 reset 样式引入，可从 `tdesign-react/dist/reset.css` 中单独引入 @xiaosansiji ([#899](https://github.com/Tencent/tdesign-react/pull/899))

### 🚀 Features
- `radioGroup`: 支持 className 和 style @LittlehorseXie ([#913](https://github.com/Tencent/tdesign-react/pull/913))
- `Space`: 新增 Space 组件 @honkinglin ([#915](https://github.com/Tencent/tdesign-react/pull/915))
- `taginput`: `excessTagsDisplayType` 默认值更为 `break-line` @LittlehorseXie ([#914](https://github.com/Tencent/tdesign-react/pull/914))
- `Table`: `firstFullRow`不参与排序 @uyarn ([#923](https://github.com/Tencent/tdesign-react/pull/923))
- `ConfigProvider`: 增加 `input` 组件 `autocomplete` 配置，增加 `dialog` 组件  `closeOnEscKeydown`, `closeOnOverlayClick` 配置,  增加 `select` 组件 `filterable`  配置，增加 `drawer` 组件  `closeOnEscKeydown`, `closeOnOverlayClick` 配置 ([issue #848](https://github.com/Tencent/tdesign-vue-next/issues/848)) @pengYYYYY ([#972](https://github.com/Tencent/tdesign-react/pull/972))
- `Form`: 支持 `validateOnly` 函数 & `validate` 函数支持 `showErrorMessage` 参数 & 修复类型问题 @honkinglin ([#895](https://github.com/Tencent/tdesign-react/pull/895))
- `Locale`: 新增日文韩文翻译 @honkinglin ([#943](https://github.com/Tencent/tdesign-react/pull/943))
-  `Select`:  label 支持 TNode 类型 @samhou1988 ([#973](https://github.com/Tencent/tdesign-react/pull/973))

### 🐞 Bug Fixes
- `table`: 修复加载更多的加载组件尺寸异常问题 @uyarn ([#907](https://github.com/Tencent/tdesign-react/pull/907))
- `Select`: 修复输入部分特殊符号过滤时组件崩溃的问题 @southorange1228 ([#916](https://github.com/Tencent/tdesign-react/pull/916))
- `Table`: 修复仅有`firstFullRow`渲染为空的问题 @uyarn ([#923](https://github.com/Tencent/tdesign-react/pull/923))
- `Table`: 修复SSR渲染异常的问题 @uyarn ([#923](https://github.com/Tencent/tdesign-react/pull/923))
- `HeadMenu`: 修复 ts 类型问题 @honkinglin ([#934](https://github.com/Tencent/tdesign-react/pull/934))
- `Select`: `onChange`事件回调参数缺失 @uyarn ([#951](https://github.com/Tencent/tdesign-react/pull/951))
-  `RangeInput`: 修复 `disabled` 失效问题 @honkinglin ([#921](https://github.com/Tencent/tdesign-react/pull/921))
-  `Form`: 修复 `number` 校验无效问题 @honkinglin ([#976](https://github.com/Tencent/tdesign-react/pull/976))

### 🚧 Others

- `Demo`: 组件示例代码统一使用 `Space` 组件实现 @southorange1228 @smilebuz([#920](https://github.com/Tencent/tdesign-react/issues/920))


## 🌈 0.35.1 `2022-06-20` 

### 🚀 Features
- `table`: 支持拖拽调整宽度，设置 `resizable=true` 即可 @chaishi ([#902](https://github.com/Tencent/tdesign-react/pull/902))
- `table`: 表头吸顶、表尾吸底、滚动条吸底、分页器吸底 @chaishi ([#902](https://github.com/Tencent/tdesign-react/pull/902))
- `DatePicker`: 完善 panel 事件逻辑 @honkinglin ([#873](https://github.com/Tencent/tdesign-react/pull/873))
- `DatePicker`: 优化面板交互 @honkinglin ([#887](https://github.com/Tencent/tdesign-react/pull/887))

### 🐞 Bug Fixes
- `table`: 修复table透传loading size为枚举无效的问题 @uyarn ([#870](https://github.com/Tencent/tdesign-react/pull/870))
- `Select`: option子组件没有透传style实现的问题 @uyarn ([#889](https://github.com/Tencent/tdesign-react/pull/889))
- `Anchor`: 修复affix参数类型问题 @southorange1228 ([#896](https://github.com/Tencent/tdesign-react/pull/896))
- `table`: 支持动态数据合并单元格 @chaishi ([#902](https://github.com/Tencent/tdesign-react/pull/902))
- `table`: 吸顶表头和自定义显示列场景，支持列拖拽调整顺序 @chaishi ([#902](https://github.com/Tencent/tdesign-react/pull/902))
- `table`: 修复 `firstFullRow` 存在时，拖拽排序的顺序不正确问题 @chaishi ([#902](https://github.com/Tencent/tdesign-react/pull/902))
- `timepicker`: 修复初始化滚动问题 @uyarn ([#876](https://github.com/Tencent/tdesign-react/pull/876))
- `Select`: 修复 `minCollapsedNum` 无效问题 @samhou1988 ([#878](https://github.com/Tencent/tdesign-react/pull/878))
- `Skeleton`: 修复 ts 类型问题  @Yilun-Sun ([#883](https://github.com/Tencent/tdesign-react/pull/883))
-  `Tabs`: 修复左右切换渲染问题 @honkinglin ([#894](https://github.com/Tencent/tdesign-react/pull/894))
- `Dialog`: 修复 mask 关闭问题 @huoyuhao ([#900](https://github.com/Tencent/tdesign-react/pull/900))


## 🌈 0.35.0 `2022-06-10` 

### ❗ Breaking Changes
- `DatePicker`:  重构 `DatePickerPanel`、`DateRangePickerPanel` 逻辑，API 重新规划 @honkinglin ([#858](https://github.com/Tencent/tdesign-react/pull/858))
- `Dialog`: 移除 `transform` 动画方案，dom 结构有所调整 @huoyuhao ([#776](https://github.com/Tencent/tdesign-react/pull/776))
- `InputAdornment`: 移除 `Addon` 组件，替换为 `InputAdornment`，用法保持一致只需更改组件名即可  @honkinglin ([#849](https://github.com/Tencent/tdesign-react/pull/849))

### 🚀 Features
- `table`: 树形结构，支持默认展开全部，以及自由控制展开全部或收起全部 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 树形结构，支持空数据插入新节点、当前数据之前插入新节点、当前数据之后插入新节点、获取树形结构等方法 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 树形结构，支持自定义树形结构展开收起图标 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 树形结构，支持拖拽调整同层级顺序 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 拖拽排序事件，新增参数 data 和 newData，分别表示变更前后的数据 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 过滤功能，Input 输入框支持 Enter 键触发确认搜索 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 排序功能，支持隐藏排序图标文本提示 `hideSortTips` @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `table`: 新增可编辑单元格功能 @chaishi ([#842](https://github.com/Tencent/tdesign-react/pull/842))
- `textarea`: 新增`allowInputOvermax` 支持超出字数限制可以输入 @carolin913 ([#838](https://github.com/Tencent/tdesign-react/pull/838))
- `DatePicker`: 优化 `DatePicker` 组件逻辑 @honkinglin ([#858](https://github.com/Tencent/tdesign-react/pull/858))
- `CollapsePanel`: 箭头样式优化 @samhou1988 ([#851](https://github.com/Tencent/tdesign-react/pull/851))
- `InputAdornment`: 新增 `InputAdornment` 组件 @honkinglin ([#849](https://github.com/Tencent/tdesign-react/pull/849))

### 🐞 Bug Fixes
- `tab`: tabnav无法自适应宽度 fix#846 @carolin913 ([#838](https://github.com/Tencent/tdesign-react/pull/838))
- `table`: 合并单元格支持动态数据，[issue#973](https://github.com/Tencent/tdesign-vue/issues/973) @chaishi ([#866](https://github.com/Tencent/tdesign-react/pull/866))
- `MenuItem`: 修复 `MenuItem` 在 active 状态点击失效问题 @leosxie ([#848](https://github.com/Tencent/tdesign-react/pull/848))
- `InputNumber`: 修复减号按钮触发两次点击事件问题 @moecasts ([#857](https://github.com/Tencent/tdesign-react/pull/857))
- `Drawer`: 修复 `cancelBtn` 传入字符串无效 @honkinglin ([#860](https://github.com/Tencent/tdesign-react/pull/860))
- `Dialog`: 优化 `transform` 定位问题导致子节点的 fixed 属性定位失效 @huoyuhao ([#776](https://github.com/Tencent/tdesign-react/pull/776))


## 🌈 0.34.4 `2022-06-02` 
### 🚀 Features
- `Skeleton`: 延时关闭功能 @ontheroad1992 ([#808](https://github.com/Tencent/tdesign-react/pull/808))
- `Dialog`: 增强 dialog 组件 confirmBtn & cancelBtn @psaren ([#813](https://github.com/Tencent/tdesign-react/pull/813))
- `Notification`: 新增样式命名区分 theme @honkinglin ([#834](https://github.com/Tencent/tdesign-react/pull/834))

### 🐞 Bug Fixes
- `Loading`: 修复loading plugin类型缺失style和class的问题 @uyarn ([#810](https://github.com/Tencent/tdesign-react/pull/810))
- `skeleton`: 动画结束后，父级无意义的 div 导致样式无法继承、计算 @ontheroad1992 ([#808](https://github.com/Tencent/tdesign-react/pull/808))
- `TimePicker`: 修复`RangePicker`的聚焦样式丢失的问题 @uyarn ([#811](https://github.com/Tencent/tdesign-react/pull/811))
- `Form`: 修复 `addon` 在form表单下数据劫持失败问题 @honkinglin ([#802](https://github.com/Tencent/tdesign-react/pull/802))
- `Select`: 当 multiple 为 true 的时候，筛选(filter)功能无法关闭 @samhou1988 ([#814](https://github.com/Tencent/tdesign-react/pull/814))
- `Menu`: 兼容 menu 子元素为 null 场景报错问题 @honkinglin ([#818](https://github.com/Tencent/tdesign-react/pull/818))
- `Upload`: 修复错误信息不消失问题 @wookaoer ([#827](https://github.com/Tencent/tdesign-react/pull/827))
- `TagInput`:  修复中文输入法enter时，既触发添加tag也input框有输入的字母的问题 @LittlehorseXie ([#835](https://github.com/Tencent/tdesign-react/pull/835))

### 🚧 Others
- 官网: 新增主题配置生成器 @uyarn ([#655](https://github.com/Tencent/tdesign-react/pull/655))

## 🌈 0.34.3 `2022-05-25` 

### 🚧 Others
- fix: 修复构建报错 @honkinglin ([#799](https://github.com/Tencent/tdesign-react/pull/799))

## 🌈 0.34.2 `2022-05-25` 

### 🐞 Bug Fixes
- `Table`: 处理table过滤输入失焦问题 @uyarn ([#793](https://github.com/Tencent/tdesign-react/pull/793))
- `Form`:  修复 `FormItem` 拦截组件受控属性默认值为数组时传入 undefined 报错问题 @honkinglin ([#792]
- `Form`:  修复 `FormItem` rules 失效问题 @honkinglin ([#794](https://github.com/Tencent/tdesign-react/pull/794))
- `Pagination`:  修复  `totalContent` jsx 渲染失败问题 @honkinglin ([#796](https://github.com/Tencent/tdesign-react/pull/796))


## 🌈 0.34.1 `2022-05-24` 

### 🐞 Bug Fixes
- `Datepicker`: 修复 popupProps 透传优先级问题 @honkinglin ([#785](https://github.com/Tencent/tdesign-react/pull/785))

### 🚧 Others
- fix: 修复构建产物报错 @honkinglin ([#789](https://github.com/Tencent/tdesign-react/pull/789))


## 🌈 0.34.0 `2022-05-20` 

### ❗ Breaking Changes
- `DatePicker`: onChange 回调第二个参数调整为对象，支持更多类型返回值 @honkinglin ([#777](https://github.com/Tencent/tdesign-react/pull/777))
- `Form`: 不再默认渲染 `help` 空节点 @honkinglin ([#772](https://github.com/Tencent/tdesign-react/pull/772))

### 🚀 Features
- `Form`: `FormList` 支持手动赋值 @honkinglin ([#769](https://github.com/Tencent/tdesign-react/pull/769))
- `Form`:  支持 `help` 节点与错误提示同时展示，无 `help` 不再默认占位 @honkinglin ([#772](https://github.com/Tencent/tdesign-react/pull/772))
- `DatePicker`: 支持 `onChange` 返回 `trigger` 参数定位事件触发源 & 单选模式支持 `onPick` 事件 @honkinglin ([#777](https://github.com/Tencent/tdesign-react/pull/777))
- `Watermark`: 新增水印watermark组件 @docoder ([#753](https://github.com/Tencent/tdesign-react/pull/753))
- `Calendar`:  新增 `month`、`year` API @skytt ([#775](https://github.com/Tencent/tdesign-react/pull/775))
- `Tree`: `label` 支持多行文本  @ccccpj https://github.com/Tencent/tdesign-common/pull/460

### 🐞 Bug Fixes
- `Table`: 修复异步加载数据时，分页非受控展示错误行数的问题 @uyarn ([#778](https://github.com/Tencent/tdesign-react/pull/778))
- `TimePicker`: 修复`TimePicker`展开宽度问题 @uyarn ([#780](https://github.com/Tencent/tdesign-react/pull/780))

### 🚧 Others
- 统一全局受控 hooks & 优化组件初始值设置 @honkinglin ([#773](https://github.com/Tencent/tdesign-react/pull/773))


## 🌈 0.33.2 `2022-05-14` 
### 🚀 Features
- `Steps`: 支持 separator api & 完善反转逻辑 @honkinglin ([#752](https://github.com/Tencent/tdesign-react/pull/752))
- `Form`:  支持整理嵌套数据 @honkinglin ([#758](https://github.com/Tencent/tdesign-react/pull/758)) ([#762](https://github.com/Tencent/tdesign-react/pull/762))
- `Affix`:  优化滚动逻辑 @ontheroad1992 ([#759](https://github.com/Tencent/tdesign-react/pull/759))
- `Tabs`:  `TabPanel` 支持 `className` 透传 @honkinglin ([#763](https://github.com/Tencent/tdesign-react/pull/763))
### 🐞 Bug Fixes
- `Table`: 修复 多级表头 + 列配置 综合示例中，列数量超出一定限制时报错，[issue#713](https://github.com/Tencent/tdesign-vue-next/issues/713) @chaishi ([#757](https://github.com/Tencent/tdesign-react/pull/757))
- `Tabs`: 修复 `TabPanel` ts 类型报错 @wleven ([#761](https://github.com/Tencent/tdesign-react/pull/761))
- `DatePicker`: 修复宽度计算问题 @honkinglin ([#754](https://github.com/Tencent/tdesign-react/pull/754))
- `Slider`: 修复 `inputNumberProps` 类型问题  @andyjxli ([#745](https://github.com/Tencent/tdesign-react/pull/745))

## 🌈 0.33.1 `2022-05-09`

### 🐞 Bug Fixes
`Jumper`: 修复 style 文件引用报错问题 [@honkinglin](https://github.com/honkinglin) ([0d5726d](https://github.com/Tencent/tdesign-react/commit/0d5726d30b17bda68a39f1ab90568e2dbb0708d8))


## 🌈 0.33.0 `2022-05-09` 

### ❗ Breaking Changes
- 重构 DatePicker、TimePicker 组件，样式结构有所调整 @honkinglin @uyarn ([#559](https://github.com/Tencent/tdesign-react/pull/559)) 
- `DatePicker`
  - 移除 `range` api，分别导出 `Datepicker` 与 `DateRangePicker` 组件
  - 支持 `DatePickerPanel` 与 `DateRangePickerPanel` 单独使用
  - 支持年份、月份区间选择
  - 支持 `allowInput` api
- `TimePicker`
   - 重新调整样式、允许输入交互重新设计
   - 调整交互为点击`确认`按钮保留改动 直接关闭弹窗不保留改动 恢复初始值
   - `disableTime`、`onFocus`、`onBlur`、`onInput` 等API存在breaking change
   - 新增`TimePickerPanel`组件 用于单独使用面板的场景 

### 🚀 Features
- `Icon`: 更新图标 新增`file-icon`图标 调整`file-excel`、`file-pdf`、`file-powerpoint`、`file-unknown`、`file-word`和`star-filled`图标的绘制路径 @uyarn ([#741](https://github.com/Tencent/tdesign-react/pull/741))
- `Jumper`: 新增 `Jumper` 组件 @honkinglin ([#559](https://github.com/Tencent/tdesign-react/pull/559))
- `RangeInput`:  新增 `RangeInput` 组件 @honkinglin ([#559](https://github.com/Tencent/tdesign-react/pull/559))
- `RangeInputPopup`:  新增 `RangeInputPopup` 组件 @honkinglin ([#559](https://github.com/Tencent/tdesign-react/pull/559))

### 🐞 Bug Fixes
- `ColorPicker`: 受控问题修复 @insekkei ([#712](https://github.com/Tencent/tdesign-react/pull/712))
- `Upload`:   修复组件 value undifined 场景校验失败问题 @honkinglin ([#738](https://github.com/Tencent/tdesign-react/pull/738))


## 🌈 0.32.3 `2022-05-07` 
### 🚀 Features
- `Table`: 新增 API `ellipsisTitle` 用于单独控制表头的超出省略 [@chaishi](https://github.com/chaishi) ([#722](https://github.com/Tencent/tdesign-react/pull/722))
- `Upload`: 修改uploadFiles类型参数除url外为非必填 [@uyarn](https://github.com/uyarn) ([#730](https://github.com/Tencent/tdesign-react/pull/730))
### 🐞 Bug Fixes
- `slider`: 修复`slider`在非受控模式下行为异常 [@southorange1228](https://github.com/southorange1228) ([#709](https://github.com/Tencent/tdesign-react/pull/709))
- `Table`:  加载状态与拖拽配合使用时，拖拽功能失效，[issue#708](https://github.com/Tencent/tdesign-react/issues/708) [@chaishi](https://github.com/chaishi) ([#722](https://github.com/Tencent/tdesign-react/pull/722))
- `Card`:  修复未添加header属性，Card组件布局错误 [@yilaierwang](https://github.com/yilaierwang) ([#724](https://github.com/Tencent/tdesign-react/pull/724))
- `Card`: 头部渲染逻辑不完善的问题 缺失了status的渲染 [@uyarn](https://github.com/uyarn) ([#731](https://github.com/Tencent/tdesign-react/pull/731))
- `Table`: `renderExpandedRow`改为非必填 [@uyarn](https://github.com/uyarn) ([#732](https://github.com/Tencent/tdesign-react/pull/732))
- `InputNumber`:  修复小数输入问题 [@Fnll](https://github.com/Fnll) ([#729](https://github.com/Tencent/tdesign-react/pull/729)) [@docoder](https://github.com/docoder) ([#728](https://github.com/Tencent/tdesign-react/pull/728))

## 0.32.2 `2022-04-28`

### Bug Fixes

* Table:
  * 修复 `getBoundingClientRect` 在 `jsdom` 环境为 null 问题 ([22077bd](https://github.com/Tencent/tdesign-react/commit/22077bdf0dc406bd92a9c5d25362382bfdf23f6e)) [@uyarn](https://github.com/uyarn)
  * 修复 `loading` 状态文案问题 ([e021c8b](https://github.com/Tencent/tdesign-react/commit/e021c8b3c75274eca9842ad8ef3c8839b60d4eab)) [@uyarn](https://github.com/uyarn)
* Datepicker: 修复空数组确定事件报错问题 ([#697](https://github.com/Tencent/tdesign-react/issues/697)) ([871065d](https://github.com/Tencent/tdesign-react/commit/871065d35c75d87fd9002f16b438246da80fd10a)) [@honkinglin](https://github.com/honkinglin)
* Dialog: 修复组件销毁后 body 样式不重置问题 & 移除多余 div 渲染 ([#690](https://github.com/Tencent/tdesign-react/issues/690)) ([d6d5131](https://github.com/Tencent/tdesign-react/commit/d6d513151f7548b3ea3b1f0b8c26fa96ecdbb1dc)) [@honkinglin](https://github.com/honkinglin)
* Textarea: 修复在 `Form` 组件下换行问题 ([507eaf3](https://github.com/Tencent/tdesign-react/commit/507eaf3b9533b19681e9bd10f666ded9e61b430d)) [@honkinglin](https://github.com/honkinglin)
* Colorpicker: 修复 Popupprops 透传问题 ([#700](https://github.com/Tencent/tdesign-react/issues/700)) ([804c7b4](https://github.com/Tencent/tdesign-react/commit/804c7b4f64968d12d2ca665b23289e0cd1037fff)), closes [#698](https://github.com/Tencent/tdesign-react/issues/698) [@carolin913](https://github.com/carolin913)
* Form: 修复 `help` 文案状态响应样式问题 ([#682](https://github.com/Tencent/tdesign-react/issues/682)) ([282602d](https://github.com/Tencent/tdesign-react/commit/282602d8ab3a1ff10a1146b5519d13b08fc7a2c6)) [@honkinglin](https://github.com/honkinglin)
* Upload: 修复 `onDrop` 事件不响应问题 ([3efa2c6](https://github.com/Tencent/tdesign-react/commit/3efa2c6c9758725aa4159b122bfad3b154959404)) [@wookaoer](https://github.com/wookaoer)


### Features

* Collapse: 新增 `Collapse` 组件 ([9c2ce29](https://github.com/Tencent/tdesign-react/commit/9c2ce29625a11979aff5de6adeda157b319d7ad3)) [@ZhaoRB](https://github.com/ZhaoRB)
* Pagination:
  * 新增 `showPageSize`、`showPageNumber` API ([#696](https://github.com/Tencent/tdesign-react/issues/696)) ([c11e692](https://github.com/Tencent/tdesign-react/commit/c11e69218df8bcf20f5b5104f6967e04246dc182)) [@honkinglin](https://github.com/honkinglin)
  * 新增 `showFirstAndLastBtn` api ([#694](https://github.com/Tencent/tdesign-react/issues/694)) ([d085cf8](https://github.com/Tencent/tdesign-react/commit/d085cf862454173e0a191f842cc0a5b44c0477a5)) [@honkinglin](https://github.com/honkinglin)
* InputNumber: 完善尺寸类型 ([#694](https://github.com/Tencent/tdesign-react/issues/694)) ([d085cf8](https://github.com/Tencent/tdesign-react/commit/d085cf862454173e0a191f842cc0a5b44c0477a5)) [@honkinglin](https://github.com/honkinglin)
* Tooltip: 支持 `plcement="mouse"` 基于鼠标位置 ([26afab8](https://github.com/Tencent/tdesign-react/commit/26afab81ce1bd3bcaaf51618123e7b21e1241279)), closes [#608](https://github.com/Tencent/tdesign-react/issues/608) [@carolin913](https://github.com/carolin913)


## 0.32.1 `2022-04-24`

### Bug Fixes

* Table: 修复 jsdom 测试环境报错问题 ([#676](https://github.com/Tencent/tdesign-react/issues/676)) ([af7a35b](https://github.com/Tencent/tdesign-react/commit/af7a35b3ee917bdc36634d71712174e0074c61e2)) [@honkinglin](https://github.com/honkinglin)
* Dialog: 修复 ts 问题 ([0e278a1](https://github.com/Tencent/tdesign-react/commit/0e278a179dae4b0b6b36b10ce026dab3a4dcb7eb)) [@pengYYYYY](https://github.com/pengYYYYY)


### Features

* Select: 列表选择体验优化 ([#659](https://github.com/Tencent/tdesign-react/issues/659)) ([3a792bd](https://github.com/Tencent/tdesign-react/commit/3a792bddc9d9226016f282a2af6fd7e8eb715e73)) [@smilebuz](https://github.com/smilebuz)


## 0.32.0 `2022-04-22`

### BREAKING CHANGES

* Table: 重构 `table` 组件, 样式结构有所变动，废弃`minWidth`，`排序功能`使用有所调整，详情请参考API和demo的写法 ([ea678be](https://github.com/Tencent/tdesign-react/commit/ea678be56e466a5a7f4cfaecdea4413d3753ba09)) [@chaishi](https://github.com/chaishi) [@uyarn](https://github.com/uyarn)

### Bug Fixes

* Select:
  * 修复多选+可搜索条件下输入问题 ([91c4025](https://github.com/Tencent/tdesign-react/commit/91c40258712ffac4abb00fdf8805028bc061200b)) [@samhou1988](https://github.com/samhou1988)
  * 修复 `multiple` 模式删除问题 ([dedb2ee](https://github.com/Tencent/tdesign-react/commit/dedb2eebc8d6db4cb422635a526f1729f1f9ab87)), closes [#654](https://github.com/Tencent/tdesign-react/issues/654) [@joriewong](https://github.com/joriewong)
* Progress: 修复 `trackColor` 默认值导致背景色显示错误问题 ([faff9ad](https://github.com/Tencent/tdesign-react/commit/faff9add954cb3cd2078de33dd8e592ef17bee9d)) [@honkinglin](https://github.com/honkinglin)
* Dialog: 修复 `destroyOnClose` 为 true 时 visible 失效问题 ([d8721cb](https://github.com/Tencent/tdesign-react/commit/d8721cb0c01d4c24bebfe076b9283a98c3c33f72)) [@psaren](https://github.com/psaren)
* Layout: 修复 ts 类型警告 ([26e1ee3](https://github.com/Tencent/tdesign-react/commit/26e1ee33fc54dbd3a504e4889db7cafbacc97972)) [@honkinglin](https://github.com/honkinglin)
* table: 修复 pagination 数据同步问题 ([77d692e](https://github.com/Tencent/tdesign-react/commit/77d692e0db136b9299e85ce3f1ce955a3ea14e39)) [@uyarn](https://github.com/uyarn)


### Features

* Card: 新增 `Card` 组件 ([9c66dc3](https://github.com/Tencent/tdesign-react/commit/9c66dc36c351d80e22926fe2d4ff56783cda334d)) [@weikee94](https://github.com/weikee94)
* ColorPicker: 新增 `ColorPicker` 组件 ([920263a](https://github.com/Tencent/tdesign-react/commit/920263af9c5ec3671f214182f26b6fc7ce0528b8)) [insekkei](https://github.com/insekkei) [@carolin913](https://github.com/carolin913)
* Table: 重构 `table` 组件, 支持表头吸顶、简易列拖拽排序、自定义列配置、懒加载、自定义展开图标及树形结构 ([ea678be](https://github.com/Tencent/tdesign-react/commit/ea678be56e466a5a7f4cfaecdea4413d3753ba09)) [@chaishi](https://github.com/chaishi) [@uyarn](https://github.com/uyarn)
  
* Divider: 优化文本模式在竖型模式下样式问题 ([#662](https://github.com/Tencent/tdesign-react/issues/662)) ([213c67d](https://github.com/Tencent/tdesign-react/commit/213c67d9107960e02dff6baf8861770a8a822272)) [@honkinglin](https://github.com/honkinglin)



## 0.31.1 `2022-04-18`

### Bug Fixes

* Form: 修复 `formItem` 包裹组件 `onChange` 其他参数丢失问题 ([#637](https://github.com/Tencent/tdesign-react/issues/637)) ([f1b2256](https://github.com/Tencent/tdesign-react/commit/f1b225605803299405f558b06d681507326e1e44)) [@honkinglin](https://github.com/honkinglin)
* Datepicker: 修复 `range` 模式空数组报错问题 ([679d933](https://github.com/Tencent/tdesign-react/commit/679d933e9b30eb153efab86743488648b5ed5b1d)) [@honkinglin](https://github.com/honkinglin)
* Menu: menuGroup 类型修复 ([d52942a](https://github.com/Tencent/tdesign-react/commit/d52942ac2ecfe7ac14aa9ac26ef30c773386fc39)) [@ZhaoRB](https://github.com/ZhaoRB)
* Upload:
  * 修复 draggable custom theme 同时存在组件不渲染 ([f1f6fd1](https://github.com/Tencent/tdesign-react/commit/f1f6fd1001e807c526983543bf46b7fa195788a1)) [@samhou1988](https://github.com/samhou1988)
  * 修复上传参数 `file` 丢失问题 ([bd9f545](https://github.com/Tencent/tdesign-react/commit/bd9f545a27c236cec843d95861239414773eed27)) [@wookaoer](https://github.com/wookaoer)

### Features

* Icon: 升级 Icon 包版本，支持React 18 + 的使用 ([5d0de7c](https://github.com/Tencent/tdesign-react/commit/5d0de7ce97f782cbe90fcb6181866421bfa3e8cd)) [@uyarn](https://github.com/uyarn)



## 0.31.0 `2022-04-14`

### BREAKING CHANGES
* FormItem 样式调整，默认渲染 extra 文本节点占位，FormItem 上下 margin 有所调整 [@honkinglin](https://github.com/honkinglin)
* Popconfirm: 移除 `PopConfirm` 组件导出，请更改为 `Popconfirm` ([#614](https://github.com/Tencent/tdesign-react/issues/614)) ([ca6e4b6](https://github.com/Tencent/tdesign-react/commit/ca6e4b6852469bba35d47ba0811054fc796c1a69)) [@honkinglin](https://github.com/honkinglin)

### Bug Fixes

* Cascader:
  * 修复 `filterable` 模式下展示异常 ([92c2776](https://github.com/Tencent/tdesign-react/commit/92c277608778f955108e5a9ff6e231473c2cd039)) [@jsonz1993](https://github.com/jsonz1993)
  * 修复多选与筛选时文本过长的展示异常 ([6d3f0fc](https://github.com/Tencent/tdesign-react/commit/6d3f0fc82d80b927fff17ca09c24445f19c0881b)) [@jsonz1993](https://github.com/jsonz1993)
* Popup:
  * 修复初始化翻转逻辑判断错误 ([#615](https://github.com/Tencent/tdesign-react/issues/615)) ([b7bea93](https://github.com/Tencent/tdesign-react/commit/b7bea93d25e2908973335dc8099c2f85e04d04b0)) [@honkinglin](https://github.com/honkinglin)
  * 修复嵌套浮层 `click` 时关闭异常 ([f40c1f8](https://github.com/Tencent/tdesign-react/commit/f40c1f8155eeaf54fd7168a47c3be24069baaaad)) [@nia3y](https://github.com/nia3y)
  * 修复 `trigger` 元素变化后展示异常 ([e8687f2](https://github.com/Tencent/tdesign-react/commit/e8687f2ad9cf63a792ce39eb5fc0aaea62e495ea)) [@Hoofoo-WHU](https://github.com/Hoofoo-WHU)
* Slider: 修复 `max` 数值过大浏览器崩溃问题 ([#624](https://github.com/Tencent/tdesign-react/issues/624)) ([052b08b](https://github.com/Tencent/tdesign-react/commit/052b08b03e547070903e737650d4e3b6efd14200)) [@honkinglin](https://github.com/honkinglin)
* Breadcrumb: 修复面包屑初始样式被覆盖问题 ([e156a11](https://github.com/Tencent/tdesign-react/commit/e156a113b274ed1e1ee7e277c03eb5e04913dfc9)) [@yatessss](https://github.com/yatessss)
* GlobalConfig: 修复 ts 类型问题 ([a2d22ae](https://github.com/Tencent/tdesign-react/commit/a2d22ae061c75ca730d6bcf5959c46e07123636e)) [@uyarn](https://github.com/uyarn)
* Menu: 修复 `MenuGroup` 嵌套时样式问题 ([17b633a](https://github.com/Tencent/tdesign-react/commit/17b633ac47ab63a27c5001c3166c2feabfdb78e3)) [@ZhaoRB](https://github.com/ZhaoRB)
* Select: 修复输入事件异常 ([267988d](https://github.com/Tencent/tdesign-react/commit/267988d3e873d5e05894362c0c9624ab3cff5434)) [@uyarn](https://github.com/uyarn)
* Dialog: 修复 `destroy` 函数未真正销毁组件问题 ([376193d](https://github.com/Tencent/tdesign-react/commit/376193d7b95d569ac1a31d0be66d8a3a89f55cb8)) [@psaren](https://github.com/psaren)


### Features

* Form: 新增动态表单能力，可使用 `FormList` 组件管理表单项 ([#602](https://github.com/Tencent/tdesign-react/issues/602)) ([3b82c6d](https://github.com/Tencent/tdesign-react/commit/3b82c6d8403b17ea19dde04f3d1e3234f8eee4ea)) [@honkinglin](https://github.com/honkinglin)
* Popconfirm: 移除 `PopConfirm` 组件导出，请更改为 `Popconfirm` ([#614](https://github.com/Tencent/tdesign-react/issues/614)) ([ca6e4b6](https://github.com/Tencent/tdesign-react/commit/ca6e4b6852469bba35d47ba0811054fc796c1a69)) [@honkinglin](https://github.com/honkinglin)
* Popup: 支持 `attach` 函数传入 `triggerNode` ([#616](https://github.com/Tencent/tdesign-react/issues/616)) ([95edef3](https://github.com/Tencent/tdesign-react/commit/95edef347a5b28f6791ac14684d0ae54e9974174)) [@honkinglin](https://github.com/honkinglin)


## 0.30.2 `2022-04-08`

### Bug Fixes

* Cascader: 修复定制数据字段别名 label 不展示问题 ([677f4e2](https://github.com/Tencent/tdesign-react/commit/677f4e2cd7c8a13d503fac485d0d2688ddfd429a)) [@jsonz1993](https://github.com/jsonz1993)
* Form: 兼容 `FormItem` 单独使用报错问题 ([#588](https://github.com/Tencent/tdesign-react/issues/588)) ([275dd99](https://github.com/Tencent/tdesign-react/commit/275dd999b38adc2f7b8ce1ae156ef8266b935b05)) [@honkinglin](https://github.com/honkinglin)
* Table:
  * 修复 `table` 高度问题 ([#593](https://github.com/Tencent/tdesign-react/issues/593)) ([9de72b6](https://github.com/Tencent/tdesign-react/commit/9de72b6d129ac98f0ffb5962885aba78f291e236)) [@honkinglin](https://github.com/honkinglin)
  * 修复 `table` `className` ts 类型丢失 ([#589](https://github.com/Tencent/tdesign-react/issues/589)) ([6349dba](https://github.com/Tencent/tdesign-react/commit/6349dbac2354d5a74dedbd38383b58abf827fc48)) [@honkinglin](https://github.com/honkinglin)
* Upload: 修复多图片上传时 `defaultFiles` 造成上传进度错误 ([#586](https://github.com/Tencent/tdesign-react/issues/586)) ([f71499f](https://github.com/Tencent/tdesign-react/commit/f71499f77a59caf127f601eb747c2e8dd2b8c649)), closes [#584](https://github.com/Tencent/tdesign-react/issues/584) [@yaogengzhu](https://github.com/yaogengzhu)
* Slider: 兼容不传 `value` 场景 ([1ab2a90](https://github.com/Tencent/tdesign-react/commit/1ab2a9054fee90f84ee2946bcd1b3b49799ad83d)) [@andyjxli](https://github.com/andyjxli)


### Features

* Breadcrumb: 增加自定义 `children` 时对 `separator` 的支持 ([1ffcadb](https://github.com/Tencent/tdesign-react/commit/1ffcadb921d3779c0b3031e97ec8fbc8dd38b758)) [@LittlehorseXie](https://github.com/LittlehorseXie)
* Popconfirm: 调整组件导出命名 ([#585](https://github.com/Tencent/tdesign-react/issues/585)) ([e24816d](https://github.com/Tencent/tdesign-react/commit/e24816d558c1fdda906b770bb379ca64a171bf50)) [@honkinglin](https://github.com/honkinglin)


## 0.30.1 `2022-04-01`

### Bug Fixes

* Pagination: 修复输入框宽度自适应问题 ([b6ba28b](https://github.com/Tencent/tdesign-react/commit/b6ba28b2c4415297318b5d839589faf92a055b40)) [@uyarn](https://github.com/uyarn)
* Datepicker: 修复区间时间选择时，月份/年份选择面板样式异常的问题，([#489](https://github.com/Tencent/tdesign-react/issues/489)) [@honkinglin](https://github.com/honkinglin)


### Features

* Tabs: 优化组件内部逻辑 ([#521](https://github.com/Tencent/tdesign-react/pull/521)) [@LeeJim](https://github.com/LeeJim)


## 0.30.0 `2022-03-31`


### BREAKING CHANGES

* SelectInput: 之前只设置 `borderless` 就能达到自动适应宽度效果，之后需要同时设置 `autowidth` [@carolin913](https://github.com/carolin913)
* FormItem: `label` 为空时不再渲染宽度，如需与有 `label` 的 `FormItem` 对齐需要手动控制 `FormItem` 样式 ([#552](https://github.com/Tencent/tdesign-react/issues/552)) ([a3a0376](https://github.com/Tencent/tdesign-react/commit/a3a03769254dcdf48ef7568894d65ee9e39b9640)) [@honkinglin](https://github.com/honkinglin)

### Bug Fixes

* Addon: 完善 type 类型 ([58b7ea5](https://github.com/Tencent/tdesign-react/commit/58b7ea5588645519e4b3dd7eb07c750c7d82edc2)) [@honkinglin](https://github.com/honkinglin)
* Cascader: 修复 `multiple` 模式时 `value` `undefined` 崩溃 ([7bb0a88](https://github.com/Tencent/tdesign-react/commit/7bb0a8854a7ac2520072f7d3ff37dfe81c3ff41a)) [@docoder](https://github.com/docoder)
* InputNumber: 修复不能输入小数点问题 ([802b3e0](https://github.com/Tencent/tdesign-react/commit/802b3e09853c6461d7119bca2c8a116566de1731)) [@docoder](https://github.com/docoder)
* Loading: 修复在 `normal` 状态下属性失效问题 ([9cec56f](https://github.com/Tencent/tdesign-react/commit/9cec56f685adec17d1bbca831dee14cec09089a4)) [@uyarn](https://github.com/uyarn)
* Popconfirm: 修复按需加载样式丢失问题 ([3329fa3](https://github.com/Tencent/tdesign-react/commit/3329fa3223d9b72dcddd29129f4d46b73447a01a)) [@xiaosansiji](https://github.com/xiaosansiji)
* Dialog: 移除多余 `header` `dom` 元素 ([f902841](https://github.com/Tencent/tdesign-react/commit/f90284169d30c19550c4fa1b53f31cf257db0fac)) [@xiaosansiji](https://github.com/xiaosansiji)
* Select: 修复首次 `focus` 自动搜索问题 ([78bf1ca](https://github.com/Tencent/tdesign-react/commit/78bf1ca4d7066f4702a6a6a33e4d284aad458b8c)) [@uyarn](https://github.com/uyarn)
* Textarea: 修复 `dialog` 中无法输入中文问题 ([77f11ac](https://github.com/Tencent/tdesign-react/commit/77f11acf8f1c1fc8158d006e45f16e9c7d8fb8dd)) [@carolin913](https://github.com/carolin913)

### Features

* FormItem: 支持自定义嵌套模式 & `label` 为空时不再处理占位对齐问题 ([#552](https://github.com/Tencent/tdesign-react/issues/552)) ([a3a0376](https://github.com/Tencent/tdesign-react/commit/a3a03769254dcdf48ef7568894d65ee9e39b9640)) [@honkinglin](https://github.com/honkinglin)
* Input: `placeholder` 使用全局定义文案 ([#553](https://github.com/Tencent/tdesign-react/issues/553)) ([91f71cc](https://github.com/Tencent/tdesign-react/commit/91f71cc0a7e1d714ec7b2a8a9b3d38836ec88f6d)) [@xiaosansiji](https://github.com/xiaosansiji)
* SelectInput: `borderless` 和 `autowidth` 作为独立属性分开 ([b805462](https://github.com/Tencent/tdesign-react/commit/b805462b48d3dc3d9b2d2ffce72f59f43d8a18f0)) [@carolin913](https://github.com/carolin913)


## 0.29.0 `2022-03-25`

### BREAKING CHANGES

- Input: 外部传入样式挂载至 `t-input__wrap`, 如需挂载到 `t-input`，请使用 `inputClass` api ([#528](https://github.com/Tencent/tdesign-react/pull/528)) [@pengYYYYY](https://github.com/pengYYYYY)

### Bug Fixes

- Select:
  - 修复 select `className` 透传问题 ([5fa9d1c](https://github.com/Tencent/tdesign-react/commit/5fa9d1c7bca7b0d6f6840fe2ee43840798820278)) [@honkinglin](https://github.com/honkinglin)
  修复 select `overlayClassName` 丢失的问题 ([bfe85b0](https://github.com/Tencent/tdesign-react/commit/bfe85b0aa37f536b9719df7226611b8f5dcea8fb)) [insekkei](https://github.com/insekkei)
  - Option 子组件配合自定义 keys 使用异常 ([#513](https://github.com/Tencent/tdesign-react/issues/513)) ([9f51f42](https://github.com/Tencent/tdesign-react/commit/9f51f423ed9dab86498b98a649a76b7d4b1deddc)) [@samhou1988](https://github.com/samhou1988)
- Selectinput:
  - `onclear` 受控非受控逻辑导致卡死 ([28dcde6](https://github.com/Tencent/tdesign-react/commit/28dcde6e8f6e82a666604864abde4537d327122c)) [@carolin913](https://github.com/carolin913)
  - type 类型问题及 key 重复问题 ([0041f9e](https://github.com/Tencent/tdesign-react/commit/0041f9eef5ed72cbefe0f91404b86cad1e00fc68)) [@carolin913](https://github.com/carolin913)
- Input:
  - 修复 input type 为 `password` 场景下 `suffixIcon` 受控失效问题 ([#516](https://github.com/Tencent/tdesign-react/issues/516)) ([3031ac8](https://github.com/Tencent/tdesign-react/commit/3031ac8514a37df6712950a2160924ec8dea4947)) [@honkinglin](https://github.com/honkinglin)
  - type 类型问题及 key 重复问题 ([0041f9e](https://github.com/Tencent/tdesign-react/commit/0041f9eef5ed72cbefe0f91404b86cad1e00fc68)) [@carolin913](https://github.com/carolin913)
- Drawer: 根据 common Drawer 样式配置指定 tabIndex 消除 outline ([#501](https://github.com/Tencent/tdesign-react/issues/501)) ([4dc2d86](https://github.com/Tencent/tdesign-react/commit/4dc2d86a4a91a1beb3395a87ed7f8c790b4575c7)) [@PBK-B](https://github.com/PBK-B)
- RadioGroup: 修复 `radioGroup` 手动清除 `value` 样式不响应问题 ([#536](https://github.com/Tencent/tdesign-react/issues/536)) ([c022130](https://github.com/Tencent/tdesign-react/commit/c0221303ecd243363a9143a1ffbd68691377a45d)) [@honkinglin](https://github.com/honkinglin)
- Dialog: 修复 `closeOnOverlayClick` 失效问题 ([29b8589](https://github.com/Tencent/tdesign-react/commit/29b8589cd7f8ec2c94a2bc18131dd7e757a1e01c)) [@psaren](https://github.com/psaren)
- Form: `reset` 失败如果 `initialdata` 是 `undefined` ([b3ab31a](https://github.com/Tencent/tdesign-react/commit/b3ab31a09bbd26fb241fa82b6e2c2bda80af8ab9)) [@carolin913](https://github.com/carolin913)
- Popup: `偶现显示时定位不准，windowresize` 无法自适应 ([83f9f89](https://github.com/Tencent/tdesign-react/commit/83f9f8929a68d1a540a68e906e47ac59203f2072)) [@carolin913](https://github.com/carolin913)
- Treeselect: 无法折叠问题修复 ([e02ec2d](https://github.com/Tencent/tdesign-react/commit/e02ec2d96cfb00ab5b8e2ee9e853656a3940e311)) [@carolin913](https://github.com/carolin913)
- Date Picker: `focused` 态样式修复 ([#528](https://github.com/Tencent/tdesign-react/pull/528)) [@pengYYYYY](https://github.com/pengYYYYY)

### Features

- Input: 增加 `inputClass` API，用于透传 class 到 `t-input` 同级 ([#528](https://github.com/Tencent/tdesign-react/pull/528)) [@pengYYYYY](https://github.com/pengYYYYY)
- Upload: 支持 `modify` method ([82a26da](https://github.com/Tencent/tdesign-react/commit/82a26dacb1de1a4700911307413563f8ec5e9b19)) [@samhou1988](https://github.com/samhou1988)
- InputNumber: 默认尺寸下输入框宽度调整，修复默认内容展示不全的问题，[issue #623](https://github.com/Tencent/tdesign-vue/issues/623) [@xiaosansiji](https://github.com/xiaosansiji)


## 0.28.0 `2022-03-18`

### BREAKING CHANGES

- Swiper: 交互、设计、API 全部重构，如有使用老的 Swiper 组件需重新接入

### Bug Fixes

- Datepicker: 修复 `placeholder` 无效问题 ([#492](https://github.com/Tencent/tdesign-react/issues/492)) ([650e4ab](https://github.com/Tencent/tdesign-react/commit/650e4ab981846fd4f51695dcce3ac85d26b5c0f6)) [@honkinglin](https://github.com/honkinglin)
- Anchor: 修复 AnchorItem `className` 无效问题 ([fa10e22](https://github.com/Tencent/tdesign-react/commit/fa10e227ef0f9bd9cc90950bafe42d0b195d3253)) [@carolin913](https://github.com/carolin913)
- Slider: 修复 disabled 无效问题 ([bb6b9f3](https://github.com/Tencent/tdesign-react/commit/bb6b9f3aed536cf448768eda8ff11f90a44021a3)) [@andyjxli](https://github.com/andyjxli)
- Table: 修复 key 有 0 的数据时的排序问题 ([415fb74](https://github.com/Tencent/tdesign-react/commit/415fb7441d7ed90436fb2274f96cf5debbb6e17f)) [@carolin913](https://github.com/carolin913)
- Form: 修复 `submit` 报错 ([#510](https://github.com/Tencent/tdesign-react/issues/510)) ([0b97c07](https://github.com/Tencent/tdesign-react/commit/0b97c0791013c6156adbd47794b7333799d8015e)) [@honkinglin](https://github.com/honkinglin)

### Features

- Swiper: 重构 `swiper` 组件 ([3d55eeb](https://github.com/Tencent/tdesign-react/commit/3d55eebad57f577c888e6c1bf88f43c020e5d4a3)) [@duenyang](https://github.com/duenyang)
- Cascader: 修复 children boolean 类型问题 ([#508](https://github.com/Tencent/tdesign-react/issues/508)) ([dca3289](https://github.com/Tencent/tdesign-react/commit/dca3289ddc1122238b058be8a49cbe6cd6c045b3)) [@honkinglin](https://github.com/honkinglin)
- Grid: 支持获取 css vars 做响应式判断 ([#481](https://github.com/Tencent/tdesign-react/issues/481)) ([faed791](https://github.com/Tencent/tdesign-react/commit/faed79123cbdb7e2d633a912a7037c06e5b19408)) [@honkinglin](https://github.com/honkinglin)
- Icon: 支持自定义 Url ([b10171a](https://github.com/Tencent/tdesign-react/commit/b10171a12dfa1ef66138b418afc1dbf759e43f25)) [@uyarn](https://github.com/uyarn)
- Slider: `label` 支持 function 自定义渲染 ([e660d18](https://github.com/Tencent/tdesign-react/commit/e660d18cad006c26a926993f24724336bd8c45bc)) [@andyjxli](https://github.com/andyjxli)
- TreeSelect: 完善新增 api ([969e96b](https://github.com/Tencent/tdesign-react/commit/969e96bb248fa5cc34eb4dceb694f72139d9b500)) [@Hoofoo-WHU](https://github.com/Hoofoo-WHU)
- Form: 支持 `showErrorMessage` api & `help` 支持 Tnode 类型 ([#490](https://github.com/Tencent/tdesign-react/issues/490)) ([c78dad2](https://github.com/Tencent/tdesign-react/commit/c78dad2fc7130edd2b81a1aa063794435a0a7507)) [@honkinglin](https://github.com/honkinglin)

## 0.27.2 `2022-03-15`

### Bug Fixes

- Form: 修复 `FormItemProps` 缺少 `children` 类型 ([#482](https://github.com/Tencent/tdesign-react/issues/482)) ([f8bb713](https://github.com/Tencent/tdesign-react/commit/f8bb71320e614d3e829ff67aef805959f33bc3af)) [@PBK-B](https://github.com/PBK-B)
- Dialog: 修复 `DialogPlugin` 关闭后滚动问题 ([fc36aa0](https://github.com/Tencent/tdesign-react/commit/fc36aa07e7c5ff9b799bc7d8062620d95026115f)), closes [#484](https://github.com/Tencent/tdesign-react/issues/484) [@psaren](https://github.com/psaren)

### Features

- Ripple: 添加 className 方便 css 选择 ([da6fd6d](https://github.com/Tencent/tdesign-react/commit/da6fd6da8c5b6a0aa8f397252ddd6b5bd14783f3)) [@uyarn](https://github.com/uyarn)
- Portal: 添加 className 方便 css 选择 ([d2b13ac](https://github.com/Tencent/tdesign-react/commit/d2b13aca5629db98f5d3e2f840a1044cf85369ca)) [@honkinglin](https://github.com/honkinglin)

## 0.27.1 `2022-03-14`

### Bug Fixes

- Cascader: 修复 `multiple` 模式点击后关闭 `popup` 问题 ([#479](https://github.com/Tencent/tdesign-react/issues/479)) ([aab1903](https://github.com/Tencent/tdesign-react/commit/aab1903b35e72d52a4829e43089b236d9eab96d9)) [@honkinglin](https://github.com/honkinglin)
- Message: 函数调用支持 `onCloseBtnClose` API ([0bb5b11](https://github.com/Tencent/tdesign-react/commit/0bb5b114923a9d57105d26146d70dc210be28ddb)) [@kenzyyang](https://github.com/kenzyyang)

### Features

- FormItem: 兼容包裹 upload 组件时未传入 `initialData` 场景 ([#473](https://github.com/Tencent/tdesign-react/issues/473)) ([01c30bd](https://github.com/Tencent/tdesign-react/commit/01c30bd0266a3a1885f447d67a2a7c2d2b962db4)) [@honkinglin](https://github.com/honkinglin)
- InputNumber: 支持 `autoWidth`、`tips`、`status`、 `align` API ([b6fe095](https://github.com/Tencent/tdesign-react/commit/b6fe095eed6aab2645f5caf2cd4f7528af2a37da)) [@uyarn](https://github.com/uyarn)
- Table: 支持 `onChange` api ([9968d69](https://github.com/Tencent/tdesign-react/commit/9968d693fe3f202405a7902065234ec9d30343c2)) [@yunfeic](https://github.com/yunfeic)

## 0.27.0 `2022-03-11`

### BREAKING CHANGES

- Input: DOM 结构调整，最外层调整为 `t-input__wrap`
- Select: 使用 `SelectInput` 组件重构，DOM 结构调整

### Bug Fixes

- Menu:
  - 修复高度渲染判断问题 ([734f15e](https://github.com/Tencent/tdesign-react/commit/d6caca998090e3172c9cd59ec339440b3a82d597)) [@andyjxli](https://github.com/andyjxli)
  - `SubMenu` 支持 `className` ([8b6f385](https://github.com/Tencent/tdesign-react/commit/8b6f385fdf0d42a35c70c774448007ba590d12df)) [@andyjxli](https://github.com/andyjxli)
- Cascader: 修复子节点重复渲染问题 ([88b4973](https://github.com/Tencent/tdesign-react/commit/88b4973fe21bf50497c4aa829e1ddf5eb9a14b0a)) [@pengYYYYY](https://github.com/pengYYYYY)
- Loading: 修复指令调用后锁屏样式未移除问题 ([f91218b](https://github.com/Tencent/tdesign-react/commit/f91218bf5d266efdf421dc25a4e1748f0781b798)) [@uyarn](https://github.com/uyarn)
- Radio: 修复动态渲染滑块未展示问题 ([dcd818b](https://github.com/Tencent/tdesign-react/commit/dcd818b05ffe70db271657c51c8fa1ae203cac52)) [@carolin913](https://github.com/carolin913)
- SelectInput: 修复 `tag` 过多时滚动模式失效 ([3e1fb87](https://github.com/Tencent/tdesign-react/commit/3e1fb874cf9f5df0d5b4477b6b3709ebc04ed66e)) [@carolin913](https://github.com/carolin913) [@LittlehorseXie](https://github.com/LittlehorseXie)
- Table: 鼠标事件参数未按 `RowEventContext` 定义输出 ([cc102dc](https://github.com/Tencent/tdesign-react/commit/cc102dcbdb52e0935c5958eda4e741d439fa993c)) [@yunfeic](https://github.com/yunfeic)

### Features

- Input: 优化 input 样式问题 ([#436](https://github.com/Tencent/tdesign-react/issues/436)) ([87b48e3](https://github.com/Tencent/tdesign-react/commit/87b48e323602a366f5ec2c956d3e383a5f204697)) [@honkinglin](https://github.com/honkinglin)
- InputNumber: 快速加减优化 ([c15b02e](https://github.com/Tencent/tdesign-react/commit/c15b02e7ac36cc3acfff038103d39ce842e4a48c)) [@ZhaoRB](https://github.com/ZhaoRB)
- Message: 支持 `className` ([#468](https://github.com/Tencent/tdesign-react/issues/468)) ([42e97b2](https://github.com/Tencent/tdesign-react/commit/42e97b2b57a7a1d161f08103c1584eb0677bc6f0)) [@honkinglin](https://github.com/honkinglin)
- Tabs: 支持 `destroyOnHide` ([faca349](https://github.com/Tencent/tdesign-react/commit/faca349dffd02b8d9ff1bf20c7acae18de868269)) [@docoder](https://github.com/docoder)
- TagInput: 优化拖拽功能 ([29fc9b4](https://github.com/Tencent/tdesign-react/commit/29fc9b47af6ca7974598e0800b96a62eac53e2d5)) [@LittlehorseXie](https://github.com/LittlehorseXie)
- Select: 使用 `SelectInput` 组件重构 ([419](https://github.com/Tencent/tdesign-react/pull/419)) [@samhou1988](https://github.com/samhou1988)

## 0.26.0 `2022-03-04`

### BREAKING CHANGES

- Form: 移除 `getAllFieldsValue` API，使用 `getFieldsValue(true)` 替代 ([28f9c8d](https://github.com/Tencent/tdesign-react/commit/28f9c8d6b52afe20314be8a9fa083de2c3803dc6)) [@honkinglin](https://github.com/honkinglin)

### Bug Fixes

- SelectInput:
  - 修复点击弹框输入框不高亮 ([6dba37f](https://github.com/Tencent/tdesign-react/commit/6dba37fe848662bb2c499e8c271b130f1f9e80b8)) [@Hoofoo-WHU](https://github.com/Hoofoo-WHU)
  - 修复 `allowInput` 无效问题 ([4353b93](https://github.com/Tencent/tdesign-react/commit/4353b93dec65e463693e17dc2e0474e06b53c5fc)) [@chaishi](https://github.com/chaishi)
- Affix：修复 affix 导出问题 ([1a2f705](https://github.com/Tencent/tdesign-react/commit/1a2f705b836cad1d8a6d33a6c4ff731e2857cb8c)) [@honkinglin](https://github.com/honkinglin)
- Dialog： 修复 dialog plugin 聚焦 button 通过键盘频繁触发问题 ([41a236c](https://github.com/Tencent/tdesign-react/commit/41a236c53856c84b3b89f06fa17fc2cb921be805)) [@honkinglin](https://github.com/honkinglin)
- Alert: 修复 `classname` 自定义被覆盖 ([fd2864b](https://github.com/Tencent/tdesign-react/commit/fd2864bedccfea0ef1c42969e09bbd4111a04846)) [@carolin913](https://github.com/carolin913)
- InputNumber: 修复加减按钮边界问题 ([8ac9250](https://github.com/Tencent/tdesign-react/commit/8ac925055a3c9740e68a3f0cfb494d0fe82ec5a8)) [@uyarn](https://github.com/uyarn)
- Taginput: 修复 `ondragsort` 参数类型问题 ([99d94b5](https://github.com/Tencent/tdesign-react/commit/99d94b5ae0a119ef0bb8b7c6f6a3bf4c657f58f6)) [@carolin913](https://github.com/carolin913)

### Features

- Input: 支持 `maxcharacter`、`maxlength`、`format` API ([cf6f771](https://github.com/Tencent/tdesign-react/commit/cf6f77184b45f7f8a593c57dc8d90a2883c28184)) [@honkinglin](https://github.com/honkinglin)
- TagInput: 支持透传 `className`、`style` ([666f64b](https://github.com/Tencent/tdesign-react/commit/666f64b04d42a4e5bd81ebf52db82b825c085f4a)) [@chaishi](https://github.com/chaishi)
- Animation: 支持 `globalConfig` 全局控制动画开关 ([4ac5f0d](https://github.com/Tencent/tdesign-react/commit/4ac5f0d9355f9296d9f95f9c8aa57525327bfe8d)) [@uyarn](https://github.com/uyarn)
- Dialog: 支持 Esc 关闭 ([fb66a5d](https://github.com/Tencent/tdesign-react/commit/fb66a5d6234539d94cd9bcfecd390058a4ba2a59)) [@psaren](https://github.com/psaren)
- Form: 支持 `setValidateMessage`、`errorMessage` API ([28f9c8d](https://github.com/Tencent/tdesign-react/commit/28f9c8d6b52afe20314be8a9fa083de2c3803dc6)) [@honkinglin](https://github.com/honkinglin)
- Upload: 支持 `onCancelUpload` & `onSelectChange` api ([5c39c74](https://github.com/Tencent/tdesign-react/commit/5c39c741ca3cc32348056e1221e1e7f12d35a691)) [@wookaoer](https://github.com/wookaoer)
- TreeSelect: 使用 `SelectInput` 组件重构 ([edc387d](https://github.com/Tencent/tdesign-react/pull/415/commits/edc387d6a13a35af6ff06cead56aa679e7b5bcb8)) [@Hoofoo-WHU](https://github.com/Hoofoo-WHU)

## 0.25.2 `2022-02-25`

### 🐞 Bug Fixes

- Table: [#334](https://github.com/Tencent/tdesign-react/issues/334) 固定列定位计算问题 ([56b7a55](https://github.com/Tencent/tdesign-react/commit/56b7a55bb5686035adf733bfa06b8930f52ce242)) [@yangguansen](https://github.com/yangguansen)
- TagInput: 兼容 value defaultValue 都未设置场景 ([a317786](https://github.com/Tencent/tdesign-react/commit/a31778646b88ad0db089ac8ad483383283217c22)) [@honkinglin](https://github.com/honkinglin)
- Slider: 修复刻度计算问题，input number 样式问题 ([03aa1dd](https://github.com/Tencent/tdesign-react/commit/03aa1ddd0f1005267145652599c467ef39ba7bea)) [@andyjxli](https://github.com/andyjxli)
- Popup: 修复 trigger 元素宽高定位变化后位置不更新问题 ([933db7c](https://github.com/Tencent/tdesign-react/commit/933db7c065c3955139c4353f5ce6fe3f27d51587)) [@honkinglin](https://github.com/honkinglin)
- Cascader: fix cascader issue 371&&304 ([96536c0](https://github.com/Tencent/tdesign-react/commit/96536c00827bbff22d67167accc67d37838190c0)) [@pengYYYYY](https://github.com/pengYYYYY)
- Checkbox: 修复 checkbox 组件 options 为空数组时的问题 ([ce671c2](https://github.com/Tencent/tdesign-react/commit/ce671c2ba4cef467c7057e7e62448d1e65c166f8)) [@ZhaoRB](https://github.com/ZhaoRB)
- Layout: 支持内嵌动态节点 ([54a297f](https://github.com/Tencent/tdesign-react/commit/54a297ffa763d2cd31db111d111cb4b2c8cc433b)) [@insekkei](https://github.com/insekkei)
- Dialog: 多个弹窗关闭一个后出现滚动条 ([5cf75c1](https://github.com/Tencent/tdesign-react/commit/5cf75c11d03a83a298c01cb518864e8517bc8cab)), closes [#382](https://github.com/Tencent/tdesign-react/issues/382) [@psaren](https://github.com/psaren)

### 🌈 Features

- SelectInput: 新增组件 SelectInpput 组件 ([d2d9cf8](https://github.com/Tencent/tdesign-react/commit/d2d9cf89d9e53762fd8e689b88b918358824fd0b)) [@chaishi](https://github.com/chaishi)
- Input: 支持 auto-width API ([cf24ca5](https://github.com/Tencent/tdesign-react/commit/cf24ca548cf07328a527d546e2ee4733062677bd)) [@chaishi](https://github.com/chaishi)
- Notification: 优化组件内部细节 ([9cd0a08](https://github.com/Tencent/tdesign-react/commit/9cd0a089b24457520e5ef8695e4f5ec5e6574923)) [@kenzyyang](https://github.com/kenzyyang)
- TagInput:
  - 支持 auto-width API ([cf24ca5](https://github.com/Tencent/tdesign-react/commit/cf24ca548cf07328a527d546e2ee4733062677bd)) [@chaishi](https://github.com/chaishi)
  - 支持 dragSort 功能 ([6872bd9](https://github.com/Tencent/tdesign-react/commit/6872bd9d8ee42e840a529480360646e68585cad4)) [@LittlehorseXie](https://github.com/LittlehorseXie)

## 0.25.1 `2022-02-18`

### 🐞 Bug Fixes

- Notification: 修复组件状态更新后关闭逻辑报错问题 ([2a6eff1](https://github.com/Tencent/tdesign-react/commit/2a6eff1258352ceb24e696b9ed2519dd089c4d8e)) [@kenzyyang](https://github.com/kenzyyang)
- Progress: 修复 `percentage` 为 `0` 时样式问题 ([d481552](https://github.com/Tencent/tdesign-react/commit/d481552e66e8f69ab7cd476c3a68550bda5df96b)) [@uyarn](https://github.com/uyarn)
- TimePicker: 修复鼠标滚轮事件问题 ([e0028d5](https://github.com/Tencent/tdesign-react/commit/e0028d59213fd8dea53eb25acefd2b34007ba9ea)) [@uyarn](https://github.com/uyarn)

## 0.25.0 `2022-02-17`

### ❗️ BREAKING CHANGES

- Textarea: 调整 `ref` 导出，输出 `currentElement` 及 `textareaElement` ([b0b7dee](https://github.com/Tencent/tdesign-react/commit/b0b7dee42afcaaebed97dd8490ad7de6ceb20f08)) [@carolin913](https://github.com/carolin913)

### 🐞 Bug Fixes

- Table:
  - 兼容 `colkey` 未指定导致 `key` 重复问题 ([#347](https://github.com/Tencent/tdesign-react/issues/347)) ([950c1bc](https://github.com/Tencent/tdesign-react/commit/950c1bcf6ae1b379adcc7eb4ae2efa6afb38c3ff)) [@honkinglin](https://github.com/honkinglin)
  - 修复合并行数大于等于分页 `data` 长度时多渲染列导致错位 ([1568871](https://github.com/Tencent/tdesign-react/commit/156887153991edd02118a77ecd513e6fa9232071)) [@yunfeic](https://github.com/yunfeic)
  - 修复分页器切换 `pageSzie时`消失 ([d89ff67](https://github.com/Tencent/tdesign-react/commit/d89ff67d38585573c6b62659609b4abc1e77a761)) [@yunfeic](https://github.com/yunfeic)
- Notification: 修复组件状态更新后关闭逻辑报错问题 ([#358](https://github.com/Tencent/tdesign-react/issues/358)) ([93aa507](https://github.com/Tencent/tdesign-react/commit/93aa50758739e5091e2179517d89f205a04c3af4)) [@honkinglin](https://github.com/honkinglin)
- InputNumber: 修复间距丢失问题 ([fcabaa9](https://github.com/Tencent/tdesign-react/commit/fcabaa90aac9a072454b1fe84b9933f6a1f34e1f)) [@honkinglin](https://github.com/honkinglin)
- Upload: 修复 `requestMethod` 返回 `fail` 时，图片依然回显问题 ([3bbd31b](https://github.com/Tencent/tdesign-react/commit/3bbd31bbfbec9dd3425030700d13c822ff28b778)) [@teal-front](https://github.com/teal-front)
- Select: 修复清空按钮出现时机问题 ([2c5c8b1](https://github.com/Tencent/tdesign-react/commit/2c5c8b11a1423694bd621f7a76ea253fdf2f7dd7)) [@carolin913](https://github.com/carolin913)
- Skeleton: 修复 `row` `col` 失效 ([c5ecfba](https://github.com/Tencent/tdesign-react/commit/c5ecfba2e536fd39142728acc469f7358e1c5cdf)) [@Yilun-Sun](https://github.com/Yilun-Sun)

### 🌈 Features

- TagInput: 新增 TagInput 组件 ([3305efe](https://github.com/Tencent/tdesign-react/commit/3305efe7461b33f32787d7e2f3d368b26e87d58e)) [@chaishi](https://github.com/chaishi)
- Table:
  - 单元格省略时新增 `tooltip` 提示 ([d89ff67](https://github.com/Tencent/tdesign-react/commit/d89ff67d38585573c6b62659609b4abc1e77a761)) [@yunfeic](https://github.com/yunfeic)
  - `filter.component` 支持 `function` ([cb55afc](https://github.com/Tencent/tdesign-react/commit/cb55afc1f2a10dcb63449b45ad7dfda8a178a70b)) [@yunfeic](https://github.com/yunfeic)
  - 支持自定义过滤 ([763567c](https://github.com/Tencent/tdesign-react/commit/763567cdaf4a40e31ac02e194bf8fa180e30d590)) [@yunfeic](https://github.com/yunfeic)
- TreeSelect:
  - 支持 `collapsed` API ([9b5d46e](https://github.com/Tencent/tdesign-react/commit/9b5d46e3f70adfdad849eff3f99ba0fb484ca021)) [@Hoofoo-WHU](https://github.com/Hoofoo-WHU)
  - 支持 `valueDisplay` API ([0e981de](https://github.com/Tencent/tdesign-react/commit/0e981de3898d9de6ee29c853f9d2e4622a09b438)) [@Hoofoo-WHU](https://github.com/Hoofoo-WHU)
- Datepicker: 支持 `onPick` 事件 ([6530e9e](https://github.com/Tencent/tdesign-react/commit/6530e9e40cc1ef1fcf607aa53e382dbd45669da6)) [@xiaosansiji](https://github.com/xiaosansiji)
- Input: 支持 `onWheel`、`onCompositionstart`、`onCompositionend` 事件 ([b85ea42](https://github.com/Tencent/tdesign-react/commit/b85ea423e932913c841e3b2bdfb95a49b6699398)) [@honkinglin](https://github.com/honkinglin)
- Popup: 调整下拉动画实现，使用 `clip-path` 替代 `max-height` ([f812cd2](https://github.com/Tencent/tdesign-react/commit/f812cd2f28098c8387fb6d901c1caef46dbd8d32)) [@uyarn](https://github.com/uyarn) [@honkinglin](https://github.com/honkinglin)
- Select: 优化选项字数过多省略展示 ([85017fc](https://github.com/Tencent/tdesign-react/commit/85017fc5f7ce1622635ca33e142563c7d6623b4d)), closes [#339](https://github.com/Tencent/tdesign-react/issues/339) [@carolin913](https://github.com/carolin913)
- Textarea: 支持 `autosize` API ([85017fc](https://github.com/Tencent/tdesign-react/commit/85017fc5f7ce1622635ca33e142563c7d6623b4d)), closes [#339](https://github.com/Tencent/tdesign-react/issues/339) [@carolin913](https://github.com/carolin913)

## 0.24.2 `2022-01-28`

### Bug Fixes

- Table: 修复缺失 style 目录导致组件不可用的问题 ([f11d37c](https://github.com/Tencent/tdesign-react/commit/f11d37ca881b4573d288f5d97a84a1a697202b46)) [@yunfeic](https://github.com/yunfeic)

## 0.24.1 `2022-01-27`

### Bug Fixes

- Form: 修复 `reset` 后首次更改值不触发校验 ([#317](https://github.com/Tencent/tdesign-react/issues/317)) ([796ed8c](https://github.com/Tencent/tdesign-react/commit/796ed8c3983e7fdbdae5189a611ba545b962e60b)) [@honkinglin](https://github.com/honkinglin)

## 0.24.0 `2022-01-27`

### ❗️ BREAKING CHANGES

- Tag: `variant` 属性调整，支持 `outline`、`light-outline`，废弃 `variant="plain"` ([780ac25](https://github.com/Tencent/tdesign-react/commit/780ac256824db9da3502b1440b837bca36ad61df)) [@carolin913](https://github.com/carolin913)
- Form: `reset` 不再触发 `onReset` 事件，使用独立的事件逻辑 ([#303](https://github.com/Tencent/tdesign-react/issues/303)) ([f9a7bbc](https://github.com/Tencent/tdesign-react/commit/f9a7bbc8219d1128f0641283c2508522e999119c)) [@honkinglin](https://github.com/honkinglin)

### 🐞 Bug Fixes

- Cascader:
  - 添加 `loadingtext` 国际化配置 ([46ef524](https://github.com/Tencent/tdesign-react/commit/46ef52443f2af26d23ad0f5946fff5b1d3db569c)) [@carolin913](https://github.com/carolin913)
  - `panel` 添加波纹动画 ([42ad5af](https://github.com/Tencent/tdesign-react/commit/42ad5af90a794e26a0763342c07f619f22f79895)) [@uyarn](https://github.com/uyarn)
- Tree: 修复按需引入样式丢失问题 ([#293](https://github.com/Tencent/tdesign-react/issues/293)) ([f50b888](https://github.com/Tencent/tdesign-react/commit/f50b8887cc539dddd63e92605ede3cb7ba2fd46c)) [@honkinglin](https://github.com/honkinglin)
- Chekbox: 修复 `Checkbox.Group` 的 `value` 类型为 `string` 和 `number` 的 bug ([1796843](https://github.com/Tencent/tdesign-react/commit/1796843c37e1e5594da9ca0091df01cde71c5923)) [@xinup](https://github.com/xinup)
- Popup: 修复 `zIndex` 设置错误 ([#315](https://github.com/Tencent/tdesign-react/issues/315)) ([aacb6f8](https://github.com/Tencent/tdesign-react/commit/aacb6f81f10d65cfbe09f3e752e62185faeddff9)) [@honkinglin](https://github.com/honkinglin)
- Select: 修复 `Option.name` 丢失导致组件类型判断失效问题 ([fea73f0](https://github.com/Tencent/tdesign-react/commit/fea73f0afe93ea24948d1d686e20b03da3be7abb)) [@uyarn](https://github.com/uyarn)
- Table: 修复固定列不指定 `colKey` 导致 `header` 错位问题 ([03d3936](https://github.com/Tencent/tdesign-react/commit/03d3936c77e3af682169a2c318f2bcd886892641)) [@yunfeic](https://github.com/yunfeic)

### 🌈 Features

- Table:
  - 支持树形显示 ([213a7f2](https://github.com/Tencent/tdesign-react/commit/213a7f206bb75e59a76e061f862f61335fb9551a)) [@yunfeic](https://github.com/yunfeic)
  - 支持树形行选中 ([1be5c77](https://github.com/Tencent/tdesign-react/commit/1be5c77469cdc09dc671d861cfa35e4a5f8debe2)) [@yunfeic](https://github.com/yunfeic)
  - 支持国际化配置提取 ([9080b91](https://github.com/Tencent/tdesign-react/commit/9080b91bd4c912d93dbef2557f824cce2e838167)) [@carolin913](https://github.com/carolin913)
- Form:
  - 支持 `getFieldsValue`、`getAllFieldsValue` 添加废弃提示 ([#307](https://github.com/Tencent/tdesign-react/issues/307)) ([abfbbd6](https://github.com/Tencent/tdesign-react/commit/abfbbd68ee02e1de221e5511b727b67489ec2b30)) [@honkinglin](https://github.com/honkinglin)
  - 支持 `disabled`、`clearValidate` api & 修复 `reset` 校验问题 & `reset` 支持指定 FormItem ([#303](https://github.com/Tencent/tdesign-react/issues/303)) ([f9a7bbc](https://github.com/Tencent/tdesign-react/commit/f9a7bbc8219d1128f0641283c2508522e999119c)) [@honkinglin](https://github.com/honkinglin)
- Config: 调整 `locale`、组件配置逻辑 & 支持 `globalConfig` API ([#297](https://github.com/Tencent/tdesign-react/issues/297)) ([542c254](https://github.com/Tencent/tdesign-react/commit/542c254b2529851ff42547966ff4609d49251b62)) [@honkinglin](https://github.com/honkinglin)
- Select: `ul` 标签添加 `class` 类名 ([bb47a94](https://github.com/Tencent/tdesign-react/commit/bb47a9487473e5a817c76a7df82009f66e1dc5f6)) [@honkinglin](https://github.com/honkinglin)
- Breadcrumb: 支持 `theme` api ([5627c40](https://github.com/Tencent/tdesign-react/commit/5627c40ec2485435cae60e544c0087ada53c351d)) [@samhou1988](https://github.com/samhou1988)
- Drawer: 修复 `attach` 无效问题 ([a16c031](https://github.com/Tencent/tdesign-react/commit/a16c0314cc98dc8ea6eb1ba2b5c2435674785d60)) [@LittlehorseXie](https://github.com/LittlehorseXie)
- Input: 支持 `align` 属性 ([#290](https://github.com/Tencent/tdesign-react/issues/290)) ([08ce2b5](https://github.com/Tencent/tdesign-react/commit/08ce2b5ce2b35f3878fea22532d1530cc6cbe0b3)) [@honkinglin](https://github.com/honkinglin)
- Dropdown: 修复 `ref` 警告 ([d56b4ba](https://github.com/Tencent/tdesign-react/commit/d56b4ba100515f54bad09c748ac855d194b70bc7)) [@carolin913](https://github.com/carolin913)
- Tag: 支持 `size` API ([780ac25](https://github.com/Tencent/tdesign-react/commit/780ac256824db9da3502b1440b837bca36ad61df)) [@carolin913](https://github.com/carolin913)
- Transfer: 支持 `Tree` API ([f260a3a](https://github.com/Tencent/tdesign-react/commit/f260a3af91468b10565df269abd1a7604f2334d4)) [@zj2015262624](https://github.com/zj2015262624)
- Locale: `upload`, `tree` 组件支持 国际化配置 ([34ba53e](https://github.com/Tencent/tdesign-react/commit/34ba53eae221ad860df3baa2352b6d2da9637ac9)) [@carolin913](https://github.com/carolin913)

## 0.23.1 `2022-01-21`

### Bug Fixes

- Form:
  - 修复 `getFieldValue` api 取值失效 bug ([9ee8921](https://github.com/Tencent/tdesign-react/commit/9ee892127712c2c345140c3bbbd0e22c24aae5c9)) [@yume316](https://github.com/yume316)
  - 优化 `form` 校验失败滚动问题 ([#278](https://github.com/Tencent/tdesign-react/issues/278)) ([4870d28](https://github.com/Tencent/tdesign-react/commit/4870d28bea47604ab8f4cbdc8c506c75f12bfb5f)) [@honkinglin](https://github.com/honkinglin)
- Affix: 修复 `zIndex` 参数无效和 `offsetTop` 为 0 无法固定的问题 ([ebeb69c](https://github.com/Tencent/tdesign-react/commit/ebeb69c8d471baa9fd723523e1d52c25fef840e4)) [@jas0ncn](https://github.com/jas0ncn)
- Tabs: 修复滚动问题，支持受控/非受控 ([84f033c](https://github.com/Tencent/tdesign-react/commit/84f033c82a7d7f73ecb4b7be5363e15f9f874f99)) [@insekkei](https://github.com/insekkei)
- Dialog: 修复 `mask` 动画缺失问题 ([#247](https://github.com/Tencent/tdesign-react/issues/247)) ([37d59c1](https://github.com/Tencent/tdesign-react/commit/37d59c1e0ca4d9aeae5a608e9bec7ae74c8bf2fb)), closes [#65](https://github.com/Tencent/tdesign-react/issues/65) [@honkinglin](https://github.com/honkinglin)
- Icon: `size` 类名 `t-size-middle` 改为 `t-size-medium` ([aea3f01](https://github.com/Tencent/tdesign-react/commit/aea3f01e98d257a2ff02c1380deea640b61a7677)) [@uyarn](https://github.com/uyarn)
- Popup: 优化 `destroy` 动画 & 添加 `display: none` & 优化全局 `portal` 逻辑 ([#246](https://github.com/Tencent/tdesign-react/issues/246)) ([391de56](https://github.com/Tencent/tdesign-react/commit/391de565fb99fbe2c3af50da70351a980e10d656)), closes [#231](https://github.com/Tencent/tdesign-react/issues/231) [@honkinglin](https://github.com/honkinglin)

### Features

- Form:
  - 更新校验逻辑 ([#257](https://github.com/Tencent/tdesign-react/issues/257)) ([6f0ab86](https://github.com/Tencent/tdesign-react/commit/6f0ab864fa72d449b32dd0d7a76fc6e0ab4fed6c)) [@honkinglin](https://github.com/honkinglin)
  - `formItem` 支持 `requireMark` ([#252](https://github.com/Tencent/tdesign-react/issues/252)) ([12bc822](https://github.com/Tencent/tdesign-react/commit/12bc822b98b0c282d83c39e5e81251d1d6efef2b)) [@honkinglin](https://github.com/honkinglin)
- Select:
  - 支持删除键删除 tag ([#241](https://github.com/Tencent/tdesign-react/issues/241)) ([01cde96](https://github.com/Tencent/tdesign-react/commit/01cde9607891b516e86e1b5b065c7364b5c7da86)), closes [#206](https://github.com/Tencent/tdesign-react/issues/206) [@zhangbocodes](https://github.com/zhangbocodes)
  - 支持 `panelBottomContent`、`panelTopContent`、`showArrow`、`inputProps` api ([c126604](https://github.com/Tencent/tdesign-react/commit/c12660413d7c1fbba7b872352c947bd8b2388cdf)) [@uyarn](https://github.com/uyarn)
- Table:
  - 多级表头支持排序 ([7315333](https://github.com/Tencent/tdesign-react/commit/731533398c9ee08e28efcd194fabb30516a31811)) [@yunfeic](https://github.com/yunfeic)
  - 支持行拖拽排序 ([9a004c6](https://github.com/Tencent/tdesign-react/commit/9a004c6a2b88a1fdd784b60b05d212f522b343eb)) [@yunfeic](https://github.com/yunfeic)
- Dropdown: dropdown options 支持 child 方式传入 ([#242](https://github.com/Tencent/tdesign-react/issues/242)) ([0cbfd67](https://github.com/Tencent/tdesign-react/commit/0cbfd6792a517cb2270e0b8e34d992ed45815a4c)) [@duenyang](https://github.com/duenyang)
- Popup: 支持 `onScroll` API ([fc8d613](https://github.com/Tencent/tdesign-react/commit/fc8d613bf202af0043758e21da2fe17345572af2)) [@uyarn](https://github.com/uyarn)
- Skeleton: 新增骨架屏 ([#265](https://github.com/Tencent/tdesign-react/issues/265)) ([fd8d980](https://github.com/Tencent/tdesign-react/commit/fd8d98043e9851cafe08bb12a6137031b1de8942)) [@Yilun-Sun](https://github.com/Yilun-Sun)
- Textarea: 新增 `tips` 和 `status` api ([#266](https://github.com/Tencent/tdesign-react/issues/266)) ([9cc5b72](https://github.com/Tencent/tdesign-react/commit/9cc5b728805ba942ccce6c0ee21fbf0792a7884e)) [@duenyang](https://github.com/duenyang)
- Tooltip: 支持 `duration` api ([b28b200](https://github.com/Tencent/tdesign-react/commit/b28b200fa04293bf68c3d25fa9bbefdfb8957a63)) [@carolin913](https://github.com/carolin913)
- Upload: 支持 `onPreview` api ([a004227](https://github.com/Tencent/tdesign-react/commit/a004227ddb42dba3793b4d168297e0bb5b0c8a9e)) [@teal-front](https://github.com/teal-front)

## 0.23.0 `2022-01-13`

### BREAKING CHANGES

- 调整 ref 获取 Input 组件最外层 Dom 方式为 `inputRef.current.currentElement` ([7fd11cb](https://github.com/Tencent/tdesign-react/commit/7fd11cbe7320442f40c50d797cfed1d351ab6288)) [@honkinglin](https://github.com/honkinglin)
- 调整 ref 获取 Form 组件最外层 Dom 方式为 `formRef.current.currentElement` ([46abe0b](https://github.com/Tencent/tdesign-react/commit/46abe0b73db3dbd6a5ac4805a670c97b348795ad)) [@honkinglin](https://github.com/honkinglin)

### Bug Fixes

- Popup: 修复定位动态计算错误问题 ([#226](https://github.com/Tencent/tdesign-react/issues/226)) ([6c54abf](https://github.com/Tencent/tdesign-react/commit/6c54abf076cd7897c5ee4846bb037bf64dc8f0a0)) [@honkinglin](https://github.com/honkinglin) [@uyarn](https://github.com/uyarn)
- Drawer: 修复字符串控制 confirmBtn 无效问题 ([#216](https://github.com/Tencent/tdesign-react/pull/216)) [@samhou1988](https://github.com/samhou1988)
- Form: 修复 `FormItem` 动态变化导致 `formItemsRef` 中存在 `null` 值 bug ([eaa4f70](https://github.com/Tencent/tdesign-react/commit/eaa4f70024e9e9ccd6f268b981683ad882bee3ce)) [@yume316](https://github.com/yume316)
- TimePicker: 限制输入框内容为数字类型 ([e90118c](https://github.com/Tencent/tdesign-react/commit/e90118cbe78872b36bb454d4e3a3cfaae931c98c)) [@uyarn](https://github.com/uyarn)

### Features

- Divider: 实现 `content` api ([0d59f66](https://github.com/Tencent/tdesign-react/commit/0d59f6693c898f21df18cec0cdd3c01174c2f5c8)) [@haishancai](https://github.com/haishancai)
- Form: 优化 `ref` 逻辑 ([#233](https://github.com/Tencent/tdesign-react/issues/233)) ([46abe0b](https://github.com/Tencent/tdesign-react/commit/46abe0b73db3dbd6a5ac4805a670c97b348795ad)) [@honkinglin](https://github.com/honkinglin)
- Upload: 实现 `sizelimit` api ([e576778](https://github.com/Tencent/tdesign-react/commit/e57677880ebecfafdde168575b9cb3473384ef4a)) [@teal-front](https://github.com/teal-front)
- Table: 支持传入 `className`, `style` ([dd27277](https://github.com/Tencent/tdesign-react/commit/dd27277314dfcaefea924fc702ba7bfc0c2760d5)) [@yunfeic](https://github.com/yunfeic)
- Input: 支持 tips api & 调整 ref 获取 Input Dom 方式，暴露 focus、blur、select 方法 & 支持获取内部 input 实例 (#229) ([7fd11cb](https://github.com/Tencent/tdesign-react/commit/7fd11cbe7320442f40c50d797cfed1d351ab6288)), closes [#229](https://github.com/Tencent/tdesign-react/issues/229) [#201](https://github.com/Tencent/tdesign-react/issues/201) [@honkinglin](https://github.com/honkinglin) [@Duncan-zjp](https://github.com/Duncan-zjp)

## 0.22.1 `2022-01-07`

### Bug Fixes

- Form: 修复 `setFields` 及 `setFieldsValue` 失效 bug ([b8b67d0](https://github.com/Tencent/tdesign-react/commit/b8b67d049604498804e2fed4b76b3c591a1720bd)) [@yume316](https://github.com/yume316)

## 0.22.0 `2022-01-06`

### BREAKING CHANGES

- 重命名 `Layout.Sider` 组件为 `Layout.Aside` ([f78d7f5](https://github.com/Tencent/tdesign-react/commit/f78d7f5f802ba788c9e904fed98932804fd5d1ab)) [@honkinglin](https://github.com/honkinglin)
- 改动 `AvatarGroup` 使用方式为 `Avatar.Group` ([#100](https://github.com/Tencent/tdesign-react/issues/100)) ([b2f09eb](https://github.com/Tencent/tdesign-react/commit/b2f09ebb55e8716610e6ef9c5c8b9f8f561bf9d8)) [@honkinglin](https://github.com/honkinglin)

### Bug Fixes

- Tabs: 修复多层 `menu` 父菜单切换后子菜单定位失败的问题 ([81ddd05](https://github.com/Tencent/tdesign-react/pull/185/commits/81ddd057de7116bc4219d89664b279e8e03bd6c0), closes [#161](https://github.com/Tencent/tdesign-react/issues/161)) [@insekkei](https://github.com/insekkei)
- Breadcrumb: 修复非 `options` `模式下，maxItemWidth` 没有传给子组件 `BreadcrumbItem` 问题 ([#111](https://github.com/Tencent/tdesign-react/issues/111)) ([1e53110](https://github.com/Tencent/tdesign-react/commit/1e5311077555c97c592c64034dd589ef07c979a2)), closes [#107](https://github.com/Tencent/tdesign-react/issues/107) [@Yilun-Sun](https://github.com/Yilun-Sun)
- Progress: 修复环形进度条半径计算问题 ([e3eae82](https://github.com/Tencent/tdesign-react/commit/e3eae8206f25c013ec5ea9dafb48f152cb3e757c)) [@Yilun-Sun](https://github.com/Yilun-Sun)
- DatePicker
  - 兼容初始值为非日期 ([9d8f6f7](https://github.com/Tencent/tdesign-react/commit/9d8f6f7f08a6dd1e06f983fef19f346b60e23bc5)) [@vision-yip](https://github.com/vision-yip)
  - 修复受控问题 ([#180](https://github.com/Tencent/tdesign-react/issues/180)) ([dace63d](https://github.com/Tencent/tdesign-react/commit/dace63d3ef96a8cbdad1566079478d27b0c14176)) [@honkinglin](https://github.com/honkinglin)
- Select
  - 修复 `disabled` 属性无效 ([#85](https://github.com/Tencent/tdesign-react/issues/85)) ([cc3418a](https://github.com/Tencent/tdesign-react/commit/cc3418a19d4d52ef6dd6a9ca858a5890265a2a31)) [@yaogengzhu](https://github.com/yaogengzhu)
  - 修复点选问题 ([#63](https://github.com/Tencent/tdesign-react/issues/63)) ([d126f34](https://github.com/Tencent/tdesign-react/commit/d126f34d0477544ee471c77f3e8f9178f7a3f418)) [@yaogengzhu](https://github.com/yaogengzhu)
  - 修复当添加 `select` 组件添加 `clearable` 以及 `filterable` 时, 第二次以后点击清除按钮的显示值不对 ([#61](https://github.com/Tencent/tdesign-react/issues/61)) ([d9fe70b](https://github.com/Tencent/tdesign-react/commit/d9fe70bcfdf62fb88d5e396dbd08527e14c04b17)) [@vision-yip](https://github.com/vision-yip)
  - 修复远程搜索多选时所选值展示不全问题 ([#139](https://github.com/Tencent/tdesign-react/issues/139)) ([0a26aa6](https://github.com/Tencent/tdesign-react/commit/0a26aa698a2eb25988af4448af16b949f612c840)) [@yume316](https://github.com/yume316)
- Popup
  - 修复定位问题 ([7e91720](https://github.com/Tencent/tdesign-react/commit/7e9172044204dc54ae83dbd24f32d3d506a20a82)) [@andyjxli](https://github.com/andyjxli)
  - 修复 `scrollHeight` 计算问题 ([837112b](https://github.com/Tencent/tdesign-react/commit/837112bc87571b24cfb0f6d75ca14b18a7f6cba7)) [@uyarn](https://github.com/uyarn)
  - 修复动态高度计算问题 ([a6acaff](https://github.com/Tencent/tdesign-react/commit/a6acaff7e6b9e1a7d76d2f9af291c733bb1a2b4c)) [@uyarn](https://github.com/uyarn)
  - 修复 `hover` 触发展示位置判断错误问题 ([#75](https://github.com/Tencent/tdesign-react/issues/75)) ([3145376](https://github.com/Tencent/tdesign-react/commit/31453762e6e0445d8943e981b4cb5b326d0f4131)) [@southorange1228](https://github.com/southorange1228)
- Input: 添加 `Input` `focus` 状态样式 ([01c40cf](https://github.com/Tencent/tdesign-react/commit/01c40cf735714d6dadd47db439d2f53709d6a096)) [@uyarn](https://github.com/uyarn)
- Pagination: 修复更多按钮闪烁问题 ([301beff](https://github.com/Tencent/tdesign-react/commit/301beffc18003f1e471cd8422817ac11880c4095)) [@andyjxli](https://github.com/andyjxli)
- Slider: 修复 `vertical` 样式问题 ([#66](https://github.com/Tencent/tdesign-react/issues/66)) ([5fc7808](https://github.com/Tencent/tdesign-react/commit/5fc78087e33206aabc2c8753331d6930d54e24fe)) [@southorange1228](https://github.com/southorange1228)
- Table: 修复固定表头不滚动时单元格右边线不对齐 ([bdda8d4](https://github.com/Tencent/tdesign-react/commit/bdda8d4c4f7c4f58a55660578c2766be802969ac)) [@yunfeic](https://github.com/yunfeic)
- TimePicker: 修复 `confirm` 事件无效 ([#79](https://github.com/Tencent/tdesign-react/issues/79)) ([45bca64](https://github.com/Tencent/tdesign-react/commit/45bca64118a8537617aea4a267931bacb8e95bf9)) [@yaogengzhu](https://github.com/yaogengzhu)
- Tooltip: 添加 `theme` 类型校验 ([dd05af6](https://github.com/Tencent/tdesign-react/commit/dd05af6d284a86aa2f5c365c8c0a93ad0f76bf69)) [@Yilun-Sun](https://github.com/Yilun-Sun)
- TreeSelect: 样式名 `bem` 规范 ([#135](https://github.com/Tencent/tdesign-react/issues/135)) ([28165b3](https://github.com/Tencent/tdesign-react/commit/28165b39460dcb2703db4faf3ee377056db4263c)) [@honkinglin](https://github.com/honkinglin)

### Features

- Tree: 支持 `disableCheck` API ([#129](https://github.com/Tencent/tdesign-react/issues/129)) ([6e137f5](https://github.com/Tencent/tdesign-react/commit/6e137f5f12c6655ff77c0d24e6d848479db5e389)), closes [#97](https://github.com/Tencent/tdesign-react/issues/97) [@Ruoleery](https://github.com/Ruoleery)
- Button: 实现 `content` API & 完善单测 ([9c25ca5](https://github.com/Tencent/tdesign-react/commit/9c25ca5f3a114f3a344532440528adcaf0156d50)) [@haishancai](https://github.com/haishancai)
- Calendar: 支持 `onMonthChange` API ([#116](https://github.com/Tencent/tdesign-react/issues/116)) ([c44b5a3](https://github.com/Tencent/tdesign-react/commit/c44b5a3a901bc9d77358f05657185633b436307d)) [@pengYYYYY](https://github.com/pengYYYYY)
- Cascader: 优化内部 `Input` 宽度设置为 100% ([62c3c7d](https://github.com/Tencent/tdesign-react/commit/62c3c7dd3413d9347a0bb3f3ce6c1d8f60c847b4)) [@pengYYYYY](https://github.com/pengYYYYY)
- Form: 优化 `form` 获取 `formItem` 实例逻辑 & 支持 `FormItem` 组件可被标签嵌套 ([#188](https://github.com/Tencent/tdesign-react/issues/188)) ([bb123a1](https://github.com/Tencent/tdesign-react/commit/bb123a1b0468e9283228d1ba02ed6691111cbabe)) [@honkinglin](https://github.com/honkinglin)
- Form: 新增 `onValuesChange` 事件 ([#121](https://github.com/Tencent/tdesign-react/issues/121)) ([1b2b349](https://github.com/Tencent/tdesign-react/commit/1b2b349eab5d46c25b3a45dc1cf080dcf5b5ba50)) [@honkinglin](https://github.com/honkinglin)
- Layout: 支持 `direction` api ([8448581](https://github.com/Tencent/tdesign-react/commit/84485811f5f7f99188fe8c9661a74570004c7571)) [@honkinglin](https://github.com/honkinglin)
- Pagination: 调整 `Input` 为 `InputNumber` 组件 ([#77](https://github.com/Tencent/tdesign-react/issues/77)) ([0bee39f](https://github.com/Tencent/tdesign-react/commit/0bee39f14ade40627a2746739fffc91dc04caf71)) [@honkinglin](https://github.com/honkinglin)
- Upload: 同步最新 API 改动 ([b8c864b](https://github.com/Tencent/tdesign-react/pull/159/commits/b8c864b502d8d91f192902a6189eb70186e9b8da)) [@wookaoer](https://github.com/wookaoer)

## 0.21.0 `2021-12-23`

### BREAKING CHANGES

- `Select`、`Transfer`、`Steps` 组件 CSS 命名规范处理，如果有通过类名进行样式覆盖，请务必参考该列表 [组件类名调整列表](https://github.com/Tencent/tdesign-react/issues/54)

### Bug Fixes

- 去除 engine 限制 ([68371fb](https://github.com/Tencent/tdesign-react/commit/68371fbe02142e15a73bba7734392c1ec105eb67)) [@honkinglin](https://github.com/honkinglin)

## 0.20.2 `2021-12-22`

### BREAKING CHANGES

- 大量组件进行 CSS 命名规范处理，如果有通过类名进行样式覆盖，请务必参考该列表 [组件类名调整列表](https://github.com/Tencent/tdesign-react/issues/54)
- Message: 支持 `MessagePlugin`, `message.info` 调用方式，废弃 `Messzge.info` 调用([5d3dc04](https://github.com/Tencent/tdesign-react/commit/5d3dc0463bf66489dfe4d5c79902fe707ae32e48)) [@kenzyyang](https://github.com/kenzyyang)
- Notification: 组件插件化使用方式破坏性修改，支持 `NotificationPlugin`,`notification` 调用 ([98c3d0a](https://github.com/Tencent/tdesign-react/commit/98c3d0af845354c969ff01feb35ec2ab3a46b091)) [@kenzyyang](https://github.com/kenzyyang)

### Bug Fixes

- Form: 修复 status 重置失效的问题 ([#45](https://github.com/Tencent/tdesign-react/issues/45)) ([8114ac9](https://github.com/Tencent/tdesign-react/commit/8114ac9baf32846966f249c132444afeae7c330a)) [@honkinglin](https://github.com/honkinglin)
- Select: 修复多选状态下 onVisibleChange 多次触发的问题 ([4eacffc](https://github.com/Tencent/tdesign-react/commit/4eacffc5aa15175ce17805ab04d030192bffc588)) [@uyarn](https://github.com/uyarn)
- Select: 支持 0 作为 value ([c716e92](https://github.com/Tencent/tdesign-react/commit/c716e92c5de4e08b665b2d14116223385468c90a)) [@uyarn](https://github.com/uyarn)
- Table: 修复合并单元格中 `borderLeft` 不显示的问题([69da5ee](https://github.com/Tencent/tdesign-react/commit/69da5ee9088ea43d4f77fc82126a4863b8b40349)) [@yunfeic](https://github.com/yunfeic)
- Table: 固定头列滚动阴影不显示([d057839](https://github.com/Tencent/tdesign-react/commit/d05783987f80ce607cb73be2cee3602376975719)) [@yunfeic](https://github.com/yunfeic)
- Table: 修复固定列 react16 滚动报错引起固定头列滚动失效([9af655c](https://github.com/Tencent/tdesign-react/commit/9af655c62a7df4d14225b176ecb12860ec8ca800)) [@yunfeic](https://github.com/yunfeic)
- Upload: 修复 showUploadProgress 为 false 不生效的问题([eae4771](https://github.com/Tencent/tdesign-react/commit/eae47716bca4d57e85f268f5b63fd9f0664432d3)) [@wookaoer](https://github.com/wookaoer)
- DatePicker: 修复年份禁用判断错误 ([5654da4](https://github.com/Tencent/tdesign-react/commit/5654da4d70405d71d555329153c6427abd614cc3)) [@honkinglin](https://github.com/honkinglin)

### Features

- Avatar: 新增 Avatar 组件 ([018eea1](https://github.com/Tencent/tdesign-react/commit/018eea1234a6e73ab257f12758e8bef015a097b6)) [@zj2015262624](https://github.com/zj2015262624)
- Popup: 添加下拉动画 ([4c475fc](https://github.com/Tencent/tdesign-react/commit/4c475fcdcf39a5721d334cf340f8e50ae3326cbf)) [@andyjxli](https://github.com/andyjxli)
- Table: 合并行展开点击和 onRowClick 事件 ([b2d1578](https://github.com/Tencent/tdesign-react/commit/b2d1578fb50cdaf75804cc2e46fcc4847267d3e0)) [@yunfeic](https://github.com/yunfeic)
- Table: 支持行点击和鼠标事件 ([d42e9a9](https://github.com/Tencent/tdesign-react/commit/d42e9aa7501d6fc326aae33c84c6395da33792e5)) [@yunfeic](https://github.com/yunfeic)
- Upload: support customize request method ([5bc70be](https://github.com/Tencent/tdesign-react/commit/5bc70be02d2efaf1b724fdc530d03900fa886d8d)) [@teal-front](https://github.com/teal-front)
- Upload: support multiple files & images upload ([7154072](https://github.com/Tencent/tdesign-react/commit/7154072111f3b6a7044c7da5df126508643a2ab4)) [@teal-front](https://github.com/teal-front)

## 0.19.1 `2021-12-08`

### Bug Fixes

- 修复 Notification 引用路径报错 [@honkinglin](https://github.com/honkinglin)

## 0.19.0 `2021-12-08`

### BREAKING CHANGES

- Notification: 插件化使用方式调整，支持 `NotificationPlugin`,`notification` 的调用，废弃 `Notification.info` [@kenzyyang](https://github.com/kenzyyang)

### Bug Fixes

- Alert: icon and text vertical center [@uyarn](https://github.com/uyarn)
- Message: 修复组件自动关闭时控制态的异常和 `onDurationEnd` 事件执行两次的 bug [@kenzyyang](https://github.com/kenzyyang)
- Table: 消除空数据时底部两条横线 [@yunfeic](https://github.com/yunfeic)
- Table: 修复固定列 react16 滚动报错引起固定头列滚动失效 [@yunfeic](https://github.com/yunfeic)
- Table: 修复 header align 设置无效，react16 下固定列滚动报错 [@yunfeic](https://github.com/yunfeic)
- Textarea: 组件临时解决原生属性 rows 设置后不可用的问题。[@kenzyyang](https://github.com/kenzyyang)
- Upload: 修复 name 属性不生效问题 [@wookaoer](https://github.com/wookaoer)

### Features

- Transfer: 新增 Transfer 组件
- Dialog: 支持 `DialogPlugin` 调用方式 [@honkinglin](https://github.com/honkinglin)
- Doc: 优化文档内容 [@honkinglin](https://github.com/honkinglin)

## 0.18.2 `2021-11-29`

### Bug Fixes

- Treeselect: 修复 tag 关闭按钮渲染不同步问题 & 同步最新 api 改动 (merge request !403) [@honkinglin](https://github.com/honkinglin)
- Select: 修复多选模式 disable 禁用选中项反选问题 [@uyarn](https://github.com/uyarn)

### Features

- Checkbox: 支持 `options`、`checkAll` Api [@kenzyyang](https://github.com/kenzyyang)
- Select: 新增 `valueDisplay`、`minCollapsedNum`、`collapsedItems`、`onEnter`, `onVisibleChange` 等 API, `Select.Group` 新增 `divider` API [@uyarn](https://github.com/uyarn)

## 0.18.1 `2021-11-22`

### Features

- TS: 导出所有组件 TS 类型 [@honkinglin](https://github.com/honkinglin)

## 0.18.0 `2021-11-19`

### BREAKING CHANGES

- Grid: 优化 gutter 逻辑，传入 number 类型不指定纵向间隔 (merge request !395) [@honkinglin](https://github.com/honkinglin)

### Bug Fixes

- Popup: 修复 popup 动画移除仍可交互问题 (merge request !396) [@honkinglin](https://github.com/honkinglin)

## 0.17.1 `2021-11-16`

### Bug Fixes

- Slider: 第一次鼠标移入控制按钮的时候，`Tooltip` 位置是不正确的 (merge request !393) [@andyjxli](https://github.com/andyjxli) [@vision-yip](https://github.com/vision-yip)

## 0.17.0 `2021-11-15`

### BREAKING CHANGES

- Icon: 💥 移除 `@tencent` 前缀、切换 `tdesign-icons-react` 为 npm 包。(React 已发布至 npm 源并移除 `@tencent` 前缀，使用者升级版本时注意更改 `package.json`!) [@honkinglin](https://github.com/honkinglin)

## 0.16.1 `2021-11-12`

### Bug Fixes

- Tree: 组件展开与收起状态默认图标 [@Ruoleery](https://github.com/Ruoleery)
- Datepicker: 国际化问题 (merge request !380) [@honkinglin](https://github.com/honkinglin)
- Select: multiple 下使用直接使用 Option 的问题 [@uyarn](https://github.com/uyarn)
- Table: 固定列无滚动效果 [@yunfeic](https://github.com/yunfeic)
- Tree: 组件动画失效 [@Ruoleery](https://github.com/Ruoleery)

### Features

- Select: 支持使用 option 的 children 作为 label 来直接渲染 label [@uyarn](https://github.com/uyarn)
- Popup: 调整 popup arrow 为 css 定位 (merge request !387) [@honkinglin](https://github.com/honkinglin)
- Datepicker: 优化 Datepicker footer 样式 (merge request !378) [@xiaosansiji](https://github.com/xiaosansiji)

## 0.16.0 `2021-11-05`

### BREAKING CHANGES

- Button: 组件默认 type 调整为 button [@hjkcai](https://github.com/hjkcai)
- Grid: 优化 gutter 逻辑，调整为 rowGap 控制上下间距 (merge request !373) [@honkinglin](https://github.com/honkinglin)
- Table: 替换展开老 api showExpandArrow 为 expandIcon [@yunfeic](https://github.com/yunfeic)

## 0.15.2 `2021-10-30`

### Bug Fixes

- Cascader: 重构 Cascader & 修复受控失效问题 [@pengYYYYY](https://github.com/pengYYYYY)

### Features

- Form: 优化 formItem 提示文案展示效果 (merge request !368) [@honkinglin](https://github.com/honkinglin)
- Locale: 支持国际化配置 [@honkinglin](https://github.com/honkinglin) [@kenzyyang](https://github.com/kenzyyang)

## 0.15.1 `2021-10-27`

### Bug Fixes

- InputNumber: 修复 InputNumber descrease button 样式问题 (merge request !367) [@honkinglin](https://github.com/honkinglin)

## 0.15.0 `2021-10-22`

### BREAKING CHANGES

- Button: 新增 rectangle shape 类型 & 废弃 icon-only 样式 (merge request !360) [@honkinglin](https://github.com/honkinglin)
- Icon: 独立为 npm 包 @tencent/tdesign-icons-react，项目中有直接使用 Icon 请升级后安装此 npm 包； 新增 CaretLeftSmallIcon 等 23 个 Icon，移除 ResourceListIcon [@uyarn](https://github.com/uyarn) [@ivenszhang](https://github.com/ivenszhang)

### Bug Fixes

- TreeSelect: 按需引入样式丢失问题 [@honkinglin](https://github.com/honkinglin)
- Select: 分组选择器构建后渲染异常 [@uyarn](https://github.com/uyarn)
- Table: 分页受控失效 [@tengcaifeng](https://github.com/tengcaifeng)

### Features

- Comment: 新增 Comment 组件[@dreamsqin](https://github.com/dreamsqin)
- Upload: Upload 支持受控能力 [@wookaoer](https://github.com/wookaoer)
- Form: 优化 Form 自定义校验功能 (merge request !358) [@honkinglin](https://github.com/honkinglin)
- Form: FormItem 支持 upload 类型 [@honkinglin](https://github.com/honkinglin)
- Menu: Menu 支持多层级 (merge request !344) [@andyjxli](https://github.com/andyjxli)

## 0.14.4 `2021-10-14`

### Bug Fixes

- Tree: cssTransition 警告 [@Ruoleery](https://github.com/Ruoleery)
- Table: 页码变化未触发 onPageChange [@yunfeic](https://github.com/yunfeic)
- Pagination: current 和 pageSize 受控与非受控问题 [@uyarn](https://github.com/uyarn)

### Features

- TreeSelect: 新增 TreeSelect 组件 [@honkinglin](https://github.com/honkinglin)
- Tree: 组件支持受控能力 [@Ruoleery](https://github.com/Ruoleery)
- Dialog: 优化弹出动画、避免弹出时页面滚动条禁用导致页面跳动 [@psaren](https://github.com/psaren)

## 0.14.3 `2021-10-09`

### Bug Fixes

- Datepicker: 修复 传入 className style 无效问题 [@honkinglin](https://github.com/honkinglin)
- Inputnumber: 修复 单独引用导致 input 样式丢失问题 [@honkinglin](https://github.com/honkinglin)
- Dropdown: 修复 ripple animation lost [@uyarn](https://github.com/uyarn)
- Swiper: 修复 最后一项跳转第一项过程中动画延迟问题 [@skytt](https://github.com/skytt)
- Tree: 修复 regeneratorRuntime error [@honkinglin](https://github.com/honkinglin)

### Features

- Popconfirm: 重构 popconfirm 组件 [@kenzyyang](https://github.com/kenzyyang)

## 0.14.2 `2021-09-29`

### Bug Fixes 🐛

- Radio: Radio.Group 传 options 无效 [@psaren](https://github.com/psaren)
- Tree: 修复 Tree 组件手风琴互斥功能失效问题 (merge request !331) [@Ruoleery](https://github.com/Ruoleery)
- Checkbox: 多选无法选中，必须指定 max 值才可 (merge request !323) [@pengYYYYY](https://github.com/pengYYYYY)
- Table: 展开功能中 header 显示对于 icon,icon 对应 td 宽度值 15 调整为 25 (merge request !321) [@yunfeic](https://github.com/yunfeic)
- InputNumber: 输入部分错误内容时出现 NaN [@zj2015262624](https://github.com/zj2015262624)
- Slider: 输入值边界溢出问题 [@andyjxli](https://github.com/andyjxli)

### Features

- Swiper: 新增 Swiper 组件 (merge request !320) [@skytt](https://github.com/skytt)
- Form: FormItem 支持 blur 触发校验 (merge request !333) [@honkinglin](https://github.com/honkinglin)
- Table: 支持加载状态 (merge request !322) [@tengcaifeng](https://github.com/tengcaifeng) [@yunfeic](https://github.com/yunfeic)
- Select: 选项宽度展示优化 [@uyarn](https://github.com/uyarn)

## 0.14.1 `2021-09-24`

### Bug Fixes

- Progress: 修复 Progress 组件进度文字内显位置为垂直居中 (merge request !311) ([@zj2015262624](https://github.com/zj2015262624)
- Popup: 暴露 child event (merge request !319) ([@andyjxli](https://github.com/andyjxli)
- Select: render failed when set custom keys in multiple mode (merge request !318) ([@uyarn](https://github.com/uyarn)

### Features

- Dropdown: 新增 Dropdown 组件 [@duenyang](https://github.com/duenyang)
- Slider: 新增 Slider 组件 [@andyjxli](https://github.com/andyjxli)
- Anchor: 添加游标样式自定义功能
- Table: 自定义内容支持 (merge request !308) [@yunfeic](https://github.com/yunfeic)
- Form: 暴露 submit、reset 方法 (merge request !314) [@honkinglin](https://github.com/honkinglin)
- Form: 支持多种错误提示展示 (merge request !317) [@honkinglin](https://github.com/honkinglin)
- Form: 组件调整 labelWidth 默认值为 100px (merge request !309) [@honkinglin](https://github.com/honkinglin)

## 0.14.0 `2021-09-17`

### BREAKING CHANGES

- Menu: 去除顶部导航菜单 operations 区域内 icon 默认样式，升级用户请手动为 icon 实现样式，或增加 t-menu\_\_operations-icon class 名称

### Bug Fixes

- Form: 修复动态 FormItem 渲染报错 (merge request !293)
- Input: 修复 className 重复使用问题 (merge request !298)
- Pagination: 分页大小控制器显示问题 (merge request !289)
- Steps: 组件 current 设置为从 0 开始时，展示的 current 从 1 开始 (merge request !301)
- Form: setFields 控制 status 字段不触发校验 (merge request !287)
- Menu: 去除顶部导航菜单 operations 区域内 icon 默认样式

### Features

- 新增 DatePicker 组件
- 新增 TimePicker 组件
- 新增 Cascader 组件
- 新增 Upload 组件
- Dialog: 重构 Dialog 组件 & 支持 快捷调用方式 (merge request !278)
- Form: FormItem 支持 labelWidth & labelAlign 控制 (merge request !303)

## 0.13.0 `2021-09-10`

### BREAKING CHANGES

- Radio: 调整 Radio button 样式 & 支持 variant api & buttonStyle api 废弃
- Notification: notification API 调整为数组格式

### Bug Fixes

- Form: 修复 form style 不透传问题
- Form: number value missing
- Input: 受控改值后光标始终位最右
- Popup: dobule click bug (merge request !274)
- Table: 空数据时 foot colspan 默认 6 改为 12

### Features

- 重构 Drawer 组件 (merge request !266)
- Table: 新增选中功能

## 0.12.2 `2021-09-02`

### BREAKING CHANGES

- anchor api 变动调整： attach => container, affix => affixProps

### Bug Fixes

- fix: Form 组件 formOptions 类型定义问题
- fix: select 多选选项 disable 下不可点击

### Features

- 添加 Textarea 组件

## 0.11.5 `2021-08-30`

### Bug Fixes

- Form 修复 labelWidth 行内展示失效问题 & 添加 labelWidth 默认值 (merge request !257)
- Table pagination callback

### Features

- Tabs item 添加斜八角动画 (merge request !253)
- Tag add disabled api and demo (merge request !260)
- Form add setfields api

## 0.11.4 `2021-08-27`

### Bug Fixes

- 修复 form 组件 setFieldsValue 函数传入未定义 key 导致的报错
- 修复 form 初次渲染校验数据问题 (merge request !230)
- 重构 form ui 布局 & 修复 inline 模式 labelWidth 失效问题 (merge request !245)
- 修复 icon clipRule 的 naming 错误
- 修复 inputnumber 组件问题
- 修复 popconfirm 在 React 17 下无法正常显示的问题

### Features

- 新增 **tree** 组件
- 新增 **affix** 组件
- 新增 斜八角动画
- table 新增筛选功能 (merge request !240)

### BREAKING CHANGES

- Calendar 逻辑修复，**api 更新**，demo 完善

## 0.10.3 `2021-08-18`

### Bug Fixes

- 修复 checkbox 阻止冒泡问题 (merge request !219)
- 修复 formitem 无规则校验状态展示错误 (merge request !226)

### Features

- 优化 grid
- menuitem 增加 onclick API
- message 组件 demo 向 vue 同步，修复 placement 无效的 bug (merge request !216)
- table 组件 排序 onSortChange 补充支持 sortOptions 参数,补充类型和注释
- loading 对齐最新 API & 更新 Loading 的默认样式为渐变色 & 支持函数方式调用

## 0.10.2 `2021-08-13`

### Bug Fixes

- 修复引用 icon 丢失 css 样式问题 (merge request !212)

## 0.10.1 `2021-08-11`

### Bug Fixes

- 调整 export 顺序
- 修复 es 构建产物 css 丢失问题
- **menu:** operations 与侧边导航同步 vue 的实现 解决： 1. 侧边导航在固定高度场景下操作区域无法显示的问题 2. 侧边导航在固定高度场景下内容过长无法上下滚动的问题 (merge request !209)

## 0.10.0 `2021-08-10`

### BREAKING CHANGES

- icon 名称变更
- 默认调整组件引入方式变更为 es 引入

### Bug Fixes

- anchor: ponit 在 line 范围外显示的问题

### Features

- 更新 icon 资源
- button: 更新组件样式及 DEMO

## 0.9.1 `2021-08-04`

### Bug Fixes

- 修复 form validate 方法报错 (merge request !201)

## 0.9.0 `2021-07-30`

### BREAKING CHANGES

- 调整 Notification Api
- Table 组件适配 pagination 组件 api 改动
- 调整 Menu Api
- 规范各个组件导出方式,每个组件只会有一个导出,其余都为子组件

### Bug Fixes

- 修复 button 组件问题
- 修复 menu 组件问题
- 修复 radio group 样式问题
- Form form 组件缺少 getAllFieldsValue api 的问题
- 同步 Menu 组件样式改动
- select,pagination 的 snapshot 中去掉 t-select-placeholder
- 修复 select 组件选中文字颜色仍为 placeholder 的颜色
- Table page size change issue
- Tag fix defaultChecked
- Tabs 适配新的 dom 结构，修复新版本部分不可用的功能
- InputNumber value 与 defaultValue 优先级问题

### Features

- 📦 优化打包流程 & 支持按需引入组件 & 支持自定义主题配置
- 调整 icon 引入策略 & 防止打包引入所有 icon 文件
- 优化设计指南文档样式
- Input 补充 onClear api 支持
- Input 补充 onEnter api 支持
- Input clearable api 补充支持
- Pagination remove self hidden control
- 新增 MenuGroup 子组件

## 0.8.0 `2021-07-12`

### BREAKING CHANGES

- 调整 Notification Api
- Table 组件适配 pagination 组件 api 改动

### Bug Fixes

- Notification instance.close 不生效的问题修复，title 的测试用例修复
- Pagination 跳转时应该优先使用当前的 pageSize
- Tabs 组件去除测试用的 debugger 语句
- Form 修复 FormItem 缺少 className 属性实现的问题
- Menu fix issue 81
- 修复表单 icon 颜色范围过大的问题 (merge request !178)
- 修复 formitem 组件的 ts children 类型问题
- 修复 menu 组件样式问题
- **input-number:** value 的优先级应该大于 defaultValue (merge request !183)
- **menu:** replace iconfont with the actual icon
- **select:** 多选时空初始值修复，多选为 value 类型时展示 tag 修复

### Features

- 增加 input-number 默认导出

## 0.7.1 `2021-06-02`

### Bug Fixes

- 修复 type 引用报错
- **form:** 修复 Form 使用时缺少 className 类型定义的问题
- **form:** 修复 FormItem 使用时缺少 className 类型定义的问题
- tabs example 删除 debug 代码
- tabs onRemove 事件触发逻辑修正，现在 tabs 和 tabsPanel 上都监听后两个事件都能正常被触发

## 0.7.0 `2021-05-31`

### BREAKING CHANGES

- 调整 Message 组件 Api
- 调整 Pagination 组件 Api
- 调整 Select 组件 Api

### Bug Fixes

- Tabs onChange api 未实现的 bug 修复
- 修复 Form demo
- message 关闭单个 message demo bug 修复

### Features

- Tab onChange onRemove，tabPanel onRemove renderOnHide api 实现

## 0.6.1 `2021-05-18`

### Bug Fixes

- 修复 clipboard 依赖引入报错 (merge request !156)

### Features

- formItem 支持嵌套 formItem (merge request !154)

## 0.6.0 `2021-05-14`

### BREAKING CHANGES

- 对齐组件 Api 改动 & 优化 package.json
- **list:** 更新 List 组件 api
- 调整 List 组件 Api
- 调整 Layout 组件 Api (merge request !148)
- 调整 Loading 组件 Api (merge request !145)

### Bug Fixes

- 优化 Drawer 组件代码 (merge request !147)
- **dialog:** 修复 dialog 组件部分参数未传报错问题
- **timepicker:** fix click popup changeTime when disable

## 0.5.0 `2021-04-27`

### BREAKING CHANGES

- 调整 Checkbox 组件 api
- 调整 Radio 组件 api

### Bug Fixes

- 修复 peerDependencies 指定 react 版本报错 (merge request !141)

### Features

- 🌈 添加 Textarea 组件 (merge request !142)
- 🌈 添加 Timepicker 组件

## 0.4.0 `2021-04-23`

### BREAKING CHANGES

- 调整 Dialog 组件 api (merge request !138)
- 调整 Popconfirm 组件 api (merge request !136)
- 调整 Steps 组件 API & Step 组件更名为 StepItem
- 重构 Tabs 组件 & 调整 Tabs 组件 api

### Features

- 🌈 添加 Breadcrumb 组件

## 0.3.1 `2021-04-13`

### Bug Fixes

- 修复 0.3.0 组件类型引用报错 & 缺少 uuid 库错误
- 修复 react 站点下点击 react 跳转的问题，顺便 clean up event listener within useEffect
- 文档切换自动滚动至顶部
- 文档样式调整

## 0.3.0 `2021-04-08`

### BREAKING CHANGES

- Badge content 属性调整为 count

### Bug Fixes

- 修复 addon 下缺少对应 classname，导致包裹的 input 有圆角
- 修复 radio size 样式问题
- 修复 dialog 定位问题
- 修复 select 组件点击右侧 icon 直接触发 clear 逻辑的 bug & 修复 pagination 组件当 pageSize 设置为非法值时导致页面死循环的 bug

### Features

- 🌈 新增 InputNumber 组件

- 🌈 新增 Form 组件

- 🌈 新增 Anchor 组件

## 0.2.0 `2021-03-26`

### Bug Fixes

- 调整 Icon 后其他组件遗留的问题修复
- Dialog 修复 close 样式和 Icon 组件会冲突的问题
- 修复 calendar 组件问题
- 修复 list 组件问题
- 修复 pagination 组件问题
- 修复 pagination 组件问题
- 修复 select 组件问题
- 修复 steps 组件问题
- 修复一期组件遗留问题

### Features

- 🌈 添加 Drawer 组件
- 🌈 添加 Calendar 组件
- 🌈 添加 Divider 组件
- 🌈 添加 Grid 组件
- 🌈 添加 Layout 组件
- 🌈 添加 Progress 组件
- 🌈 添加 Tooltip 组件
- 调整 popup 组件 api
- 调整 switch 组件 api
- 调整 alert 组件 api
- 调整 badge 组件 api
- 调整 button 组件 api
- 调整 Divider 组件 api
- 调整 Grid 组件 api
- 调整 Input 组件 api
- 调整 Progress 组件 api
- 调整 Tag 组件 api
- 调整 Tooltip 组件 api
