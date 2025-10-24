---
title: Changelog
doc Class: timeline
toc: false
spline: explain
---

## 🌈 1.15.7 `2025-10-24` 
### 🚀 Features
- `Divider`: Support `size` to control spacing size @Haixing OoO ([#3893](https://github.com/Tencent/tdesign-react/pull/3893))
### 🐞 Bug Fixes
- `Tree Select`: Fix error when deleting options not in `data` @Rylan Bot ([#3886](https://github.com/Tencent/tdesign-react/pull/3886))
- `Enhanced Table`: Fix exception where rows cannot expand normally after dragging and dynamically closing `drag Sort` @Rylan Bot ([#3896](https://github.com/Tencent/tdesign-react/pull/3896))
- `Menu`: Avoid hiding icons wrapped in `span` when menu is collapsed @Quentin Hsu([common#2303](https://github.com/Tencent/tdesign-common/pull/2303))
- `Textarea`: Fix issue where setting `autosize` does not fully auto-expand height when content is too long, resulting in scrollbar @engvuchen ([#3856](https://github.com/Tencent/tdesign-react/pull/3856))
- `Radio Group`: Fix error caused by reading `null` during keyboard operation @Rylan Bot ([#3906](https://github.com/Tencent/tdesign-react/pull/3906))
- `Loading`: Fix issue where `delay` does not take effect @Rylan Bot ([#3859](https://github.com/Tencent/tdesign-react/pull/3859))
- `Form`: 
 - Fix English translation error for error messages `max` and `min` @liweijie0812([common#2304](https://github.com/Tencent/tdesign-common/pull/2304))
 - Fix issue where nested `Form List` cannot use `add` to correctly add forms @Rylan Bot ([#3881](https://github.com/Tencent/tdesign-react/pull/3881))
- `Select`: @Rylan Bot ([#3879](https://github.com/Tencent/tdesign-react/pull/3879))
 - Fix issue where `disabled` options can still be deleted when `multiple` is enabled
 - Fix issue where `disabled` and selected options have their state modified by `check All`
 - Fix issue where `checked` and `indeterminate` states of `check All` checkbox are unreasonable when `disabled` items exist
- `Virtual Scroll`: @Rylan Bot ([#3878](https://github.com/Tencent/tdesign-react/pull/3878))
 - Fix issue where data cannot refresh correctly when switching `threshold` between non-virtual scroll and virtual scroll
 - Fix issue where related calculations are started even when `scroll={{type:'virtual'}}` is not enabled

## 🌈 1.15.6 `2025-10-10` 
### 🐞 Bug Fixes
- `Virtual Scroll`: Fix component warning issue when components with virtual scroll are used with sub-components in async request scenarios @uyarn ([#3876](https://github.com/Tencent/tdesign-react/pull/3876))

## 🌈 1.15.5 `2025-10-05` 
### 🐞 Bug Fixes
- `Watermark`: Fix issue with using in SSR scenario in version `1.15.2` @Wesley-0808([#3873](https://github.com/Tencent/tdesign-react/pull/3873))
- `Descriptions`: Fix spacing issue in borderless mode @liweijie0812 ([#3873](https://github.com/Tencent/tdesign-react/pull/3873))

## 🌈 1.15.4 `2025-10-01` 
### 🚀 Features
- `Image Viewer`: Support `trigger` pass in image `index` parameter, trigger's `open` method parameters may have type differences with bound element trigger events,if you encounter this issue, please change to `()=> open()` use similar anonymous function @betavs ([#3827](https://github.com/Tencent/tdesign-react/pull/3827))
### 🐞 Bug Fixes
- `Swiper`: Fix issue where autoplay fails after clicking navigation bar on mobile @uyarn ([#3862](https://github.com/Tencent/tdesign-react/pull/3862))
- `List`: Remove redundant code introduced in version `1.15.2` that causes initialization lag when virtual scroll is enabled @Rylan Bot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))
- `Select`: Remove redundant code introduced in version `1.15.2` that causes initialization lag when virtual scroll is enabled @Rylan Bot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))

## 🌈 1.15.3 `2025-09-29` 
### 🐞 Bug Fixes
- `Select`: Fix issue where `style` and `class Name` of `Option Group` do not take effect @uyarn ([#3855](https://github.com/Tencent/tdesign-react/pull/3855))

## 🌈 1.15.2 `2025-09-29` 
### 🚀 Features
- `Watermark`: Add `layout` API, support generating watermarks with different layouts, `watermark Text` supports font configuration @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Drawer`: Optimize issue where component content gets selected during drag-resize process @uyarn ([#3844](https://github.com/Tencent/tdesign-react/pull/3844))
### 🐞 Bug Fixes
- `Watermark`: Fix issue where entire canvas content becomes grayscale when multi-line image-text watermark image is configured with grayscale @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Slider`: Fix return value and related display exceptions caused by precision issues after setting `step` @uyarn ([#3821](https://github.com/Tencent/tdesign-react/pull/3821))
- `Tag Input`: Fix issue where `input Value` in `on Blur` is always empty @Rylan Bot ([#3841](https://github.com/Tencent/tdesign-react/pull/3841))
- `Cascader`: Fix issue where parent node is unexpectedly highlighted when selecting only child node in `single` mode @Rylan Bot ([#3840](https://github.com/Tencent/tdesign-react/pull/3840))
- `Date RangePicker Panel`: Fix issue where clicking panel cannot sync when `preset` involves cross-year dates @Rylan Bot ([#3818](https://github.com/Tencent/tdesign-react/pull/3818))
- `Enhanced Table`: Fix issue where position is reset when clicking expand after node drag @Rylan Bot ([#3780](https://github.com/Tencent/tdesign-react/pull/3780))
- `Table`: @Rylan Bot 
 - Fix issue where `on SortChange` always returns `undefined` when `multiple Sort` is enabled but `sort` or `default Sort` is not declared ([#3824](https://github.com/Tencent/tdesign-react/pull/3824))
 - Fix issue where last row content is obscured when virtual scroll is enabled and `first FullRow` / `last FullRow` etc. are set simultaneously ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue where `fixed Rows` / `first FullRow` / `last FullRow` cannot be used in combination under virtual scroll ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue with abnormal scrollbar length during virtual scroll initialization ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue where fixed header and fixed columns cannot align ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue where `default Current` must be declared for correct pagination when `pagination` is uncontrolled ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
 - Fix issue where clicking pagination still triggers data update when `pagination` is controlled and unchanged ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
 - Fix issue where editable cell content does not sync when `data` changes ([#3826](https://github.com/Tencent/tdesign-react/pull/3826))
- `Select Input`: @Rylan Bot ([#3838](https://github.com/Tencent/tdesign-react/pull/3838))
 - Fix issue where `on Blur` does not take effect when `popup Visible={false}` is customized
 - Fix issue where `on Blur` is missing `tag InputValue` parameter when `multiple` is enabled
- `Select`: 
 - Fix issue where using `keys` to configure `content` as `label` or `value` does not take effect @Rylan Bot @uyarn ([#3829](https://github.com/Tencent/tdesign-react/pull/3829))
 - Fix issue with blank screen and scrollbar being unexpectedly reset when dynamically switching to virtual scroll @Rylan Bot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))
 - Fix issue where displayed data is not synchronized when virtual scroll is enabled and data is dynamically updated @huangchen1031 ([#3839](https://github.com/Tencent/tdesign-react/pull/3839))
- `List`: 
 - Fix issue where some APIs of `List Item` do not take effect after enabling virtual scroll @Flower BlackG ([#3835](https://github.com/Tencent/tdesign-react/pull/3835))
 - Fix issue where scrollbar is unexpectedly reset when dynamically switching to virtual scroll @Rylan Bot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))

## 🌈 1.15.1 `2025-09-12` 
### 🐞 Bug Fixes
- `Image Viewer`: Fix issue with abnormal `image Scale` configuration effect @uyarn ([#3814](https://github.com/Tencent/tdesign-react/pull/3814))

## 🌈 1.15.0 `2025-09-11` 
### 🚀 Features
- `Icon`: @uyarn ([#3802](https://github.com/Tencent/tdesign-react/pull/3802))
 - `tdesign-icons-react` Release version `0.6.0`,Add `align-bottom`, `no-result`, `no-result-filled`, `tree-list`, `wifi-no`, `wifi-no-filled`, `logo-stackblitz-filled`, `logo-stackblitz`, `logo-wecom-filled` icons,Remove iconsplease note when upgrading ⚠️ 
 - Icon resources used in on-demand loading support variable weight feature, configured via `stroke Width` property
 - Icon resources used in on-demand loading support multi-color fill feature, configured via `stroke Color` and `fill Color` properties
- `Date Picker`: Support not closing popup when clicking `preset` by overriding `popup Props` @Rylan Bot ([#3798](https://github.com/Tencent/tdesign-react/pull/3798))
### 🐞 Bug Fixes
- `Tree`: Fix issue with abnormal expand/collapse icon display after dragging @Rylan Bot ([#3756](https://github.com/Tencent/tdesign-react/pull/3756))
- `Tree Item`: Correct node attribute `date-target` spelling to `data-target`, please note this change if you previously used this attribute ⚠️ @Rylan Bot ([#3756](https://github.com/Tencent/tdesign-react/pull/3756))
- `Message Plugin`: Fix error when `content` is `''` / `undefined` / `null` @Rylan Bot ([#3778](https://github.com/Tencent/tdesign-react/pull/3778))
- `Table`: Fix page flicker issue caused by `Loading` mounting when `<React.Strict Mode>` is not enabled @Rylan Bot ([#3775](https://github.com/Tencent/tdesign-react/pull/3775))
- `Upload`: Fix `status` update error in drag mode @RSS1102 ([#3801](https://github.com/Tencent/tdesign-react/pull/3801))
- `Input`: Fix issue where `on Focus` and `on Blur` are not triggered when `readonly` is enabled or `allow Input` is disabled @Rylan Bot ([#3800](https://github.com/Tencent/tdesign-react/pull/3800))
- `Cascader`: 
 - Fix issue with abnormal `value Display` rendering when `multiple` and `value Type='full'` are enabled @RSS1102 ([#3809](https://github.com/Tencent/tdesign-react/pull/3809))
 - Fix `1.11.0` version introduced new feature, causes inability to select bottom options issue @Rylan Bot ([#3772](https://github.com/Tencent/tdesign-react/pull/3772))
- `Select`: Avoid frequently triggering repeated rendering of `value Display` when opening and closing dropdown @Rylan Bot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `Tag Input`: Avoid frequently triggering repeated rendering of `value Display` when opening and closing dropdown @Rylan Bot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `Dialog`: Fix infinite loop caused by using `ref` in React 19 environment issue @Rylan Bot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Drawer`: Fix infinite loop caused by using `ref` in React 19 environment issue @Rylan Bot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Popup`: Fix `delay` is set to 0 when moving out of Trigger element exception issue @Haixing OoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))
- `Tooltip`: Fix `delay` API type incompleteness issue @Haixing OoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))

### 🚧 Others
- `react-render`: Fix after introducing `react-19-adapter` still shows warning to introduce related modules issue @Haixing OoO ([#3790](https://github.com/Tencent/tdesign-react/pull/3790))

## 🌈 1.14.5 `2025-08-26` 
### 🐞 Bug Fixes
- `Watermark`: improvewatermarkcomponentin SSR scenariocompatible issue @uyarn ([#3765](https://github.com/Tencent/tdesign-react/pull/3765))

## 🌈 1.14.3 `2025-08-26` 
### 🐞 Bug Fixes
- `Pagination`: Fixnavigateiconsdoes not reset to correct state issue @phalera ([#3758](https://github.com/Tencent/tdesign-react/pull/3758))
- `Watermark`: Fix `1.14.0` versiondefaulttext colormissingopacity issue @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))
- `Watermark`: Fix `1.14.0` versionnotcompatible SSR scenario issue @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))

## 🌈 1.14.2 `2025-08-22` 
### 🐞 Bug Fixes
- `Dialog`: Fix `1.14.0` versionintroduced new featurecause `draggable` disable failure issue @Rylan Bot ([#3753](https://github.com/Tencent/tdesign-react/pull/3753))

## 🌈 1.14.1 `2025-08-22` 
### 🐞 Bug Fixes
- `Steps`: Fix `1.13.2` versioncause `theme` notis `default` whenduplicate renderingicons issue @RSS1102 ([#3748](https://github.com/Tencent/tdesign-react/pull/3748))

## 🌈 1.14.0 `2025-08-21` 
### 🚀 Features
- `Tabs`: move `remove` eventdelete fromiconsmove to outer container, ensure replacementiconsfunction normallyusing,hasoverridedeleteiconsstyleplease note thischangemore ⚠️ @RSS1102 ([#3736](https://github.com/Tencent/tdesign-react/pull/3736))
- `Card`: Add `header ClassName`, `header Style`, `body ClassName`, `body Style`, `footer ClassName`, `footer Style`,convenient for customizing cardcomponenteach part style @lifei Front ([#3737](https://github.com/Tencent/tdesign-react/pull/3737))
- `Form`: `rules` Supportconfigurevalidate nested fields @uyarn ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `Image Viewer`: Adjust `image Scale` internalpropertiesvaluechangeisoptional @willsontao Zzz ([#3710](https://github.com/Tencent/tdesign-react/pull/3710))
- `Select`: Support `on Create` and `multiple` withusing @uyarn ([#3717](https://github.com/Tencent/tdesign-react/pull/3717))
- `Table`: Addswitch pagination afterreset scrollbar to top feature @RSS1102 ([#3729](https://github.com/Tencent/tdesign-react/pull/3729))
- `Tree`: `on DragLeave` and `on DragOver` add `drag Node`, `drop Position` parameter @phalera ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Upload`: Supportinnon-automaticuploadscenario underuploadspecified files @uyarn ([#3742](https://github.com/Tencent/tdesign-react/pull/3742))
- `Color Picker`: Supportinmobiledragcolor palette, slider etc @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Dialog`: Support `draggable` properties Supportinmobiletake effect @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Image Viewer`: Support `draggable` propertiesinmobiletake effect @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Slider`: Supportinmobiledrag @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Statistic`: modify `color` propertiestypeisstring,by Supportany [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) Supportcolorvalue @RSS1102 ([#3706](https://github.com/Tencent/tdesign-react/pull/3706))

### 🐞 Bug Fixes
- `Tree`: @Rylan Bot
 - Fix `draggable` in `disabled` state understilltake effect exception,thispreviously haddependencythis errorbusinessplease note thischangedynamic ⚠️ ([#3740](https://github.com/Tencent/tdesign-react/pull/3740)) 
 - Fix `check Strictly` defaultis false when,parent-childnode `disabled` statenot associated issue ([#3739](https://github.com/Tencent/tdesign-react/pull/3739))
 - Fix Drag relatedeventcallbackin `node` is null exception ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Form`: @uyarn
 - Fixnestedformaffected byouter `Form List` affect datastructure issue ([#3715](https://github.com/Tencent/tdesign-react/pull/3715))
 - Fixnestedformininnerformaffected byouterformaffectvalidate result field issue ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `Form List`: resolve `1.13.2` introduce Fix,causemanualdynamic `set Fields` setinitialvalueinstead of using `initial Data` afternomethod Add data issue @Rylan Bot ([#3730](https://github.com/Tencent/tdesign-react/pull/3730))
- `Input`: Fixpasswordinputboxclickiconsswitchcontentvisiblevisibility when,cursor position cannot be preserved @Rylan Bot ([#3726](https://github.com/Tencent/tdesign-react/pull/3726))
- `Table`: @Rylan Bot ([#3733](https://github.com/Tencent/tdesign-react/pull/3733))
 - Fixenabledvirtual scroll when,dynamicstateupdate data whencauseblank screen issue 
 - Fixenabledvirtual scroll when,headerand under tablewidthnotsyncchangechange
 - Fixenabledvirtual scroll when,scroll is unexpectedlyreset to firstrow position
 - Fix `drag Sort='row-handler-col'` when,columndragnottake effect issue ([#3734](https://github.com/Tencent/tdesign-react/pull/3734))
 - Fix `size='small'` `first FullRow` dimension than `size='medium'` larger exception ([#common2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Watermark`: Fixdark mode under,textwatermarkcontentshow nototobvious issue @Haixing OoO @liweijie0812 ([#3692](https://github.com/Tencent/tdesign-react/pull/3692))
- `Date Picker`: Optimizeyearselectmode underselectsamepanelyear afterpanelcontentdisplayeffect @uyarn ([#3744](https://github.com/Tencent/tdesign-react/pull/3744))


## 🌈 1.13.2 `2025-08-01` 
### 🐞 Bug Fixes
- `Date Picker`: 
 - handlemultiplecase underweekandquartermodetagdelete exception issue @betavs ([#3664](https://github.com/Tencent/tdesign-react/pull/3664))
 - Fixmultiplemode under `placeholder` cannotnormaldisappear @Rylan Bot ([#3666](https://github.com/Tencent/tdesign-react/pull/3666))
- `Enhanced Table`: @Rylan Bot
 - resolve `1.13.0` versioninintroduce Fix,causeasyncscenario under `data` updatefailure issue ([#3690](https://github.com/Tencent/tdesign-react/pull/3690)) 
 - Fix using `tree` API when ,dynamicstateinitialize `columns` whennotsavein unique key ([#3669](https://github.com/Tencent/tdesign-react/pull/3669))
 - Fixleafnodejudgmentcondition too broad,cause `class Name` forresponsestylenotnormalrender ([#3681](https://github.com/Tencent/tdesign-react/pull/3681))
- `Select Input`: Fix in `use OverlayInner Style` ingetscrollbarwhenset `display` causesome bug @Haixing OoO ([#3677](https://github.com/Tencent/tdesign-react/pull/3677))
- `Textarea`: Fix `Dialog` in `Textarea` mount `autosize` nottake effect @Haixing OoO ([#3693](https://github.com/Tencent/tdesign-react/pull/3693))
- `Color Picker`: @Rylan Bot ([#3667](https://github.com/Tencent/tdesign-react/pull/3667))
 - reducecolormultiple conversions across color spaces,reduce errors
 - Fixdirect lengthbygradualchangepointafterdrag,colorupdate exception issue
 - Fixclear under 某一inputbox数value when,otherinputbox意外bereset
- `Upload`: Ensurein `before Upload` complete之after,againexecuteuploaddynamic作 @RSS1102 ([#3686](https://github.com/Tencent/tdesign-react/pull/3686))
- `Table`: Fix `resizable` enabled when,columnborder线causecolumn名content移dynamic issue @Quentin Hsu([#common2224](https://github.com/Tencent/tdesign-common/pull/2224))
- `Descriptions`: Fixnobordermode under左右内margin @liweijie0812 ([#common2219](https://github.com/Tencent/tdesign-common/pull/2219))
- `Steps`: Fixcustomizediconsandstateicons优先级issue @RSS1102 ([#3670](https://github.com/Tencent/tdesign-react/pull/3670))
- `Form`: Fixdynamicstateformdelete一 data afteragaintime Add,will回填旧data issue @Rylan Bot ([#3684](https://github.com/Tencent/tdesign-react/pull/3684))

## 🌈 1.13.1 `2025-07-11`

### 🐞 Bug Fixes
- `QRCode`: Fix `canvas` 二维码 Safari stylecompatible issue

## 🌈 1.13.0 `2025-07-10` 
### 🚀 Features
- `React19`: Addcompatible React 19 using adapter,in React 19 inusing请参考usingdocumentation详细description @Haixing OoO @uyarn([#3640](https://github.com/Tencent/tdesign-react/pull/3640))
- `QRCode`: Add `QRCode` 二维码component @lifei Front @wonkzhang ([#3612](https://github.com/Tencent/tdesign-react/pull/3612))
- `Alert`: Add `close Btn` API,andothercomponent保持一致,`close` moveinnot来version废弃,请尽快Adjustis `close Btn` using ⚠️ @ngyyuusora ([#3625](https://github.com/Tencent/tdesign-react/pull/3625))
- `Form`: Addin重新opening Form when,resetformcontent特visibility @alisdonwang ([#3613](https://github.com/Tencent/tdesign-react/pull/3613))
- `Image Viewer`: Supportinmobileusing when,via双指进row缩放image功can @Rylan Bot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
- `locale`: Support内 position多语言英文version单复数scenarionormaldisplay @Yun YouJun ([#3639](https://github.com/Tencent/tdesign-react/pull/3639))
### 🐞 Bug Fixes
- `Color Picker`: 
 - Fix clickgradualchangepoint when,color palettenohassyncupdate issue @Rylan Bot ([#3624](https://github.com/Tencent/tdesign-react/pull/3624))
 - Fixpanelinputinvalid字符scenarioand多reset空scenario undernohasresetinputboxcontent缺陷 @uyarn ([#3653](https://github.com/Tencent/tdesign-react/pull/3653))
- `Dropdown`: Fix部分scenario under拉menunodeget exceptioncause error issue @uyarn ([#3657](https://github.com/Tencent/tdesign-react/pull/3657))
- `Image Viewer`: @Rylan Bot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
 - Fix click工have栏icons边缘whennomethodtriggerforresponse操作
 - Fixbyin `Tooltip Lite` cause `z-index` level关系exception
- `Popup`: Fix `1.11.2` introduce popper.js `arrow` 修饰符cause箭头 position偏移 @Rylan Bot ([#3652](https://github.com/Tencent/tdesign-react/pull/3652))
- `Loading`: Fix in i Pad 微信onicons position error issue @Nero978([#3655](https://github.com/Tencent/tdesign-react/pull/3655))
- `Menu`: resolve `expand Mutex` saveinnested子menu when,容易失效 issue @Rylan Bot ([#3621](https://github.com/Tencent/tdesign-react/pull/3621))
- `Table`: 
 - Fix吸顶功cannot随heightchangechange issue @huangchen1031 ([#3620](https://github.com/Tencent/tdesign-react/pull/3620))
 - Fix `show Header` is `false` when,`columns` dynamicstatechangechange error issue @Rylan Bot ([#3637](https://github.com/Tencent/tdesign-react/pull/3637))
- `Enhanced Table`: Fix `tree.default ExpandAll` nomethodtake effect issue @Rylan Bot ([#3638](https://github.com/Tencent/tdesign-react/pull/3638))
- `Textarea`: Fix超出most largerheight after换row when抖dynamic issue @RSS1102 ([#3631](https://github.com/Tencent/tdesign-react/pull/3631))

## 🌈 1.12.3 `2025-06-13` 
### 🚀 Features
- `Form`: Add `required MarkPosition` API,candefinerequired符号 position @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
- `Config Provider`: 全局configure `Form Config` Add `required MaskPosition` configure,用in全局configurerequired符号 position @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
### 🐞 Bug Fixes
- `Drawer`: Fix `cancel Btn` and `confirm Btn` typemissing `null` declare issue @RSS1102 ([#3602](https://github.com/Tencent/tdesign-react/pull/3602))
- `Image Viewer`: Fixshow errorimagein小窗口imageview器dimension exception @Rylan Bot([#3607](https://github.com/Tencent/tdesign-react/pull/3607))
- `Menu`: `popup Props` `delay` propertiesin `Sub Menu` innomethodtake effect issue @Rylan Bot ([#3599](https://github.com/Tencent/tdesign-react/pull/3599))
- `Menu`: enabled `expand Mutex` after,ifsavein二级 `Sub Menu`,menunomethodexpand @Rylan Bot ([#3601](https://github.com/Tencent/tdesign-react/pull/3601))
- `Select`: Fix `check All` 设is `disabled` afterstillwilltriggerselect all issue @Rylan Bot ([#3563](https://github.com/Tencent/tdesign-react/pull/3563))
- `Table`: Optimizeclosecolumnconfiguredialog when,Fixselectcolumn dataandplacedisplaycolumn datanot一致 issue @RSS1102 ([#3608](https://github.com/Tencent/tdesign-react/pull/3608))
- `Tab Panel`: Fixvia `style` set `display` propertiesnomethodnormaltake effect issue @uyarn ([#3609](https://github.com/Tencent/tdesign-react/pull/3609))
- `Tabs`: Fixenabled懒load after始终will先render第一 `Tab Panel` issue @Haixing OoO ([#3614](https://github.com/Tencent/tdesign-react/pull/3614))
- `Tree Select`: Fix `label` API nomethodnormalusing issue @Rylan Bot ([#3603](https://github.com/Tencent/tdesign-react/pull/3603))

## 🌈 1.12.2 `2025-05-30` 
### 🚀 Features
- `Cascader`: Add Supportusing `option` methodcustomized under拉optioncontentcan力 @huangchen1031 ([#3565](https://github.com/Tencent/tdesign-react/pull/3565))
- `Menu Group`: Add Support `class Name` and `style` using @wang-ky ([#3568](https://github.com/Tencent/tdesign-react/pull/3568))
- `Input Number`: `decimal Places` Add Support `enable Round` parameter,to controlis否enabling四舍五入 @Rylan Bot ([#3564](https://github.com/Tencent/tdesign-react/pull/3564))
- `Tag Input`: Optimizecandrag when,鼠标光标showis移dynamic光标 @liweijie0812 ([#3552](https://github.com/Tencent/tdesign-react/pull/3552))


### 🐞 Bug Fixes
- `Card`: Fix `content` prop nottake effect issue @Rylan Bot ([#3553](https://github.com/Tencent/tdesign-react/pull/3553))
- `Cascader`: 
 - Fixoptionsavein超长textinsizedimension underdisplay exception issue @Shabi-x([#3551](https://github.com/Tencent/tdesign-react/pull/3551))
 - Fixinitialize after,asyncupdate `options` when,`display Value` nochangechange issue @huangchen1031 ([#3549](https://github.com/Tencent/tdesign-react/pull/3549))
- `Date Picker`: Fix `on Focus` eventtrigger when机issue @l123wx ([#3578](https://github.com/Tencent/tdesign-react/pull/3578))
- `Drawer`: Optimize `TNode` 重新rendercauseinput光标error issue @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `Form`:
 - Fix in `on ValuesChange` invia `set Fields` set相samevalue继续trigger `on ValuesChange` cause `re-render` issue @Haixing OoO ([#3304](https://github.com/Tencent/tdesign-react/pull/3304))
 - Fix `Form List` delete `field` after `reset` valueinitialize error issue @l123wx ([#3557](https://github.com/Tencent/tdesign-react/pull/3557))
 - compatible `1.11.7` version前单独using `Form Item` scenario @uyarn ([#3588](https://github.com/Tencent/tdesign-react/pull/3588))
- `Guide`: Optimizecomponentin屏幕sizechangechange whennohas重新计算 position issue @Haixing OoO ([#3543](https://github.com/Tencent/tdesign-react/pull/3543))
- `List`: Fix空子nodecauseget子node `props` failure issue @RSS1102 ([#3570](https://github.com/Tencent/tdesign-react/pull/3570))
- `Popconfirm`: Fix `confirm Btn` properties children nottake effect issue @huangchen1031 ([#3556](https://github.com/Tencent/tdesign-react/pull/3556))
- `Slider`: Fix `Slider` mostafter一 label widthnot足自dynamic换row issue @l123wx([#3581](https://github.com/Tencent/tdesign-react/pull/3581))
- `Textarea`: Fixinputin文bein断 issue @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `Tree Select`: Fix单pointalready选invalue when,willdeletealready选invalue issue @Haixing OoO ([#3573](https://github.com/Tencent/tdesign-react/pull/3573))

### 🚧 Others
- `Dialog`: Optimizecomponentinitializerender when间 @Rylan Bot ([#3561](https://github.com/Tencent/tdesign-react/pull/3561))



## 🌈 1.12.1 `2025-05-07` 
### 🐞 Bug Fixes
- Fix 1.12.0 compatible React 18 by under issue @uyarn ([#3545](https://github.com/Tencent/tdesign-react/pull/3545))



## 🌈 1.12.0 `2025-04-28` 
### 🚀 Features
- `React`: 全面upgraderelateddependency,compatiblein React19 inusing @Haixing OoO ([#3438](https://github.com/Tencent/tdesign-react/pull/3438))
- `Color Picker`: @Rylan Bot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503)) usinggradualchangemodebusinessplease note thischangemore ⚠️
 - 自dynamic根据「trigger器 / most近color / 预设color」色value进rowswitch单色andgradualchangemode
 - onlyenabledgradualchangemode when,filter「预设color / when前color」in非gradualchange色value
 - Add format `HEX8`,Remove `HSB`
 - Add `enable MultipleGradient` API,defaultenabled
- `Drawer`: Add `lazy` properties,用in懒loadscenario,`force Render` alreadydeclare废弃,not来versionmovebe Remove @RSS1102 ([#3527](https://github.com/Tencent/tdesign-react/pull/3527))
- `Dialog`: Add `lazy` properties,用in懒loadscenario,`force Render` alreadydeclare废弃,not来versionmovebe Remove @RSS1102 ([#3515](https://github.com/Tencent/tdesign-react/pull/3515))


### 🐞 Bug Fixes
- `Color Picker`: @Rylan Bot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503))
 - Fixgradualchangepointnomethodnormalupdatecolorand position issue
 - Fixenabled透明通道whenreturnvalue格式change exception


## 🌈 1.11.8 `2025-04-28` 
### 🚀 Features
- `Config Provider`: Support全局contextconfigure作用in Message relatedplugin @lifei Front ([#3513](https://github.com/Tencent/tdesign-react/pull/3513))
- `Icon`: Add `logo-miniprogram` 小程序, `logo-cnb` 云原生build, `seal` 印章, `quote`引号etcicons @taowensheng1997 @uyarn ([#3517](https://github.com/Tencent/tdesign-react/pull/3517))
- `Upload`: `image-flow`mode under Support进度andcustomized errortext @ngyyuusora ([#3525](https://github.com/Tencent/tdesign-react/pull/3525))
- `Select`: multipleviapanel Removeoption Add `on Remove` callback @Quentin Hsu ([#3526](https://github.com/Tencent/tdesign-react/pull/3526))
### 🐞 Bug Fixes
- `Input Number`: Optimizenumberinputbox边界issue @Sight-wcg([#3519](https://github.com/Tencent/tdesign-react/pull/3519))
- `Select`:
 - Fix `1.11.2` after version光标exceptionand子component 式callbackfunctioninmissing完整 `option` 信息 issue @Haixing OoO @uyarn ([#3520](https://github.com/Tencent/tdesign-react/pull/3520)) ([#3529](https://github.com/Tencent/tdesign-react/pull/3529))
 - Optimizemultiple Removetagrelatedevent Correctisnotsame `trigger`, notsametriggerscenario分别Adjustis `clear`, `remove-tag`and `uncheck`,Correctselect alloption `trigger` error @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
 - Fixsinglecase underagaintimeclick选inoptionwilltrigger `change` event issue @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
 - Fixmultiplecase underby under `backspace` nomethodtrigger `change` event issue @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))

## 🌈 1.11.7 `2025-04-18` 
### 🚀 Features
- `Config Provider`: Add `is ContextEffect Plugin` API,defaultclose,enabled after全局configurewillaffectto `Dialog`, `Loading`, `Drawer`, `Notification` and `Popup` componentfunction式call @lifei Front ([#3488](https://github.com/Tencent/tdesign-react/pull/3488)) ([#3504](https://github.com/Tencent/tdesign-react/pull/3504))
- `Tree`: `check Props`parameter Supportfunctionpass in,Supportnotsamenodesetnotsamecheck Props @phalera ([#3501](https://github.com/Tencent/tdesign-react/pull/3501))
- `Cascader`：Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `Date Picker`: Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `Time Picker`: Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `Color Picker`: 
 - Add `clearable` API @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
 - Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
### 🐞 Bug Fixes
- `Date Picker`: Ensure外部component主dynamicclose Popup when候,canhasforresponse `on VisibleChange` callback @Rylan Bot ([#3510](https://github.com/Tencent/tdesign-react/pull/3510))
- `Drawer`: Add `Drawer Plugin`,Supportfunction式call,have体using参考example @Wesley-0808 ([#3381](https://github.com/Tencent/tdesign-react/pull/3381))
- `Input Number`: Fixcomponentnotaffected by value properties控制 issue @RSS1102 ([#3499](https://github.com/Tencent/tdesign-react/pull/3499))
- `Image Viewer`:
 - Fixset `step` savein精度display exception issue @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
 - Fix `image Scale` inparameterrequiredtype error @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
- `Slider`: Fixopeninginputboxmode under,using `theme` is `col` inputboxscenario undernohas限制size issue @RSS1102 ([#3500](https://github.com/Tencent/tdesign-react/pull/3500))
- `Tabs`: Optimizeoption卡 `label` 过长whenslidebutton失效 issue @wonkzhang ([common#2108](https://github.com/Tencent/tdesign-common/pull/2108))

## 🌈 1.11.6 `2025-04-11` 
### 🚀 Features
- `Breadcrumb`: Add `ellipsis`, `max Items`, `items AfterCollapse`, `items BeforeCollapse` relatedAPI,用incollapseoptionscenario,have体using参考example @moecasts ([#3487](https://github.com/Tencent/tdesign-react/pull/3487))

### 🐞 Bug Fixes
- `Radio Group`: Optimizeswitchdisplayhighlighteffect issue @Rylan Bot ([#3446](https://github.com/Tencent/tdesign-react/pull/3446))
- `Tag`: Fix `style` 优先级低in `color`,causenomethod强制overridetagstylescenario @uyarn ([#3492](https://github.com/Tencent/tdesign-react/pull/3492))
- `Color Picker`: Fix单色andgradualchangeswitchusingeffect exception issue @Rylan Bot ([#3493](https://github.com/Tencent/tdesign-react/pull/3493))
- `Table`: Fixcan Adjustcolumn宽tablerightdrag Adjust exception issue @uyarn ([#3496](https://github.com/Tencent/tdesign-react/pull/3496))
- `Swiper`: Optimizedefaultcontainerheight,Avoid navigator position exception issue @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))
### 📝 Documentation
- `Swiper`: Optimizecomponentnavigate沙箱demomissingexamplestyle issue @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))

### 🚧 Others
- `1.12.0` versionmove全面compatible React 19 using,has React 19relatedusingscenarioneed求,canupgrade `1.12.0-alpha.3` version进row试用

## 🌈 1.11.4 `2025-04-03` 
### 🐞 Bug Fixes
- `Select`: Fix `options`is空whenwillcause errortriggerblank screen issue @2ue ([#3484](https://github.com/Tencent/tdesign-react/pull/3484))
- `Tree`: Fix icon is false 仍然triggerclickandexpandrelated逻辑 issue @uyarn ([#3485](https://github.com/Tencent/tdesign-react/pull/3485))

## 🌈 1.11.3 `2025-04-01` 
### 🚀 Features
- `Config Provider`: `Pagination` Add `Jumper` configure,用incustomizednavigate部分style @Rylan Bot ([#3421](https://github.com/Tencent/tdesign-react/pull/3421))
### 🐞 Bug Fixes
- `Textarea`: 修復 `Text Area`in `Dialog` `autofocus` bug and `autosize` nottake effect @Haixing OoO ([#3471](https://github.com/Tencent/tdesign-react/pull/3471))
- `lib`: Fix `1.11.2` versionin `lib` 产物冗余stylecause`next.js`inusing exceptionandversion号missing issue @uyarn ([#3474](https://github.com/Tencent/tdesign-react/pull/3474))
- `Table`: Fixaffected by控method under `Pagination` state计算error issue @huangchen1031 ([#3473](https://github.com/Tencent/tdesign-react/pull/3473))

## 🌈 1.11.2 `2025-03-28` 
### 🚀 Features
- `Image Viewer`: Add `on Download` API,用incustomized预览imagedownloadcallback功can @lifei Front ([#3408](https://github.com/Tencent/tdesign-react/pull/3408))
- `Config Provider`: `Input` Add `clear Trigger` configure,用in全局modeinhasvalue whenshowclose button功can @Rylan Bot ([#3412](https://github.com/Tencent/tdesign-react/pull/3412))
- `Descriptions`: Add `table Layout` properties @liweijie0812 ([#3434](https://github.com/Tencent/tdesign-react/pull/3434))
- `Message`: close消息instance when,from全局消息listin Removetheinstance,Avoid潜in内save泄漏风险 @wonkzhang ([#3413](https://github.com/Tencent/tdesign-react/pull/3413))
- `Select`: groupoption器Add Supportfilter功can @huangchen1031 ([#3430](https://github.com/Tencent/tdesign-react/pull/3430))
- `Tabs`: Add `lazy` API,Supportconfigure懒load功can @Haixing OoO ([#3426](https://github.com/Tencent/tdesign-react/pull/3426))

### 🐞 Bug Fixes
- `Config Provider`: Fix全局configure二级configureaffect非`Context`范围 issue @uyarn ([#3441](https://github.com/Tencent/tdesign-react/pull/3441))
- `Dialog`: cancelandconfirmbuttonaddclass name, 便定制need求 @RSS1102 ([#3417](https://github.com/Tencent/tdesign-react/pull/3417))
- `Drawer`: Fixdrag改changesize when候getwidthcancannot正确 issue @wonkzhang ([#3420](https://github.com/Tencent/tdesign-react/pull/3420))
- `Guide`: Fix `popup Props` 穿透properties `overlay ClassName` invalid @RSS1102 ([#3433](https://github.com/Tencent/tdesign-react/pull/3433))
- `Popup`: resolvecomponent修饰符 `arrow` propertiessetnottake effect issue @wonkzhang ([#3437](https://github.com/Tencent/tdesign-react/pull/3437))
- `Select`: Fixsingleboxin `readonly` mode underhas光标and `clear` icons issue @wonkzhang ([#3436](https://github.com/Tencent/tdesign-react/pull/3436))
- `Table`: Fixenabledvirtual scroll when,`fixed Rows` when opening and closing dropdown issue @huangchen1031 ([#3427](https://github.com/Tencent/tdesign-react/pull/3427))
- `Table`: Fixoptionalinrowtablein火狐browserinstyle exception issue @uyarn ([common#2093](https://github.com/Tencent/tdesign-common/pull/2093))
- `Tooltip`: Fix `React 16` under,`Tooltip Lite` `mouse` 计算 position error issue @moecasts ([#3465](https://github.com/Tencent/tdesign-react/pull/3465))
- `Tree`: Fix部分scenario under Removenode aftercomponent error issue @2ue ([#3463](https://github.com/Tencent/tdesign-react/pull/3463))
### 📝 Documentation
- `Card`: Fixdocumentationcontent文案error issue @betavs ([#3448](https://github.com/Tencent/tdesign-react/pull/3448))


## 🌈 1.11.1 `2025-02-28` 
### 🚀 Features
- `Layout`: 子component `Content` Add `content` API @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))
### 🐞 Bug Fixes
- `react Render`: fix `React19` `react Render` error @Haixing OoO ([#3380](https://github.com/Tencent/tdesign-react/pull/3380))
- `Table`: Fix under virtual scrollfooterrender issue @huangchen1031 ([#3383](https://github.com/Tencent/tdesign-react/pull/3383))
- `fix`: Fix`1.11.0` cjs 产物exception @uyarn ([#3392](https://github.com/Tencent/tdesign-react/pull/3392))
### 📝 Documentation
- `Config Provider`: add `global Config` API documentation @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))

## 🌈 1.11.0 `2025-02-20` 
### 🚀 Features
- `Cascader`: Add Supportinopeningmenu when,自dynamicscrollto首 alreadyoptionplaceinnodecan力 @uyarn ([#3357](https://github.com/Tencent/tdesign-react/pull/3357))
- `Date Picker`: Adjustcomponentdisable日期 `before` and `after` parameter逻辑,Adjustisdisable `before` definebeforeand `after` define之after日期select,thispreviously hadusingrelated API please note thischangemore ⚠️ @lifei Front ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `List`: Add `scroll` API,用in larger data量under Supportenabledvirtual scroll @Haixing OoO ([#3363](https://github.com/Tencent/tdesign-react/pull/3363))
- `Menu`: menu Addcollapsecollapsedynamic画effect @hd10180 ([#3342](https://github.com/Tencent/tdesign-react/pull/3342))
- `Tag Input`: Add `max Rows` API,用insetmost largerdisplayrow数 @Shabi-x ([#3293](https://github.com/Tencent/tdesign-react/pull/3293))

### 🐞 Bug Fixes
- `Card`: Fix React 19 in warning issue @Haixing OoO ([#3369](https://github.com/Tencent/tdesign-react/pull/3369))
- `Cascader`: Fixmultipledynamicstateloadusing exception issue @uyarn ([#3376](https://github.com/Tencent/tdesign-react/pull/3376))
- `Checkbox Group`: Fix `on Change` `context` parametermissing `option` issue @Haixing OoO ([#3349](https://github.com/Tencent/tdesign-react/pull/3349))
- `Date Picker`: Fix日期selectin负数when区exception issue @lifei Front ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `Dropdown`: Fix clickeventcallback `context` parameterreturnnot符合documentationdescription issue @uyarn ([#3372](https://github.com/Tencent/tdesign-react/pull/3372))
- `Radio Group`: Fix in React 19 version under exception issue @Haixing OoO ([#3364](https://github.com/Tencent/tdesign-react/pull/3364))
- `Tabs`: Fixcanslide `Tabs` with `action` usingstyle issue @Wesley-0808([#3343](https://github.com/Tencent/tdesign-react/pull/3343))
- `Table`: Fixwith `Tabs` using,switch tab when,Table footer notshow issue @wonkzhang ([#3370](https://github.com/Tencent/tdesign-react/pull/3370))
- `Textarea`: Fix using `autofocus` API 且 `value` hasvalue when,光标nohas跟随content末尾 issue @Haixing OoO ([#3358](https://github.com/Tencent/tdesign-react/pull/3358))
- `Transfer`: Fix `Transfer Item` invalid issue @Haixing OoO ([#3339](https://github.com/Tencent/tdesign-react/pull/3339))


### 🚧 Others
- Adjustcomponentdependency `lodash` dependencyis`lodash-es` @zhangpaopao0609 ([#3345](https://github.com/Tencent/tdesign-react/pull/3345))

## 🌈 1.10.5 `2025-01-16` 
### 🚀 Features
- `Radio Group`: Add `theme` API,用in决定using options whenrender子componentstyle @Haixing OoO ([#3303](https://github.com/Tencent/tdesign-react/pull/3303))
- `Upload`: Add `image Props` API,用ininuploadimagescenario underpass through `Image` componentrelatedproperties @Haixing OoO ([#3317](https://github.com/Tencent/tdesign-react/pull/3317))
- `Auto Complete`: Add `empty` API ,用in Supportcustomized空nodecontent @liweijie0812 ([#3319](https://github.com/Tencent/tdesign-react/pull/3319))
- `Drawer`: `size Draggable`Add Support `Size DragLimit`type功can实现 @huangchen1031 ([#3323](https://github.com/Tencent/tdesign-react/pull/3323))
- `Icon`: Add `logo-alipay`, `logo-behance-filled`etcicons,modify `logo-wecom` icons,Remove icons @uyarn ([#3326](https://github.com/Tencent/tdesign-react/pull/3326))
### 🐞 Bug Fixes
- `Select`: Fix `on Change` callback `context` inalloptionvaluedoes not includeoption本身allcontent issue @uyarn ([#3305](https://github.com/Tencent/tdesign-react/pull/3305))
- `Date RangePicker`: 开始结束valuesimultaneously exist逻辑judgment error issue @betavs ([#3301](https://github.com/Tencent/tdesign-react/pull/3301))
- `Notification`: Fix using `attach` propertiesconfigurecauserendernode exception issue @century Park ([#3306](https://github.com/Tencent/tdesign-react/pull/3306))
- `Auto Complete`: Fix whenoptionis空whenshoweffect exception issue @betavs ([#3316](https://github.com/Tencent/tdesign-react/pull/3316))
- `Menu`: Fix `head-menu` notrender `icon` issue @Haixing OoO ([#3320](https://github.com/Tencent/tdesign-react/pull/3320))
- `Statistic`: Fix `decimal Places=0` when数valuedynamic画期间精度error issue @huangchen1031 ([#3327](https://github.com/Tencent/tdesign-react/pull/3327))
- `Image Viewer`: Fixenabled `close OnOverlay` when,click蒙层closesavein闪烁case issue @huangchen1031


## 🌈 1.10.4 `2024-12-25` 
### 🚀 Features
- `Tree`: Support `on Scroll` API,用inhandlescrolleventcallback @Haixing OoO ([#3295](https://github.com/Tencent/tdesign-react/pull/3295))
- `Tooltip Lite`: `mouse` mode under Optimizeiscompletely跟随鼠标 position,more符合 API description @moecasts ([#3267](https://github.com/Tencent/tdesign-react/pull/3267))
### 🐞 Bug Fixes
- `Select`: Fixselect alldefaultreturnvalue error issue @uyarn ([#3298](https://github.com/Tencent/tdesign-react/pull/3298))
- `Upload`: Optimize部分dimensionuploadcomponentimagedisplaystyle issue @huangchen1031 ([#3290](https://github.com/Tencent/tdesign-react/pull/3290))
### 📝 Documentation
- `Stackblitz`: Adjust`Stackblitz`examplestart 式,并Fix部分examplenomethodusing`stackblitz`or`codesandbox`run issue @uyarn ([#3297](https://github.com/Tencent/tdesign-react/pull/3297))

## 🌈 1.10.2 `2024-12-19`

### 🚀 Features

- `Alert`: in `max Line >= message` array长度case under,notagaindisplay `expandmore多/collapse` button @miownag ([#3281](https://github.com/Tencent/tdesign-react/pull/3281))
- `Config Provider`: `attach` properties Supportconfigure `drawer` component,Support全局configure `drawer` mount position @Haixing OoO ([#3272](https://github.com/Tencent/tdesign-react/pull/3272))
- `Date Picker`: multiplemode Supportweekselectand年selectscenario @Haixing OoO @uyarn ([#3264](https://github.com/Tencent/tdesign-react/pull/3264))
- `Form`: Add `support NumberKey` API,Supportin`1.9.3`after versionnot Supportnumberkeyvaluescenariousing,若notneedrequire Supportnumbertypeasformkeyvalue请closethis API @uyarn ([#3277](https://github.com/Tencent/tdesign-react/pull/3277))
- `Radio`: Add `Radio` and `Radio Group` `reaonly` properties Support @liweijie0812 ([#3280](https://github.com/Tencent/tdesign-react/pull/3280))
- `Tree`: instance Add `set Indeterminate` method,Supportmanualdynamicset半选功can @uyarn ([#3261](https://github.com/Tencent/tdesign-react/pull/3261))
- `Date Picker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `Time Picker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `Range Input`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))

### 🐞 Bug Fixes
- `Date RangePicker`: Fix in跨年scenario underdisplay exception issue @huangchen1031 ([#3275](https://github.com/Tencent/tdesign-react/pull/3275))
- `Menu`: Optimizemenuitemclickevent绑定issue Avoid边界trigger exception issue @huangchen1031 ([#3241](https://github.com/Tencent/tdesign-react/pull/3241))
- `Image Viewer`: Fixnotaffected by控 when,`visable`改change when都willtrigger`on Close` issue @Haixing OoO ([#3244](https://github.com/Tencent/tdesign-react/pull/3244))
- `Checkbox Group`: Fixcheckbox组子elementnotischeckboxcause issue @Haixing OoO ([#3253](https://github.com/Tencent/tdesign-react/pull/3253))
- `Form`: Fix`1.9.3`after version,多级form字段using `set FieldValues` 功can exception issue @l123wx ([#3279](https://github.com/Tencent/tdesign-react/pull/3279))
- `Form`: Fix when规ruleisininvolve `0` judgment when,verifynottake effect issue @RSS1102 ([#3283](https://github.com/Tencent/tdesign-react/pull/3283))
- `Select`: Fix `value Type` is `object`选inselect alldisplay exceptionandcallbackparametermissing issue @uyarn ([#3287](https://github.com/Tencent/tdesign-react/pull/3287))
- `Select Input`: Fixnohas `label` 都willrendernodecause垂直for齐 issue @huangchen1031 ([#3278](https://github.com/Tencent/tdesign-react/pull/3278))
- `Text Area`: Optimize `Text Area` initialize when `autosize` under计算height逻辑 @Haixing OoO ([#3286](https://github.com/Tencent/tdesign-react/pull/3286))

### 🚧 Others
- `Alert`: Optimizetest用例代码typeandaddforin `class Name`, `style` test @RSS1102 ([#3284](https://github.com/Tencent/tdesign-react/pull/3284))


## 🌈 1.10.1 `2024-11-28` 
### 🚀 Features
- `Date Picker`: Add `multiple` API,用in Support日期select器multiple功can,have体using请参考example @Haixing OoO ([#3199](https://github.com/Tencent/tdesign-react/pull/3199))
- `Date Picker`: Add `disable Time` API,用inmore 便地setdisable when间部分 @Haixing OoO ([#3226](https://github.com/Tencent/tdesign-react/pull/3226))
- `Dialog`: Add `before Close` and `before Open` API,用ininopeningandclosedialog whenexecutemore多callback操作 @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
- `Drawer`: Add `before Close` and `before Open` API,用ininopeningandclosedrawer whenexecutemore多callback操作 @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
### 🐞 Bug Fixes

- `Color Picker`: Fix `color Mode` 部分文案nohas Support国际change issue @l123wx ([#3221](https://github.com/Tencent/tdesign-react/pull/3221))
- `Form`: Fix `set FieldsValue` and `set Fields` nohastrigger `on ValuesChange` issue @uyarn ([#3232](https://github.com/Tencent/tdesign-react/pull/3232))
- `Notification`: modify `Notification Plugin` `offset` propertiesdefaultvalue,make其more符合常规习惯 @huangchen1031 ([#3231](https://github.com/Tencent/tdesign-react/pull/3231))
- `Select`:
 - Fix `collapsed Items` parameter `collapsed SelectedItems` error @RSS1102 ([#3214](https://github.com/Tencent/tdesign-react/pull/3214))
 - Fixmultipledropdownselect all功can失效 issue @huangchen1031 ([#3216](https://github.com/Tencent/tdesign-react/pull/3216))
- `Table`:
 - Fixcanfiltertableinhandle `null`type exception issue @2ue ([#3197](https://github.com/Tencent/tdesign-react/pull/3197))
 - Fixcellisnumber 0 且enabled省略whenrender exception issue @uyarn ([#3233](https://github.com/Tencent/tdesign-react/pull/3233))
- `Tree`: Fix `scroll To` methodscroll exceptionrowis @uyarn ([#3235](https://github.com/Tencent/tdesign-react/pull/3235))
### 📝 Documentation
- `Dialog`: Fix代码example error @RSS1102 ([#3229](https://github.com/Tencent/tdesign-react/pull/3229))
### 🚧 Others
- `Text Area`: Optimize `Text Area` eventtype @Haixing OoO ([#3211](https://github.com/Tencent/tdesign-react/pull/3211))

## 🌈 1.10.0 `2024-11-15` 
### 🚀 Features
- `Select`: `collapsed Items` methodparameter `collapsed SelectedItems` 扩充is `options`,using `collapsed Items` please note thischangemore ⚠️ @RSS1102 ([#3185](https://github.com/Tencent/tdesign-react/pull/3185))
- `Icon`: @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
 - icons库Release version `0.4.0`,Add icons
 - 命名Optimize,`blockchain` 重命名改is `transform-1`,`gesture-pray-1` 重命名is `gesture-open`,`gesture-ranslation-1` 重命名is `wave-bye`, `gesture-up-1` 重命名is `gesture-typing`,`gesture-up-2` 重命名is `gesture-right-slip`,`logo-wechat` 重命名is `logo-wechat-stroke-filled`
 - Remove icons
- `Cascader`: in single selection mode when `trigger` is `hover` when,选inoption after自dynamicclosepanel @uyarn ([#3188](https://github.com/Tencent/tdesign-react/pull/3188))
- `Checkbox`: Add `title` API, 用ininoptiondisplaydisable原因etcscenario @uyarn ([#3207](https://github.com/Tencent/tdesign-react/pull/3207))
- `Menu`: Add `tooltip Props` API,作用in一级menucollapsefocusappearnode @uyarn ([#3201](https://github.com/Tencent/tdesign-react/pull/3201))
- `Switch`: Add `before-change` API @century Park ([#3167](https://github.com/Tencent/tdesign-react/pull/3167))
- `Form`: Add `get ValidateMessage` instancemethod @moecasts ([#3180](https://github.com/Tencent/tdesign-react/pull/3180))

### 🐞 Bug Fixes
- `Tag Input`: Fix in `readonly` mode under仍canbyvia Backspacebykeydeletealreadyoption缺陷 @RSS1102 ([#3172](https://github.com/Tencent/tdesign-react/pull/3172))
- `Form`: Fix `1.9.3` version,`Form Item` in `Form` 外set `name` propertieshas exception issue @l123wx ([#3183](https://github.com/Tencent/tdesign-react/pull/3183))
- `Select`: Fix value Type is object when,clickselect allbutton after on Change callbackparametertype error issue @l123wx ([#3193](https://github.com/Tencent/tdesign-react/pull/3193))
- `Table`: Fixdynamicstateset `expand TreeNode` nohasnormaldisplay子node issue @uyarn ([#3202](https://github.com/Tencent/tdesign-react/pull/3202))
- `Tree`: Fixdynamicstateswitch `expand All` 功can exception issue @uyarn ([#3204](https://github.com/Tencent/tdesign-react/pull/3204))
- `Drawer`: Fixnomethodcustomized `confirm Btn` and `close Btn`content issue @RSS1102 ([#3191](https://github.com/Tencent/tdesign-react/pull/3191))
### 📝 Documentation
- `Icon`: Optimizeicons检索功can,Supportin英文searchicons @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Popup`: Add `popper Option` usingexample @Haixing OoO ([#3200](https://github.com/Tencent/tdesign-react/pull/3200))


## 🌈 1.9.3 `2024-10-31` 
### 🐞 Bug Fixes
- `Select`: Fix`value Display`under`on Close`callback issue @uyarn ([#3154](https://github.com/Tencent/tdesign-react/pull/3154))
- `Typography`: Fix `Typography` `Ellipsis` 功caninin文under issue @Haixing OoO ([#3158](https://github.com/Tencent/tdesign-react/pull/3158))
- `Form`: Fix `Form List` or `Form Item` datain `get FieldsValue` issue @Haixing OoO ([#3149](https://github.com/Tencent/tdesign-react/pull/3149))
- `Form`: Fixdynamicstaterenderformnomethodusing `set FieldsValue` 预设data issue @l123wx ([#3145](https://github.com/Tencent/tdesign-react/pull/3145))
- `lib`: Fix`1.9.2`upgradedependency改dynamiccause`lib`error携with`style`causein`next`undernotavailable exception @honkinglin ([#3165](https://github.com/Tencent/tdesign-react/pull/3165))



## 🌈 1.9.2 `2024-10-17` 
### 🚀 Features
- `Time Picker`: Add `auto Swap` API,Support `1.9.0` version之after仍canby保持选定左right when间size顺序 @uyarn ([#3146](https://github.com/Tencent/tdesign-react/pull/3146))
### 🐞 Bug Fixes
- `Tab Panel`: Fix `label` 改change when,激活option卡bottom横线noupdate @Haixing OoO ([#3134](https://github.com/Tencent/tdesign-react/pull/3134))
- `Drawer`: Fixopening页面抖dynamic issue @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Dialog`: Fixopening `dialog` when页面抖dynamic issue @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Select`: Fix using `Option Group `whennomethod自dynamic定to选initem issue @moecasts ([#3139](https://github.com/Tencent/tdesign-react/pull/3139))
### 🚧 Others
- `Loading`: Optimize live demo displayeffect @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))
- `Date Picker`: Removedocumentationin error `value` typedescription @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))

## 🌈 1.9.1 `2024-09-26` 
### 🚀 Features
- `Image Viewer`: Optimizeimage预览旋转reseteffect @sylsaint ([#3108](https://github.com/Tencent/tdesign-react/pull/3108))
- `Table`: canexpandcollapsescenario under Add `t-table__row--expanded` and `t-table__row--folded` 用in区分expandandcollapserow @uyarn ([#3099](https://github.com/Tencent/tdesign-react/pull/3099))
- `Time Picker`: Support when间区间select器自dynamic Adjust左右区间 @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Rate`: Add `clearable` API,用inclear评分 @Haixing OoO ([#3114](https://github.com/Tencent/tdesign-react/pull/3114))
### 🐞 Bug Fixes
- `Dropdown`: Fixset `panel Top Content` after子menu `top` 计算error issue @moecasts ([#3106](https://github.com/Tencent/tdesign-react/pull/3106))
- `Tree Select`: modifymultiplestate underdefaultclick父nodeoptionrowisis选in,ifneedrequireclickexpand,请configure `tree Props.expand OnClick Node` @Haixing OoO ([#3111](https://github.com/Tencent/tdesign-react/pull/3111))
- `Menu`: Fix二级menuexpandcollapsestatenot associatedright箭头changechange issue @uyarn ([#3110](https://github.com/Tencent/tdesign-react/pull/3110))
- `Date RangePicker`: Fixconfigure when间related格式 when,nohas正确handle `default Time` issue @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Date Picker`: Fixweekselect器under,year边界日期return格式error issue @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Color Picker`:
 - Fix部分scenario under子componentsaveinduplicate rendering exception issue @uyarn ([#3118](https://github.com/Tencent/tdesign-react/pull/3118))
 - Fixgradualchangemode under,明度sliderandgradualchangeslidercolornot联dynamic issue @huangchen1031 ([#3109](https://github.com/Tencent/tdesign-react/pull/3109))
### 🚧 Others
- `Site`: 站pointswitch语言whencomponent跟随switch语言 @RSS1102 ([#3100](https://github.com/Tencent/tdesign-react/pull/3100))
- `Form`: Addcustomizedform控件documentationdescriptionandexample @miownag ([#3112](https://github.com/Tencent/tdesign-react/pull/3112))

## 🌈 1.9.0 `2024-09-12` 

### 🚀 Features

- `Tag`: modify `max Width` take effect DOM node, 便控制textcontent长度,has基inthis特visibilitymodifystyleplease note thischangemore ⚠️ @liweijie0812 ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `Form`:
 - Fix `name` using under划线拼接causeusing under划线做 `name` 计算error,hasusing特殊字符做formitem `name` please note thischangemore ⚠️ @Haixing OoO ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
 - add `whitespace` validatedefault error信息 @liweijie0812 ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
 - Support原生 `id` properties,用inwith `Button` 原生 `Form` properties实现formsubmit功can @Haixing OoO ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Card`: `loading` propertiesadd `TNode` Support @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Cascader`: Add `panel Top Content` and `panel Bottom Content`,用in自定responsethepaneltopandbottomcontent @Haixing OoO ([#3096](https://github.com/Tencent/tdesign-react/pull/3096))
- `Checkbox`: Fix `readonly` understyle issue @Haixing OoO ([#3077](https://github.com/Tencent/tdesign-react/pull/3077))
- `Tag`: Add Support `title` API,Supportcustomized `title` configure @Haixing OoO ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `Tree`: Add `allow Drop` API,用in限制dragscenariousing @uyarn ([#3098](https://github.com/Tencent/tdesign-react/pull/3098))

### 🐞 Bug Fixes

- `Card`: Fix `loading` switchstatewillcause子node重新render issue @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Dialog`: Fix `Header` is `null`,configure `close Btn` 仍然render `Header` issue @Haixing OoO ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Input`: Fix计算 `emoji` 字符error issue @novlan1 ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Popup`: Fix `1.8.0` after version针for `Popup` Optimizecause 16.x version under exception issue @moecasts ([#3091](https://github.com/Tencent/tdesign-react/pull/3091))
- `Statistic`: Fix `classname` and `style` notpass through功can exception issue @liweijie0812 ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Time Picker`: Fix `format` only Support HH:mm:ss 格式 issue @liweijie0812 ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))


## 🌈 1.8.1 `2024-08-23` 
### 🐞 Bug Fixes
- `Select`: Fixcustomized `content` when when opening and closing dropdown issue @uyarn ([#3058](https://github.com/Tencent/tdesign-react/pull/3058))
- `Rate`: Fix `1.8.0` versionin评分descriptionnotshow issue @liweijie0812 ([#3060](https://github.com/Tencent/tdesign-react/pull/3060))
- `Popup`: Fix `panel` is null scenario under部分eventcallbackmissingand error issue @uyarn ([#3061](https://github.com/Tencent/tdesign-react/pull/3061))

## 🌈 1.8.0 `2024-08-22` 
### 🚀 Features
- `Empty`: Add `Empty` 空statecomponent @ZWkang @Haixing OoO @double-deng ([#2817](https://github.com/Tencent/tdesign-react/pull/2817))
- `Config Provider`: Support `colon Text` propertiesconfigure `Descriptions`, `Form` component `colon` properties @liweijie0812 ([#3055](https://github.com/Tencent/tdesign-react/pull/3055))

### 🐞 Bug Fixes
- `Color Picker`: Fix `slider` 部分in鼠标移入移出缺陷 @Jippp ([#3042](https://github.com/Tencent/tdesign-react/pull/3042))
- `use VirtualScroll`: modify `visible Data` 计算 式,resolvecan视区域过高 when,scroll afterbottom留白 issue @huangchen1031 ([#2999](https://github.com/Tencent/tdesign-react/pull/2999))
- `Table`: Fix drag sort when,祖先node内顺序error issue @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Input Number`: Fix小数point精度计算,by 0 开头计算边界逻辑missingcause计算error issue @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Popup`: Fix某thesescenario under,hide when定will闪烁 issue @Haixing OoO ([#3052](https://github.com/Tencent/tdesign-react/pull/3052))

### 🚧 Others
- `Popup`: Fix官网`Popup` positiondisplay issue @Haixing OoO ([#3048](https://github.com/Tencent/tdesign-react/pull/3048))
- `Date Picker`: Fix presets example代码error issue @uyarn ([#3050](https://github.com/Tencent/tdesign-react/pull/3050))

## 🌈 1.7.9 `2024-08-07` 
### 🐞 Bug Fixes
- `Tree`: Fix`1.7.8`versionupdatecauseexpandcollapse功can缺陷 @Haixing OoO ([#3039](https://github.com/Tencent/tdesign-react/pull/3039))


## 🌈 1.7.8 `2024-08-01` 
### 🚀 Features
- `Config Provider`: Add `attach` API, Support全局configureattachor全局configure部分componentattach @Haixing OoO ([#3001](https://github.com/Tencent/tdesign-react/pull/3001))
- `Date Picker`: Add `need Confirm` API,Support日期when间select器notneedrequireclickconfirmbuttonsaveselect when间 @Haixing OoO ([#3011](https://github.com/Tencent/tdesign-react/pull/3011))
- `Date RangePicker` Support `borderless` mode @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Range Input`: Support `borderless` mode @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Time RangePicker`: Support `borderless` mode @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Descriptions`: layout typedefine Adjustisstring多type @liweijie0812 ([#3021](https://github.com/Tencent/tdesign-react/pull/3021))
- `Rate`: 评分component Support国际changeconfigure @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
### 🐞 Bug Fixes
- `Upload`: Fix部分iconsnot Support全局替换 issue @uyarn ([#3009](https://github.com/Tencent/tdesign-react/pull/3009))
- `Select`: Fix `Select` `label` and `prefix Icon` multiplestate undershow issue @Haixing OoO ([#3019](https://github.com/Tencent/tdesign-react/pull/3019))
- `Tree`: Fix部分scenario under首 子nodeset `checked` aftercause整 treeinitializestate exception issue @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
- `Dropdown Item`: Fixdisablestateaffectcomponent本身responserowis缺陷 @uyarn ([#3024](https://github.com/Tencent/tdesign-react/pull/3024))
- `Tag Input`: `on DragSort` inusing `use Ref` causecontext error @Heising ([#3003](https://github.com/Tencent/tdesign-react/pull/3003))
### 🚧 Others
- `Dialog`: Fix positionexample error issue @novlan1 ([#3005](https://github.com/Tencent/tdesign-react/pull/3005))
- `Range Input`: add`live Demo` @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))

## 🌈 1.7.7 `2024-07-18` 
### 🚀 Features
- `Icon`: Add icons `list-numbered`,Optimize`lock-off`绘制path @DOUBLE-DENG ([icon#9f4acfd](https://github.com/Tencent/tdesign-icons/commit/9f4acfdda58f84f9bca71a22f033e27127dd26db))
- `Breadcrumb Item`: add `tooltip Props` extend, 便定制内 position `tooltip` relatedproperties @carolin913 ([#2990](https://github.com/Tencent/tdesign-react/pull/2990))
- `Image Viewer`: Add `attach` API,Supportcustomizedmountnode @Haixing OoO ([#2995](https://github.com/Tencent/tdesign-react/pull/2995))
- `Drawer`: Add `on SizeDrag End` API,用inneedrequiredrag缩放callbackscenario @NWYLZW ([#2975](https://github.com/Tencent/tdesign-react/pull/2975))

### 🐞 Bug Fixes
- `Icon`: Fixicons`chart-column`命名error issue @uyarn ([#2979](https://github.com/Tencent/tdesign-react/pull/2979))
- `Input`: Fixdisablestate under仍canbyswitch明文密文 issue @uyarn ([#2991](https://github.com/Tencent/tdesign-react/pull/2991))
- `Table`: @uyarn
 - Fixonlysavein一columncandragtable缩小whenstyle exception issue ([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
 - Fix部分scenario underto前缩放when error issue([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
 - Fix空data underdisplaycontentnohas居indisplay issue ([#2996](https://github.com/Tencent/tdesign-react/pull/2996))
### 🚧 Others
- docs(Checkbox): Optimize`Checkbox`documentationcontent @Heising ([common#1835](https://github.com/Tencent/tdesign-common/pull/1835))


## 🌈 1.7.6 `2024-06-27` 
### 🚀 Features
- `Tabs`: Supportvia滚轮or者触摸板进rowscroll操作,Add `scroll Position` API,Supportconfigure选insliderscrollmost终停留 position @oljc ([#2954](https://github.com/Tencent/tdesign-react/pull/2954))
- `Image Viewer`: Add `is Svg` properties,Support原生 `SVG` 预览show,用infor `SVG` 进row操作scenario @Haixing OoO ([#2958](https://github.com/Tencent/tdesign-react/pull/2958))
- `Input`: Add `spell Check` API @NWYLZW ([#2941](https://github.com/Tencent/tdesign-react/pull/2941))

### 🐞 Bug Fixes
- `Date Picker`: Fix单独using `Date RangePicker Panel` panel头部click逻辑and `Date RangePicker` not一致 issue @uyarn ([#2944](https://github.com/Tencent/tdesign-react/pull/2944))
- `Form`: Fixnested `Form List` scenario underusing `should Update` cause循环render issue @moecasts ([#2948](https://github.com/Tencent/tdesign-react/pull/2948))
- `Tabs`: Fix `1.7.4` after version,`Tabs` class Name affect `Tab Item` issue @uyarn ([#2946](https://github.com/Tencent/tdesign-react/pull/2946))
- `Table`: 
 - Fix `use Pagination` in `pagination` dynamicstatechangechange功can issue @Haixing OoO ([#2960](https://github.com/Tencent/tdesign-react/pull/2960))
 - Fix鼠标右keytablealsocanbytriggercolumn宽drag issue @Haixing OoO ([#2961](https://github.com/Tencent/tdesign-react/pull/2961))
 - Fixonlysavein一columncanbe resize usingscenario under,drag功can exception issue @uyarn ([#2959](https://github.com/Tencent/tdesign-react/pull/2959))

### 🚧 Others
- 站point全量Add Type Script example代码 @uyarn @Haixing OoO @ZWkang ([#2871](https://github.com/Tencent/tdesign-react/pull/2871))


## 🌈 1.7.5 `2024-05-31` 
### 🐞 Bug Fixes
- `Date Picker`: Fix click`jump`button逻辑nohassync under拉select改dynamic缺陷 @uyarn ([#2934](https://github.com/Tencent/tdesign-react/pull/2934))

## 🌈 1.7.4 `2024-05-30` 
### 🚀 Features
- `Date Picker`: Optimize日期区间select器头部区间changechange逻辑,select afterleft区间 largerinright区间,ruledefault Adjustisleft区间始终 thanright区间小 1 @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
### 🐞 Bug Fixes
- `Cascader`: Fix `Cascader` search when `check Strictly` mode父nodenotshow @Haixing OoO ([#2914](https://github.com/Tencent/tdesign-react/pull/2914))
- `Select`: Fix半选stateselect alloptiondisplaystyle issue @uyarn ([#2915](https://github.com/Tencent/tdesign-react/pull/2915))
- `Menu`: Fix `Head Menu` under `Menu Item` class namepass through失效 issue @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Tab Panel`: Fixclass namepass through失效 issue @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Breadcrumb`: Fix暗色mode under分隔符notvisible issue @NWYLZW ([#2920](https://github.com/Tencent/tdesign-react/pull/2920))
- `Checkbox`:
 - Fixnomethodrenderisvalueis 0 option @NWYLZW ([#2925](https://github.com/Tencent/tdesign-react/pull/2925))
 - Fixaffected by控statecannot be on Change callbackin正确消费 issue @NWYLZW ([#2926](https://github.com/Tencent/tdesign-react/pull/2926))
- `Select Input`: Fix `interface.d.ts` 文件missing `size` type issue @Haixing OoO ([#2930](https://github.com/Tencent/tdesign-react/pull/2930))
- `Date Picker`: Fix单独usingpanelnohascompatibleno `on MonthChange` callbackscenario issue @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
- `Date RangePicker Panel`: Fix indropdowninselect年/月whenselectappear日期改change错乱 issue @liyucang-git ([#2922](https://github.com/Tencent/tdesign-react/pull/2922))
- `Input Number`: Fix `allow InputOver Limit=false` sizevaluejudgment when,value is undefined when,willappearshow Infinity issue @Haixing OoO ([common#1802](https://github.com/Tencent/tdesign-common/pull/1802))

## 🌈 1.7.3 `2024-05-18` 
### 🐞 Bug Fixes
- `Menu`: Fix二级andby under `Submenu` nohashandle classname 缺陷 @uyarn ([#2911](https://github.com/Tencent/tdesign-react/pull/2911))
- `Upload`: Fixmanualdynamicuploadbug @Haixing OoO ([#2912](https://github.com/Tencent/tdesign-react/pull/2912))
- `Avatar`: Fixwith Popupusingpopupnotdisplay exception @uyarn

## 🌈 1.7.1 `2024-05-16`

### 🚀 Features
- `Avatar`: Add `Click`, `Hover` and `Contextmenu` etc鼠标event,Supportforavatar操作scenariousing @NWYLZW ([#2906](https://github.com/Tencent/tdesign-react/pull/2906))
- `Dialog`: Support `set ConfirmLoading` using @ZWkang ([#2883](https://github.com/Tencent/tdesign-react/pull/2883))
- `Select Input`: Support `size` properties @Haixing OoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Time Picker`: Add Support `on Pick` event and `presets` API @ZWkang ([#2902](https://github.com/Tencent/tdesign-react/pull/2902))
- `Input`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Auto Complete`: Add `borderless` API,Supportnobordermode @uyarn ([#2884](https://github.com/Tencent/tdesign-react/pull/2884))
- `Color Picker`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Date Picker`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Tag Input`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Time Picker`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Scroll`: Adjust `1.6.0` after针for Chrome scrollbarstylecompatiblemethod,notdependency`autoprefixer`version @loopzhou ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
### 🐞 Bug Fixes
- `Color Picker`: Fixswitch预览color when,通道button positionnotchange issue @fennghuang ([#2880](https://github.com/Tencent/tdesign-react/pull/2880))
- `Form`: Fixbyin `Form Item`modify,nohastriggerlisten`Form List``use Watch` issue @Haixing OoO ([#2904](https://github.com/Tencent/tdesign-react/pull/2904))
- `Menu`: @uyarn 
 - Fix using`dist`style因isstyle优先级issuecause子menu position偏移 issue ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
 - improve `t-popup__menu` style优先级,resolve dist 内style优先级一致causestyle exception issue ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Pagination`: Fix when前页input小数afternohas自dynamic Adjust issue @uyarn ([#2886](https://github.com/Tencent/tdesign-react/pull/2886))
- `Select`: 
 - Fix `creatable` 功can exception issue @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
 - Fix `reserve Keyword` with `Option Children` 用method exception issue @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
 - Optimizealready选styleoverridealreadydisablestyle issue @fython ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Slider`: Fix `slider Ref.current` cancanis空 issue @ZWkang ([#2868](https://github.com/Tencent/tdesign-react/pull/2868))
- `Table`: 
 - Fix卸载table when datais空cause error exception @duxphp ([#2900](https://github.com/Tencent/tdesign-react/pull/2900))
 - Fix `1.5.0` after version部分scenario underusingfixedcolumncause exception issue @uyarn ([#2889](https://github.com/Tencent/tdesign-react/pull/2889))
- `Tag Input`:
 - Fixnohaspass through `tag Props` tocollapseoption issue @uyarn ([#2869](https://github.com/Tencent/tdesign-react/pull/2869))
 - extend `collapsed Items` delete功can @Haixing OoO ([#2881](https://github.com/Tencent/tdesign-react/pull/2881))
- `Tree Select`: Fixneedrequirevia `tree Props` set `keys` propertiesonlytake effect issue @ZWkang ([#2896](https://github.com/Tencent/tdesign-react/pull/2896))
- `Upload`: 
 - Fixmanualdynamicmodifyupload进度 bug @Haixing OoO ([#2901](https://github.com/Tencent/tdesign-react/pull/2901))
 - Fiximageupload errortype understyle exception issue @uyarn ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
### 🚧 Others
- `Tag Input`: 补充 `Size` propertiesrelateddocumentation @Haixing OoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Typography`: delete多余 `default Props` @Haixing OoO ([#2866](https://github.com/Tencent/tdesign-react/pull/2866))
- `Upload`: Fixdocumentationin关in OPTIONS methoddescription @Summer-Shen ([#2865](https://github.com/Tencent/tdesign-react/pull/2865))
 
## 🌈 1.7.0 `2024-04-25` 
### 🚀 Features
- `Typography`: Add `Typography` 排版component @insekkei ([#2821](https://github.com/Tencent/tdesign-react/pull/2821))
### 🐞 Bug Fixes
- `Table`: in `effect` async里executeget data whenandupdate data,cancanwillcausesome bug @Haixing OoO ([#2848](https://github.com/Tencent/tdesign-react/pull/2848))
- `Date Picker`: Fix日期select器in月份select回跳initialstate exception @uyarn ([#2854](https://github.com/Tencent/tdesign-react/pull/2854))
- `Form`: `use Watch` in一定case under,name notsamewillcauseview issue缺陷 @Haixing OoO ([#2853](https://github.com/Tencent/tdesign-react/pull/2853))
- `Drawer`: Fix `1.6.0` close Btn propertiesdefaultvaluelost issue @uyarn ([#2856](https://github.com/Tencent/tdesign-react/pull/2856))
- `Dropdown`: Fixoption长度is空仍displaypopup issue @uyarn ([#2860](https://github.com/Tencent/tdesign-react/pull/2860))
- `Dropdown`: Optimize `Dropdown` `children` pass through `disabled` @Haixing OoO ([#2862](https://github.com/Tencent/tdesign-react/pull/2862))
- `Select Input`: Fix非affected by控properties `default PopupVisible` nottake effect issue @uyarn ([#2861](https://github.com/Tencent/tdesign-react/pull/2861))
- `Style`: Fix部分node前缀nomethod统一替换缺陷 @ZWkang @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))
- `Upload`: Fix `method` 枚举value `options` error issue @summer-shen @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))

## 🌈 1.6.0 `2024-04-11` 
### 🚀 Features
- `Portal`: `Portal` Add懒load `force Render`,defaultis `lazy` mode,Optimizeperformance,compatible `SSR` render,for `Dialog` and `Drawer` componentcancansavein破坏visibilityaffect ⚠️ @Haixing OoO ([#2826](https://github.com/Tencent/tdesign-react/pull/2826))
### 🐞 Bug Fixes
- `Image Viewer`: Fix `image Referrerpolicy` nohasfortop缩略图take effect issue @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))
- `Descriptions`: Fix `props` missing `class Name` and `style` properties issue @Haixing OoO ([#2818](https://github.com/Tencent/tdesign-react/pull/2818))
- `Layout`: Fix `Layout` add `Aside` 页面layoutwill跳dynamic issue @Haixing OoO ([#2824](https://github.com/Tencent/tdesign-react/pull/2824))
- `Input`: Fix in `React16` version under阻止冒泡failure issue @Haixing OoO ([#2833](https://github.com/Tencent/tdesign-react/pull/2833))
- `Date Picker`: Fix `1.5.3` version之afterhandle Datetypeandweekselect器exception @uyarn ([#2841](https://github.com/Tencent/tdesign-react/pull/2841))
- `Guide`: 
 - Optimize `SSR` underusing issue @Haixing OoO ([#2842](https://github.com/Tencent/tdesign-react/pull/2842))
 - Fix `SSR` scenario undercomponentinitializerender position exception issue @uyarn ([#2832](https://github.com/Tencent/tdesign-react/pull/2832))
- `Scroll`: Fixbyin `Chrome 121` version Support scroll width 之aftercause `Table`, `Select` and部分appearscrollbarcomponentstyle exception issue @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765)) @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Locale`: Optimize `Date Picker` 部分mode语言package @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Tree`: Fixinitialize after `draggable` propertieslostresponse式 issue @Liao-js ([#2838](https://github.com/Tencent/tdesign-react/pull/2838))
- `Style`: Supportvia `less` 总入口打packagestyleneed求 @NWYLZW @uyarn ([common#1757](https://github.com/Tencent/tdesign-common/pull/1757)) ([common#1766](https://github.com/Tencent/tdesign-common/pull/1766))


## 🌈 1.5.5 `2024-03-28` 
### 🐞 Bug Fixes
- `Image Viewer`: Fix `image Referrerpolicy` nohasfortop缩略图take effect issue @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))

## 🌈 1.5.4 `2024-03-28` 
### 🚀 Features
- `Image Viewer`: Add `image Referrerpolicy` API,Supportwith Image componentneedrequireconfigure Referrerpolicy scenario @uyarn ([#2813](https://github.com/Tencent/tdesign-react/pull/2813))
### 🐞 Bug Fixes
- `Select`: Fix `on Remove` eventnohasnormaltrigger issue @Ali-ovo ([#2802](https://github.com/Tencent/tdesign-react/pull/2802))
- `Skeleton`: Fix`children`is必须type issue @uyarn ([#2805](https://github.com/Tencent/tdesign-react/pull/2805))
- `Tabs`: 提供 `action` 区域defaultstyle @Haixing OoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Locale`: Fix`image`and`image Viewer` 英语语言package exception issue @uyarn @Haixing OoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Image`: `referrerpolicy` parameterbe error传递toouter `div` on,实际传递目标is原生 `image` tag @NWYLZW ([#2811](https://github.com/Tencent/tdesign-react/pull/2811))

## 🌈 1.5.3 `2024-03-14` 
### 🚀 Features
- `Breadcrumb Item`: Support `on Click` event @Haixing OoO ([#2795](https://github.com/Tencent/tdesign-react/pull/2795))
- `Tag`: component Add `color` API,Supportcustomizedcolor @maoyiluo @uyarn ([#2799](https://github.com/Tencent/tdesign-react/pull/2799))
### 🐞 Bug Fixes
- `Form List`: Fix多 component卡死 issue @Haixing OoO ([#2788](https://github.com/Tencent/tdesign-react/pull/2788))
- `Date Picker`: Fix `format` and `value Type` not一致scenario under计算error issue @uyarn ([#2798](https://github.com/Tencent/tdesign-react/pull/2798))
### 🚧 Others
- `Portal`: add Portaltest用例 @Haixing OoO ([#2791](https://github.com/Tencent/tdesign-react/pull/2791))
- `List`: improve List test用例 @Haixing OoO ([#2792](https://github.com/Tencent/tdesign-react/pull/2792))
- `Alert`: improve Alert test,Optimize代码 @Haixing OoO ([#2793](https://github.com/Tencent/tdesign-react/pull/2793))

## 🌈 1.5.2 `2024-02-29` 
### 🚀 Features
- `Cascader`: Add `value Display`and`label` APISupport @Haixing OoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Descriptions`: component Supportnested @Haixing OoO ([#2777](https://github.com/Tencent/tdesign-react/pull/2777))
- `Tabs`: Adjust激活 `Tab` under划线and `Tab Header` borderlevel关系 @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
### 🐞 Bug Fixes
- `Grid`: dimension计算error,widthcompatible exception @NWYLZW ([#2738](https://github.com/Tencent/tdesign-react/pull/2738))
- `Cascader`: Fix`clearable`click清除buttontrigger三time`on Change` issue @Haixing OoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Dialog`: Fix`use DialogPosition`render多time绑定event @Haixing OoO ([#2749](https://github.com/Tencent/tdesign-react/pull/2749))
- `Guide`: Fixcustomizedcontent功can失效 @zhangpaopao0609 ([#2752](https://github.com/Tencent/tdesign-react/pull/2752))
- `Tree`: Fixset `keys.children` afterexpandiconsnohasnormalchangechange issue @uyarn ([#2746](https://github.com/Tencent/tdesign-react/pull/2746))
- `Tree`: Fix `Tree` customizedlabel `set Data` nohasrender issue @Haixing OoO ([#2776](https://github.com/Tencent/tdesign-react/pull/2776))
- `Tree`: Fixset `Tree` width,`Tree Item` `checkbox` willbecompress,`label` 省略号失效 issue @Haixing OoO @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
- `Select`: @uyarn 
 - Fixviascrollloadoption选in afterscrollrowis exception issue ([#2779](https://github.com/Tencent/tdesign-react/pull/2779))
 - Fix using `size` API when,virtual scroll功can exception issue ([#2756](https://github.com/Tencent/tdesign-react/pull/2756))

## 🌈 1.5.1 `2024-01-25` 
### 🚀 Features
- `Popup`: Support `Plugin` 式using. @Haixing OoO ([#2717](https://github.com/Tencent/tdesign-react/pull/2717))
- `Transfer`: Support `direction` API @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Tabs`: Add `action` API,Supportcustomizedright区域 @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
### 🐞 Bug Fixes
- `Pagination`: `Jump to` Adjustis largerwrite,保持一致visibility @wangyewei ([#2716](https://github.com/Tencent/tdesign-react/pull/2716))
- `Table`: Fix`Modal`里`Form`form,using`should Update`卸载has whennomethod找toformmethod. @duxphp ([#2675](https://github.com/Tencent/tdesign-react/pull/2675))
- `Table`: column宽Adjustandrowexpandscenario,Fixrowexpand when,willresetcolumn宽Adjust结果issue @chaishi ([#2722](https://github.com/Tencent/tdesign-react/pull/2722))
- `Select`: Fix`Select`multiplestate under选incontentscroll issue. @Haixing OoO ([#2721](https://github.com/Tencent/tdesign-react/pull/2721))
- `Transfer`: Fix `disabled` API功can exception issue @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Swiper`: Fixto左switch轮播dynamic画when顺序错乱 issue @Haixing OoO ([#2725](https://github.com/Tencent/tdesign-react/pull/2725))
- `Form`: Fix计算 `^` 字符exception issue @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Loading`: Fixnotset `z-index` defaultvalue issue @betavs ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Check Tag`: Fixset `class Name` willoverrideallalreadyhasclass name缺陷 @uyarn ([#2730](https://github.com/Tencent/tdesign-react/pull/2730))
- `Tree Select`: Fix `on Enter` eventnottrigger issue @uyarn ([#2731](https://github.com/Tencent/tdesign-react/pull/2731))
- `Menu`: Fix `collapsed` `scroll` style @Except10n ([#2718](https://github.com/Tencent/tdesign-react/pull/2718))
- `Cascader`: Fix长listscenario under,in `Safari` inusingstyle exception issue @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))

## 🌈 1.5.0 `2024-01-11` 
### 🚨 Breaking Changes
- `Dialog`: theversionmove `class Name` errormount进row Fix,现in `class Name` onlywillbemountto `Dialog` on层containerelement Context 之in.if你needrequire直接modify `Dialog` 本体style,canbyswitchusingis `dialog ClassName` 进rowmodify.
### 🚀 Features
- `Descriptions`: Add `Descriptions` descriptioncomponent @Haixing OoO ([#2706](https://github.com/Tencent/tdesign-react/pull/2706))
- `Dialog`: add `dialog ClassName` 用inhandleinternal dialog nodestyle.建议beforevia `class Name` 直接modifydialog本体style用户switchusingis `dialog ClassName` @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
### 🐞 Bug Fixes
- `Cascader`: Fix Cascader `trigger=hover` filter之after,select操作savein exception bug @Haixing OoO ([#2702](https://github.com/Tencent/tdesign-react/pull/2702))
- `Upload`: Fix Upload `upload FilePercent` typenotdefine @betavs ([#2703](https://github.com/Tencent/tdesign-react/pull/2703))
- `Dialog`: Fix Dialog `class Name` 进row多timenodemount error,`class Name` moveonlybemountto ctx elementon @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
- `Tree Select`: Fix `suffix Icon` error并addrelatedexample @Ali-ovo ([#2692](https://github.com/Tencent/tdesign-react/pull/2692))

## 🌈 1.4.3 `2024-01-02` 
### 🐞 Bug Fixes
- `Auto Complete`: Fix`Active Index=-1`no匹配 when,回车will error issue @Ali-ovo ([#2300](https://github.com/Tencent/tdesign-react/pull/2300))
- `Cascader`: Fix`1.4.2` Cascadersinglefilter undernottrigger选in缺陷 @Haixing OoO ([#2700](https://github.com/Tencent/tdesign-react/pull/2700))


## 🌈 1.4.2 `2023-12-28` 
### 🚀 Features
- `Card`: add `Loading Props` properties @Haixing OoO ([#2677](https://github.com/Tencent/tdesign-react/pull/2677))
- `Date Picker`: `Date RangePicker` Add `cancel RangeSelect Limit`,Supportnot限制 Range Picker select前after范围 @uyarn ([#2684](https://github.com/Tencent/tdesign-react/pull/2684))
- `Space`: elementis空 when,notagainrender一 子element @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
 - Add Supportusing `upload PastedFiles` 粘贴upload文件
 - inputboxtypeuploadcomponent,Addclass name `t-upload--theme-file-input`
 - Add Support `upload PastedFiles`,表示allow粘贴upload文件
 - Add `cancel UploadButton` and `upload Button`,Supportcustomizeduploadbuttonandcanceluploadbutton
 - Add `image ViewerProps`,pass throughimage预览componentallproperties 
 - Add `show ImageFile Name`,to controlis否showimage名称
 - Supportpass indefaultvalueis非array形式
 - Support `file ListDisplay=null` when,hide文件list；并Addmore加完整 `file ListDisplay` parameter,用incustomized UI
### 🐞 Bug Fixes
- `Table`: asyncgetmost新tree形structure data when,优先using `window.request AnimationFrame` function,by防闪屏 @lazybonee ([#2668](https://github.com/Tencent/tdesign-react/pull/2668))
- `Table`: Fix筛选valueis `0/false` when,筛选iconsnotcanhighlight issue @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Cascader`: Fixcomponentin filter 之after进rowselect操作and清除contentsavein exception bug @Haixing OoO ([#2674](https://github.com/Tencent/tdesign-react/pull/2674))
- `Color Picker`: 全局set `border-box` aftercausecolorliststyle issue @carolin913
- `Pagination`: move总数单 `item` 改is `bar` , 保持content一致visibility @dinghuihua ([#2679](https://github.com/Tencent/tdesign-react/pull/2679))
- `Input Number`: Fix `min=0` or `max=0` 限制invalid issue @chaishi ([#2352](https://github.com/Tencent/tdesign-react/pull/2352))
- `Watermark`: Fixrow内 style causenomethod sticky 定issue @carolin913 ([#2685](https://github.com/Tencent/tdesign-react/pull/2685))
- `Calendar`: Fix卡片mode undernotnormaldisplayweek信息缺陷 @uyarn ([#2686](https://github.com/Tencent/tdesign-react/pull/2686))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
 - Fixmanualdynamicupload when,nomethodupdateupload进度issue
 - Fix `upload FilePercent` parametertype issue
 
 ## 🌈 1.4.1 `2023-12-14` 
### 🚀 Features
- `Radio`: Supportvia空格key（Space）选inoption @liweijie0812 ([#2638](https://github.com/Tencent/tdesign-react/pull/2638))
- `Dropdown`: Removefor left item style特殊handle @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
### 🐞 Bug Fixes
- `Auto Complete`: Fix部分特殊字符匹配error issue @ZWkang ([#2631](https://github.com/Tencent/tdesign-react/pull/2631))
- `Date Picker`: Fix日期clickclearcontent whendialogwill闪烁缺陷 @Haixing OoO ([#2641](https://github.com/Tencent/tdesign-react/pull/2641))
- `Date Picker`: Fix日期selectdisable after,after缀iconscolor改change issue @Haixing OoO @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
- `Date Picker`: Fixdisablestate underclickcomponent边缘仍canshow `Panel` @Zz-ZzzZ ([#2653](https://github.com/Tencent/tdesign-react/pull/2653))
- `Dropdown`: Fix under拉menudisablestatecanclick issue @betavs ([#2648](https://github.com/Tencent/tdesign-react/pull/2648))
- `Dropdown Item`: Fix遗漏 `Divider` type缺陷 @uyarn ([#2649](https://github.com/Tencent/tdesign-react/pull/2649))
- `Popup`: Fix `disabled` propertiesnottake effect缺陷 @uyarn ([#2665](https://github.com/Tencent/tdesign-react/pull/2665))
- `Select`: Fix `Input Change` eventinblur whentrigger exception issue @uyarn ([#2664](https://github.com/Tencent/tdesign-react/pull/2664))
- `Select Input`: Fix popup contentwidth计算issue @Haixing OoO ([#2647](https://github.com/Tencent/tdesign-react/pull/2647))
- `Image Viewer`: image预览adddefault缩放 than例andby under ESC whenis否triggerimage预览器closeevent @Haixing OoO ([#2652](https://github.com/Tencent/tdesign-react/pull/2652))
- `Table`: @chaishi
 - Fix `Enhanced Table` treenodenomethodnormalexpand issue ([#2661](https://github.com/Tencent/tdesign-react/pull/2661))
 - Fixvirtual scrollscenario,treenodenomethodexpand issue ([#2659](https://github.com/Tencent/tdesign-react/pull/2659))

 ## 🌈 1.4.0 `2023-11-30`
### 🚀 Features

- `Space`: compatible Supportcomponent spacingin低级browserin呈现 @chaishi ([#2602](https://github.com/Tencent/tdesign-react/pull/2602))
- `Statistic`: Add统计数valuecomponent @Haixing OoO ([#2596](https://github.com/Tencent/tdesign-react/pull/2596))

### 🐞 Bug Fixes

- `Color Picker`: Fix `format` is `hex` when,with `enable Alpha` Adjustopacitynottake effect issue @uyarn ([#2628](https://github.com/Tencent/tdesign-react/pull/2628))
- `Color Picker`: Fixmodifycoloron 滑杆buttoncolornotchange @Haixing OoO ([#2615](https://github.com/Tencent/tdesign-react/pull/2615))
- `Table`: Fix `lazy Load` 懒loadeffect @chaishi ([#2605](https://github.com/Tencent/tdesign-react/pull/2605))
- `Tree`: 
 - Fixtreecomponentnode `open class` state控制逻辑errorcausestyle exception @NWYLZW ([#2611](https://github.com/Tencent/tdesign-react/pull/2611))
 - 指定scrollto特定node API in `key` and `index` responseisoptional @uyarn ([#2626](https://github.com/Tencent/tdesign-react/pull/2626))
- `Drawer`: Fix `mode` is `push` when,推开content区域is drawer node父node. @Haixing OoO ([#2614](https://github.com/Tencent/tdesign-react/pull/2614))
- `Radio`: Fixform `disabled` nottake effectin `Radio on issue @li-jia-nan ([#2397](https://github.com/Tencent/tdesign-react/pull/2397))
- `Pagination`: Fix when `total` is 0 并且 `page Size` 改change when,`current` valueis 0 issue @betavs ([#2624](https://github.com/Tencent/tdesign-react/pull/2624))
- `Image`: Fiximagein SSR mode undernotwilltrigger原生event @Haixing OoO ([#2616](https://github.com/Tencent/tdesign-react/pull/2616))

 ## 🌈 1.3.1 `2023-11-15` 
### 🚀 Features
- `Upload`: dragupload文件scenario,即make文件type error,alsotrigger `drop` event @chaishi ([#2591](https://github.com/Tencent/tdesign-react/pull/2591))
### 🐞 Bug Fixes
- `Tree`: 
 - Fixnotadd `activable` parameteralsocantrigger `on Click` event @Haixing OoO ([#2568](https://github.com/Tencent/tdesign-react/pull/2568))
 - Fixeditabletableeditcomponentbetween联dynamicnottake effect @Haixing OoO ([#2572](https://github.com/Tencent/tdesign-react/pull/2572))
- `Notification`: 
 - Fix连续弹两 `Notification`,第一time实际onlyshow一 @Haixing OoO ([#2595](https://github.com/Tencent/tdesign-react/pull/2595))
 - using `flush Sync` in `use Effect` inwill warning,现in改用循环 `set Timeout 来handle @Haixing OoO ([#2597](https://github.com/Tencent/tdesign-react/pull/2597))
- `Dialog`: 
 - Fix `Dialog` in introduce `Input` component,from `Input` in间input光标willnavigatetomostafter @Haixing OoO ([#2485](https://github.com/Tencent/tdesign-react/pull/2485))
 - Fixdialog头部titleshowaffectcancelbutton position @Haixing OoO ([#2593](https://github.com/Tencent/tdesign-react/pull/2593))
- `Popup`: Fix `Popup Ref` typemissing issue @Ricinix ([#2577](https://github.com/Tencent/tdesign-react/pull/2577))
- `Tabs`: Fix重复click激活option卡,alsowilltrigger `on Change` event. @Haixing OoO ([#2588](https://github.com/Tencent/tdesign-react/pull/2588))
- `Radio`: 根据forresponse variant select Radio.Button 进rowdisplay @NWYLZW ([#2589](https://github.com/Tencent/tdesign-react/pull/2589))
- `Input`: Fixsetmost larger长度after回删exceptionrowis @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Link`: Fix前aftericonsnohas垂直居in issue @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Select`: Fix `inputchange` eventcontextparameter exception issue @uyarn ([#2600](https://github.com/Tencent/tdesign-react/pull/2600))
- `Date Picker`: Fix `Pagination Mini`notupdatecauseswitchrowis exception issue @Ricinix ([#2587](https://github.com/Tencent/tdesign-react/pull/2587))
- `Form`: Fix set Fields trigger on ValuesChange cause死循环 @honkinglin ([#2570](https://github.com/Tencent/tdesign-react/pull/2570))

 ## 🌈 1.3.0 `2023-10-19` 
### 🚀 Features
- `Timeline Item`: addclickevent @Zzongke ([#2545](https://github.com/Tencent/tdesign-react/pull/2545))
- `Tag`: @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
 - Support多type风格tagconfigure
 - Supporttag组`Check TagGroup`using,详见exampledocumentation
### 🐞 Bug Fixes
- `locale`: addmissingit_IT, ru_RU, zh_TW 语言environment @Zzongke ([#2542](https://github.com/Tencent/tdesign-react/pull/2542))
- `Cascader`: `change` eventin `source` exception issue @betavs ([#2544](https://github.com/Tencent/tdesign-react/pull/2544))
- `Tree`: Fix`allow FoldNode OnFilter`istrue underfilter afternodedisplay结果 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Tag Input`: Fix inonlyhas一 option when,deletefiltertextwill误删alreadyoption缺陷 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Tree Select`: Adjustfilteroption after交互rowis,andother实现box架保持一致 @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Rate`: Fix鼠标快速移dynamic,willappear多 text show issue @Jon-Millent ([#2551](https://github.com/Tencent/tdesign-react/pull/2551))

 ## 🌈 1.2.6 `2023-09-28` 
### 🚀 Features
- `Table`: Optimizerendertime数 @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Card`: `title` using `div` get代 `span` incustomizedscenario undermore符合规范 @uyarn ([#2517](https://github.com/Tencent/tdesign-react/pull/2517))
- `Tree`: Supportvia key 匹配单一 value 指定scrollto特定 position,have体using 式请参考example代码 @uyarn ([#2519](https://github.com/Tencent/tdesign-react/pull/2519))
### 🐞 Bug Fixes
- `Form`: Fix form List nested dataget exception @honkinglin ([#2529](https://github.com/Tencent/tdesign-react/pull/2529))
- `Table`: Fix dataswitch when `rowspan AndColspan` render issue @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Cascader`: hover nohas子node data父node whennotupdate子node @betavs ([#2528](https://github.com/Tencent/tdesign-react/pull/2528))
- `Date Picker`: Fixswitch月份invalid issue @honkinglin ([#2531](https://github.com/Tencent/tdesign-react/pull/2531))
- `Dropdown`: Fix`Dropdown` disabled API失效 issue @uyarn ([#2532](https://github.com/Tencent/tdesign-react/pull/2532))

 ## 🌈 1.2.5 `2023-09-14` 
### 🚀 Features
- `Steps`: 全局configureadd步骤baralreadycompleteiconscustomized @Zzongke ([#2491](https://github.com/Tencent/tdesign-react/pull/2491))
- `Table`: can筛选table,`on FilterChange` event Addparameter `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'`,表示trigger筛选bar件changechange来源 @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
- `Form`: trigger Add `submit`option @honkinglin ([#2507](https://github.com/Tencent/tdesign-react/pull/2507))
- `Image Viewer`: `on IndexChange` event Add `trigger` 枚举value `current` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Image`: @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
 - Add `fallback`,表示image兜底图,原始imageloadfailure whenwillshow兜底图
 - Add Support `src` typeis `File`,Supportvia `File` 预览image
- `Upload`: 文案list Supportshow缩略图 @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`:
 - Supportvirtual scrollscenario undervia`key`scrollto特定node @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
 - under virtual scroll 低in`threshold` 仍canrunscroll To操作 @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
### 🐞 Bug Fixes
- `Config Provider`: Fixswitch多语言失效 issue @uyarn ([#2501](https://github.com/Tencent/tdesign-react/pull/2501))
- `Table`:
 - can筛选table,Fix `reset Value` inclear筛选 when,notcanresetto指定 `reset Value` value issue @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
 - tree形structuretable,Fix expanded TreeNodes.sync and expanded-tree-nodes-change using expand TreeNode OnClick wheninvalid issue @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
 - cellineditmode under,save when候forin链式col Keyhandle error,notcanoverride原来value @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
 - editabletable,Fix多 editabletablesimultaneously exist when,validateaffect each other issue @chaishi ([#2498](https://github.com/Tencent/tdesign-react/pull/2498))
- `Tag Input`: Fixcollapsedisplayoptiondimensionsize issue @uyarn ([#2503](https://github.com/Tencent/tdesign-react/pull/2503))
- `Tabs`: Fix using list 传 props 且 destroy OnHide is false under, willlost panel content issue @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `Menu`: Fixmenu `expand Type` defaultmode undermenuitem传递on Clicknottrigger issue @Zzongke ([#2502](https://github.com/Tencent/tdesign-react/pull/2502))
- `Image Viewer`: Fixnomethodvia `visible` 直接opening预览弹box issue @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: Fix1.2.0after version部分`Tree NodeModel`操作失效exception @uyarn

 ## 🌈 1.2.4 `2023-08-31` 
### 🚀 Features
- `Table`: tree形structure,nohasset `expanded TreeNodes` case under,data dataoccurchangechange when,自dynamicresetcollapseplacehasexpandnode（if希望保持expandnode,请usingproperties `expanded TreeNodes` 控制 @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
### 🐞 Bug Fixes
- `Watermark`: modifywatermarknode,notaffectwatermarkdisplay @tingtingcheng6 ([#2459](https://github.com/Tencent/tdesign-react/pull/2459))
- `Table`: @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
 - dragsort + 本地datapaginationscenario,Fix drag sorteventparameter `current Index/target Index/current/target` etcincorrect issue
 - dragsort + 本地datapaginationscenario,Fix in第二页by afterpagination dataindrag Adjust顺序after,will自dynamicnavigateto第一页issue
 - Supportpagination非affected by控用methoddragsortscenario 
- `Slider`: Fixinitialvalueis0 when,label position error缺陷 @Zzongke ([#2477](https://github.com/Tencent/tdesign-react/pull/2477))
- `Tree`: Support `store.children`callget Childrenmethod @uyarn ([#2480](https://github.com/Tencent/tdesign-react/pull/2480)) 

## 🌈 1.2.3 `2023-08-24` 
### 🐞 Bug Fixes
- `Table`: Fix use Previous error @honkinglin ([#2464](https://github.com/Tencent/tdesign-react/pull/2464))
- `Image Viewer`: Fix after introducing文件path error @honkinglin ([#2465](https://github.com/Tencent/tdesign-react/pull/2465)) 

## 🌈 1.2.2 `2023-08-24` 
### 🚀 Features
- `Table`: @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
 - tree形structure,Addcomponentinstancemethod `remove Children`,用in Remove子node 
 - tree形structure,Supportviaproperties `expanded TreeNodes.sync` 自by控制expandnode,非必传properties
- `Tree`: Add `scroll To`method Supportinvirtual scrollscenario underscrollto指定nodeneed求 @uyarn ([#2460](https://github.com/Tencent/tdesign-react/pull/2460))
### 🐞 Bug Fixes
- `Tag Input`: Fixinputin文whenbe卡住 issue @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Table`:
 - clickrowexpand/clickrow选in,Fix `expand OnRow Click`and `select On RowClick` nomethod独立控制rowclickexecute交互issue @chaishi ([#2452](https://github.com/Tencent/tdesign-react/pull/2452))
 - tree形structure,Fixcomponentinstancemethod expandall `expand All` issue @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `Form`: Fix Form Listcomponentusingform set FieldsValue, reset exception @nickcdon ([#2406](https://github.com/Tencent/tdesign-react/pull/2406)) 

## 🌈 1.2.1 `2023-08-16` 
### 🚀 Features
- `Anchor`: Add `get CurrentAnchor` Supportcustomizedhighlight锚point @ontheroad1992 ([#2436](https://github.com/Tencent/tdesign-react/pull/2436))
- `Menu Item`: `on Click` eventadd `value` returnvalue @dexter Bo ([#2441](https://github.com/Tencent/tdesign-react/pull/2441))
- `Form Item`: Add `value Format` function Support格式change data @honkinglin ([#2445](https://github.com/Tencent/tdesign-react/pull/2445))
### 🐞 Bug Fixes
- `Dialog`: Fix闪烁issue @linjunc ([#2435](https://github.com/Tencent/tdesign-react/pull/2435))
- `Select`: @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
 - Fixmultiplelost `title` issue
 - enabled远程search whennotexecuteinternalfilter
- `Popconfirm`: invalid `class Name` and `style` Props @betavs ([#2420](https://github.com/Tencent/tdesign-react/pull/2420))
- `Date Picker`: Fix hover cell causenot必requirewhen opening and closing dropdown @j10ccc ([#2440](https://github.com/Tencent/tdesign-react/pull/2440)) 

 ## 🌈 1.2.0 `2023-08-10` 

### 🚨 Breaking Changes
- `Icon`: @uyarn ([#2429](https://github.com/Tencent/tdesign-react/pull/2429))
 - Add icons
 - Adjusticons命名 `photo` is `camera`,`books` is `bookmark`, `stop-cirle-1` is `stop-circle-stroke`
 - Remove icons页面

### 🚀 Features
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
 - Add `lazy Load` 用in懒load整 table
 - editablecell,Add `edit.keep EditMode` ,用in保持cell始终iseditmode
 - can筛选table,Supportpass through `attrs/style/class Names` properties, style, class nameetc信息tocustomizedcomponent
 - can筛选table,when前 `filter Value` notsetfiltervaluedefaultvalue when,notagainpass through undefined to筛选器component,某thesecomponentdefaultvalue必须isarray,notallowis undefined 
### 🐞 Bug Fixes
- `Cascader`: pass in value notin optionsin whenwill直接error @peng-yin ([#2414](https://github.com/Tencent/tdesign-react/pull/2414))
- `Menu`: Fixsame一 `Menu Item` 多timetrigger `on Change` issue @leezng ([#2424](https://github.com/Tencent/tdesign-react/pull/2424))
- `Drawer`: drawercomponentin `visible` defaultis `true` when,nomethodnormalshow @peng-yin ([#2415](https://github.com/Tencent/tdesign-react/pull/2415))
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
 - virtual scrollscenario,Fixheaderwidthand表contentwidthnot一致issue
 - virtual scrollscenario,Fixdefaultscrollbar长度（ position）andscroll afternot一致issue 

## 🌈 1.1.17 `2023-07-28`
### 🐞 Bug Fixes
- `Tabs`: Fix list 传空array when js error @zhenglianghan ([#2393](https://github.com/Tencent/tdesign-react/pull/2393))
- `List ItemMeta`: Fix `description` 传递customizedelement @qijizh ([#2396](https://github.com/Tencent/tdesign-react/pull/2396))
- `Tree`: Fixenabledvirtual scroll when部分scenario undernode回滚交互exception issue @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))
- `Tree`: Fix `1.1.15` after version基in `level` properties操作nomethodnormal工作 issue @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))

## 🌈 1.1.16 `2023-07-26`
### 🚀 Features
- `Time Picker`: @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
 - `disable Time` callback Add毫秒parameter
 - Optimizedisplaynotoptional when间option whenscrolltonotoptionaloption体验 
- `Dropdown`: Add `panel Top Content` and `panel Bottom Content`,Supportneedrequireonunder额外nodescenariousing @uyarn ([#2387](https://github.com/Tencent/tdesign-react/pull/2387))

### 🐞 Bug Fixes
- `Table`:
 - editabletablescenario,Supportset `col Key` valueis链式properties,如：`a.b.c` @chaishi ([#2381](https://github.com/Tencent/tdesign-react/pull/2381))
 - tree形structuretable,Fix when `selected RowKeys` invaluein data datainnotsavein when error issue @chaishi ([#2385](https://github.com/Tencent/tdesign-react/pull/2385))
- `Guide`: Fixset `step1` is `-1` whenneedrequirehidecomponent功can @uyarn ([#2389](https://github.com/Tencent/tdesign-react/pull/2389))

## 🌈 1.1.15 `2023-07-19` 
### 🚀 Features
- `Date Picker`: Optimizeclosepopup afterresetdefault选in区域 @honkinglin ([#2371](https://github.com/Tencent/tdesign-react/pull/2371))
### 🐞 Bug Fixes
- `Dialog`: Fix `theme=danger` invalid issue @chaishi ([#2365](https://github.com/Tencent/tdesign-react/pull/2365))
- `Popconfirm`: when `confirm Btn/cancel Btn` valuetypeis `Object` whennotpass through @imp2002 ([#2361](https://github.com/Tencent/tdesign-react/pull/2361)) 

## 🌈 1.1.14 `2023-07-12` 
### 🚀 Features
- `Tree`: Supportvirtual scroll @uyarn ([#2359](https://github.com/Tencent/tdesign-react/pull/2359))
- `Table`: tree形structure,addrowlevelclass name, 便businesssetnotsamelevelstyle @chaishi ([#2354](https://github.com/Tencent/tdesign-react/pull/2354))
- `Radio`: Optimizeoption组换rowcase @ontheroad1992 ([#2358](https://github.com/Tencent/tdesign-react/pull/2358))
- `Upload`: @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
 - Addcomponentinstancemethod,`upload FilePercent` 用inupdate文件upload进度
 - `theme=image`,Supportusing `file ListDisplay` customized UI content
 - `theme=image`,Supportclick名称opening新窗口访问image
 - draguploadscenario,Support `accept` 文件type限制

### 🐞 Bug Fixes
- `Upload`: customizeduploadmethod,Fixnotcan正确returnuploadsuccessorfailure after文件issue @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

## 🌈 1.1.13 `2023-07-05` 
### 🐞 Bug Fixes
- `Tag`: Fix `children` isnumber `0` when when opening and closing dropdown exception @Hel Kyle ([#2335](https://github.com/Tencent/tdesign-react/pull/2335))
- `Input`: Fix `limit Number` 部分in `disabled` state understyle issue @uyarn ([#2338](https://github.com/Tencent/tdesign-react/pull/2338))
- `Tag Input`: Fix前 positioniconsstyle缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))
- `Select Input`: Fix when losing focusnotclearinputcontent缺陷 @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))

## 🌈 1.1.12 `2023-06-29` 

### 🚀 Features
- `Site`: Support英文站point @uyarn ([#2316](https://github.com/Tencent/tdesign-react/pull/2316))

### 🐞 Bug Fixes
- `Slider`: Fixnumberinputbox `theme` fixedis `column` issue @Ali-ovo ([#2289](https://github.com/Tencent/tdesign-react/pull/2289))
- `Table`: column宽Adjustandcustomizedcolumn共savescenario,Fixviacustomizedcolumnconfiguretablecolumn数量change少 when,table总widthnomethodagain恢复change小 @chaishi ([#2325](https://github.com/Tencent/tdesign-react/pull/2325))

## 🌈 1.1.11 `2023-06-20` 
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
 - candrag Adjustcolumn宽scenario,Fix `resizable=false` invalid issue,defaultvalueis false
 - 本地datasortscenario,Fixasync拉get data when,cancelsort datawillcause空list issue
 - Fixfixedtable + fixedcolumn + virtual scrollscenario,headernotfor齐issue
 - editablecell/editablerowscenario,Fix data始终validateon一 value issue,Adjustisvalidatemost新inputvalue
 - Fix本地datasort,多字段sortscenario,example代码missing issue
- `Color Picker`: @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
 - initializeisgradualchangemode when,Support空stringasinitialvalue
 - Fix `recent Colors` etc字段type issue
 - Fixinternal under拉optionnotpass through `popup Props` 缺陷


## 🌈 1.1.10 `2023-06-13` 
### 🚀 Features
- `Menu`:
 - `Submenu` Add `popup Props` properties,allowpass throughset底层 Popup dialogproperties @xiaosansiji ([#2284](https://github.com/Tencent/tdesign-react/pull/2284))
 - 弹出menuusing Popup refactor @xiaosansiji ([#2274](https://github.com/Tencent/tdesign-react/pull/2274))

### 🐞 Bug Fixes
- `Input Number`: initialvalueis `undefined` / `null`,且savein `decimal Places` when,notagain进row小数point纠正 @chaishi ([#2273](https://github.com/Tencent/tdesign-react/pull/2273))
- `Select`: Fix `on Blur` methodcallbackparameter exception issue @Ali-ovo ([#2281](https://github.com/Tencent/tdesign-react/pull/2281))
- `Dialog`: Fix in SSR environment under error @night-c ([#2280](https://github.com/Tencent/tdesign-react/pull/2280))
- `Table`: Fixcomponentset `expand OnRow Click` is `true` when,click整row error @pe-3 ([#2275](https://github.com/Tencent/tdesign-react/pull/2275))

## 🌈 1.1.9 `2023-06-06` 
### 🚀 Features
- `Date Picker`: Support `on Confirm` event @honkinglin ([#2260](https://github.com/Tencent/tdesign-react/pull/2260))
- `Menu`: Optimize侧边navigationmenucollapse when,`Tooltip` displaymenucontent @xiaosansiji ([#2263](https://github.com/Tencent/tdesign-react/pull/2263))
- `Swiper`: navigation type Support `dots` `dots-bar` @carolin913 ([#2246](https://github.com/Tencent/tdesign-react/pull/2246))
- `Table`: Add `on ColumnResize Change` event @honkinglin ([#2262](https://github.com/Tencent/tdesign-react/pull/2262))

### 🐞 Bug Fixes
- `Tree Select`: Fix `keys` propertiesnohaspass throughgive `Tree` issue @uyarn ([#2267](https://github.com/Tencent/tdesign-react/pull/2267))
- `Input Number`: Fix部分小数pointnumbernomethodinput issue @chaishi ([#2264](https://github.com/Tencent/tdesign-react/pull/2264))
- `Image Viewer`: Fix触控板缩放操作exception issue @honkinglin ([#2265](https://github.com/Tencent/tdesign-react/pull/2265))
- `Tree Select`: Fix when `label` is `react Node` scenario underdisplay issue @Ali-ovo ([#2258](https://github.com/Tencent/tdesign-react/pull/2258))

## 🌈 1.1.8 `2023-05-25` 
### 🚀 Features
- `Time Picker`: nohas选invalue whennotallowclickconfirmbutton @uyarn ([#2240](https://github.com/Tencent/tdesign-react/pull/2240))

### 🐞 Bug Fixes
- `Form`: Fix `Form List` datapass through issue @honkinglin ([#2239](https://github.com/Tencent/tdesign-react/pull/2239))

## 🌈 1.1.7 `2023-05-19` 
### 🐞 Bug Fixes
- `Tooltip`: Fix箭头偏移issue @uyarn ([#1347](https://github.com/Tencent/tdesign-common/pull/1347))

## 🌈 1.1.6 `2023-05-18` 
### 🚀 Features
- `Tree Select`: Support `panel Conent` API @Arthur Yung ([#2182](https://github.com/Tencent/tdesign-react/pull/2182))

### 🐞 Bug Fixes
- `Select`: Fixcan创建重复 label option缺陷 @uyarn ([#2221](https://github.com/Tencent/tdesign-react/pull/2221))
- `Skeleton`: Fix using `row Col` when额外多render一row theme 缺陷 @uyarn ([#2223](https://github.com/Tencent/tdesign-react/pull/2223))
- `Form`:
 - Fixasyncrenderusing `use Watch` error issue @honkinglin ([#2220](https://github.com/Tencent/tdesign-react/pull/2220))
 - Fix `Form List` initialvalue赋valueinvalid issue @honkinglin ([#2222](https://github.com/Tencent/tdesign-react/pull/2222))

## 🌈 1.1.5 `2023-05-10` 
### 🚀 Features
- `Cascader`: Support `suffix`, `suffix Icon` @honkinglin ([#2200](https://github.com/Tencent/tdesign-react/pull/2200))

### 🐞 Bug Fixes
- `Select Input`: Fix `loading` in `disabled` state underhide issue @honkinglin ([#2196](https://github.com/Tencent/tdesign-react/pull/2196))
- `Image`: Fixcomponentnot Support `ref` issue @li-jia-nan ([#2198](https://github.com/Tencent/tdesign-react/pull/2198))
- `Back Top`: Support `ref` pass through @li-jia-nan ([#2202](https://github.com/Tencent/tdesign-react/pull/2202))

## 🌈 1.1.4 `2023-04-27` 
### 🚀 Features
- `Select`: Support `panel Top Content` invirtual scrolletcneedrequirescrolldropdownscenariousing,have体using 式请看example @uyarn ([#2184](https://github.com/Tencent/tdesign-react/pull/2184))

### 🐞 Bug Fixes
- `Date Picker`: Fix第二timeclickpanelclose exception issue @honkinglin ([#2183](https://github.com/Tencent/tdesign-react/pull/2183))
- `Table`: Fix `use ResizeObserver` ssr error @chaishi ([#2175](https://github.com/Tencent/tdesign-react/pull/2175))

## 🌈 1.1.3 `2023-04-21` 
### 🚀 Features
- `Date Picker`: Support `on Preset Click` event @honkinglin ([#2165](https://github.com/Tencent/tdesign-react/pull/2165))
- `Switch`: `on Change` Supportreturn `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
- `Collapse`: `on Change` Supportreturn `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
### 🐞 Bug Fixes
- `Form`: 
 - Fix主dynamic reset nottrigger `on Reset` 逻辑 @honkinglin ([#2150](https://github.com/Tencent/tdesign-react/pull/2150))
 - Fix `on ValuesChange` eventreturnparameter issue @honkinglin ([#2169](https://github.com/Tencent/tdesign-react/pull/2169))
- `Select`: Fixmultiplemode `size` propertiesnottake effect issue @uyarn ([#2163](https://github.com/Tencent/tdesign-react/pull/2163))
- `Collapse`:
 - Fix `Radio` disablejudgment @duanbaosheng ([#2161](https://github.com/Tencent/tdesign-react/pull/2161))
 - Fix `value` hasdefaultvalue whenaffected by控issue @moecasts ([#2152](https://github.com/Tencent/tdesign-react/pull/2152))
- `Icon`: Fix manifest 统一入口导出 esm module,documentationisandwhenupdate issue @Layouwen ([#2160](https://github.com/Tencent/tdesign-react/pull/2160))

## 🌈 1.1.2 `2023-04-13` 
### 🚀 Features
- `Date Picker`: Optimizeweekselect器highlightjudgment逻辑performance issue @honkinglin ([#2136](https://github.com/Tencent/tdesign-react/pull/2136))
### 🐞 Bug Fixes
- `Dialog`: 
 - Fixset style width nottake effect issue @honkinglin ([#2132](https://github.com/Tencent/tdesign-react/pull/2132))
 - Fix footer render null issue @honkinglin ([#2131](https://github.com/Tencent/tdesign-react/pull/2131))
- `Select`: Fixmultiplegroupdisplaystyle exception issue @uyarn ([#2138](https://github.com/Tencent/tdesign-react/pull/2138))
- `Popup`: 
 - Fix windows under scroll Top appear小数causejudgmentscrollbottom失效 @honkinglin ([#2142](https://github.com/Tencent/tdesign-react/pull/2142))
 - Fix临界point初time定issue @honkinglin ([#2134](https://github.com/Tencent/tdesign-react/pull/2134))
- `Color Picker`: Fix Frame innomethoddrag饱and度and slider issue @insekkei ([#2140](https://github.com/Tencent/tdesign-react/pull/2140))

## 🌈 1.1.1 `2023-04-06` 
### 🚀 Features
- `Sticky Tool`: Add `sticky-tool`component @Zekun Wu ([#2065](https://github.com/Tencent/tdesign-react/pull/2065))

### 🐞 Bug Fixes
- `Tag Input`: Fix基in`Tag Input`componentusing筛选whendelete关key词whenwilldeletealready选value issue @2513483494 ([#2113](https://github.com/Tencent/tdesign-react/pull/2113))
- `Input Number`: Fixinput小数by0结尾when功can exception issue @uyarn ([#2127](https://github.com/Tencent/tdesign-react/pull/2127))
- `Tree`: Fixcomponent data propertiesnotaffected by控issue @PBK-B ([#2119](https://github.com/Tencent/tdesign-react/pull/2119))
- `Form`: Fixinitial dataset issue @honkinglin ([#2124](https://github.com/Tencent/tdesign-react/pull/2124))
- `Tree Select`: Fixfilter afternomethodexpand issue @honkinglin ([#2128](https://github.com/Tencent/tdesign-react/pull/2128))
- `Popup`: Fix右keydisplaypopuptriggerbrowserdefaultevent @honkinglin ([#2120](https://github.com/Tencent/tdesign-react/pull/2120))

## 🌈 1.1.0 `2023-03-30` 
### 🚀 Features
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
 - Supportusing `filter Icon` Supportnotsamecolumnshow nototsame筛选icons
 - Support横toscrolltofixedcolumn
- `Button`: Supportdisablestatenottrigger href navigate逻辑 @honkinglin ([#2095](https://github.com/Tencent/tdesign-react/pull/2095))
- `Back Top`: Add Back Top component @meiqi502 ([#2037](https://github.com/Tencent/tdesign-react/pull/2037))
- `Form`: submit Supportreturn data @honkinglin ([#2096](https://github.com/Tencent/tdesign-react/pull/2096))

### 🐞 Bug Fixes
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
 - Fix SSR environmentin,document is not undefined issue
 - Fix incolumnshow控制scenarioin,nomethoddrag交换column顺序issue 
 - 单row选in功can,Fix `allow Uncheck: false` invalid issue
- `Dialog`: Fix Dialog on Open eventcall when机issue @honkinglin ([#2090](https://github.com/Tencent/tdesign-react/pull/2090))
- `Date Picker`: Fix `format` is12小when制when功can exception issue @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Alert`: Fixclose buttonistext when居inandfontsize issue @Wen1kang @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Watermark`: Fix `Loading` 组合using issue @duanbaosheng ([#2094](https://github.com/Tencent/tdesign-react/pull/2094))
- `Notification`: Fixgetinstance issue @honkinglin ([#2103](https://github.com/Tencent/tdesign-react/pull/2103))
- `Radio`: Fix ts type issue @honkinglin ([#2102](https://github.com/Tencent/tdesign-react/pull/2102))


## 🌈 1.0.5 `2023-03-23` 
### 🚀 Features
- `Time Picker`: Add `size` API , to control when间inputboxsize @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))

### 🐞 Bug Fixes
- `Form`: Fix `Form List` initial dataget issue @honkinglin ([#2067](https://github.com/Tencent/tdesign-react/pull/2067))
- `Watermark`: Fix NextJS in document undefined issue @carolin913 ([#2073](https://github.com/Tencent/tdesign-react/pull/2073))
- `Color Picker`: @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
 - Fix HEX 色valuenomethodmanualdynamicinput issue
 - Fixmost近usingcolornomethoddelete issue
- `Dialog`: Fix`on CloseBtn Click`eventinvalid issue @Arthur Yung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))
- `Bread Crumb`: Fixvia options propertiesnomethodconfigure Icon issue @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))


## 🌈 1.0.4 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
 - column宽Adjust功can,updatecolumn宽Adjust规ruleis：column宽较小nohas超出 when,column宽Adjust表现is when前columnand相邻columnchangechange；column宽超出savein横toscrollbar when,column宽Adjustonlyaffect when前columnandcolumn总宽
 - editablecell(row)功can,Supporteditmode under,datachangechange when实whenvalidate,`col.edit.validate Trigger`
 - onlyhasfixedcolumnsavein when,onlywillappearclass name `.t-table__content--scrollable-to-left` and `.t-table__content--scrollable-to-right`
 - drag功can,Supportdisablefixedcolumnnotcandrag Adjust顺序
- `Upload`: `theme=file-input` 文件is空 when,悬浮whennotshow清除button @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `Input Number`: Support千分粘贴 @uyarn ([#2058](https://github.com/Tencent/tdesign-react/pull/2058))
- `Date Picker`: Support `size` properties @honkinglin ([#2055](https://github.com/Tencent/tdesign-react/pull/2055))
### 🐞 Bug Fixes
- `Form`: Fixresetdefaultvalue datatype error @honkinglin ([#2046](https://github.com/Tencent/tdesign-react/pull/2046))
- `Timeline Item`: Fix导出type @southorange0929 ([#2053](https://github.com/Tencent/tdesign-react/pull/2053))
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
 - Fixtable width jitter issue 
 - column宽Adjust功can,Fix Dialog incolumn宽Adjust issue
 - editable cell, fix dropdown selection component `abort EditOn Event` does not include `on Change` when,依然willin datachangechange whentrigger退出editstate issue
- `Table`: Fix lazy-load reset bug @Mr Weilian ([#2041](https://github.com/Tencent/tdesign-react/pull/2041))
- `Color Picker`: Fixinputboxnomethodinput issue @insekkei ([#2061](https://github.com/Tencent/tdesign-react/pull/2061))
- `Affix`: Fix fixed judgment issue @lio-mengxiang ([#2048](https://github.com/Tencent/tdesign-react/pull/2048))

## 🌈 1.0.3 `2023-03-09` 
### 🚀 Features
- `Message`: Do not auto-close on mouse hover @Hel Kyle ([#2036](https://github.com/Tencent/tdesign-react/pull/2036))
- `Date Picker`: Support `default Time` @honkinglin ([#2038](https://github.com/Tencent/tdesign-react/pull/2038))

### 🐞 Bug Fixes
- `Date Picker`: Fix月份is0whendisplay when前月份issue @honkinglin ([#2032](https://github.com/Tencent/tdesign-react/pull/2032))
- `Upload`: Fix `upload.method` invalid issue @i-tengfei ([#2034](https://github.com/Tencent/tdesign-react/pull/2034))
- `Select`: Fixmultipleselect allinitialvalueis空when选in error issue @uyarn ([#2042](https://github.com/Tencent/tdesign-react/pull/2042))
- `Dialog`: Fixdialog vertically centered issue @KMethod ([#2043](https://github.com/Tencent/tdesign-react/pull/2043))

## 🌈 1.0.2 `2023-03-01` 
### 🚀 Features
- `Image`: imagecomponent Support特殊格式地址 `.avif` and `.webp` @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `Config Provider`: Add `Image` 全局configure `global Config.image.replace ImageSrc`, used to uniformly replace image addresses @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `List`: `list ItemMeta` Support `class Name`, `style` properties @honkinglin ([#2005](https://github.com/Tencent/tdesign-react/pull/2005))

### 🐞 Bug Fixes
- `Form`: @honkinglin ([#2014](https://github.com/Tencent/tdesign-react/pull/2014))
 - Fixvalidation message inheriting error cache issue
 - Remove `Form Item` extra event notification logic
- `Drawer`: Fixscrollbar appears on page after dragging issue @honkinglin ([#2012](https://github.com/Tencent/tdesign-react/pull/2012))
- `Input`: Fixasync rendering width calculation issue @honkinglin ([#2010](https://github.com/Tencent/tdesign-react/pull/2010))
- `Textarea`: Adjust limit display position,Fixandtips 共save whenstyle issue @duanbaosheng ([#2015](https://github.com/Tencent/tdesign-react/pull/2015))
- `Checkbox`: Fix ts type issue @NWYLZW ([#2023](https://github.com/Tencent/tdesign-react/pull/2023))


## 🌈 1.0.1 `2023-02-21` 
### 🚀 Features
- `Popup`: Add `on ScrollTo Bottom` event @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Select`: @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
 - Supportvirtual scrollusing
 - Support `autofocus`, `suffix`,`suffix Icon`and other APIs,`on Search`Addcallbackparameter
 - Option子component Supportcustomized`title`API
- `Icon`: load when注入style,Avoidin next environmentin error issue @uyarn ([#1990](https://github.com/Tencent/tdesign-react/pull/1990))
- `Avatar`: componentinternalimage,using Image componentrender,Supportpass through `image Props` to Image component @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Dialog Plugin`: Supportcustomized `visbile` @moecasts ([#1998](https://github.com/Tencent/tdesign-react/pull/1998))
- `Tabs`: Supportdragcan力 @duanbaosheng ([#1979](https://github.com/Tencent/tdesign-react/pull/1979))

### 🐞 Bug Fixes
- `Select`: Fix `on Inputchange`trigger when机 issue @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Radio`: Fix `disabled` default value issue @honkinglin ([#1977](https://github.com/Tencent/tdesign-react/pull/1977))
- `Table`: Ensureeditablecell保持editstate @moecasts ([#1988](https://github.com/Tencent/tdesign-react/pull/1988))
- `Tag Input`: Fix `0.45.4` after version `Tag Input` add `blur` rowiscause `Select` / `Cascader` / `Tree Select` nomethodfiltermultiple issue @uyarn ([#1989](https://github.com/Tencent/tdesign-react/pull/1989))
- `Avatar`: Fiximage cannot display issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Image`: Fixeventtype issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Tree`: Fixchild nodes cannot be searched after being collapsed issue @honkinglin ([#1999](https://github.com/Tencent/tdesign-react/pull/1999))
- `Popup`: Fixpopup show/hide infinite loop issue @honkinglin ([#1991](https://github.com/Tencent/tdesign-react/pull/1991))
- `Form List`: Fix `on ValuesChange` cannot get latest data issue @honkinglin ([#1992](https://github.com/Tencent/tdesign-react/pull/1992))
- `Drawer`: Fixscrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))
- `Dialog`: Fixscrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))

## 🌈 1.0.0 `2023-02-13` 
### 🚀 Features
- `Dropdown`: submenu levelstructure Adjust,add一层 `t-dropdown__submenu-wrapper` @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

### 🐞 Bug Fixes
- `Tree`: Fix using set Item setnode expanded when,nottrigger `on Expand` issue @genyuMPj ([#1956](https://github.com/Tencent/tdesign-react/pull/1956))
- `Dropdown`: Fix多层超长menu position exception issue @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

## 🌈 0.x `2021-03-26 - 2023-02-08`
Go to [Git Hub](https://github.com/Tencent/tdesign-react/blob/develop/packages/tdesign-react/CHANGELOG-0.x.md) view `0.x` changelog

