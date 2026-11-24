---
title: 更新日志
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.0.1 `2026-11-23`

### 🚀 Features

- `Comment`: 
  - 支持全局配置 @anlyyao ([#1012](https://github.com/Tencent/tdesign-mobile-react/pull/1012))
  - 新增 `onLongPress` 属性 @anlyyao ([#1024](https://github.com/Tencent/tdesign-mobile-react/pull/1024))
- `DropdownItem`: 新增 `keepLabelActive` 属性， 表示标题是否保持高亮（含菜单收起态），仅多选场景生效 @anlyyao ([#1000](https://github.com/Tencent/tdesign-mobile-react/pull/1000))
- `Form`: `contentAlign` 属性新增 `center` 可选项 @anlyyao ([#1010](https://github.com/Tencent/tdesign-mobile-react/pull/1010))
- `Table`: 新增 `ellipsis` 和 `ellipsisTitle` 属性 @anlyyao ([#1015](https://github.com/Tencent/tdesign-mobile-react/pull/1015))

### 🐞 Bug Fixes

- `ActionSheet`: 支持列表项超出滚动 @Jesse205 ([common#2742](https://github.com/Tencent/tdesign-common/pull/2742))
- `Checkbox`: 
  - 统一圆形图标描边宽度为 2px @anlyyao ([#1016](https://github.com/Tencent/tdesign-mobile-react/pull/1016))
  - 优化组件内部图标实现路径，修复 `circle` 和 `rectangle` 图标的选中和非选中态直径不一致问题 @anlyyao ([#1016](https://github.com/Tencent/tdesign-mobile-react/pull/1016))
- `Comment`: 修复评论正文字号、正文与操作项间距等多处样式错误 @anlyyao ([#1024](https://github.com/Tencent/tdesign-mobile-react/pull/1024))
- `DropdownItem`: 禁用已展开的下拉菜单后，面板直接收起，不再接受选项操作 @anlyyao ([#1026](https://github.com/Tencent/tdesign-mobile-react/pull/1026))
- `DropdownMenu`: 修复 `label` 字重错误 @anlyyao ([#1018](https://github.com/Tencent/tdesign-mobile-react/pull/1018))
- `Form`: 
  - 调整 `FormItem` 结构使 `arrow` 仅与标签和输入框居中对齐 @anlyyao ([#1008](https://github.com/Tencent/tdesign-mobile-react/pull/1008))
  - 校验值改为读取组件内部 state，修复重置后提交校验失效 @anlyyao ([#1010](https://github.com/Tencent/tdesign-mobile-react/pull/1010))
  - 按子组件映射受控属性名，修复 Upload/Checkbox 无法受表单控制 @anlyyao ([#1010](https://github.com/Tencent/tdesign-mobile-react/pull/1010))
- `Radio`: 
  - 统一圆形图标描边宽度为 2px @anlyyao ([#1016](https://github.com/Tencent/tdesign-mobile-react/pull/1016))
  - 优化组件内部图标实现路径，修复 `circle` 图标的选中和非选中态直径不一致问题 @anlyyao ([#1016](https://github.com/Tencent/tdesign-mobile-react/pull/1016))
- `Rate`: 修复评分提示层被相邻 `Slider` 滑块遮挡的问题 @dvd233 ([common#2737](https://github.com/Tencent/tdesign-common/pull/2737))
- `Slider`: 修复 `<Slider range />` 场景挂载即崩溃 @anlyyao ([#1022](https://github.com/Tencent/tdesign-mobile-react/pull/1022))

## 🌈 1.0.0 `2026-10-15`

### 🚨 Breaking Changes

- `Cascader`: 移除 `lazy` 属性，懒加载仅通过 `load`（配合节点 `children=true`）生效 @anlyyao ([#964](https://github.com/Tencent/tdesign-mobile-react/pull/964))
- `ColorPicker`: 删除 `HSB` 颜色格式，移除无效的 `onClose` 属性 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Guide`: 调整 `GuideStep` 的 `body`、`title`、`content` 和 `highlightContent` 类型 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Icon`: `TdIconfontProps` 重命名为 `TdIconFontProps` @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `NoticeBar`: `onChange` 参数变更，支持监听垂直轮播切换事件 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Picker`: 移除无效的 `visible` 属性，`swipeDuration` 标记为废弃，建议使用 `wheelConfig.inertiaDuration` @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Swiper`: 传入 `current` 时不再强制进入受控模式，默认值改由 `defaultCurrent` 管理 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `TabBar`: `onChange` 从直接接收选中值调整为接收包含 `value` 的对象参数 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))

### 🚀 Features

- `ActionSheet`: `ActionSheetItem` 的 `icon` 字段补充 `string` 类型 @anlyyao ([#960](https://github.com/Tencent/tdesign-mobile-react/pull/960))
- `Button`: 
  - 优化点击态过度效果 @anlyyao ([common#2692](https://github.com/Tencent/tdesign-common/pull/2692))
  - 新增 `tag`、`href` 和 `form` 属性 @anlyyao ([#959](https://github.com/Tencent/tdesign-mobile-react/pull/959))
- `Cascader`: 
  - 新增 `load` 属性，调整懒加载链路为基于 `load + children=true` @anlyyao ([#964](https://github.com/Tencent/tdesign-mobile-react/pull/964))
  - 新增 `filterable`、`filter` 和 `filter-placeholder` 属性，支持搜索功能 @boomLL ([#976](https://github.com/Tencent/tdesign-mobile-react/pull/976))
- `CheckboxGroup`: 新增 `direction` 属性，表示复选框按钮排列方式 @anlyyao ([#974](https://github.com/Tencent/tdesign-mobile-react/pull/974))
- `ColorPicker`: 新增 `HEX8` 颜色格式支持 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Comment`: 新增 `Comment` 评论组件 @slatejack ([#978](https://github.com/Tencent/tdesign-mobile-react/pull/978))
- `Dropdown`: `DropdownOption` 的 `disabled` 字段改为可选项 @anlyyao ([#987](https://github.com/Tencent/tdesign-mobile-react/pull/987))
- `DropdownMenu`: 新增 `onOpen`，`onOpened`，`onClose` 与 `onClosed` 属性，弹层动画时长现与 `duration` 配置保持一致 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Fab`: 新增 `xBounds` 和 `magnet` 属性 @boomLL ([#979](https://github.com/Tencent/tdesign-mobile-react/pull/979))
- `Guide`: 
  - 新增 `hideBack` 属性，用于隐藏返回按钮。 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - `GuideStep` 新增 `children` @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - `GuideStep` 新增 `finishButtonProps` 属性，支持为不同步骤配置完成按钮 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Icon`: 新增 `tablet` 和 `tablet-filled` 图标 @RADWIMPS426 ([icons#293](https://github.com/Tencent/tdesign-icons/pull/293)) ([#951](https://github.com/Tencent/tdesign-mobile-react/pull/951))
- `ImageViewer`: 
  - 新增 `cover` 属性，支持自定义图片上层覆盖内容 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - 新增 `image` 属性，支持自定义图片渲染 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - 新增 `loop` 属性，控制是否循环预览 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - `ImageInfo` 新增 `extra` 扩展数据 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Indexes`: 新增受控属性 `current` 和非受控属性 `defaultCurrent`，支持根据当前索引同步滚动位置和激活状态 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `NoticeBar`: 新增 `interval`，用于配置垂直轮播间隔 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Picker`: 
  - 新增 `wheelConfig`，支持配置惯性、回弹、过渡和点击阈值。 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - `PickerColumnItem` 新增 `disabled` @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `PullDownRefresh`: 新增 `successDuration`，用于配置刷新成功状态的展示时长，默认值为 500ms @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `Radio`: `RadioGroup.keys` 新增对 `disabled` 字段别名的支持 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
- `RadioGroup`: 新增 `direction` 属性，表示单选框按钮排列方式 @anlyyao ([#974](https://github.com/Tencent/tdesign-mobile-react/pull/974))
- `Search`: 新增 `maxcharacter` 和 `maxlength` 属性 @anlyyao ([#963](https://github.com/Tencent/tdesign-mobile-react/pull/963))
- `Slider`: 
  - 实现 `onDragstart` 和 `onDragend` 拖动生命周期事件 @anlyyao ([#966](https://github.com/Tencent/tdesign-mobile-react/pull/966))
  - 新增 `vertical` 属性，支持垂直滑块 @liweijie0812 ([#991](https://github.com/Tencent/tdesign-mobile-react/pull/991))
- `SwipeCell`: 
  - 新增 `onDragstart` 和 `onDragend` 事件 @boomLL ([#977](https://github.com/Tencent/tdesign-mobile-react/pull/977))
  - 支持通过实例方法 `showSure` 展示二次确认内容 @liweijie0812 ([#981](https://github.com/Tencent/tdesign-mobile-react/pull/981))

### 🐞 Bug Fixes

- `ActionSheet`: 修复子项激活态样式缺失的问题 @anlyyao ([common#2691](https://github.com/Tencent/tdesign-common/pull/2691))
- `Collapse`: 修复面板展开时底部线框样式错误 @anlyyao ([#962](https://github.com/Tencent/tdesign-mobile-react/pull/962))
- `ConfigProvider`: 
  - `TableConfig`全局配置项 `pullUpLoadingText` 重命名为 `loadingText` @anlyyao ([#945](https://github.com/Tencent/tdesign-mobile-react/pull/945))
  - 修复语言包污染全局默认配置的问题 @anlyyao ([#962](https://github.com/Tencent/tdesign-mobile-react/pull/962))
- `Form`: 
  - 修复 `FormItem` 中 `arrow` 图标颜色错误 @yzh1002 ([common#2738](https://github.com/Tencent/tdesign-common/pull/2738))
- `Icon`: 修复 usb 原始图标的图层 ID 错误,在深色模式下渲染错误 @uyarn ([icons#298](https://github.com/Tencent/tdesign-icons/pull/298)) ([#953](https://github.com/Tencent/tdesign-mobile-react/pull/953))
- `Input`: 修复 `input` 密码框样式错误 @anlyyao ([#988](https://github.com/Tencent/tdesign-mobile-react/pull/988))
- `NoticeBar`: 修复横向滚动动画异常与滚动速度不符 @anlyyao ([#962](https://github.com/Tencent/tdesign-mobile-react/pull/962))
- `Rate`: 修复深色模式下的提示文本颜色 @liweijie0812 ([common#2706](https://github.com/Tencent/tdesign-common/pull/2706))
- `Search`: 修复搜索框清空图标垂直居中问题 @anlyyao ([common#2663](https://github.com/Tencent/tdesign-common/pull/2663))
- `Slider`: 修复滑块与进度条错位与胶囊模式滑轨圆角样式错误 @liweijie0812 ([#991](https://github.com/Tencent/tdesign-mobile-react/pull/991))
- `Tag`: 修复圆角样式值错误 @anlyyao ([common#2716](https://github.com/Tencent/tdesign-common/pull/2716))
- `Textarea`: 修复 `placeholder` 占位内容字号错误 @anlyyao ([common#2717](https://github.com/Tencent/tdesign-common/pull/2717))
- `Toast`: `clear/destroy` 统一走 `unmount -> remove`，修复锁滚动残留导致的页面“禁用” @anlyyao ([#964](https://github.com/Tencent/tdesign-mobile-react/pull/964))
- `Upload`: 
  - 修复 `useMockProgress=false` 时真实上传进度不回调的问题 @anlyyao ([common#2690](https://github.com/Tencent/tdesign-common/pull/2690))
  - 修复开启 `preview` 后点击图片无法触发预览及 `onPreview` 事件 @anlyyao ([#961](https://github.com/Tencent/tdesign-mobile-react/pull/961))

### 📈 Performance

- `Dialog`: plugin 模式移除写死的 zIndex 默认值（原 2500），层级统一由样式表提供（@z-index-popup = 1500） @anlyyao ([#980](https://github.com/Tencent/tdesign-mobile-react/pull/980))
- `DropdownMenu`: 规范层级默认值，由 11600 调整为 1600，由样式表提供（@z-index-dropdown-menu = 1600） @anlyyao ([#980](https://github.com/Tencent/tdesign-mobile-react/pull/980))
- `Message`: 规范层级默认值，由 15000 调整为 5000，由样式表提供（@z-index-message = 5000） @anlyyao ([#980](https://github.com/Tencent/tdesign-mobile-react/pull/980))
- `Overlay`: zIndex 移除内联默认值 1000，层级改由样式表 @z-index-overlay（1000）提供 @anlyyao ([#980](https://github.com/Tencent/tdesign-mobile-react/pull/980))
- `Popup`: 规范层级默认值，由 11500 调整为 1500，由样式表提供（@z-index-popup = 1500） @anlyyao ([#980](https://github.com/Tencent/tdesign-mobile-react/pull/980))
- `Toast`: 规范层级默认值，由 12001 调整为 2000，由样式表提供（@z-index-toast = 2000） @anlyyao ([#980](https://github.com/Tencent/tdesign-mobile-react/pull/980))
- `Style`: 修正灰阶色值。深色主题：`--td-gray-color-11` 由 `#383838` 修正为 `#393939`；浅色主题：`--td-gray-color-3` 由 `#e7e7e7` 修正为 `#e8e8e8`，`--td-gray-color-4` 由 `#dcdcdc` 修正为 `#ddd`，`--td-gray-color-5` 由 `#c5c5c5` 修正为 `#c6c6c6`，`--td-gray-color-11` 由 `#383838` 修正为 `#393939` @anlyyao ([common#2715](https://github.com/Tencent/tdesign-common/pull/2715))

### Other

- `lib`: 修复 `lib` 产物中 `style/css.js` 引用不存在的 `index.css` 导致的样式断链问题 @anlyyao ([#967](https://github.com/Tencent/tdesign-mobile-react/pull/967))
- `dist`: 修复 UMD 产物中 `react-dom/client` 被错误映射为 `global.client` 的问题 @anlyyao ([#967](https://github.com/Tencent/tdesign-mobile-react/pull/967))

## 🌈 0.23.3 `2026-08-03`

### 🐞 Bug Fixes

- `Table`: 修复 LocalReceiver 模块解析失败构建错误；修复 `es` 产物中嵌套目录下 `style/css.js` 引用路径错误 @liweijie0812 ([#942](https://github.com/Tencent/tdesign-mobile-react/pull/942))

## 🌈 0.23.2 `2026-07-30`

### 🚀 Features

- `Table`: 新增 `loadingMode`、`pagination` 等多个属性，支持分页、筛选、排序及可拖拽功能 @slatejack ([#927](https://github.com/Tencent/tdesign-mobile-react/pull/927))
- `Upload`: 新增 `draggable` 属性，支持拖拽排序 @anlyyao ([#939](https://github.com/Tencent/tdesign-mobile-react/pull/939))

### 🐞 Bug Fixes

- `ImageViewer`: 移除底部的点状导航器 @anlyyao ([#938](https://github.com/Tencent/tdesign-mobile-react/pull/938))

## 🌈 0.23.1 `2026-07-03`

### 🚀 Features

- `DateTimePicker`: 为 `format` 属性新增 `time-stamp` 可选项，支持时间戳格式 @anlyyao ([#931](https://github.com/Tencent/tdesign-mobile-react/pull/931))

### 🐞 Bug Fixes

- `Button`: ⚠️ `--td-button-xx-font-size` 系列变更为 `--td-button-xx-font`；⚠️ 移除 `--td-button-font-weight`，请改用 `--td-button-xx-font`，或者[组件库级别的 css var ](https://github.com/Tencent/tdesign-common/blob/develop/style/mobile/theme/_font.less)调整字号、行高、字重、字体等文本样式 @liweijie0812 ([common#2540](https://github.com/Tencent/tdesign-common/pull/2540))([#928](https://github.com/Tencent/tdesign-mobile-react/pull/928))
- `PullDownRefresh`: 修复 `onRefresh` 事件重复触发的问题 @anlyyao ([#930](https://github.com/Tencent/tdesign-mobile-react/pull/930))
- `DateTimePicker`: 修复全局配置 `title` 属性无效 @anlyyao ([#931](https://github.com/Tencent/tdesign-mobile-react/pull/931))
- `ConfigProvider`: 为 `Upload` 语言包补充 `upload.progress.reloadText` 字段 @dev-soragoto ([common#2576](https://github.com/Tencent/tdesign-common/pull/2576))([#933](https://github.com/Tencent/tdesign-mobile-react/pull/933))
- `Navbar`: 修复 env(safe-area-inset-top) 非 0 时占位栏高度错误导致底部留白 @anlyyao ([#934](https://github.com/Tencent/tdesign-mobile-react/pull/934))

## 🌈 0.23.0 `2026-05-20`

### 🚀 Features

- `Typography`: 新增 `Typography` 排版组件 @anlyyao ([#905](https://github.com/Tencent/tdesign-mobile-react/pull/905))
- `Segmented`: 调整 `change` 事件参数形式 @anlyyao ([#908](https://github.com/Tencent/tdesign-mobile-react/pull/908))
- `Upload`: @anlyyao ([#919](https://github.com/Tencent/tdesign-mobile-react/pull/919))
  - 新增 `theme` 属性，支持宫格和列表布局风格
  - 选择图片后立即生成预览缩略图，`autoUpload=true` 时上传过程中也能回显图片

### 🐞 Bug Fixes

- `Button`:
  - 修复 `danger` 主题下文本禁用色错误 @anlyyao ([#916](https://github.com/Tencent/tdesign-mobile-react/pull/916))
  - 修复图标默认大小错误 @anlyyao ([common#2521](https://github.com/Tencent/tdesign-common/pull/2521))([#917](https://github.com/Tencent/tdesign-mobile-react/pull/917))
- `Message`: 修复 `Message.info/success/warning/error` 直接传入字符串时文案不显示的问题 @anlyyao ([#918](https://github.com/Tencent/tdesign-mobile-react/pull/918))
- `Upload`: 修复文件禁用态样式错误 @anlyyao ([#922](https://github.com/Tencent/tdesign-mobile-react/pull/922))

## 🌈 0.22.0 `2026-04-24`

### 🚀 Features

- `Segmented`: 新增 `Segmented` 分段控制器组件 @anlyyao ([#902](https://github.com/Tencent/tdesign-mobile-react/pull/902))
- `Form`: @anlyyao ([#903](https://github.com/Tencent/tdesign-mobile-react/pull/903))
  - 新增 `readonly`、`form`、`initialData` 属性
  - `name` 属性新增 `Number`、 `Array` 类型
  - 为 `FormInstanceFunctions` 组件实例新增 `setFields`、`setFieldsValue`、`getFieldValue`、`getFieldsValue` 等方法
  - 新增 `initialData` 和 `shouldUpdate` 属性

### 🐞 Bug Fixes

- `Upload`: 使用稳定唯一的 `key`，确保删除子项后不会错位 @anlyyao ([#901](https://github.com/Tencent/tdesign-mobile-react/pull/901))
- `Form`: @anlyyao ([#903](https://github.com/Tencent/tdesign-mobile-react/pull/903))
  - 修复 `onValuesChange` 事件无效
  - 修复 `preventSubmitDefault`、`showErrorMessage` 等属性默认值无效
  - 修复 `FormInstanceFunctions` 的 `validate()` 校验结果错误

## 🌈 0.21.4 `2026-04-09`

### 🚀 Features

- `Indexes`: 新增 `showFullIndex` 属性，表示是否显示完整的索引内容，默认显示首字符 @anlyyao ([#898](https://github.com/Tencent/tdesign-mobile-react/pull/898))

### 🐞 Bug Fixes

- `Popup`: 修复多组件同时使用 `preventScrollThrough` 导致页面无法滚动的问题 @anlyyao ([#894](https://github.com/Tencent/tdesign-mobile-react/pull/894))
- `Indexes`: 修复气泡与右侧索引列表间距错误 @anlyyao ([#898](https://github.com/Tencent/tdesign-mobile-react/pull/898))
- `Textarea`: 修复 `maxlength` 或 `maxcharacter` 无值时组件无法输入的问题 @anlyyao ([#897](https://github.com/Tencent/tdesign-mobile-react/pull/897))

## 🌈 0.21.3 `2026-03-26`

### 🚀 Features

- `Tabs`:
  - `TabPanel` 新增 `icon` 属性 @anlyyao ([#885](https://github.com/Tencent/tdesign-mobile-react/pull/885))
  - 新增 `split` 属性 @anlyyao ([#892](https://github.com/Tencent/tdesign-mobile-react/pull/892))

### 🐞 Bug Fixes

- `Silder`: 更正渲染 `min`和 `max` 的 `<text/>` 标签为 `<div/>` @RylanBot ([#889](https://github.com/Tencent/tdesign-mobile-react/pull/889))
- `Table`: 新增 `rowspanAndColspan` 和 `render` 属性 @anlyyao ([#888](https://github.com/Tencent/tdesign-mobile-react/pull/888))

## 🌈 0.21.2 `2026-02-10`

### 🚀 Features

- `Icon`: 新增 217 个与人工智能、文档、徽标和文件相关的图标 @uyarn([#872](https://github.com/Tencent/tdesign-mobile-react/pull/872))
- `Cascader`: @anlyyao ([#865](https://github.com/Tencent/tdesign-mobile-react/pull/865))
  - 新增 `overlayProps`、`header` 和 `middleContent` 属性
  - pick 事件新增 `label` 和 `level` 参数，其中 `level` 表示选中项所在层级深度，`index` 为选项中的索引
- `Search`:
  - 新增 `cursorColor` 属性 @anlyyao ([#857](https://github.com/Tencent/tdesign-mobile-react/pull/857))
  - 新增 `resultList` 和 `clearTrigger` 属性 @anlyyao ([#876](https://github.com/Tencent/tdesign-mobile-react/pull/876))

### 🐞 Bug Fixes

- `Popup`: 修复在 `Firefox` 浏览器中的闪烁问题 @anlyyao ([#874](https://github.com/Tencent/tdesign-mobile-react/pull/874))
- `Search`: 修复通过 `CSS Vars` 修改图标大小无效 @liweijie0812 ([#878](https://github.com/Tencent/tdesign-mobile-react/pull/878))
- `Upload`: 修复 `capture` 属性无效，并补充 `boolean` 类型 @anlyyao ([#875](https://github.com/Tencent/tdesign-mobile-react/pull/875))

## 🌈 0.21.1 `2025-12-25`

### 🚀 Features

- `ActionSheet`: `item` 属性补充 `description`、`suffixIcon` 字段 @anlyyao ([#845](https://github.com/Tencent/tdesign-mobile-react/pull/845))
- `Badge`: @anlyyao ([#855](https://github.com/Tencent/tdesign-mobile-react/pull/855))
  - `shape` 属性新增 `ribbon-right/ribbon-left/triangle-right/triangle-left` 可选项，其中 `ribbon` 与 `ribbon-right` 等效
  - 优化 `ribbon` 实现，改用 `background: linear-gradient()`，移除伪元素相关样式
- `Navbar`: 新增 `placeholder` 属性，默认值为 `false`；新增 `zIndex` 属性，默认值为 `1` @anlyyao ([#852](https://github.com/Tencent/tdesign-mobile-react/pull/852))
- `TabBar`: 新增 `placeholder` 属性，默认值为 `false`；新增 `zIndex` 属性，默认值为 `1` @anlyyao ([#852](https://github.com/Tencent/tdesign-mobile-react/pull/852))

### 🐞 Bug Fixes

- `ActionSheet`: @anlyyao ([#845](https://github.com/Tencent/tdesign-mobile-react/pull/845))
  - 修复左对齐场景下，子项 `border` 左间距错误
  - 修复 `grid` 主题，`description` 描述文本行高错误
  - 修复 `grid` 主题 + 无 `description` 描述文本场景下，顶部间距错误
  - `list` 主题最后一项不应设置底边框
- `Picker`: 修复 `swipeDuration` 属性无效的问题 @Ryan-CW-Code ([#848](https://github.com/Tencent/tdesign-mobile-react/pull/848))

### 🚧 Others

- `feat`: 新增支持`.dark` 类名，丰富切换深色模式的方式 @liweijie0812 ([#851](https://github.com/Tencent/tdesign-mobile-react/pull/851))

## 🌈 0.21.0 `2025-11-27`

### 🚀 Features

- `Calendar`: 新增 `allowSameDay` 属性，允许 type='range' 场景的起止时间相同 @liweijie0812 ([#829](https://github.com/Tencent/tdesign-mobile-react/pull/829))
- `Upload`:
  - 新增 `addBtn` 属性 @anlyyao ([#830](https://github.com/Tencent/tdesign-mobile-react/pull/830))
  - 启用 `capture` 属性时跳过文件名重复检测；在 `capture = ''` + 拍照上传场景中，`allowUploadDuplicateFile` 应取 `true` @anlyyao ([#833](https://github.com/Tencent/tdesign-mobile-react/pull/833))
- `DropdownItem`: 新增 `icon` 属性，支持自定义图标 @anlyyao ([#831](https://github.com/Tencent/tdesign-mobile-react/pull/831))

### 🐞 Bug Fixes

- `Calendar`: 修复 `value =[]` 结合 `switch-mode = 'year-month'` 使用时当前月份计算错误 @anlyyao ([#832](https://github.com/Tencent/tdesign-mobile-react/pull/832))
- `ColorPicker`: 修复组件深色模式背景、边框、文本色错误 @anlyyao ([#834](https://github.com/Tencent/tdesign-mobile-react/pull/834))
- `BackTop`: 修复文本字重错误 @anlyyao ([common#2339](https://github.com/Tencent/tdesign-common/pull/2339))
- `Search`: 修复在小屏幕不遵循 `flex:1` 的问题 @LittleTurtle2333 ([common#2268](https://github.com/Tencent/tdesign-common/pull/2268))
- `Slider`: 修复深色模式下滑轨背景色、滑块禁用态背景色错误 @anlyyao ([common#2331](https://github.com/Tencent/tdesign-common/pull/2331))
- `Popover`: 修复箭头间距错误 @anlyyao ([#840](https://github.com/Tencent/tdesign-mobile-react/pull/840))
- `GridItem`: 修复 `column` 为 `0` 时，标题行高错误 @anlyyao ([#840](https://github.com/Tencent/tdesign-mobile-react/pull/840))

## 🌈 0.20.1 `2025-11-12`

### 🚀 Features

- `Form`: 表单验证 `pattern` 支持 string 类型 @liweijie0812 ([#821](https://github.com/Tencent/tdesign-mobile-react/pull/821))

### 🐞 Bug Fixes

- `Form`: 修复错误消息 `max` 和 `min` 英文翻译错误 @liweijie0812([#816](https://github.com/Tencent/tdesign-mobile-react/pull/816))
- `SwipeCell`: 修复初始化状态判断错误 @RSS1102 ([#810](https://github.com/Tencent/tdesign-mobile-react/pull/810))
- `TabBar`:
  - 解决`TabBar`组件在使用`subTabBar`时点击报错问题 @mikasayw ([#819](https://github.com/Tencent/tdesign-mobile-react/pull/819))
  - 解决`TabBar`和`TabBarItem`组件的 `className`、`style` 属性失效问题 @mikasayw ([#819](https://github.com/Tencent/tdesign-mobile-react/pull/819))

## 🌈 0.20.0 `2025-10-11`

### 🚀 Features

- `Icon`:
  - `tdesign-icons-react` 发布 `0.6.1` 版本，新增`align-bottom`、`no-result`、`no-result-filled`、 `tree-list`、`wifi-no`、 `wifi-no-filled`、`logo-stackblitz-filled`、`logo-stackblitz`、`logo-wecom-filled` 图标；移除 `video-camera-3`、`video-camera-3-filled`、`list` 图标，此前有依赖以上移除图标升级请注意 ⚠️ @uyarn ([#785](https://github.com/Tencent/tdesign-mobile-react/pull/785))
  - 按需加载方式使用的图标资源支持可变粗细功能，通过`strokeWidth`属性进行配置 @uyarn ([#785](https://github.com/Tencent/tdesign-mobile-react/pull/785))
  - 按需加载方式使用的图标资源支持多色填充功能，通过 `strokeColor` 和 `fillColor` 属性进行配置 @uyarn ([#785](https://github.com/Tencent/tdesign-mobile-react/pull/785)
- `Watermark`: 新增 `Watermark` 水印组件 @Wesley-0808 ([#804](https://github.com/Tencent/tdesign-mobile-react/pull/804))
- `ImageViwer`: 修复点击遮罩层 `close` 事件未触发，并补充触发源 `image`，表示点击图片关闭图片预览 @anlyyao ([#811](https://github.com/Tencent/tdesign-mobile-react/pull/811))
- `Drawer`: 新增 `overlayProps` 属性 @anlyyao ([#809](https://github.com/Tencent/tdesign-mobile-react/pull/809))

### 🐞 Bug Fixes

- `Message`: 修复 `marquee`、`closeBtn` 与 `link` 属性表现异常，更新 `click` 事件参数 @vancece ([#779](https://github.com/Tencent/tdesign-mobile-react/pull/779))
- `Steps`: 修复 `current` 属性的 `string` 类型和 `number` 类型渲染效果不一致 @ImaginingMaker ([#761](https://github.com/Tencent/tdesign-mobile-react/pull/761))
- `Rate`: 修复点选时弹框未显示 @lockiechen ([#754](https://github.com/Tencent/tdesign-mobile-react/pull/754))
- `CountDown`: 修复毫秒不展示以及自动执行的问题 @SinzoL ([#781](https://github.com/Tencent/tdesign-mobile-react/pull/781))
- `Collapse`:
  - 修复 `defaultExpandAll` 属性导致的打开异常问题 @ImaginingMaker ([#775](https://github.com/Tencent/tdesign-mobile-react/pull/775))
  - 修复 `defaultExpandAll` 与 `expandMutex` 同时传递时的冲突问题 @ImaginingMaker ([#775](https://github.com/Tencent/tdesign-mobile-react/pull/775))

## 🌈 0.19.1 `2025-08-28`

### 🚀 Features

- `Tabs`: 支持自动滚动到激活项 @novlan1 ([#693](https://github.com/Tencent/tdesign-mobile-react/pull/693))
- `Textarea`:
  - 新增 `cursorColor` 属性 @anlyyao ([#712](https://github.com/Tencent/tdesign-mobile-react/pull/712))
  - `maxlength` 属性支持 `string` 类型 @anlyyao ([#712](https://github.com/Tencent/tdesign-mobile-react/pull/712))
- `Form`: 新增 `requiredMarkPosition`，可定义必填符号的位置 @anlyyao ([#721](https://github.com/Tencent/tdesign-mobile-react/pull/721))
- `Calendar`:
  - 支持定位到选中日期位置 @anlyyao ([#755](https://github.com/Tencent/tdesign-mobile-react/pull/755))
  - `CalendarTrigger` 增加 `auto-close` 选项，在 `confirmBtn= null` 时触发 @anlyyao ([#755](https://github.com/Tencent/tdesign-mobile-react/pull/755))
- `Massage`: 图标改用按需引入 @lich-yoo ([#753](https://github.com/Tencent/tdesign-mobile-react/pull/753))
- `TabBarItem`: 图标改用按需引入 @lich-yoo ([#753](https://github.com/Tencent/tdesign-mobile-react/pull/753))
- `Tag`: 图标改用按需引入 @lich-yoo ([#753](https://github.com/Tencent/tdesign-mobile-react/pull/753))
- `CheckTag`: 图标改用按需引入 @lich-yoo ([#753](https://github.com/Tencent/tdesign-mobile-react/pull/753))

### 🐞 Bug Fixes

- `ImageViewer`: 修复背景色错误，导航背景色固定为 `#000`，遮罩背景色使用 `@mask-active` @anlyyao ([#723](https://github.com/Tencent/tdesign-mobile-react/pull/723))
- `Textarea`:
  - 修复 `--td-textarea-placeholder-color` 无效 @anlyyao ([#739](https://github.com/Tencent/tdesign-mobile-react/pull/739))
  - 修复边框颜色错误 @anlyyao ([#750](https://github.com/Tencent/tdesign-mobile-react/pull/750))
- `Message`: 修复 `info`，`error` 和 `warning` 主题图标错误 @lich-yoo ([#753](https://github.com/Tencent/tdesign-mobile-react/pull/753))
- `Calendar`:
  - 修复 `confirmBtn=null` 时，单选和区间选择器未正确收起弹窗 @anlyyao ([#755](https://github.com/Tencent/tdesign-mobile-react/pull/755))
  - 修复 `change` 和 `confirm` 事件参数类型错误 @anlyyao ([#755](https://github.com/Tencent/tdesign-mobile-react/pull/755))

## 🌈 0.19.0 `2025-08-01`

### 🚀 Features

- `QRCode`: 新增 `QRCode` 二维码组件 @anlyyao ([#696](https://github.com/Tencent/tdesign-mobile-react/pull/696))
- `Popup`: 新增 `duration` 属性 @novlan1 ([#691](https://github.com/Tencent/tdesign-mobile-react/pull/691))

### 🐞 Bug Fixes

- `BackTop`: 修复默认返回按钮图标无效 @anlyyao ([#682](https://github.com/Tencent/tdesign-mobile-react/pull/682))
- `Cascader`: 修复深色模式 `0.5px` 边框颜色错误 @anlyyao ([#682](https://github.com/Tencent/tdesign-mobile-react/pull/682))
- `Overlay`: 修复深色模式背景色错误 @anlyyao ([#682](https://github.com/Tencent/tdesign-mobile-react/pull/682))
- `Upload`: 修复移除按钮颜色错误 @anlyyao ([#682](https://github.com/Tencent/tdesign-mobile-react/pull/682))
- `Switch`: 修复 `loading` 颜色、`dot` 滑块禁用态/深色模式背景色错误 @anlyyao ([#687](https://github.com/Tencent/tdesign-mobile-react/pull/687))
- `NoticeBar`: 修复 `warning` 和 `error` 主题默认图标错误 @novlan1 ([#688](https://github.com/Tencent/tdesign-mobile-react/pull/688))
- `Guide`: 修复 `popover` 下展示位置错误问题 @novlan1 ([#689](https://github.com/Tencent/tdesign-mobile-react/pull/689))
- `PullDownRefresh`: 修复 `change` 事件不生效问题 @novlan1 ([#690](https://github.com/Tencent/tdesign-mobile-react/pull/690))
- `Sticky`: 修复滚动元素找不到问题 @novlan1 ([#692](https://github.com/Tencent/tdesign-mobile-react/pull/692))

### 🚧 Others

- `site`: 修复主题生成器在移动端预览窗口无效的问题 @anlyyao ([#682](https://github.com/Tencent/tdesign-mobile-react/pull/682))

## 🌈 0.18.0 `2025-07-15`

### 🚀 Features

- `Form`: 新增 `Form` 组件 @slatejack ([#666](https://github.com/Tencent/tdesign-mobile-react/pull/666))
- `Upload`: 组件重构， 存在 DOM 调整。新增 `allowUploadDuplicateFile`、`beforeUpload`、`autoUpload` 等多个属性，支持图片预览 @slatejack ([#549](https://github.com/Tencent/tdesign-mobile-react/pull/549))

### 🚧 Others

- fix(build): 修复 `0.17.0` 版 `npm` 包中组件文件路径错误 @anlyyao ([#679](https://github.com/Tencent/tdesign-mobile-react/pull/679))

## 🌈 0.17.0 `2025-07-11`

### 🚀 Features

- `Picker`: 新增 `Picker` 选择器组件 @ZWkang @novlan1 ([#655](https://github.com/Tencent/tdesign-mobile-react/pull/655))
- `DateTimePicker`: 新增 `DateTimePicker` 时间选择器组件 @novlan1 ([#672](https://github.com/Tencent/tdesign-mobile-react/pull/672))
- `Footer`: 新增 `Footer` 页脚组件 @anlyyao ([#676](https://github.com/Tencent/tdesign-mobile-react/pull/676))
- `Table`: 新增 `rowAttributes` 和 `rowClassName` 属性，暴露组件实例的 `refreshTable` 方法 @anlyyao ([#669](https://github.com/Tencent/tdesign-mobile-react/pull/669))

### 🐞 Bug Fixes

- `BackTop`: 补充默认 `target` 值 @novlan1 ([#671](https://github.com/Tencent/tdesign-mobile-react/pull/671))

## 🌈 0.16.0 `2025-07-04`

### 🚀 Features

- `Fab`: 支持使用默认插槽自定义悬浮按钮内容，此时 `buttonProps`、`icon` 和 `text` 属性将失效 @novlan1 ([#645](https://github.com/Tencent/tdesign-mobile-react/pull/645))
- `Calendar`: 新增 `switchMode` 和 `readonly` 属性 @novlan1 ([#663](https://github.com/Tencent/tdesign-mobile-react/pull/663))
- `Table`: 支持 `fixedRows` 属性，列配置项支持 `fixed` 属性 @novlan1 ([#662](https://github.com/Tencent/tdesign-mobile-react/pull/662))

### 🚧 Others

- `React`: 全面升级相关依赖，直接支持 `React 19` @HaixingOoO ([#606](https://github.com/Tencent/tdesign-mobile-react/pull/606))

## 🌈 0.15.0 `2025-05-29`

### 🚀 Features

- `ImageViewer`: 新增图片预览组件 @novlan1 ([#607](https://github.com/Tencent/tdesign-mobile-react/pull/607))

### 🐞 Bug Fixes

- `TabPanel`: 修复组件内容未展示的问题 @betavs ([#638](https://github.com/Tencent/tdesign-mobile-react/pull/638))

## 🌈 0.14.0 `2025-05-16`

### 🚀 Features

- `Cascader`: 新增 `Cascader` 组件 @ming680 @anlyyao ([#475](https://github.com/Tencent/tdesign-mobile-react/pull/475))
- `DropdownMenu`: 新增 `DropdownMenu` 组件 @ming680 @anlyyao ([#503](https://github.com/Tencent/tdesign-mobile-react/pull/503))
- `Overlay`: 新增遮罩动画系列回调函数，包括 `onOpen`、`onOpened`、`onClose` 和 `onClosed` 事件 @anlyyao ([#629](https://github.com/Tencent/tdesign-mobile-react/pull/629))
- `PullDownRefresh`: 新增 `disabled` 属性 @anlyyao ([#631](https://github.com/Tencent/tdesign-mobile-react/pull/631))

### 🐞 Bug Fixes

- `Button`: 修复按钮点击态样式缺失 @anlyyao ([#627](https://github.com/Tencent/tdesign-mobile-react/pull/627))
- `Steps`: 修复内置图标无效的问题 @anlyyao ([#635](https://github.com/Tencent/tdesign-mobile-react/pull/635))

## 🌈 0.13.2 `2025-04-25`

### 🚀 Features

- `Icon`: 新增 `logo-miniprogram`、`logo-cnb`、`seal`、`quote` 图标 @taowensheng1997 @uyarn ([#621](https://github.com/Tencent/tdesign-mobile-react/pull/621))

### 🐞 Bug Fixes

- `Icon`: 优化多个文件相关图标的绘制效果，修复 `gesture-right-slip` 的绘制问题@uyarn([#621](https://github.com/Tencent/tdesign-mobile-react/pull/621))
- `Slider`: `marks` 属性不支持 `()=>TNode` 渲染的问题 @anlyyao ([#622](https://github.com/Tencent/tdesign-mobile-react/pull/622))

## 🌈 0.13.1 `2025-04-21`

### 🐞 Bug Fixes

- `SideBar`: 修复组件未导出问题 @anlyyao ([#616](https://github.com/Tencent/tdesign-mobile-react/pull/616))

## 🌈 0.13.0 `2025-04-18`

### 🚀 Features

- `Icon`: 图标库版本更新到 `0.4.4`([#590](https://github.com/Tencent/tdesign-mobile-react/pull/590))
- `Toast`: 新增 `warning` 主题 @betavs ([#589](https://github.com/Tencent/tdesign-mobile-react/pull/589))
- `Fab`: 新增 `draggable`，`yBounds `，`onDragEnd` 和 `onDragStart ` 等属性，支持组件拖拽 @novlan1 ([#594](https://github.com/Tencent/tdesign-mobile-react/pull/594))
- `List`: 新增 `List` 组件 @feaswcy ([#463](https://github.com/Tencent/tdesign-mobile-react/pull/463))
- `ActionSheet`: 新增 `ActionSheet` 组件 @TianlunXiong ([#471](https://github.com/Tencent/tdesign-mobile-react/pull/471))
- `Progress`: 新增 `size` 属性，仅在环形进度条有效 @anlyyao ([#609](https://github.com/Tencent/tdesign-mobile-react/pull/609))
- `CollapsePanel`: 优化面板折叠动画 @anlyyao ([#611](https://github.com/Tencent/tdesign-mobile-react/pull/611))

### 🐞 Bug Fixes

- `Textarea`: 修复传入参数类型错误 @RSS1102 ([#591](https://github.com/Tencent/tdesign-mobile-react/pull/591))；修复 `iOS` 真机上输入内容重复的问题，并补充 `onCompositionstart` 和 `onCompositionend` 属性 @anlyyao ([#601](https://github.com/Tencent/tdesign-mobile-react/pull/601))

### 🚧 Others

- `site`: 站点接入主题生成器 @RylanBot ([#604](https://github.com/Tencent/tdesign-mobile-react/pull/604))

## 🌈 0.12.0 `2025-03-12`

### 🚨 Breaking Changes

- `Dialog`: 新增 `closeBtn`、`width`、`overlayProps` 属性和 `middle`、`top` 插槽，存在 `DOM` 调整 @epoll-j ([#548](https://github.com/Tencent/tdesign-mobile-react/pull/548))
- `Swiper`: 组件重构，存在 `DOM` 调整。新增 `nextMargin`、`previousMargin` 和 `click` 事件。并对 `navigation` 属性进行功能增强，新增 `paginationPosition`、`showControls` 属性，移除 `showSlideBtn` 属性 @xifanTT ([#557](https://github.com/Tencent/tdesign-mobile-react/pull/557))

### 🐞 Bug Fixes

- `ColorPicker`: 修复组件 `es` 产物缺样式文件入口 @anlyyao ([#577](https://github.com/Tencent/tdesign-mobile-react/pull/577))

### 🚧 Others

- `site`: 站点接入 `stackblitz` 和中英文切换能力 @anlyyao ([#579](https://github.com/Tencent/tdesign-mobile-react/pull/579))

## 🌈 0.11.0 `2025-03-07`

### 🚨 Breaking Changes

- `Steps`: 组件重构，移除 `options` 和 `separator` 属性，新增 `currentStatus`、`sequence` 属性，存在 DOM 调整 @Lyan-u ([#532](https://github.com/Tencent/tdesign-mobile-react/pull/532))
- `StepItem`: 组件重构，新增 ` titleRight`、`extra` 属性，存在 DOM 调整 @Lyan-u ([#532](https://github.com/Tencent/tdesign-mobile-react/pull/532))

### 🚀 Features

- `ColorPicker`: 新增 `ColorPicker` 组件 @slatejack ([#569](https://github.com/Tencent/tdesign-mobile-react/pull/569))
- `CheckboxGroup`: 新增 `borderless`、`readonly` 和 `keys` 属性 @liweijie0812 ([#572](https://github.com/Tencent/tdesign-mobile-react/pull/572))
- `Calendar`: 新增 `Calendar` 日历组件 @epoll-j ([#528](https://github.com/Tencent/tdesign-mobile-react/pull/528))
- `TreeSelect`: 新增 `TreeSelect` 组件 @epoll-j ([#523](https://github.com/Tencent/tdesign-mobile-react/pull/523))
- `ConfigProvider`: 新增 `ConfigProvider` 组件 @anlyyao ([#574](https://github.com/Tencent/tdesign-mobile-react/pull/574))

### 🐞 Bug Fixes

- `Cell`: 修复部分样式错误，并更新 `align` 属性描述 @liweijie0812 ([#568](https://github.com/Tencent/tdesign-mobile-react/pull/568))

## 🌈 0.10.0 `2025-01-20`

### 🚀 Features

- `Radio`: 组件重构，新增 `block`、`borderless`、`placement` 与 `readonly` 等属性 @byq1213 ([#468](https://github.com/Tencent/tdesign-mobile-react/pull/468))
- `RadioGroup`: 组件重构，新增 `allowUncheck`、`borderless`、`keys` 、`placement` 与 `readonly` 等属性 @byq1213 ([#468](https://github.com/Tencent/tdesign-mobile-react/pull/468)) @liweijie0812 ([#555](https://github.com/Tencent/tdesign-mobile-react/pull/555))
- `Rate`: 组件重构，废弃 `variant` 属性， 新增 `placement` 与 `icon` 属性 @ming680 ([#493](https://github.com/Tencent/tdesign-mobile-react/pull/493))
- `Input`: 新增 `enterkeyhint` API 用于控制回车键样式，此 API 仅在部分浏览器支持，HTML5 原生属性。新增 `spellcheck` API 是否开启拼写检查，HTML5 原生属性 @liweijie0812 ([#553](https://github.com/Tencent/tdesign-mobile-react/pull/553))
- `Icon`: 新增`logo-alipay`、`logo-behance-filled`等图标，修改`logo-wecom`图标，移除不合理的`logo-wecom-filled`图标，并优化部分图标的绘制路径 @uyarn @tdesign-bot ([#559](https://github.com/Tencent/tdesign-mobile-react/pull/559))
- `Swiper`: 新增 `touchable` 属性 @anlyyao ([#565](https://github.com/Tencent/tdesign-mobile-react/pull/565))

### 🐞 Bug Fixes

- `Swiper`: 修复缺少 `ref` 传递导致的控制台报错问题 @cc-weng ([#534](https://github.com/Tencent/tdesign-mobile-react/pull/534))

## 🌈 0.9.0 `2024-11-11`

### 🚨 Breaking Changes

- `Textarea`: 组件重构，新增 `allowInputOverMax`，`bordered` 与 `readonly` 等属性 @anlyyao ([#526](https://github.com/Tencent/tdesign-mobile-react/pull/526))
- `Avatar`: 组件重构，新增 `imageProps` 属性 @slatejack ([#541](https://github.com/Tencent/tdesign-mobile-react/pull/541))

### 🚀 Features

- `Guide`: 新增 `Guide` 组件 @novlan1 ([#535](https://github.com/Tencent/tdesign-mobile-react/pull/535))

### 🐞 Bug Fixes

- `CountDown`: 修复毫秒级计算器计算错误 @novlan1 ([#542](https://github.com/Tencent/tdesign-mobile-react/pull/542))

## 🌈 0.8.0 `2024-10-17`

### 🚨 Breaking Changes

- `Switch`: 组件重构，移除 `colors` 属性，`change` 事件参数有调整 @anlyyao ([#527](https://github.com/Tencent/tdesign-mobile-react/pull/527))
- `PullDownRefresh`: 组件重构，`maxBarHeight` 与 `loadingBarHeight` 属性扩展支持 `string` 类型，并新增 `onRefresh`、`onScrolltolower` 和 `onTimeout` 等属性 @novlan1 ([#479](https://github.com/Tencent/tdesign-mobile-react/pull/479))
- `Message`: 组件重构，新增 `align`、`link`、`marquee`、`offset`、`onCloseBtnClick`、`onDurationEnd` 以及 `onLinkClick` 等属性，并移除 `onClose`、`onClosed`、`onOpen`、`onOpened` 与 `onVisibleChange` 等属性 @novlan1 ([#477](https://github.com/Tencent/tdesign-mobile-react/pull/477))

### 🚀 Features

- `Input`: 支持 `format` 属性 @anlyyao ([#533](https://github.com/Tencent/tdesign-mobile-react/pull/533))

### 🐞 Bug Fixes

- `Stepper`: 修复无法直接输入的问题 @anlyyao ([#537](https://github.com/Tencent/tdesign-mobile-react/pull/537))

## 🌈 0.7.0 `2024-09-20`

### 🚨 Breaking Changes

- `Checkbox`: 组件重构，新增 `readonly` 属性 @epoll-j ([#504](https://github.com/Tencent/tdesign-mobile-react/pull/504))
- `Drawer`: 组件重构，新增 `attach`、`title` 和 `footer` 等属性，并支持函数式调用 @novlan1 ([#488](https://github.com/Tencent/tdesign-mobile-react/pull/488))
- `SwipeCell`: 组件重构，移除 `expanded` 属性，新增 `opened` 属性 @novlan1 ([#492](https://github.com/Tencent/tdesign-mobile-react/pull/492))
- `Indexes`: 组件重构，移除 `list`, `height` 属性，`select` 事件参数有变更，新增`indexList`, `sticky` 与 `stickyOffset` 等属性，新增 `change` 事件，新增`IndexesAnchor`子组件； @Lyan-u ([#513](https://github.com/Tencent/tdesign-mobile-react/pull/513))
- `Stepper`: 组件重构，新增 `integer` 和 `size` 属性，新增 `focus` 事件 @taninsist ([#525](https://github.com/Tencent/tdesign-mobile-react/pull/525))
- `Slider`: 组件重构，新增 `theme` 属性，`dragend` 事件参数有调整 @slatejack ([#522](https://github.com/Tencent/tdesign-mobile-react/pull/522))
- `Tabs`: 组件重构，新增`bottomLineMode `、`spaceEvenly `属性，新增`onClick`、`onScroll `事件 @epoll-j ([#515](https://github.com/Tencent/tdesign-mobile-react/pull/515))
- `Toast`: 组件重构，新增 `style`、`className`、`showOverlay` 和 `overlayProps` 等属性，新增 `close` 事件 @novlan1 ([#494](https://github.com/Tencent/tdesign-mobile-react/pull/494))

### 🚀 Features

- `Empty`: 新增 `Empty` 组件 @epoll-j ([#505](https://github.com/Tencent/tdesign-mobile-react/pull/505))
- `Popover`: 新增 `Popover` 组件 @epoll-j ([#510](https://github.com/Tencent/tdesign-mobile-react/pull/510))

## 🌈 0.6.1 `2024-09-04`

### 🚀 Features

- `Icon`: 更新图标库版本到 `0.3.5` ，`lock-on` 图标存在更新 @liweijie0812 ([#507](https://github.com/Tencent/tdesign-mobile-react/pull/507))

## 🌈 0.6.0 `2024-08-30`

### 🚀 Features

- `Table`: 新增 `Table` 组件 @TianlunXiong ([#472](https://github.com/Tencent/tdesign-mobile-react/pull/472))
- `SideBar`: 新增 `SideBar` 组件 @tobytovi ([#491](https://github.com/Tencent/tdesign-mobile-react/pull/491))
- `layout`: 新增 layout 组件 @jiasy1616 ([#452](https://github.com/Tencent/tdesign-mobile-react/pull/452))
- `NoticeBar`: 新增 `direction` 属性， `extra` 属性名称变更为 `operation`，废弃 `change` 事件 @slatejack ([#501](https://github.com/Tencent/tdesign-mobile-react/pull/501))
- `TabBar`: 新增 `children`、`split` 和 `shape` 等属性 @tobytovi ([#482](https://github.com/Tencent/tdesign-mobile-react/pull/482))
- `TabBarItem`: 新增 `children` 属性 @tobytovi ([#482](https://github.com/Tencent/tdesign-mobile-react/pull/482))
- `Collapse`: 新增 `children` 和 `theme` 属性 @tobytovi ([#500](https://github.com/Tencent/tdesign-mobile-react/pull/500))
- `CollapsePanel`: 新增 `placement` 和 `headerLeftIcon` 属性 @tobytovi ([#500](https://github.com/Tencent/tdesign-mobile-react/pull/500))

### 🐞 Bug Fixes

- `Badge`: 修复 `content` 为 `ReactNode` 类型时组件渲染异常 @anlyyao ([#499](https://github.com/Tencent/tdesign-mobile-react/pull/499))

## 🌈 0.5.0 `2024-08-23`

### 🚨 Breaking Changes

- `Input`: 组件重构，新增 `allowInputOverMax`、`autocomplete`、`borderless`、`readonly`、`status` 与`tips` 属性，新增 `onValidate` 事件 @slatejack ([#467](https://github.com/Tencent/tdesign-mobile-react/pull/467))
- `Popup`: 组件重构，新增 `attach`、`closeBtn`、`closeOnOverlayClick`、`destroyOnClose`、`preventScrollThrough` 等属性，新增 `onClose`、`onClosed`、`onOpen`、`onOpened` 等事件 @hkaikai ([#449](https://github.com/Tencent/tdesign-mobile-react/pull/449))
- `Search`: 组件重构，新增 `clearable` 和 `readonly` 属性，新增 `onActionClick` 事件 @slatejack ([#476](https://github.com/Tencent/tdesign-mobile-react/pull/476))
- `Badge`: 组件重构，`size` 默认值变更为 `medium`，`size` 与 `shape` 属性 可选项存在变更 @anlyyao ([#487](https://github.com/Tencent/tdesign-mobile-react/pull/487))
- `CountDown`: 新增 `children`，作用同 `content` 属性，`size` 默认值变更为 `medium` @anlyyao ([#481](https://github.com/Tencent/tdesign-mobile-react/pull/481))
- `Navbar`: 组件重构，移除 `homeIcon`、`leftIcon`、`rightIcon` 等属性、移除 `onHomeClick` 事件，新增 `capsule`、`left`、`leftArrow`、`right` 等属性、新增 `onRightClick` @04756 ([#450](https://github.com/Tencent/tdesign-mobile-react/pull/450))
- `GridItem`: `badgeProps` 属性更名为 `badge` @Lyan-u ([#448](https://github.com/Tencent/tdesign-mobile-react/pull/448))

### 🚀 Features

- `Link`: 新增 `Link` 组件 @Magicalboys ([#443](https://github.com/Tencent/tdesign-mobile-react/pull/443))
- `Image`: 新增 `referrerpolicy` 和 `fallback` 属性 @anlyyao ([#470](https://github.com/Tencent/tdesign-mobile-react/pull/470))
- `Button`: 新增 `loadingProps` 和 `suffix` 属性，并修复虚框按钮样式错误 @tobytovi ([#469](https://github.com/Tencent/tdesign-mobile-react/pull/469))
- `Grid`: 新增 theme 属性 @Lyan-u ([#448](https://github.com/Tencent/tdesign-mobile-react/pull/448))

## 🌈 0.4.0 `2024-08-16`

### 🚨 Breaking Changes

- `BackTop`: 组件重构，新增 `container` ，`visibilityHeight` 属性，新增 `onToTop` 事件 @ssmyaojiayouya ([#430](https://github.com/Tencent/tdesign-mobile-react/pull/430))
- `Progress`: 组件重构，新增 `theme`, `className`, `style` 属性 @anlyyao ([#387](https://github.com/Tencent/tdesign-mobile-react/pull/387))
- `Divider`: 组件重构，废弃`lineColor` 属性 @liweijie0812 ([#403](https://github.com/Tencent/tdesign-mobile-react/pull/403))
- `Cell`: 组件重构，`Dom` 有调整 @dexterBo ([#432](https://github.com/Tencent/tdesign-mobile-react/pull/432))
- `Loading`: 组件重构，移除 `progress` 属性 ，新增 `attach`、`content `和 `fullscreen` 属性，支持 `loading` 或 `LoadingPlugin` 插件函数 @anlyyao ([#458](https://github.com/Tencent/tdesign-mobile-react/pull/458))
- `Skeleton`: 组件重构，支持 `delay` 属性 @anlyyao ([#455](https://github.com/Tencent/tdesign-mobile-react/pull/455))

### 🚀 Features

- `Result`: 新增 `Result` 组件 @slatejack ([#431](https://github.com/Tencent/tdesign-mobile-react/pull/431))
- `Overlay`: 新增 `Overlay` 组件 @anlyyao ([#451](https://github.com/Tencent/tdesign-mobile-react/pull/451))
- `Tabs`: 支持 `className` 和 `style` 组件参数 @Charles-1999 ([#357](https://github.com/Tencent/tdesign-mobile-react/pull/357))
- `CellGroup`: 新增 `theme` 属性 @dexterBo ([#432](https://github.com/Tencent/tdesign-mobile-react/pull/432))
- `Tag`: 新增 `children` 属性 @taninsist ([#445](https://github.com/Tencent/tdesign-mobile-react/pull/445))
- `CheckTag`: 新增 `variant` 属性 @taninsist ([#445](https://github.com/Tencent/tdesign-mobile-react/pull/445))
- `Icon`: 更新 `Icon` 版本至 `0.3.4` 并补齐示例 @anlyyao ([#456](https://github.com/Tencent/tdesign-mobile-react/pull/456))

### 🐞 Bug Fixes

- `Toast`: 修复 `preventScrollThrough` 属性类型声明与文档描述不一致 @betavs ([#372](https://github.com/Tencent/tdesign-mobile-react/pull/372))

### 🚧 Others

- `Sticky`: 更新组件示例与 `API` 文档 @byq1213 ([#435](https://github.com/Tencent/tdesign-mobile-react/pull/435))

## 🌈 0.3.1 `2022-11-28`

### 🚀 Features

- `Skeleton`: `rowCols` 支持传入 `borderRadius` @yuanmeda ([#318](https://github.com/Tencent/tdesign-mobile-react/pull/318))

### 🐞 Bug Fixes

- `Checkbox`: 修复点击 content 无反应的问题 @LeeJim ([#328](https://github.com/Tencent/tdesign-mobile-react/pull/328))

### 🚧 Others

- `Badge`: 更新示例代码 @teal-front ([#299](https://github.com/Tencent/tdesign-mobile-react/pull/299))
- `Textarea`: 更新示例代码 @palmcivet ([#301](https://github.com/Tencent/tdesign-mobile-react/pull/301))
- `Search`: 更新示例代码 @palmcivet ([#309](https://github.com/Tencent/tdesign-mobile-react/pull/309))
- `Slider`: 更新示例代码 @yuanmeda ([#313](https://github.com/Tencent/tdesign-mobile-react/pull/313))
- `Steps`: 更新示例代码 @yuanmeda ([#314](https://github.com/Tencent/tdesign-mobile-react/pull/314))
- `Upload`: 更新示例代码 @yuanmeda ([#315](https://github.com/Tencent/tdesign-mobile-react/pull/315))
- `Progress`: 更新示例代码 @xxxlj ([#319](https://github.com/Tencent/tdesign-mobile-react/pull/319))
- `BackTop`: 更新示例代码 @yuanmeda ([#317](https://github.com/Tencent/tdesign-mobile-react/pull/317))
- `PullDownRefresh`: 更新示例代码 @yuanmeda ([#318](https://github.com/Tencent/tdesign-mobile-react/pull/318))
- `Button`: 更新示例代码 @TingShine ([#321](https://github.com/Tencent/tdesign-mobile-react/pull/321))
- `Image`: 更新示例代码 @TingShine ([#322](https://github.com/Tencent/tdesign-mobile-react/pull/322))
- `Stepper`: 更新示例代码 @TingShine ([#308](https://github.com/Tencent/tdesign-mobile-react/pull/308))
- `Loading`: 更新示例代码 #476 @lockiechen ([#323](https://github.com/Tencent/tdesign-mobile-react/pull/323))
- `TabBar`: 更新示例代码 @yuanmeda ([#302](https://github.com/Tencent/tdesign-mobile-react/pull/302))
- `CheckBox`: 更新示例代码 @yuanmeda ([#303](https://github.com/Tencent/tdesign-mobile-react/pull/303))
- `Textarea`: 更新示例代码 @palmcivet ([#301](https://github.com/Tencent/tdesign-mobile-react/pull/301))
- `Fab`: 更新示例代码 @yuanmeda ([#304](https://github.com/Tencent/tdesign-mobile-react/pull/304))
- `Input`: 更新示例代码 @palmcivet ([#300](https://github.com/Tencent/tdesign-mobile-react/pull/300))
- `Divider`: 更新示例代码 @yuanmeda ([#305](https://github.com/Tencent/tdesign-mobile-react/pull/305))
- `Sticky`: 更新示例代码 @yuanmeda ([#306](https://github.com/Tencent/tdesign-mobile-react/pull/306))
- `Rate`: 更新示例代码 @yuanmeda ([#307](https://github.com/Tencent/tdesign-mobile-react/pull/307))

## 🌈 0.3.0 `2022-10-25`

### 🚀 Features

- `NoticeBar`: 新增公告栏组件 @ZWkang ([#292](https://github.com/Tencent/tdesign-mobile-react/pull/292))
- `Grid`: 透传所有非定义的 props 至根元素 @ZWkang ([#293](https://github.com/Tencent/tdesign-mobile-react/pull/293))

### 🚧 Others

- `Avatar`: 更新示例代码 @anlyyao ([#296](https://github.com/Tencent/tdesign-mobile-react/pull/296))

## 🌈 0.2.0 `2022-07-25`

### 🚀 Features

- `Drawer`: 新增抽屉组件 @APlanckFish ([#271](https://github.com/Tencent/tdesign-mobile-react/pull/271))

### 🚧 Others

- `site`: 官网更新组件分类 @LeeJim ([#279](https://github.com/Tencent/tdesign-mobile-react/pull/279))

## 🌈 0.1.2 `2022-07-18`

### 🐞 Bug Fixes

- `Sticky`: 修复 fixed 状态下丢失宽度的问题 @LeeJim ([#277](https://github.com/Tencent/tdesign-mobile-react/pull/277))

### 🚧 Others

- `chore`: 优化更新日志文档样式 @HQ-Lin ([#276](https://github.com/Tencent/tdesign-mobile-react/pull/276))

## 🌈 0.1.1 `2022-07-12`

### 🚀 Features

- `Tag`: 视觉升级以及新增支持左图标 @anlyyao ([#270](https://github.com/Tencent/tdesign-mobile-react/pull/270))
- `Progress`: 新增 Progress 组件 @yilaierwang ([#273](https://github.com/Tencent/tdesign-mobile-react/pull/273))
- `Fab` 新增 Fab 组件 @anlyyao ([#266](https://github.com/Tencent/tdesign-mobile-react/pull/266))

### 🐞 Bug Fixes

- `Search`: 修复无法使用的问题 @Perisiguiendo ([#269](https://github.com/Tencent/tdesign-mobile-react/pull/269))
- `Button`: 补充支持 style 属性 @anlyyao ([#266](https://github.com/Tencent/tdesign-mobile-react/pull/266))

## 🌈 0.1.0 `2022-06-29`

- 首发版本
