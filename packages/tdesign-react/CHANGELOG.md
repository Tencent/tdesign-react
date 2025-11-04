---
title: 更新日志
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.15.8 `2025-11-04` 
### 🚀 Features
- `Popup`: 添加 `onOverlayClick` 事件以支持内容面板点击触发 @RSS1102 ([#3927](https://github.com/Tencent/tdesign-react/pull/3927))
- `CheckboxGroup`: 支持 `readonly` API @RylanBot ([#3885](https://github.com/Tencent/tdesign-react/pull/3885))
- `Form`: @RylanBot ([#3885](https://github.com/Tencent/tdesign-react/pull/3885))
  - 支持 `readonly` API
  - 支持 `FormRule.pattern` 的类型为 `string`
### 🐞 Bug Fixes
- `Select`: 修复 `1.15.7`  版本中全选功能在分组模式下功能异常的问题 @uyarn ([#3941](https://github.com/Tencent/tdesign-react/pull/3941))
- `Form`: 修复嵌套 `FormList` 无法使用 `setFields` 更新表单的问题 @RylanBot ([#3930](https://github.com/Tencent/tdesign-react/pull/3930))
- `CheckboxGroup`: 修复被设为 `disabled` 的选项会被 `checkAll` 篡改状态的问题 @RylanBot ([#3885](https://github.com/Tencent/tdesign-react/pull/3885))
- `SubMenu`: 修复自定义 `popupProps` 的 `visible` 和 `onVisibleChange` 不生效的问题 @RylanBot ([#3912](https://github.com/Tencent/tdesign-react/pull/3912))
- `DatePicker`: 修复同时开启 `enableTimePicker` 与 `needConfirm={false}` 时，选择日期后未选时间就关闭弹窗的问题 @RylanBot ([#3860](https://github.com/Tencent/tdesign-react/pull/3860))
- `DateRangePicker`: 修复同时开启 `enableTimePicker` 与 `needConfirm={false}` 时，仍需手动确认的问题 @achideal ([#3860](https://github.com/Tencent/tdesign-react/pull/3860))
- `Progress`: 修复开启 `theme='plump'` 时，自定义 `label` 被隐藏的问题 @RylanBot ([#3931](https://github.com/Tencent/tdesign-react/pull/3931))
- `RadioGroup`: @RylanBot 
  - 修复子元素动态更新时，高亮异常的问题 ([#3922](https://github.com/Tencent/tdesign-react/pull/3922))
  - 修复设置 `value` 为空时，高亮块没有消失的问题 ([#3944](https://github.com/Tencent/tdesign-react/pull/3944))
- `Tree`: @RylanBot
  - 修复没开启 `checkable` 且 `checkStrictly={false}` 时，禁用父节点后，子节点依旧能被高亮的问题 ([#3828](https://github.com/Tencent/tdesign-react/pull/3828))
  - 修复存在 `disabled` 节点时，点击半选状态的父节点无法取消全中的问题 ([#3828](https://github.com/Tencent/tdesign-react/pull/3828))
  - 修复点击父节点进行全选时，`disabled` 节点的选中状态被篡改的问题 ([#3828](https://github.com/Tencent/tdesign-react/pull/3828))
  - 修复点击 `operation` 区域时将该行节点 `active` 的异常 ([#3889](https://github.com/Tencent/tdesign-react/pull/3889))

### 🚧 Others
- `Form`: 优化 `getValidateMessage` 方法底层的逻辑 @RylanBot ([#3930](https://github.com/Tencent/tdesign-react/pull/3930))

## 🌈 1.15.7 `2025-10-24` 
### 🚀 Features
- `Divider`: 支持 `size` 控制间距大小 @HaixingOoO ([#3893](https://github.com/Tencent/tdesign-react/pull/3893))
### 🐞 Bug Fixes
- `TreeSelect`: 修复删除不在 `data` 中的选项时产生的报错 @RylanBot ([#3886](https://github.com/Tencent/tdesign-react/pull/3886))
- `EnhancedTable`: 修复拖拽后动态关闭 `dragSort`，行无法正常展开的异常 @RylanBot ([#3896](https://github.com/Tencent/tdesign-react/pull/3896))
- `Menu`: 避免在菜单折叠时隐藏 `span` 包裹的图标 @QuentinHsu([common#2303](https://github.com/Tencent/tdesign-common/pull/2303))
- `Textarea`: 修复内容超长情况下，设置 `autosize` 没有完整自动撑开高度，存在有滚动条的问题 @engvuchen ([#3856](https://github.com/Tencent/tdesign-react/pull/3856))
- `RadioGroup`: 修复键盘操作时读取到 `null` 产生的报错  @RylanBot ([#3906](https://github.com/Tencent/tdesign-react/pull/3906))
- `Loading`: 修复 `delay` 不生效的问题  @RylanBot ([#3859](https://github.com/Tencent/tdesign-react/pull/3859))
- `Form`: 
  - 修复错误消息 `max` 和 `min` 英文翻译错误 @liweijie0812([common#2304](https://github.com/Tencent/tdesign-common/pull/2304))
  - 修复嵌套 `FormList` 无法使用 `add` 正确新增表单的问题 @RylanBot ([#3881](https://github.com/Tencent/tdesign-react/pull/3881))
- `Select`: @RylanBot ([#3879](https://github.com/Tencent/tdesign-react/pull/3879))
  - 修复开启 `multiple` 时，`disabled` 的选项依旧能被删除的问题
  - 修复 `disabled` 且被选中的选项会被 `checkAll` 修改状态的问题
  - 修复存在 `disabled` 项时，`checkAll` 可选框的 `checked` 与 `indeterminate` 状态不合理的问题
- `VirtualScroll`: @RylanBot ([#3878](https://github.com/Tencent/tdesign-react/pull/3878))
  - 修复数据在非虚拟滚动和虚拟滚动的 `threshold` 切换时，无法正确刷新的问题
  - 修复没开启 `scroll={{type:'virtual'}}`，但启动了相关计算的问题

## 🌈 1.15.6 `2025-10-10` 
### 🐞 Bug Fixes
- `VirtualScroll`: 修复引入虚拟滚动的组件在使用子组件配合异步请求场景的组件告警问题 @uyarn ([#3876](https://github.com/Tencent/tdesign-react/pull/3876))

## 🌈 1.15.5 `2025-10-05` 
### 🐞 Bug Fixes
- `Watermark`: 修复 `1.15.2` 版本 SSR 场景下使用的问题 @Wesley-0808([#3873](https://github.com/Tencent/tdesign-react/pull/3873))
- `Descriptions`: 修复无边框模式下的边距问题 @liweijie0812 ([#3873](https://github.com/Tencent/tdesign-react/pull/3873))

## 🌈 1.15.4 `2025-10-01` 
### 🚀 Features
- `ImageViewer`: 支持 `trigger` 传入图片 `index` 参数，trigger  的 `open` 方法参数可能与绑定的元素触发事件存在类型差异情况，若遇到此问题请改成 `()=> open()` 类似匿名函数使用 @betavs ([#3827](https://github.com/Tencent/tdesign-react/pull/3827))
### 🐞 Bug Fixes
- `Swiper`: 修复在移动端中点击导航条后自动播放失效的问题 @uyarn ([#3862](https://github.com/Tencent/tdesign-react/pull/3862))
- `List`: 移除 `1.15.2` 版本引入的冗余代码造成开启虚拟滚动时初始化卡顿的问题 @RylanBot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))
- `Select`: 移除 `1.15.2` 版本引入的冗余代码造成开启虚拟滚动时初始化卡顿的问题 @RylanBot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))

## 🌈 1.15.3 `2025-09-29` 
### 🐞 Bug Fixes
- `Select`: 修复 `OptionGroup` 的 `style` 与 `className` 没有生效的问题 @uyarn ([#3855](https://github.com/Tencent/tdesign-react/pull/3855))

## 🌈 1.15.2 `2025-09-29` 
### 🚀 Features
- `Watermark`: 新增 `layout` API，支持生成不同布局的水印，`watermarkText` 支持配置字体 @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Drawer`:  优化拖拽调整大小的过程中，组件的内容会被选中的问题 @uyarn ([#3844](https://github.com/Tencent/tdesign-react/pull/3844))
### 🐞 Bug Fixes
- `Watermark`: 修复多行图文水印图片配置了灰度时，整个画布内容也会灰度的问题 @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Slider`: 修复设置 `step` 后的精度问题造成的返回值和相关展示异常 @uyarn ([#3821](https://github.com/Tencent/tdesign-react/pull/3821))
- `TagInput`: 修复 `onBlur` 中的 `inputValue` 始终为空的问题 @RylanBot ([#3841](https://github.com/Tencent/tdesign-react/pull/3841))
- `Cascader`: 修复 `single` 模式下，选中唯一的子节点时，父节点意外被高亮的问题 @RylanBot ([#3840](https://github.com/Tencent/tdesign-react/pull/3840))
- `DateRangePickerPanel`: 修复 `preset` 涉及跨年份的日期时，点击面板后无法同步的问题 @RylanBot ([#3818](https://github.com/Tencent/tdesign-react/pull/3818))
- `EnhancedTable`: 修复节点拖拽后，再点击展开时，位置被重置的问题 @RylanBot ([#3780](https://github.com/Tencent/tdesign-react/pull/3780))
- `Table`: @RylanBot 
  - 修复开启 `multipleSort` 但没有声明 `sort` 或 `defaultSort` 时，`onSortChange` 始终返回 `undefined` 的问题 ([#3824](https://github.com/Tencent/tdesign-react/pull/3824))
  - 修复同时开启虚拟滚动与设置 `firstFullRow` / `lastFullRow` 等情况时，最后一行内容被遮挡的问题 ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - 修复 `fixedRows` / `firstFullRow` / `lastFullRow` 无法在虚拟滚动下组合使用的问题 ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - 修复虚拟滚动初始化时滚动条长度异常的问题 ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - 修复固定表头与固定列无法对齐的问题 ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - 修复 `pagination` 为非受控时，必须声明 `defaultCurrent` 才能正确分页的问题 ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
  - 修复 `pagination` 为受控且不变更时，点击分页仍触发数据更新的问题 ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
  - 修复 `data` 改变时，可编辑单元格的内容没有同步的问题 ([#3826](https://github.com/Tencent/tdesign-react/pull/3826))
- `SelectInput`: @RylanBot ([#3838](https://github.com/Tencent/tdesign-react/pull/3838))
  - 修复自定义 `popupVisible={false}` 时，`onBlur` 不生效的问题
  - 修复开启 `multiple` 时，`onBlur` 缺少 `tagInputValue` 参数的问题
- `Select`: 
  - 修复使用 `keys` 配置 `content` 作为 `label` 或 `value` 无法生效的问题 @RylanBot @uyarn ([#3829](https://github.com/Tencent/tdesign-react/pull/3829))
  - 修复动态切换到虚拟滚动时，出现白屏和滚动条被意外重置的问题 @RylanBot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))
  - 修复开启虚拟滚动且动态更新数据，展示数据不同步的问题 @huangchen1031 ([#3839](https://github.com/Tencent/tdesign-react/pull/3839))
- `List`: 
  - 修复开启虚拟滚动后，`ListItem` 的部分 API 无法生效的问题 @FlowerBlackG ([#3835](https://github.com/Tencent/tdesign-react/pull/3835))
  - 修复动态切换到虚拟滚动时，滚动条被意外重置的问题 @RylanBot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))

## 🌈 1.15.1 `2025-09-12` 
### 🐞 Bug Fixes
- `ImageViewer`: 修复 `imageScale` 配置效果异常的问题 @uyarn ([#3814](https://github.com/Tencent/tdesign-react/pull/3814))

## 🌈 1.15.0 `2025-09-11` 
### 🚀 Features
- `Icon`:  @uyarn ([#3802](https://github.com/Tencent/tdesign-react/pull/3802))
  - `tdesign-icons-react` 发布 `0.6.0` 版本，新增 `align-bottom`、`no-result`、`no-result-filled`、 `tree-list`、`wifi-no`、 `wifi-no-filled`、`logo-stackblitz-filled`、`logo-stackblitz`、`logo-wecom-filled` 图标，移除 `video-camera-3`、`video-camera-3-filled`、`list` 图标，此前有依赖以下图标升级请注意 ⚠️ 
  - 按需加载方式使用的图标资源支持可变粗细功能，通过 `strokeWidth` 属性进行配置
  - 按需加载方式使用的图标资源支持多色填充功能，通过 `strokeColor` 和 `fillColor` 属性进行配置
- `DatePicker`: 支持通过覆盖 `popupProps`，使点击 `preset` 时不关闭弹窗 @RylanBot ([#3798](https://github.com/Tencent/tdesign-react/pull/3798))
### 🐞 Bug Fixes
- `Tree`: @RylanBot ([#3756](https://github.com/Tencent/tdesign-react/pull/3756))
  - 修正节点属性 `date-target` 单词拼写为 `data-target`，之前有使用该属性的业务请注意此变更 ⚠️
  - 修复拖拽后展开收起图标展示异常的问题
- `MessagePlugin`: 修复 `content` 为 `''` / `undefined` / `null` 时产生的报错  @RylanBot ([#3778](https://github.com/Tencent/tdesign-react/pull/3778))
- `Table`: 
  - 修复未开启 `<React.StrictMode>` 时，`Loading` 挂载导致的页面闪烁问题 @RylanBot ([#3775](https://github.com/Tencent/tdesign-react/pull/3775))
  - 修复 `size='small'` 的 `firstFullRow` 尺寸比 `size='medium'` 大的异常 ([#common2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Upload`: 修复拖拽模式下 `status` 更新错误 @RSS1102 ([#3801](https://github.com/Tencent/tdesign-react/pull/3801))
- `Input`: 修复在开启 `readonly` 或者禁用 `allowInput` 情况下没有触发 `onFocus` 和 `onBlur` 的问题 @RylanBot ([#3800](https://github.com/Tencent/tdesign-react/pull/3800))
- `Cascader`: 
  - 修复启用 `multiple` 与 `valueType='full'` 时，`valueDisplay` 渲染异常的问题 @RSS1102 ([#3809](https://github.com/Tencent/tdesign-react/pull/3809))
  - 修复 `1.11.0` 版本引入的新特性，导致无法选中底部选项的问题 @RylanBot ([#3772](https://github.com/Tencent/tdesign-react/pull/3772))
- `Select`: 避免下拉框的打开与关闭时，频繁重复触发 `valueDisplay` 的渲染 @RylanBot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `TagInput`: 避免下拉框的打开与关闭时，频繁重复触发 `valueDisplay` 的渲染 @RylanBot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `Dialog`: 修复在 React 19 环境下，由于使用 `ref` 引发的死循环问题 @RylanBot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Drawer`: 修复在 React 19 环境下，由于使用 `ref` 引发的死循环问题 @RylanBot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Popup`: 修复 `delay` 设置为 0 时移出 Trigger 元素的异常问题 @HaixingOoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))
- `Tooltip`: 修复 `delay` API 的类型不完整问题 @HaixingOoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))

### 🚧 Others
- `react-render`: 修复引入 `react-19-adapter` 后仍然显示需要引入相关模块的警告的问题 @HaixingOoO ([#3790](https://github.com/Tencent/tdesign-react/pull/3790))

## 🌈 1.14.5 `2025-08-26` 
### 🐞 Bug Fixes
- `Watermark`:  完善水印组件在 SSR 场景的兼容问题 @uyarn ([#3765](https://github.com/Tencent/tdesign-react/pull/3765))

## 🌈 1.14.3 `2025-08-26` 
### 🐞 Bug Fixes
- `Pagination`: 修复跳转图标没有重置回正确状态的问题 @phalera ([#3758](https://github.com/Tencent/tdesign-react/pull/3758))
- `Watermark`: @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))
  - 修复 `1.14.0` 版本默认文字颜色缺失透明度的问题
  - 修复 `1.14.0` 版本不兼容 SSR 场景的问题

## 🌈 1.14.2 `2025-08-22` 
### 🐞 Bug Fixes
- `Dialog`: 修复 `1.14.0` 版本引入的新特性导致 `draggable` 禁用失败的问题 @RylanBot ([#3753](https://github.com/Tencent/tdesign-react/pull/3753))

## 🌈 1.14.1 `2025-08-22` 
### 🐞 Bug Fixes
- `Steps`: 修复 `1.13.2` 版本引起的 `theme` 不为 `default` 时重复渲染图标的问题 @RSS1102 ([#3748](https://github.com/Tencent/tdesign-react/pull/3748))

## 🌈 1.14.0 `2025-08-21` 
### 🚀 Features
- `Tabs`: 将 `remove` 事件从删除图标移至外层容器, 保证替换图标功能正常使用，有覆盖删除图标样式请注意此变更 ⚠️ @RSS1102 ([#3736](https://github.com/Tencent/tdesign-react/pull/3736))
- `Card`: 新增 `headerClassName`、`headerStyle`、`bodyClassName`、`bodyStyle`、`footerClassName`、`footerStyle`，方便用于定制卡片组件的各部分样式 @lifeiFront ([#3737](https://github.com/Tencent/tdesign-react/pull/3737))
- `Form`: `rules` 支持配置嵌套字段进行校验 @uyarn ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `ImageViewer`: 调整 `imageScale` 的内部属性值变为可选 @willsontaoZzz ([#3710](https://github.com/Tencent/tdesign-react/pull/3710))
- `Select`: 支持 `onCreate` 和 `multiple` 配合使用 @uyarn ([#3717](https://github.com/Tencent/tdesign-react/pull/3717))
- `Table`: 新增切换分页后重置滚动条回到顶部的特性 @RSS1102 ([#3729](https://github.com/Tencent/tdesign-react/pull/3729))
- `Tree`: `onDragLeave` 与 `onDragOver` 增加 `dragNode`、`dropPosition` 参数 @phalera ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Upload`: 支持在非自动上传场景下上传指定文件 @uyarn ([#3742](https://github.com/Tencent/tdesign-react/pull/3742))
- `ColorPicker`: 支持在移动端拖动色板、滑动条等 @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Dialog`: 支持 `draggable` 属性支持在移动端生效 @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `ImageViewer`: 支持 `draggable` 属性在移动端生效 @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Slider`: 支持在移动端拖动 @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Statistic`: 修改 `color` 属性类型为字符串，以支持任何 [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) 支持的颜色值 @RSS1102 ([#3706](https://github.com/Tencent/tdesign-react/pull/3706))

### 🐞 Bug Fixes
- `Tree`: @RylanBot
  - 修复 `draggable` 在 `disabled` 状态下依旧生效的异常，此前有依赖此错误的业务请注意此变动 ⚠️ ([#3740](https://github.com/Tencent/tdesign-react/pull/3740)) 
  - 修复 `checkStrictly` 默认为 false 时，父子节点 `disabled` 状态没有关联的问题 ([#3739](https://github.com/Tencent/tdesign-react/pull/3739))
  - 修复 Drag 相关事件的回调中 `node` 为 null 的异常 ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Form`: @uyarn
    - 修复嵌套表单受外层 `FormList` 影响数据构造的问题 ([#3715](https://github.com/Tencent/tdesign-react/pull/3715))
    - 修复嵌套表单中内层表单受外层表单影响校验结果字段的问题 ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `FormList`: 解决 `1.13.2` 引入的修复，导致手动 `setFields` 设置初始值而非利用 `initialData` 后无法新增数据的问题 @RylanBot ([#3730](https://github.com/Tencent/tdesign-react/pull/3730))
- `Input`: 修复密码输入框点击图标切换内容可见性时，光标位置没能被保留 @RylanBot ([#3726](https://github.com/Tencent/tdesign-react/pull/3726))
- `Table`: @RylanBot ([#3733](https://github.com/Tencent/tdesign-react/pull/3733))
    - 修复开启虚拟滚动时，动态更新数据时导致白屏的问题  
    - 修复开启虚拟滚动时，表头与下方表格的宽度未同步变化
    - 修复开启虚拟滚动时，滚动条意外被重置回第一行的位置
    - 修复 `dragSort='row-handler-col'` 时，列拖拽不生效的问题 ([#3734](https://github.com/Tencent/tdesign-react/pull/3734))
    - 修复 `size='small'` 的 `firstFullRow` 尺寸比 `size='medium'` 大的异常 ([common#2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Watermark`: 修复深色模式下，文字水印内容显示不明显的问题 @HaixingOoO @liweijie0812 ([#3692](https://github.com/Tencent/tdesign-react/pull/3692))
- `DatePicker`: 优化年份选择模式下选择同面板年份后面板内容的展示效果 @uyarn ([#3744](https://github.com/Tencent/tdesign-react/pull/3744))


## 🌈 1.13.2 `2025-08-01` 
### 🐞 Bug Fixes
- `DatePicker`: 
  - 处理多选情况下周和季度模式的标签删除异常的问题 @betavs ([#3664](https://github.com/Tencent/tdesign-react/pull/3664))
  - 修复多选模式下的 `placeholder` 没能正常消失 @RylanBot ([#3666](https://github.com/Tencent/tdesign-react/pull/3666))
- `EnhancedTable`: @RylanBot
  - 解决 `1.13.0` 版本中引入的修复，导致异步场景下 `data` 更新失败的问题 ([#3690](https://github.com/Tencent/tdesign-react/pull/3690)) 
  - 修复使用 `tree` API 时 ，动态初始化 `columns` 时不存在 unique key ([#3669](https://github.com/Tencent/tdesign-react/pull/3669))
  - 修复叶子节点的判断条件过宽，导致 `className` 对应样式未正常渲染 ([#3681](https://github.com/Tencent/tdesign-react/pull/3681))
- `SelectInput`: 修复在 `useOverlayInnerStyle` 中获取滚动条的时设置 `display` 导致的一些 bug @HaixingOoO ([#3677](https://github.com/Tencent/tdesign-react/pull/3677))
- `Textarea`: 修复 `Dialog` 中的 `Textarea` 挂载 `autosize` 不生效 @HaixingOoO ([#3693](https://github.com/Tencent/tdesign-react/pull/3693))
- `ColorPicker`: @RylanBot ([#3667](https://github.com/Tencent/tdesign-react/pull/3667))
  - 减少颜色跨色彩空间的多次转换，降低误差
  - 修复直接长按渐变点后拖动，颜色更新异常的问题
  - 修复清空下方某一输入框的数值时，其他输入框意外被重置
- `Upload`: 确保在 `beforeUpload` 完成之后，再执行上传动作 @RSS1102 ([#3686](https://github.com/Tencent/tdesign-react/pull/3686))
- `Table`: 修复 `resizable` 开启时，列边框线引起的列名内容移动的问题 @QuentinHsu([common#2224](https://github.com/Tencent/tdesign-common/pull/2224))
- `Descriptions`: 修复无边框模式下左右内边距 @liweijie0812 ([common#2219](https://github.com/Tencent/tdesign-common/pull/2219))
- `Steps`: 修复自定义图标和状态图标的优先级问题 @RSS1102 ([#3670](https://github.com/Tencent/tdesign-react/pull/3670))
- `Form`: 修复动态表单删除一个数据后再次新增，会回填旧数据的问题 @RylanBot ([#3684](https://github.com/Tencent/tdesign-react/pull/3684))

## 🌈 1.13.1 `2025-07-11`

### 🐞 Bug Fixes
- `QRCode`: 修复 `canvas` 二维码 Safari 样式兼容问题 @lifeiFront ([common#2207])(https://github.com/Tencent/tdesign-common/pull/2207)

## 🌈 1.13.0 `2025-07-10` 
### 🚀 Features
- `React19`: 新增兼容 React 19 使用的 adapter，在 React 19 中使用请参考使用文档的详细说明 @HaixingOoO @uyarn([#3640](https://github.com/Tencent/tdesign-react/pull/3640))
- `QRCode`: 新增 `QRCode` 二维码组件 @lifeiFront @wonkzhang ([#3612](https://github.com/Tencent/tdesign-react/pull/3612))
- `Alert`: 新增 `closeBtn` API，与其他组件保持一致，`close` 将在未来版本废弃，请尽快调整为 `closeBtn` 使用 ⚠️ @ngyyuusora ([#3625](https://github.com/Tencent/tdesign-react/pull/3625))
- `Form`: 新增在重新打开 Form 时，重置表单内容的特性 @alisdonwang ([#3613](https://github.com/Tencent/tdesign-react/pull/3613))
- `ImageViewer`: 支持在移动端使用时，通过双指进行缩放图片的功能 @RylanBot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
- `locale`: 支持内置多语言的英文版本的单复数场景正常展示 @YunYouJun ([#3639](https://github.com/Tencent/tdesign-react/pull/3639))
### 🐞 Bug Fixes
- `ColorPicker`: 
  - 修复点击渐变点时，色板没有同步更新的问题 @RylanBot ([#3624](https://github.com/Tencent/tdesign-react/pull/3624))
  - 修复面板输入非法字符场景和多重置空场景下没有重置输入框内容的缺陷 @uyarn ([#3653](https://github.com/Tencent/tdesign-react/pull/3653))
- `Dropdown`: 修复部分场景下拉菜单节点获取异常导致的错误问题 @uyarn ([#3657](https://github.com/Tencent/tdesign-react/pull/3657))
- `ImageViewer`: @RylanBot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
  - 修复点击工具栏的图标边缘时无法触发对应的操作
  - 修复由于 `TooltipLite` 引起的 `z-index` 层级关系异常
- `Popup`: 修复 `1.11.2` 引入 popper.js 的 `arrow` 修饰符导致箭头位置偏移 @RylanBot ([#3652](https://github.com/Tencent/tdesign-react/pull/3652))
- `Loading`: 修复在 iPad 微信上图标位置错误的问题 @Nero978([#3655](https://github.com/Tencent/tdesign-react/pull/3655))
- `Menu`: 解决 `expandMutex` 存在嵌套子菜单时，容易失效的问题 @RylanBot ([#3621](https://github.com/Tencent/tdesign-react/pull/3621))
- `Table`: 
  - 修复吸顶功能不随高度变化的问题 @huangchen1031 ([#3620](https://github.com/Tencent/tdesign-react/pull/3620))
  - 修复 `showHeader` 为 `false` 时，`columns` 动态变化报错的问题 @RylanBot ([#3637](https://github.com/Tencent/tdesign-react/pull/3637))
- `EnhancedTable`: 修复 `tree.defaultExpandAll` 无法生效的问题 @RylanBot ([#3638](https://github.com/Tencent/tdesign-react/pull/3638))
- `Textarea`: 修复超出最大高度后换行时抖动的问题 @RSS1102 ([#3631](https://github.com/Tencent/tdesign-react/pull/3631))

## 🌈 1.12.3 `2025-06-13` 
### 🚀 Features
- `Form`: 新增 `requiredMarkPosition` API，可定义必填符号的位置 @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
- `ConfigProvider`: 全局配置 `FormConfig` 新增 `requiredMaskPosition` 配置，用于全局配置必填符号的位置 @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
### 🐞 Bug Fixes
- `Drawer`: 修复 `cancelBtn` 和 `confirmBtn` 的类型缺失 `null` 声明的问题 @RSS1102 ([#3602](https://github.com/Tencent/tdesign-react/pull/3602))
- `ImageViewer`: 修复显示错误图片在小窗口图片查看器的尺寸异常 @RylanBot([#3607](https://github.com/Tencent/tdesign-react/pull/3607))
- `Menu`: `popupProps` 的 `delay` 属性在 `SubMenu` 中无法生效的问题 @RylanBot ([#3599](https://github.com/Tencent/tdesign-react/pull/3599))
- `Menu`: 开启 `expandMutex` 后，如果存在二级 `SubMenu`，菜单无法展开 @RylanBot ([#3601](https://github.com/Tencent/tdesign-react/pull/3601))
- `Select`:  修复 `checkAll` 设为 `disabled` 后依旧会触发全选的问题 @RylanBot ([#3563](https://github.com/Tencent/tdesign-react/pull/3563))
- `Table`: 优化关闭列配置弹窗时，修复选择列数据与所展示列数据不一致的问题 @RSS1102 ([#3608](https://github.com/Tencent/tdesign-react/pull/3608))
- `TabPanel`: 修复通过 `style` 设置 `display` 属性无法正常生效的问题 @uyarn ([#3609](https://github.com/Tencent/tdesign-react/pull/3609))
- `Tabs`:  修复开启懒加载后始终会先渲染第一个`TabPanel`的问题 @HaixingOoO ([#3614](https://github.com/Tencent/tdesign-react/pull/3614))
- `TreeSelect`: 修复 `label` API 无法正常使用的问题 @RylanBot ([#3603](https://github.com/Tencent/tdesign-react/pull/3603))

## 🌈 1.12.2 `2025-05-30` 
### 🚀 Features
- `Cascader`: 新增支持使用 `option` 方法自定义下拉选项内容的能力 @huangchen1031 ([#3565](https://github.com/Tencent/tdesign-react/pull/3565))
- `MenuGroup`: 新增支持 `className` and `style` 的使用 @wang-ky ([#3568](https://github.com/Tencent/tdesign-react/pull/3568))
- `InputNumber`: `decimalPlaces` 新增支持 `enableRound` 参数，用于控制是否启用四舍五入 @RylanBot ([#3564](https://github.com/Tencent/tdesign-react/pull/3564))
- `TagInput`: 优化可拖拽时，鼠标光标显示为移动光标 @liweijie0812 ([#3552](https://github.com/Tencent/tdesign-react/pull/3552))


### 🐞 Bug Fixes
- `Card`: 修复 `content` prop 不生效的问题 @RylanBot ([#3553](https://github.com/Tencent/tdesign-react/pull/3553))
- `Cascader`: 
     - 修复选项存在超长文字在大小尺寸下展示异常的问题 @Shabi-x([#3551](https://github.com/Tencent/tdesign-react/pull/3551))
     - 修复初始化后，异步更新 `options` 时，`displayValue` 无变化的问题 @huangchen1031 ([#3549](https://github.com/Tencent/tdesign-react/pull/3549))
- `DatePicker`: 修复 `onFocus` 事件触发时机问题 @l123wx ([#3578](https://github.com/Tencent/tdesign-react/pull/3578))
- `Drawer`: 优化 `TNode` 重新渲染导致输入光标错误的问题 @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
-  `Form`:
    - 修复在 `onValuesChange` 中通过 `setFields` 设置相同值继续触发 `onValuesChange` 导致 `re-render` 的问题 @HaixingOoO ([#3304](https://github.com/Tencent/tdesign-react/pull/3304))
    - 修复 `FormList` 删除 `field` 后 `reset` 值初始化错误的问题 @l123wx ([#3557](https://github.com/Tencent/tdesign-react/pull/3557))
    - 兼容 `1.11.7` 版本前单独使用 `FormItem` 的场景 @uyarn ([#3588](https://github.com/Tencent/tdesign-react/pull/3588))
- `Guide`: 优化组件在屏幕大小变化时没有重新计算位置的问题 @HaixingOoO ([#3543](https://github.com/Tencent/tdesign-react/pull/3543))
- `List`: 修复空子节点导致获取子节点 `props` 失败的问题 @RSS1102 ([#3570](https://github.com/Tencent/tdesign-react/pull/3570))
- `Popconfirm`: 修复 `confirmBtn` 属性的 children 不生效的问题 @huangchen1031 ([#3556](https://github.com/Tencent/tdesign-react/pull/3556))
- `Slider`: 修复 `Slider` 的 最后一个 label 宽度不足自动换行的问题 @l123wx([#3581](https://github.com/Tencent/tdesign-react/pull/3581))
- `Textarea`: 修复输入中文被中断的问题 @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `TreeSelect`: 修复单点已选中的值时，会删除已选中的值的问题 @HaixingOoO ([#3573](https://github.com/Tencent/tdesign-react/pull/3573))

### 🚧 Others
- `Dialog`: 优化组件的初始化渲染时间 @RylanBot ([#3561](https://github.com/Tencent/tdesign-react/pull/3561))



## 🌈 1.12.1 `2025-05-07` 
### 🐞 Bug Fixes
-  修复 1.12.0 兼容 React 18 以下的问题 @uyarn ([#3545](https://github.com/Tencent/tdesign-react/pull/3545))



## 🌈 1.12.0 `2025-04-28` 
### 🚀 Features
- `React`: 全面升级相关依赖，兼容在 React19 中使用 @HaixingOoO ([#3438](https://github.com/Tencent/tdesign-react/pull/3438))
- `ColorPicker`: @RylanBot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503)) 使用渐变模式的业务请注意此变更 ⚠️
  - 自动根据「触发器 / 最近颜色 / 预设颜色」的色值进行切换单色和渐变模式
  - 只开启渐变模式时，过滤「预设颜色 / 当前颜色」中的非渐变色值
  - 新增 format `HEX8`，移除 `HSB`
  - 新增 `enableMultipleGradient` API，默认开启
- `Drawer`: 新增 `lazy` 属性，用于懒加载场景，`forceRender` 已声明废弃，未来版本将被移除 @RSS1102 ([#3527](https://github.com/Tencent/tdesign-react/pull/3527))
- `Dialog`: 新增 `lazy` 属性，用于懒加载场景，`forceRender` 已声明废弃，未来版本将被移除 @RSS1102 ([#3515](https://github.com/Tencent/tdesign-react/pull/3515))


### 🐞 Bug Fixes
- `ColorPicker`: @RylanBot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503))
  - 修复渐变点无法正常更新颜色和位置的问题
  - 修复开启透明通道时的返回值格式化异常


## 🌈 1.11.8 `2025-04-28` 
### 🚀 Features
- `ConfigProvider`:  支持全局上下文配置作用于 Message 相关插件 @lifeiFront ([#3513](https://github.com/Tencent/tdesign-react/pull/3513))
- `Icon`: 新增 `logo-miniprogram` 小程序、`logo-cnb` 云原生构建、`seal` 印章、`quote`引号等图标 @taowensheng1997 @uyarn ([#3517](https://github.com/Tencent/tdesign-react/pull/3517))
- `Upload`: `image-flow` 模式下支持进度及自定义错误文本 @ngyyuusora ([#3525](https://github.com/Tencent/tdesign-react/pull/3525))
- `Select`: 多选通过面板移除选项新增 `onRemove` 回调 @QuentinHsu ([#3526](https://github.com/Tencent/tdesign-react/pull/3526))
### 🐞 Bug Fixes
- `InputNumber`: 优化数字输入框的边界问题 @Sight-wcg([#3519](https://github.com/Tencent/tdesign-react/pull/3519))
- `Select`:
    - 修复 `1.11.2` 版本后光标异常及子组件方式回调函数中缺失完整 `option` 信息的问题 @HaixingOoO @uyarn ([#3520](https://github.com/Tencent/tdesign-react/pull/3520))  ([#3529](https://github.com/Tencent/tdesign-react/pull/3529))
    - 优化多选移除标签相关事件修正为不同的 `trigger`,  不同触发场景分别调整为 `clear`、`remove-tag`和 `uncheck`，修正全选选项的 `trigger` 错误 @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
    - 修复单选情况下再次点击选中的选项会触发 `change` 事件的问题 @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
    - 修复多选情况下按下 `backspace` 无法触发 `change` 事件的问题 @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))

## 🌈 1.11.7 `2025-04-18` 
### 🚀 Features
- `ConfigProvider`: 新增 `isContextEffectPlugin` API，默认关闭，开启后全局配置会影响到 `Dialog`、`Loading`、`Drawer`、`Notification` 和 `Popup` 组件的函数式调用 @lifeiFront ([#3488](https://github.com/Tencent/tdesign-react/pull/3488)) ([#3504](https://github.com/Tencent/tdesign-react/pull/3504))
- `Tree`: `checkProps`参数支持函数传入，支持不同节点设置不同checkProps @phalera ([#3501](https://github.com/Tencent/tdesign-react/pull/3501))
- `Cascader`：新增 `onClear` 事件回调 @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `DatePicker`: 新增 `onClear` 事件回调 @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `TimePicker`: 新增 `onClear` 事件回调 @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `ColorPicker`: 
    - 新增 `clearable` API @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
    - 新增 `onClear` 事件回调 @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
### 🐞 Bug Fixes
- `DatePicker`: 确保外部组件主动关闭 Popup 的时候，能有对应的 `onVisibleChange` 回调 @RylanBot ([#3510](https://github.com/Tencent/tdesign-react/pull/3510))
- `Drawer`: 新增 `DrawerPlugin`，支持函数式调用，具体使用参考示例 @Wesley-0808 ([#3381](https://github.com/Tencent/tdesign-react/pull/3381))
- `InputNumber`: 修复组件未受 value 属性控制的问题 @RSS1102 ([#3499](https://github.com/Tencent/tdesign-react/pull/3499))
- `ImageViewer`:
     - 修复设置 `step` 存在精度展示异常的问题 @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
     - 修复 `imageScale` 中参数必填的类型错误 @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
- `Slider`: 修复打开了输入框模式下，使用 `theme` 为 `col` 的输入框的场景下没有限制大小的问题 @RSS1102 ([#3500](https://github.com/Tencent/tdesign-react/pull/3500))
- `Tabs`: 优化选项卡 `label` 过长时滑动按钮失效的问题 @wonkzhang ([common#2108](https://github.com/Tencent/tdesign-common/pull/2108))

## 🌈 1.11.6 `2025-04-11` 
### 🚀 Features
- `Breadcrumb`: 新增 `ellipsis`、`maxItems`、`itemsAfterCollapse`、`itemsBeforeCollapse` 相关 API，用于折叠选项的场景，具体使用参考示例 @moecasts ([#3487](https://github.com/Tencent/tdesign-react/pull/3487))

### 🐞 Bug Fixes
- `RadioGroup`: 优化切换展示的高亮效果问题 @RylanBot ([#3446](https://github.com/Tencent/tdesign-react/pull/3446))
- `Tag`: 修复 `style` 优先级低于 `color`，导致无法强制覆盖标签样式的场景 @uyarn ([#3492](https://github.com/Tencent/tdesign-react/pull/3492))
- `ColorPicker`: 修复单色和渐变切换使用的效果异常问题 @RylanBot ([#3493](https://github.com/Tencent/tdesign-react/pull/3493))
- `Table`: 修复可调整列宽表格右侧拖拽调整的异常问题 @uyarn ([#3496](https://github.com/Tencent/tdesign-react/pull/3496))
- `Swiper`: 优化默认容器高度，避免 navigator 位置异常的问题 @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))
### 📝 Documentation
- `Swiper`: 优化组件跳转沙箱演示缺失示例样式的问题 @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))

### 🚧 Others
-  `1.12.0` 版本将全面兼容 React 19 的使用，有 React 19相关使用场景需求，可升级 `1.12.0-alpha.3` 版本进行试用

## 🌈 1.11.4 `2025-04-03` 
### 🐞 Bug Fixes
- `Select`: 修复 `options`为空时会导致报错引发白屏的问题 @2ue ([#3484](https://github.com/Tencent/tdesign-react/pull/3484))
- `Tree`: 修复 icon 为 false 仍然触发点击和展开相关逻辑的问题 @uyarn ([#3485](https://github.com/Tencent/tdesign-react/pull/3485))

## 🌈 1.11.3 `2025-04-01` 
### 🚀 Features
- `ConfigProvider`: `Pagination` 新增 `Jumper` 配置，用于自定义跳转部分样式 @RylanBot ([#3421](https://github.com/Tencent/tdesign-react/pull/3421))
### 🐞 Bug Fixes
- `Textarea`: 修復 `TextArea`在 `Dialog` 的 `autofocus` 的bug 和 `autosize` 不生效 @HaixingOoO ([#3471](https://github.com/Tencent/tdesign-react/pull/3471))
- `lib`: 修复 `1.11.2` 版本中 `lib` 产物冗余样式导致`next.js`中使用异常及版本号缺失的问题 @uyarn ([#3474](https://github.com/Tencent/tdesign-react/pull/3474))
- `Table`: 修复受控方法下 `Pagination` 状态计算错误的问题 @huangchen1031 ([#3473](https://github.com/Tencent/tdesign-react/pull/3473))

## 🌈 1.11.2 `2025-03-28` 
### 🚀 Features
- `ImageViewer`: 新增 `onDownload` API，用于自定义预览图片下载的回调功能 @lifeiFront ([#3408](https://github.com/Tencent/tdesign-react/pull/3408))
- `ConfigProvider`: `Input` 新增 `clearTrigger` 配置，用于全局模式在有值时显示关闭按钮的功能 @RylanBot ([#3412](https://github.com/Tencent/tdesign-react/pull/3412))
- `Descriptions`: 新增 `tableLayout` 属性 @liweijie0812 ([#3434](https://github.com/Tencent/tdesign-react/pull/3434))
- `Message`: 关闭消息实例时，从全局的消息列表中移除该实例，避免潜在的内存泄漏风险 @wonkzhang ([#3413](https://github.com/Tencent/tdesign-react/pull/3413))
- `Select`: 分组选项器新增支持过滤功能 @huangchen1031 ([#3430](https://github.com/Tencent/tdesign-react/pull/3430))
- `Tabs`: 新增 `lazy` API，支持配置懒加载功能 @HaixingOoO ([#3426](https://github.com/Tencent/tdesign-react/pull/3426))

### 🐞 Bug Fixes
- `ConfigProvider`: 修复全局配置二级配置影响非`Context`范围的问题 @uyarn ([#3441](https://github.com/Tencent/tdesign-react/pull/3441))
- `Dialog`: 取消和确认按钮添加类名，方便定制需求 @RSS1102 ([#3417](https://github.com/Tencent/tdesign-react/pull/3417))
- `Drawer`: 修复拖拽改变大小的时候获取宽度可能不正确的问题 @wonkzhang ([#3420](https://github.com/Tencent/tdesign-react/pull/3420))
- `Guide`:  修复 `popupProps` 穿透属性 `overlayClassName` 无效  @RSS1102 ([#3433](https://github.com/Tencent/tdesign-react/pull/3433))
- `Popup`: 解决组件修饰符 `arrow` 属性设置不生效的问题 @wonkzhang ([#3437](https://github.com/Tencent/tdesign-react/pull/3437))
- `Select`: 修复单选框在 `readonly` 模式下有光标和 `clear` 图标的问题 @wonkzhang ([#3436](https://github.com/Tencent/tdesign-react/pull/3436))
- `Table`:
  - 修复开启虚拟滚动时，`fixedRows` 的渲染问题 @huangchen1031 ([#3427](https://github.com/Tencent/tdesign-react/pull/3427))
  - 修复可选中行表格在火狐浏览器中的样式异常问题 @uyarn ([common#2093](https://github.com/Tencent/tdesign-common/pull/2093))
- `Tooltip`: 修复 `React 16` 下，`TooltipLite` 的 `mouse` 计算位置错误的问题 @moecasts ([#3465](https://github.com/Tencent/tdesign-react/pull/3465))
- `Tree`:  修复部分场景下移除节点后组件报错的问题 @2ue ([#3463](https://github.com/Tencent/tdesign-react/pull/3463))
### 📝 Documentation
- `Card`: 修复文档内容的文案错误问题 @betavs ([#3448](https://github.com/Tencent/tdesign-react/pull/3448))


## 🌈 1.11.1 `2025-02-28` 
### 🚀 Features
- `Layout`: 子组件 `Content` 新增  `content` API  @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))
### 🐞 Bug Fixes
- `reactRender`: fix `React19` `reactRender` error @HaixingOoO ([#3380](https://github.com/Tencent/tdesign-react/pull/3380))
- `Table`: 修复虚拟滚动下的footer渲染问题 @huangchen1031 ([#3383](https://github.com/Tencent/tdesign-react/pull/3383))
- `fix`: 修复`1.11.0` cjs 产物的异常 @uyarn ([#3392](https://github.com/Tencent/tdesign-react/pull/3392))
### 📝 Documentation
- `ConfigProvider`: 增加 `globalConfig` API 文档  @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))

## 🌈 1.11.0 `2025-02-20` 
### 🚀 Features
- `Cascader`:  新增支持在打开菜单时，自动滚动到首个已选项所在节点的能力 @uyarn ([#3357](https://github.com/Tencent/tdesign-react/pull/3357))
- `DatePicker`: 调整组件禁用日期 `before` 和 `after` 参数的逻辑，调整为禁用 `before` 定义之前和 `after` 定义之后的日期选择，此前有使用相关 API 请注意此变更 ⚠️ @lifeiFront ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `List`: 新增 `scroll` API，用于大数据量下支持开启虚拟滚动 @HaixingOoO ([#3363](https://github.com/Tencent/tdesign-react/pull/3363))
- `Menu`: 菜单新增折叠收起的动画效果 @hd10180 ([#3342](https://github.com/Tencent/tdesign-react/pull/3342))
- `TagInput`: 新增 `maxRows` API，用于设置最大展示行数 @Shabi-x ([#3293](https://github.com/Tencent/tdesign-react/pull/3293))

### 🐞 Bug Fixes
- `Card`: 修复 React 19 中的告警问题 @HaixingOoO ([#3369](https://github.com/Tencent/tdesign-react/pull/3369))
- `Cascader`: 修复多选动态加载使用异常的问题 @uyarn ([#3376](https://github.com/Tencent/tdesign-react/pull/3376))
- `CheckboxGroup`: 修复 `onChange` 的 `context` 参数缺少 `option` 的问题 @HaixingOoO ([#3349](https://github.com/Tencent/tdesign-react/pull/3349))
- `DatePicker`: 修复日期选择在负数时区的异常问题 @lifeiFront ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `Dropdown`: 修复点击事件回调 `context` 参数返回不符合文档描述的问题 @uyarn ([#3372](https://github.com/Tencent/tdesign-react/pull/3372))
- `RadioGroup`: 修复在 React 19 版本下异常的问题 @HaixingOoO ([#3364](https://github.com/Tencent/tdesign-react/pull/3364))
- `Tabs`: 修复可滑动 `Tabs` 配合 `action` 使用的样式问题 @Wesley-0808([#3343](https://github.com/Tencent/tdesign-react/pull/3343))
- `Table`: 修复配合 `Tabs` 使用，切换 tab 时，Table 的 footer 不显示的问题 @wonkzhang ([#3370](https://github.com/Tencent/tdesign-react/pull/3370))
- `Textarea`: 修复使用 `autofocus` API 且 `value` 有值时，光标没有跟随内容末尾的问题 @HaixingOoO ([#3358](https://github.com/Tencent/tdesign-react/pull/3358))
- `Transfer`: 修复 `TransferItem` 无效的问题 @HaixingOoO ([#3339](https://github.com/Tencent/tdesign-react/pull/3339))


### 🚧 Others
-  调整组件依赖 `lodash` 依赖为`lodash-es` @zhangpaopao0609  ([#3345](https://github.com/Tencent/tdesign-react/pull/3345))

## 🌈 1.10.5 `2025-01-16` 
### 🚀 Features
- `RadioGroup`: 新增 `theme` API，用于决定使用 options 时渲染的子组件样式 @HaixingOoO ([#3303](https://github.com/Tencent/tdesign-react/pull/3303))
- `Upload`: 新增 `imageProps` API，用于在上传图片场景下透传 `Image` 组件的相关属性 @HaixingOoO ([#3317](https://github.com/Tencent/tdesign-react/pull/3317))
- `AutoComplete`: 新增 `empty` API ，用于支持自定义空节点内容 @liweijie0812 ([#3319](https://github.com/Tencent/tdesign-react/pull/3319))
- `Drawer`: `sizeDraggable`新增支持`SizeDragLimit`类型的功能实现 @huangchen1031 ([#3323](https://github.com/Tencent/tdesign-react/pull/3323))
- `Icon`: 新增 `logo-alipay`、`logo-behance-filled`等图标，修改 `logo-wecom` 图标，移除不合理的 `logo-wecom-filled` 图标 @uyarn ([#3326](https://github.com/Tencent/tdesign-react/pull/3326))
### 🐞 Bug Fixes
- `Select`: 修复 `onChange` 回调 `context` 中的全部选项的值没有包含选项本身全部内容的问题 @uyarn ([#3305](https://github.com/Tencent/tdesign-react/pull/3305))
- `DateRangePicker`: 开始结束值同时存在的逻辑判断错误问题 @betavs ([#3301](https://github.com/Tencent/tdesign-react/pull/3301))
- `Notification`: 修复使用 `attach` 属性配置导致渲染节点异常的问题 @centuryPark ([#3306](https://github.com/Tencent/tdesign-react/pull/3306))
- `AutoComplete`: 修复当选项为空时显示效果异常的问题 @betavs ([#3316](https://github.com/Tencent/tdesign-react/pull/3316))
- `Menu`: 修复 `head-menu` 不渲染 `icon` 的问题 @HaixingOoO ([#3320](https://github.com/Tencent/tdesign-react/pull/3320))
- `Statistic`: 修复 `decimalPlaces=0` 时数值动画期间精度错误的问题 @huangchen1031 ([#3327](https://github.com/Tencent/tdesign-react/pull/3327))
- `ImageViewer`: 修复开启 `closeOnOverlay` 时，点击蒙层关闭存在闪烁情况的问题 @huangchen1031


## 🌈 1.10.4 `2024-12-25` 
### 🚀 Features
- `Tree`: 支持 `onScroll` API，用于处理滚动事件回调 @HaixingOoO ([#3295](https://github.com/Tencent/tdesign-react/pull/3295))
- `TooltipLite`: `mouse` 模式下优化为完全跟随鼠标位置，更符合 API 描述 @moecasts ([#3267](https://github.com/Tencent/tdesign-react/pull/3267))
### 🐞 Bug Fixes
- `Select`: 修复全选默认返回值错误的问题 @uyarn ([#3298](https://github.com/Tencent/tdesign-react/pull/3298))
- `Upload`: 优化部分尺寸上传组件图片展示的样式问题 @huangchen1031 ([#3290](https://github.com/Tencent/tdesign-react/pull/3290))
### 📝 Documentation
- `Stackblitz`: 调整`Stackblitz`示例的启动方式，并修复部分示例无法使用`stackblitz`或`codesandbox`运行的问题 @uyarn ([#3297](https://github.com/Tencent/tdesign-react/pull/3297))

## 🌈 1.10.2 `2024-12-19`

### 🚀 Features

- `Alert`: 在 `maxLine >= message` 数组长度的情况下，不再展示 `展开更多/收起` 的按钮 @miownag ([#3281](https://github.com/Tencent/tdesign-react/pull/3281))
- `ConfigProvider`: `attach` 属性支持配置 `drawer` 组件，支持全局配置 `drawer` 的挂载位置 @HaixingOoO ([#3272](https://github.com/Tencent/tdesign-react/pull/3272))
- `DatePicker`: 多选模式支持周选择和年选择的场景 @HaixingOoO @uyarn  ([#3264](https://github.com/Tencent/tdesign-react/pull/3264))
- `Form`: 新增 `supportNumberKey` API，支持在`1.9.3`版本后不支持数字键值的场景使用，若不需要支持数字类型作为表单键值请关闭此 API @uyarn ([#3277](https://github.com/Tencent/tdesign-react/pull/3277))
- `Radio`: 新增 `Radio` 及 `RadioGroup` 的 `reaonly` 属性的支持 @liweijie0812 ([#3280](https://github.com/Tencent/tdesign-react/pull/3280))
- `Tree`: 实例新增 `setIndeterminate` 方法，支持手动设置半选的功能 @uyarn ([#3261](https://github.com/Tencent/tdesign-react/pull/3261))
- `DatePicker`: 支持 `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `TimePicker`: 支持 `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `RangeInput`: 支持 `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))

### 🐞 Bug Fixes
- `DateRangePicker`: 修复在跨年的场景下的展示异常问题 @huangchen1031 ([#3275](https://github.com/Tencent/tdesign-react/pull/3275))
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
- `DatePicker`: 新增 `multiple` API，用于支持日期选择器多选功能，具体使用请参考示例 @HaixingOoO ([#3199](https://github.com/Tencent/tdesign-react/pull/3199))
- `DatePicker`: 新增 `disableTime` API，用于更方便地设置禁用时间部分 @HaixingOoO ([#3226](https://github.com/Tencent/tdesign-react/pull/3226))
- `Dialog`: 新增 `beforeClose` 和 `beforeOpen` API，用于在打开和关闭弹窗时执行更多回调操作 @Wesley-0808  ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
- `Drawer`: 新增 `beforeClose` 和 `beforeOpen` API，用于在打开和关闭抽屉时执行更多回调操作 @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
### 🐞 Bug Fixes

- `ColorPicker`: 修复 `colorMode` 部分文案没有支持国际化的问题 @l123wx ([#3221](https://github.com/Tencent/tdesign-react/pull/3221))
- `Form`: 修复 `setFieldsValue` 和 `setFields` 没有触发 `onValuesChange` 的问题 @uyarn ([#3232](https://github.com/Tencent/tdesign-react/pull/3232))
- `Notification`: 修改 `NotificationPlugin` 的 `offset` 属性默认值，使其更符合常规习惯 @huangchen1031  ([#3231](https://github.com/Tencent/tdesign-react/pull/3231))
- `Select`:
  - 修复 `collapsedItems` 参数 `collapsedSelectedItems` 的错误 @RSS1102 ([#3214](https://github.com/Tencent/tdesign-react/pull/3214))
  - 修复多选下拉框全选功能失效的问题 @huangchen1031 ([#3216](https://github.com/Tencent/tdesign-react/pull/3216))
- `Table`:
  - 修复可过滤表格在处理 `null`类型的异常问题 @2ue ([#3197](https://github.com/Tencent/tdesign-react/pull/3197))
  - 修复单元格为数字 0 且开启省略时渲染异常的问题 @uyarn ([#3233](https://github.com/Tencent/tdesign-react/pull/3233))
- `Tree`: 修复 `scrollTo` 方法滚动的异常行为 @uyarn ([#3235](https://github.com/Tencent/tdesign-react/pull/3235))
### 📝 Documentation
- `Dialog`: 修复代码示例的错误 @RSS1102 ([#3229](https://github.com/Tencent/tdesign-react/pull/3229))
### 🚧 Others
- `TextArea`: 优化 `TextArea` 事件类型 @HaixingOoO ([#3211](https://github.com/Tencent/tdesign-react/pull/3211))

## 🌈 1.10.0 `2024-11-15` 
### 🚀 Features
- `Select`: `collapsedItems` 方法的参数 `collapsedSelectedItems` 扩充为 `options`，使用 `collapsedItems` 请注意此变更 ⚠️ @RSS1102 ([#3185](https://github.com/Tencent/tdesign-react/pull/3185))
- `Icon`: @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
  - 图标库发布 `0.4.0` 版本，新增 907 个新图标
  - 命名优化，`blockchain` 重命名改为 `transform-1`，`gesture-pray-1` 重命名为 `gesture-open`，`gesture-ranslation-1` 重命名为 `wave-bye`， `gesture-up-1` 重命名为 `gesture-typing`，`gesture-up-2` 重命名为 `gesture-right-slip`，`logo-wechat` 重命名为 `logo-wechat-stroke-filled`
  - 移除 `tree-list`、`logo-adobe-photoshop-1` 等错误图标
- `Cascader`: 单选模式下当 `trigger` 为 `hover` 时，选中选项后自动关闭面板 @uyarn ([#3188](https://github.com/Tencent/tdesign-react/pull/3188))
- `Checkbox`: 新增 `title` API, 用于在选项展示禁用原因等场景 @uyarn ([#3207](https://github.com/Tencent/tdesign-react/pull/3207))
- `Menu`: 新增 `tooltipProps` API，作用于一级菜单收起聚焦出现的节点 @uyarn ([#3201](https://github.com/Tencent/tdesign-react/pull/3201))
- `Switch`: 新增 `before-change` API @centuryPark ([#3167](https://github.com/Tencent/tdesign-react/pull/3167))
- `Form`: 新增 `getValidateMessage` 实例方法 @moecasts ([#3180](https://github.com/Tencent/tdesign-react/pull/3180))

### 🐞 Bug Fixes
- `TagInput`: 修复在 `readonly` 模式下仍可以通过Backspace按键删除已选项的缺陷 @RSS1102 ([#3172](https://github.com/Tencent/tdesign-react/pull/3172))
- `Form`: 修复 `1.9.3` 版本，`FormItem` 在 `Form` 外设置了 `name` 属性有异常的问题 @l123wx ([#3183](https://github.com/Tencent/tdesign-react/pull/3183))
- `Select`: 修复 valueType 为 object 时，点击全选按钮后 onChange 回调参数类型错误的问题 @l123wx ([#3193](https://github.com/Tencent/tdesign-react/pull/3193))
- `Table`: 修复动态设置 `expandTreeNode` 没有正常展示子节点的问题 @uyarn ([#3202](https://github.com/Tencent/tdesign-react/pull/3202))
- `Tree`: 修复动态切换 `expandAll` 的功能异常问题 @uyarn ([#3204](https://github.com/Tencent/tdesign-react/pull/3204))
- `Drawer`: 修复无法自定义 `confirmBtn` 和 `closeBtn`内容的问题 @RSS1102 ([#3191](https://github.com/Tencent/tdesign-react/pull/3191))
### 📝 Documentation
- `Icon`: 优化图标检索功能，支持中英文搜索图标 @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Popup`: 新增 `popperOption` 使用示例 @HaixingOoO  ([#3200](https://github.com/Tencent/tdesign-react/pull/3200))


## 🌈 1.9.3 `2024-10-31` 
### 🐞 Bug Fixes
- `Select`: 修复`valueDisplay`下的`onClose`回调问题 @uyarn ([#3154](https://github.com/Tencent/tdesign-react/pull/3154))
- `Typography`: 修复 `Typography` 的`Ellipsis` 功能在中文下的问题 @HaixingOoO ([#3158](https://github.com/Tencent/tdesign-react/pull/3158))
- `Form`: 修复 `FormList` 或 `FormItem` 数据中的 `getFieldsValue` 问题 @HaixingOoO ([#3149](https://github.com/Tencent/tdesign-react/pull/3149))
- `Form`: 修复动态渲染表单无法使用 `setFieldsValue` 预设数据的问题 @l123wx ([#3145](https://github.com/Tencent/tdesign-react/pull/3145))
- `lib`: 修复`1.9.2`升级依赖改动导致`lib`错误携带`style`导致在`next`下不可用的异常 @honkinglin ([#3165](https://github.com/Tencent/tdesign-react/pull/3165))



## 🌈 1.9.2 `2024-10-17` 
### 🚀 Features
- `TimePicker`: 新增 `autoSwap` API，支持 `1.9.0` 版本之后仍可以保持选定的左右侧时间大小顺序 @uyarn ([#3146](https://github.com/Tencent/tdesign-react/pull/3146))
### 🐞 Bug Fixes
- `TabPanel`: 修复 `label` 改变时，激活的选项卡底部横线没更新 @HaixingOoO ([#3134](https://github.com/Tencent/tdesign-react/pull/3134))
- `Drawer`: 修复打开页面抖动的问题 @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Dialog`: 修复打开 `dialog` 时页面抖动的问题 @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Select`: 修复使用 `OptionGroup `时无法自动定位到选中项问题 @moecasts ([#3139](https://github.com/Tencent/tdesign-react/pull/3139))
### 🚧 Others
- `Loading`: 优化 live demo 展示效果 @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))
- `DatePicker`: 移除文档中错误的 `value` 类型描述 @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))

## 🌈 1.9.1 `2024-09-26` 
### 🚀 Features
- `ImageViewer`: 优化图片预览旋转的重置效果 @sylsaint ([#3108](https://github.com/Tencent/tdesign-react/pull/3108))
- `Table`: 可展开收起场景下新增 `t-table__row--expanded` 和 `t-table__row--folded` 用于区分展开和收起的行 @uyarn ([#3099](https://github.com/Tencent/tdesign-react/pull/3099))
- `TimePicker`: 支持时间区间选择器自动调整左右区间 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Rate`: 新增 `clearable` API，用于清空评分 @HaixingOoO ([#3114](https://github.com/Tencent/tdesign-react/pull/3114))
### 🐞 Bug Fixes
- `Dropdown`: 修复设置 `panelTopContent` 后子菜单 `top` 计算错误的问题 @moecasts ([#3106](https://github.com/Tencent/tdesign-react/pull/3106))
- `TreeSelect`: 修改多选状态下默认点击父节点选项的行为为选中，如果需要点击展开，请配置 `treeProps.expandOnClickNode` @HaixingOoO ([#3111](https://github.com/Tencent/tdesign-react/pull/3111))
- `Menu`: 修复二级菜单展开收起状态没有关联右侧箭头变化的问题 @uyarn ([#3110](https://github.com/Tencent/tdesign-react/pull/3110))
- `DateRangePicker`: 修复配置时间相关格式时，没有正确处理 `defaultTime` 的问题 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `DatePicker`: 修复周选择器下，年份边界日期返回格式错误的问题 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `ColorPicker`:
  - 修复部分场景下子组件存在重复渲染的异常问题 @uyarn ([#3118](https://github.com/Tencent/tdesign-react/pull/3118))
  - 修复渐变模式下，明度滑块和渐变滑块颜色不联动的问题 @huangchen1031 ([#3109](https://github.com/Tencent/tdesign-react/pull/3109))
### 🚧 Others
- `Site`: 站点切换语言时组件跟随切换语言 @RSS1102 ([#3100](https://github.com/Tencent/tdesign-react/pull/3100))
- `Form`: 新增自定义表单控件的文档说明和示例 @miownag  ([#3112](https://github.com/Tencent/tdesign-react/pull/3112))

## 🌈 1.9.0 `2024-09-12` 

### 🚀 Features

- `Tag`: 修改 `maxWidth` 生效的 DOM 节点，方便控制文本内容长度，有基于此特性修改样式的请注意此变更 ⚠️ @liweijie0812 ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `Form`:
  - 修复 `name` 使用下划线拼接的导致使用下划线做 `name` 的计算错误，有使用特殊字符做表单项的 `name` 的请注意此变更 ⚠️ @HaixingOoO ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
  - 添加 `whitespace` 校验默认错误信息 @liweijie0812 ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
  - 支持原生的 `id` 属性，用于配合 `Button` 原生 `Form` 属性实现表单提交的功能 @HaixingOoO ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Card`: `loading` 属性增加 `TNode` 支持 @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Cascader`: 新增 `panelTopContent` 和 `panelBottomContent`，用于自定应该面板顶部和底部内容 @HaixingOoO ([#3096](https://github.com/Tencent/tdesign-react/pull/3096))
- `Checkbox`: 修复 `readonly` 下的样式问题 @HaixingOoO ([#3077](https://github.com/Tencent/tdesign-react/pull/3077))
- `Tag`: 新增支持 `title` API，支持自定义 `title` 配置 @HaixingOoO ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `Tree`: 新增 `allowDrop` API，用于限制拖拽的场景使用 @uyarn ([#3098](https://github.com/Tencent/tdesign-react/pull/3098))

### 🐞 Bug Fixes

- `Card`: 修复 `loading` 切换状态会导致子节点重新渲染的问题 @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Dialog`: 修复 `Header` 为 `null`，配置 `closeBtn` 仍然渲染 `Header` 的问题 @HaixingOoO ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Input`: 修复计算 `emoji` 字符错误的问题 @novlan1 ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Popup`: 修复 `1.8.0` 版本后针对 `Popup` 的优化导致 16.x 版本下的异常问题 @moecasts ([#3091](https://github.com/Tencent/tdesign-react/pull/3091))
- `Statistic`: 修复 `classname` 和 `style` 未透传功能异常的问题 @liweijie0812 ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TimePicker`: 修复 `format` 仅支持 HH:mm:ss 格式的问题 @liweijie0812 ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))


## 🌈 1.8.1 `2024-08-23` 
### 🐞 Bug Fixes
- `Select`: 修复自定义 `content` 时的渲染的问题 @uyarn ([#3058](https://github.com/Tencent/tdesign-react/pull/3058))
- `Rate`: 修复 `1.8.0` 版本中评分描述不显示的问题 @liweijie0812 ([#3060](https://github.com/Tencent/tdesign-react/pull/3060))
- `Popup`: 修复 `panel` 为 null 场景下的部分事件回调缺失和错误的问题 @uyarn ([#3061](https://github.com/Tencent/tdesign-react/pull/3061))

## 🌈 1.8.0 `2024-08-22` 
### 🚀 Features
- `Empty`: 新增 `Empty` 空状态组件 @ZWkang @HaixingOoO @double-deng ([#2817](https://github.com/Tencent/tdesign-react/pull/2817))
- `ConfigProvider`: 支持 `colonText` 属性配置 `Descriptions`、`Form` 组件的 `colon` 属性 @liweijie0812 ([#3055](https://github.com/Tencent/tdesign-react/pull/3055))

### 🐞 Bug Fixes
- `ColorPicker`: 修复 `slider` 部分在鼠标移入移出的缺陷 @Jippp ([#3042](https://github.com/Tencent/tdesign-react/pull/3042))
- `useVirtualScroll`: 修改 `visibleData` 计算方式，解决可视区域过高时，滚动后底部留白的问题 @huangchen1031 ([#2999](https://github.com/Tencent/tdesign-react/pull/2999))
- `Table`: 修复拖拽排序时，祖先节点内的顺序错误的问题 @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `InputNumber`: 修复小数点精度计算，以 0 开头的计算边界逻辑缺失导致计算错误的问题 @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Popup`: 修复某些场景下，隐藏时定位会闪烁的问题 @HaixingOoO ([#3052](https://github.com/Tencent/tdesign-react/pull/3052))

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
- `DateRangePicker` 支持 `borderless` 模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `RangeInput`: 支持 `borderless` 模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `TimeRangePicker`: 支持 `borderless` 模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Descriptions`: layout 类型定义调整为字符串多类型 @liweijie0812 ([#3021](https://github.com/Tencent/tdesign-react/pull/3021))
- `Rate`: 评分组件支持国际化配置 @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
### 🐞 Bug Fixes
- `Upload`: 修复部分图标不支持全局替换的问题 @uyarn ([#3009](https://github.com/Tencent/tdesign-react/pull/3009))
- `Select`: 修复 `Select` 的 `label` 和 `prefixIcon` 的多选状态下的显示问题 @HaixingOoO ([#3019](https://github.com/Tencent/tdesign-react/pull/3019))
- `Tree`: 修复部分场景下首个子节点设置 `checked` 后导致整个树初始化状态异常的问题 @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
- `DropdownItem`: 修复禁用状态影响组件本身响应行为的缺陷 @uyarn ([#3024](https://github.com/Tencent/tdesign-react/pull/3024))
- `TagInput`: `onDragSort` 中使用 `useRef` 导致的上下文错误 @Heising ([#3003](https://github.com/Tencent/tdesign-react/pull/3003))
### 🚧 Others
- `Dialog`: 修复位置示例错误问题 @novlan1 ([#3005](https://github.com/Tencent/tdesign-react/pull/3005))
- `RangeInput`: 增加`liveDemo` @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))

## 🌈 1.7.7 `2024-07-18` 
### 🚀 Features
- `Icon`: 新增有序列表图标 `list-numbered`，优化`lock-off`的绘制路径 @DOUBLE-DENG ([icon#9f4acfd](https://github.com/Tencent/tdesign-icons/commit/9f4acfdda58f84f9bca71a22f033e27127dd26db))
- `BreadcrumbItem`: 增加 `tooltipProps` 扩展，方便定制内置的 `tooltip` 的相关属性 @carolin913 ([#2990](https://github.com/Tencent/tdesign-react/pull/2990))
- `ImageViewer`: 新增 `attach` API，支持自定义挂载节点 @HaixingOoO ([#2995](https://github.com/Tencent/tdesign-react/pull/2995))
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
- `Table`: 
  - 修复 `usePagination` 中 `pagination` 动态变化的功能问题 @HaixingOoO ([#2960](https://github.com/Tencent/tdesign-react/pull/2960))
  - 修复鼠标右键表格也可以触发列宽拖拽的问题 @HaixingOoO ([#2961](https://github.com/Tencent/tdesign-react/pull/2961))
  - 修复只存在一列可被 resize 的使用场景下，拖拽功能异常的问题 @uyarn ([#2959](https://github.com/Tencent/tdesign-react/pull/2959))

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
- `Menu`: 修复 `HeadMenu` 下 `MenuItem` 类名透传失效的问题 @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `TabPanel`: 修复类名透传失效的问题 @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Breadcrumb`: 修复暗色模式下的分隔符不可见问题 @NWYLZW ([#2920](https://github.com/Tencent/tdesign-react/pull/2920))
- `Checkbox`:
   - 修复无法渲染为值为 0 的选项 @NWYLZW ([#2925](https://github.com/Tencent/tdesign-react/pull/2925))
   - 修复受控状态无法被 onChange 回调中正确消费的问题 @NWYLZW ([#2926](https://github.com/Tencent/tdesign-react/pull/2926))
- `SelectInput`: 修复 `interface.d.ts` 文件缺少 `size` 类型的问题 @HaixingOoO ([#2930](https://github.com/Tencent/tdesign-react/pull/2930))
- `DatePicker`: 修复单独使用面板没有兼容无 `onMonthChange` 回调的场景的问题 @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
- `DateRangePickerPanel`: 修复在下拉框中选择年/月时选择出现日期改变错乱的问题 @liyucang-git ([#2922](https://github.com/Tencent/tdesign-react/pull/2922))
- `InputNumber`: 修复 `allowInputOverLimit=false` 大小值判断时，value 为 undefined 时，会出现显示 Infinity 的问题 @HaixingOoO ([common#1802](https://github.com/Tencent/tdesign-common/pull/1802))

## 🌈 1.7.3 `2024-05-18` 
### 🐞 Bug Fixes
- `Menu`: 修复二级及以下 `Submenu` 没有处理 classname 的缺陷 @uyarn ([#2911](https://github.com/Tencent/tdesign-react/pull/2911))
- `Upload`: 修复手动上传的bug @HaixingOoO ([#2912](https://github.com/Tencent/tdesign-react/pull/2912))
- `Avatar`: 修复配合Popup使用浮层不展示的异常 @uyarn

## 🌈 1.7.1 `2024-05-16`

### 🚀 Features
- `Avatar`: 新增 `Click`、`Hover` 和 `Contextmenu` 等鼠标事件，支持对头像操作的场景使用 @NWYLZW ([#2906](https://github.com/Tencent/tdesign-react/pull/2906))
- `Dialog`: 支持 `setConfirmLoading` 的使用 @ZWkang ([#2883](https://github.com/Tencent/tdesign-react/pull/2883))
- `SelectInput`: 支持 `size` 属性 @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `TimePicker`: 新增支持 `onPick` 事件 和 `presets` API @ZWkang ([#2902](https://github.com/Tencent/tdesign-react/pull/2902))
- `Input`: 新增 `borderless` API，支持无边框模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `AutoComplete`: 新增 `borderless` API，支持无边框模式 @uyarn ([#2884](https://github.com/Tencent/tdesign-react/pull/2884))
- `ColorPicker`: 新增 `borderless` API，支持无边框模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `DatePicker`: 新增 `borderless` API，支持无边框模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `TagInput`: 新增 `borderless` API，支持无边框模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `TimePicker`: 新增 `borderless` API，支持无边框模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Scroll`: 调整 `1.6.0` 后针对 Chrome 滚动条样式的兼容方法，不依赖`autoprefixer`的版本 @loopzhou ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
### 🐞 Bug Fixes
- `ColorPicker`: 修复切换预览颜色时，通道按钮位置不变的问题 @fennghuang ([#2880](https://github.com/Tencent/tdesign-react/pull/2880))
- `Form`: 修复由于 `FormItem`的修改，没有触发监听`FormList`的`useWatch`的问题 @HaixingOoO ([#2904](https://github.com/Tencent/tdesign-react/pull/2904))
- `Menu`: @uyarn 
  - 修复使用`dist`样式因为样式优先级问题导致子菜单位置偏移的问题 ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
  - 提升 `t-popup__menu` 的样式优先级，解决 dist 内样式优先级一致导致样式异常的问题 ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Pagination`: 修复当前页输入小数后没有自动调整的问题 @uyarn ([#2886](https://github.com/Tencent/tdesign-react/pull/2886))
- `Select`: 
   - 修复 `creatable` 功能异常问题 @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - 修复 `reserveKeyword` 配合 `Option Children` 用法的异常问题 @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - 优化已选样式覆盖已禁用样式的问题 @fython ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Slider`: 修复 `sliderRef.current` 可能为空的问题 @ZWkang ([#2868](https://github.com/Tencent/tdesign-react/pull/2868))
- `Table`: 
  - 修复卸载表格时数据为空导致报错的异常 @duxphp ([#2900](https://github.com/Tencent/tdesign-react/pull/2900))
  - 修复 `1.5.0` 版本后部分场景下使用固定列导致异常的问题 @uyarn ([#2889](https://github.com/Tencent/tdesign-react/pull/2889))
- `TagInput`:
  - 修复没有透传 `tagProps` 到折叠选项的问题 @uyarn ([#2869](https://github.com/Tencent/tdesign-react/pull/2869))
  - 扩展 `collapsedItems` 的删除功能 @HaixingOoO ([#2881](https://github.com/Tencent/tdesign-react/pull/2881))
- `TreeSelect`: 修复需要通过 `treeProps` 设置 `keys` 属性才生效的问题 @ZWkang ([#2896](https://github.com/Tencent/tdesign-react/pull/2896))
- `Upload`: 
  - 修复手动修改上传进度的 bug @HaixingOoO ([#2901](https://github.com/Tencent/tdesign-react/pull/2901))
  - 修复图片上传错误类型下的样式异常的问题 @uyarn ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
### 🚧 Others
- `TagInput`: 补充 `Size` 属性的相关文档 @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Typography`: 删除多余的 `defaultProps` @HaixingOoO ([#2866](https://github.com/Tencent/tdesign-react/pull/2866))
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
- `Portal`: `Portal` 新增懒加载 `forceRender`，默认为 `lazy` 模式，优化性能，兼容 `SSR` 渲染，对 `Dialog` 和 `Drawer` 组件可能存在破坏性影响 ⚠️ @HaixingOoO ([#2826](https://github.com/Tencent/tdesign-react/pull/2826))
### 🐞 Bug Fixes
- `ImageViewer`: 修复 `imageReferrerpolicy` 没有对顶部缩略图生效的问题 @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))
- `Descriptions`: 修复 `props` 缺少 `className` 和 `style` 属性的问题 @HaixingOoO ([#2818](https://github.com/Tencent/tdesign-react/pull/2818))
- `Layout`: 修复 `Layout` 添加 `Aside` 页面布局会跳动的问题 @HaixingOoO ([#2824](https://github.com/Tencent/tdesign-react/pull/2824))
- `Input`: 修复在 `React16` 版本下阻止冒泡失败的问题 @HaixingOoO ([#2833](https://github.com/Tencent/tdesign-react/pull/2833))
- `DatePicker`: 修复 `1.5.3` 版本之后处理Date类型和周选择器的异常 @uyarn ([#2841](https://github.com/Tencent/tdesign-react/pull/2841))
- `Guide`:  
     - 优化 `SSR` 下的使用问题 @HaixingOoO ([#2842](https://github.com/Tencent/tdesign-react/pull/2842))
     - 修复 `SSR` 场景下组件初始化渲染位置异常的问题 @uyarn ([#2832](https://github.com/Tencent/tdesign-react/pull/2832))
- `Scroll`: 修复由于 `Chrome 121` 版本支持 scroll width 之后导致 `Table`、`Select` 及部分出现滚动条组件的样式异常问题 @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765)) @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Locale`: 优化 `DatePicker` 部分模式的语言包 @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Tree`: 修复初始化后 `draggable` 属性丢失响应式的问题 @Liao-js ([#2838](https://github.com/Tencent/tdesign-react/pull/2838))
- `Style`: 支持通过 `less` 总入口打包样式的需求 @NWYLZW @uyarn ([common#1757](https://github.com/Tencent/tdesign-common/pull/1757)) ([common#1766](https://github.com/Tencent/tdesign-common/pull/1766))


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
- `BreadcrumbItem`: 支持 `onClick` 事件 @HaixingOoO ([#2795](https://github.com/Tencent/tdesign-react/pull/2795))
- `Tag`: 组件新增`color`API，支持自定义颜色 @maoyiluo  @uyarn ([#2799](https://github.com/Tencent/tdesign-react/pull/2799))
### 🐞 Bug Fixes
- `FormList`: 修复多个组件卡死的问题 @HaixingOoO ([#2788](https://github.com/Tencent/tdesign-react/pull/2788))
- `DatePicker`: 修复 `format` 与 `valueType` 不一致的场景下计算错误的问题 @uyarn ([#2798](https://github.com/Tencent/tdesign-react/pull/2798))
### 🚧 Others
- `Portal`: 添加Portal测试用例 @HaixingOoO ([#2791](https://github.com/Tencent/tdesign-react/pull/2791))
- `List`: 完善 List 测试用例 @HaixingOoO ([#2792](https://github.com/Tencent/tdesign-react/pull/2792))
- `Alert`: 完善 Alert 测试,优化代码 @HaixingOoO ([#2793](https://github.com/Tencent/tdesign-react/pull/2793))

## 🌈 1.5.2 `2024-02-29` 
### 🚀 Features
- `Cascader`: 新增`valueDisplay`和`label` API的支持 @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Descriptions`: 组件支持嵌套 @HaixingOoO ([#2777](https://github.com/Tencent/tdesign-react/pull/2777))
- `Tabs`: 调整激活 `Tab` 下划线与 `TabHeader` 边框的层级关系 @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
### 🐞 Bug Fixes
- `Grid`: 尺寸计算错误，宽度兼容异常 @NWYLZW ([#2738](https://github.com/Tencent/tdesign-react/pull/2738))
- `Cascader`: 修复`clearable`点击清除按钮触发三次`onChange`的问题 @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Dialog`: 修复`useDialogPosition`渲染多次绑定事件 @HaixingOoO ([#2749](https://github.com/Tencent/tdesign-react/pull/2749))
- `Guide`: 修复自定义内容功能失效 @zhangpaopao0609 ([#2752](https://github.com/Tencent/tdesign-react/pull/2752))
- `Tree`: 修复设置 `keys.children` 后展开图标没有正常变化的问题 @uyarn ([#2746](https://github.com/Tencent/tdesign-react/pull/2746))
- `Tree`: 修复 `Tree` 自定义label `setData` 没有渲染的问题 @HaixingOoO ([#2776](https://github.com/Tencent/tdesign-react/pull/2776))
- `Tree`: 修复设置 `Tree` 宽度，`TreeItem` 的 `checkbox` 会被压缩，`label` 省略号失效的问题 @HaixingOoO  @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
- `Select`: @uyarn 
    - 修复通过滚动加载选项选中后滚动行为异常的问题 ([#2779](https://github.com/Tencent/tdesign-react/pull/2779))
    - 修复使用 `size` API 时，虚拟滚动的功能异常问题  ([#2756](https://github.com/Tencent/tdesign-react/pull/2756))

## 🌈 1.5.1 `2024-01-25` 
### 🚀 Features
- `Popup`: 支持 `Plugin` 方式使用。 @HaixingOoO ([#2717](https://github.com/Tencent/tdesign-react/pull/2717))
- `Transfer`: 支持 `direction` API @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Tabs`: 新增 `action` API，支持自定义右侧区域 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
### 🐞 Bug Fixes
- `Pagination`: `Jump to` 调整为大写，保持一致性 @wangyewei ([#2716](https://github.com/Tencent/tdesign-react/pull/2716))
- `Table`: 修复`Modal`里的`Form`表单，使用`shouldUpdate`卸载有时无法找到表单的方法。 @duxphp ([#2675](https://github.com/Tencent/tdesign-react/pull/2675))
- `Table`: 列宽调整和行展开场景，修复行展开时，会重置列宽调整结果问题 @chaishi ([#2722](https://github.com/Tencent/tdesign-react/pull/2722))
- `Select`: 修复`Select`多选状态下选中内容滚动的问题。 @HaixingOoO ([#2721](https://github.com/Tencent/tdesign-react/pull/2721))
- `Transfer`: 修复 `disabled` API功能异常的问题 @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Swiper`: 修复向左切换轮播动画时顺序错乱的问题 @HaixingOoO ([#2725](https://github.com/Tencent/tdesign-react/pull/2725))
- `Form`: 修复计算 `^` 字符异常的问题 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Loading`: 修复未设置 `z-index` 默认值的问题 @betavs ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `CheckTag`: 修复设置 `className` 会覆盖全部已有类名的缺陷  @uyarn ([#2730](https://github.com/Tencent/tdesign-react/pull/2730))
- `TreeSelect`: 修复 `onEnter` 事件不触发的问题 @uyarn ([#2731](https://github.com/Tencent/tdesign-react/pull/2731))
- `Menu`: 修复 `collapsed` 的 `scroll` 样式 @Except10n ([#2718](https://github.com/Tencent/tdesign-react/pull/2718))
- `Cascader`: 修复长列表场景下，在 `Safari` 中使用的样式异常问题 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))

## 🌈 1.5.0 `2024-01-11` 
### 🚨 Breaking Changes
- `Dialog`: 该版本将 `className` 错误挂载进行了修复，现在的 `className` 只会被挂载到 `Dialog` 的上层容器元素 Context 之中。如果你需要直接修改 `Dialog` 本体的样式，可以切换使用为 `dialogClassName` 进行修改。
### 🚀 Features
- `Descriptions`: 新增 `Descriptions` 描述组件 @HaixingOoO ([#2706](https://github.com/Tencent/tdesign-react/pull/2706))
- `Dialog`: 添加了 `dialogClassName` 用于处理内部 dialog 节点样式。建议之前通过 `className` 直接修改弹窗本体样式的用户切换使用为 `dialogClassName` @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
### 🐞 Bug Fixes
- `Cascader`: 修复 Cascader 的 `trigger=hover` 过滤之后，选择操作存在异常 bug @HaixingOoO ([#2702](https://github.com/Tencent/tdesign-react/pull/2702))
- `Upload`: 修复 Upload 的 `uploadFilePercent` 类型未定义 @betavs ([#2703](https://github.com/Tencent/tdesign-react/pull/2703))
- `Dialog`: 修复了 Dialog 的 `className` 进行的多次节点挂载错误，`className` 将仅被挂载至 ctx 元素上 @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
- `TreeSelect`: 修复 `suffixIcon` 错误并添加了相关示例 @Ali-ovo ([#2692](https://github.com/Tencent/tdesign-react/pull/2692))

## 🌈 1.4.3 `2024-01-02` 
### 🐞 Bug Fixes
- `AutoComplete`: 修复`ActiveIndex=-1`没匹配时，回车会报错的问题 @Ali-ovo ([#2300](https://github.com/Tencent/tdesign-react/pull/2300))
- `Cascader`: 修复`1.4.2` Cascader单选过滤下不触发选中的缺陷 @HaixingOoO ([#2700](https://github.com/Tencent/tdesign-react/pull/2700))


## 🌈 1.4.2 `2023-12-28` 
### 🚀 Features
- `Card`: 添加 `LoadingProps` 属性 @HaixingOoO ([#2677](https://github.com/Tencent/tdesign-react/pull/2677))
- `DatePicker`: `DateRangePicker` 新增`cancelRangeSelectLimit`，支持不限制 RangePicker 选择的前后范围 @uyarn ([#2684](https://github.com/Tencent/tdesign-react/pull/2684))
- `Space`: 元素为空时，不再渲染一个子元素 @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 新增支持使用 `uploadPastedFiles` 粘贴上传文件
  - 输入框类型的上传组件，新增类名 `t-upload--theme-file-input`
  - 新增支持 `uploadPastedFiles`，表示允许粘贴上传文件
  - 新增 `cancelUploadButton` 和 `uploadButton`，支持自定义上传按钮和取消上传按钮
  - 新增 `imageViewerProps`，透传图片预览组件全部属性 
  - 新增 `showImageFileName`，用于控制是否显示图片名称
  - 支持传入默认值为非数组形式
  - 支持 `fileListDisplay=null` 时，隐藏文件列表；并新增更加完整的 `fileListDisplay` 参数，用于自定义 UI
### 🐞 Bug Fixes
- `Table`:  异步获取最新的树形结构数据时，优先使用 `window.requestAnimationFrame` 函数，以防闪屏 @lazybonee ([#2668](https://github.com/Tencent/tdesign-react/pull/2668))
- `Table`: 修复筛选值为 `0/false` 时，筛选图标不能高亮问题 @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Cascader`: 修复组件在 filter 之后进行选择操作和清除内容存在异常 bug @HaixingOoO ([#2674](https://github.com/Tencent/tdesign-react/pull/2674))
- `ColorPicker`: 全局设置 `border-box` 后造成颜色列表样式问题 @carolin913
- `Pagination`: 将总数单位 `项` 改为 `条` , 保持内容一致性  @dinghuihua ([#2679](https://github.com/Tencent/tdesign-react/pull/2679))
- `InputNumber`: 修复 `min=0` 或 `max=0` 限制无效问题 @chaishi ([#2352](https://github.com/Tencent/tdesign-react/pull/2352))
- `Watermark`: 修复行内 style 引起的无法 sticky 定位问题 @carolin913 ([#2685](https://github.com/Tencent/tdesign-react/pull/2685))
- `Calendar`: 修复卡片模式下未正常展示周信息的缺陷 @uyarn ([#2686](https://github.com/Tencent/tdesign-react/pull/2686))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - 修复手动上传时，无法更新上传进度问题
  - 修复 `uploadFilePercent` 参数类型问题
    
 ## 🌈 1.4.1 `2023-12-14` 
### 🚀 Features
- `Radio`: 支持通过空格键（Space）选中选项 @liweijie0812 ([#2638](https://github.com/Tencent/tdesign-react/pull/2638))
- `Dropdown`: 移除对 left 的 item 样式特殊处理 @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
### 🐞 Bug Fixes
- `AutoComplete`: 修复部分特殊字符匹配报错的问题  @ZWkang ([#2631](https://github.com/Tencent/tdesign-react/pull/2631))
- `DatePicker`: 
  - 修复日期点击清空内容时弹窗会闪烁的缺陷 @HaixingOoO ([#2641](https://github.com/Tencent/tdesign-react/pull/2641))
  - 修复日期选择禁用后，后缀图标颜色改变的问题 @HaixingOoO  @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
  - 修复禁用状态下点击组件边缘仍能显示 `Panel` @Zz-ZzzZ ([#2653](https://github.com/Tencent/tdesign-react/pull/2653))
- `Dropdown`: 修复下拉菜单禁用状态可点击的问题 @betavs ([#2648](https://github.com/Tencent/tdesign-react/pull/2648))
- `DropdownItem`: 修复遗漏 `Divider` 类型的缺陷 @uyarn ([#2649](https://github.com/Tencent/tdesign-react/pull/2649))
- `Popup`: 修复 `disabled` 属性未生效的缺陷 @uyarn ([#2665](https://github.com/Tencent/tdesign-react/pull/2665))
- `Select`: 修复 `InputChange` 事件在blur时trigger异常的问题 @uyarn ([#2664](https://github.com/Tencent/tdesign-react/pull/2664))
- `SelectInput`: 修复 popup 内容宽度计算问题 @HaixingOoO ([#2647](https://github.com/Tencent/tdesign-react/pull/2647))
- `ImageViewer`: 图片预览添加默认的缩放比例和按下 ESC 时是否触发图片预览器关闭事件 @HaixingOoO ([#2652](https://github.com/Tencent/tdesign-react/pull/2652))
- `Table`: @chaishi
    - 修复 `EnhancedTable` 树节点无法正常展开问题 ([#2661](https://github.com/Tencent/tdesign-react/pull/2661))
    - 修复虚拟滚动场景，树节点无法展开问题 ([#2659](https://github.com/Tencent/tdesign-react/pull/2659))

 ## 🌈 1.4.0 `2023-11-30`
### 🚀 Features

- `Space`: 兼容支持组件间距在低级浏览器中的呈现 @chaishi ([#2602](https://github.com/Tencent/tdesign-react/pull/2602))
- `Statistic`: 新增统计数值组件 @HaixingOoO ([#2596](https://github.com/Tencent/tdesign-react/pull/2596))

### 🐞 Bug Fixes

- `ColorPicker`: 修复 `format` 为 `hex` 时，配合 `enableAlpha` 调整透明度不生效的问题 @uyarn ([#2628](https://github.com/Tencent/tdesign-react/pull/2628))
- `ColorPicker`: 修复修改颜色上方滑杆按钮颜色不变 @HaixingOoO ([#2615](https://github.com/Tencent/tdesign-react/pull/2615))
- `Table`: 修复 `lazyLoad` 懒加载效果 @chaishi ([#2605](https://github.com/Tencent/tdesign-react/pull/2605))
- `Tree`: 
    - 修复树组件节点的 `open class` 状态控制逻辑错误导致的样式异常 @NWYLZW ([#2611](https://github.com/Tencent/tdesign-react/pull/2611))
    - 指定滚动到特定节点 API 中的 `key` 和 `index` 应为可选 @uyarn ([#2626](https://github.com/Tencent/tdesign-react/pull/2626))
- `Drawer`: 修复 `mode` 为 `push` 时,推开内容区域为 drawer 节点的父节点。 @HaixingOoO ([#2614](https://github.com/Tencent/tdesign-react/pull/2614))
- `Radio`: 修复表单 `disabled` 未生效在 `Radio 上的问题 @li-jia-nan ([#2397](https://github.com/Tencent/tdesign-react/pull/2397))
- `Pagination`: 修复当 `total` 为 0 并且 `pageSize` 改变时，`current` 值为 0 的问题 @betavs ([#2624](https://github.com/Tencent/tdesign-react/pull/2624))
- `Image`: 修复图片在 SSR 模式下不会触发原生事件 @HaixingOoO ([#2616](https://github.com/Tencent/tdesign-react/pull/2616))

 ## 🌈 1.3.1 `2023-11-15` 
### 🚀 Features
- `Upload`: 拖拽上传文件场景，即使文件类型错误，也触发 `drop` 事件 @chaishi ([#2591](https://github.com/Tencent/tdesign-react/pull/2591))
### 🐞 Bug Fixes
- `Tree`: 
    - 修复不添加 `activable` 参数也可触发 `onClick` 事件 @HaixingOoO ([#2568](https://github.com/Tencent/tdesign-react/pull/2568))
    - 修复可编辑表格编辑组件之间的联动不生效 @HaixingOoO ([#2572](https://github.com/Tencent/tdesign-react/pull/2572))
- `Notification`: 
    - 修复连续弹两个 `Notification`，第一次实际只显示一个 @HaixingOoO ([#2595](https://github.com/Tencent/tdesign-react/pull/2595))
    - 使用 `flushSync` 在 `useEffect` 中会警告，现在改用循环 `setTimeout 来处理 @HaixingOoO ([#2597](https://github.com/Tencent/tdesign-react/pull/2597))
- `Dialog`: 
    - 修复 `Dialog` 中 引入 `Input` 组件，从 `Input` 中间输入光标会跳转到最后 @HaixingOoO ([#2485](https://github.com/Tencent/tdesign-react/pull/2485))
    - 修复弹窗的头部标题显示影响了取消按钮的位置 @HaixingOoO ([#2593](https://github.com/Tencent/tdesign-react/pull/2593))
- `Popup`: 修复 `PopupRef` 的类型缺失问题 @Ricinix ([#2577](https://github.com/Tencent/tdesign-react/pull/2577))
- `Tabs`: 修复重复点击激活的选项卡，也会触发 `onChange` 事件。 @HaixingOoO ([#2588](https://github.com/Tencent/tdesign-react/pull/2588))
- `Radio`: 根据对应 variant 选择 Radio.Button 进行展示 @NWYLZW ([#2589](https://github.com/Tencent/tdesign-react/pull/2589))
- `Input`: 修复设置最大长度后回删的异常行为 @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Link`: 修复前后图标没有垂直居中的问题 @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Select`: 修复 `inputchange` 事件context参数异常的问题 @uyarn ([#2600](https://github.com/Tencent/tdesign-react/pull/2600))
- `DatePicker`: 修复 `PaginationMini`未更新导致切换行为异常的问题 @Ricinix ([#2587](https://github.com/Tencent/tdesign-react/pull/2587))
- `Form`: 修复 setFields 触发 onValuesChange 导致的死循环 @honkinglin ([#2570](https://github.com/Tencent/tdesign-react/pull/2570))

 ## 🌈 1.3.0 `2023-10-19` 
### 🚀 Features
- `TimelineItem`: 添加点击事件 @Zzongke ([#2545](https://github.com/Tencent/tdesign-react/pull/2545))
- `Tag`: @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
    - 支持多种风格标签配置
    - 支持标签组`CheckTagGroup`的使用，详见示例文档
### 🐞 Bug Fixes
- `locale`: 添加缺失it_IT、ru_RU、zh_TW 的语言环境 @Zzongke ([#2542](https://github.com/Tencent/tdesign-react/pull/2542))
- `Cascader`: `change` 事件中 `source` 异常问题 @betavs ([#2544](https://github.com/Tencent/tdesign-react/pull/2544))
- `Tree`: 修复`allowFoldNodeOnFilter`为true下过滤后节点的展示结果 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TagInput`: 修复在只有一个选项时，删除过滤文字会误删已选项的缺陷 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TreeSelect`: 调整过滤选项后的交互行为，与其他实现框架保持一致 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Rate`: 修复鼠标快速移动，会出现多个 text 显示的问题 @Jon-Millent ([#2551](https://github.com/Tencent/tdesign-react/pull/2551))

 ## 🌈 1.2.6 `2023-09-28` 
### 🚀 Features
- `Table`: 优化渲染次数 @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Card`: `title` 使用 `div` 取代 `span` 在自定义场景下更符合规范 @uyarn ([#2517](https://github.com/Tencent/tdesign-react/pull/2517))
- `Tree`: 支持通过 key 匹配单一 value 指定滚动到特定位置，具体使用方式请参考示例代码 @uyarn ([#2519](https://github.com/Tencent/tdesign-react/pull/2519))
### 🐞 Bug Fixes
- `Form`: 修复 formList 嵌套数据获取异常 @honkinglin ([#2529](https://github.com/Tencent/tdesign-react/pull/2529))
- `Table`: 修复数据切换时 `rowspanAndColspan` 渲染问题 @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Cascader`: hover 没有子节点数据的父节点时未更新子节点 @betavs ([#2528](https://github.com/Tencent/tdesign-react/pull/2528))
- `DatePicker`: 修复切换月份失效问题 @honkinglin ([#2531](https://github.com/Tencent/tdesign-react/pull/2531))
- `Dropdown`: 修复`Dropdown` disabled API失效的问题 @uyarn ([#2532](https://github.com/Tencent/tdesign-react/pull/2532))

 ## 🌈 1.2.5 `2023-09-14` 
### 🚀 Features
- `Steps`: 全局配置添加步骤条的已完成图标自定义 @Zzongke ([#2491](https://github.com/Tencent/tdesign-react/pull/2491))
- `Table`: 可筛选表格，`onFilterChange` 事件新增参数 `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'`，表示触发筛选条件变化的来源 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
- `Form`: trigger新增`submit`选项 @honkinglin ([#2507](https://github.com/Tencent/tdesign-react/pull/2507))
- `ImageViewer`: `onIndexChange` 事件新增 `trigger` 枚举值 `current` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Image`: @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
    - 新增 `fallback`，表示图片的兜底图，原始图片加载失败时会显示兜底图
    - 新增支持 `src` 类型为 `File`，支持通过 `File` 预览图片
- `Upload`: 文案列表支持显示缩略图 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
    - 支持虚拟滚动场景通过 `key` 滚动到特定节点 
    - 支持虚拟滚动场景低于 `threshold` 仍可运行 `scrollTo` 操作
### 🐞 Bug Fixes
- `ConfigProvider`: 修复切换多语言失效的问题 @uyarn ([#2501](https://github.com/Tencent/tdesign-react/pull/2501))
- `Table`:
    - 可筛选表格，修复 `resetValue` 在清空筛选时，未能重置到指定 `resetValue` 值的问题 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - 树形结构表格，修复 expandedTreeNodes.sync 和 expanded-tree-nodes-change 使用 expandTreeNodeOnClick 时无效问题 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - 单元格在编辑模式下，保存的时候对于链式的colKey处理错误，未能覆盖原来的值 @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
    - 可编辑表格，修复多个可编辑表格同时存在时，校验互相影响问题 @chaishi ([#2498](https://github.com/Tencent/tdesign-react/pull/2498))
- `TagInput`: 修复折叠展示选项尺寸大小问题 @uyarn ([#2503](https://github.com/Tencent/tdesign-react/pull/2503))
- `Tabs`: 修复使用 list 传 props 且 destroyOnHide 为 false 下， 会丢失 panel 内容的问题 @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `Menu`: 修复菜单 `expandType` 默认模式下menuitem传递onClick不触发的问题 @Zzongke ([#2502](https://github.com/Tencent/tdesign-react/pull/2502))
- `ImageViewer`: 修复无法通过 `visible` 直接打开预览弹框问题 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: 修复 `1.2.0` 版本后部分 `TreeNodeModel` 的操作失效的异常 @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))

 ## 🌈 1.2.4 `2023-08-31` 
### 🚀 Features
- `Table`: 树形结构，没有设置 `expandedTreeNodes` 情况下，data 数据发生变化时，自动重置收起所有展开节点（如果希望保持展开节点，请使用属性 `expandedTreeNodes` 控制  @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
### 🐞 Bug Fixes
- `Watermark`: 修改水印节点，不影响水印展示 @tingtingcheng6 ([#2459](https://github.com/Tencent/tdesign-react/pull/2459))
- `Table`: @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
    - 拖拽排序 + 本地数据分页场景，修复拖拽排序事件参数 `currentIndex/targetIndex/current/target` 等不正确问题
    - 拖拽排序 + 本地数据分页场景，修复在第二页以后的分页数据中拖拽调整顺序后，会自动跳转到第一页问题
    - 支持分页非受控用法的拖拽排序场景 
- `Slider`: 修复初始值为0 时，label位置错误的缺陷 @Zzongke ([#2477](https://github.com/Tencent/tdesign-react/pull/2477))
- `Tree`: 支持`store.children`调用getChildren方法 @uyarn ([#2480](https://github.com/Tencent/tdesign-react/pull/2480)) 

## 🌈 1.2.3 `2023-08-24` 
### 🐞 Bug Fixes
- `Table`: 修复 usePrevious 报错 @honkinglin ([#2464](https://github.com/Tencent/tdesign-react/pull/2464))
- `ImageViewer`: 修复引入文件路径报错 @honkinglin ([#2465](https://github.com/Tencent/tdesign-react/pull/2465)) 

## 🌈 1.2.2 `2023-08-24` 
### 🚀 Features
- `Table`: @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
    - 树形结构，新增组件实例方法 `removeChildren`，用于移除子节点 
    - 树形结构，支持通过属性 `expandedTreeNodes.sync` 自由控制展开节点，非必传属性
- `Tree`: 新增`scrollTo`方法 支持在虚拟滚动场景下滚动到指定节点的需求 @uyarn ([#2460](https://github.com/Tencent/tdesign-react/pull/2460))
### 🐞 Bug Fixes
- `TagInput`: 修复输入中文时被卡住的问题 @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Table`:
    - 点击行展开/点击行选中，修复 `expandOnRowClick`和 `selectOnRowClick` 无法独立控制行点击执行交互问题 @chaishi ([#2452](https://github.com/Tencent/tdesign-react/pull/2452))
    - 树形结构，修复组件实例方法 展开全部 `expandAll` 问题 @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `Form`: 修复FormList组件使用form setFieldsValue、reset异常 @nickcdon ([#2406](https://github.com/Tencent/tdesign-react/pull/2406)) 

## 🌈 1.2.1 `2023-08-16` 
### 🚀 Features
- `Anchor`: 新增 `getCurrentAnchor` 支持自定义高亮锚点 @ontheroad1992 ([#2436](https://github.com/Tencent/tdesign-react/pull/2436))
- `MenuItem`: `onClick` 事件增加 `value` 返回值 @dexterBo ([#2441](https://github.com/Tencent/tdesign-react/pull/2441))
- `FormItem`: 新增 `valueFormat` 函数支持格式化数据 @honkinglin ([#2445](https://github.com/Tencent/tdesign-react/pull/2445))
### 🐞 Bug Fixes
- `Dialog`: 修复闪烁问题 @linjunc ([#2435](https://github.com/Tencent/tdesign-react/pull/2435))
- `Select`: @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
    - 修复多选丢失 `title` 的问题
    - 开启远程搜索时不执行内部过滤
- `Popconfirm`: 无效的 `className` 和 `style` Props @betavs ([#2420](https://github.com/Tencent/tdesign-react/pull/2420))
- `DatePicker`: 修复 hover cell 造成不必要的渲染 @j10ccc ([#2440](https://github.com/Tencent/tdesign-react/pull/2440)) 

 ## 🌈 1.2.0 `2023-08-10` 

### 🚨 Breaking Changes
- `Icon`: @uyarn ([#2429](https://github.com/Tencent/tdesign-react/pull/2429))
    - 新增 960 个图标
    - 调整图标命名 `photo` 为 `camera`，`books` 为 `bookmark`, `stop-cirle-1` 为 `stop-circle-stroke`
    - 移除 `money-circle` 图标，具体请查看图标页面

### 🚀 Features
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - 新增 `lazyLoad` 用于懒加载整个表格
    - 可编辑单元格，新增 `edit.keepEditMode` ，用于保持单元格始终为编辑模式
    - 可筛选表格，支持透传 `attrs/style/classNames` 属性、样式、类名等信息到自定义组件
    - 可筛选表格，当前 `filterValue` 未设置过滤值的默认值时，不再透传 undefined 到筛选器组件，某些组件的默认值必须为数组，不允许是 undefined 
### 🐞 Bug Fixes
- `Cascader`:  传入的 value 不在 options中时会直接报错 @peng-yin ([#2414](https://github.com/Tencent/tdesign-react/pull/2414))
- `Menu`: 修复同一个 `MenuItem` 多次触发 `onChange` 的问题 @leezng ([#2424](https://github.com/Tencent/tdesign-react/pull/2424))
- `Drawer`: 抽屉组件在 `visible` 默认为 `true` 时，无法正常显示 @peng-yin ([#2415](https://github.com/Tencent/tdesign-react/pull/2415))
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - 虚拟滚动场景，修复表头宽度和表内容宽度不一致问题
    - 虚拟滚动场景，修复默认的滚动条长度（位置）和滚动后的不一致问题 

## 🌈 1.1.17 `2023-07-28`
### 🐞 Bug Fixes
- `Tabs`: 修复 list 传空数组时的 js 报错 @zhenglianghan ([#2393](https://github.com/Tencent/tdesign-react/pull/2393))
- `ListItemMeta`: 修复 `description` 传递自定义元素 @qijizh ([#2396](https://github.com/Tencent/tdesign-react/pull/2396))
- `Tree`: 修复开启虚拟滚动时部分场景下节点回滚的交互异常问题 @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))
- `Tree`: 修复 `1.1.15` 版本后基于 `level` 属性的操作无法正常工作的问题 @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))

## 🌈 1.1.16 `2023-07-26`
### 🚀 Features
- `TimePicker`: @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
    - `disableTime` 回调新增毫秒参数
    - 优化展示不可选时间选项时滚动到不可选选项的体验 
- `Dropdown`: 新增 `panelTopContent` 及 `panelBottomContent`，支持需要上下额外节点的场景使用 @uyarn ([#2387](https://github.com/Tencent/tdesign-react/pull/2387))

### 🐞 Bug Fixes
- `Table`:
    - 可编辑表格场景，支持设置 `colKey` 值为链式属性，如：`a.b.c` @chaishi ([#2381](https://github.com/Tencent/tdesign-react/pull/2381))
    - 树形结构表格，修复当 `selectedRowKeys` 中的值在 data 数据中不存在时报错问题 @chaishi ([#2385](https://github.com/Tencent/tdesign-react/pull/2385))
- `Guide`: 修复设置 `step1` 为 `-1` 时需要隐藏组件的功能 @uyarn ([#2389](https://github.com/Tencent/tdesign-react/pull/2389))

## 🌈 1.1.15 `2023-07-19` 
### 🚀 Features
- `DatePicker`: 优化关闭浮层后重置默认选中区域 @honkinglin ([#2371](https://github.com/Tencent/tdesign-react/pull/2371))
### 🐞 Bug Fixes
- `Dialog`: 修复 `theme=danger` 无效问题 @chaishi ([#2365](https://github.com/Tencent/tdesign-react/pull/2365))
- `Popconfirm`: 当 `confirmBtn/cancelBtn` 值类型为 `Object` 时未透传 @imp2002 ([#2361](https://github.com/Tencent/tdesign-react/pull/2361)) 

## 🌈 1.1.14 `2023-07-12` 
### 🚀 Features
- `Tree`: 支持虚拟滚动 @uyarn ([#2359](https://github.com/Tencent/tdesign-react/pull/2359))
- `Table`: 树形结构，添加行层级类名，方便业务设置不同层级的样式 @chaishi ([#2354](https://github.com/Tencent/tdesign-react/pull/2354))
- `Radio`: 优化选项组换行情况 @ontheroad1992 ([#2358](https://github.com/Tencent/tdesign-react/pull/2358))
- `Upload`: @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
    - 新增组件实例方法，`uploadFilePercent` 用于更新文件上传进度
    - `theme=image`，支持使用 `fileListDisplay` 自定义 UI 内容
    - `theme=image`，支持点击名称打开新窗口访问图片
    - 拖拽上传场景，支持 `accept` 文件类型限制

### 🐞 Bug Fixes
- `Upload`: 自定义上传方法，修复未能正确返回上传成功或失败后的文件问题 @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

## 🌈 1.1.13 `2023-07-05` 
### 🐞 Bug Fixes
- `Tag`: 修复 `children` 为数字 `0` 时的渲染异常 @HelKyle ([#2335](https://github.com/Tencent/tdesign-react/pull/2335))
- `Input`: 修复 `limitNumber` 部分在 `disabled` 状态下的样式问题 @uyarn ([#2338](https://github.com/Tencent/tdesign-react/pull/2338))
- `TagInput`: 修复前置图标的样式缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))
- `SelectInput`: 修复失焦时未清空输入内容的缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))

## 🌈 1.1.12 `2023-06-29` 

### 🚀 Features
- `Site`: 支持英文站点 @uyarn ([#2316](https://github.com/Tencent/tdesign-react/pull/2316))

### 🐞 Bug Fixes
- `Slider`: 修复数字输入框 `theme` 固定为 `column` 的问题 @Ali-ovo ([#2289](https://github.com/Tencent/tdesign-react/pull/2289))
- `Table`: 列宽调整和自定义列共存场景，修复通过自定义列配置表格列数量变少时，表格总宽度无法再恢复变小 @chaishi ([#2325](https://github.com/Tencent/tdesign-react/pull/2325))

## 🌈 1.1.11 `2023-06-20` 
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - 可拖拽调整列宽场景，修复 `resizable=false` 无效问题，默认值为 false
    - 本地数据排序场景，修复异步拉取数据时，取消排序数据会导致空列表问题
    - 修复固定表格 + 固定列 + 虚拟滚动场景，表头不对齐问题
    - 可编辑单元格/可编辑行场景，修复数据始终校验上一个值问题，调整为校验最新输入值
    - 修复本地数据排序，多字段排序场景，示例代码缺失问题
- `ColorPicker`: @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
    - 初始化为渐变模式时，支持空字符串作为初始值
    - 修复 `recentColors` 等字段的类型问题
    - 修复内部下拉选项未透传 `popupProps` 的缺陷


## 🌈 1.1.10 `2023-06-13` 
### 🚀 Features
- `Menu`:
    - `Submenu` 新增 `popupProps` 属性，允许透传设置底层 Popup 弹窗属性 @xiaosansiji ([#2284](https://github.com/Tencent/tdesign-react/pull/2284))
    - 弹出菜单使用 Popup 重构 @xiaosansiji ([#2274](https://github.com/Tencent/tdesign-react/pull/2274))

### 🐞 Bug Fixes
- `InputNumber`: 初始值为 `undefined` / `null`，且存在 `decimalPlaces` 时，不再进行小数点纠正 @chaishi ([#2273](https://github.com/Tencent/tdesign-react/pull/2273))
- `Select`: 修复 `onBlur` 方法回调参数异常的问题 @Ali-ovo ([#2281](https://github.com/Tencent/tdesign-react/pull/2281))
- `Dialog`: 修复在 SSR 环境下报错 @night-c ([#2280](https://github.com/Tencent/tdesign-react/pull/2280))
- `Table`: 修复组件设置 `expandOnRowClick` 为 `true` 时，点击整行报错 @pe-3 ([#2275](https://github.com/Tencent/tdesign-react/pull/2275))

## 🌈 1.1.9 `2023-06-06` 
### 🚀 Features
- `DatePicker`: 支持 `onConfirm` 事件 @honkinglin ([#2260](https://github.com/Tencent/tdesign-react/pull/2260))
- `Menu`: 优化侧边导航菜单收起时，`Tooltip` 展示菜单内容 @xiaosansiji ([#2263](https://github.com/Tencent/tdesign-react/pull/2263))
- `Swiper`: navigation 类型支持 `dots` `dots-bar` @carolin913 ([#2246](https://github.com/Tencent/tdesign-react/pull/2246))
- `Table`: 新增 `onColumnResizeChange` 事件 @honkinglin ([#2262](https://github.com/Tencent/tdesign-react/pull/2262))

### 🐞 Bug Fixes
- `TreeSelect`: 修复 `keys` 属性没有透传给 `Tree` 的问题 @uyarn ([#2267](https://github.com/Tencent/tdesign-react/pull/2267))
- `InputNumber`:  修复部分小数点数字无法输入问题 @chaishi ([#2264](https://github.com/Tencent/tdesign-react/pull/2264))
- `ImageViewer`: 修复触控板缩放操作异常问题 @honkinglin ([#2265](https://github.com/Tencent/tdesign-react/pull/2265))
- `TreeSelect`: 修复当 `label` 是 `reactNode` 场景下展示问题 @Ali-ovo ([#2258](https://github.com/Tencent/tdesign-react/pull/2258))

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
- `TreeSelect`: 支持 `panelConent` API @ArthurYung ([#2182](https://github.com/Tencent/tdesign-react/pull/2182))

### 🐞 Bug Fixes
- `Select`: 修复可创建重复 label 的选项的缺陷 @uyarn ([#2221](https://github.com/Tencent/tdesign-react/pull/2221))
- `Skeleton`: 修复使用 `rowCol` 时额外多渲染一行 theme 的缺陷 @uyarn ([#2223](https://github.com/Tencent/tdesign-react/pull/2223))
- `Form`:
    - 修复异步渲染使用 `useWatch` 报错问题 @honkinglin ([#2220](https://github.com/Tencent/tdesign-react/pull/2220))
    - 修复 `FormList` 初始值赋值失效问题 @honkinglin ([#2222](https://github.com/Tencent/tdesign-react/pull/2222))

## 🌈 1.1.5 `2023-05-10` 
### 🚀 Features
- `Cascader`: 支持 `suffix`、`suffixIcon` @honkinglin ([#2200](https://github.com/Tencent/tdesign-react/pull/2200))

### 🐞 Bug Fixes
- `SelectInput`: 修复 `loading` 在 `disabled` 状态下隐藏问题  @honkinglin ([#2196](https://github.com/Tencent/tdesign-react/pull/2196))
- `Image`: 修复组件不支持 `ref` 的问题 @li-jia-nan ([#2198](https://github.com/Tencent/tdesign-react/pull/2198))
- `BackTop`: 支持 `ref` 透传 @li-jia-nan ([#2202](https://github.com/Tencent/tdesign-react/pull/2202))

## 🌈 1.1.4 `2023-04-27` 
### 🚀 Features
- `Select`: 支持 `panelTopContent` 在虚拟滚动等需要滚动下拉框场景的使用，具体使用方式请看示例 @uyarn ([#2184](https://github.com/Tencent/tdesign-react/pull/2184))

### 🐞 Bug Fixes
- `DatePicker`: 修复第二次点击面板关闭异常问题 @honkinglin ([#2183](https://github.com/Tencent/tdesign-react/pull/2183))
- `Table`: 修复 `useResizeObserver` ssr error @chaishi ([#2175](https://github.com/Tencent/tdesign-react/pull/2175))

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
    - 修复 `Radio` 禁用判断 @duanbaosheng ([#2161](https://github.com/Tencent/tdesign-react/pull/2161))
    - 修复 `value` 有默认值时受控问题 @moecasts ([#2152](https://github.com/Tencent/tdesign-react/pull/2152))
- `Icon`: 修复 manifest 统一入口导出 esm 模块，文档为及时更新的问题 @Layouwen ([#2160](https://github.com/Tencent/tdesign-react/pull/2160))

## 🌈 1.1.2 `2023-04-13` 
### 🚀 Features
- `DatePicker`: 优化周选择器高亮判断逻辑性能问题 @honkinglin ([#2136](https://github.com/Tencent/tdesign-react/pull/2136))
### 🐞 Bug Fixes
- `Dialog`: 
    - 修复设置 style width 不生效问题 @honkinglin ([#2132](https://github.com/Tencent/tdesign-react/pull/2132))
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
- `Tree`: 修复组件的 data 属性不受控问题 @PBK-B ([#2119](https://github.com/Tencent/tdesign-react/pull/2119))
- `Form`: 修复初始数据设置问题 @honkinglin ([#2124](https://github.com/Tencent/tdesign-react/pull/2124))
- `TreeSelect`: 修复过滤后无法展开问题 @honkinglin ([#2128](https://github.com/Tencent/tdesign-react/pull/2128))
- `Popup`: 修复右键展示浮层触发浏览器默认事件 @honkinglin ([#2120](https://github.com/Tencent/tdesign-react/pull/2120))

## 🌈 1.1.0 `2023-03-30` 
### 🚀 Features
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - 支持使用 `filterIcon` 支持不同列显示不同的筛选图标
    - 支持横向滚动到固定列
- `Button`: 支持禁用态不触发 href 跳转逻辑 @honkinglin ([#2095](https://github.com/Tencent/tdesign-react/pull/2095))
- `BackTop`: 新增 BackTop 组件  @meiqi502 ([#2037](https://github.com/Tencent/tdesign-react/pull/2037))
- `Form`: submit 支持返回数据 @honkinglin ([#2096](https://github.com/Tencent/tdesign-react/pull/2096))

### 🐞 Bug Fixes
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - 修复 SSR 环境中，document is not undefined 问题
    - 修复在列显示控制场景中，无法拖拽交换列顺序问题 
    - 单行选中功能，修复 `allowUncheck: false` 无效问题
- `Dialog`: 修复 Dialog onOpen 事件调用时机问题 @honkinglin ([#2090](https://github.com/Tencent/tdesign-react/pull/2090))
- `DatePicker`: 修复 `format` 为12小时制时功能异常的问题 @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Alert`: 修复关闭按钮为文字时的居中和字体大小问题 @Wen1kang  @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Watermark`: 修复 `Loading` 组合使用问题 @duanbaosheng ([#2094](https://github.com/Tencent/tdesign-react/pull/2094))
- `Notification`: 修复获取实例问题 @honkinglin ([#2103](https://github.com/Tencent/tdesign-react/pull/2103))
- `Radio`: 修复 ts 类型问题 @honkinglin ([#2102](https://github.com/Tencent/tdesign-react/pull/2102))


## 🌈 1.0.5 `2023-03-23` 
### 🚀 Features
- `TimePicker`: 新增 `size` API , 用于控制时间输入框大小 @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))

### 🐞 Bug Fixes
- `Form`: 修复 `FormList` 初始数据获取问题 @honkinglin ([#2067](https://github.com/Tencent/tdesign-react/pull/2067))
- `Watermark`: 修复 NextJS 中 document undefined 的问题 @carolin913 ([#2073](https://github.com/Tencent/tdesign-react/pull/2073))
- `ColorPicker`: @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
    - 修复 HEX 色值无法手动输入的问题
    - 修复最近使用颜色无法删除的问题
- `Dialog`: 修复`onCloseBtnClick`事件无效的问题 @ArthurYung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))
- `BreadCrumb`: 修复通过 options 属性无法配置 Icon 的问题 @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))


## 🌈 1.0.4 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 列宽调整功能，更新列宽调整规则为：列宽较小没有超出时，列宽调整表现为当前列和相邻列的变化；列宽超出存在横向滚动条时，列宽调整仅影响当前列和列总宽
    - 可编辑单元格(行)功能，支持编辑模式下，数据变化时实时校验，`col.edit.validateTrigger`
    - 只有固定列存在时，才会出现类名 `.t-table__content--scrollable-to-left` 和 `.t-table__content--scrollable-to-right`
    - 拖拽功能，支持禁用固定列不可拖拽调整顺序
- `Upload`: `theme=file-input` 文件为空时，悬浮时不显示清除按钮 @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `InputNumber`: 支持千分位粘贴 @uyarn ([#2058](https://github.com/Tencent/tdesign-react/pull/2058))
- `DatePicker`: 支持 `size` 属性 @honkinglin ([#2055](https://github.com/Tencent/tdesign-react/pull/2055))
### 🐞 Bug Fixes
- `Form`: 修复重置默认值数据类型错误 @honkinglin ([#2046](https://github.com/Tencent/tdesign-react/pull/2046))
- `TimelineItem`: 修复导出类型 @southorange0929 ([#2053](https://github.com/Tencent/tdesign-react/pull/2053))
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - 修复表格宽度抖动问题 
    - 列宽调整功能，修复 Dialog 中列宽调整问题
    - 可编辑单元格，修复下拉选择类组件 `abortEditOnEvent` 没有包含 `onChange` 时，依然会在数据变化时触发退出编辑态问题
- `Table`: 修复 lazy-load reset bug @MrWeilian ([#2041](https://github.com/Tencent/tdesign-react/pull/2041))
- `ColorPicker`: 修复输入框无法输入的问题 @insekkei ([#2061](https://github.com/Tencent/tdesign-react/pull/2061))
- `Affix`: 修复 fixed 判断问题 @lio-mengxiang ([#2048](https://github.com/Tencent/tdesign-react/pull/2048))

## 🌈 1.0.3 `2023-03-09` 
### 🚀 Features
- `Message`: 鼠标悬停时不自动关闭 @HelKyle ([#2036](https://github.com/Tencent/tdesign-react/pull/2036))
- `DatePicker`: 支持 `defaultTime` @honkinglin ([#2038](https://github.com/Tencent/tdesign-react/pull/2038))

### 🐞 Bug Fixes
- `DatePicker`: 修复月份为0时展示当前月份问题 @honkinglin ([#2032](https://github.com/Tencent/tdesign-react/pull/2032))
- `Upload`: 修复 `upload.method` 无效问题 @i-tengfei ([#2034](https://github.com/Tencent/tdesign-react/pull/2034))
- `Select`: 修复多选全选初始值为空时选中报错的问题 @uyarn ([#2042](https://github.com/Tencent/tdesign-react/pull/2042))
- `Dialog`: 修复弹窗垂直居中问题 @KMethod ([#2043](https://github.com/Tencent/tdesign-react/pull/2043))

## 🌈 1.0.2 `2023-03-01` 
### 🚀 Features
- `Image`: 图片组件支持特殊格式的地址 `.avif` 和 `.webp` @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `ConfigProvider`: 新增 `Image` 全局配置 `globalConfig.image.replaceImageSrc`，用于统一替换图片地址 @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `List`: `listItemMeta` 支持 `className`、`style` 属性 @honkinglin ([#2005](https://github.com/Tencent/tdesign-react/pull/2005))

### 🐞 Bug Fixes
- `Form`: @honkinglin ([#2014](https://github.com/Tencent/tdesign-react/pull/2014))
    - 修复校验信息沿用错误缓存问题
    - 移除 `FormItem` 多余事件通知逻辑
- `Drawer`: 修复拖拽后页面出现滚动条问题 @honkinglin ([#2012](https://github.com/Tencent/tdesign-react/pull/2012))
- `Input`: 修复异步渲染宽度计算问题 @honkinglin ([#2010](https://github.com/Tencent/tdesign-react/pull/2010))
- `Textarea`: 调整 limit 展示位置，修复与tips 共存时样式问题 @duanbaosheng ([#2015](https://github.com/Tencent/tdesign-react/pull/2015))
- `Checkbox`: 修复 ts 类型问题 @NWYLZW ([#2023](https://github.com/Tencent/tdesign-react/pull/2023))


## 🌈 1.0.1 `2023-02-21` 
### 🚀 Features
- `Popup`: 新增 `onScrollToBottom` 事件 @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Select`: @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
    - 支持虚拟滚动的使用
    - 支持`autofocus`、`suffix`，`suffixIcon`等API，`onSearch`新增回调参数
    - Option子组件支持自定义`title`API
- `Icon`:  加载时注入样式，避免在 next 环境中报错的问题 @uyarn ([#1990](https://github.com/Tencent/tdesign-react/pull/1990))
- `Avatar`: 组件内部图片，使用 Image 组件渲染，支持透传 `imageProps` 到 Image 图片组件 @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `DialogPlugin`: 支持自定义 `visbile` @moecasts ([#1998](https://github.com/Tencent/tdesign-react/pull/1998))
- `Tabs`: 支持拖拽能力 @duanbaosheng ([#1979](https://github.com/Tencent/tdesign-react/pull/1979))

### 🐞 Bug Fixes
- `Select`: 修复 `onInputchange`触发时机的问题 @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Radio`: 修复 `disabled` 默认值问题  @honkinglin ([#1977](https://github.com/Tencent/tdesign-react/pull/1977))
- `Table`: 确保可编辑单元格保持编辑状态 @moecasts ([#1988](https://github.com/Tencent/tdesign-react/pull/1988))
- `TagInput`: 修复 `0.45.4` 版本后 `TagInput` 增加 `blur` 行为导致 `Select` / `Cascader` / `TreeSelect` 无法过滤多选的问题 @uyarn ([#1989](https://github.com/Tencent/tdesign-react/pull/1989))
- `Avatar`: 修复图片无法显示问题 @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Image`: 修复事件类型问题 @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Tree`: 修复子节点被折叠后无法被搜索问题 @honkinglin ([#1999](https://github.com/Tencent/tdesign-react/pull/1999))
- `Popup`:  修复浮层显隐死循环问题 @honkinglin ([#1991](https://github.com/Tencent/tdesign-react/pull/1991))
- `FormList`:  修复 `onValuesChange` 获取不到最新数据问题 @honkinglin ([#1992](https://github.com/Tencent/tdesign-react/pull/1992))
- `Drawer`: 修复滚动条检测问题 @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))
- `Dialog`: 修复滚动条检测问题 @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))

## 🌈 1.0.0 `2023-02-13` 
### 🚀 Features
- `Dropdown`: submenu 层级结构调整，增加一层 `t-dropdown__submenu-wrapper` @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

### 🐞 Bug Fixes
- `Tree`: 修复使用 setItem 设置节点 expanded 时，不触发 `onExpand` 的问题 @genyuMPj ([#1956](https://github.com/Tencent/tdesign-react/pull/1956))
- `Dropdown`: 修复多层超长菜单的位置异常问题 @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

## 🌈 0.x `2021-03-26 - 2023-02-08`
前往 [GitHub](https://github.com/Tencent/tdesign-react/blob/develop/packages/tdesign-react/CHANGELOG-0.x.md) 查看 `0.x` 更新日志
