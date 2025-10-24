---
title: Changelog
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.15.7 `2025-10-24` 
### 🚀 Features
- `Divider`: Support `size` to control spacing size @HaixingOoO ([#3893](https://github.com/Tencent/tdesign-react/pull/3893))
### 🐞 Bug Fixes
- `TreeSelect`: Fix error when deleting options not in `data` @RylanBot ([#3886](https://github.com/Tencent/tdesign-react/pull/3886))
- `EnhancedTable`: Fix exception where rows cannot expand normally after dragging and dynamically closing `dragSort` @RylanBot ([#3896](https://github.com/Tencent/tdesign-react/pull/3896))
- `Menu`: Avoid hiding icons wrapped in `span` when menu is collapsed @QuentinHsu([common#2303](https://github.com/Tencent/tdesign-common/pull/2303))
- `Textarea`: Fix issue where setting `autosize` does not fully auto-expand height when content is too long, resulting in scrollbar @engvuchen ([#3856](https://github.com/Tencent/tdesign-react/pull/3856))
- `RadioGroup`: Fix error caused by reading `null` during keyboard operation  @RylanBot ([#3906](https://github.com/Tencent/tdesign-react/pull/3906))
- `Loading`: Fix issue where `delay` does not take effect  @RylanBot ([#3859](https://github.com/Tencent/tdesign-react/pull/3859))
- `Form`: 
  - Fix English translation error for error messages `max` and `min` @liweijie0812([common#2304](https://github.com/Tencent/tdesign-common/pull/2304))
  - Fix issue where nested `FormList` cannot use `add` to correctly add forms @RylanBot ([#3881](https://github.com/Tencent/tdesign-react/pull/3881))
- `Select`: @RylanBot ([#3879](https://github.com/Tencent/tdesign-react/pull/3879))
  - Fix issue where `disabled` options can still be deleted when `multiple` is enabled
  - Fix issue where `disabled` and selected options have their state modified by `checkAll`
  - Fix issue where `checked` and `indeterminate` states of `checkAll` checkbox are unreasonable when `disabled` items exist
- `VirtualScroll`: @RylanBot ([#3878](https://github.com/Tencent/tdesign-react/pull/3878))
  - Fix issue where data cannot refresh correctly when switching `threshold` between non-virtual scroll and virtual scroll
  - Fix issue where related calculations are started even when `scroll={{type:'virtual'}}` is not enabled

## 🌈 1.15.6 `2025-10-10` 
### 🐞 Bug Fixes
- `VirtualScroll`: Fix component warning issue when components with virtual scroll are used with sub-components in async request scenarios @uyarn ([#3876](https://github.com/Tencent/tdesign-react/pull/3876))

## 🌈 1.15.5 `2025-10-05` 
### 🐞 Bug Fixes
- `Watermark`: Fix issue with using in SSR scenario in version `1.15.2` @Wesley-0808([#3873](https://github.com/Tencent/tdesign-react/pull/3873))
- `Descriptions`: Fix spacing issue in borderless mode @liweijie0812 ([#3873](https://github.com/Tencent/tdesign-react/pull/3873))

## 🌈 1.15.4 `2025-10-01` 
### 🚀 Features
- `ImageViewer`: Support `trigger` pass in image `index` parameter, trigger's `open` method parameters may have type differences with bound element trigger events,if you encounter this issue, please change to `()=> open()` use similar anonymous function @betavs ([#3827](https://github.com/Tencent/tdesign-react/pull/3827))
### 🐞 Bug Fixes
- `Swiper`: Fix issue where autoplay fails after clicking navigation bar on mobile @uyarn ([#3862](https://github.com/Tencent/tdesign-react/pull/3862))
- `List`: Remove redundant code introduced in version `1.15.2` that causes initialization lag when virtual scroll is enabled @RylanBot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))
- `Select`: Remove redundant code introduced in version `1.15.2` that causes initialization lag when virtual scroll is enabled @RylanBot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))

## 🌈 1.15.3 `2025-09-29` 
### 🐞 Bug Fixes
- `Select`: Fix issue where `style` and `className` of `OptionGroup` do not take effect @uyarn ([#3855](https://github.com/Tencent/tdesign-react/pull/3855))

## 🌈 1.15.2 `2025-09-29` 
### 🚀 Features
- `Watermark`: Add `layout` API, support generating watermarks with different layouts, `watermarkText` supports font configuration @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Drawer`:  Optimize issue where component content gets selected during drag-resize process @uyarn ([#3844](https://github.com/Tencent/tdesign-react/pull/3844))
### 🐞 Bug Fixes
- `Watermark`: Fix issue where entire canvas content becomes grayscale when multi-line image-text watermark image is configured with grayscale @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Slider`: Fix return value and related display exceptions caused by precision issues after setting `step` @uyarn ([#3821](https://github.com/Tencent/tdesign-react/pull/3821))
- `TagInput`: Fix issue where `inputValue` in `onBlur` is always empty @RylanBot ([#3841](https://github.com/Tencent/tdesign-react/pull/3841))
- `Cascader`: Fix issue where parent node is unexpectedly highlighted when selecting only child node in `single` mode @RylanBot ([#3840](https://github.com/Tencent/tdesign-react/pull/3840))
- `DateRangePickerPanel`: Fix issue where clicking panel cannot sync when `preset` involves cross-year dates @RylanBot ([#3818](https://github.com/Tencent/tdesign-react/pull/3818))
- `EnhancedTable`: Fix issue where position is reset when clicking expand after node drag @RylanBot ([#3780](https://github.com/Tencent/tdesign-react/pull/3780))
- `Table`: @RylanBot 
  - Fix issue where `onSortChange` always returns `undefined` when `multipleSort` is enabled but `sort` or `defaultSort` is not declared ([#3824](https://github.com/Tencent/tdesign-react/pull/3824))
  - Fix issue where last row content is obscured when virtual scroll is enabled and `firstFullRow` / `lastFullRow` etc. are set simultaneously ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fix issue where `fixedRows` / `firstFullRow` / `lastFullRow` cannot be used in combination under virtual scroll ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fix issue with abnormal scrollbar length during virtual scroll initialization ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fix issue where fixed header and fixed columns cannot align ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fix issue where `defaultCurrent` must be declared for correct pagination when `pagination` is uncontrolled ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
  - Fix issue where clicking pagination still triggers data update when `pagination` is controlled and unchanged ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
  - Fix issue where editable cell content does not sync when `data` changes ([#3826](https://github.com/Tencent/tdesign-react/pull/3826))
- `SelectInput`: @RylanBot ([#3838](https://github.com/Tencent/tdesign-react/pull/3838))
  - Fix issue where `onBlur` does not take effect when `popupVisible={false}` is customized
  - Fix issue where `onBlur` is missing `tagInputValue` parameter when `multiple` is enabled
- `Select`: 
  - Fix issue where using `keys` to configure `content` as `label` or `value` does not take effect @RylanBot @uyarn ([#3829](https://github.com/Tencent/tdesign-react/pull/3829))
  - Fix issue with blank screen and scrollbar being unexpectedly reset when dynamically switching to virtual scroll @RylanBot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))
  - Fix issue where displayed data is not synchronized when virtual scroll is enabled and data is dynamically updated @huangchen1031 ([#3839](https://github.com/Tencent/tdesign-react/pull/3839))
- `List`: 
  - Fix issue where some APIs of `ListItem` do not take effect after enabling virtual scroll @FlowerBlackG ([#3835](https://github.com/Tencent/tdesign-react/pull/3835))
  - Fix issue where scrollbar is unexpectedly reset when dynamically switching to virtual scroll @RylanBot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))

## 🌈 1.15.1 `2025-09-12` 
### 🐞 Bug Fixes
- `ImageViewer`: Fix issue with abnormal `imageScale` configuration effect @uyarn ([#3814](https://github.com/Tencent/tdesign-react/pull/3814))

## 🌈 1.15.0 `2025-09-11` 
### 🚀 Features
- `Icon`:  @uyarn ([#3802](https://github.com/Tencent/tdesign-react/pull/3802))
  - `tdesign-icons-react` Release version `0.6.0`,Add `align-bottom`, `no-result`, `no-result-filled`,  `tree-list`, `wifi-no`,  `wifi-no-filled`, `logo-stackblitz-filled`, `logo-stackblitz`, `logo-wecom-filled` icons,Remove iconsplease note when upgrading ⚠️ 
  - Icon resources used in on-demand loading support variable weight feature, configured via `strokeWidth` property
  - Icon resources used in on-demand loading support multi-color fill feature, configured via `strokeColor` and `fillColor` properties
- `DatePicker`: Support not closing popup when clicking `preset` by overriding `popupProps` @RylanBot ([#3798](https://github.com/Tencent/tdesign-react/pull/3798))
### 🐞 Bug Fixes
- `Tree`: Fix issue with abnormal expand/collapse icon display after dragging @RylanBot ([#3756](https://github.com/Tencent/tdesign-react/pull/3756))
- `TreeItem`: Correct node attribute `date-target` spelling to `data-target`, please note this change if you previously used this attribute ⚠️ @RylanBot ([#3756](https://github.com/Tencent/tdesign-react/pull/3756))
- `MessagePlugin`: Fix error when `content` is `''` / `undefined` / `null`  @RylanBot ([#3778](https://github.com/Tencent/tdesign-react/pull/3778))
- `Table`: Fix page flicker issue caused by `Loading` mounting when `<React.StrictMode>` is not enabled @RylanBot ([#3775](https://github.com/Tencent/tdesign-react/pull/3775))
- `Upload`: Fix `status` update error in drag mode @RSS1102 ([#3801](https://github.com/Tencent/tdesign-react/pull/3801))
- `Input`: Fix issue where `onFocus` and `onBlur` are not triggered when `readonly` is enabled or `allowInput` is disabled @RylanBot ([#3800](https://github.com/Tencent/tdesign-react/pull/3800))
- `Cascader`: 
  - Fix issue with abnormal `valueDisplay` rendering when `multiple` and `valueType='full'` are enabled @RSS1102 ([#3809](https://github.com/Tencent/tdesign-react/pull/3809))
  - Fix `1.11.0` version introduced new feature, causes inability to select bottom options issue @RylanBot ([#3772](https://github.com/Tencent/tdesign-react/pull/3772))
- `Select`: Avoid frequently triggering repeated rendering of `valueDisplay` when opening and closing dropdown @RylanBot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `TagInput`: Avoid frequently triggering repeated rendering of `valueDisplay` when opening and closing dropdown @RylanBot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `Dialog`: Fix infinite loop caused by using `ref` in React 19 environment issue @RylanBot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Drawer`: Fix infinite loop caused by using `ref` in React 19 environment issue @RylanBot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Popup`: Fix `delay` is set to 0 when moving out of Trigger element exception issue @HaixingOoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))
- `Tooltip`: Fix `delay` API type incompleteness issue @HaixingOoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))

### 🚧 Others
- `react-render`: Fix after introducing `react-19-adapter` still shows warning to introduce related modules issue @HaixingOoO ([#3790](https://github.com/Tencent/tdesign-react/pull/3790))

## 🌈 1.14.5 `2025-08-26` 
### 🐞 Bug Fixes
- `Watermark`:  improvewatermarkcomponentin SSR scenariocompatibleissue @uyarn ([#3765](https://github.com/Tencent/tdesign-react/pull/3765))

## 🌈 1.14.3 `2025-08-26` 
### 🐞 Bug Fixes
- `Pagination`: Fixnavigateiconsdoes not reset to correct state issue @phalera ([#3758](https://github.com/Tencent/tdesign-react/pull/3758))
- `Watermark`: Fix `1.14.0` versiondefaulttext colormissingopacity issue @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))
- `Watermark`: Fix `1.14.0` versionnotcompatible SSR scenario issue @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))

## 🌈 1.14.2 `2025-08-22` 
### 🐞 Bug Fixes
- `Dialog`: Fix `1.14.0` versionintroduced new featurecause `draggable` disable failure issue @RylanBot ([#3753](https://github.com/Tencent/tdesign-react/pull/3753))

## 🌈 1.14.1 `2025-08-22` 
### 🐞 Bug Fixes
- `Steps`: Fix `1.13.2` versioncause `theme` notis `default` whenduplicate renderingicons issue @RSS1102 ([#3748](https://github.com/Tencent/tdesign-react/pull/3748))

## 🌈 1.14.0 `2025-08-21` 
### 🚀 Features
- `Tabs`: move `remove` eventdelete fromiconsmove to outer container, ensure replacementiconsfunction normallyusing,has覆盖deleteiconsstyleplease note thischangemore ⚠️ @RSS1102 ([#3736](https://github.com/Tencent/tdesign-react/pull/3736))
- `Card`: Add `headerClassName`, `headerStyle`, `bodyClassName`, `bodyStyle`, `footerClassName`, `footerStyle`,convenient for customizing cardcomponenteach part style @lifeiFront ([#3737](https://github.com/Tencent/tdesign-react/pull/3737))
- `Form`: `rules` Supportconfigurevalidate nested fields @uyarn ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `ImageViewer`: Adjust `imageScale` internalpropertiesvaluechangeisoptional @willsontaoZzz ([#3710](https://github.com/Tencent/tdesign-react/pull/3710))
- `Select`: Support `onCreate` and `multiple` withusing @uyarn ([#3717](https://github.com/Tencent/tdesign-react/pull/3717))
- `Table`: Addswitch paginationafterreset scrollbar to top feature @RSS1102 ([#3729](https://github.com/Tencent/tdesign-react/pull/3729))
- `Tree`: `onDragLeave` and `onDragOver` add `dragNode`, `dropPosition` parameter @phalera ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Upload`: Supportinnon-automaticuploadscenariounderuploadspecified files @uyarn ([#3742](https://github.com/Tencent/tdesign-react/pull/3742))
- `ColorPicker`: Supportinmobiledragcolor palette, slider etc @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Dialog`: Support `draggable` propertiesSupportinmobiletake effect @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `ImageViewer`: Support `draggable` propertiesinmobiletake effect @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Slider`: Supportinmobiledrag @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Statistic`: modify `color` propertiestypeisstring,bySupportany [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) Supportcolorvalue @RSS1102 ([#3706](https://github.com/Tencent/tdesign-react/pull/3706))

### 🐞 Bug Fixes
- `Tree`: @RylanBot
  - Fix `draggable` in `disabled` stateunder依旧take effectexception,this前有dependencythiserror业务please note thischange动 ⚠️ ([#3740](https://github.com/Tencent/tdesign-react/pull/3740)) 
  - Fix `checkStrictly` defaultis false  when,parent-childnode `disabled` statenot associated issue ([#3739](https://github.com/Tencent/tdesign-react/pull/3739))
  - Fix Drag relatedeventcallbackin `node` is null exception ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Form`: @uyarn
    - Fix嵌套formaffected by外层 `FormList` affectdata构造 issue ([#3715](https://github.com/Tencent/tdesign-react/pull/3715))
    - Fix嵌套formin内层formaffected by外层formaffectvalidate结果字段 issue ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `FormList`: 解决 `1.13.2` 引入Fix,cause手动 `setFields` set初始value而非利用 `initialData` after无法Adddata issue @RylanBot ([#3730](https://github.com/Tencent/tdesign-react/pull/3730))
- `Input`: Fix密码input框clickicons切换contentvisible性 when,光标置没能被保留 @RylanBot ([#3726](https://github.com/Tencent/tdesign-react/pull/3726))
- `Table`: @RylanBot ([#3733](https://github.com/Tencent/tdesign-react/pull/3733))
    - Fixenabledvirtual scroll when,动态updatedatawhencause白屏 issue  
    - Fixenabledvirtual scroll when,headerandunder方tablewidth未syncchange化
    - Fixenabledvirtual scroll when,scroll条意外被reset回第一row置
    - Fix `dragSort='row-handler-col'`  when,columndragnottake effect issue ([#3734](https://github.com/Tencent/tdesign-react/pull/3734))
    - Fix `size='small'`  `firstFullRow` dimension比 `size='medium'` 大exception ([#common2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Watermark`: Fix深色模式under,文字watermarkcontentshownot明显 issue @HaixingOoO @liweijie0812 ([#3692](https://github.com/Tencent/tdesign-react/pull/3692))
- `DatePicker`: Optimize年份select模式underselect同面板年份after面板contentdisplay效果 @uyarn ([#3744](https://github.com/Tencent/tdesign-react/pull/3744))


## 🌈 1.13.2 `2025-08-01` 
### 🐞 Bug Fixes
- `DatePicker`: 
  - 处理multiple情况under周and季度模式tagdeleteexception issue @betavs ([#3664](https://github.com/Tencent/tdesign-react/pull/3664))
  - Fixmultiple模式under `placeholder` 没能normal消失 @RylanBot ([#3666](https://github.com/Tencent/tdesign-react/pull/3666))
- `EnhancedTable`: @RylanBot
  - 解决 `1.13.0` versionin引入Fix,causeasyncscenariounder `data` updatefailure issue ([#3690](https://github.com/Tencent/tdesign-react/pull/3690)) 
  - Fix using `tree` API when ,动态initialize `columns` whennot存in unique key ([#3669](https://github.com/Tencent/tdesign-react/pull/3669))
  - Fix叶子nodejudgment条件过宽,cause `className` for应style未normalrender ([#3681](https://github.com/Tencent/tdesign-react/pull/3681))
- `SelectInput`: Fix in `useOverlayInnerStyle` ingetscroll条whenset `display` cause一些 bug @HaixingOoO ([#3677](https://github.com/Tencent/tdesign-react/pull/3677))
- `Textarea`: Fix `Dialog` in `Textarea` 挂载 `autosize` nottake effect @HaixingOoO ([#3693](https://github.com/Tencent/tdesign-react/pull/3693))
- `ColorPicker`: @RylanBot ([#3667](https://github.com/Tencent/tdesign-react/pull/3667))
  - 减少color跨色彩空间多次转换,降低误差
  - Fix直接长按渐change点afterdrag,colorupdateexception issue
  - Fixclearunder方某一input框数value when,其他input框意外被reset
- `Upload`: Ensurein `beforeUpload` complete之after,再executeupload动作 @RSS1102 ([#3686](https://github.com/Tencent/tdesign-react/pull/3686))
- `Table`: Fix `resizable` enabled when,columnborder线causecolumn名content移动 issue @QuentinHsu([#common2224](https://github.com/Tencent/tdesign-common/pull/2224))
- `Descriptions`: Fix无border模式under左右内margin @liweijie0812 ([#common2219](https://github.com/Tencent/tdesign-common/pull/2219))
- `Steps`: Fixcustomizediconsandstateicons优先级issue @RSS1102 ([#3670](https://github.com/Tencent/tdesign-react/pull/3670))
- `Form`: Fix动态formdelete一个dataafter再次Add,会回填旧data issue @RylanBot ([#3684](https://github.com/Tencent/tdesign-react/pull/3684))

## 🌈 1.13.1 `2025-07-11`

### 🐞 Bug Fixes
- `QRCode`: Fix `canvas` 二维码 Safari stylecompatibleissue

## 🌈 1.13.0 `2025-07-10` 
### 🚀 Features
- `React19`: Addcompatible React 19 using adapter,in React 19 inusing请参考usingdocumentation详细description @HaixingOoO @uyarn([#3640](https://github.com/Tencent/tdesign-react/pull/3640))
- `QRCode`: Add `QRCode` 二维码component @lifeiFront @wonkzhang ([#3612](https://github.com/Tencent/tdesign-react/pull/3612))
- `Alert`: Add `closeBtn` API,and其他component保持一致,`close` movein未来version废弃,请尽快Adjustis `closeBtn` using ⚠️ @ngyyuusora ([#3625](https://github.com/Tencent/tdesign-react/pull/3625))
- `Form`: Addin重新opening Form  when,resetformcontent特性 @alisdonwang ([#3613](https://github.com/Tencent/tdesign-react/pull/3613))
- `ImageViewer`: Supportinmobileusing when,via双指进row缩放image功能 @RylanBot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
- `locale`: Support内置多语言英文version单复数scenarionormaldisplay @YunYouJun ([#3639](https://github.com/Tencent/tdesign-react/pull/3639))
### 🐞 Bug Fixes
- `ColorPicker`: 
  - Fix click渐change点 when,color palette没有syncupdate issue @RylanBot ([#3624](https://github.com/Tencent/tdesign-react/pull/3624))
  - Fix面板inputinvalid字符scenarioand多reset空scenariounder没有resetinput框content缺陷 @uyarn ([#3653](https://github.com/Tencent/tdesign-react/pull/3653))
- `Dropdown`: Fix部分scenariounder拉menunodegetexceptioncauseerrorissue @uyarn ([#3657](https://github.com/Tencent/tdesign-react/pull/3657))
- `ImageViewer`: @RylanBot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
  - Fix click工具栏icons边缘when无法triggerfor应操作
  - Fix由于 `TooltipLite` cause `z-index` level关系exception
- `Popup`: Fix `1.11.2` 引入 popper.js  `arrow` 修饰符cause箭头置偏移 @RylanBot ([#3652](https://github.com/Tencent/tdesign-react/pull/3652))
- `Loading`: Fix in iPad 微信上icons置error issue @Nero978([#3655](https://github.com/Tencent/tdesign-react/pull/3655))
- `Menu`: 解决 `expandMutex` 存in嵌套子menu when,容易失效 issue @RylanBot ([#3621](https://github.com/Tencent/tdesign-react/pull/3621))
- `Table`: 
  - Fix吸顶功能not随heightchange化 issue @huangchen1031 ([#3620](https://github.com/Tencent/tdesign-react/pull/3620))
  - Fix `showHeader` is `false`  when,`columns` 动态change化error issue @RylanBot ([#3637](https://github.com/Tencent/tdesign-react/pull/3637))
- `EnhancedTable`: Fix `tree.defaultExpandAll` 无法take effect issue @RylanBot ([#3638](https://github.com/Tencent/tdesign-react/pull/3638))
- `Textarea`: Fix超出最大heightafter换rowwhen抖动 issue @RSS1102 ([#3631](https://github.com/Tencent/tdesign-react/pull/3631))

## 🌈 1.12.3 `2025-06-13` 
### 🚀 Features
- `Form`: Add `requiredMarkPosition` API,可definerequired符号置 @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
- `ConfigProvider`: 全局configure `FormConfig` Add `requiredMaskPosition` configure,用于全局configurerequired符号置 @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
### 🐞 Bug Fixes
- `Drawer`: Fix `cancelBtn` and `confirmBtn` typemissing `null` declare issue @RSS1102 ([#3602](https://github.com/Tencent/tdesign-react/pull/3602))
- `ImageViewer`: Fixshowerrorimagein小窗口imageview器dimensionexception @RylanBot([#3607](https://github.com/Tencent/tdesign-react/pull/3607))
- `Menu`: `popupProps`  `delay` propertiesin `SubMenu` in无法take effect issue @RylanBot ([#3599](https://github.com/Tencent/tdesign-react/pull/3599))
- `Menu`: enabled `expandMutex` after,如果存in二级 `SubMenu`,menu无法expand @RylanBot ([#3601](https://github.com/Tencent/tdesign-react/pull/3601))
- `Select`:  Fix `checkAll` 设is `disabled` after依旧会triggerselect all issue @RylanBot ([#3563](https://github.com/Tencent/tdesign-react/pull/3563))
- `Table`: Optimizeclosecolumnconfiguredialog when,Fixselectcolumndataand所displaycolumndatanot一致 issue @RSS1102 ([#3608](https://github.com/Tencent/tdesign-react/pull/3608))
- `TabPanel`: Fixvia `style` set `display` properties无法normaltake effect issue @uyarn ([#3609](https://github.com/Tencent/tdesign-react/pull/3609))
- `Tabs`:  Fixenabled懒loadafter始终会先render第一个`TabPanel` issue @HaixingOoO ([#3614](https://github.com/Tencent/tdesign-react/pull/3614))
- `TreeSelect`: Fix `label` API 无法normalusing issue @RylanBot ([#3603](https://github.com/Tencent/tdesign-react/pull/3603))

## 🌈 1.12.2 `2025-05-30` 
### 🚀 Features
- `Cascader`: AddSupportusing `option` methodcustomizedunder拉optioncontent能力 @huangchen1031 ([#3565](https://github.com/Tencent/tdesign-react/pull/3565))
- `MenuGroup`: AddSupport `className` and `style` using @wang-ky ([#3568](https://github.com/Tencent/tdesign-react/pull/3568))
- `InputNumber`: `decimalPlaces` AddSupport `enableRound` parameter,to control是否enabling四舍五入 @RylanBot ([#3564](https://github.com/Tencent/tdesign-react/pull/3564))
- `TagInput`: Optimize可drag when,鼠标光标showis移动光标 @liweijie0812 ([#3552](https://github.com/Tencent/tdesign-react/pull/3552))


### 🐞 Bug Fixes
- `Card`: Fix `content` prop nottake effect issue @RylanBot ([#3553](https://github.com/Tencent/tdesign-react/pull/3553))
- `Cascader`: 
     - Fixoption存in超长文字insizedimensionunderdisplayexception issue @Shabi-x([#3551](https://github.com/Tencent/tdesign-react/pull/3551))
     - Fixinitializeafter,asyncupdate `options`  when,`displayValue` 无change化 issue @huangchen1031 ([#3549](https://github.com/Tencent/tdesign-react/pull/3549))
- `DatePicker`: Fix `onFocus` eventtriggerwhen机issue @l123wx ([#3578](https://github.com/Tencent/tdesign-react/pull/3578))
- `Drawer`: Optimize `TNode` 重新rendercauseinput光标error issue @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
-  `Form`:
    - Fix in `onValuesChange` invia `setFields` set相同value继续trigger `onValuesChange` cause `re-render`  issue @HaixingOoO ([#3304](https://github.com/Tencent/tdesign-react/pull/3304))
    - Fix `FormList` delete `field` after `reset` valueinitializeerror issue @l123wx ([#3557](https://github.com/Tencent/tdesign-react/pull/3557))
    - compatible `1.11.7` version前单独using `FormItem` scenario @uyarn ([#3588](https://github.com/Tencent/tdesign-react/pull/3588))
- `Guide`: Optimizecomponentin屏幕sizechange化when没有重新计算置 issue @HaixingOoO ([#3543](https://github.com/Tencent/tdesign-react/pull/3543))
- `List`: Fix空子nodecauseget子node `props` failure issue @RSS1102 ([#3570](https://github.com/Tencent/tdesign-react/pull/3570))
- `Popconfirm`: Fix `confirmBtn` properties children nottake effect issue @huangchen1031 ([#3556](https://github.com/Tencent/tdesign-react/pull/3556))
- `Slider`: Fix `Slider`  最after一个 label widthnot足自动换row issue @l123wx([#3581](https://github.com/Tencent/tdesign-react/pull/3581))
- `Textarea`: Fixinputin文被in断 issue @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `TreeSelect`: Fix单点已选invalue when,会delete已选invalue issue @HaixingOoO ([#3573](https://github.com/Tencent/tdesign-react/pull/3573))

### 🚧 Others
- `Dialog`: Optimizecomponentinitializerenderwhen间 @RylanBot ([#3561](https://github.com/Tencent/tdesign-react/pull/3561))



## 🌈 1.12.1 `2025-05-07` 
### 🐞 Bug Fixes
-  Fix 1.12.0 compatible React 18 byunder issue @uyarn ([#3545](https://github.com/Tencent/tdesign-react/pull/3545))



## 🌈 1.12.0 `2025-04-28` 
### 🚀 Features
- `React`: 全面upgraderelateddependency,compatiblein React19 inusing @HaixingOoO ([#3438](https://github.com/Tencent/tdesign-react/pull/3438))
- `ColorPicker`: @RylanBot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503)) using渐change模式业务please note thischangemore ⚠️
  - 自动根据「trigger器 / 最近color / 预设color」色value进row切换单色and渐change模式
  - 只enabled渐change模式 when,filter「预设color / when前color」in非渐change色value
  - Add format `HEX8`,Remove `HSB`
  - Add `enableMultipleGradient` API,defaultenabled
- `Drawer`: Add `lazy` properties,用于懒loadscenario,`forceRender` 已declare废弃,未来versionmove被Remove @RSS1102 ([#3527](https://github.com/Tencent/tdesign-react/pull/3527))
- `Dialog`: Add `lazy` properties,用于懒loadscenario,`forceRender` 已declare废弃,未来versionmove被Remove @RSS1102 ([#3515](https://github.com/Tencent/tdesign-react/pull/3515))


### 🐞 Bug Fixes
- `ColorPicker`: @RylanBot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503))
  - Fix渐change点无法normalupdatecolorand置 issue
  - Fixenabled透明通道whenreturnvalue格式化exception


## 🌈 1.11.8 `2025-04-28` 
### 🚀 Features
- `ConfigProvider`:  Support全局contextconfigure作用于 Message relatedplugin @lifeiFront ([#3513](https://github.com/Tencent/tdesign-react/pull/3513))
- `Icon`: Add `logo-miniprogram` 小程序, `logo-cnb` 云原生build, `seal` 印章, `quote`引号等icons @taowensheng1997 @uyarn ([#3517](https://github.com/Tencent/tdesign-react/pull/3517))
- `Upload`: `image-flow`模式underSupport进度及customizederrortext @ngyyuusora ([#3525](https://github.com/Tencent/tdesign-react/pull/3525))
- `Select`: multiplevia面板RemoveoptionAdd `onRemove` callback @QuentinHsu ([#3526](https://github.com/Tencent/tdesign-react/pull/3526))
### 🐞 Bug Fixes
- `InputNumber`: Optimizenumberinput框边界issue @Sight-wcg([#3519](https://github.com/Tencent/tdesign-react/pull/3519))
- `Select`:
    - Fix `1.11.2` after version光标exception及子component方式callbackfunctioninmissing完整 `option` 信息 issue @HaixingOoO @uyarn ([#3520](https://github.com/Tencent/tdesign-react/pull/3520))  ([#3529](https://github.com/Tencent/tdesign-react/pull/3529))
    - OptimizemultipleRemovetagrelatedeventCorrectisnot同 `trigger`,  not同triggerscenario分别Adjustis `clear`, `remove-tag`and `uncheck`,Correctselect alloption `trigger` error @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
    - Fixsingle情况under再次click选inoption会trigger `change` event issue @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
    - Fixmultiple情况under按under `backspace` 无法trigger `change` event issue @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))

## 🌈 1.11.7 `2025-04-18` 
### 🚀 Features
- `ConfigProvider`: Add `isContextEffectPlugin` API,defaultclose,enabledafter全局configure会affect到 `Dialog`, `Loading`, `Drawer`, `Notification` and `Popup` componentfunction式call @lifeiFront ([#3488](https://github.com/Tencent/tdesign-react/pull/3488)) ([#3504](https://github.com/Tencent/tdesign-react/pull/3504))
- `Tree`: `checkProps`parameterSupportfunctionpass in,Supportnot同nodesetnot同checkProps @phalera ([#3501](https://github.com/Tencent/tdesign-react/pull/3501))
- `Cascader`：Add `onClear` eventcallback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `DatePicker`: Add `onClear` eventcallback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `TimePicker`: Add `onClear` eventcallback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `ColorPicker`: 
    - Add `clearable` API @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
    - Add `onClear` eventcallback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
### 🐞 Bug Fixes
- `DatePicker`: Ensure外部component主动close Popup when候,能有for应 `onVisibleChange` callback @RylanBot ([#3510](https://github.com/Tencent/tdesign-react/pull/3510))
- `Drawer`: Add `DrawerPlugin`,Supportfunction式call,具体using参考example @Wesley-0808 ([#3381](https://github.com/Tencent/tdesign-react/pull/3381))
- `InputNumber`: Fixcomponent未affected by value properties控制 issue @RSS1102 ([#3499](https://github.com/Tencent/tdesign-react/pull/3499))
- `ImageViewer`:
     - Fixset `step` 存in精度displayexception issue @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
     - Fix `imageScale` inparameterrequiredtypeerror @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
- `Slider`: Fixopeninginput框模式under,using `theme` is `col` input框scenariounder没有限制size issue @RSS1102 ([#3500](https://github.com/Tencent/tdesign-react/pull/3500))
- `Tabs`: Optimizeoption卡 `label` 过长whenslidebutton失效 issue @wonkzhang ([common#2108](https://github.com/Tencent/tdesign-common/pull/2108))

## 🌈 1.11.6 `2025-04-11` 
### 🚀 Features
- `Breadcrumb`: Add `ellipsis`, `maxItems`, `itemsAfterCollapse`, `itemsBeforeCollapse` relatedAPI,用于collapseoptionscenario,具体using参考example @moecasts ([#3487](https://github.com/Tencent/tdesign-react/pull/3487))

### 🐞 Bug Fixes
- `RadioGroup`: Optimize切换displayhighlight效果issue @RylanBot ([#3446](https://github.com/Tencent/tdesign-react/pull/3446))
- `Tag`: Fix `style` 优先级低于 `color`,cause无法强制覆盖tagstylescenario @uyarn ([#3492](https://github.com/Tencent/tdesign-react/pull/3492))
- `ColorPicker`: Fix单色and渐change切换using效果exceptionissue @RylanBot ([#3493](https://github.com/Tencent/tdesign-react/pull/3493))
- `Table`: Fix可Adjustcolumn宽tablerightdragAdjustexceptionissue @uyarn ([#3496](https://github.com/Tencent/tdesign-react/pull/3496))
- `Swiper`: Optimizedefaultcontainerheight,Avoid navigator 置exception issue @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))
### 📝 Documentation
- `Swiper`: Optimizecomponentnavigate沙箱demomissingexamplestyle issue @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))

### 🚧 Others
-  `1.12.0` versionmove全面compatible React 19 using,有 React 19relatedusingscenario需求,可upgrade `1.12.0-alpha.3` version进row试用

## 🌈 1.11.4 `2025-04-03` 
### 🐞 Bug Fixes
- `Select`: Fix `options`is空when会causeerrortrigger白屏 issue @2ue ([#3484](https://github.com/Tencent/tdesign-react/pull/3484))
- `Tree`: Fix icon is false 仍然triggerclickandexpandrelated逻辑 issue @uyarn ([#3485](https://github.com/Tencent/tdesign-react/pull/3485))

## 🌈 1.11.3 `2025-04-01` 
### 🚀 Features
- `ConfigProvider`: `Pagination` Add `Jumper` configure,用于customizednavigate部分style @RylanBot ([#3421](https://github.com/Tencent/tdesign-react/pull/3421))
### 🐞 Bug Fixes
- `Textarea`: 修復 `TextArea`in `Dialog`  `autofocus` bug and `autosize` nottake effect @HaixingOoO ([#3471](https://github.com/Tencent/tdesign-react/pull/3471))
- `lib`: Fix `1.11.2` versionin `lib` 产物冗余stylecause`next.js`inusingexception及version号missing issue @uyarn ([#3474](https://github.com/Tencent/tdesign-react/pull/3474))
- `Table`: Fixaffected by控methodunder `Pagination` state计算error issue @huangchen1031 ([#3473](https://github.com/Tencent/tdesign-react/pull/3473))

## 🌈 1.11.2 `2025-03-28` 
### 🚀 Features
- `ImageViewer`: Add `onDownload` API,用于customized预览imagedownloadcallback功能 @lifeiFront ([#3408](https://github.com/Tencent/tdesign-react/pull/3408))
- `ConfigProvider`: `Input` Add `clearTrigger` configure,用于全局模式in有valuewhenshowclose button功能 @RylanBot ([#3412](https://github.com/Tencent/tdesign-react/pull/3412))
- `Descriptions`: Add `tableLayout` properties @liweijie0812 ([#3434](https://github.com/Tencent/tdesign-react/pull/3434))
- `Message`: close消息instance when,从全局消息listinRemove该instance,Avoid潜in内存泄漏风险 @wonkzhang ([#3413](https://github.com/Tencent/tdesign-react/pull/3413))
- `Select`: groupoption器AddSupportfilter功能 @huangchen1031 ([#3430](https://github.com/Tencent/tdesign-react/pull/3430))
- `Tabs`: Add `lazy` API,Supportconfigure懒load功能 @HaixingOoO ([#3426](https://github.com/Tencent/tdesign-react/pull/3426))

### 🐞 Bug Fixes
- `ConfigProvider`: Fix全局configure二级configureaffect非`Context`范围 issue @uyarn ([#3441](https://github.com/Tencent/tdesign-react/pull/3441))
- `Dialog`: cancelandconfirmbuttonaddclass name,方便定制需求 @RSS1102 ([#3417](https://github.com/Tencent/tdesign-react/pull/3417))
- `Drawer`: Fixdrag改changesizewhen候getwidth可能not正确 issue @wonkzhang ([#3420](https://github.com/Tencent/tdesign-react/pull/3420))
- `Guide`:  Fix `popupProps` 穿透properties `overlayClassName` invalid  @RSS1102 ([#3433](https://github.com/Tencent/tdesign-react/pull/3433))
- `Popup`: 解决component修饰符 `arrow` propertiessetnottake effect issue @wonkzhang ([#3437](https://github.com/Tencent/tdesign-react/pull/3437))
- `Select`: Fixsingle框in `readonly` 模式under有光标and `clear` icons issue @wonkzhang ([#3436](https://github.com/Tencent/tdesign-react/pull/3436))
- `Table`: Fixenabledvirtual scroll when,`fixedRows` when opening and closing dropdownissue @huangchen1031 ([#3427](https://github.com/Tencent/tdesign-react/pull/3427))
- `Table`: Fixoptionalinrowtablein火狐browserinstyleexceptionissue @uyarn ([common#2093](https://github.com/Tencent/tdesign-common/pull/2093))
- `Tooltip`: Fix `React 16` under,`TooltipLite`  `mouse` 计算置error issue @moecasts ([#3465](https://github.com/Tencent/tdesign-react/pull/3465))
- `Tree`:  Fix部分scenariounderRemovenodeaftercomponenterror issue @2ue ([#3463](https://github.com/Tencent/tdesign-react/pull/3463))
### 📝 Documentation
- `Card`: Fixdocumentationcontent文案errorissue @betavs ([#3448](https://github.com/Tencent/tdesign-react/pull/3448))


## 🌈 1.11.1 `2025-02-28` 
### 🚀 Features
- `Layout`: 子component `Content` Add `content` API  @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))
### 🐞 Bug Fixes
- `reactRender`: fix `React19` `reactRender` error @HaixingOoO ([#3380](https://github.com/Tencent/tdesign-react/pull/3380))
- `Table`: Fixunder virtual scrollfooterrenderissue @huangchen1031 ([#3383](https://github.com/Tencent/tdesign-react/pull/3383))
- `fix`: Fix`1.11.0` cjs 产物exception @uyarn ([#3392](https://github.com/Tencent/tdesign-react/pull/3392))
### 📝 Documentation
- `ConfigProvider`: add `globalConfig` API documentation  @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))

## 🌈 1.11.0 `2025-02-20` 
### 🚀 Features
- `Cascader`:  AddSupportinopeningmenu when,自动scroll到首个已option所innode能力 @uyarn ([#3357](https://github.com/Tencent/tdesign-react/pull/3357))
- `DatePicker`: Adjustcomponentdisable日期 `before` and `after` parameter逻辑,Adjustisdisable `before` define之前and `after` define之after日期select,this前有usingrelated API please note thischangemore ⚠️ @lifeiFront ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `List`: Add `scroll` API,用于大data量underSupportenabledvirtual scroll @HaixingOoO ([#3363](https://github.com/Tencent/tdesign-react/pull/3363))
- `Menu`: menuAddcollapsecollapse动画效果 @hd10180 ([#3342](https://github.com/Tencent/tdesign-react/pull/3342))
- `TagInput`: Add `maxRows` API,用于set最大displayrow数 @Shabi-x ([#3293](https://github.com/Tencent/tdesign-react/pull/3293))

### 🐞 Bug Fixes
- `Card`: Fix React 19 inwarning issue @HaixingOoO ([#3369](https://github.com/Tencent/tdesign-react/pull/3369))
- `Cascader`: Fixmultiple动态loadusingexception issue @uyarn ([#3376](https://github.com/Tencent/tdesign-react/pull/3376))
- `CheckboxGroup`: Fix `onChange`  `context` parametermissing `option`  issue @HaixingOoO ([#3349](https://github.com/Tencent/tdesign-react/pull/3349))
- `DatePicker`: Fix日期selectin负数when区exceptionissue @lifeiFront ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `Dropdown`: Fix clickeventcallback `context` parameterreturnnot符合documentationdescription issue @uyarn ([#3372](https://github.com/Tencent/tdesign-react/pull/3372))
- `RadioGroup`: Fix in React 19 versionunderexception issue @HaixingOoO ([#3364](https://github.com/Tencent/tdesign-react/pull/3364))
- `Tabs`: Fix可slide `Tabs` with `action` usingstyle issue @Wesley-0808([#3343](https://github.com/Tencent/tdesign-react/pull/3343))
- `Table`: Fixwith `Tabs` using,切换 tab  when,Table  footer notshow issue @wonkzhang ([#3370](https://github.com/Tencent/tdesign-react/pull/3370))
- `Textarea`: Fix using `autofocus` API 且 `value` 有value when,光标没有跟随content末尾 issue @HaixingOoO ([#3358](https://github.com/Tencent/tdesign-react/pull/3358))
- `Transfer`: Fix `TransferItem` invalid issue @HaixingOoO ([#3339](https://github.com/Tencent/tdesign-react/pull/3339))


### 🚧 Others
-  Adjustcomponentdependency `lodash` dependencyis`lodash-es` @zhangpaopao0609  ([#3345](https://github.com/Tencent/tdesign-react/pull/3345))

## 🌈 1.10.5 `2025-01-16` 
### 🚀 Features
- `RadioGroup`: Add `theme` API,用于决定using options whenrender子componentstyle @HaixingOoO ([#3303](https://github.com/Tencent/tdesign-react/pull/3303))
- `Upload`: Add `imageProps` API,用于inuploadimagescenariounderpass through `Image` componentrelatedproperties @HaixingOoO ([#3317](https://github.com/Tencent/tdesign-react/pull/3317))
- `AutoComplete`: Add `empty` API ,用于Supportcustomized空nodecontent @liweijie0812 ([#3319](https://github.com/Tencent/tdesign-react/pull/3319))
- `Drawer`: `sizeDraggable`AddSupport `SizeDragLimit`type功能实现 @huangchen1031 ([#3323](https://github.com/Tencent/tdesign-react/pull/3323))
- `Icon`: Add `logo-alipay`, `logo-behance-filled`等icons,modify `logo-wecom` icons,Remove icons @uyarn ([#3326](https://github.com/Tencent/tdesign-react/pull/3326))
### 🐞 Bug Fixes
- `Select`: Fix `onChange` callback `context` inalloptionvaluedoes not includeoption本身allcontent issue @uyarn ([#3305](https://github.com/Tencent/tdesign-react/pull/3305))
- `DateRangePicker`: 开始结束valuesimultaneously exist逻辑judgmenterrorissue @betavs ([#3301](https://github.com/Tencent/tdesign-react/pull/3301))
- `Notification`: Fix using `attach` propertiesconfigurecauserendernodeexception issue @centuryPark ([#3306](https://github.com/Tencent/tdesign-react/pull/3306))
- `AutoComplete`: Fixwhenoptionis空whenshow效果exception issue @betavs ([#3316](https://github.com/Tencent/tdesign-react/pull/3316))
- `Menu`: Fix `head-menu` notrender `icon`  issue @HaixingOoO ([#3320](https://github.com/Tencent/tdesign-react/pull/3320))
- `Statistic`: Fix `decimalPlaces=0` when数value动画期间精度error issue @huangchen1031 ([#3327](https://github.com/Tencent/tdesign-react/pull/3327))
- `ImageViewer`: Fixenabled `closeOnOverlay`  when,click蒙层close存in闪烁情况 issue @huangchen1031


## 🌈 1.10.4 `2024-12-25` 
### 🚀 Features
- `Tree`: Support `onScroll` API,用于处理scrolleventcallback @HaixingOoO ([#3295](https://github.com/Tencent/tdesign-react/pull/3295))
- `TooltipLite`: `mouse` 模式underOptimizeis完全跟随鼠标置,more符合 API description @moecasts ([#3267](https://github.com/Tencent/tdesign-react/pull/3267))
### 🐞 Bug Fixes
- `Select`: Fixselect alldefaultreturnvalueerror issue @uyarn ([#3298](https://github.com/Tencent/tdesign-react/pull/3298))
- `Upload`: Optimize部分dimensionuploadcomponentimagedisplaystyle issue @huangchen1031 ([#3290](https://github.com/Tencent/tdesign-react/pull/3290))
### 📝 Documentation
- `Stackblitz`: Adjust`Stackblitz`examplestart方式,并Fix部分example无法using`stackblitz`or`codesandbox`run issue @uyarn ([#3297](https://github.com/Tencent/tdesign-react/pull/3297))

## 🌈 1.10.2 `2024-12-19`

### 🚀 Features

- `Alert`: in `maxLine >= message` array长度情况under,not再display `expandmore多/collapse` button @miownag ([#3281](https://github.com/Tencent/tdesign-react/pull/3281))
- `ConfigProvider`: `attach` propertiesSupportconfigure `drawer` component,Support全局configure `drawer` 挂载置 @HaixingOoO ([#3272](https://github.com/Tencent/tdesign-react/pull/3272))
- `DatePicker`: multiple模式Support周selectand年selectscenario @HaixingOoO @uyarn  ([#3264](https://github.com/Tencent/tdesign-react/pull/3264))
- `Form`: Add `supportNumberKey` API,Supportin`1.9.3`after versionnotSupportnumberkeyvaluescenariousing,若not需要Supportnumbertypeasformkeyvalue请closethis API @uyarn ([#3277](https://github.com/Tencent/tdesign-react/pull/3277))
- `Radio`: Add `Radio` 及 `RadioGroup`  `reaonly` propertiesSupport @liweijie0812 ([#3280](https://github.com/Tencent/tdesign-react/pull/3280))
- `Tree`: instanceAdd `setIndeterminate` method,Support手动set半选功能 @uyarn ([#3261](https://github.com/Tencent/tdesign-react/pull/3261))
- `DatePicker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `TimePicker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `RangeInput`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))

### 🐞 Bug Fixes
- `DateRangePicker`: Fix in跨年scenariounderdisplayexceptionissue @huangchen1031 ([#3275](https://github.com/Tencent/tdesign-react/pull/3275))
- `Menu`: Optimizemenu项clickevent绑定issueAvoid边界triggerexception issue @huangchen1031 ([#3241](https://github.com/Tencent/tdesign-react/pull/3241))
- `ImageViewer`: Fixnotaffected by控 when,`visable`改changewhen都会trigger`onClose` issue @HaixingOoO ([#3244](https://github.com/Tencent/tdesign-react/pull/3244))
- `CheckboxGroup`: Fixcheckbox组子elementnot是checkboxcause issue @HaixingOoO ([#3253](https://github.com/Tencent/tdesign-react/pull/3253))
- `Form`: Fix`1.9.3`after version,多级form字段using `setFieldValues` 功能exception issue @l123wx ([#3279](https://github.com/Tencent/tdesign-react/pull/3279))
- `Form`: Fixwhen规则isininvolve `0` judgment when,verifynottake effect issue @RSS1102 ([#3283](https://github.com/Tencent/tdesign-react/pull/3283))
- `Select`: Fix `valueType` is `object`选inselect alldisplayexception及callbackparametermissing issue @uyarn ([#3287](https://github.com/Tencent/tdesign-react/pull/3287))
- `SelectInput`: Fix没有 `label` 都会rendernodecause垂直for齐 issue @huangchen1031 ([#3278](https://github.com/Tencent/tdesign-react/pull/3278))
- `TextArea`: Optimize `TextArea` initializewhen `autosize` under计算height逻辑 @HaixingOoO ([#3286](https://github.com/Tencent/tdesign-react/pull/3286))

### 🚧 Others
- `Alert`: Optimizetest用例代码typeandaddfor于 `className`, `style` test @RSS1102 ([#3284](https://github.com/Tencent/tdesign-react/pull/3284))


## 🌈 1.10.1 `2024-11-28` 
### 🚀 Features
- `DatePicker`: Add `multiple` API,用于Support日期select器multiple功能,具体using请参考example @HaixingOoO ([#3199](https://github.com/Tencent/tdesign-react/pull/3199))
- `DatePicker`: Add `disableTime` API,用于more方便地setdisablewhen间部分 @HaixingOoO ([#3226](https://github.com/Tencent/tdesign-react/pull/3226))
- `Dialog`: Add `beforeClose` and `beforeOpen` API,用于inopeningandclosedialogwhenexecutemore多callback操作 @Wesley-0808  ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
- `Drawer`: Add `beforeClose` and `beforeOpen` API,用于inopeningandclosedrawerwhenexecutemore多callback操作 @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
### 🐞 Bug Fixes

- `ColorPicker`: Fix `colorMode` 部分文案没有Support国际化 issue @l123wx ([#3221](https://github.com/Tencent/tdesign-react/pull/3221))
- `Form`: Fix `setFieldsValue` and `setFields` 没有trigger `onValuesChange`  issue @uyarn ([#3232](https://github.com/Tencent/tdesign-react/pull/3232))
- `Notification`: modify `NotificationPlugin`  `offset` propertiesdefaultvalue,使其more符合常规习惯 @huangchen1031  ([#3231](https://github.com/Tencent/tdesign-react/pull/3231))
- `Select`:
  - Fix `collapsedItems` parameter `collapsedSelectedItems` error @RSS1102 ([#3214](https://github.com/Tencent/tdesign-react/pull/3214))
  - Fixmultipledropdownselect all功能失效 issue @huangchen1031 ([#3216](https://github.com/Tencent/tdesign-react/pull/3216))
- `Table`:
  - Fix可filtertablein处理 `null`typeexceptionissue @2ue ([#3197](https://github.com/Tencent/tdesign-react/pull/3197))
  - Fixcellisnumber 0 且enabled省略whenrenderexception issue @uyarn ([#3233](https://github.com/Tencent/tdesign-react/pull/3233))
- `Tree`: Fix `scrollTo` methodscrollexceptionrowis @uyarn ([#3235](https://github.com/Tencent/tdesign-react/pull/3235))
### 📝 Documentation
- `Dialog`: Fix代码exampleerror @RSS1102 ([#3229](https://github.com/Tencent/tdesign-react/pull/3229))
### 🚧 Others
- `TextArea`: Optimize `TextArea` eventtype @HaixingOoO ([#3211](https://github.com/Tencent/tdesign-react/pull/3211))

## 🌈 1.10.0 `2024-11-15` 
### 🚀 Features
- `Select`: `collapsedItems` methodparameter `collapsedSelectedItems` 扩充is `options`,using `collapsedItems` please note thischangemore ⚠️ @RSS1102 ([#3185](https://github.com/Tencent/tdesign-react/pull/3185))
- `Icon`: @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
  - icons库Release version `0.4.0`,Add icons
  - 命名Optimize,`blockchain` 重命名改is `transform-1`,`gesture-pray-1` 重命名is `gesture-open`,`gesture-ranslation-1` 重命名is `wave-bye`, `gesture-up-1` 重命名is `gesture-typing`,`gesture-up-2` 重命名is `gesture-right-slip`,`logo-wechat` 重命名is `logo-wechat-stroke-filled`
  - Remove icons
- `Cascader`: in single selection modewhen `trigger` is `hover`  when,选inoptionafter自动close面板 @uyarn ([#3188](https://github.com/Tencent/tdesign-react/pull/3188))
- `Checkbox`: Add `title` API, 用于inoptiondisplaydisable原因等scenario @uyarn ([#3207](https://github.com/Tencent/tdesign-react/pull/3207))
- `Menu`: Add `tooltipProps` API,作用于一级menucollapsefocusappearnode @uyarn ([#3201](https://github.com/Tencent/tdesign-react/pull/3201))
- `Switch`: Add `before-change` API @centuryPark ([#3167](https://github.com/Tencent/tdesign-react/pull/3167))
- `Form`: Add `getValidateMessage` instancemethod @moecasts ([#3180](https://github.com/Tencent/tdesign-react/pull/3180))

### 🐞 Bug Fixes
- `TagInput`: Fix in `readonly` 模式under仍可byviaBackspace按keydelete已option缺陷 @RSS1102 ([#3172](https://github.com/Tencent/tdesign-react/pull/3172))
- `Form`: Fix `1.9.3` version,`FormItem` in `Form` 外set `name` properties有exception issue @l123wx ([#3183](https://github.com/Tencent/tdesign-react/pull/3183))
- `Select`: Fix valueType is object  when,clickselect allbuttonafter onChange callbackparametertypeerror issue @l123wx ([#3193](https://github.com/Tencent/tdesign-react/pull/3193))
- `Table`: Fix动态set `expandTreeNode` 没有normaldisplay子node issue @uyarn ([#3202](https://github.com/Tencent/tdesign-react/pull/3202))
- `Tree`: Fix动态切换 `expandAll` 功能exceptionissue @uyarn ([#3204](https://github.com/Tencent/tdesign-react/pull/3204))
- `Drawer`: Fix无法customized `confirmBtn` and `closeBtn`content issue @RSS1102 ([#3191](https://github.com/Tencent/tdesign-react/pull/3191))
### 📝 Documentation
- `Icon`: Optimizeicons检索功能,Supportin英文searchicons @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Popup`: Add `popperOption` usingexample @HaixingOoO  ([#3200](https://github.com/Tencent/tdesign-react/pull/3200))


## 🌈 1.9.3 `2024-10-31` 
### 🐞 Bug Fixes
- `Select`: Fix`valueDisplay`under`onClose`callbackissue @uyarn ([#3154](https://github.com/Tencent/tdesign-react/pull/3154))
- `Typography`: Fix `Typography` `Ellipsis` 功能inin文under issue @HaixingOoO ([#3158](https://github.com/Tencent/tdesign-react/pull/3158))
- `Form`: Fix `FormList` or `FormItem` datain `getFieldsValue` issue @HaixingOoO ([#3149](https://github.com/Tencent/tdesign-react/pull/3149))
- `Form`: Fix动态renderform无法using `setFieldsValue` 预设data issue @l123wx ([#3145](https://github.com/Tencent/tdesign-react/pull/3145))
- `lib`: Fix`1.9.2`upgradedependency改动cause`lib`error携带`style`causein`next`undernotavailableexception @honkinglin ([#3165](https://github.com/Tencent/tdesign-react/pull/3165))



## 🌈 1.9.2 `2024-10-17` 
### 🚀 Features
- `TimePicker`: Add `autoSwap` API,Support `1.9.0` version之after仍可by保持选定左rightwhen间size顺序 @uyarn ([#3146](https://github.com/Tencent/tdesign-react/pull/3146))
### 🐞 Bug Fixes
- `TabPanel`: Fix `label` 改change when,激活option卡bottom横线没update @HaixingOoO ([#3134](https://github.com/Tencent/tdesign-react/pull/3134))
- `Drawer`: Fixopening页面抖动 issue @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Dialog`: Fixopening `dialog` when页面抖动 issue @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Select`: Fix using `OptionGroup `when无法自动定到选in项issue @moecasts ([#3139](https://github.com/Tencent/tdesign-react/pull/3139))
### 🚧 Others
- `Loading`: Optimize live demo display效果 @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))
- `DatePicker`: Removedocumentationinerror `value` typedescription @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))

## 🌈 1.9.1 `2024-09-26` 
### 🚀 Features
- `ImageViewer`: Optimizeimage预览旋转reset效果 @sylsaint ([#3108](https://github.com/Tencent/tdesign-react/pull/3108))
- `Table`: 可expandcollapsescenariounderAdd `t-table__row--expanded` and `t-table__row--folded` 用于区分expandandcollapserow @uyarn ([#3099](https://github.com/Tencent/tdesign-react/pull/3099))
- `TimePicker`: Supportwhen间区间select器自动Adjust左右区间 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Rate`: Add `clearable` API,用于clear评分 @HaixingOoO ([#3114](https://github.com/Tencent/tdesign-react/pull/3114))
### 🐞 Bug Fixes
- `Dropdown`: Fixset `panelTopContent` after子menu `top` 计算error issue @moecasts ([#3106](https://github.com/Tencent/tdesign-react/pull/3106))
- `TreeSelect`: modifymultiplestateunderdefaultclick父nodeoptionrowisis选in,如果需要clickexpand,请configure `treeProps.expandOnClickNode` @HaixingOoO ([#3111](https://github.com/Tencent/tdesign-react/pull/3111))
- `Menu`: Fix二级menuexpandcollapsestatenot associatedright箭头change化 issue @uyarn ([#3110](https://github.com/Tencent/tdesign-react/pull/3110))
- `DateRangePicker`: Fixconfigurewhen间related格式 when,没有正确处理 `defaultTime`  issue @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `DatePicker`: Fix周select器under,年份边界日期return格式error issue @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `ColorPicker`:
  - Fix部分scenariounder子component存induplicate renderingexceptionissue @uyarn ([#3118](https://github.com/Tencent/tdesign-react/pull/3118))
  - Fix渐change模式under,明度sliderand渐changeslidercolornot联动 issue @huangchen1031 ([#3109](https://github.com/Tencent/tdesign-react/pull/3109))
### 🚧 Others
- `Site`: 站点切换语言whencomponent跟随切换语言 @RSS1102 ([#3100](https://github.com/Tencent/tdesign-react/pull/3100))
- `Form`: Addcustomizedform控件documentationdescriptionandexample @miownag  ([#3112](https://github.com/Tencent/tdesign-react/pull/3112))

## 🌈 1.9.0 `2024-09-12` 

### 🚀 Features

- `Tag`: modify `maxWidth` take effect DOM node,方便控制textcontent长度,有基于this特性modifystyleplease note thischangemore ⚠️ @liweijie0812 ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `Form`:
  - Fix `name` usingunder划线拼接causeusingunder划线做 `name` 计算error,有using特殊字符做form项 `name` please note thischangemore ⚠️ @HaixingOoO ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
  - add `whitespace` validatedefaulterror信息 @liweijie0812 ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
  - Support原生 `id` properties,用于with `Button` 原生 `Form` properties实现formsubmit功能 @HaixingOoO ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Card`: `loading` propertiesadd `TNode` Support @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Cascader`: Add `panelTopContent` and `panelBottomContent`,用于自定应该面板topandbottomcontent @HaixingOoO ([#3096](https://github.com/Tencent/tdesign-react/pull/3096))
- `Checkbox`: Fix `readonly` understyle issue @HaixingOoO ([#3077](https://github.com/Tencent/tdesign-react/pull/3077))
- `Tag`: AddSupport `title` API,Supportcustomized `title` configure @HaixingOoO ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `Tree`: Add `allowDrop` API,用于限制dragscenariousing @uyarn ([#3098](https://github.com/Tencent/tdesign-react/pull/3098))

### 🐞 Bug Fixes

- `Card`: Fix `loading` 切换state会cause子node重新render issue @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Dialog`: Fix `Header` is `null`,configure `closeBtn` 仍然render `Header`  issue @HaixingOoO ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Input`: Fix计算 `emoji` 字符error issue @novlan1 ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Popup`: Fix `1.8.0` after version针for `Popup` Optimizecause 16.x versionunderexceptionissue @moecasts ([#3091](https://github.com/Tencent/tdesign-react/pull/3091))
- `Statistic`: Fix `classname` and `style` 未pass through功能exception issue @liweijie0812 ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TimePicker`: Fix `format` 仅Support HH:mm:ss 格式 issue @liweijie0812 ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))


## 🌈 1.8.1 `2024-08-23` 
### 🐞 Bug Fixes
- `Select`: Fixcustomized `content` whenwhen opening and closing dropdown issue @uyarn ([#3058](https://github.com/Tencent/tdesign-react/pull/3058))
- `Rate`: Fix `1.8.0` versionin评分descriptionnotshow issue @liweijie0812 ([#3060](https://github.com/Tencent/tdesign-react/pull/3060))
- `Popup`: Fix `panel` is null scenariounder部分eventcallbackmissinganderror issue @uyarn ([#3061](https://github.com/Tencent/tdesign-react/pull/3061))

## 🌈 1.8.0 `2024-08-22` 
### 🚀 Features
- `Empty`: Add `Empty` 空statecomponent @ZWkang @HaixingOoO @double-deng ([#2817](https://github.com/Tencent/tdesign-react/pull/2817))
- `ConfigProvider`: Support `colonText` propertiesconfigure `Descriptions`, `Form` component `colon` properties @liweijie0812 ([#3055](https://github.com/Tencent/tdesign-react/pull/3055))

### 🐞 Bug Fixes
- `ColorPicker`: Fix `slider` 部分in鼠标移入移出缺陷 @Jippp ([#3042](https://github.com/Tencent/tdesign-react/pull/3042))
- `useVirtualScroll`: modify `visibleData` 计算方式,解决可视区域过高 when,scrollafterbottom留白 issue @huangchen1031 ([#2999](https://github.com/Tencent/tdesign-react/pull/2999))
- `Table`: Fix drag sort when,祖先node内顺序error issue @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `InputNumber`: Fix小数点精度计算,by 0 开头计算边界逻辑missingcause计算error issue @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Popup`: Fix某些scenariounder,hidewhen定会闪烁 issue @HaixingOoO ([#3052](https://github.com/Tencent/tdesign-react/pull/3052))

### 🚧 Others
- `Popup`: Fix官网`Popup`置displayissue @HaixingOoO ([#3048](https://github.com/Tencent/tdesign-react/pull/3048))
- `DatePicker`: Fix presets example代码error issue @uyarn ([#3050](https://github.com/Tencent/tdesign-react/pull/3050))

## 🌈 1.7.9 `2024-08-07` 
### 🐞 Bug Fixes
- `Tree`:  Fix`1.7.8`versionupdatecauseexpandcollapse功能缺陷 @HaixingOoO ([#3039](https://github.com/Tencent/tdesign-react/pull/3039))


## 🌈 1.7.8 `2024-08-01` 
### 🚀 Features
- `ConfigProvider`: Add `attach` API, Support全局configureattachor全局configure部分componentattach @HaixingOoO ([#3001](https://github.com/Tencent/tdesign-react/pull/3001))
- `DatePicker`: Add `needConfirm` API,Support日期when间select器not需要clickconfirmbuttonsaveselectwhen间 @HaixingOoO ([#3011](https://github.com/Tencent/tdesign-react/pull/3011))
- `DateRangePicker` Support `borderless` 模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `RangeInput`: Support `borderless` 模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `TimeRangePicker`: Support `borderless` 模式 @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Descriptions`: layout typedefineAdjustisstring多type @liweijie0812 ([#3021](https://github.com/Tencent/tdesign-react/pull/3021))
- `Rate`: 评分componentSupport国际化configure @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
### 🐞 Bug Fixes
- `Upload`: Fix部分iconsnotSupport全局替换 issue @uyarn ([#3009](https://github.com/Tencent/tdesign-react/pull/3009))
- `Select`: Fix `Select`  `label` and `prefixIcon` multiplestateundershowissue @HaixingOoO ([#3019](https://github.com/Tencent/tdesign-react/pull/3019))
- `Tree`: Fix部分scenariounder首个子nodeset `checked` aftercause整个treeinitializestateexception issue @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
- `DropdownItem`: Fixdisablestateaffectcomponent本身responserowis缺陷 @uyarn ([#3024](https://github.com/Tencent/tdesign-react/pull/3024))
- `TagInput`: `onDragSort` inusing `useRef` causecontexterror @Heising ([#3003](https://github.com/Tencent/tdesign-react/pull/3003))
### 🚧 Others
- `Dialog`: Fix置exampleerrorissue @novlan1 ([#3005](https://github.com/Tencent/tdesign-react/pull/3005))
- `RangeInput`: add`liveDemo` @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))

## 🌈 1.7.7 `2024-07-18` 
### 🚀 Features
- `Icon`: Add icons `list-numbered`,Optimize`lock-off`绘制path @DOUBLE-DENG ([icon#9f4acfd](https://github.com/Tencent/tdesign-icons/commit/9f4acfdda58f84f9bca71a22f033e27127dd26db))
- `BreadcrumbItem`: add `tooltipProps` extend,方便定制内置 `tooltip` relatedproperties @carolin913 ([#2990](https://github.com/Tencent/tdesign-react/pull/2990))
- `ImageViewer`: Add `attach` API,Supportcustomized挂载node @HaixingOoO ([#2995](https://github.com/Tencent/tdesign-react/pull/2995))
- `Drawer`: Add `onSizeDragEnd` API,用于需要drag缩放callbackscenario @NWYLZW ([#2975](https://github.com/Tencent/tdesign-react/pull/2975))

### 🐞 Bug Fixes
- `Icon`: Fixicons`chart-column`命名errorissue @uyarn ([#2979](https://github.com/Tencent/tdesign-react/pull/2979))
- `Input`: Fixdisablestateunder仍可by切换明文密文 issue @uyarn ([#2991](https://github.com/Tencent/tdesign-react/pull/2991))
- `Table`: @uyarn
    - Fix只存in一column可dragtable缩小whenstyleexceptionissue ([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
    - Fix部分scenariounder向前缩放whenerror issue([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
    - Fix空dataunderdisplaycontent没有居indisplay issue ([#2996](https://github.com/Tencent/tdesign-react/pull/2996))
### 🚧 Others
- docs(Checkbox): Optimize`Checkbox`documentationcontent @Heising  ([common#1835](https://github.com/Tencent/tdesign-common/pull/1835))


## 🌈 1.7.6 `2024-06-27` 
### 🚀 Features
- `Tabs`: Supportvia滚轮or者触摸板进rowscroll操作,Add `scrollPosition` API,Supportconfigure选insliderscroll最终停留置 @oljc ([#2954](https://github.com/Tencent/tdesign-react/pull/2954))
- `ImageViewer`: Add `isSvg` properties,Support原生 `SVG` 预览show,用于for `SVG` 进row操作scenario @HaixingOoO ([#2958](https://github.com/Tencent/tdesign-react/pull/2958))
- `Input`: Add `spellCheck` API @NWYLZW ([#2941](https://github.com/Tencent/tdesign-react/pull/2941))

### 🐞 Bug Fixes
- `DatePicker`: Fix单独using `DateRangePickerPanel` 面板头部click逻辑and `DateRangePicker` not一致 issue @uyarn ([#2944](https://github.com/Tencent/tdesign-react/pull/2944))
- `Form`: Fix嵌套 `FormList` scenariounderusing `shouldUpdate` cause循环render issue @moecasts ([#2948](https://github.com/Tencent/tdesign-react/pull/2948))
- `Tabs`: Fix `1.7.4` after version,`Tabs`  className affect `TabItem`  issue @uyarn ([#2946](https://github.com/Tencent/tdesign-react/pull/2946))
- `Table`: 
  - Fix `usePagination` in `pagination` 动态change化功能issue @HaixingOoO ([#2960](https://github.com/Tencent/tdesign-react/pull/2960))
  - Fix鼠标右keytable也可bytriggercolumn宽drag issue @HaixingOoO ([#2961](https://github.com/Tencent/tdesign-react/pull/2961))
  - Fix只存in一column可被 resize usingscenariounder,drag功能exception issue @uyarn ([#2959](https://github.com/Tencent/tdesign-react/pull/2959))

### 🚧 Others
- 站点全量Add TypeScript example代码 @uyarn @HaixingOoO @ZWkang  ([#2871](https://github.com/Tencent/tdesign-react/pull/2871))


## 🌈 1.7.5 `2024-05-31` 
### 🐞 Bug Fixes
- `DatePicker`: Fix click`jump`button逻辑没有syncunder拉select改动缺陷 @uyarn ([#2934](https://github.com/Tencent/tdesign-react/pull/2934))

## 🌈 1.7.4 `2024-05-30` 
### 🚀 Features
- `DatePicker`: Optimize日期区间select器头部区间change化逻辑,selectafterleft区间大于right区间,则defaultAdjustisleft区间始终比right区间小 1 @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
### 🐞 Bug Fixes
- `Cascader`: Fix `Cascader` searchwhen `checkStrictly` 模式父nodenotshow @HaixingOoO ([#2914](https://github.com/Tencent/tdesign-react/pull/2914))
- `Select`: Fix半选stateselect alloptiondisplaystyle issue @uyarn ([#2915](https://github.com/Tencent/tdesign-react/pull/2915))
- `Menu`: Fix `HeadMenu` under `MenuItem` class namepass through失效 issue @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `TabPanel`: Fixclass namepass through失效 issue @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Breadcrumb`: Fix暗色模式under分隔符notvisibleissue @NWYLZW ([#2920](https://github.com/Tencent/tdesign-react/pull/2920))
- `Checkbox`:
   - Fix无法renderisvalueis 0 option @NWYLZW ([#2925](https://github.com/Tencent/tdesign-react/pull/2925))
   - Fixaffected by控statecannot be onChange callbackin正确消费 issue @NWYLZW ([#2926](https://github.com/Tencent/tdesign-react/pull/2926))
- `SelectInput`: Fix `interface.d.ts` 文件missing `size` type issue @HaixingOoO ([#2930](https://github.com/Tencent/tdesign-react/pull/2930))
- `DatePicker`: Fix单独using面板没有compatible无 `onMonthChange` callbackscenario issue @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
- `DateRangePickerPanel`: Fix indropdowninselect年/月whenselectappear日期改change错乱 issue @liyucang-git ([#2922](https://github.com/Tencent/tdesign-react/pull/2922))
- `InputNumber`: Fix `allowInputOverLimit=false` sizevaluejudgment when,value is undefined  when,会appearshow Infinity  issue @HaixingOoO ([common#1802](https://github.com/Tencent/tdesign-common/pull/1802))

## 🌈 1.7.3 `2024-05-18` 
### 🐞 Bug Fixes
- `Menu`: Fix二级及byunder `Submenu` 没有处理 classname 缺陷 @uyarn ([#2911](https://github.com/Tencent/tdesign-react/pull/2911))
- `Upload`: Fix手动uploadbug @HaixingOoO ([#2912](https://github.com/Tencent/tdesign-react/pull/2912))
- `Avatar`: FixwithPopupusingpopupnotdisplayexception @uyarn

## 🌈 1.7.1 `2024-05-16`

### 🚀 Features
- `Avatar`: Add `Click`, `Hover` and `Contextmenu` 等鼠标event,Supportforavatar操作scenariousing @NWYLZW ([#2906](https://github.com/Tencent/tdesign-react/pull/2906))
- `Dialog`: Support `setConfirmLoading` using @ZWkang ([#2883](https://github.com/Tencent/tdesign-react/pull/2883))
- `SelectInput`: Support `size` properties @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `TimePicker`: AddSupport `onPick` event and `presets` API @ZWkang ([#2902](https://github.com/Tencent/tdesign-react/pull/2902))
- `Input`: Add `borderless` API,Support无border模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `AutoComplete`: Add `borderless` API,Support无border模式 @uyarn ([#2884](https://github.com/Tencent/tdesign-react/pull/2884))
- `ColorPicker`: Add `borderless` API,Support无border模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `DatePicker`: Add `borderless` API,Support无border模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `TagInput`: Add `borderless` API,Support无border模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `TimePicker`: Add `borderless` API,Support无border模式 @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Scroll`: Adjust `1.6.0` after针for Chrome scroll条stylecompatiblemethod,notdependency`autoprefixer`version @loopzhou ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
### 🐞 Bug Fixes
- `ColorPicker`: Fix切换预览color when,通道button置notchange issue @fennghuang ([#2880](https://github.com/Tencent/tdesign-react/pull/2880))
- `Form`: Fix由于 `FormItem`modify,没有triggerlisten`FormList``useWatch` issue @HaixingOoO ([#2904](https://github.com/Tencent/tdesign-react/pull/2904))
- `Menu`: @uyarn 
  - Fix using`dist`style因isstyle优先级issuecause子menu置偏移 issue ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
  - improve `t-popup__menu` style优先级,解决 dist 内style优先级一致causestyleexception issue ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Pagination`: Fixwhen前页input小数after没有自动Adjust issue @uyarn ([#2886](https://github.com/Tencent/tdesign-react/pull/2886))
- `Select`: 
   - Fix `creatable` 功能exceptionissue @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - Fix `reserveKeyword` with `Option Children` 用法exceptionissue @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - Optimize已选style覆盖已disablestyle issue @fython ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Slider`: Fix `sliderRef.current` 可能is空 issue @ZWkang ([#2868](https://github.com/Tencent/tdesign-react/pull/2868))
- `Table`: 
  - Fix卸载tablewhendatais空causeerrorexception @duxphp ([#2900](https://github.com/Tencent/tdesign-react/pull/2900))
  - Fix `1.5.0` after version部分scenariounderusingfixedcolumncauseexception issue @uyarn ([#2889](https://github.com/Tencent/tdesign-react/pull/2889))
- `TagInput`:
  - Fix没有pass through `tagProps` 到collapseoption issue @uyarn ([#2869](https://github.com/Tencent/tdesign-react/pull/2869))
  - extend `collapsedItems` delete功能 @HaixingOoO ([#2881](https://github.com/Tencent/tdesign-react/pull/2881))
- `TreeSelect`: Fix需要via `treeProps` set `keys` properties才take effect issue @ZWkang ([#2896](https://github.com/Tencent/tdesign-react/pull/2896))
- `Upload`: 
  - Fix手动modifyupload进度 bug @HaixingOoO ([#2901](https://github.com/Tencent/tdesign-react/pull/2901))
  - Fiximageuploaderrortypeunderstyleexception issue @uyarn ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
### 🚧 Others
- `TagInput`: 补充 `Size` propertiesrelateddocumentation @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Typography`: delete多余 `defaultProps` @HaixingOoO ([#2866](https://github.com/Tencent/tdesign-react/pull/2866))
- `Upload`: Fixdocumentationin关于 OPTIONS methoddescription @Summer-Shen ([#2865](https://github.com/Tencent/tdesign-react/pull/2865))
  
## 🌈 1.7.0 `2024-04-25` 
### 🚀 Features
- `Typography`: Add `Typography` 排版component @insekkei ([#2821](https://github.com/Tencent/tdesign-react/pull/2821))
### 🐞 Bug Fixes
- `Table`: in `effect` async里executegetdatawhenandupdatedata,可能会cause一些 bug @HaixingOoO ([#2848](https://github.com/Tencent/tdesign-react/pull/2848))
- `DatePicker`: Fix日期select器in月份select回跳初始stateexception @uyarn ([#2854](https://github.com/Tencent/tdesign-react/pull/2854))
- `Form`: `useWatch` in一定情况under,name not同会causeviewissue缺陷 @HaixingOoO ([#2853](https://github.com/Tencent/tdesign-react/pull/2853))
- `Drawer`: Fix `1.6.0` closeBtn propertiesdefaultvaluelost issue @uyarn ([#2856](https://github.com/Tencent/tdesign-react/pull/2856))
- `Dropdown`: Fixoption长度is空仍displaypopup issue @uyarn ([#2860](https://github.com/Tencent/tdesign-react/pull/2860))
- `Dropdown`: Optimize `Dropdown`  `children` pass through `disabled` @HaixingOoO ([#2862](https://github.com/Tencent/tdesign-react/pull/2862))
- `SelectInput`: Fix非affected by控properties `defaultPopupVisible` nottake effect issue @uyarn ([#2861](https://github.com/Tencent/tdesign-react/pull/2861))
- `Style`: Fix部分node前缀无法统一替换缺陷 @ZWkang  @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))
- `Upload`: Fix `method` 枚举value `options` error issue @summer-shen @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))

## 🌈 1.6.0 `2024-04-11` 
### 🚀 Features
- `Portal`: `Portal` Add懒load `forceRender`,defaultis `lazy` 模式,Optimizeperformance,compatible `SSR` render,for `Dialog` and `Drawer` component可能存in破坏性affect ⚠️ @HaixingOoO ([#2826](https://github.com/Tencent/tdesign-react/pull/2826))
### 🐞 Bug Fixes
- `ImageViewer`: Fix `imageReferrerpolicy` 没有fortop缩略图take effect issue @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))
- `Descriptions`: Fix `props` missing `className` and `style` properties issue @HaixingOoO ([#2818](https://github.com/Tencent/tdesign-react/pull/2818))
- `Layout`: Fix `Layout` add `Aside` 页面layout会跳动 issue @HaixingOoO ([#2824](https://github.com/Tencent/tdesign-react/pull/2824))
- `Input`: Fix in `React16` versionunder阻止冒泡failure issue @HaixingOoO ([#2833](https://github.com/Tencent/tdesign-react/pull/2833))
- `DatePicker`: Fix `1.5.3` version之after处理Datetypeand周select器exception @uyarn ([#2841](https://github.com/Tencent/tdesign-react/pull/2841))
- `Guide`:  
     - Optimize `SSR` underusingissue @HaixingOoO ([#2842](https://github.com/Tencent/tdesign-react/pull/2842))
     - Fix `SSR` scenarioundercomponentinitializerender置exception issue @uyarn ([#2832](https://github.com/Tencent/tdesign-react/pull/2832))
- `Scroll`: Fix由于 `Chrome 121` versionSupport scroll width 之aftercause `Table`, `Select` 及部分appearscroll条componentstyleexceptionissue @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765)) @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Locale`: Optimize `DatePicker` 部分模式语言package @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Tree`: Fixinitializeafter `draggable` propertieslostresponse式 issue @Liao-js ([#2838](https://github.com/Tencent/tdesign-react/pull/2838))
- `Style`: Supportvia `less` 总入口打packagestyle需求 @NWYLZW @uyarn ([common#1757](https://github.com/Tencent/tdesign-common/pull/1757)) ([common#1766](https://github.com/Tencent/tdesign-common/pull/1766))


## 🌈 1.5.5 `2024-03-28` 
### 🐞 Bug Fixes
- `ImageViewer`: Fix `imageReferrerpolicy` 没有fortop缩略图take effect issue @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))

## 🌈 1.5.4 `2024-03-28` 
### 🚀 Features
- `ImageViewer`: Add `imageReferrerpolicy` API,Supportwith Image component需要configure Referrerpolicy scenario @uyarn ([#2813](https://github.com/Tencent/tdesign-react/pull/2813))
### 🐞 Bug Fixes
- `Select`: Fix `onRemove` event没有normaltrigger issue @Ali-ovo ([#2802](https://github.com/Tencent/tdesign-react/pull/2802))
- `Skeleton`: Fix`children`is必须type issue @uyarn ([#2805](https://github.com/Tencent/tdesign-react/pull/2805))
- `Tabs`: 提供 `action` 区域defaultstyle @HaixingOoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Locale`: Fix`image`and`imageViewer` 英语语言packageexception issue @uyarn  @HaixingOoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Image`: `referrerpolicy` parameter被error传递到外层 `div` 上,实际传递目标is原生 `image` tag @NWYLZW ([#2811](https://github.com/Tencent/tdesign-react/pull/2811))

## 🌈 1.5.3 `2024-03-14` 
### 🚀 Features
- `BreadcrumbItem`: Support `onClick` event @HaixingOoO ([#2795](https://github.com/Tencent/tdesign-react/pull/2795))
- `Tag`: componentAdd `color` API,Supportcustomizedcolor @maoyiluo  @uyarn ([#2799](https://github.com/Tencent/tdesign-react/pull/2799))
### 🐞 Bug Fixes
- `FormList`: Fix多个component卡死 issue @HaixingOoO ([#2788](https://github.com/Tencent/tdesign-react/pull/2788))
- `DatePicker`: Fix `format` and `valueType` not一致scenariounder计算error issue @uyarn ([#2798](https://github.com/Tencent/tdesign-react/pull/2798))
### 🚧 Others
- `Portal`: addPortaltest用例 @HaixingOoO ([#2791](https://github.com/Tencent/tdesign-react/pull/2791))
- `List`: improve List test用例 @HaixingOoO ([#2792](https://github.com/Tencent/tdesign-react/pull/2792))
- `Alert`: improve Alert test,Optimize代码 @HaixingOoO ([#2793](https://github.com/Tencent/tdesign-react/pull/2793))

## 🌈 1.5.2 `2024-02-29` 
### 🚀 Features
- `Cascader`: Add `valueDisplay`and`label` APISupport @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Descriptions`: componentSupport嵌套 @HaixingOoO ([#2777](https://github.com/Tencent/tdesign-react/pull/2777))
- `Tabs`: Adjust激活 `Tab` under划线and `TabHeader` borderlevel关系 @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
### 🐞 Bug Fixes
- `Grid`: dimension计算error,widthcompatibleexception @NWYLZW ([#2738](https://github.com/Tencent/tdesign-react/pull/2738))
- `Cascader`: Fix`clearable`click清除buttontrigger三次`onChange` issue @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Dialog`: Fix`useDialogPosition`render多次绑定event @HaixingOoO ([#2749](https://github.com/Tencent/tdesign-react/pull/2749))
- `Guide`: Fixcustomizedcontent功能失效 @zhangpaopao0609 ([#2752](https://github.com/Tencent/tdesign-react/pull/2752))
- `Tree`: Fixset `keys.children` afterexpandicons没有normalchange化 issue @uyarn ([#2746](https://github.com/Tencent/tdesign-react/pull/2746))
- `Tree`: Fix `Tree` customizedlabel `setData` 没有render issue @HaixingOoO ([#2776](https://github.com/Tencent/tdesign-react/pull/2776))
- `Tree`: Fixset `Tree` width,`TreeItem`  `checkbox` 会被compress,`label` 省略号失效 issue @HaixingOoO  @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
- `Select`: @uyarn 
    - Fixviascrollloadoption选inafterscrollrowisexception issue ([#2779](https://github.com/Tencent/tdesign-react/pull/2779))
    - Fix using `size` API  when,virtual scroll功能exceptionissue  ([#2756](https://github.com/Tencent/tdesign-react/pull/2756))

## 🌈 1.5.1 `2024-01-25` 
### 🚀 Features
- `Popup`: Support `Plugin` 方式using. @HaixingOoO ([#2717](https://github.com/Tencent/tdesign-react/pull/2717))
- `Transfer`: Support `direction` API @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Tabs`: Add `action` API,Supportcustomizedright区域 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
### 🐞 Bug Fixes
- `Pagination`: `Jump to` Adjustis大写,保持一致性 @wangyewei ([#2716](https://github.com/Tencent/tdesign-react/pull/2716))
- `Table`: Fix`Modal`里`Form`form,using`shouldUpdate`卸载有when无法找到formmethod. @duxphp ([#2675](https://github.com/Tencent/tdesign-react/pull/2675))
- `Table`: column宽Adjustandrowexpandscenario,Fixrowexpand when,会resetcolumn宽Adjust结果issue @chaishi ([#2722](https://github.com/Tencent/tdesign-react/pull/2722))
- `Select`: Fix`Select`multiplestateunder选incontentscroll issue. @HaixingOoO ([#2721](https://github.com/Tencent/tdesign-react/pull/2721))
- `Transfer`: Fix `disabled` API功能exception issue @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Swiper`: Fix向左切换轮播动画when顺序错乱 issue @HaixingOoO ([#2725](https://github.com/Tencent/tdesign-react/pull/2725))
- `Form`: Fix计算 `^` 字符exception issue @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Loading`: Fix未set `z-index` defaultvalue issue @betavs ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `CheckTag`: Fixset `className` 会覆盖all已有class name缺陷  @uyarn ([#2730](https://github.com/Tencent/tdesign-react/pull/2730))
- `TreeSelect`: Fix `onEnter` eventnottrigger issue @uyarn ([#2731](https://github.com/Tencent/tdesign-react/pull/2731))
- `Menu`: Fix `collapsed`  `scroll` style @Except10n ([#2718](https://github.com/Tencent/tdesign-react/pull/2718))
- `Cascader`: Fix长listscenariounder,in `Safari` inusingstyleexceptionissue @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))

## 🌈 1.5.0 `2024-01-11` 
### 🚨 Breaking Changes
- `Dialog`: 该versionmove `className` error挂载进rowFix,现in `className` 只会被挂载到 `Dialog` 上层containerelement Context 之in.如果你需要直接modify `Dialog` 本体style,可by切换usingis `dialogClassName` 进rowmodify.
### 🚀 Features
- `Descriptions`: Add `Descriptions` descriptioncomponent @HaixingOoO ([#2706](https://github.com/Tencent/tdesign-react/pull/2706))
- `Dialog`: add `dialogClassName` 用于处理internal dialog nodestyle.建议之前via `className` 直接modifydialog本体style用户切换usingis `dialogClassName` @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
### 🐞 Bug Fixes
- `Cascader`: Fix Cascader  `trigger=hover` filter之after,select操作存inexception bug @HaixingOoO ([#2702](https://github.com/Tencent/tdesign-react/pull/2702))
- `Upload`: Fix Upload  `uploadFilePercent` type未define @betavs ([#2703](https://github.com/Tencent/tdesign-react/pull/2703))
- `Dialog`: Fix Dialog  `className` 进row多次node挂载error,`className` move仅被挂载to ctx element上 @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
- `TreeSelect`: Fix `suffixIcon` error并addrelatedexample @Ali-ovo ([#2692](https://github.com/Tencent/tdesign-react/pull/2692))

## 🌈 1.4.3 `2024-01-02` 
### 🐞 Bug Fixes
- `AutoComplete`: Fix`ActiveIndex=-1`没匹配 when,回车会error issue @Ali-ovo ([#2300](https://github.com/Tencent/tdesign-react/pull/2300))
- `Cascader`: Fix`1.4.2` Cascadersinglefilterundernottrigger选in缺陷 @HaixingOoO ([#2700](https://github.com/Tencent/tdesign-react/pull/2700))


## 🌈 1.4.2 `2023-12-28` 
### 🚀 Features
- `Card`: add `LoadingProps` properties @HaixingOoO ([#2677](https://github.com/Tencent/tdesign-react/pull/2677))
- `DatePicker`: `DateRangePicker` Add `cancelRangeSelectLimit`,Supportnot限制 RangePicker select前after范围 @uyarn ([#2684](https://github.com/Tencent/tdesign-react/pull/2684))
- `Space`: elementis空 when,not再render一个子element @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - AddSupportusing `uploadPastedFiles` 粘贴upload文件
  - input框typeuploadcomponent,Addclass name `t-upload--theme-file-input`
  - AddSupport `uploadPastedFiles`,表示allow粘贴upload文件
  - Add `cancelUploadButton` and `uploadButton`,Supportcustomizeduploadbuttonandcanceluploadbutton
  - Add `imageViewerProps`,pass throughimage预览componentallproperties 
  - Add `showImageFileName`,to control是否showimage名称
  - Supportpass indefaultvalueis非array形式
  - Support `fileListDisplay=null`  when,hide文件list；并Addmore加完整 `fileListDisplay` parameter,用于customized UI
### 🐞 Bug Fixes
- `Table`:  asyncget最新tree形structuredata when,优先using `window.requestAnimationFrame` function,by防闪屏 @lazybonee ([#2668](https://github.com/Tencent/tdesign-react/pull/2668))
- `Table`: Fix筛选valueis `0/false`  when,筛选iconsnot能highlightissue @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Cascader`: Fixcomponentin filter 之after进rowselect操作and清除content存inexception bug @HaixingOoO ([#2674](https://github.com/Tencent/tdesign-react/pull/2674))
- `ColorPicker`: 全局set `border-box` aftercausecolorliststyle issue @carolin913
- `Pagination`: move总数单 `项` 改is `条` , 保持content一致性  @dinghuihua ([#2679](https://github.com/Tencent/tdesign-react/pull/2679))
- `InputNumber`: Fix `min=0` or `max=0` 限制invalid issue @chaishi ([#2352](https://github.com/Tencent/tdesign-react/pull/2352))
- `Watermark`: Fixrow内 style cause无法 sticky 定issue @carolin913 ([#2685](https://github.com/Tencent/tdesign-react/pull/2685))
- `Calendar`: Fix卡片模式under未normaldisplay周信息缺陷 @uyarn ([#2686](https://github.com/Tencent/tdesign-react/pull/2686))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - Fix手动upload when,无法updateupload进度issue
  - Fix `uploadFilePercent` parametertype issue
    
 ## 🌈 1.4.1 `2023-12-14` 
### 🚀 Features
- `Radio`: Supportvia空格key（Space）选inoption @liweijie0812 ([#2638](https://github.com/Tencent/tdesign-react/pull/2638))
- `Dropdown`: Removefor left  item style特殊处理 @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
### 🐞 Bug Fixes
- `AutoComplete`: Fix部分特殊字符匹配error issue  @ZWkang ([#2631](https://github.com/Tencent/tdesign-react/pull/2631))
- `DatePicker`: Fix日期clickclearcontentwhendialog会闪烁缺陷 @HaixingOoO ([#2641](https://github.com/Tencent/tdesign-react/pull/2641))
- `DatePicker`: Fix日期selectdisableafter,after缀iconscolor改change issue @HaixingOoO  @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
- `DatePicker`: Fixdisablestateunderclickcomponent边缘仍能show `Panel` @Zz-ZzzZ ([#2653](https://github.com/Tencent/tdesign-react/pull/2653))
- `Dropdown`: Fixunder拉menudisablestate可click issue @betavs ([#2648](https://github.com/Tencent/tdesign-react/pull/2648))
- `DropdownItem`: Fix遗漏 `Divider` type缺陷 @uyarn ([#2649](https://github.com/Tencent/tdesign-react/pull/2649))
- `Popup`: Fix `disabled` properties未take effect缺陷 @uyarn ([#2665](https://github.com/Tencent/tdesign-react/pull/2665))
- `Select`: Fix `InputChange` eventinblurwhentriggerexception issue @uyarn ([#2664](https://github.com/Tencent/tdesign-react/pull/2664))
- `SelectInput`: Fix popup contentwidth计算issue @HaixingOoO ([#2647](https://github.com/Tencent/tdesign-react/pull/2647))
- `ImageViewer`: image预览adddefault缩放比例and按under ESC when是否triggerimage预览器closeevent @HaixingOoO ([#2652](https://github.com/Tencent/tdesign-react/pull/2652))
- `Table`: @chaishi
    - Fix `EnhancedTable` treenode无法normalexpandissue ([#2661](https://github.com/Tencent/tdesign-react/pull/2661))
    - Fixvirtual scrollscenario,treenode无法expandissue ([#2659](https://github.com/Tencent/tdesign-react/pull/2659))

 ## 🌈 1.4.0 `2023-11-30`
### 🚀 Features

- `Space`: compatibleSupportcomponent spacingin低级browserin呈现 @chaishi ([#2602](https://github.com/Tencent/tdesign-react/pull/2602))
- `Statistic`: Add统计数valuecomponent @HaixingOoO ([#2596](https://github.com/Tencent/tdesign-react/pull/2596))

### 🐞 Bug Fixes

- `ColorPicker`: Fix `format` is `hex`  when,with `enableAlpha` Adjustopacitynottake effect issue @uyarn ([#2628](https://github.com/Tencent/tdesign-react/pull/2628))
- `ColorPicker`: Fixmodifycolor上方滑杆buttoncolornotchange @HaixingOoO ([#2615](https://github.com/Tencent/tdesign-react/pull/2615))
- `Table`: Fix `lazyLoad` 懒load效果 @chaishi ([#2605](https://github.com/Tencent/tdesign-react/pull/2605))
- `Tree`: 
    - Fixtreecomponentnode `open class` state控制逻辑errorcausestyleexception @NWYLZW ([#2611](https://github.com/Tencent/tdesign-react/pull/2611))
    - 指定scroll到特定node API in `key` and `index` 应isoptional @uyarn ([#2626](https://github.com/Tencent/tdesign-react/pull/2626))
- `Drawer`: Fix `mode` is `push` when,推开content区域is drawer node父node. @HaixingOoO ([#2614](https://github.com/Tencent/tdesign-react/pull/2614))
- `Radio`: Fixform `disabled` 未take effectin `Radio 上 issue @li-jia-nan ([#2397](https://github.com/Tencent/tdesign-react/pull/2397))
- `Pagination`: Fixwhen `total` is 0 并且 `pageSize` 改change when,`current` valueis 0  issue @betavs ([#2624](https://github.com/Tencent/tdesign-react/pull/2624))
- `Image`: Fiximagein SSR 模式undernot会trigger原生event @HaixingOoO ([#2616](https://github.com/Tencent/tdesign-react/pull/2616))

 ## 🌈 1.3.1 `2023-11-15` 
### 🚀 Features
- `Upload`: dragupload文件scenario,即使文件typeerror,也trigger `drop` event @chaishi ([#2591](https://github.com/Tencent/tdesign-react/pull/2591))
### 🐞 Bug Fixes
- `Tree`: 
    - Fixnotadd `activable` parameter也可trigger `onClick` event @HaixingOoO ([#2568](https://github.com/Tencent/tdesign-react/pull/2568))
    - Fixeditabletableeditcomponent之间联动nottake effect @HaixingOoO ([#2572](https://github.com/Tencent/tdesign-react/pull/2572))
- `Notification`: 
    - Fix连续弹两个 `Notification`,第一次实际只show一个 @HaixingOoO ([#2595](https://github.com/Tencent/tdesign-react/pull/2595))
    - using `flushSync` in `useEffect` in会warning,现in改用循环 `setTimeout 来处理 @HaixingOoO ([#2597](https://github.com/Tencent/tdesign-react/pull/2597))
- `Dialog`: 
    - Fix `Dialog` in 引入 `Input` component,从 `Input` in间input光标会navigate到最after @HaixingOoO ([#2485](https://github.com/Tencent/tdesign-react/pull/2485))
    - Fixdialog头部titleshowaffectcancelbutton置 @HaixingOoO ([#2593](https://github.com/Tencent/tdesign-react/pull/2593))
- `Popup`: Fix `PopupRef` typemissingissue @Ricinix ([#2577](https://github.com/Tencent/tdesign-react/pull/2577))
- `Tabs`: Fix重复click激活option卡,也会trigger `onChange` event. @HaixingOoO ([#2588](https://github.com/Tencent/tdesign-react/pull/2588))
- `Radio`: 根据for应 variant select Radio.Button 进rowdisplay @NWYLZW ([#2589](https://github.com/Tencent/tdesign-react/pull/2589))
- `Input`: Fixset最大长度after回删exceptionrowis @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Link`: Fix前aftericons没有垂直居inissue @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Select`: Fix `inputchange` eventcontextparameterexception issue @uyarn ([#2600](https://github.com/Tencent/tdesign-react/pull/2600))
- `DatePicker`: Fix `PaginationMini`未updatecause切换rowisexception issue @Ricinix ([#2587](https://github.com/Tencent/tdesign-react/pull/2587))
- `Form`: Fix setFields trigger onValuesChange cause死循环 @honkinglin ([#2570](https://github.com/Tencent/tdesign-react/pull/2570))

 ## 🌈 1.3.0 `2023-10-19` 
### 🚀 Features
- `TimelineItem`: addclickevent @Zzongke ([#2545](https://github.com/Tencent/tdesign-react/pull/2545))
- `Tag`: @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
    - Support多种风格tagconfigure
    - Supporttag组`CheckTagGroup`using,详见exampledocumentation
### 🐞 Bug Fixes
- `locale`: addmissingit_IT, ru_RU, zh_TW 语言environment @Zzongke ([#2542](https://github.com/Tencent/tdesign-react/pull/2542))
- `Cascader`: `change` eventin `source` exceptionissue @betavs ([#2544](https://github.com/Tencent/tdesign-react/pull/2544))
- `Tree`: Fix`allowFoldNodeOnFilter`istrueunderfilterafternodedisplay结果 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TagInput`: Fix in只有一个option when,deletefilter文字会误删已option缺陷 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TreeSelect`: Adjustfilteroptionafter交互rowis,and其他实现框架保持一致 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Rate`: Fix鼠标快速移动,会appear多个 text show issue @Jon-Millent ([#2551](https://github.com/Tencent/tdesign-react/pull/2551))

 ## 🌈 1.2.6 `2023-09-28` 
### 🚀 Features
- `Table`: Optimizerender次数 @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Card`: `title` using `div` 取代 `span` incustomizedscenarioundermore符合规范 @uyarn ([#2517](https://github.com/Tencent/tdesign-react/pull/2517))
- `Tree`: Supportvia key 匹配单一 value 指定scroll到特定置,具体using方式请参考example代码 @uyarn ([#2519](https://github.com/Tencent/tdesign-react/pull/2519))
### 🐞 Bug Fixes
- `Form`: Fix formList 嵌套datagetexception @honkinglin ([#2529](https://github.com/Tencent/tdesign-react/pull/2529))
- `Table`: Fixdata切换when `rowspanAndColspan` renderissue @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Cascader`: hover 没有子nodedata父nodewhen未update子node @betavs ([#2528](https://github.com/Tencent/tdesign-react/pull/2528))
- `DatePicker`: Fix切换月份invalid issue @honkinglin ([#2531](https://github.com/Tencent/tdesign-react/pull/2531))
- `Dropdown`: Fix`Dropdown` disabled API失效 issue @uyarn ([#2532](https://github.com/Tencent/tdesign-react/pull/2532))

 ## 🌈 1.2.5 `2023-09-14` 
### 🚀 Features
- `Steps`: 全局configureadd步骤条已completeiconscustomized @Zzongke ([#2491](https://github.com/Tencent/tdesign-react/pull/2491))
- `Table`: 可筛选table,`onFilterChange` eventAddparameter `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'`,表示trigger筛选条件change化来源 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
- `Form`: triggerAdd `submit`option @honkinglin ([#2507](https://github.com/Tencent/tdesign-react/pull/2507))
- `ImageViewer`: `onIndexChange` eventAdd `trigger` 枚举value `current` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Image`: @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
    - Add `fallback`,表示image兜底图,原始imageloadfailurewhen会show兜底图
    - AddSupport `src` typeis `File`,Supportvia `File` 预览image
- `Upload`: 文案listSupportshow缩略图 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`:
    - Supportvirtual scrollscenarioundervia`key`scroll到特定node @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
    - under virtual scroll 低于`threshold` 仍可runscrollTo操作 @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
### 🐞 Bug Fixes
- `ConfigProvider`: Fix切换多语言失效 issue @uyarn ([#2501](https://github.com/Tencent/tdesign-react/pull/2501))
- `Table`:
    - 可筛选table,Fix `resetValue` inclear筛选 when,未能reset到指定 `resetValue` value issue @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - tree形structuretable,Fix expandedTreeNodes.sync and expanded-tree-nodes-change using expandTreeNodeOnClick wheninvalid issue @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - cellinedit模式under,savewhen候for于链式colKey处理error,未能覆盖原来value @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
    - editabletable,Fix多个editabletablesimultaneously exist when,validateaffect each other issue @chaishi ([#2498](https://github.com/Tencent/tdesign-react/pull/2498))
- `TagInput`: Fixcollapsedisplayoptiondimensionsizeissue @uyarn ([#2503](https://github.com/Tencent/tdesign-react/pull/2503))
- `Tabs`: Fix using list 传 props 且 destroyOnHide is false under, 会lost panel content issue @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `Menu`: Fixmenu `expandType` default模式undermenuitem传递onClicknottrigger issue @Zzongke ([#2502](https://github.com/Tencent/tdesign-react/pull/2502))
- `ImageViewer`: Fix无法via `visible` 直接opening预览弹框issue @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: Fix1.2.0after version部分`TreeNodeModel`操作失效exception @uyarn

 ## 🌈 1.2.4 `2023-08-31` 
### 🚀 Features
- `Table`: tree形structure,没有set `expandedTreeNodes` 情况under,data dataoccurchange化 when,自动resetcollapse所有expandnode（如果希望保持expandnode,请usingproperties `expandedTreeNodes` 控制  @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
### 🐞 Bug Fixes
- `Watermark`: modifywatermarknode,notaffectwatermarkdisplay @tingtingcheng6 ([#2459](https://github.com/Tencent/tdesign-react/pull/2459))
- `Table`: @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
    - dragsort + 本地datapaginationscenario,Fix drag sorteventparameter `currentIndex/targetIndex/current/target` 等incorrect issue
    - dragsort + 本地datapaginationscenario,Fix in第二页byafterpaginationdataindragAdjust顺序after,会自动navigate到第一页issue
    - Supportpagination非affected by控用法dragsortscenario 
- `Slider`: Fix初始valueis0  when,label置error缺陷 @Zzongke ([#2477](https://github.com/Tencent/tdesign-react/pull/2477))
- `Tree`: Support `store.children`callgetChildrenmethod @uyarn ([#2480](https://github.com/Tencent/tdesign-react/pull/2480)) 

## 🌈 1.2.3 `2023-08-24` 
### 🐞 Bug Fixes
- `Table`: Fix usePrevious error @honkinglin ([#2464](https://github.com/Tencent/tdesign-react/pull/2464))
- `ImageViewer`: Fix after introducing文件patherror @honkinglin ([#2465](https://github.com/Tencent/tdesign-react/pull/2465)) 

## 🌈 1.2.2 `2023-08-24` 
### 🚀 Features
- `Table`: @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
    - tree形structure,Addcomponentinstancemethod `removeChildren`,用于Remove子node 
    - tree形structure,Supportviaproperties `expandedTreeNodes.sync` 自由控制expandnode,非必传properties
- `Tree`: Add `scrollTo`method Supportinvirtual scrollscenariounderscroll到指定node需求 @uyarn ([#2460](https://github.com/Tencent/tdesign-react/pull/2460))
### 🐞 Bug Fixes
- `TagInput`: Fixinputin文when被卡住 issue @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Table`:
    - clickrowexpand/clickrow选in,Fix `expandOnRowClick`and `selectOnRowClick` 无法独立控制rowclickexecute交互issue @chaishi ([#2452](https://github.com/Tencent/tdesign-react/pull/2452))
    - tree形structure,Fixcomponentinstancemethod expandall `expandAll` issue @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `Form`: FixFormListcomponentusingform setFieldsValue, resetexception @nickcdon ([#2406](https://github.com/Tencent/tdesign-react/pull/2406)) 

## 🌈 1.2.1 `2023-08-16` 
### 🚀 Features
- `Anchor`: Add `getCurrentAnchor` Supportcustomizedhighlight锚点 @ontheroad1992 ([#2436](https://github.com/Tencent/tdesign-react/pull/2436))
- `MenuItem`: `onClick` eventadd `value` returnvalue @dexterBo ([#2441](https://github.com/Tencent/tdesign-react/pull/2441))
- `FormItem`: Add `valueFormat` functionSupport格式化data @honkinglin ([#2445](https://github.com/Tencent/tdesign-react/pull/2445))
### 🐞 Bug Fixes
- `Dialog`: Fix闪烁issue @linjunc ([#2435](https://github.com/Tencent/tdesign-react/pull/2435))
- `Select`: @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
    - Fixmultiplelost `title`  issue
    - enabled远程searchwhennotexecuteinternalfilter
- `Popconfirm`: invalid `className` and `style` Props @betavs ([#2420](https://github.com/Tencent/tdesign-react/pull/2420))
- `DatePicker`: Fix hover cell causenot必要when opening and closing dropdown @j10ccc ([#2440](https://github.com/Tencent/tdesign-react/pull/2440)) 

 ## 🌈 1.2.0 `2023-08-10` 

### 🚨 Breaking Changes
- `Icon`: @uyarn ([#2429](https://github.com/Tencent/tdesign-react/pull/2429))
    - Add icons
    - Adjusticons命名 `photo` is `camera`,`books` is `bookmark`, `stop-cirle-1` is `stop-circle-stroke`
    - Remove icons页面

### 🚀 Features
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - Add `lazyLoad` 用于懒load整个table
    - editablecell,Add `edit.keepEditMode` ,用于保持cell始终isedit模式
    - 可筛选table,Supportpass through `attrs/style/classNames` properties, style, class name等信息到customizedcomponent
    - 可筛选table,when前 `filterValue` 未setfiltervaluedefaultvalue when,not再pass through undefined 到筛选器component,某些componentdefaultvalue必须isarray,notallow是 undefined 
### 🐞 Bug Fixes
- `Cascader`:  pass in value notin optionsinwhen会直接error @peng-yin ([#2414](https://github.com/Tencent/tdesign-react/pull/2414))
- `Menu`: Fix同一个 `MenuItem` 多次trigger `onChange`  issue @leezng ([#2424](https://github.com/Tencent/tdesign-react/pull/2424))
- `Drawer`: drawercomponentin `visible` defaultis `true`  when,无法normalshow @peng-yin ([#2415](https://github.com/Tencent/tdesign-react/pull/2415))
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - virtual scrollscenario,Fixheaderwidthand表contentwidthnot一致issue
    - virtual scrollscenario,Fixdefaultscroll条长度（置）andscrollafternot一致issue 

## 🌈 1.1.17 `2023-07-28`
### 🐞 Bug Fixes
- `Tabs`: Fix list 传空arraywhen js error @zhenglianghan ([#2393](https://github.com/Tencent/tdesign-react/pull/2393))
- `ListItemMeta`: Fix `description` 传递customizedelement @qijizh ([#2396](https://github.com/Tencent/tdesign-react/pull/2396))
- `Tree`: Fixenabledvirtual scrollwhen部分scenarioundernode回滚交互exceptionissue @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))
- `Tree`: Fix `1.1.15` after version基于 `level` properties操作无法normal工作 issue @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))

## 🌈 1.1.16 `2023-07-26`
### 🚀 Features
- `TimePicker`: @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
    - `disableTime` callbackAdd毫秒parameter
    - Optimizedisplaynotoptionalwhen间optionwhenscroll到notoptionaloption体验 
- `Dropdown`: Add `panelTopContent` 及 `panelBottomContent`,Support需要上under额外nodescenariousing @uyarn ([#2387](https://github.com/Tencent/tdesign-react/pull/2387))

### 🐞 Bug Fixes
- `Table`:
    - editabletablescenario,Supportset `colKey` valueis链式properties,如：`a.b.c` @chaishi ([#2381](https://github.com/Tencent/tdesign-react/pull/2381))
    - tree形structuretable,Fixwhen `selectedRowKeys` invaluein data datainnot存inwhenerrorissue @chaishi ([#2385](https://github.com/Tencent/tdesign-react/pull/2385))
- `Guide`: Fixset `step1` is `-1` when需要hidecomponent功能 @uyarn ([#2389](https://github.com/Tencent/tdesign-react/pull/2389))

## 🌈 1.1.15 `2023-07-19` 
### 🚀 Features
- `DatePicker`: Optimizeclosepopupafterresetdefault选in区域 @honkinglin ([#2371](https://github.com/Tencent/tdesign-react/pull/2371))
### 🐞 Bug Fixes
- `Dialog`: Fix `theme=danger` invalid issue @chaishi ([#2365](https://github.com/Tencent/tdesign-react/pull/2365))
- `Popconfirm`: when `confirmBtn/cancelBtn` valuetypeis `Object` when未pass through @imp2002 ([#2361](https://github.com/Tencent/tdesign-react/pull/2361)) 

## 🌈 1.1.14 `2023-07-12` 
### 🚀 Features
- `Tree`: Supportvirtual scroll @uyarn ([#2359](https://github.com/Tencent/tdesign-react/pull/2359))
- `Table`: tree形structure,addrowlevelclass name,方便业务setnot同levelstyle @chaishi ([#2354](https://github.com/Tencent/tdesign-react/pull/2354))
- `Radio`: Optimizeoption组换row情况 @ontheroad1992 ([#2358](https://github.com/Tencent/tdesign-react/pull/2358))
- `Upload`: @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
    - Addcomponentinstancemethod,`uploadFilePercent` 用于update文件upload进度
    - `theme=image`,Supportusing `fileListDisplay` customized UI content
    - `theme=image`,Supportclick名称opening新窗口访问image
    - draguploadscenario,Support `accept` 文件type限制

### 🐞 Bug Fixes
- `Upload`: customizeduploadmethod,Fix未能正确returnuploadsuccessorfailureafter文件issue @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

## 🌈 1.1.13 `2023-07-05` 
### 🐞 Bug Fixes
- `Tag`: Fix `children` isnumber `0` whenwhen opening and closing dropdownexception @HelKyle ([#2335](https://github.com/Tencent/tdesign-react/pull/2335))
- `Input`: Fix `limitNumber` 部分in `disabled` stateunderstyle issue @uyarn ([#2338](https://github.com/Tencent/tdesign-react/pull/2338))
- `TagInput`: Fix前置iconsstyle缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))
- `SelectInput`: Fixwhen losing focus未clearinputcontent缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))

## 🌈 1.1.12 `2023-06-29` 

### 🚀 Features
- `Site`: Support英文站点 @uyarn ([#2316](https://github.com/Tencent/tdesign-react/pull/2316))

### 🐞 Bug Fixes
- `Slider`: Fixnumberinput框 `theme` fixedis `column`  issue @Ali-ovo ([#2289](https://github.com/Tencent/tdesign-react/pull/2289))
- `Table`: column宽Adjustandcustomizedcolumn共存scenario,Fixviacustomizedcolumnconfiguretablecolumn数量change少 when,table总width无法再恢复change小 @chaishi ([#2325](https://github.com/Tencent/tdesign-react/pull/2325))

## 🌈 1.1.11 `2023-06-20` 
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - 可dragAdjustcolumn宽scenario,Fix `resizable=false` invalid issue,defaultvalueis false
    - 本地datasortscenario,Fixasync拉取data when,cancelsortdata会cause空listissue
    - Fixfixedtable + fixedcolumn + virtual scrollscenario,headernotfor齐issue
    - editablecell/editablerowscenario,Fixdata始终validate上一个valueissue,Adjustisvalidate最新inputvalue
    - Fix本地datasort,多字段sortscenario,example代码missingissue
- `ColorPicker`: @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
    - initializeis渐change模式 when,Support空stringas初始value
    - Fix `recentColors` 等字段type issue
    - Fixinternalunder拉option未pass through `popupProps` 缺陷


## 🌈 1.1.10 `2023-06-13` 
### 🚀 Features
- `Menu`:
    - `Submenu` Add `popupProps` properties,allowpass throughset底层 Popup dialogproperties @xiaosansiji ([#2284](https://github.com/Tencent/tdesign-react/pull/2284))
    - 弹出menuusing Popup refactor @xiaosansiji ([#2274](https://github.com/Tencent/tdesign-react/pull/2274))

### 🐞 Bug Fixes
- `InputNumber`: 初始valueis `undefined` / `null`,且存in `decimalPlaces`  when,not再进row小数点纠正 @chaishi ([#2273](https://github.com/Tencent/tdesign-react/pull/2273))
- `Select`: Fix `onBlur` methodcallbackparameterexception issue @Ali-ovo ([#2281](https://github.com/Tencent/tdesign-react/pull/2281))
- `Dialog`: Fix in SSR environmentundererror @night-c ([#2280](https://github.com/Tencent/tdesign-react/pull/2280))
- `Table`: Fixcomponentset `expandOnRowClick` is `true`  when,click整rowerror @pe-3 ([#2275](https://github.com/Tencent/tdesign-react/pull/2275))

## 🌈 1.1.9 `2023-06-06` 
### 🚀 Features
- `DatePicker`: Support `onConfirm` event @honkinglin ([#2260](https://github.com/Tencent/tdesign-react/pull/2260))
- `Menu`: Optimize侧边navigationmenucollapse when,`Tooltip` displaymenucontent @xiaosansiji ([#2263](https://github.com/Tencent/tdesign-react/pull/2263))
- `Swiper`: navigation typeSupport `dots` `dots-bar` @carolin913 ([#2246](https://github.com/Tencent/tdesign-react/pull/2246))
- `Table`: Add `onColumnResizeChange` event @honkinglin ([#2262](https://github.com/Tencent/tdesign-react/pull/2262))

### 🐞 Bug Fixes
- `TreeSelect`: Fix `keys` properties没有pass through给 `Tree`  issue @uyarn ([#2267](https://github.com/Tencent/tdesign-react/pull/2267))
- `InputNumber`:  Fix部分小数点number无法inputissue @chaishi ([#2264](https://github.com/Tencent/tdesign-react/pull/2264))
- `ImageViewer`: Fix触控板缩放操作exceptionissue @honkinglin ([#2265](https://github.com/Tencent/tdesign-react/pull/2265))
- `TreeSelect`: Fixwhen `label` 是 `reactNode` scenariounderdisplayissue @Ali-ovo ([#2258](https://github.com/Tencent/tdesign-react/pull/2258))

## 🌈 1.1.8 `2023-05-25` 
### 🚀 Features
- `TimePicker`: 没有选invaluewhennotallowclickconfirmbutton @uyarn ([#2240](https://github.com/Tencent/tdesign-react/pull/2240))

### 🐞 Bug Fixes
- `Form`: Fix `FormList` datapass throughissue @honkinglin ([#2239](https://github.com/Tencent/tdesign-react/pull/2239))

## 🌈 1.1.7 `2023-05-19` 
### 🐞 Bug Fixes
- `Tooltip`: Fix箭头偏移issue @uyarn ([#1347](https://github.com/Tencent/tdesign-common/pull/1347))

## 🌈 1.1.6 `2023-05-18` 
### 🚀 Features
- `TreeSelect`: Support `panelConent` API @ArthurYung ([#2182](https://github.com/Tencent/tdesign-react/pull/2182))

### 🐞 Bug Fixes
- `Select`: Fix可创建重复 label option缺陷 @uyarn ([#2221](https://github.com/Tencent/tdesign-react/pull/2221))
- `Skeleton`: Fix using `rowCol` when额外多render一row theme 缺陷 @uyarn ([#2223](https://github.com/Tencent/tdesign-react/pull/2223))
- `Form`:
    - Fixasyncrenderusing `useWatch` errorissue @honkinglin ([#2220](https://github.com/Tencent/tdesign-react/pull/2220))
    - Fix `FormList` 初始value赋valueinvalid issue @honkinglin ([#2222](https://github.com/Tencent/tdesign-react/pull/2222))

## 🌈 1.1.5 `2023-05-10` 
### 🚀 Features
- `Cascader`: Support `suffix`, `suffixIcon` @honkinglin ([#2200](https://github.com/Tencent/tdesign-react/pull/2200))

### 🐞 Bug Fixes
- `SelectInput`: Fix `loading` in `disabled` stateunderhideissue  @honkinglin ([#2196](https://github.com/Tencent/tdesign-react/pull/2196))
- `Image`: FixcomponentnotSupport `ref`  issue @li-jia-nan ([#2198](https://github.com/Tencent/tdesign-react/pull/2198))
- `BackTop`: Support `ref` pass through @li-jia-nan ([#2202](https://github.com/Tencent/tdesign-react/pull/2202))

## 🌈 1.1.4 `2023-04-27` 
### 🚀 Features
- `Select`: Support `panelTopContent` invirtual scroll等需要scrolldropdownscenariousing,具体using方式请看example @uyarn ([#2184](https://github.com/Tencent/tdesign-react/pull/2184))

### 🐞 Bug Fixes
- `DatePicker`: Fix第二次click面板closeexceptionissue @honkinglin ([#2183](https://github.com/Tencent/tdesign-react/pull/2183))
- `Table`:  Fix `useResizeObserver` ssr error @chaishi ([#2175](https://github.com/Tencent/tdesign-react/pull/2175))

## 🌈 1.1.3 `2023-04-21` 
### 🚀 Features
- `DatePicker`: Support `onPresetClick` event @honkinglin ([#2165](https://github.com/Tencent/tdesign-react/pull/2165))
- `Switch`: `onChange` Supportreturn `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
- `Collapse`: `onChange` Supportreturn `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
### 🐞 Bug Fixes
- `Form`: 
    - Fix主动 reset nottrigger `onReset` 逻辑 @honkinglin ([#2150](https://github.com/Tencent/tdesign-react/pull/2150))
    - Fix `onValuesChange` eventreturnparameterissue @honkinglin ([#2169](https://github.com/Tencent/tdesign-react/pull/2169))
- `Select`: Fixmultiple模式 `size` properties未take effect issue @uyarn ([#2163](https://github.com/Tencent/tdesign-react/pull/2163))
- `Collapse`:
    - Fix `Radio` disablejudgment @duanbaosheng ([#2161](https://github.com/Tencent/tdesign-react/pull/2161))
    - Fix `value` 有defaultvaluewhenaffected by控issue @moecasts ([#2152](https://github.com/Tencent/tdesign-react/pull/2152))
- `Icon`: Fix manifest 统一入口导出 esm module,documentationis及whenupdate issue @Layouwen ([#2160](https://github.com/Tencent/tdesign-react/pull/2160))

## 🌈 1.1.2 `2023-04-13` 
### 🚀 Features
- `DatePicker`: Optimize周select器highlightjudgment逻辑performance issue @honkinglin ([#2136](https://github.com/Tencent/tdesign-react/pull/2136))
### 🐞 Bug Fixes
- `Dialog`: 
    - Fixset style width nottake effectissue @honkinglin ([#2132](https://github.com/Tencent/tdesign-react/pull/2132))
    - Fix footer render null issue @honkinglin ([#2131](https://github.com/Tencent/tdesign-react/pull/2131))
- `Select`: Fixmultiplegroupdisplaystyleexception issue @uyarn ([#2138](https://github.com/Tencent/tdesign-react/pull/2138))
- `Popup`: 
    - Fix windows under scrollTop appear小数causejudgmentscrollbottom失效 @honkinglin ([#2142](https://github.com/Tencent/tdesign-react/pull/2142))
    - Fix临界点初次定issue @honkinglin ([#2134](https://github.com/Tencent/tdesign-react/pull/2134))
- `ColorPicker`: Fix Frame in无法drag饱and度and slider  issue @insekkei ([#2140](https://github.com/Tencent/tdesign-react/pull/2140))

## 🌈 1.1.1 `2023-04-06` 
### 🚀 Features
- `StickyTool`: Add `sticky-tool`component @ZekunWu ([#2065](https://github.com/Tencent/tdesign-react/pull/2065))

### 🐞 Bug Fixes
- `TagInput`: Fix基于`TagInput`componentusing筛选whendelete关key词when会delete已选value issue @2513483494 ([#2113](https://github.com/Tencent/tdesign-react/pull/2113))
- `InputNumber`: Fixinput小数by0结尾when功能exceptionissue @uyarn ([#2127](https://github.com/Tencent/tdesign-react/pull/2127))
- `Tree`: Fixcomponent data propertiesnotaffected by控issue @PBK-B ([#2119](https://github.com/Tencent/tdesign-react/pull/2119))
- `Form`: Fix初始datasetissue @honkinglin ([#2124](https://github.com/Tencent/tdesign-react/pull/2124))
- `TreeSelect`: Fixfilterafter无法expandissue @honkinglin ([#2128](https://github.com/Tencent/tdesign-react/pull/2128))
- `Popup`: Fix右keydisplaypopuptriggerbrowserdefaultevent @honkinglin ([#2120](https://github.com/Tencent/tdesign-react/pull/2120))

## 🌈 1.1.0 `2023-03-30` 
### 🚀 Features
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - Supportusing `filterIcon` Supportnot同columnshownot同筛选icons
    - Support横向scroll到fixedcolumn
- `Button`: Supportdisable态nottrigger href navigate逻辑 @honkinglin ([#2095](https://github.com/Tencent/tdesign-react/pull/2095))
- `BackTop`: Add BackTop component  @meiqi502 ([#2037](https://github.com/Tencent/tdesign-react/pull/2037))
- `Form`: submit Supportreturndata @honkinglin ([#2096](https://github.com/Tencent/tdesign-react/pull/2096))

### 🐞 Bug Fixes
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - Fix SSR environmentin,document is not undefined issue
    - Fix incolumnshow控制scenarioin,无法drag交换column顺序issue 
    - 单row选in功能,Fix `allowUncheck: false` invalid issue
- `Dialog`: Fix Dialog onOpen eventcallwhen机issue @honkinglin ([#2090](https://github.com/Tencent/tdesign-react/pull/2090))
- `DatePicker`: Fix `format` is12小when制when功能exception issue @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Alert`: Fixclose buttonis文字when居inandfontsizeissue @Wen1kang  @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Watermark`: Fix `Loading` 组合usingissue @duanbaosheng ([#2094](https://github.com/Tencent/tdesign-react/pull/2094))
- `Notification`: Fixgetinstanceissue @honkinglin ([#2103](https://github.com/Tencent/tdesign-react/pull/2103))
- `Radio`: Fix ts type issue @honkinglin ([#2102](https://github.com/Tencent/tdesign-react/pull/2102))


## 🌈 1.0.5 `2023-03-23` 
### 🚀 Features
- `TimePicker`: Add `size` API , to controlwhen间input框size @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))

### 🐞 Bug Fixes
- `Form`: Fix `FormList` 初始datagetissue @honkinglin ([#2067](https://github.com/Tencent/tdesign-react/pull/2067))
- `Watermark`: Fix NextJS in document undefined  issue @carolin913 ([#2073](https://github.com/Tencent/tdesign-react/pull/2073))
- `ColorPicker`: @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
    - Fix HEX 色value无法手动input issue
    - Fix最近usingcolor无法delete issue
- `Dialog`: Fix`onCloseBtnClick`eventinvalid issue @ArthurYung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))
- `BreadCrumb`: Fixvia options properties无法configure Icon  issue @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))


## 🌈 1.0.4 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - column宽Adjust功能,updatecolumn宽Adjust规则is：column宽较小没有超出 when,column宽Adjust表现iswhen前columnand相邻columnchange化；column宽超出存in横向scroll条 when,column宽Adjust仅affectwhen前columnandcolumn总宽
    - editablecell(row)功能,Supportedit模式under,datachange化when实whenvalidate,`col.edit.validateTrigger`
    - 只有fixedcolumn存in when,才会appearclass name `.t-table__content--scrollable-to-left` and `.t-table__content--scrollable-to-right`
    - drag功能,Supportdisablefixedcolumnnot可dragAdjust顺序
- `Upload`: `theme=file-input` 文件is空 when,悬浮whennotshow清除button @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `InputNumber`: Support千分粘贴 @uyarn ([#2058](https://github.com/Tencent/tdesign-react/pull/2058))
- `DatePicker`: Support `size` properties @honkinglin ([#2055](https://github.com/Tencent/tdesign-react/pull/2055))
### 🐞 Bug Fixes
- `Form`: Fixresetdefaultvaluedatatypeerror @honkinglin ([#2046](https://github.com/Tencent/tdesign-react/pull/2046))
- `TimelineItem`: Fix导出type @southorange0929 ([#2053](https://github.com/Tencent/tdesign-react/pull/2053))
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - Fixtable width jitter issue 
    - column宽Adjust功能,Fix Dialog incolumn宽Adjustissue
    - editable cell, fix dropdown selection component `abortEditOnEvent` does not include `onChange`  when,依然会indatachange化whentrigger退出edit态issue
- `Table`: Fix lazy-load reset bug @MrWeilian ([#2041](https://github.com/Tencent/tdesign-react/pull/2041))
- `ColorPicker`: Fixinput框无法input issue @insekkei ([#2061](https://github.com/Tencent/tdesign-react/pull/2061))
- `Affix`: Fix fixed judgment issue @lio-mengxiang ([#2048](https://github.com/Tencent/tdesign-react/pull/2048))

## 🌈 1.0.3 `2023-03-09` 
### 🚀 Features
- `Message`: Do not auto-close on mouse hover @HelKyle ([#2036](https://github.com/Tencent/tdesign-react/pull/2036))
- `DatePicker`: Support `defaultTime` @honkinglin ([#2038](https://github.com/Tencent/tdesign-react/pull/2038))

### 🐞 Bug Fixes
- `DatePicker`: Fix月份is0whendisplaywhen前月份issue @honkinglin ([#2032](https://github.com/Tencent/tdesign-react/pull/2032))
- `Upload`: Fix `upload.method` invalid issue @i-tengfei ([#2034](https://github.com/Tencent/tdesign-react/pull/2034))
- `Select`: Fixmultipleselect all初始valueis空when选inerror issue @uyarn ([#2042](https://github.com/Tencent/tdesign-react/pull/2042))
- `Dialog`: Fixdialog vertically centered issue @KMethod ([#2043](https://github.com/Tencent/tdesign-react/pull/2043))

## 🌈 1.0.2 `2023-03-01` 
### 🚀 Features
- `Image`: imagecomponentSupport特殊格式地址 `.avif` and `.webp` @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `ConfigProvider`: Add `Image` 全局configure `globalConfig.image.replaceImageSrc`, used to uniformly replace image addresses @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `List`: `listItemMeta` Support `className`, `style` properties @honkinglin ([#2005](https://github.com/Tencent/tdesign-react/pull/2005))

### 🐞 Bug Fixes
- `Form`: @honkinglin ([#2014](https://github.com/Tencent/tdesign-react/pull/2014))
    - Fixvalidation message inheriting error cache issue
    - Remove `FormItem` extra event notification logic
- `Drawer`: Fixscrollbar appears on page after dragging issue @honkinglin ([#2012](https://github.com/Tencent/tdesign-react/pull/2012))
- `Input`: Fixasync rendering width calculation issue @honkinglin ([#2010](https://github.com/Tencent/tdesign-react/pull/2010))
- `Textarea`: Adjust limit display置,Fixandtips 共存whenstyle issue @duanbaosheng ([#2015](https://github.com/Tencent/tdesign-react/pull/2015))
- `Checkbox`: Fix ts type issue @NWYLZW ([#2023](https://github.com/Tencent/tdesign-react/pull/2023))


## 🌈 1.0.1 `2023-02-21` 
### 🚀 Features
- `Popup`: Add `onScrollToBottom` event @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Select`: @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
    - Supportvirtual scrollusing
    - Support `autofocus`, `suffix`,`suffixIcon`and other APIs,`onSearch`Addcallbackparameter
    - Option子componentSupportcustomized`title`API
- `Icon`:  loadwhen注入style,Avoidin next environmentinerror issue @uyarn ([#1990](https://github.com/Tencent/tdesign-react/pull/1990))
- `Avatar`: componentinternalimage,using Image componentrender,Supportpass through `imageProps` to Image component @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `DialogPlugin`: Supportcustomized `visbile` @moecasts ([#1998](https://github.com/Tencent/tdesign-react/pull/1998))
- `Tabs`: Supportdrag能力 @duanbaosheng ([#1979](https://github.com/Tencent/tdesign-react/pull/1979))

### 🐞 Bug Fixes
- `Select`: Fix `onInputchange`triggerwhen机 issue @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Radio`: Fix `disabled` default value issue  @honkinglin ([#1977](https://github.com/Tencent/tdesign-react/pull/1977))
- `Table`: Ensureeditablecell保持editstate @moecasts ([#1988](https://github.com/Tencent/tdesign-react/pull/1988))
- `TagInput`: Fix `0.45.4` after version `TagInput` add `blur` rowiscause `Select` / `Cascader` / `TreeSelect` 无法filtermultiple issue @uyarn ([#1989](https://github.com/Tencent/tdesign-react/pull/1989))
- `Avatar`: Fiximage cannot display issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Image`: Fixeventtype issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Tree`: Fixchild nodes cannot be searched after being collapsed issue @honkinglin ([#1999](https://github.com/Tencent/tdesign-react/pull/1999))
- `Popup`:  Fixpopup show/hide infinite loop issue @honkinglin ([#1991](https://github.com/Tencent/tdesign-react/pull/1991))
- `FormList`:  Fix `onValuesChange` cannot get latest data issue @honkinglin ([#1992](https://github.com/Tencent/tdesign-react/pull/1992))
- `Drawer`: Fixscrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))
- `Dialog`: Fixscrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))

## 🌈 1.0.0 `2023-02-13` 
### 🚀 Features
- `Dropdown`: submenu levelstructureAdjust,add一层 `t-dropdown__submenu-wrapper` @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

### 🐞 Bug Fixes
- `Tree`: Fix using setItem setnode expanded  when,nottrigger `onExpand`  issue @genyuMPj ([#1956](https://github.com/Tencent/tdesign-react/pull/1956))
- `Dropdown`: Fix多层超长menu置exceptionissue @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

## 🌈 0.x `2021-03-26 - 2023-02-08`
Go to [GitHub](https://github.com/Tencent/tdesign-react/blob/develop/packages/tdesign-react/CHANGELOG-0.x.md) view `0.x` changelog

