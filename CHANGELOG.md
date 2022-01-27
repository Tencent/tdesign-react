---
title: 更新日志
docClass: timeline
toc: false
spline: explain
---

## 0.24.1 `2022-01-27`

### Bug Fixes

* Form: 修复 `reset` 后首次更改值不触发校验 ([#317](https://github.com/Tencent/tdesign-react/issues/317)) ([796ed8c](https://github.com/Tencent/tdesign-react/commit/796ed8c3983e7fdbdae5189a611ba545b962e60b)) [@HQ-Lin](https://github.com/HQ-Lin)

## 0.24.0 `2022-01-27`

### ❗️ BREAKING CHANGES

* Tag: `variant` 属性调整，支持 `outline`、`light-outline`，废弃 `variant="plain"` ([780ac25](https://github.com/Tencent/tdesign-react/commit/780ac256824db9da3502b1440b837bca36ad61df)) [@carolin913](https://github.com/carolin913)
* Form: `reset` 不再触发 `onReset` 事件，使用独立的事件逻辑 ([#303](https://github.com/Tencent/tdesign-react/issues/303)) ([f9a7bbc](https://github.com/Tencent/tdesign-react/commit/f9a7bbc8219d1128f0641283c2508522e999119c)) [@HQ-Lin](https://github.com/HQ-Lin)

### 🐞 Bug Fixes

* Cascader:
  * 添加 `loadingtext` 国际化配置 ([46ef524](https://github.com/Tencent/tdesign-react/commit/46ef52443f2af26d23ad0f5946fff5b1d3db569c)) [@carolin913](https://github.com/carolin913)
  * `panel` 添加波纹动画 ([42ad5af](https://github.com/Tencent/tdesign-react/commit/42ad5af90a794e26a0763342c07f619f22f79895)) [@uyarn](https://github.com/uyarn)
* Tree: 修复按需引入样式丢失问题 ([#293](https://github.com/Tencent/tdesign-react/issues/293)) ([f50b888](https://github.com/Tencent/tdesign-react/commit/f50b8887cc539dddd63e92605ede3cb7ba2fd46c)) [@HQ-Lin](https://github.com/HQ-Lin)
* Chekbox: 修复 `Checkbox.Group` 的 `value` 类型为 `string` 和 `number` 的 bug ([1796843](https://github.com/Tencent/tdesign-react/commit/1796843c37e1e5594da9ca0091df01cde71c5923)) [@xinup](https://github.com/xinup)
* Popup: 修复 `zIndex` 设置错误 ([#315](https://github.com/Tencent/tdesign-react/issues/315)) ([aacb6f8](https://github.com/Tencent/tdesign-react/commit/aacb6f81f10d65cfbe09f3e752e62185faeddff9)) [@HQ-Lin](https://github.com/HQ-Lin)
* Select: 修复 `Option.name` 丢失导致组件类型判断失效问题 ([fea73f0](https://github.com/Tencent/tdesign-react/commit/fea73f0afe93ea24948d1d686e20b03da3be7abb)) [@uyarn](https://github.com/uyarn)
* Table: 修复固定列不指定 `colKey` 导致 `header` 错位问题 ([03d3936](https://github.com/Tencent/tdesign-react/commit/03d3936c77e3af682169a2c318f2bcd886892641)) [@yunfeic](https://github.com/yunfeic)


### 🌈 Features

* Table:
  * 支持树形显示 ([213a7f2](https://github.com/Tencent/tdesign-react/commit/213a7f206bb75e59a76e061f862f61335fb9551a)) [@yunfeic](https://github.com/yunfeic)
  * 支持树形行选中 ([1be5c77](https://github.com/Tencent/tdesign-react/commit/1be5c77469cdc09dc671d861cfa35e4a5f8debe2)) [@yunfeic](https://github.com/yunfeic)
  * 支持国际化配置提取 ([9080b91](https://github.com/Tencent/tdesign-react/commit/9080b91bd4c912d93dbef2557f824cce2e838167)) [@carolin913](https://github.com/carolin913)
* Form:
  * 支持 `getFieldsValue`、`getAllFieldsValue` 添加废弃提示 ([#307](https://github.com/Tencent/tdesign-react/issues/307)) ([abfbbd6](https://github.com/Tencent/tdesign-react/commit/abfbbd68ee02e1de221e5511b727b67489ec2b30)) [@HQ-Lin](https://github.com/HQ-Lin)
  * 支持 `disabled`、`clearValidate` api & 修复 `reset` 校验问题 & `reset` 支持指定 FormItem ([#303](https://github.com/Tencent/tdesign-react/issues/303)) ([f9a7bbc](https://github.com/Tencent/tdesign-react/commit/f9a7bbc8219d1128f0641283c2508522e999119c)) [@HQ-Lin](https://github.com/HQ-Lin)
* Config: 调整 `locale`、组件配置逻辑 & 支持 `globalConfig` API ([#297](https://github.com/Tencent/tdesign-react/issues/297)) ([542c254](https://github.com/Tencent/tdesign-react/commit/542c254b2529851ff42547966ff4609d49251b62)) [@HQ-Lin](https://github.com/HQ-Lin)
* Select: `ul` 标签添加 `class` 类名 ([bb47a94](https://github.com/Tencent/tdesign-react/commit/bb47a9487473e5a817c76a7df82009f66e1dc5f6)) [@HQ-Lin](https://github.com/HQ-Lin)
* Breadcrumb: 支持 `theme` api ([5627c40](https://github.com/Tencent/tdesign-react/commit/5627c40ec2485435cae60e544c0087ada53c351d)) [@samhou1988](https://github.com/samhou1988)
* Drawer: 修复 `attch` 无效问题 ([a16c031](https://github.com/Tencent/tdesign-react/commit/a16c0314cc98dc8ea6eb1ba2b5c2435674785d60)) [@LittlehorseXie](https://github.com/LittlehorseXie)
* Input: 支持 `align` 属性 ([#290](https://github.com/Tencent/tdesign-react/issues/290)) ([08ce2b5](https://github.com/Tencent/tdesign-react/commit/08ce2b5ce2b35f3878fea22532d1530cc6cbe0b3)) [@HQ-Lin](https://github.com/HQ-Lin)
* Dropdown: 修复 `ref` 警告 ([d56b4ba](https://github.com/Tencent/tdesign-react/commit/d56b4ba100515f54bad09c748ac855d194b70bc7)) [@carolin913](https://github.com/carolin913)
* Tag: 支持 `size` API ([780ac25](https://github.com/Tencent/tdesign-react/commit/780ac256824db9da3502b1440b837bca36ad61df)) [@carolin913](https://github.com/carolin913)
* Transfer: 支持 `Tree` API ([f260a3a](https://github.com/Tencent/tdesign-react/commit/f260a3af91468b10565df269abd1a7604f2334d4)) [@zj2015262624](https://github.com/zj2015262624)
* Locale: `upload`, `tree` 组件支持 国际化配置 ([34ba53e](https://github.com/Tencent/tdesign-react/commit/34ba53eae221ad860df3baa2352b6d2da9637ac9)) [@carolin913](https://github.com/carolin913)


## 0.23.1 `2022-01-21`


### Bug Fixes

* Form:
  * 修复 `getFieldValue` api 取值失效 bug ([9ee8921](https://github.com/Tencent/tdesign-react/commit/9ee892127712c2c345140c3bbbd0e22c24aae5c9)) [@yume316](https://github.com/yume316)
  * 优化 `form` 校验失败滚动问题 ([#278](https://github.com/Tencent/tdesign-react/issues/278)) ([4870d28](https://github.com/Tencent/tdesign-react/commit/4870d28bea47604ab8f4cbdc8c506c75f12bfb5f)) [@HQ-Lin](https://github.com/HQ-Lin)
* Affix: 修复 `zIndex` 参数无效和 `offsetTop` 为 0 无法固定的问题 ([ebeb69c](https://github.com/Tencent/tdesign-react/commit/ebeb69c8d471baa9fd723523e1d52c25fef840e4)) [@jas0ncn](https://github.com/jas0ncn)
* Tabs: 修复滚动问题，支持受控/非受控 ([84f033c](https://github.com/Tencent/tdesign-react/commit/84f033c82a7d7f73ecb4b7be5363e15f9f874f99)) [@insekkei](https://github.com/insekkei)
* Dialog: 修复 `mask` 动画缺失问题 ([#247](https://github.com/Tencent/tdesign-react/issues/247)) ([37d59c1](https://github.com/Tencent/tdesign-react/commit/37d59c1e0ca4d9aeae5a608e9bec7ae74c8bf2fb)), closes [#65](https://github.com/Tencent/tdesign-react/issues/65) [@HQ-Lin](https://github.com/HQ-Lin)
* Icon: `size` 类名 `t-size-middle` 改为 `t-size-medium` ([aea3f01](https://github.com/Tencent/tdesign-react/commit/aea3f01e98d257a2ff02c1380deea640b61a7677)) [@uyarn](https://github.com/uyarn)
* Popup: 优化 `destroy` 动画 & 添加 `display: none` & 优化全局 `portal` 逻辑 ([#246](https://github.com/Tencent/tdesign-react/issues/246)) ([391de56](https://github.com/Tencent/tdesign-react/commit/391de565fb99fbe2c3af50da70351a980e10d656)), closes [#231](https://github.com/Tencent/tdesign-react/issues/231) [@HQ-Lin](https://github.com/HQ-Lin)


### Features

* Form:
  * 更新校验逻辑 ([#257](https://github.com/Tencent/tdesign-react/issues/257)) ([6f0ab86](https://github.com/Tencent/tdesign-react/commit/6f0ab864fa72d449b32dd0d7a76fc6e0ab4fed6c)) [@HQ-Lin](https://github.com/HQ-Lin)
  * `formItem` 支持 `requireMark` ([#252](https://github.com/Tencent/tdesign-react/issues/252)) ([12bc822](https://github.com/Tencent/tdesign-react/commit/12bc822b98b0c282d83c39e5e81251d1d6efef2b)) [@HQ-Lin](https://github.com/HQ-Lin)
* Select:
  * 支持删除键删除 tag ([#241](https://github.com/Tencent/tdesign-react/issues/241)) ([01cde96](https://github.com/Tencent/tdesign-react/commit/01cde9607891b516e86e1b5b065c7364b5c7da86)), closes [#206](https://github.com/Tencent/tdesign-react/issues/206) [@zhangbocodes](https://github.com/zhangbocodes)
  * 支持 `panelBottomContent`、`panelTopContent`、`showArrow`、`inputProps` api ([c126604](https://github.com/Tencent/tdesign-react/commit/c12660413d7c1fbba7b872352c947bd8b2388cdf)) [@uyarn](https://github.com/uyarn)
* Table:
  * 多级表头支持排序 ([7315333](https://github.com/Tencent/tdesign-react/commit/731533398c9ee08e28efcd194fabb30516a31811)) [@yunfeic](https://github.com/yunfeic)
  * 支持行拖拽排序 ([9a004c6](https://github.com/Tencent/tdesign-react/commit/9a004c6a2b88a1fdd784b60b05d212f522b343eb)) [@yunfeic](https://github.com/yunfeic)
* Dropdown: dropdown options 支持child方式传入 ([#242](https://github.com/Tencent/tdesign-react/issues/242)) ([0cbfd67](https://github.com/Tencent/tdesign-react/commit/0cbfd6792a517cb2270e0b8e34d992ed45815a4c)) [@duenyang](https://github.com/duenyang)
* Popup: 支持 `onScroll` API ([fc8d613](https://github.com/Tencent/tdesign-react/commit/fc8d613bf202af0043758e21da2fe17345572af2)) [@uyarn](https://github.com/uyarn)
* Skeleton: 新增骨架屏 ([#265](https://github.com/Tencent/tdesign-react/issues/265)) ([fd8d980](https://github.com/Tencent/tdesign-react/commit/fd8d98043e9851cafe08bb12a6137031b1de8942)) [@Yilun-Sun](https://github.com/Yilun-Sun)
* Textarea: 新增 `tips` 和 `status` api ([#266](https://github.com/Tencent/tdesign-react/issues/266)) ([9cc5b72](https://github.com/Tencent/tdesign-react/commit/9cc5b728805ba942ccce6c0ee21fbf0792a7884e)) [@duenyang](https://github.com/duenyang)
* Tooltip: 支持 `duration` api ([b28b200](https://github.com/Tencent/tdesign-react/commit/b28b200fa04293bf68c3d25fa9bbefdfb8957a63)) [@carolin913](https://github.com/carolin913)
* Upload: 支持 `onPreview` api ([a004227](https://github.com/Tencent/tdesign-react/commit/a004227ddb42dba3793b4d168297e0bb5b0c8a9e)) [@teal-front](https://github.com/teal-front)




## 0.23.0 `2022-01-13`

### BREAKING CHANGES

* 调整 ref 获取 Input 组件最外层 Dom 方式为 `inputRef.current.currentElement` ([7fd11cb](https://github.com/Tencent/tdesign-react/commit/7fd11cbe7320442f40c50d797cfed1d351ab6288)) [@HQ-Lin](https://github.com/HQ-Lin)
* 调整 ref 获取 Form 组件最外层 Dom 方式为 `formRef.current.currentElement` ([46abe0b](https://github.com/Tencent/tdesign-react/commit/46abe0b73db3dbd6a5ac4805a670c97b348795ad)) [@HQ-Lin](https://github.com/HQ-Lin)

### Bug Fixes

* Popup: 修复定位动态计算错误问题 ([#226](https://github.com/Tencent/tdesign-react/issues/226)) ([6c54abf](https://github.com/Tencent/tdesign-react/commit/6c54abf076cd7897c5ee4846bb037bf64dc8f0a0)) [@HQ-Lin](https://github.com/HQ-Lin) [@uyarn](https://github.com/uyarn)
* Drawer: 修复字符串控制 confirmBtn 无效问题 ([#216](https://github.com/Tencent/tdesign-react/pull/216)) [@samhou1988](https://github.com/samhou1988)
* Form: 修复 `FormItem` 动态变化导致 `formItemsRef` 中存在 `null` 值 bug ([eaa4f70](https://github.com/Tencent/tdesign-react/commit/eaa4f70024e9e9ccd6f268b981683ad882bee3ce)) [@yume316](https://github.com/yume316)
* TimePicker: 限制输入框内容为数字类型 ([e90118c](https://github.com/Tencent/tdesign-react/commit/e90118cbe78872b36bb454d4e3a3cfaae931c98c)) [@uyarn](https://github.com/uyarn)


### Features

* Divider: 实现 `content` api ([0d59f66](https://github.com/Tencent/tdesign-react/commit/0d59f6693c898f21df18cec0cdd3c01174c2f5c8)) [@haishancai](https://github.com/haishancai)
* Form: 优化 `ref` 逻辑 ([#233](https://github.com/Tencent/tdesign-react/issues/233)) ([46abe0b](https://github.com/Tencent/tdesign-react/commit/46abe0b73db3dbd6a5ac4805a670c97b348795ad)) [@HQ-Lin](https://github.com/HQ-Lin)
* Upload: 实现 `sizelimit` api ([e576778](https://github.com/Tencent/tdesign-react/commit/e57677880ebecfafdde168575b9cb3473384ef4a)) [@teal-front](https://github.com/teal-front)
* Table: 支持传入 `className`, `style` ([dd27277](https://github.com/Tencent/tdesign-react/commit/dd27277314dfcaefea924fc702ba7bfc0c2760d5)) [@yunfeic](https://github.com/yunfeic)
* Input: 支持 tips api & 调整ref 获取 Input Dom 方式，暴露 focus、blur、select 方法 & 支持获取内部 input 实例 (#229) ([7fd11cb](https://github.com/Tencent/tdesign-react/commit/7fd11cbe7320442f40c50d797cfed1d351ab6288)), closes [#229](https://github.com/Tencent/tdesign-react/issues/229) [#201](https://github.com/Tencent/tdesign-react/issues/201) [@HQ-Lin](https://github.com/HQ-Lin) [@Duncan-zjp](https://github.com/Duncan-zjp) 


## 0.22.1 `2022-01-07`

### Bug Fixes

* Form: 修复 `setFields` 及 `setFieldsValue` 失效bug ([b8b67d0](https://github.com/Tencent/tdesign-react/commit/b8b67d049604498804e2fed4b76b3c591a1720bd)) [@yume316](https://github.com/yume316)

## 0.22.0 `2022-01-06`

### BREAKING CHANGES

* 重命名 `Layout.Sider` 组件为 `Layout.Aside` ([f78d7f5](https://github.com/Tencent/tdesign-react/commit/f78d7f5f802ba788c9e904fed98932804fd5d1ab)) [@HQ-Lin](https://github.com/HQ-Lin)
* 改动 `AvatarGroup` 使用方式为 `Avatar.Group` ([#100](https://github.com/Tencent/tdesign-react/issues/100)) ([b2f09eb](https://github.com/Tencent/tdesign-react/commit/b2f09ebb55e8716610e6ef9c5c8b9f8f561bf9d8)) [@HQ-Lin](https://github.com/HQ-Lin)

### Bug Fixes

* Tabs: 修复多层 `menu` 父菜单切换后子菜单定位失败的问题 ([81ddd05](https://github.com/Tencent/tdesign-react/pull/185/commits/81ddd057de7116bc4219d89664b279e8e03bd6c0), closes [#161](https://github.com/Tencent/tdesign-react/issues/161)) [@insekkei](https://github.com/insekkei)
* Breadcrumb: 修复非 `options` `模式下，maxItemWidth` 没有传给子组件 `BreadcrumbItem` 问题 ([#111](https://github.com/Tencent/tdesign-react/issues/111)) ([1e53110](https://github.com/Tencent/tdesign-react/commit/1e5311077555c97c592c64034dd589ef07c979a2)), closes [#107](https://github.com/Tencent/tdesign-react/issues/107) [@Yilun-Sun](https://github.com/Yilun-Sun)
* Progress: 修复环形进度条半径计算问题 ([e3eae82](https://github.com/Tencent/tdesign-react/commit/e3eae8206f25c013ec5ea9dafb48f152cb3e757c)) [@Yilun-Sun](https://github.com/Yilun-Sun)
* DatePicker
  * 兼容初始值为非日期 ([9d8f6f7](https://github.com/Tencent/tdesign-react/commit/9d8f6f7f08a6dd1e06f983fef19f346b60e23bc5)) [@vision-yip](https://github.com/vision-yip)
  * 修复受控问题 ([#180](https://github.com/Tencent/tdesign-react/issues/180)) ([dace63d](https://github.com/Tencent/tdesign-react/commit/dace63d3ef96a8cbdad1566079478d27b0c14176)) [@HQ-Lin](https://github.com/HQ-Lin)
* Select
  * 修复 `disabled` 属性无效 ([#85](https://github.com/Tencent/tdesign-react/issues/85)) ([cc3418a](https://github.com/Tencent/tdesign-react/commit/cc3418a19d4d52ef6dd6a9ca858a5890265a2a31)) [@yaogengzhu](https://github.com/yaogengzhu)
  * 修复点选问题 ([#63](https://github.com/Tencent/tdesign-react/issues/63)) ([d126f34](https://github.com/Tencent/tdesign-react/commit/d126f34d0477544ee471c77f3e8f9178f7a3f418)) [@yaogengzhu](https://github.com/yaogengzhu)
  * 修复当添加 `select` 组件添加 `clearable` 以及 `filterable` 时, 第二次以后点击清除按钮的显示值不对 ([#61](https://github.com/Tencent/tdesign-react/issues/61)) ([d9fe70b](https://github.com/Tencent/tdesign-react/commit/d9fe70bcfdf62fb88d5e396dbd08527e14c04b17)) [@vision-yip](https://github.com/vision-yip)
  * 修复远程搜索多选时所选值展示不全问题 ([#139](https://github.com/Tencent/tdesign-react/issues/139)) ([0a26aa6](https://github.com/Tencent/tdesign-react/commit/0a26aa698a2eb25988af4448af16b949f612c840)) [@yume316](https://github.com/yume316)
* Popup
  * 修复定位问题 ([7e91720](https://github.com/Tencent/tdesign-react/commit/7e9172044204dc54ae83dbd24f32d3d506a20a82)) [@andyjxli](https://github.com/andyjxli)
  * 修复 `scrollHeight` 计算问题 ([837112b](https://github.com/Tencent/tdesign-react/commit/837112bc87571b24cfb0f6d75ca14b18a7f6cba7)) [@uyarn](https://github.com/uyarn)
  * 修复动态高度计算问题 ([a6acaff](https://github.com/Tencent/tdesign-react/commit/a6acaff7e6b9e1a7d76d2f9af291c733bb1a2b4c)) [@uyarn](https://github.com/uyarn)
  * 修复 `hover` 触发展示位置判断错误问题 ([#75](https://github.com/Tencent/tdesign-react/issues/75)) ([3145376](https://github.com/Tencent/tdesign-react/commit/31453762e6e0445d8943e981b4cb5b326d0f4131)) [@southorange1228](https://github.com/southorange1228)
* Input: 添加 `Input` `focus` 状态样式 ([01c40cf](https://github.com/Tencent/tdesign-react/commit/01c40cf735714d6dadd47db439d2f53709d6a096)) [@uyarn](https://github.com/uyarn)
* Pagination: 修复更多按钮闪烁问题 ([301beff](https://github.com/Tencent/tdesign-react/commit/301beffc18003f1e471cd8422817ac11880c4095)) [@andyjxli](https://github.com/andyjxli)
* Slider: 修复 `vertical` 样式问题 ([#66](https://github.com/Tencent/tdesign-react/issues/66)) ([5fc7808](https://github.com/Tencent/tdesign-react/commit/5fc78087e33206aabc2c8753331d6930d54e24fe)) [@southorange1228](https://github.com/southorange1228)
* Table: 修复固定表头不滚动时单元格右边线不对齐 ([bdda8d4](https://github.com/Tencent/tdesign-react/commit/bdda8d4c4f7c4f58a55660578c2766be802969ac)) [@yunfeic](https://github.com/yunfeic)
* TimePicker: 修复 `confirm` 事件无效 ([#79](https://github.com/Tencent/tdesign-react/issues/79)) ([45bca64](https://github.com/Tencent/tdesign-react/commit/45bca64118a8537617aea4a267931bacb8e95bf9)) [@yaogengzhu](https://github.com/yaogengzhu)
* Tooltip: 添加 `theme` 类型校验 ([dd05af6](https://github.com/Tencent/tdesign-react/commit/dd05af6d284a86aa2f5c365c8c0a93ad0f76bf69)) [@Yilun-Sun](https://github.com/Yilun-Sun)
* TreeSelect: 样式名 `bem` 规范 ([#135](https://github.com/Tencent/tdesign-react/issues/135)) ([28165b3](https://github.com/Tencent/tdesign-react/commit/28165b39460dcb2703db4faf3ee377056db4263c)) [@HQ-Lin](https://github.com/HQ-Lin)

### Features

* Tree: 支持 `disableCheck` API ([#129](https://github.com/Tencent/tdesign-react/issues/129)) ([6e137f5](https://github.com/Tencent/tdesign-react/commit/6e137f5f12c6655ff77c0d24e6d848479db5e389)), closes [#97](https://github.com/Tencent/tdesign-react/issues/97) [@Ruoleery](https://github.com/Ruoleery)
* Button: 实现 `content` API & 完善单测 ([9c25ca5](https://github.com/Tencent/tdesign-react/commit/9c25ca5f3a114f3a344532440528adcaf0156d50)) [@haishancai](https://github.com/haishancai)
* Calendar: 支持 `onMonthChange` API ([#116](https://github.com/Tencent/tdesign-react/issues/116)) ([c44b5a3](https://github.com/Tencent/tdesign-react/commit/c44b5a3a901bc9d77358f05657185633b436307d)) [@pengYYYYY](https://github.com/pengYYYYY)
* Cascader: 优化内部 `Input` 宽度设置为 100% ([62c3c7d](https://github.com/Tencent/tdesign-react/commit/62c3c7dd3413d9347a0bb3f3ce6c1d8f60c847b4)) [@pengYYYYY](https://github.com/pengYYYYY)
* Form: 优化 `form` 获取 `formItem` 实例逻辑 & 支持 `FormItem` 组件可被标签嵌套 ([#188](https://github.com/Tencent/tdesign-react/issues/188)) ([bb123a1](https://github.com/Tencent/tdesign-react/commit/bb123a1b0468e9283228d1ba02ed6691111cbabe)) [@HQ-Lin](https://github.com/HQ-Lin)
* Form: 新增 `onValuesChange` 事件 ([#121](https://github.com/Tencent/tdesign-react/issues/121)) ([1b2b349](https://github.com/Tencent/tdesign-react/commit/1b2b349eab5d46c25b3a45dc1cf080dcf5b5ba50)) [@HQ-Lin](https://github.com/HQ-Lin)
* Layout: 支持 `direction` api ([8448581](https://github.com/Tencent/tdesign-react/commit/84485811f5f7f99188fe8c9661a74570004c7571)) [@HQ-Lin](https://github.com/HQ-Lin)
* Pagination: 调整 `Input` 为 `InputNumber` 组件 ([#77](https://github.com/Tencent/tdesign-react/issues/77)) ([0bee39f](https://github.com/Tencent/tdesign-react/commit/0bee39f14ade40627a2746739fffc91dc04caf71)) [@HQ-Lin](https://github.com/HQ-Lin)
* Upload: 同步最新 API 改动 ([b8c864b](https://github.com/Tencent/tdesign-react/pull/159/commits/b8c864b502d8d91f192902a6189eb70186e9b8da)) [@wookaoer](https://github.com/wookaoer)


## 0.21.0 `2021-12-23`


### BREAKING CHANGES

* `Select`、`Transfer`、`Steps` 组件CSS命名规范处理，如果有通过类名进行样式覆盖，请务必参考该列表 [组件类名调整列表](https://github.com/Tencent/tdesign-react/issues/54)

### Bug Fixes

* 去除engine限制 ([68371fb](https://github.com/Tencent/tdesign-react/commit/68371fbe02142e15a73bba7734392c1ec105eb67)) [@HQ-Lin](https://github.com/HQ-Lin)


## 0.20.2 `2021-12-22`

### BREAKING CHANGES

* 大量组件进行CSS命名规范处理，如果有通过类名进行样式覆盖，请务必参考该列表 [组件类名调整列表](https://github.com/Tencent/tdesign-react/issues/54)
* Message: 支持 `MessagePlugin`, `message.info` 调用方式，废弃 `Messzge.info` 调用([5d3dc04](https://github.com/Tencent/tdesign-react/commit/5d3dc0463bf66489dfe4d5c79902fe707ae32e48)) [@kenzyyang](https://github.com/kenzyyang)
* Notification: 组件插件化使用方式破坏性修改，支持 `NotificationPlugin`,`notification` 调用 ([98c3d0a](https://github.com/Tencent/tdesign-react/commit/98c3d0af845354c969ff01feb35ec2ab3a46b091)) [@kenzyyang](https://github.com/kenzyyang)

### Bug Fixes

* Form: 修复 status 重置失效的问题 ([#45](https://github.com/Tencent/tdesign-react/issues/45)) ([8114ac9](https://github.com/Tencent/tdesign-react/commit/8114ac9baf32846966f249c132444afeae7c330a)) [@HQ-Lin](https://github.com/HQ-Lin)
* Select: 修复多选状态下onVisibleChange多次触发的问题 ([4eacffc](https://github.com/Tencent/tdesign-react/commit/4eacffc5aa15175ce17805ab04d030192bffc588)) [@uyarn](https://github.com/uyarn)
* Select: 支持0作为value ([c716e92](https://github.com/Tencent/tdesign-react/commit/c716e92c5de4e08b665b2d14116223385468c90a)) [@uyarn](https://github.com/uyarn)
* Table: 修复合并单元格中 `borderLeft` 不显示的问题([69da5ee](https://github.com/Tencent/tdesign-react/commit/69da5ee9088ea43d4f77fc82126a4863b8b40349)) [@yunfeic](https://github.com/yunfeic)
* Table: 固定头列滚动阴影不显示([d057839](https://github.com/Tencent/tdesign-react/commit/d05783987f80ce607cb73be2cee3602376975719)) [@yunfeic](https://github.com/yunfeic)
* Table: 修复固定列 react16 滚动报错引起固定头列滚动失效([9af655c](https://github.com/Tencent/tdesign-react/commit/9af655c62a7df4d14225b176ecb12860ec8ca800)) [@yunfeic](https://github.com/yunfeic)
* Upload: 修复showUploadProgress为false不生效的问题([eae4771](https://github.com/Tencent/tdesign-react/commit/eae47716bca4d57e85f268f5b63fd9f0664432d3)) [@wookaoer](https://github.com/wookaoer)
* DatePicker: 修复年份禁用判断错误 ([5654da4](https://github.com/Tencent/tdesign-react/commit/5654da4d70405d71d555329153c6427abd614cc3)) [@HQ-Lin](https://github.com/HQ-Lin)

### Features

* Avatar: 新增 Avatar 组件 ([018eea1](https://github.com/Tencent/tdesign-react/commit/018eea1234a6e73ab257f12758e8bef015a097b6)) [@zj2015262624](https://github.com/zj2015262624)
* Popup: 添加下拉动画 ([4c475fc](https://github.com/Tencent/tdesign-react/commit/4c475fcdcf39a5721d334cf340f8e50ae3326cbf)) [@andyjxli](https://github.com/andyjxli)
* Table: 合并行展开点击和onRowClick事件 ([b2d1578](https://github.com/Tencent/tdesign-react/commit/b2d1578fb50cdaf75804cc2e46fcc4847267d3e0)) [@yunfeic](https://github.com/yunfeic)
* Table: 支持行点击和鼠标事件 ([d42e9a9](https://github.com/Tencent/tdesign-react/commit/d42e9aa7501d6fc326aae33c84c6395da33792e5)) [@yunfeic](https://github.com/yunfeic)
* Upload: support customize request method ([5bc70be](https://github.com/Tencent/tdesign-react/commit/5bc70be02d2efaf1b724fdc530d03900fa886d8d)) [@teal-front](https://github.com/teal-front)
* Upload: support multiple files & images upload ([7154072](https://github.com/Tencent/tdesign-react/commit/7154072111f3b6a7044c7da5df126508643a2ab4)) [@teal-front](https://github.com/teal-front)


## 0.19.1 `2021-12-08`


### Bug Fixes

* 修复 Notification 引用路径报错 [@HQ-Lin](https://github.com/HQ-Lin)


## 0.19.0 `2021-12-08`

### BREAKING CHANGES
* Notification: 插件化使用方式调整，支持  `NotificationPlugin`,`notification` 的调用，废弃 `Notification.info` [@kenzyyang](https://github.com/kenzyyang)

### Bug Fixes

* Alert: icon and text vertical center [@uyarn](https://github.com/uyarn)
* Message: 修复组件自动关闭时控制态的异常和 `onDurationEnd` 事件执行两次的 bug [@kenzyyang](https://github.com/kenzyyang)
* Table: 消除空数据时底部两条横线 [@yunfeic](https://github.com/yunfeic)
* Table: 修复固定列 react16 滚动报错引起固定头列滚动失效 [@yunfeic](https://github.com/yunfeic)
* Table: 修复 header align 设置无效，react16 下固定列滚动报错 [@yunfeic](https://github.com/yunfeic)
* Textarea: 组件临时解决原生属性 rows 设置后不可用的问题。[@kenzyyang](https://github.com/kenzyyang)
* Upload: 修复name属性不生效问题 [@wookaoer](https://github.com/wookaoer)


### Features

* Transfer: 新增 Transfer 组件
* Dialog: 支持 `DialogPlugin` 调用方式 [@HQ-Lin](https://github.com/HQ-Lin)
* Doc: 优化文档内容 [@HQ-Lin](https://github.com/HQ-Lin)

## 0.18.2 `2021-11-29`


### Bug Fixes

* Treeselect: 修复 tag 关闭按钮渲染不同步问题 & 同步最新 api 改动 (merge request !403)  [@HQ-Lin](https://github.com/HQ-Lin)
* Select: 修复多选模式 disable 禁用选中项反选问题  [@uyarn](https://github.com/uyarn)


### Features

* Checkbox: 支持 `options`、`checkAll` Api  [@kenzyyang](https://github.com/kenzyyang)
* Select: 新增 `valueDisplay`、`minCollapsedNum`、`collapsedItems`、`onEnter`, `onVisibleChange` 等API, `Select.Group` 新增 `divider` API  [@uyarn](https://github.com/uyarn)

## 0.18.1 `2021-11-22`

### Features

* TS: 导出所有组件 TS 类型 [@HQ-Lin](https://github.com/HQ-Lin)

## 0.18.0 `2021-11-19`

### BREAKING CHANGES
* Grid: 优化 gutter 逻辑，传入 number 类型不指定纵向间隔 (merge request !395) [@HQ-Lin](https://github.com/HQ-Lin)

### Bug Fixes

* Popup: 修复 popup 动画移除仍可交互问题 (merge request !396) [@HQ-Lin](https://github.com/HQ-Lin)


## 0.17.1 `2021-11-16`

### Bug Fixes

* Slider: 第一次鼠标移入控制按钮的时候，`Tooltip` 位置是不正确的 (merge request !393)  [@andyjxli](https://github.com/andyjxli) [@vision-yip](https://github.com/vision-yip)

## 0.17.0 `2021-11-15`

### BREAKING CHANGES
* Icon: 💥 移除 `@tencent` 前缀、切换 `tdesign-icons-react` 为 npm 包。(React 已发布至 npm 源并移除 `@tencent` 前缀，使用者升级版本时注意更改 `package.json`!)  [@HQ-Lin](https://github.com/HQ-Lin)

## 0.16.1 `2021-11-12`


### Bug Fixes

* Tree: 组件展开与收起状态默认图标  [@Ruoleery](https://github.com/Ruoleery)
* Datepicker: 国际化问题 (merge request !380)  [@HQ-Lin](https://github.com/HQ-Lin)
* Select: multiple下使用直接使用Option的问题 [@uyarn](https://github.com/uyarn)
* Table: 固定列无滚动效果  [@yunfeic](https://github.com/yunfeic)
* Tree: 组件动画失效  [@Ruoleery](https://github.com/Ruoleery)


### Features

* Select: 支持使用 option 的 children 作为 label 来直接渲染 label [@uyarn](https://github.com/uyarn)
* Popup: 调整 popup arrow 为css 定位 (merge request !387)  [@HQ-Lin](https://github.com/HQ-Lin)
* Datepicker: 优化 Datepicker footer 样式 (merge request !378)  [@xiaosansiji](https://github.com/xiaosansiji)

## 0.16.0 `2021-11-05`

### BREAKING CHANGES

* Button: 组件默认 type 调整为 button  [@hjkcai](https://github.com/hjkcai)
* Grid: 优化 gutter 逻辑，调整为 rowGap 控制上下间距 (merge request !373)  [@HQ-Lin](https://github.com/HQ-Lin)
* Table: 替换展开老api showExpandArrow 为 expandIcon  [@yunfeic](https://github.com/yunfeic)


## 0.15.2 `2021-10-30`

### Bug Fixes

* Cascader: 重构 Cascader & 修复受控失效问题  [@pengYYYYY](https://github.com/pengYYYYY)

### Features

* Form: 优化formItem 提示文案展示效果 (merge request !368)  [@HQ-Lin](https://github.com/HQ-Lin)
* Locale: 支持国际化配置  [@HQ-Lin](https://github.com/HQ-Lin) [@kenzyyang](https://github.com/kenzyyang)


## 0.15.1 `2021-10-27`


### Bug Fixes

* InputNumber: 修复 InputNumber descrease button 样式问题 (merge request !367)  [@HQ-Lin](https://github.com/HQ-Lin)


## 0.15.0 `2021-10-22`

### BREAKING CHANGES
* Button: 新增 rectangle shape类型 & 废弃 icon-only 样式 (merge request !360)  [@HQ-Lin](https://github.com/HQ-Lin)
* Icon: 独立为 npm 包 @tencent/tdesign-icons-react，项目中有直接使用Icon请升级后安装此npm包； 新增CaretLeftSmallIcon等23个Icon，移除ResourceListIcon  [@uyarn](https://github.com/uyarn) [@ivenszhang](https://github.com/ivenszhang)

### Bug Fixes

* TreeSelect: 按需引入样式丢失问题 [@HQ-Lin](https://github.com/HQ-Lin)
* Select: 分组选择器构建后渲染异常  [@uyarn](https://github.com/uyarn)
* Table: 分页受控失效  [@tengcaifeng](https://github.com/tengcaifeng) 


### Features

* Comment: 新增 Comment 组件[@dreamsqin](https://github.com/dreamsqin)
* Upload: Upload 支持受控能力 [@wookaoer](https://github.com/wookaoer)
* Form: 优化 Form 自定义校验功能 (merge request !358)  [@HQ-Lin](https://github.com/HQ-Lin)
* Form: FormItem 支持 upload 类型  [@HQ-Lin](https://github.com/HQ-Lin)
* Menu: Menu 支持多层级 (merge request !344)  [@andyjxli](https://github.com/andyjxli) 

## 0.14.4 `2021-10-14`


### Bug Fixes

* Tree: cssTransition 警告  [@Ruoleery](https://github.com/Ruoleery)
* Table: 页码变化未触发 onPageChage  [@yunfeic](https://github.com/yunfeic)
* Pagination: current 和 pageSize 受控与非受控问题  [@uyarn](https://github.com/uyarn)

### Features

* TreeSelect: 新增 TreeSelect 组件  [@HQ-Lin](https://github.com/HQ-Lin)
* Tree: 组件支持受控能力  [@Ruoleery](https://github.com/Ruoleery)
* Dialog: 优化弹出动画、避免弹出时页面滚动条禁用导致页面跳动  [@psaren](https://github.com/psaren)

## 0.14.3 `2021-10-09`


### Bug Fixes

* Datepicker: 修复 传入 className style 无效问题  [@HQ-Lin](https://github.com/HQ-Lin)
* Inputnumber: 修复 单独引用导致 input 样式丢失问题 [@HQ-Lin](https://github.com/HQ-Lin)
* Dropdown: 修复 ripple animation lost  [@uyarn](https://github.com/uyarn)
* Swiper: 修复 最后一项跳转第一项过程中动画延迟问题  [@skytt](https://github.com/skytt)
* Tree: 修复 regeneratorRuntime error  [@HQ-Lin](https://github.com/HQ-Lin)


### Features

* Popconfirm: 重构 popconfirm 组件  [@kenzyyang](https://github.com/kenzyyang)

## 0.14.2 `2021-09-29`

### Bug Fixes 🐛 

* Radio: Radio.Group 传 options 无效  [@psaren](https://github.com/psaren)
* Tree: 修复 Tree 组件手风琴互斥功能失效问题 (merge request !331)  [@Ruoleery](https://github.com/Ruoleery)
* Checkbox: 多选无法选中，必须指定max值才可 (merge request !323)  [@pengYYYYY](https://github.com/pengYYYYY)
* Table: 展开功能中header显示对于icon,icon对应td宽度值15调整为25 (merge request !321)  [@yunfeic](https://github.com/yunfeic)
* InputNumber: 输入部分错误内容时出现 NaN  [@zj2015262624](https://github.com/zj2015262624)
* Slider: 输入值边界溢出问题  [@andyjxli](https://github.com/andyjxli)


### Features

* Swiper: 新增 Swiper 组件 (merge request !320)  [@skytt](https://github.com/skytt)
* Form: FormItem 支持 blur 触发校验 (merge request !333)  [@HQ-Lin](https://github.com/HQ-Lin)
* Table: 支持加载状态 (merge request !322) [@tengcaifeng](https://github.com/tengcaifeng) [@yunfeic](https://github.com/yunfeic)
* Select: 选项宽度展示优化  [@uyarn](https://github.com/uyarn)

## 0.14.1 `2021-09-24`


### Bug Fixes

* Progress: 修复 Progress 组件进度文字内显位置为垂直居中 (merge request !311) ([@zj2015262624](https://github.com/zj2015262624)
* Popup: 暴露 child event (merge request !319) ([@andyjxli](https://github.com/andyjxli)
* Select: render failed  when set custom keys in multiple mode (merge request !318) ([@uyarn](https://github.com/uyarn)


### Features

* Dropdown: 新增 Dropdown 组件  [@duenyang](https://github.com/duenyang)
* Slider: 新增 Slider 组件  [@andyjxli](https://github.com/andyjxli)
* Anchor: 添加游标样式自定义功能  
* Table: 自定义内容支持 (merge request !308)  [@yunfeic](https://github.com/yunfeic)
* Form: 暴露submit、reset 方法 (merge request !314)  [@HQ-Lin](https://github.com/HQ-Lin)
* Form: 支持多种错误提示展示 (merge request !317)  [@HQ-Lin](https://github.com/HQ-Lin)
* Form: 组件调整 labelWidth 默认值为 100px (merge request !309)  [@HQ-Lin](https://github.com/HQ-Lin)

## 0.14.0 `2021-09-17`

### BREAKING CHANGES
* Menu: 去除顶部导航菜单 operations 区域内 icon 默认样式，升级用户请手动为 icon 实现样式，或增加 t-menu__operations-icon class 名称

### Bug Fixes

* Form: 修复动态 FormItem 渲染报错 (merge request !293) 
* Input: 修复 className 重复使用问题 (merge request !298) 
* Pagination: 分页大小控制器显示问题 (merge request !289) 
* Steps: 组件 current 设置为从 0 开始时，展示的 current 从 1 开始 (merge request !301) 
* Form: setFields 控制 status 字段不触发校验 (merge request !287) 
* Menu: 去除顶部导航菜单 operations 区域内 icon 默认样式 


### Features

* 新增 DatePicker 组件 
* 新增 TimePicker组件 
* 新增 Cascader 组件 
* 新增 Upload 组件 
* Dialog: 重构 Dialog 组件 & 支持 快捷调用方式 (merge request !278) 
* Form: FormItem 支持 labelWidth & labelAlign 控制 (merge request !303) 

## 0.13.0 `2021-09-10`

### BREAKING CHANGES
* Radio: 调整 Radio button 样式 & 支持 variant api & buttonStyle api 废弃 
* Notification: notification API调整为数组格式 

### Bug Fixes

* Form: 修复 form style 不透传问题 
* Form: number value missing 
* Input: 受控改值后光标始终位最右 
* Popup: dobule click bug (merge request !274) 
* Table: 空数据时foot colspan默认6改为12 


### Features

* 重构 Drawer 组件 (merge request !266) 
* Table: 新增选中功能 

## 0.12.2 `2021-09-02`

### BREAKING CHANGES
* anchor api 变动调整： attach => container, affix => affixProps 

### Bug Fixes

* fix: Form 组件 formOptions 类型定义问题 
* fix: select 多选选项disable下不可点击 


### Features

* 添加 Textarea 组件 

## 0.11.5 `2021-08-30`


### Bug Fixes

* Form 修复 labelWidth 行内展示失效问题 & 添加labelWidth 默认值 (merge request !257) 
* Table pagination callback 


### Features

* Tabs item 添加斜八角动画 (merge request !253) 
* Tag add disabled api and demo (merge request !260) 
* Form add setfields api  

## 0.11.4 `2021-08-27`

### Bug Fixes

* 修复 form 组件 setFieldsValue 函数传入未定义key导致的报错 
* 修复 form 初次渲染校验数据问题 (merge request !230) 
* 重构 form ui 布局 & 修复 inline 模式 labelWidth 失效问题 (merge request !245) 
* 修复 icon clipRule的naming错误 
* 修复 inputnumber 组件问题 
* 修复 popconfirm在React 17下无法正常显示的问题 

### Features

* 新增 **tree** 组件
* 新增 **affix** 组件
* 新增 斜八角动画 
* table 新增筛选功能 (merge request !240)

### BREAKING CHANGES
* Calendar逻辑修复，**api更新**，demo完善 


## 0.10.3 `2021-08-18`


### Bug Fixes

* 修复checkbox 阻止冒泡问题 (merge request !219) 
* 修复formitem 无规则校验状态展示错误 (merge request !226) 


### Features

* 优化 grid 
* menuitem 增加 onclick API 
* message 组件 demo 向 vue 同步，修复 placement 无效的 bug (merge request !216) 
* table 组件 排序onSortChange补充支持sortOptions参数,补充类型和注释 
* loading 对齐最新 API & 更新Loading的默认样式为渐变色 & 支持函数方式调用 

## 0.10.2 `2021-08-13`


### Bug Fixes

* 修复引用 icon 丢失 css 样式问题 (merge request !212) 

## 0.10.1 `2021-08-11`


### Bug Fixes

* 调整 export 顺序 
* 修复 es 构建产物 css 丢失问题 
* **menu:** operations与侧边导航同步vue的实现 解决： 1. 侧边导航在固定高度场景下操作区域无法显示的问题 2. 侧边导航在固定高度场景下内容过长无法上下滚动的问题 (merge request !209) 

## 0.10.0 `2021-08-10`

### BREAKING CHANGES
* icon 名称变更 
* 默认调整组件引入方式变更为 es 引入 

### Bug Fixes

* anchor: ponit 在 line 范围外显示的问题 


### Features

* 更新icon资源 
* button: 更新组件样式及DEMO 

## 0.9.1 `2021-08-04`


### Bug Fixes

* 修复 form validate 方法报错 (merge request !201) 

## 0.9.0 `2021-07-30`

### BREAKING CHANGES

* 调整 Notification Api 
* Table 组件适配 pagination 组件api改动 
* 调整 Menu Api 
* 规范各个组件导出方式,每个组件只会有一个导出,其余都为子组件 

### Bug Fixes

* 修复 button  组件问题 
* 修复 menu  组件问题 
* 修复 radio group 样式问题 
* Form form组件缺少getAllFieldsValue api的问题
* 同步 Menu 组件样式改动 
* select,pagination的snapshot中去掉t-select-placeholder 
* 修复 select 组件选中文字颜色仍为 placeholder 的颜色 
* Table page size change issue 
* Tag fix defaultChecked 
* Tabs 适配新的dom结构，修复新版本部分不可用的功能 
* InputNumber value 与 defaultValue 优先级问题 

### Features

* 📦优化打包流程 & 支持按需引入组件 & 支持自定义主题配置 
* 调整 icon 引入策略 &  防止打包引入所有 icon 文件 
* 优化设计指南文档样式 
* Input 补充onClear api支持 
* Input 补充onEnter api支持 
* Input clearable api补充支持 
* Pagination remove self hidden control 
* 新增 MenuGroup 子组件 

## 0.8.0 `2021-07-12`

### BREAKING CHANGES

* 调整 Notification Api 
* Table 组件适配 pagination 组件api改动 

### Bug Fixes

* Notification instance.close 不生效的问题修复，title的测试用例修复 
* Pagination 跳转时应该优先使用当前的 pageSize 
* Tabs 组件去除测试用的debugger语句 
* Form 修复 FormItem 缺少 className 属性实现的问题 
* Menu fix issue 81 
* 修复表单icon颜色范围过大的问题 (merge request !178) 
* 修复formitem组件的ts children类型问题 
* 修复menu 组件样式问题 
* **input-number:** value 的优先级应该大于 defaultValue (merge request !183) 
* **menu:** replace iconfont with the actual icon 
* **select:** 多选时空初始值修复，多选为value类型时展示tag修复 

### Features

* 增加 input-number 默认导出 

## 0.7.1 `2021-06-02`


### Bug Fixes

* 修复 type 引用报错 
* **form:** 修复 Form 使用时缺少 className 类型定义的问题 
* **form:** 修复 FormItem 使用时缺少 className 类型定义的问题 
* tabs example 删除debug代码 
* tabs onRemove事件触发逻辑修正，现在tabs和tabsPanel上都监听后两个事件都能正常被触发 

## 0.7.0 `2021-05-31`

### BREAKING CHANGES

* 调整 Message 组件 Api 
* 调整 Pagination 组件 Api 
* 调整 Select 组件 Api 
### Bug Fixes

* Tabs onChange api未实现的bug修复 
* 修复 Form demo 
* message 关闭单个message demo bug修复 

### Features

* Tab onChange onRemove，tabPanel onRemove renderOnHide api实现 
## 0.6.1 `2021-05-18`


### Bug Fixes

* 修复clipboard 依赖引入报错 (merge request !156) 


### Features

* formItem 支持嵌套 formItem (merge request !154) 

## 0.6.0 `2021-05-14`

### BREAKING CHANGES

* 对齐组件 Api 改动 & 优化package.json 
* **list:** 更新List组件api 
* 调整 List 组件 Api 
* 调整 Layout 组件 Api (merge request !148) 
* 调整 Loading 组件 Api (merge request !145) 


### Bug Fixes

* 优化 Drawer 组件代码 (merge request !147) 
* **dialog:** 修复dialog组件部分参数未传报错问题 
* **timepicker:** fix click popup changeTime when disable 

## 0.5.0 `2021-04-27`

### BREAKING CHANGES

* 调整 Checkbox 组件 api 
* 调整 Radio 组件 api 
### Bug Fixes

* 修复 peerDependencies 指定react 版本报错 (merge request !141) 


### Features

* 🌈 添加 Textarea 组件 (merge request !142) 
* 🌈 添加 Timepicker 组件 

## 0.4.0 `2021-04-23`

### BREAKING CHANGES

* 调整 Dialog 组件 api (merge request !138) 
* 调整 Popconfirm 组件 api (merge request !136) 
* 调整 Steps 组件 API & Step 组件更名为 StepItem 
* 重构 Tabs 组件 & 调整 Tabs 组件 api 


### Features

* 🌈 添加 Breadcrumb 组件 

## 0.3.1 `2021-04-13`


### Bug Fixes

* 修复 0.3.0 组件类型引用报错 & 缺少 uuid 库错误 
* 修复react站点下点击react跳转的问题，顺便clean up event listener within useEffect 
* 文档切换自动滚动至顶部 
* 文档样式调整 

## 0.3.0 `2021-04-08`

### BREAKING CHANGES

* Badge content 属性调整为 count 

### Bug Fixes

* 修复 addon 下缺少对应 classname，导致包裹的 input 有圆角 
* 修复 radio size 样式问题 
* 修复 dialog 定位问题 
* 修复 select 组件点击右侧icon 直接触发 clear 逻辑的 bug & 修复 pagination 组件当 pageSize 设置为非法值时导致页面死循环的 bug 


### Features

* 🌈 新增 InputNumber 组件 

* 🌈 新增 Form 组件 

* 🌈 新增 Anchor 组件 

## 0.2.0 `2021-03-26`


### Bug Fixes

* 调整Icon后其他组件遗留的问题修复 
* Dialog 修复 close 样式和 Icon 组件会冲突的问题 
* 修复 calendar 组件问题 
* 修复 list 组件问题 
* 修复 pagination 组件问题 
* 修复 pagination 组件问题 
* 修复 select 组件问题 
* 修复 steps 组件问题 
* 修复一期组件遗留问题 


### Features

* 🌈 添加 Drawer 组件 
* 🌈 添加 Calendar 组件 
* 🌈 添加 Divider 组件 
* 🌈 添加 Grid 组件 
* 🌈 添加 Layout 组件  
* 🌈 添加 Progress 组件 
* 🌈 添加 Tooltip 组件 
* 调整 popup 组件 api 
* 调整 swicth 组件 api 
* 调整 alert 组件 api 
* 调整 badge 组件 api 
* 调整 button 组件 api 
* 调整 Divider 组件 api 
* 调整 Grid 组件 api 
* 调整 Input 组件 api 
* 调整 Progress 组件 api 
* 调整 Tag 组件 api 
* 调整 Tooltip 组件 api 
