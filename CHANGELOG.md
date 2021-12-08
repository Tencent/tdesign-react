# Changelog

# 0.19.0 (2021-12-08)

### BREAKING CHANGES
* Notification: 插件化使用方式调整，支持  `NotificationPlugin`,`notification` 的调用，废弃 `Notification.info` ([d12d964](https://github.com/TDesignOteam/tdesign-react/commit/d12d96400a366b506c8fae58fa64c23238d915d2))[@kenzyyang](https://github.com/kenzyyang)

### Bug Fixes

* Alert: icon and text vertical center ([82c163c](https://github.com/TDesignOteam/tdesign-react/commit/82c163cca37e1701205885fa9dacab41e3695e93))[@uyarn](https://github.com/uyarn)
* Message: 修复组件自动关闭时控制态的异常和 `onDurationEnd` 事件执行两次的 bug ([#22](https://github.com/TDesignOteam/tdesign-react/issues/22)) ([fbaac78](https://github.com/TDesignOteam/tdesign-react/commit/fbaac78ef6f7a9a3d2652839658099fd2d9bf47b))[@kenzyyang](https://github.com/kenzyyang)
* Table: 消除空数据时底部两条横线 ([2e0e1ce](https://github.com/TDesignOteam/tdesign-react/commit/2e0e1ceb9289334a073a9253f72de4c3e47404f7))[@yunfeic](https://github.com/yunfeic)
* Table: 修复固定列 react16 滚动报错引起固定头列滚动失效 ([765bfb9](https://github.com/TDesignOteam/tdesign-react/commit/765bfb95aa6f10f79bf6dc23ef8c4c66f55435ce))[@yunfeic](https://github.com/yunfeic)
* Table: 修复 header align 设置无效，react16 下固定列滚动报错 ([#23](https://github.com/TDesignOteam/tdesign-react/issues/23)) ([3e8dd57](https://github.com/TDesignOteam/tdesign-react/commit/3e8dd577282d78544f126814ae5762a11555b454)), closes [#190](https://github.com/TDesignOteam/tdesign-react/issues/190)[@yunfeic](https://github.com/yunfeic)
* Textarea: 组件临时解决原生属性 rows 设置后不可用的问题。 ([#19](https://github.com/TDesignOteam/tdesign-react/issues/19)) ([528f726](https://github.com/TDesignOteam/tdesign-react/commit/528f72626ece8d7d02f9108f9a60de4b52c4d0fa))[@kenzyyang](https://github.com/kenzyyang)
* Upload: 修复name属性不生效问题 ([#14](https://github.com/TDesignOteam/tdesign-react/issues/14)) ([25d058d](https://github.com/TDesignOteam/tdesign-react/commit/25d058d89dc90b4f20aebbda1ff937b94c80172e))[@wookaoer](https://github.com/wookaoer)


### Features

* Transfer: 新增 Transfer 组件 ([#15](https://github.com/TDesignOteam/tdesign-react/issues/15)) ([eafbe33](https://github.com/TDesignOteam/tdesign-react/commit/eafbe33b4a2aba14e9ab4308b8e8e68b328d9a5e))
* Dialog: 支持 `DialogPlugin` 调用方式 ([d12d964](https://github.com/TDesignOteam/tdesign-react/commit/3c58290ba93a7064bdcf757ca8972cb5b136e5da))[@HQ-Lin](https://github.com/HQ-Lin)
* Doc: 优化文档内容 ([#21](https://github.com/TDesignOteam/tdesign-react/issues/21)) ([33788b4](https://github.com/TDesignOteam/tdesign-react/commit/33788b48e771d4cf2eb2c26d8731249a09fea2f6))[@HQ-Lin](https://github.com/HQ-Lin)

### 0.18.2 (2021-11-29)


### Bug Fixes

* Treeselect: 修复 tag 关闭按钮渲染不同步问题 & 同步最新 api 改动 (merge request !403)  [@HQ-Lin](https://github.com/HQ-Lin)
* Select: 修复多选模式 disable 禁用选中项反选问题  [@uyarn](https://github.com/uyarn)


### Features

* Checkbox: 支持 `options`、`checkAll` Api  [@kenzyyang](https://github.com/kenzyyang)
* Select: 新增 `valueDisplay`、`minCollapsedNum`、`collapsedItems`、`onEnter`, `onVisibleChange` 等API, `Select.Group` 新增 `divider` API  [@uyarn](https://github.com/uyarn)

## 0.18.1 (2021-11-22)

### Features

* TS: 导出所有组件 TS 类型 [@HQ-Lin](https://github.com/HQ-Lin)

## 0.18.0 (2021-11-19)

### BREAKING CHANGES
* Grid: 优化 gutter 逻辑，传入 number 类型不指定纵向间隔 (merge request !395) [@HQ-Lin](https://github.com/HQ-Lin)

### Bug Fixes

* Popup: 修复 popup 动画移除仍可交互问题 (merge request !396) [@HQ-Lin](https://github.com/HQ-Lin)


## 0.17.1 (2021-11-16)

### Bug Fixes

* Slider: 第一次鼠标移入控制按钮的时候，`Tooltip` 位置是不正确的 (merge request !393)  [@andyjxli](https://github.com/andyjxli) [@vision-yip](https://github.com/vision-yip)

## 0.17.0 (2021-11-15)

### BREAKING CHANGES
* Icon: 💥 移除 `@tencent` 前缀、切换 `tdesign-icons-react` 为 npm 包。(React 已发布至 npm 源并移除 `@tencent` 前缀，使用者升级版本时注意更改 `package.json`!)  [@HQ-Lin](https://github.com/HQ-Lin)

## 0.16.1 (2021-11-12)


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

## 0.16.0 (2021-11-05)

### BREAKING CHANGES

* Button: 组件默认 type 调整为 button  [@hjkcai](https://github.com/hjkcai)
* Grid: 优化 gutter 逻辑，调整为 rowGap 控制上下间距 (merge request !373)  [@HQ-Lin](https://github.com/HQ-Lin)
* Table: 替换展开老api showExpandArrow 为 expandIcon  [@yunfeic](https://github.com/yunfeic)


## 0.15.2 (2021-10-30)

### Bug Fixes

* Cascader: 重构 Cascader & 修复受控失效问题  [@pengYYYYY](https://github.com/pengYYYYY)

### Features

* Form: 优化formItem 提示文案展示效果 (merge request !368)  [@HQ-Lin](https://github.com/HQ-Lin)
* Locale: 支持国际化配置  [@HQ-Lin](https://github.com/HQ-Lin) [@kenzyyang](https://github.com/kenzyyang)


## 0.15.1 (2021-10-27)


### Bug Fixes

* InputNumber: 修复 InputNumber descrease button 样式问题 (merge request !367)  [@HQ-Lin](https://github.com/HQ-Lin)


## 0.15.0 (2021-10-22)

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

## 0.14.4 (2021-10-14)


### Bug Fixes

* Tree: cssTransition 警告  [@Ruoleery](https://github.com/Ruoleery)
* Table: 页码变化未触发 onPageChage  [@yunfeic](https://github.com/yunfeic)
* Pagination: current 和 pageSize 受控与非受控问题  [@uyarn](https://github.com/uyarn)

### Features

* TreeSelect: 新增 TreeSelect 组件  [@HQ-Lin](https://github.com/HQ-Lin)
* Tree: 组件支持受控能力  [@Ruoleery](https://github.com/Ruoleery)
* Dialog: 优化弹出动画、避免弹出时页面滚动条禁用导致页面跳动  [@psaren](https://github.com/psaren)

## 0.14.3 (2021-10-09)


### Bug Fixes

* Datepicker: 修复 传入 className style 无效问题  [@HQ-Lin](https://github.com/HQ-Lin)
* Inputnumber: 修复 单独引用导致 input 样式丢失问题 [@HQ-Lin](https://github.com/HQ-Lin)
* Dropdown: 修复 ripple animation lost  [@uyarn](https://github.com/uyarn)
* Swiper: 修复 最后一项跳转第一项过程中动画延迟问题  [@skytt](https://github.com/skytt)
* Tree: 修复 regeneratorRuntime error  [@HQ-Lin](https://github.com/HQ-Lin)


### Features

* Popconfirm: 重构 popconfirm 组件  [@kenzyyang](https://github.com/kenzyyang)

## 0.14.2 (2021-09-29)

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

## 0.14.1 (2021-09-24)


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

## 0.14.0 (2021-09-17)

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

## 0.13.0 (2021-09-10)

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

## 0.12.2 (2021-09-02)

### BREAKING CHANGES
* anchor api 变动调整： attach => container, affix => affixProps 

### Bug Fixes

* fix: Form 组件 formOptions 类型定义问题 
* fix: select 多选选项disable下不可点击 


### Features

* 添加 Textarea 组件 

## 0.11.5 (2021-08-30)


### Bug Fixes

* Form 修复 labelWidth 行内展示失效问题 & 添加labelWidth 默认值 (merge request !257) 
* Table pagination callback 


### Features

* Tabs item 添加斜八角动画 (merge request !253) 
* Tag add disabled api and demo (merge request !260) 
* Form add setfields api  

## 0.11.4 (2021-08-27)

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


## 0.10.3 (2021-08-18)


### Bug Fixes

* 修复checkbox 阻止冒泡问题 (merge request !219) 
* 修复formitem 无规则校验状态展示错误 (merge request !226) 


### Features

* 优化 grid 
* menuitem 增加 onclick API 
* message 组件 demo 向 vue 同步，修复 placement 无效的 bug (merge request !216) 
* table 组件 排序onSortChange补充支持sortOptions参数,补充类型和注释 
* loading 对齐最新 API & 更新Loading的默认样式为渐变色 & 支持函数方式调用 

## 0.10.2 (2021-08-13)


### Bug Fixes

* 修复引用 icon 丢失 css 样式问题 (merge request !212) 

## 0.10.1 (2021-08-11)


### Bug Fixes

* 调整 export 顺序 
* 修复 es 构建产物 css 丢失问题 
* **menu:** operations与侧边导航同步vue的实现 解决： 1. 侧边导航在固定高度场景下操作区域无法显示的问题 2. 侧边导航在固定高度场景下内容过长无法上下滚动的问题 (merge request !209) 

## 0.10.0 (2021-08-10)

### BREAKING CHANGES
* icon 名称变更 
* 默认调整组件引入方式变更为 es 引入 

### Bug Fixes

* anchor: ponit 在 line 范围外显示的问题 


### Features

* 更新icon资源 
* button: 更新组件样式及DEMO 

## 0.9.1 (2021-08-04)


### Bug Fixes

* 修复 form validate 方法报错 (merge request !201) 

## 0.9.0 (2021-07-30)

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

## 0.8.0 (2021-07-12)

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

## 0.7.1 (2021-06-02)


### Bug Fixes

* 修复 type 引用报错 
* **form:** 修复 Form 使用时缺少 className 类型定义的问题 
* **form:** 修复 FormItem 使用时缺少 className 类型定义的问题 
* tabs example 删除debug代码 
* tabs onRemove事件触发逻辑修正，现在tabs和tabsPanel上都监听后两个事件都能正常被触发 

## 0.7.0 (2021-05-31)

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
## 0.6.1 (2021-05-18)


### Bug Fixes

* 修复clipboard 依赖引入报错 (merge request !156) 


### Features

* formItem 支持嵌套 formItem (merge request !154) 

## 0.6.0 (2021-05-14)

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

## 0.5.0 (2021-04-27)

### BREAKING CHANGES

* 调整 Checkbox 组件 api 
* 调整 Radio 组件 api 
### Bug Fixes

* 修复 peerDependencies 指定react 版本报错 (merge request !141) 


### Features

* 🌈 添加 Textarea 组件 (merge request !142) 
* 🌈 添加 Timepicker 组件 

## 0.4.0 (2021-04-23)

### BREAKING CHANGES

* 调整 Dialog 组件 api (merge request !138) 
* 调整 Popconfirm 组件 api (merge request !136) 
* 调整 Steps 组件 API & Step 组件更名为 StepItem 
* 重构 Tabs 组件 & 调整 Tabs 组件 api 


### Features

* 🌈 添加 Breadcrumb 组件 

## 0.3.1 (2021-04-13)


### Bug Fixes

* 修复 0.3.0 组件类型引用报错 & 缺少 uuid 库错误 
* 修复react站点下点击react跳转的问题，顺便clean up event listener within useEffect 
* 文档切换自动滚动至顶部 
* 文档样式调整 

## 0.3.0 (2021-04-08)

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

## 0.2.0 (2021-03-26)


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
