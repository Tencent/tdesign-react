---
title: Changelog
doc Class: timeline
toc: false
spline: explain
---

## 🌈 1.15.7 `2025-10-24` 
### 🚀 Features
- `Divider`: Support `size` to control spacing size @Haixing OoO ([#3893](https://github.com/Tencent/tdesign-react/pull/3893))
### 🐞 Bug Fix es
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
### 🐞 Bug Fix es
- `Virtual Scroll`: Fix component warning issue when components with virtual scroll are used with sub-components in async request scenarios @uyarn ([#3876](https://github.com/Tencent/tdesign-react/pull/3876))

## 🌈 1.15.5 `2025-10-05` 
### 🐞 Bug Fix es
- `Watermark`: Fix issue with using in SSR scenario in version `1.15.2` @Wesley-0808([#3873](https://github.com/Tencent/tdesign-react/pull/3873))
- `Descriptions`: Fix spacing issue in borderless mode @liweijie0812 ([#3873](https://github.com/Tencent/tdesign-react/pull/3873))

## 🌈 1.15.4 `2025-10-01` 
### 🚀 Features
- `Image Viewer`: Support `trigger` pass in image `index` parameter, trigger's `open` method parameters may have type differences with bound element trigger events, if you encounter this issue, please change to `()=> open()` use similar anonymous function @betavs ([#3827](https://github.com/Tencent/tdesign-react/pull/3827))
### 🐞 Bug Fix es
- `Swiper`: Fix issue where autoplay fails after clicking navigation bar on mobile @uyarn ([#3862](https://github.com/Tencent/tdesign-react/pull/3862))
- `List`: Remove redundant code introduced in version `1.15.2` that causes initialization lag when virtual scroll is enabled @Rylan Bot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))
- `Select`: Remove redundant code introduced in version `1.15.2` that causes initialization lag when virtual scroll is enabled @Rylan Bot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))

## 🌈 1.15.3 `2025-09-29` 
### 🐞 Bug Fix es
- `Select`: Fix issue where `style` and `class Name` of `Option Group` do not take effect @uyarn ([#3855](https://github.com/Tencent/tdesign-react/pull/3855))

## 🌈 1.15.2 `2025-09-29` 
### 🚀 Features
- `Watermark`: Add `layout` API, support generating watermarks with different layouts, `watermark Text` supports font configuration @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Drawer`: Optimize issue where component content gets selected during drag-resize process @uyarn ([#3844](https://github.com/Tencent/tdesign-react/pull/3844))
### 🐞 Bug Fix es
- `Watermark`: Fix issue where entire canvas content becomes grayscale when multi-line image-text watermark image is configured with grayscale @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Slider`: Fix return value and related display exceptions caused by precision issues after setting `step` @uyarn ([#3821](https://github.com/Tencent/tdesign-react/pull/3821))
- `Tag Input`: Fix issue where `input Value` in `on Blur` is always empty @Rylan Bot ([#3841](https://github.com/Tencent/tdesign-react/pull/3841))
- `Cascader`: Fix issue where parent node is unexpectedly highlighted when selecting only child node in `single` mode @Rylan Bot ([#3840](https://github.com/Tencent/tdesign-react/pull/3840))
- `Date Range Picker Panel`: Fix issue where clicking panel cannot sync when `preset` involves cross-year dates @Rylan Bot ([#3818](https://github.com/Tencent/tdesign-react/pull/3818))
- `Enhanced Table`: Fix issue where position is reset when clicking expand after node drag @Rylan Bot ([#3780](https://github.com/Tencent/tdesign-react/pull/3780))
- `Table`: @Rylan Bot 
 - Fix issue where `on Sort Change` always returns `undefined` when `multiple Sort` is enabled but `sort` or `default Sort` is not declared ([#3824](https://github.com/Tencent/tdesign-react/pull/3824))
 - Fix issue where last row content is obscured when virtual scroll is enabled and `first Full Row` / `last Full Row` etc. are set simultaneously ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue where `fixed Rows` / `first Full Row` / `last Full Row` cannot be used in combination under virtual scroll ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue with abnormal scrollbar length during virtual scroll initialization ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue where fixed header and fixed columns cannot align ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
 - Fix issue where `default Current` must be declared for correct pagination when `pagination` is uncontrolled ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
 - Fix issue where clicking pagination still triggers data update when `pagination` is controlled and unchanged ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
 - Fix issue where editable cell content does not sync when `data` changes ([#3826](https://github.com/Tencent/tdesign-react/pull/3826))
- `Select Input`: @Rylan Bot ([#3838](https://github.com/Tencent/tdesign-react/pull/3838))
 - Fix issue where `on Blur` does not take effect when `popup Visible={false}` is customized
 - Fix issue where `on Blur` is missing `tag Input Value` parameter when `multiple` is enabled
- `Select`: 
 - Fix issue where using `keys` to configure `content` as `label` or `value` does not take effect @Rylan Bot @uyarn ([#3829](https://github.com/Tencent/tdesign-react/pull/3829))
 - Fix issue with blank screen and scrollbar being unexpectedly reset when dynamically switching to virtual scroll @Rylan Bot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))
 - Fix issue where displayed data is not synchronized when virtual scroll is enabled and data is dynamically updated @huangchen1031 ([#3839](https://github.com/Tencent/tdesign-react/pull/3839))
- `List`: 
 - Fix issue where some APIs of `List Item` do not take effect after enabling virtual scroll @Flower BlackG ([#3835](https://github.com/Tencent/tdesign-react/pull/3835))
 - Fix issue where scrollbar is unexpectedly reset when dynamically switching to virtual scroll @Rylan Bot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))

## 🌈 1.15.1 `2025-09-12` 
### 🐞 Bug Fix es
- `Image Viewer`: Fix issue with abnormal `image Scale` configuration effect @uyarn ([#3814](https://github.com/Tencent/tdesign-react/pull/3814))

## 🌈 1.15.0 `2025-09-11` 
### 🚀 Features
- `Icon`: @uyarn ([#3802](https://github.com/Tencent/tdesign-react/pull/3802))
 - `tdesign-icons-react` Release version `0.6.0`,Add `align-bottom`, `no-result`, `no-result-filled`, `tree-list`, `wifi-no`, `wifi-no-filled`, `logo-stackblitz-filled`, `logo-stackblitz`, `logo-wecom-filled` icons,Remove icons, please note when upgrading ⚠️ 
 - Icon resources used in on-demand loading support variable weight feature, configured via `stroke Width` property
 - Icon resources used in on-demand loading support multi-color fill feature, configured via `stroke Color` and `fill Color` properties
- `Date Picker`: Support not closing popup when clicking `preset` by overriding `popup Props` @Rylan Bot ([#3798](https://github.com/Tencent/tdesign-react/pull/3798))
### 🐞 Bug Fix es
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
### 🐞 Bug Fix es
- `Watermark`: improvewatermarkcomponentin SSR scenariocompatible issue @uyarn ([#3765](https://github.com/Tencent/tdesign-react/pull/3765))

## 🌈 1.14.3 `2025-08-26` 
### 🐞 Bug Fix es
- `Pagination`: Fix navigateiconsdoes not reset to correct state issue @phalera ([#3758](https://github.com/Tencent/tdesign-react/pull/3758))
- `Watermark`: Fix `1.14.0` versiondefaulttext colormissingopacity issue @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))
- `Watermark`: Fix `1.14.0` versionnotcompatible SSR scenario issue @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))

## 🌈 1.14.2 `2025-08-22` 
### 🐞 Bug Fix es
- `Dialog`: Fix `1.14.0` versionintroduced new featurecause `draggable` disable failure issue @Rylan Bot ([#3753](https://github.com/Tencent/tdesign-react/pull/3753))

## 🌈 1.14.1 `2025-08-22` 
### 🐞 Bug Fix es
- `Steps`: Fix `1.13.2` versioncause `theme` notis `default` whenduplicate renderingicons issue @RSS1102 ([#3748](https://github.com/Tencent/tdesign-react/pull/3748))

## 🌈 1.14.0 `2025-08-21` 
### 🚀 Features
- `Tabs`: move `remove` eventdelete fromiconsmove to outer container, ensure replacementiconsfunction normallyusing,hasoverridedeleteiconsstyleplease note thischangemore ⚠️ @RSS1102 ([#3736](https://github.com/Tencent/tdesign-react/pull/3736))
- `Card`: Add `header Class Name`, `header Style`, `body Class Name`, `body Style`, `footer Class Name`, `footer Style`,convenient for customizing cardcomponenteach part style @lifei Front ([#3737](https://github.com/Tencent/tdesign-react/pull/3737))
- `Form`: `rules` Supportconfigurevalidate nested fields @uyarn ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `Image Viewer`: Adjust `image Scale` internalpropertiesvaluechangeisoptional @willsontao Zzz ([#3710](https://github.com/Tencent/tdesign-react/pull/3710))
- `Select`: Support `on Create` and `multiple` withusing @uyarn ([#3717](https://github.com/Tencent/tdesign-react/pull/3717))
- `Table`: Addswitch pagination afterreset scrollbar to top feature @RSS1102 ([#3729](https://github.com/Tencent/tdesign-react/pull/3729))
- `Tree`: `on Drag Leave` and `on Drag Over` add `drag Node`, `drop Position` parameter @phalera ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Upload`: Supportinnon-automaticuploadscenario underuploadspecified files @uyarn ([#3742](https://github.com/Tencent/tdesign-react/pull/3742))
- `Color Picker`: Supportinmobiledragcolor palette, slider etc @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Dialog`: Support `draggable` properties Supportinmobiletake effect @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Image Viewer`: Support `draggable` propertiesinmobiletake effect @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Slider`: Supportinmobiledrag @Rylan Bot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Statistic`: modify `color` propertiestypeisstring,by Supportany [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) Supportcolorvalue @RSS1102 ([#3706](https://github.com/Tencent/tdesign-react/pull/3706))

### 🐞 Bug Fix es
- `Tree`: @Rylan Bot
 - Fix `draggable` in `disabled` state understilltake effect exception,thispreviously haddependencythis errorbusinessplease note thischangedynamic ⚠️ ([#3740](https://github.com/Tencent/tdesign-react/pull/3740)) 
 - Fix `check Strictly` defaultis false when,parent-childnode `disabled` statenot associated issue ([#3739](https://github.com/Tencent/tdesign-react/pull/3739))
 - Fix Drag relatedeventcallbackin `node` is null exception ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Form`: @uyarn
 - Fix nestedformaffected byouter `Form List` affect datastructure issue ([#3715](https://github.com/Tencent/tdesign-react/pull/3715))
 - Fix nestedformininnerformaffected byouterformaffectvalidate result field issue ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `Form List`: resolve `1.13.2` introduce Fix,causemanualdynamic `set Fields` setinitialvalueinstead of using `initial Data` afternomethod Add data issue @Rylan Bot ([#3730](https://github.com/Tencent/tdesign-react/pull/3730))
- `Input`: Fix passwordinputboxclickiconsswitchcontentvisiblevisibility when,cursor position cannot be preserved @Rylan Bot ([#3726](https://github.com/Tencent/tdesign-react/pull/3726))
- `Table`: @Rylan Bot ([#3733](https://github.com/Tencent/tdesign-react/pull/3733))
 - Fix enabledvirtual scroll when,dynamicstateupdate data whencauseblank screen issue 
 - Fix enabledvirtual scroll when,headerand under tablewidthnotsyncchangechange
 - Fix enabledvirtual scroll when,scroll is unexpectedlyreset to firstrow position
 - Fix `drag Sort='row-handler-col'` when,columndragnottake effect issue ([#3734](https://github.com/Tencent/tdesign-react/pull/3734))
 - Fix `size='small'` `first Full Row` dimension than `size='medium'` larger exception ([#common2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Watermark`: Fix dark mode under,textwatermarkcontentshow nototobvious issue @Haixing OoO @liweijie0812 ([#3692](https://github.com/Tencent/tdesign-react/pull/3692))
- `Date Picker`: Optimizeyearselectmode underselectsamepanelyear afterpanelcontentdisplayeffect @uyarn ([#3744](https://github.com/Tencent/tdesign-react/pull/3744))


## 🌈 1.13.2 `2025-08-01` 
### 🐞 Bug Fix es
- `Date Picker`: 
 - handlemultiplecase underweekandquartermodetagdelete exception issue @betavs ([#3664](https://github.com/Tencent/tdesign-react/pull/3664))
 - Fix multiplemode under `placeholder` cannotnormaldisappear @Rylan Bot ([#3666](https://github.com/Tencent/tdesign-react/pull/3666))
- `Enhanced Table`: @Rylan Bot
 - resolve `1.13.0` versioninintroduce Fix,causeasyncscenario under `data` updatefailure issue ([#3690](https://github.com/Tencent/tdesign-react/pull/3690)) 
 - Fix using `tree` API when,dynamicstateinitialize `columns` whennotsavein unique key ([#3669](https://github.com/Tencent/tdesign-react/pull/3669))
 - Fix leafnodejudgmentcondition too broad,cause `class Name` forresponsestylenotnormalrender ([#3681](https://github.com/Tencent/tdesign-react/pull/3681))
- `Select Input`: Fix in `use Overlay Inner Style` ingetscrollbarwhenset `display` causesome bug @Haixing OoO ([#3677](https://github.com/Tencent/tdesign-react/pull/3677))
- `Textarea`: Fix `Dialog` in `Textarea` mount `autosize` nottake effect @Haixing OoO ([#3693](https://github.com/Tencent/tdesign-react/pull/3693))
- `Color Picker`: @Rylan Bot ([#3667](https://github.com/Tencent/tdesign-react/pull/3667))
 - reducecolormultiple conversions across color spaces,reduce errors
 - Fix direct lengthbygradualchangepointafterdrag,colorupdate exception issue
 - Fix clear under someoneinputboxnumbervalue when,otherinputboxunexpectedbereset
- `Upload`: Ensurein `before Upload` complete after,againexecuteuploaddynamicas @RSS1102 ([#3686](https://github.com/Tencent/tdesign-react/pull/3686))
- `Table`: Fix `resizable` enabled when,columnborderlinecausecolumnnamecontentmovedynamic issue @Quentin Hsu([#common2224](https://github.com/Tencent/tdesign-common/pull/2224))
- `Descriptions`: Fix nobordermode underleft and rightinnermargin @liweijie0812 ([#common2219](https://github.com/Tencent/tdesign-common/pull/2219))
- `Steps`: Fix customizediconsandstateiconspriorityissue @RSS1102 ([#3670](https://github.com/Tencent/tdesign-react/pull/3670))
- `Form`: Fix dynamicstateformdeleteone data afteragaintime Add,willbackfill olddata issue @Rylan Bot ([#3684](https://github.com/Tencent/tdesign-react/pull/3684))

## 🌈 1.13.1 `2025-07-11`

### 🐞 Bug Fix es
- `QRCode`: Fix `canvas` QR code Safari stylecompatible issue

## 🌈 1.13.0 `2025-07-10` 
### 🚀 Features
- `React19`: Addcompatible React 19 using adapter,in React 19 inusingplease refer tousingdocumentationdetaileddescription @Haixing OoO @uyarn([#3640](https://github.com/Tencent/tdesign-react/pull/3640))
- `QRCode`: Add `QRCode` QR codecomponent @lifei Front @wonkzhang ([#3612](https://github.com/Tencent/tdesign-react/pull/3612))
- `Alert`: Add `close Btn` API,andothercomponentmaintainonecause,`close` moveinnotfromversiondeprecated,please as soon as possible Adjustis `close Btn` using ⚠️ @ngyyuusora ([#3625](https://github.com/Tencent/tdesign-react/pull/3625))
- `Form`: Addinreopening Form when,resetformcontentspecialvisibility @alisdonwang ([#3613](https://github.com/Tencent/tdesign-react/pull/3613))
- `Image Viewer`: Supportinmobileusing when,viatwo fingersenterrowzoomimagefunctioncan @Rylan Bot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
- `locale`: Supportinner positionmultiplelanguage Englishversionsingle and multiplenumberscenarionormaldisplay @Yun You Jun ([#3639](https://github.com/Tencent/tdesign-react/pull/3639))
### 🐞 Bug Fix es
- `Color Picker`: 
 - Fix clickgradualchangepoint when,color palettenohassyncupdate issue @Rylan Bot ([#3624](https://github.com/Tencent/tdesign-react/pull/3624))
 - Fix panelinputinvalidcharacterscenarioandmultipleresetemptyscenario undernohasresetinputboxcontentdefect @uyarn ([#3653](https://github.com/Tencent/tdesign-react/pull/3653))
- `Dropdown`: Fix partscenario underpullmenunodeget exceptioncause error issue @uyarn ([#3657](https://github.com/Tencent/tdesign-react/pull/3657))
- `Image Viewer`: @Rylan Bot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
 - Fix clickworkhavebariconsedgewhennomethodtriggerforresponseoperation
 - Fix byin `Tooltip Lite` cause `z-index` levelrelationshipexception
- `Popup`: Fix `1.11.2` introduce popper.js `arrow` modifiercausearrow positionoffset @Rylan Bot ([#3652](https://github.com/Tencent/tdesign-react/pull/3652))
- `Loading`: Fix in i Pad We Chatonicons position error issue @Nero978([#3655](https://github.com/Tencent/tdesign-react/pull/3655))
- `Menu`: resolve `expand Mutex` saveinnestedsubmenu when,easyinvalid issue @Rylan Bot ([#3621](https://github.com/Tencent/tdesign-react/pull/3621))
- `Table`: 
 - Fix stick to topfunctioncannotfollowheightchangechange issue @huangchen1031 ([#3620](https://github.com/Tencent/tdesign-react/pull/3620))
 - Fix `show Header` is `false` when,`columns` dynamicstatechangechange error issue @Rylan Bot ([#3637](https://github.com/Tencent/tdesign-react/pull/3637))
- `Enhanced Table`: Fix `tree.default Expand All` nomethodtake effect issue @Rylan Bot ([#3638](https://github.com/Tencent/tdesign-react/pull/3638))
- `Textarea`: Fix exceedmost largerheight afterchangerow whenjitterdynamic issue @RSS1102 ([#3631](https://github.com/Tencent/tdesign-react/pull/3631))

## 🌈 1.12.3 `2025-06-13` 
### 🚀 Features
- `Form`: Add `required Mark Position` API,candefinerequiredsymbol position @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
- `Config Provider`: globalconfigure `Form Config` Add `required Mask Position` configure,useinglobalconfigurerequiredsymbol position @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
### 🐞 Bug Fix es
- `Drawer`: Fix `cancel Btn` and `confirm Btn` typemissing `null` declare issue @RSS1102 ([#3602](https://github.com/Tencent/tdesign-react/pull/3602))
- `Image Viewer`: Fix show errorimageinsmall windowimageviewerdimension exception @Rylan Bot([#3607](https://github.com/Tencent/tdesign-react/pull/3607))
- `Menu`: `popup Props` `delay` propertiesin `Sub Menu` innomethodtake effect issue @Rylan Bot ([#3599](https://github.com/Tencent/tdesign-react/pull/3599))
- `Menu`: enabled `expand Mutex` after, ifsaveinsecondary `Sub Menu`,menunomethodexpand @Rylan Bot ([#3601](https://github.com/Tencent/tdesign-react/pull/3601))
- `Select`: Fix `check All` setis `disabled` afterstillwilltriggerselect all issue @Rylan Bot ([#3563](https://github.com/Tencent/tdesign-react/pull/3563))
- `Table`: Optimizeclosecolumnconfiguredialog when,Fix selectcolumn dataandplacedisplaycolumn datanotonecause issue @RSS1102 ([#3608](https://github.com/Tencent/tdesign-react/pull/3608))
- `Tab Panel`: Fix via `style` set `display` propertiesnomethodnormaltake effect issue @uyarn ([#3609](https://github.com/Tencent/tdesign-react/pull/3609))
- `Tabs`: Fix enabledlazyload afteralwayswillfirstrender one `Tab Panel` issue @Haixing OoO ([#3614](https://github.com/Tencent/tdesign-react/pull/3614))
- `Tree Select`: Fix `label` API nomethodnormalusing issue @Rylan Bot ([#3603](https://github.com/Tencent/tdesign-react/pull/3603))

## 🌈 1.12.2 `2025-05-30` 
### 🚀 Features
- `Cascader`: Add Supportusing `option` methodcustomized underpulloptioncontentcanability @huangchen1031 ([#3565](https://github.com/Tencent/tdesign-react/pull/3565))
- `Menu Group`: Add Support `class Name` and `style` using @wang-ky ([#3568](https://github.com/Tencent/tdesign-react/pull/3568))
- `Input Number`: `decimal Places` Add Support `enable Round` parameter,to controlisnoenablingrounding @Rylan Bot ([#3564](https://github.com/Tencent/tdesign-react/pull/3564))
- `Tag Input`: Optimizecandrag when,mousecursorshowismovedynamiccursor @liweijie0812 ([#3552](https://github.com/Tencent/tdesign-react/pull/3552))


### 🐞 Bug Fix es
- `Card`: Fix `content` prop nottake effect issue @Rylan Bot ([#3553](https://github.com/Tencent/tdesign-react/pull/3553))
- `Cascader`: 
 - Fix optionsaveinextra longtextinsizedimension underdisplay exception issue @Shabi-x([#3551](https://github.com/Tencent/tdesign-react/pull/3551))
 - Fix initialize after,asyncupdate `options` when,`display Value` nochangechange issue @huangchen1031 ([#3549](https://github.com/Tencent/tdesign-react/pull/3549))
- `Date Picker`: Fix `on Focus` eventtrigger whenmachineissue @l123wx ([#3578](https://github.com/Tencent/tdesign-react/pull/3578))
- `Drawer`: Optimize `TNode` rerendercauseinputcursorerror issue @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `Form`:
 - Fix in `on Values Change` invia `set Fields` setmutualsamevaluecontinuetrigger `on Values Change` cause `re-render` issue @Haixing OoO ([#3304](https://github.com/Tencent/tdesign-react/pull/3304))
 - Fix `Form List` delete `field` after `reset` valueinitialize error issue @l123wx ([#3557](https://github.com/Tencent/tdesign-react/pull/3557))
 - compatible `1.11.7` versionbeforesingleindependentusing `Form Item` scenario @uyarn ([#3588](https://github.com/Tencent/tdesign-react/pull/3588))
- `Guide`: Optimizecomponentinscreensizechangechange whennohasrecalculation position issue @Haixing OoO ([#3543](https://github.com/Tencent/tdesign-react/pull/3543))
- `List`: Fix emptysubnodecausegetsubnode `props` failure issue @RSS1102 ([#3570](https://github.com/Tencent/tdesign-react/pull/3570))
- `Popconfirm`: Fix `confirm Btn` properties children nottake effect issue @huangchen1031 ([#3556](https://github.com/Tencent/tdesign-react/pull/3556))
- `Slider`: Fix `Slider` mostafterone label widthnotsufficientautodynamicchangerow issue @l123wx([#3581](https://github.com/Tencent/tdesign-react/pull/3581))
- `Textarea`: Fix inputintextbeinbreak issue @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `Tree Select`: Fix singlepointalreadyselectinvalue when,willdeletealreadyselectinvalue issue @Haixing OoO ([#3573](https://github.com/Tencent/tdesign-react/pull/3573))

### 🚧 Others
- `Dialog`: Optimizecomponentinitializerender whenbetween @Rylan Bot ([#3561](https://github.com/Tencent/tdesign-react/pull/3561))



## 🌈 1.12.1 `2025-05-07` 
### 🐞 Bug Fix es
- Fix 1.12.0 compatible React 18 by under issue @uyarn ([#3545](https://github.com/Tencent/tdesign-react/pull/3545))



## 🌈 1.12.0 `2025-04-28` 
### 🚀 Features
- `React`: comprehensiveupgraderelateddependency,compatiblein React19 inusing @Haixing OoO ([#3438](https://github.com/Tencent/tdesign-react/pull/3438))
- `Color Picker`: @Rylan Bot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503)) usinggradualchangemodebusinessplease note thischangemore ⚠️
 - autodynamicaccording to「triggerer / mostnearcolor / presetcolor」colorvalueenterrowswitchmonochromeandgradualchangemode
 - onlyenabledgradualchangemode when,filter「presetcolor / whenbeforecolor」innongradualchangecolorvalue
 - Add format `HEX8`,Remove `HSB`
 - Add `enable Multiple Gradient` API,defaultenabled
- `Drawer`: Add `lazy` properties,useinlazyloadscenario,`force Render` alreadydeclaredeprecated,notfromversionmovebe Remove @RSS1102 ([#3527](https://github.com/Tencent/tdesign-react/pull/3527))
- `Dialog`: Add `lazy` properties,useinlazyloadscenario,`force Render` alreadydeclaredeprecated,notfromversionmovebe Remove @RSS1102 ([#3515](https://github.com/Tencent/tdesign-react/pull/3515))


### 🐞 Bug Fix es
- `Color Picker`: @Rylan Bot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503))
 - Fix gradualchangepointnomethodnormalupdatecolorand position issue
 - Fix enabledtransparency channelwhenreturnvaluegridstylechange exception


## 🌈 1.11.8 `2025-04-28` 
### 🚀 Features
- `Config Provider`: Supportglobalcontextconfigureasusein Message relatedplugin @lifei Front ([#3513](https://github.com/Tencent/tdesign-react/pull/3513))
- `Icon`: Add `logo-miniprogram` smallprocessorder, `logo-cnb` cloudnativebuild, `seal` printchapter, `quote`quotation marksetcicons @taowensheng1997 @uyarn ([#3517](https://github.com/Tencent/tdesign-react/pull/3517))
- `Upload`: `image-flow`mode under Supportenterdegreeandcustomized errortext @ngyyuusora ([#3525](https://github.com/Tencent/tdesign-react/pull/3525))
- `Select`: multipleviapanel Removeoption Add `on Remove` callback @Quentin Hsu ([#3526](https://github.com/Tencent/tdesign-react/pull/3526))
### 🐞 Bug Fix es
- `Input Number`: Optimizenumberinputboxboundaryissue @Sight-wcg([#3519](https://github.com/Tencent/tdesign-react/pull/3519))
- `Select`:
 - Fix `1.11.2` after versioncursorexceptionandsubcomponent stylecallbackfunctioninmissingcompleteentire `option` message issue @Haixing OoO @uyarn ([#3520](https://github.com/Tencent/tdesign-react/pull/3520)) ([#3529](https://github.com/Tencent/tdesign-react/pull/3529))
 - Optimizemultiple Removetagrelatedevent Correctisnotsame `trigger`, notsametriggerscenariorespectively Adjustis `clear`, `remove-tag`and `uncheck`,Correctselect alloption `trigger` error @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
 - Fix singlecase underagaintimeclickselectinoptionwilltrigger `change` event issue @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
 - Fix multiplecase underby under `backspace` nomethodtrigger `change` event issue @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))

## 🌈 1.11.7 `2025-04-18` 
### 🚀 Features
- `Config Provider`: Add `is Context Effect Plugin` API,defaultclose,enabled afterglobalconfigurewillaffectto `Dialog`, `Loading`, `Drawer`, `Notification` and `Popup` componentfunctionstylecall @lifei Front ([#3488](https://github.com/Tencent/tdesign-react/pull/3488)) ([#3504](https://github.com/Tencent/tdesign-react/pull/3504))
- `Tree`: `check Props`parameter Supportfunctionpass in,Supportnotsamenodesetnotsamecheck Props @phalera ([#3501](https://github.com/Tencent/tdesign-react/pull/3501))
- `Cascader`：Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `Date Picker`: Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `Time Picker`: Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `Color Picker`: 
 - Add `clearable` API @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
 - Add `on Clear` eventcallback @Rylan Bot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
### 🐞 Bug Fix es
- `Date Picker`: Ensureexternalcomponentmaindynamicclose Popup whentime,canhasforresponse `on Visible Change` callback @Rylan Bot ([#3510](https://github.com/Tencent/tdesign-react/pull/3510))
- `Drawer`: Add `Drawer Plugin`,Supportfunctionstylecall,havebodyusingreferenceexample @Wesley-0808 ([#3381](https://github.com/Tencent/tdesign-react/pull/3381))
- `Input Number`: Fix componentnotaffected by value propertiescontrolcontrol issue @RSS1102 ([#3499](https://github.com/Tencent/tdesign-react/pull/3499))
- `Image Viewer`:
 - Fix set `step` saveinprecisiondegreedisplay exception issue @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
 - Fix `image Scale` inparameterrequiredtype error @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
- `Slider`: Fix openinginputboxmode under,using `theme` is `col` inputboxscenario undernohaslimitsize issue @RSS1102 ([#3500](https://github.com/Tencent/tdesign-react/pull/3500))
- `Tabs`: Optimizeoptioncard `label` overlongwhenslidebuttoninvalid issue @wonkzhang ([common#2108](https://github.com/Tencent/tdesign-common/pull/2108))

## 🌈 1.11.6 `2025-04-11` 
### 🚀 Features
- `Breadcrumb`: Add `ellipsis`, `max Items`, `items After Collapse`, `items Before Collapse` relatedAPI,useincollapseoptionscenario,havebodyusingreferenceexample @moecasts ([#3487](https://github.com/Tencent/tdesign-react/pull/3487))

### 🐞 Bug Fix es
- `Radio Group`: Optimizeswitchdisplayhighlighteffect issue @Rylan Bot ([#3446](https://github.com/Tencent/tdesign-react/pull/3446))
- `Tag`: Fix `style` low priorityin `color`,causenomethodforceoverridetagstylescenario @uyarn ([#3492](https://github.com/Tencent/tdesign-react/pull/3492))
- `Color Picker`: Fix monochromeandgradualchangeswitchusingeffect exception issue @Rylan Bot ([#3493](https://github.com/Tencent/tdesign-react/pull/3493))
- `Table`: Fix can Adjustcolumnwidthtablerightdrag Adjust exception issue @uyarn ([#3496](https://github.com/Tencent/tdesign-react/pull/3496))
- `Swiper`: Optimizedefaultcontainerheight,Avoid navigator position exception issue @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))
### 📝 Documentation
- `Swiper`: Optimizecomponentnavigatesandboxdemomissingexamplestyle issue @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))

### 🚧 Others
- `1.12.0` versionmovecomprehensivecompatible React 19 using,has React 19relatedusingscenarioneedrequire,canupgrade `1.12.0-alpha.3` versionenterrowtryuse

## 🌈 1.11.4 `2025-04-03` 
### 🐞 Bug Fix es
- `Select`: Fix `options`isemptywhenwillcause errortriggerblank screen issue @2ue ([#3484](https://github.com/Tencent/tdesign-react/pull/3484))
- `Tree`: Fix icon is false stillthentriggerclickandexpandrelatedlogic issue @uyarn ([#3485](https://github.com/Tencent/tdesign-react/pull/3485))

## 🌈 1.11.3 `2025-04-01` 
### 🚀 Features
- `Config Provider`: `Pagination` Add `Jumper` configure,useincustomizednavigatepartstyle @Rylan Bot ([#3421](https://github.com/Tencent/tdesign-react/pull/3421))
### 🐞 Bug Fix es
- `Textarea`: fix `Text Area`in `Dialog` `autofocus` bug and `autosize` nottake effect @Haixing OoO ([#3471](https://github.com/Tencent/tdesign-react/pull/3471))
- `lib`: Fix `1.11.2` versionin `lib` redundant artifactsstylecause`next.js`inusing exceptionandversionnumbermissing issue @uyarn ([#3474](https://github.com/Tencent/tdesign-react/pull/3474))
- `Table`: Fix affected bycontrolmethod under `Pagination` statecalculationerror issue @huangchen1031 ([#3473](https://github.com/Tencent/tdesign-react/pull/3473))

## 🌈 1.11.2 `2025-03-28` 
### 🚀 Features
- `Image Viewer`: Add `on Download` API,useincustomizedpreviewimagedownloadcallbackfunctioncan @lifei Front ([#3408](https://github.com/Tencent/tdesign-react/pull/3408))
- `Config Provider`: `Input` Add `clear Trigger` configure,useinglobalmodeinhasvalue whenshowclose buttonfunctioncan @Rylan Bot ([#3412](https://github.com/Tencent/tdesign-react/pull/3412))
- `Descriptions`: Add `table Layout` properties @liweijie0812 ([#3434](https://github.com/Tencent/tdesign-react/pull/3434))
- `Message`: closemessageinstance when,fromglobalmessagelistin Removetheinstance,Avoidpotentialininnersaveleak risk @wonkzhang ([#3413](https://github.com/Tencent/tdesign-react/pull/3413))
- `Select`: groupoptioner Add Supportfilterfunctioncan @huangchen1031 ([#3430](https://github.com/Tencent/tdesign-react/pull/3430))
- `Tabs`: Add `lazy` API,Supportconfigurelazyloadfunctioncan @Haixing OoO ([#3426](https://github.com/Tencent/tdesign-react/pull/3426))

### 🐞 Bug Fix es
- `Config Provider`: Fix globalconfiguresecondaryconfigureaffectnon`Context`range issue @uyarn ([#3441](https://github.com/Tencent/tdesign-react/pull/3441))
- `Dialog`: cancelandconfirmbuttonaddclass name, convenient to customizeneedrequire @RSS1102 ([#3417](https://github.com/Tencent/tdesign-react/pull/3417))
- `Drawer`: Fix dragchangechangesize whentimegetwidthcancannotcorrect issue @wonkzhang ([#3420](https://github.com/Tencent/tdesign-react/pull/3420))
- `Guide`: Fix `popup Props` penetrateproperties `overlay Class Name` invalid @RSS1102 ([#3433](https://github.com/Tencent/tdesign-react/pull/3433))
- `Popup`: resolvecomponentmodifier `arrow` propertiessetnottake effect issue @wonkzhang ([#3437](https://github.com/Tencent/tdesign-react/pull/3437))
- `Select`: Fix singleboxin `readonly` mode underhascursorand `clear` icons issue @wonkzhang ([#3436](https://github.com/Tencent/tdesign-react/pull/3436))
- `Table`: Fix enabledvirtual scroll when,`fixed Rows` when opening and closing dropdown issue @huangchen1031 ([#3427](https://github.com/Tencent/tdesign-react/pull/3427))
- `Table`: Fix optionalinrowtablein Firefoxbrowserinstyle exception issue @uyarn ([common#2093](https://github.com/Tencent/tdesign-common/pull/2093))
- `Tooltip`: Fix `React 16` under,`Tooltip Lite` `mouse` calculation position error issue @moecasts ([#3465](https://github.com/Tencent/tdesign-react/pull/3465))
- `Tree`: Fix partscenario under Removenode aftercomponent error issue @2ue ([#3463](https://github.com/Tencent/tdesign-react/pull/3463))
### 📝 Documentation
- `Card`: Fix documentationcontentcopy texterror issue @betavs ([#3448](https://github.com/Tencent/tdesign-react/pull/3448))


## 🌈 1.11.1 `2025-02-28` 
### 🚀 Features
- `Layout`: subcomponent `Content` Add `content` API @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))
### 🐞 Bug Fix es
- `react Render`: fix `React19` `react Render` error @Haixing OoO ([#3380](https://github.com/Tencent/tdesign-react/pull/3380))
- `Table`: Fix under virtual scrollfooterrender issue @huangchen1031 ([#3383](https://github.com/Tencent/tdesign-react/pull/3383))
- `fix`: Fix`1.11.0` cjs artifactexception @uyarn ([#3392](https://github.com/Tencent/tdesign-react/pull/3392))
### 📝 Documentation
- `Config Provider`: add `global Config` API documentation @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))

## 🌈 1.11.0 `2025-02-20` 
### 🚀 Features
- `Cascader`: Add Supportinopeningmenu when,autodynamicscrolltofirst alreadyoptionplaceinnodecanability @uyarn ([#3357](https://github.com/Tencent/tdesign-react/pull/3357))
- `Date Picker`: Adjustcomponentdisabledate `before` and `after` parameterlogic,Adjustisdisable `before` definebeforeand `after` define afterdateselect,thispreviously hadusingrelated API please note thischangemore ⚠️ @lifei Front ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `List`: Add `scroll` API,usein larger dataquantityunder Supportenabledvirtual scroll @Haixing OoO ([#3363](https://github.com/Tencent/tdesign-react/pull/3363))
- `Menu`: menu Addcollapsecollapsedynamicdraweffect @hd10180 ([#3342](https://github.com/Tencent/tdesign-react/pull/3342))
- `Tag Input`: Add `max Rows` API,useinsetmost largerdisplayrownumber @Shabi-x ([#3293](https://github.com/Tencent/tdesign-react/pull/3293))

### 🐞 Bug Fix es
- `Card`: Fix React 19 in warning issue @Haixing OoO ([#3369](https://github.com/Tencent/tdesign-react/pull/3369))
- `Cascader`: Fix multipledynamicstateloadusing exception issue @uyarn ([#3376](https://github.com/Tencent/tdesign-react/pull/3376))
- `Checkbox Group`: Fix `on Change` `context` parametermissing `option` issue @Haixing OoO ([#3349](https://github.com/Tencent/tdesign-react/pull/3349))
- `Date Picker`: Fix dateselectinnegativenumberwhenareaexception issue @lifei Front ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `Dropdown`: Fix clickeventcallback `context` parameterreturnnotconform todocumentationdescription issue @uyarn ([#3372](https://github.com/Tencent/tdesign-react/pull/3372))
- `Radio Group`: Fix in React 19 version under exception issue @Haixing OoO ([#3364](https://github.com/Tencent/tdesign-react/pull/3364))
- `Tabs`: Fix canslide `Tabs` with `action` usingstyle issue @Wesley-0808([#3343](https://github.com/Tencent/tdesign-react/pull/3343))
- `Table`: Fix with `Tabs` using,switch tab when,Table footer notshow issue @wonkzhang ([#3370](https://github.com/Tencent/tdesign-react/pull/3370))
- `Textarea`: Fix using `autofocus` API and `value` hasvalue when,cursornohasfollowfollowcontentend issue @Haixing OoO ([#3358](https://github.com/Tencent/tdesign-react/pull/3358))
- `Transfer`: Fix `Transfer Item` invalid issue @Haixing OoO ([#3339](https://github.com/Tencent/tdesign-react/pull/3339))


### 🚧 Others
- Adjustcomponentdependency `lodash` dependencyis`lodash-es` @zhangpaopao0609 ([#3345](https://github.com/Tencent/tdesign-react/pull/3345))

## 🌈 1.10.5 `2025-01-16` 
### 🚀 Features
- `Radio Group`: Add `theme` API,useindecideusing options whenrendersubcomponentstyle @Haixing OoO ([#3303](https://github.com/Tencent/tdesign-react/pull/3303))
- `Upload`: Add `image Props` API,useininuploadimagescenario underpass through `Image` componentrelatedproperties @Haixing OoO ([#3317](https://github.com/Tencent/tdesign-react/pull/3317))
- `Auto Complete`: Add `empty` API,usein Supportcustomizedemptynodecontent @liweijie0812 ([#3319](https://github.com/Tencent/tdesign-react/pull/3319))
- `Drawer`: `size Draggable`Add Support `Size Drag Limit`typefunctioncanimplement @huangchen1031 ([#3323](https://github.com/Tencent/tdesign-react/pull/3323))
- `Icon`: Add `logo-alipay`, `logo-behance-filled`etcicons,modify `logo-wecom` icons,Remove icons @uyarn ([#3326](https://github.com/Tencent/tdesign-react/pull/3326))
### 🐞 Bug Fix es
- `Select`: Fix `on Change` callback `context` inalloptionvaluedoes not includeoptionthisselfallcontent issue @uyarn ([#3305](https://github.com/Tencent/tdesign-react/pull/3305))
- `Date Range Picker`: start and endvaluesimultaneously existlogicjudgment error issue @betavs ([#3301](https://github.com/Tencent/tdesign-react/pull/3301))
- `Notification`: Fix using `attach` propertiesconfigurecauserendernode exception issue @century Park ([#3306](https://github.com/Tencent/tdesign-react/pull/3306))
- `Auto Complete`: Fix whenoptionisemptywhenshoweffect exception issue @betavs ([#3316](https://github.com/Tencent/tdesign-react/pull/3316))
- `Menu`: Fix `head-menu` notrender `icon` issue @Haixing OoO ([#3320](https://github.com/Tencent/tdesign-react/pull/3320))
- `Statistic`: Fix `decimal Places=0` whennumbervaluedynamicdraw periodbetweenprecisiondegreeerror issue @huangchen1031 ([#3327](https://github.com/Tencent/tdesign-react/pull/3327))
- `Image Viewer`: Fix enabled `close On Overlay` when,clickmask layerclosesaveinflickercase issue @huangchen1031


## 🌈 1.10.4 `2024-12-25` 
### 🚀 Features
- `Tree`: Support `on Scroll` API,useinhandlescrolleventcallback @Haixing OoO ([#3295](https://github.com/Tencent/tdesign-react/pull/3295))
- `Tooltip Lite`: `mouse` mode under Optimizeiscompletelyfollow mouse position,moreconform to API description @moecasts ([#3267](https://github.com/Tencent/tdesign-react/pull/3267))
### 🐞 Bug Fix es
- `Select`: Fix select alldefaultreturnvalue error issue @uyarn ([#3298](https://github.com/Tencent/tdesign-react/pull/3298))
- `Upload`: Optimizepartdimensionuploadcomponentimagedisplaystyle issue @huangchen1031 ([#3290](https://github.com/Tencent/tdesign-react/pull/3290))
### 📝 Documentation
- `Stackblitz`: Adjust`Stackblitz`examplestart style,and Fix partexamplenomethodusing`stackblitz`or`codesandbox`run issue @uyarn ([#3297](https://github.com/Tencent/tdesign-react/pull/3297))

## 🌈 1.10.2 `2024-12-19`

### 🚀 Features

- `Alert`: in `max Line >= message` arraylengthcase under,notagaindisplay `expandmoremultiple/collapse` button @miownag ([#3281](https://github.com/Tencent/tdesign-react/pull/3281))
- `Config Provider`: `attach` properties Supportconfigure `drawer` component,Supportglobalconfigure `drawer` mount position @Haixing OoO ([#3272](https://github.com/Tencent/tdesign-react/pull/3272))
- `Date Picker`: multiplemode Supportweekselectandyearselectscenario @Haixing OoO @uyarn ([#3264](https://github.com/Tencent/tdesign-react/pull/3264))
- `Form`: Add `support Number Key` API,Supportin`1.9.3`after versionnot Supportnumberkeyvaluescenariousing, ifnotneedrequire Supportnumbertypeasformkeyvaluepleaseclosethis API @uyarn ([#3277](https://github.com/Tencent/tdesign-react/pull/3277))
- `Radio`: Add `Radio` and `Radio Group` `reaonly` properties Support @liweijie0812 ([#3280](https://github.com/Tencent/tdesign-react/pull/3280))
- `Tree`: instance Add `set Indeterminate` method,Supportmanualdynamicsethalfselectfunctioncan @uyarn ([#3261](https://github.com/Tencent/tdesign-react/pull/3261))
- `Date Picker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `Time Picker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `Range Input`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))

### 🐞 Bug Fix es
- `Date Range Picker`: Fix incross-yearscenario underdisplay exception issue @huangchen1031 ([#3275](https://github.com/Tencent/tdesign-react/pull/3275))
- `Menu`: Optimizemenuitemclickeventbindingissue Avoidboundarytrigger exception issue @huangchen1031 ([#3241](https://github.com/Tencent/tdesign-react/pull/3241))
- `Image Viewer`: Fix notaffected bycontrol when,`visable`changechange whenallwilltrigger`on Close` issue @Haixing OoO ([#3244](https://github.com/Tencent/tdesign-react/pull/3244))
- `Checkbox Group`: Fix checkboxgroupsubelementnotischeckboxcause issue @Haixing OoO ([#3253](https://github.com/Tencent/tdesign-react/pull/3253))
- `Form`: Fix`1.9.3`after version,multiplelevelformfieldusing `set Field Values` functioncan exception issue @l123wx ([#3279](https://github.com/Tencent/tdesign-react/pull/3279))
- `Form`: Fix whenruleruleisininvolve `0` judgment when,verifynottake effect issue @RSS1102 ([#3283](https://github.com/Tencent/tdesign-react/pull/3283))
- `Select`: Fix `value Type` is `object`selectinselect alldisplay exceptionandcallbackparametermissing issue @uyarn ([#3287](https://github.com/Tencent/tdesign-react/pull/3287))
- `Select Input`: Fix nohas `label` allwillrendernodecauseverticalforalign issue @huangchen1031 ([#3278](https://github.com/Tencent/tdesign-react/pull/3278))
- `Text Area`: Optimize `Text Area` initialize when `autosize` undercalculationheightlogic @Haixing OoO ([#3286](https://github.com/Tencent/tdesign-react/pull/3286))

### 🚧 Others
- `Alert`: Optimizetestuseexamplecodetypeandaddforin `class Name`, `style` test @RSS1102 ([#3284](https://github.com/Tencent/tdesign-react/pull/3284))


## 🌈 1.10.1 `2024-11-28` 
### 🚀 Features
- `Date Picker`: Add `multiple` API,usein Supportdateselectermultiplefunctioncan,havebodyusingplease refer toexample @Haixing OoO ([#3199](https://github.com/Tencent/tdesign-react/pull/3199))
- `Date Picker`: Add `disable Time` API,useinmore convenient setdisable whenbetweenpart @Haixing OoO ([#3226](https://github.com/Tencent/tdesign-react/pull/3226))
- `Dialog`: Add `before Close` and `before Open` API,useininopeningandclosedialog whenexecutemoremultiplecallbackoperation @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
- `Drawer`: Add `before Close` and `before Open` API,useininopeningandclosedrawer whenexecutemoremultiplecallbackoperation @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
### 🐞 Bug Fix es

- `Color Picker`: Fix `color Mode` partcopy textnohas Supportinternationalchange issue @l123wx ([#3221](https://github.com/Tencent/tdesign-react/pull/3221))
- `Form`: Fix `set Fields Value` and `set Fields` nohastrigger `on Values Change` issue @uyarn ([#3232](https://github.com/Tencent/tdesign-react/pull/3232))
- `Notification`: modify `Notification Plugin` `offset` propertiesdefaultvalue,makeitsmoreconform to conventional habits @huangchen1031 ([#3231](https://github.com/Tencent/tdesign-react/pull/3231))
- `Select`:
 - Fix `collapsed Items` parameter `collapsed Selected Items` error @RSS1102 ([#3214](https://github.com/Tencent/tdesign-react/pull/3214))
 - Fix multipledropdownselect allfunctioncaninvalid issue @huangchen1031 ([#3216](https://github.com/Tencent/tdesign-react/pull/3216))
- `Table`:
 - Fix canfiltertableinhandle `null`type exception issue @2ue ([#3197](https://github.com/Tencent/tdesign-react/pull/3197))
 - Fix cellisnumber 0 andenabledomitwhenrender exception issue @uyarn ([#3233](https://github.com/Tencent/tdesign-react/pull/3233))
- `Tree`: Fix `scroll To` methodscroll exceptionrowis @uyarn ([#3235](https://github.com/Tencent/tdesign-react/pull/3235))
### 📝 Documentation
- `Dialog`: Fix codeexample error @RSS1102 ([#3229](https://github.com/Tencent/tdesign-react/pull/3229))
### 🚧 Others
- `Text Area`: Optimize `Text Area` eventtype @Haixing OoO ([#3211](https://github.com/Tencent/tdesign-react/pull/3211))

## 🌈 1.10.0 `2024-11-15` 
### 🚀 Features
- `Select`: `collapsed Items` methodparameter `collapsed Selected Items` expandis `options`,using `collapsed Items` please note thischangemore ⚠️ @RSS1102 ([#3185](https://github.com/Tencent/tdesign-react/pull/3185))
- `Icon`: @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
 - iconslibrary Release version `0.4.0`,Add icons
 - naming Optimize,`blockchain` renamechangeis `transform-1`,`gesture-pray-1` renameis `gesture-open`,`gesture-ranslation-1` renameis `wave-bye`, `gesture-up-1` renameis `gesture-typing`,`gesture-up-2` renameis `gesture-right-slip`,`logo-wechat` renameis `logo-wechat-stroke-filled`
 - Remove icons
- `Cascader`: in single selection mode when `trigger` is `hover` when,selectinoption afterautodynamicclosepanel @uyarn ([#3188](https://github.com/Tencent/tdesign-react/pull/3188))
- `Checkbox`: Add `title` API, useininoptiondisplaydisablereasonetcscenario @uyarn ([#3207](https://github.com/Tencent/tdesign-react/pull/3207))
- `Menu`: Add `tooltip Props` API,asuseinonelevelmenucollapsefocusappearnode @uyarn ([#3201](https://github.com/Tencent/tdesign-react/pull/3201))
- `Switch`: Add `before-change` API @century Park ([#3167](https://github.com/Tencent/tdesign-react/pull/3167))
- `Form`: Add `get Validate Message` instancemethod @moecasts ([#3180](https://github.com/Tencent/tdesign-react/pull/3180))

### 🐞 Bug Fix es
- `Tag Input`: Fix in `readonly` mode understillcanbyvia Backspacebykeydeletealreadyoptiondefect @RSS1102 ([#3172](https://github.com/Tencent/tdesign-react/pull/3172))
- `Form`: Fix `1.9.3` version,`Form Item` in `Form` outsideset `name` propertieshas exception issue @l123wx ([#3183](https://github.com/Tencent/tdesign-react/pull/3183))
- `Select`: Fix value Type is object when,clickselect allbutton after on Change callbackparametertype error issue @l123wx ([#3193](https://github.com/Tencent/tdesign-react/pull/3193))
- `Table`: Fix dynamicstateset `expand Tree Node` nohasnormaldisplaysubnode issue @uyarn ([#3202](https://github.com/Tencent/tdesign-react/pull/3202))
- `Tree`: Fix dynamicstateswitch `expand All` functioncan exception issue @uyarn ([#3204](https://github.com/Tencent/tdesign-react/pull/3204))
- `Drawer`: Fix nomethodcustomized `confirm Btn` and `close Btn`content issue @RSS1102 ([#3191](https://github.com/Tencent/tdesign-react/pull/3191))
### 📝 Documentation
- `Icon`: Optimizeiconsretrievefunctioncan,Supportin Englishsearchicons @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Popup`: Add `popper Option` usingexample @Haixing OoO ([#3200](https://github.com/Tencent/tdesign-react/pull/3200))


## 🌈 1.9.3 `2024-10-31` 
### 🐞 Bug Fix es
- `Select`: Fix`value Display`under`on Close`callback issue @uyarn ([#3154](https://github.com/Tencent/tdesign-react/pull/3154))
- `Typography`: Fix `Typography` `Ellipsis` functioncaninintextunder issue @Haixing OoO ([#3158](https://github.com/Tencent/tdesign-react/pull/3158))
- `Form`: Fix `Form List` or `Form Item` datain `get Fields Value` issue @Haixing OoO ([#3149](https://github.com/Tencent/tdesign-react/pull/3149))
- `Form`: Fix dynamicstaterenderformnomethodusing `set Fields Value` presetdata issue @l123wx ([#3145](https://github.com/Tencent/tdesign-react/pull/3145))
- `lib`: Fix`1.9.2`upgradedependencychangedynamiccause`lib`errorcarrywith`style`causein`next`undernotavailable exception @honkinglin ([#3165](https://github.com/Tencent/tdesign-react/pull/3165))



## 🌈 1.9.2 `2024-10-17` 
### 🚀 Features
- `Time Picker`: Add `auto Swap` API,Support `1.9.0` version afterstillcanbymaintainselectfixed leftright whenbetweensizeorder @uyarn ([#3146](https://github.com/Tencent/tdesign-react/pull/3146))
### 🐞 Bug Fix es
- `Tab Panel`: Fix `label` changechange when,activateoptioncardbottomhorizontal linenoupdate @Haixing OoO ([#3134](https://github.com/Tencent/tdesign-react/pull/3134))
- `Drawer`: Fix openingpage jitterdynamic issue @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Dialog`: Fix opening `dialog` whenpage jitterdynamic issue @RSS1102 ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Select`: Fix using `Option Group `whennomethodautodynamicfixedtoselectinitem issue @moecasts ([#3139](https://github.com/Tencent/tdesign-react/pull/3139))
### 🚧 Others
- `Loading`: Optimize live demo displayeffect @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))
- `Date Picker`: Removedocumentationin error `value` typedescription @uyarn ([#3144](https://github.com/Tencent/tdesign-react/pull/3144))

## 🌈 1.9.1 `2024-09-26` 
### 🚀 Features
- `Image Viewer`: Optimizeimagepreviewrotatereseteffect @sylsaint ([#3108](https://github.com/Tencent/tdesign-react/pull/3108))
- `Table`: canexpandcollapsescenario under Add `t-table__row--expanded` and `t-table__row--folded` useindistinguishexpandandcollapserow @uyarn ([#3099](https://github.com/Tencent/tdesign-react/pull/3099))
- `Time Picker`: Support whenbetweenareabetweenselecterautodynamic Adjustleft and right areabetween @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Rate`: Add `clearable` API,useinclearrating @Haixing OoO ([#3114](https://github.com/Tencent/tdesign-react/pull/3114))
### 🐞 Bug Fix es
- `Dropdown`: Fix set `panel Top Content` aftersubmenu `top` calculationerror issue @moecasts ([#3106](https://github.com/Tencent/tdesign-react/pull/3106))
- `Tree Select`: modifymultiplestate underdefaultclickparentnodeoptionrowisisselectin, ifneedrequireclickexpand,pleaseconfigure `tree Props.expand On Click Node` @Haixing OoO ([#3111](https://github.com/Tencent/tdesign-react/pull/3111))
- `Menu`: Fix secondarymenuexpandcollapsestatenot associatedrightarrowchangechange issue @uyarn ([#3110](https://github.com/Tencent/tdesign-react/pull/3110))
- `Date Range Picker`: Fix configure whenbetweenrelatedgridstyle when,nohascorrecthandle `default Time` issue @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Date Picker`: Fix weekselecterunder,yearboundarydatereturngridstyleerror issue @uyarn ([#3117](https://github.com/Tencent/tdesign-react/pull/3117))
- `Color Picker`:
 - Fix partscenario undersubcomponentsaveinduplicate rendering exception issue @uyarn ([#3118](https://github.com/Tencent/tdesign-react/pull/3118))
 - Fix gradualchangemode under,cleardegreesliderandgradualchangeslidercolornotlinkdynamic issue @huangchen1031 ([#3109](https://github.com/Tencent/tdesign-react/pull/3109))
### 🚧 Others
- `Site`: sitepointswitchlanguagewhencomponentfollowfollowswitchlanguage @RSS1102 ([#3100](https://github.com/Tencent/tdesign-react/pull/3100))
- `Form`: Addcustomizedformcontrolitemdocumentationdescriptionandexample @miownag ([#3112](https://github.com/Tencent/tdesign-react/pull/3112))

## 🌈 1.9.0 `2024-09-12` 

### 🚀 Features

- `Tag`: modify `max Width` take effect DOM node, convenientcontrolcontroltextcontentlength,hasbaseinthisspecialvisibilitymodifystyleplease note thischangemore ⚠️ @liweijie0812 ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `Form`:
 - Fix `name` using underhyphen concatenationcauseusing underuse hyphen as `name` calculationerror,hasusinguse special characters asformitem `name` please note thischangemore ⚠️ @Haixing OoO ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
 - add `whitespace` validatedefault errormessage @liweijie0812 ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
 - Supportnative `id` properties,useinwith `Button` native `Form` propertiesimplementformsubmitfunctioncan @Haixing OoO ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Card`: `loading` propertiesadd `TNode` Support @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Cascader`: Add `panel Top Content` and `panel Bottom Content`,useinautofixedresponsethepaneltopandbottomcontent @Haixing OoO ([#3096](https://github.com/Tencent/tdesign-react/pull/3096))
- `Checkbox`: Fix `readonly` understyle issue @Haixing OoO ([#3077](https://github.com/Tencent/tdesign-react/pull/3077))
- `Tag`: Add Support `title` API,Supportcustomized `title` configure @Haixing OoO ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `Tree`: Add `allow Drop` API,useinlimitdragscenariousing @uyarn ([#3098](https://github.com/Tencent/tdesign-react/pull/3098))

### 🐞 Bug Fix es

- `Card`: Fix `loading` switchstatewillcausesubnodererender issue @huangchen1031 ([#3051](https://github.com/Tencent/tdesign-react/pull/3051))
- `Dialog`: Fix `Header` is `null`,configure `close Btn` stillthenrender `Header` issue @Haixing OoO ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Input`: Fix calculation `emoji` charactererror issue @novlan1 ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Popup`: Fix `1.8.0` after versionforfor `Popup` Optimizecause 16.x version under exception issue @moecasts ([#3091](https://github.com/Tencent/tdesign-react/pull/3091))
- `Statistic`: Fix `classname` and `style` notpass throughfunctioncan exception issue @liweijie0812 ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Time Picker`: Fix `format` only Support HH:mm:ss gridstyle issue @liweijie0812 ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))


## 🌈 1.8.1 `2024-08-23` 
### 🐞 Bug Fix es
- `Select`: Fix customized `content` when when opening and closing dropdown issue @uyarn ([#3058](https://github.com/Tencent/tdesign-react/pull/3058))
- `Rate`: Fix `1.8.0` versioninratingdescriptionnotshow issue @liweijie0812 ([#3060](https://github.com/Tencent/tdesign-react/pull/3060))
- `Popup`: Fix `panel` is null scenario underparteventcallbackmissingand error issue @uyarn ([#3061](https://github.com/Tencent/tdesign-react/pull/3061))

## 🌈 1.8.0 `2024-08-22` 
### 🚀 Features
- `Empty`: Add `Empty` emptystatecomponent @ZWkang @Haixing OoO @double-deng ([#2817](https://github.com/Tencent/tdesign-react/pull/2817))
- `Config Provider`: Support `colon Text` propertiesconfigure `Descriptions`, `Form` component `colon` properties @liweijie0812 ([#3055](https://github.com/Tencent/tdesign-react/pull/3055))

### 🐞 Bug Fix es
- `Color Picker`: Fix `slider` partinmouse enter and leavedefect @Jippp ([#3042](https://github.com/Tencent/tdesign-react/pull/3042))
- `use Virtual Scroll`: modify `visible Data` calculation style,resolvecanvisible areaoverhigh when,scroll afterbottomwhitespace issue @huangchen1031 ([#2999](https://github.com/Tencent/tdesign-react/pull/2999))
- `Table`: Fix drag sort when,ancestorfirstnodeinnerordererror issue @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Input Number`: Fix decimalpointprecisiondegreecalculation,by 0 beginningcalculationboundarylogicmissingcausecalculationerror issue @uyarn ([#3046](https://github.com/Tencent/tdesign-react/pull/3046))
- `Popup`: Fix somethesescenario under,hide whenfixedwillflicker issue @Haixing OoO ([#3052](https://github.com/Tencent/tdesign-react/pull/3052))

### 🚧 Others
- `Popup`: Fix official website`Popup` positiondisplay issue @Haixing OoO ([#3048](https://github.com/Tencent/tdesign-react/pull/3048))
- `Date Picker`: Fix presets examplecodeerror issue @uyarn ([#3050](https://github.com/Tencent/tdesign-react/pull/3050))

## 🌈 1.7.9 `2024-08-07` 
### 🐞 Bug Fix es
- `Tree`: Fix`1.7.8`versionupdatecauseexpandcollapsefunctioncandefect @Haixing OoO ([#3039](https://github.com/Tencent/tdesign-react/pull/3039))


## 🌈 1.7.8 `2024-08-01` 
### 🚀 Features
- `Config Provider`: Add `attach` API, Supportglobalconfigureattachorglobalconfigurepartcomponentattach @Haixing OoO ([#3001](https://github.com/Tencent/tdesign-react/pull/3001))
- `Date Picker`: Add `need Confirm` API,Supportdatewhenbetweenselecternotneedrequireclickconfirmbuttonsaveselect whenbetween @Haixing OoO ([#3011](https://github.com/Tencent/tdesign-react/pull/3011))
- `Date Range Picker` Support `borderless` mode @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Range Input`: Support `borderless` mode @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Time Range Picker`: Support `borderless` mode @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))
- `Descriptions`: layout typedefine Adjustisstringmultipletype @liweijie0812 ([#3021](https://github.com/Tencent/tdesign-react/pull/3021))
- `Rate`: ratingcomponent Supportinternationalchangeconfigure @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
### 🐞 Bug Fix es
- `Upload`: Fix particonsnot Supportglobalreplace issue @uyarn ([#3009](https://github.com/Tencent/tdesign-react/pull/3009))
- `Select`: Fix `Select` `label` and `prefix Icon` multiplestate undershow issue @Haixing OoO ([#3019](https://github.com/Tencent/tdesign-react/pull/3019))
- `Tree`: Fix partscenario underfirst subnodeset `checked` aftercauseentire treeinitializestate exception issue @uyarn ([#3023](https://github.com/Tencent/tdesign-react/pull/3023))
- `Dropdown Item`: Fix disablestateaffectcomponentthisselfresponserowisdefect @uyarn ([#3024](https://github.com/Tencent/tdesign-react/pull/3024))
- `Tag Input`: `on Drag Sort` inusing `use Ref` causecontext error @Heising ([#3003](https://github.com/Tencent/tdesign-react/pull/3003))
### 🚧 Others
- `Dialog`: Fix positionexample error issue @novlan1 ([#3005](https://github.com/Tencent/tdesign-react/pull/3005))
- `Range Input`: add`live Demo` @liweijie0812 ([#3015](https://github.com/Tencent/tdesign-react/pull/3015))

## 🌈 1.7.7 `2024-07-18` 
### 🚀 Features
- `Icon`: Add icons `list-numbered`,Optimize`lock-off`drawpath @DOUBLE-DENG ([icon#9f4acfd](https://github.com/Tencent/tdesign-icons/commit/9f4acfdda58f84f9bca71a22f033e27127dd26db))
- `Breadcrumb Item`: add `tooltip Props` extend, convenient to customizeinner position `tooltip` relatedproperties @carolin913 ([#2990](https://github.com/Tencent/tdesign-react/pull/2990))
- `Image Viewer`: Add `attach` API,Supportcustomizedmountnode @Haixing OoO ([#2995](https://github.com/Tencent/tdesign-react/pull/2995))
- `Drawer`: Add `on Size Drag End` API,useinneedrequiredragzoomcallbackscenario @NWYLZW ([#2975](https://github.com/Tencent/tdesign-react/pull/2975))

### 🐞 Bug Fix es
- `Icon`: Fix icons`chart-column`namingerror issue @uyarn ([#2979](https://github.com/Tencent/tdesign-react/pull/2979))
- `Input`: Fix disablestate understillcanbyswitchplain text and cipher text issue @uyarn ([#2991](https://github.com/Tencent/tdesign-react/pull/2991))
- `Table`: @uyarn
 - Fix onlysaveinonecolumncandragtableshrinkwhenstyle exception issue ([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
 - Fix partscenario undertobeforezoomwhen error issue([#2994](https://github.com/Tencent/tdesign-react/pull/2994))
 - Fix emptydata underdisplaycontentnohascenterindisplay issue ([#2996](https://github.com/Tencent/tdesign-react/pull/2996))
### 🚧 Others
- docs(Checkbox): Optimize`Checkbox`documentationcontent @Heising ([common#1835](https://github.com/Tencent/tdesign-common/pull/1835))


## 🌈 1.7.6 `2024-06-27` 
### 🚀 Features
- `Tabs`: Supportviascroll wheelorertouchpadenterrowscrolloperation,Add `scroll Position` API,Supportconfigureselectinsliderscrollmostfinally stay position @oljc ([#2954](https://github.com/Tencent/tdesign-react/pull/2954))
- `Image Viewer`: Add `is Svg` properties,Supportnative `SVG` previewshow,useinfor `SVG` enterrowoperationscenario @Haixing OoO ([#2958](https://github.com/Tencent/tdesign-react/pull/2958))
- `Input`: Add `spell Check` API @NWYLZW ([#2941](https://github.com/Tencent/tdesign-react/pull/2941))

### 🐞 Bug Fix es
- `Date Picker`: Fix singleindependentusing `Date Range Picker Panel` panelheaderclicklogicand `Date Range Picker` notonecause issue @uyarn ([#2944](https://github.com/Tencent/tdesign-react/pull/2944))
- `Form`: Fix nested `Form List` scenario underusing `should Update` causelooprender issue @moecasts ([#2948](https://github.com/Tencent/tdesign-react/pull/2948))
- `Tabs`: Fix `1.7.4` after version,`Tabs` class Name affect `Tab Item` issue @uyarn ([#2946](https://github.com/Tencent/tdesign-react/pull/2946))
- `Table`: 
 - Fix `use Pagination` in `pagination` dynamicstatechangechangefunctioncan issue @Haixing OoO ([#2960](https://github.com/Tencent/tdesign-react/pull/2960))
 - Fix right mousekeytablealsocanbytriggercolumnwidthdrag issue @Haixing OoO ([#2961](https://github.com/Tencent/tdesign-react/pull/2961))
 - Fix onlysaveinonecolumncanbe resize usingscenario under,dragfunctioncan exception issue @uyarn ([#2959](https://github.com/Tencent/tdesign-react/pull/2959))

### 🚧 Others
- sitepointallquantity Add Type Script examplecode @uyarn @Haixing OoO @ZWkang ([#2871](https://github.com/Tencent/tdesign-react/pull/2871))


## 🌈 1.7.5 `2024-05-31` 
### 🐞 Bug Fix es
- `Date Picker`: Fix click`jump`buttonlogicnohassync underpullselectchangedynamicdefect @uyarn ([#2934](https://github.com/Tencent/tdesign-react/pull/2934))

## 🌈 1.7.4 `2024-05-30` 
### 🚀 Features
- `Date Picker`: Optimizedateareabetweenselecterheader areabetweenchangechangelogic,select afterleftareabetween largerinrightareabetween,ruledefault Adjustisleftareabetweenalways thanrightareabetweensmall 1 @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
### 🐞 Bug Fix es
- `Cascader`: Fix `Cascader` search when `check Strictly` modeparentnodenotshow @Haixing OoO ([#2914](https://github.com/Tencent/tdesign-react/pull/2914))
- `Select`: Fix halfselectstateselect alloptiondisplaystyle issue @uyarn ([#2915](https://github.com/Tencent/tdesign-react/pull/2915))
- `Menu`: Fix `Head Menu` under `Menu Item` class namepass throughinvalid issue @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Tab Panel`: Fix class namepass throughinvalid issue @uyarn ([#2917](https://github.com/Tencent/tdesign-react/pull/2917))
- `Breadcrumb`: Fix dark colormode underseparatornotvisible issue @NWYLZW ([#2920](https://github.com/Tencent/tdesign-react/pull/2920))
- `Checkbox`:
 - Fix nomethodrenderisvalueis 0 option @NWYLZW ([#2925](https://github.com/Tencent/tdesign-react/pull/2925))
 - Fix affected bycontrolstatecannot be on Change callbackincorrectly consume issue @NWYLZW ([#2926](https://github.com/Tencent/tdesign-react/pull/2926))
- `Select Input`: Fix `interface.d.ts` filemissing `size` type issue @Haixing OoO ([#2930](https://github.com/Tencent/tdesign-react/pull/2930))
- `Date Picker`: Fix singleindependentusingpanelnohascompatibleno `on Month Change` callbackscenario issue @uyarn ([#2932](https://github.com/Tencent/tdesign-react/pull/2932))
- `Date Range Picker Panel`: Fix indropdowninselectyear/monthwhenselectappeardatechangechangeconfused issue @liyucang-git ([#2922](https://github.com/Tencent/tdesign-react/pull/2922))
- `Input Number`: Fix `allow Input Over Limit=false` sizevaluejudgment when,value is undefined when,willappearshow Infinity issue @Haixing OoO ([common#1802](https://github.com/Tencent/tdesign-common/pull/1802))

## 🌈 1.7.3 `2024-05-18` 
### 🐞 Bug Fix es
- `Menu`: Fix secondaryandby under `Submenu` nohashandle classname defect @uyarn ([#2911](https://github.com/Tencent/tdesign-react/pull/2911))
- `Upload`: Fix manualdynamicuploadbug @Haixing OoO ([#2912](https://github.com/Tencent/tdesign-react/pull/2912))
- `Avatar`: Fix with Popupusingpopupnotdisplay exception @uyarn

## 🌈 1.7.1 `2024-05-16`

### 🚀 Features
- `Avatar`: Add `Click`, `Hover` and `Contextmenu` etcmouseevent,Supportforavataroperationscenariousing @NWYLZW ([#2906](https://github.com/Tencent/tdesign-react/pull/2906))
- `Dialog`: Support `set Confirm Loading` using @ZWkang ([#2883](https://github.com/Tencent/tdesign-react/pull/2883))
- `Select Input`: Support `size` properties @Haixing OoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Time Picker`: Add Support `on Pick` event and `presets` API @ZWkang ([#2902](https://github.com/Tencent/tdesign-react/pull/2902))
- `Input`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Auto Complete`: Add `borderless` API,Supportnobordermode @uyarn ([#2884](https://github.com/Tencent/tdesign-react/pull/2884))
- `Color Picker`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Date Picker`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Tag Input`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Time Picker`: Add `borderless` API,Supportnobordermode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Scroll`: Adjust `1.6.0` afterforfor Chrome scrollbarstylecompatiblemethod,notdependency`autoprefixer`version @loopzhou ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
### 🐞 Bug Fix es
- `Color Picker`: Fix switchpreviewcolor when,channelbutton positionnotchange issue @fennghuang ([#2880](https://github.com/Tencent/tdesign-react/pull/2880))
- `Form`: Fix byin `Form Item`modify,nohastriggerlisten`Form List``use Watch` issue @Haixing OoO ([#2904](https://github.com/Tencent/tdesign-react/pull/2904))
- `Menu`: @uyarn 
 - Fix using`dist`stylebecauseisstylepriorityissuecausesubmenu positionoffset issue ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
 - improve `t-popup__menu` stylepriority,resolve dist innerstylepriorityonecausecausestyle exception issue ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Pagination`: Fix whenbeforepageinputdecimalafternohasautodynamic Adjust issue @uyarn ([#2886](https://github.com/Tencent/tdesign-react/pull/2886))
- `Select`: 
 - Fix `creatable` functioncan exception issue @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
 - Fix `reserve Keyword` with `Option Children` usemethod exception issue @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
 - Optimizealreadyselectstyleoverridealreadydisablestyle issue @fython ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Slider`: Fix `slider Ref.current` cancanisempty issue @ZWkang ([#2868](https://github.com/Tencent/tdesign-react/pull/2868))
- `Table`: 
 - Fix unmounttable when dataisemptycause error exception @duxphp ([#2900](https://github.com/Tencent/tdesign-react/pull/2900))
 - Fix `1.5.0` after versionpartscenario underusingfixedcolumncause exception issue @uyarn ([#2889](https://github.com/Tencent/tdesign-react/pull/2889))
- `Tag Input`:
 - Fix nohaspass through `tag Props` tocollapseoption issue @uyarn ([#2869](https://github.com/Tencent/tdesign-react/pull/2869))
 - extend `collapsed Items` deletefunctioncan @Haixing OoO ([#2881](https://github.com/Tencent/tdesign-react/pull/2881))
- `Tree Select`: Fix needrequirevia `tree Props` set `keys` propertiesonlytake effect issue @ZWkang ([#2896](https://github.com/Tencent/tdesign-react/pull/2896))
- `Upload`: 
 - Fix manualdynamicmodifyuploadenterdegree bug @Haixing OoO ([#2901](https://github.com/Tencent/tdesign-react/pull/2901))
 - Fix imageupload errortype understyle exception issue @uyarn ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
### 🚧 Others
- `Tag Input`: supplement `Size` propertiesrelateddocumentation @Haixing OoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Typography`: deletemultipleremainder `default Props` @Haixing OoO ([#2866](https://github.com/Tencent/tdesign-react/pull/2866))
- `Upload`: Fix documentationinclosein OPTIONS methoddescription @Summer-Shen ([#2865](https://github.com/Tencent/tdesign-react/pull/2865))
 
## 🌈 1.7.0 `2024-04-25` 
### 🚀 Features
- `Typography`: Add `Typography` layoutcomponent @insekkei ([#2821](https://github.com/Tencent/tdesign-react/pull/2821))
### 🐞 Bug Fix es
- `Table`: in `effect` asyncinexecuteget data whenandupdate data,cancanwillcausesome bug @Haixing OoO ([#2848](https://github.com/Tencent/tdesign-react/pull/2848))
- `Date Picker`: Fix dateselecterinmonthselectjump backinitialstate exception @uyarn ([#2854](https://github.com/Tencent/tdesign-react/pull/2854))
- `Form`: `use Watch` inonefixedcase under,name notsamewillcauseview issuedefect @Haixing OoO ([#2853](https://github.com/Tencent/tdesign-react/pull/2853))
- `Drawer`: Fix `1.6.0` close Btn propertiesdefaultvaluelost issue @uyarn ([#2856](https://github.com/Tencent/tdesign-react/pull/2856))
- `Dropdown`: Fix optionlengthisemptystilldisplaypopup issue @uyarn ([#2860](https://github.com/Tencent/tdesign-react/pull/2860))
- `Dropdown`: Optimize `Dropdown` `children` pass through `disabled` @Haixing OoO ([#2862](https://github.com/Tencent/tdesign-react/pull/2862))
- `Select Input`: Fix nonaffected bycontrolproperties `default Popup Visible` nottake effect issue @uyarn ([#2861](https://github.com/Tencent/tdesign-react/pull/2861))
- `Style`: Fix partnodebeforesuffixnomethodunifiedonereplacedefect @ZWkang @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))
- `Upload`: Fix `method` enumvalue `options` error issue @summer-shen @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))

## 🌈 1.6.0 `2024-04-11` 
### 🚀 Features
- `Portal`: `Portal` Addlazyload `force Render`,defaultis `lazy` mode,Optimizeperformance,compatible `SSR` render,for `Dialog` and `Drawer` componentcancansaveinbreakvisibilityaffect ⚠️ @Haixing OoO ([#2826](https://github.com/Tencent/tdesign-react/pull/2826))
### 🐞 Bug Fix es
- `Image Viewer`: Fix `image Referrerpolicy` nohasfortopthumbnailtake effect issue @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))
- `Descriptions`: Fix `props` missing `class Name` and `style` properties issue @Haixing OoO ([#2818](https://github.com/Tencent/tdesign-react/pull/2818))
- `Layout`: Fix `Layout` add `Aside` pagelayoutwilljumpdynamic issue @Haixing OoO ([#2824](https://github.com/Tencent/tdesign-react/pull/2824))
- `Input`: Fix in `React16` version underprevent bubblingfailure issue @Haixing OoO ([#2833](https://github.com/Tencent/tdesign-react/pull/2833))
- `Date Picker`: Fix `1.5.3` version afterhandle Datetypeandweekselecterexception @uyarn ([#2841](https://github.com/Tencent/tdesign-react/pull/2841))
- `Guide`: 
 - Optimize `SSR` underusing issue @Haixing OoO ([#2842](https://github.com/Tencent/tdesign-react/pull/2842))
 - Fix `SSR` scenario undercomponentinitializerender position exception issue @uyarn ([#2832](https://github.com/Tencent/tdesign-react/pull/2832))
- `Scroll`: Fix byin `Chrome 121` version Support scroll width aftercause `Table`, `Select` andpartappearscrollbarcomponentstyle exception issue @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765)) @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Locale`: Optimize `Date Picker` partmodelanguagepackage @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Tree`: Fix initialize after `draggable` propertieslostresponsestyle issue @Liao-js ([#2838](https://github.com/Tencent/tdesign-react/pull/2838))
- `Style`: Supportvia `less` main entrance openpackagestyleneedrequire @NWYLZW @uyarn ([common#1757](https://github.com/Tencent/tdesign-common/pull/1757)) ([common#1766](https://github.com/Tencent/tdesign-common/pull/1766))


## 🌈 1.5.5 `2024-03-28` 
### 🐞 Bug Fix es
- `Image Viewer`: Fix `image Referrerpolicy` nohasfortopthumbnailtake effect issue @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))

## 🌈 1.5.4 `2024-03-28` 
### 🚀 Features
- `Image Viewer`: Add `image Referrerpolicy` API,Supportwith Image componentneedrequireconfigure Referrerpolicy scenario @uyarn ([#2813](https://github.com/Tencent/tdesign-react/pull/2813))
### 🐞 Bug Fix es
- `Select`: Fix `on Remove` eventnohasnormaltrigger issue @Ali-ovo ([#2802](https://github.com/Tencent/tdesign-react/pull/2802))
- `Skeleton`: Fix`children`ismusttype issue @uyarn ([#2805](https://github.com/Tencent/tdesign-react/pull/2805))
- `Tabs`: provide `action` areadefaultstyle @Haixing OoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Locale`: Fix`image`and`image Viewer` English languagepackage exception issue @uyarn @Haixing OoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Image`: `referrerpolicy` parameterbe errorpasstoouter `div` on,actual delivery targetisnative `image` tag @NWYLZW ([#2811](https://github.com/Tencent/tdesign-react/pull/2811))

## 🌈 1.5.3 `2024-03-14` 
### 🚀 Features
- `Breadcrumb Item`: Support `on Click` event @Haixing OoO ([#2795](https://github.com/Tencent/tdesign-react/pull/2795))
- `Tag`: component Add `color` API,Supportcustomizedcolor @maoyiluo @uyarn ([#2799](https://github.com/Tencent/tdesign-react/pull/2799))
### 🐞 Bug Fix es
- `Form List`: Fix multiple componentstuck issue @Haixing OoO ([#2788](https://github.com/Tencent/tdesign-react/pull/2788))
- `Date Picker`: Fix `format` and `value Type` notonecausescenario undercalculationerror issue @uyarn ([#2798](https://github.com/Tencent/tdesign-react/pull/2798))
### 🚧 Others
- `Portal`: add Portaltestuseexample @Haixing OoO ([#2791](https://github.com/Tencent/tdesign-react/pull/2791))
- `List`: improve List testuseexample @Haixing OoO ([#2792](https://github.com/Tencent/tdesign-react/pull/2792))
- `Alert`: improve Alert test,Optimizecode @Haixing OoO ([#2793](https://github.com/Tencent/tdesign-react/pull/2793))

## 🌈 1.5.2 `2024-02-29` 
### 🚀 Features
- `Cascader`: Add `value Display`and`label` APISupport @Haixing OoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Descriptions`: component Supportnested @Haixing OoO ([#2777](https://github.com/Tencent/tdesign-react/pull/2777))
- `Tabs`: Adjustactivate `Tab` understrokelineand `Tab Header` borderlevelrelationship @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
### 🐞 Bug Fix es
- `Grid`: dimensioncalculationerror,widthcompatible exception @NWYLZW ([#2738](https://github.com/Tencent/tdesign-react/pull/2738))
- `Cascader`: Fix`clearable`clickclearbuttontriggerthreetime`on Change` issue @Haixing OoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Dialog`: Fix`use Dialog Position`rendermultipletimebindingevent @Haixing OoO ([#2749](https://github.com/Tencent/tdesign-react/pull/2749))
- `Guide`: Fix customizedcontentfunctioncaninvalid @zhangpaopao0609 ([#2752](https://github.com/Tencent/tdesign-react/pull/2752))
- `Tree`: Fix set `keys.children` afterexpandiconsnohasnormalchangechange issue @uyarn ([#2746](https://github.com/Tencent/tdesign-react/pull/2746))
- `Tree`: Fix `Tree` customizedlabel `set Data` nohasrender issue @Haixing OoO ([#2776](https://github.com/Tencent/tdesign-react/pull/2776))
- `Tree`: Fix set `Tree` width,`Tree Item` `checkbox` willbecompress,`label` ellipsisinvalid issue @Haixing OoO @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
- `Select`: @uyarn 
 - Fix viascrollloadoptionselectin afterscrollrowis exception issue ([#2779](https://github.com/Tencent/tdesign-react/pull/2779))
 - Fix using `size` API when,virtual scrollfunctioncan exception issue ([#2756](https://github.com/Tencent/tdesign-react/pull/2756))

## 🌈 1.5.1 `2024-01-25` 
### 🚀 Features
- `Popup`: Support `Plugin` styleusing. @Haixing OoO ([#2717](https://github.com/Tencent/tdesign-react/pull/2717))
- `Transfer`: Support `direction` API @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Tabs`: Add `action` API,Supportcustomizedrightarea @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
### 🐞 Bug Fix es
- `Pagination`: `Jump to` Adjustis largerwrite,maintainonecausevisibility @wangyewei ([#2716](https://github.com/Tencent/tdesign-react/pull/2716))
- `Table`: Fix`Modal`in`Form`form,using`should Update`unmounthas whennomethodfindtoformmethod. @duxphp ([#2675](https://github.com/Tencent/tdesign-react/pull/2675))
- `Table`: columnwidth Adjustandrowexpandscenario,Fix rowexpand when,willresetcolumnwidth Adjustresultissue @chaishi ([#2722](https://github.com/Tencent/tdesign-react/pull/2722))
- `Select`: Fix`Select`multiplestate underselectincontentscroll issue. @Haixing OoO ([#2721](https://github.com/Tencent/tdesign-react/pull/2721))
- `Transfer`: Fix `disabled` APIfunctioncan exception issue @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Swiper`: Fix toleftswitchcarouseldynamicdrawwhenorder confusion issue @Haixing OoO ([#2725](https://github.com/Tencent/tdesign-react/pull/2725))
- `Form`: Fix calculation `^` characterexception issue @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Loading`: Fix notset `z-index` defaultvalue issue @betavs ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Check Tag`: Fix set `class Name` willoverrideallalreadyhasclass namedefect @uyarn ([#2730](https://github.com/Tencent/tdesign-react/pull/2730))
- `Tree Select`: Fix `on Enter` eventnot trigger issue @uyarn ([#2731](https://github.com/Tencent/tdesign-react/pull/2731))
- `Menu`: Fix `collapsed` `scroll` style @Except10n ([#2718](https://github.com/Tencent/tdesign-react/pull/2718))
- `Cascader`: Fix longlistscenario under,in `Safari` inusingstyle exception issue @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))

## 🌈 1.5.0 `2024-01-11` 
### 🚨 Breaking Changes
- `Dialog`: theversionmove `class Name` errormountenterrow Fix,presentin `class Name` onlywillbemountto `Dialog` onlayercontainerelement Context in.ifyouneedrequiredirectlymodify `Dialog` thisbodystyle,canbyswitchusingis `dialog Class Name` enterrowmodify.
### 🚀 Features
- `Descriptions`: Add `Descriptions` descriptioncomponent @Haixing OoO ([#2706](https://github.com/Tencent/tdesign-react/pull/2706))
- `Dialog`: add `dialog Class Name` useinhandleinternal dialog nodestyle.suggestbeforevia `class Name` directlymodifydialogthisbodystyleuseuserswitchusingis `dialog Class Name` @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
### 🐞 Bug Fix es
- `Cascader`: Fix Cascader `trigger=hover` filter after,selectoperationsavein exception bug @Haixing OoO ([#2702](https://github.com/Tencent/tdesign-react/pull/2702))
- `Upload`: Fix Upload `upload File Percent` typenotdefine @betavs ([#2703](https://github.com/Tencent/tdesign-react/pull/2703))
- `Dialog`: Fix Dialog `class Name` enterrowmultipletimenodemount error,`class Name` moveonlybemountto ctx elementon @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
- `Tree Select`: Fix `suffix Icon` errorandaddrelatedexample @Ali-ovo ([#2692](https://github.com/Tencent/tdesign-react/pull/2692))

## 🌈 1.4.3 `2024-01-02` 
### 🐞 Bug Fix es
- `Auto Complete`: Fix`Active Index=-1`nomatch when,enterwill error issue @Ali-ovo ([#2300](https://github.com/Tencent/tdesign-react/pull/2300))
- `Cascader`: Fix`1.4.2` Cascadersinglefilter undernot triggerselectindefect @Haixing OoO ([#2700](https://github.com/Tencent/tdesign-react/pull/2700))


## 🌈 1.4.2 `2023-12-28` 
### 🚀 Features
- `Card`: add `Loading Props` properties @Haixing OoO ([#2677](https://github.com/Tencent/tdesign-react/pull/2677))
- `Date Picker`: `Date Range Picker` Add `cancel Range Select Limit`,Supportnotlimit Range Picker selectbeforeafterrange @uyarn ([#2684](https://github.com/Tencent/tdesign-react/pull/2684))
- `Space`: elementisempty when,notagainrenderone subelement @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
 - Add Supportusing `upload Pasted Files` pasteuploadfile
 - inputboxtypeuploadcomponent,Addclass name `t-upload--theme-file-input`
 - Add Support `upload Pasted Files`,indicateallowpasteuploadfile
 - Add `cancel Upload Button` and `upload Button`,Supportcustomizeduploadbuttonandcanceluploadbutton
 - Add `image Viewer Props`,pass throughimagepreviewcomponentallproperties 
 - Add `show Image File Name`,to controlisnoshowimagename
 - Supportpass indefaultvalueisnonarrayformstyle
 - Support `file List Display=null` when,hidefilelist；and Addmorefinish addingentire `file List Display` parameter,useincustomized UI
### 🐞 Bug Fix es
- `Table`: asyncgetmostnewtreeformstructure data when,priorityusing `window.request Animation Frame` function,byanti-flicker @lazybonee ([#2668](https://github.com/Tencent/tdesign-react/pull/2668))
- `Table`: Fix filterselectvalueis `0/false` when,filterselecticonsnotcanhighlight issue @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Cascader`: Fix componentin filter afterenterrowselectoperationandclearcontentsavein exception bug @Haixing OoO ([#2674](https://github.com/Tencent/tdesign-react/pull/2674))
- `Color Picker`: globalset `border-box` aftercausecolorliststyle issue @carolin913
- `Pagination`: movetotalnumbersingle `item` changeis `bar`, maintaincontentonecausevisibility @dinghuihua ([#2679](https://github.com/Tencent/tdesign-react/pull/2679))
- `Input Number`: Fix `min=0` or `max=0` limitinvalid issue @chaishi ([#2352](https://github.com/Tencent/tdesign-react/pull/2352))
- `Watermark`: Fix rowinner style causenomethod sticky fixedissue @carolin913 ([#2685](https://github.com/Tencent/tdesign-react/pull/2685))
- `Calendar`: Fix cardmode undernotnormaldisplayweekmessagedefect @uyarn ([#2686](https://github.com/Tencent/tdesign-react/pull/2686))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
 - Fix manualdynamicupload when,nomethodupdateuploadenterdegreeissue
 - Fix `upload File Percent` parametertype issue
 
 ## 🌈 1.4.1 `2023-12-14` 
### 🚀 Features
- `Radio`: Supportviaemptygridkey（Space）selectinoption @liweijie0812 ([#2638](https://github.com/Tencent/tdesign-react/pull/2638))
- `Dropdown`: Removefor left item stylespecialhandle @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
### 🐞 Bug Fix es
- `Auto Complete`: Fix partspecial character matchingerror issue @ZWkang ([#2631](https://github.com/Tencent/tdesign-react/pull/2631))
- `Date Picker`: Fix dateclickclearcontent whendialogwillflickerdefect @Haixing OoO ([#2641](https://github.com/Tencent/tdesign-react/pull/2641))
- `Date Picker`: Fix dateselectdisable after,aftersuffixiconscolorchangechange issue @Haixing OoO @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
- `Date Picker`: Fix disablestate underclickcomponentedge stillcanshow `Panel` @Zz-ZzzZ ([#2653](https://github.com/Tencent/tdesign-react/pull/2653))
- `Dropdown`: Fix underpullmenudisablestatecanclick issue @betavs ([#2648](https://github.com/Tencent/tdesign-react/pull/2648))
- `Dropdown Item`: Fix omission `Divider` typedefect @uyarn ([#2649](https://github.com/Tencent/tdesign-react/pull/2649))
- `Popup`: Fix `disabled` propertiesnottake effectdefect @uyarn ([#2665](https://github.com/Tencent/tdesign-react/pull/2665))
- `Select`: Fix `Input Change` eventinblur whentrigger exception issue @uyarn ([#2664](https://github.com/Tencent/tdesign-react/pull/2664))
- `Select Input`: Fix popup contentwidthcalculationissue @Haixing OoO ([#2647](https://github.com/Tencent/tdesign-react/pull/2647))
- `Image Viewer`: imagepreviewadddefaultzoom thanexampleandby under ESC whenisnotriggerimagepreviewercloseevent @Haixing OoO ([#2652](https://github.com/Tencent/tdesign-react/pull/2652))
- `Table`: @chaishi
 - Fix `Enhanced Table` treenodenomethodnormalexpand issue ([#2661](https://github.com/Tencent/tdesign-react/pull/2661))
 - Fix virtual scrollscenario,treenodenomethodexpand issue ([#2659](https://github.com/Tencent/tdesign-react/pull/2659))

 ## 🌈 1.4.0 `2023-11-30`
### 🚀 Features

- `Space`: compatible Supportcomponent spacinginlow levelbrowserinpresent @chaishi ([#2602](https://github.com/Tencent/tdesign-react/pull/2602))
- `Statistic`: Addstatisticsnumbervaluecomponent @Haixing OoO ([#2596](https://github.com/Tencent/tdesign-react/pull/2596))

### 🐞 Bug Fix es

- `Color Picker`: Fix `format` is `hex` when,with `enable Alpha` Adjustopacitynottake effect issue @uyarn ([#2628](https://github.com/Tencent/tdesign-react/pull/2628))
- `Color Picker`: Fix modifycoloron sliderbuttoncolornotchange @Haixing OoO ([#2615](https://github.com/Tencent/tdesign-react/pull/2615))
- `Table`: Fix `lazy Load` lazyloadeffect @chaishi ([#2605](https://github.com/Tencent/tdesign-react/pull/2605))
- `Tree`: 
 - Fix treecomponentnode `open class` statecontrolcontrollogicerrorcausestyle exception @NWYLZW ([#2611](https://github.com/Tencent/tdesign-react/pull/2611))
 - specifiedscrolltospecificnode API in `key` and `index` responseisoptional @uyarn ([#2626](https://github.com/Tencent/tdesign-react/pull/2626))
- `Drawer`: Fix `mode` is `push` when,push awaycontentareais drawer nodeparentnode. @Haixing OoO ([#2614](https://github.com/Tencent/tdesign-react/pull/2614))
- `Radio`: Fix form `disabled` nottake effectin `Radio on issue @li-jia-nan ([#2397](https://github.com/Tencent/tdesign-react/pull/2397))
- `Pagination`: Fix when `total` is 0 andand `page Size` changechange when,`current` valueis 0 issue @betavs ([#2624](https://github.com/Tencent/tdesign-react/pull/2624))
- `Image`: Fix imagein SSR mode undernotwilltriggernativeevent @Haixing OoO ([#2616](https://github.com/Tencent/tdesign-react/pull/2616))

 ## 🌈 1.3.1 `2023-11-15` 
### 🚀 Features
- `Upload`: draguploadfilescenario,that ismakefiletype error,alsotrigger `drop` event @chaishi ([#2591](https://github.com/Tencent/tdesign-react/pull/2591))
### 🐞 Bug Fix es
- `Tree`: 
 - Fix notadd `activable` parameteralsocantrigger `on Click` event @Haixing OoO ([#2568](https://github.com/Tencent/tdesign-react/pull/2568))
 - Fix editabletableeditcomponentbetweenlinkdynamicnottake effect @Haixing OoO ([#2572](https://github.com/Tencent/tdesign-react/pull/2572))
- `Notification`: 
 - Fix continuously pop two `Notification`, onetimeactualonlyshowone @Haixing OoO ([#2595](https://github.com/Tencent/tdesign-react/pull/2595))
 - using `flush Sync` in `use Effect` inwill warning,presentinchangeuseloop `set Timeout fromhandle @Haixing OoO ([#2597](https://github.com/Tencent/tdesign-react/pull/2597))
- `Dialog`: 
 - Fix `Dialog` in introduce `Input` component,from `Input` inbetweeninputcursorwillnavigatetomostafter @Haixing OoO ([#2485](https://github.com/Tencent/tdesign-react/pull/2485))
 - Fix dialogheadertitleshowaffectcancelbutton position @Haixing OoO ([#2593](https://github.com/Tencent/tdesign-react/pull/2593))
- `Popup`: Fix `Popup Ref` typemissing issue @Ricinix ([#2577](https://github.com/Tencent/tdesign-react/pull/2577))
- `Tabs`: Fix duplicateclickactivateoptioncard,alsowilltrigger `on Change` event. @Haixing OoO ([#2588](https://github.com/Tencent/tdesign-react/pull/2588))
- `Radio`: according toforresponse variant select Radio.Button enterrowdisplay @NWYLZW ([#2589](https://github.com/Tencent/tdesign-react/pull/2589))
- `Input`: Fix setmost largerlengthafterbackspaceexceptionrowis @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Link`: Fix beforeaftericonsnohasvertically centeredin issue @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Select`: Fix `inputchange` eventcontextparameter exception issue @uyarn ([#2600](https://github.com/Tencent/tdesign-react/pull/2600))
- `Date Picker`: Fix `Pagination Mini`notupdatecauseswitchrowis exception issue @Ricinix ([#2587](https://github.com/Tencent/tdesign-react/pull/2587))
- `Form`: Fix set Fields trigger on Values Change causeinfinite loop @honkinglin ([#2570](https://github.com/Tencent/tdesign-react/pull/2570))

 ## 🌈 1.3.0 `2023-10-19` 
### 🚀 Features
- `Timeline Item`: addclickevent @Zzongke ([#2545](https://github.com/Tencent/tdesign-react/pull/2545))
- `Tag`: @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
 - Supportmultipletypestyletagconfigure
 - Supporttaggroup`Check Tag Group`using,see detailsexampledocumentation
### 🐞 Bug Fix es
- `locale`: addmissingit_IT, ru_RU, zh_TW languageenvironment @Zzongke ([#2542](https://github.com/Tencent/tdesign-react/pull/2542))
- `Cascader`: `change` eventin `source` exception issue @betavs ([#2544](https://github.com/Tencent/tdesign-react/pull/2544))
- `Tree`: Fix`allow Fold Node On Filter`istrue underfilter afternodedisplayresult @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Tag Input`: Fix inonlyhasone option when,deletefiltertextwillaccidentally deletealreadyoptiondefect @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Tree Select`: Adjustfilteroption afterinteractionrowis,andotherimplementboxframemaintainonecause @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Rate`: Fix mouse fast movedynamic,willappearmultiple text show issue @Jon-Millent ([#2551](https://github.com/Tencent/tdesign-react/pull/2551))

 ## 🌈 1.2.6 `2023-09-28` 
### 🚀 Features
- `Table`: Optimizerendertimenumber @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Card`: `title` using `div` getreplace `span` incustomizedscenario undermoreconform to specification @uyarn ([#2517](https://github.com/Tencent/tdesign-react/pull/2517))
- `Tree`: Supportvia key match singleone value specifiedscrolltospecific position,havebodyusing styleplease refer toexamplecode @uyarn ([#2519](https://github.com/Tencent/tdesign-react/pull/2519))
### 🐞 Bug Fix es
- `Form`: Fix form List nested dataget exception @honkinglin ([#2529](https://github.com/Tencent/tdesign-react/pull/2529))
- `Table`: Fix dataswitch when `rowspan And Colspan` render issue @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Cascader`: hover nohassubnode dataparentnode whennotupdatesubnode @betavs ([#2528](https://github.com/Tencent/tdesign-react/pull/2528))
- `Date Picker`: Fix switchmonthinvalid issue @honkinglin ([#2531](https://github.com/Tencent/tdesign-react/pull/2531))
- `Dropdown`: Fix`Dropdown` disabled APIinvalid issue @uyarn ([#2532](https://github.com/Tencent/tdesign-react/pull/2532))

 ## 🌈 1.2.5 `2023-09-14` 
### 🚀 Features
- `Steps`: globalconfigureaddstepbaralreadycompleteiconscustomized @Zzongke ([#2491](https://github.com/Tencent/tdesign-react/pull/2491))
- `Table`: canfilterselecttable,`on Filter Change` event Addparameter `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'`,indicatetriggerfilterselectbaritemchangechangefromsource @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
- `Form`: trigger Add `submit`option @honkinglin ([#2507](https://github.com/Tencent/tdesign-react/pull/2507))
- `Image Viewer`: `on Index Change` event Add `trigger` enumvalue `current` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Image`: @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
 - Add `fallback`,indicateimagefallback image,originalimageloadfailure whenwillshowfallback image
 - Add Support `src` typeis `File`,Supportvia `File` previewimage
- `Upload`: copy textlist Supportshowthumbnail @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`:
 - Supportvirtual scrollscenario undervia`key`scrolltospecificnode @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
 - under virtual scroll lowin`threshold` stillcanrunscroll Tooperation @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
### 🐞 Bug Fix es
- `Config Provider`: Fix switchmultiplelanguageinvalid issue @uyarn ([#2501](https://github.com/Tencent/tdesign-react/pull/2501))
- `Table`:
 - canfilterselecttable,Fix `reset Value` inclearfilterselect when,notcanresettospecified `reset Value` value issue @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
 - treeformstructuretable,Fix expanded Tree Nodes.sync and expanded-tree-nodes-change using expand Tree Node On Click wheninvalid issue @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
 - cellineditmode under,save whentimeforinlinkstylecol Keyhandle error,notcanoverrideoriginalfromvalue @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
 - editabletable,Fix multiple editabletablesimultaneously exist when,validateaffect each other issue @chaishi ([#2498](https://github.com/Tencent/tdesign-react/pull/2498))
- `Tag Input`: Fix collapsedisplayoptiondimensionsize issue @uyarn ([#2503](https://github.com/Tencent/tdesign-react/pull/2503))
- `Tabs`: Fix using list pass props and destroy On Hide is false under, willlost panel content issue @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `Menu`: Fix menu `expand Type` defaultmode undermenuitempasson Clicknot trigger issue @Zzongke ([#2502](https://github.com/Tencent/tdesign-react/pull/2502))
- `Image Viewer`: Fix nomethodvia `visible` directlyopeningpreviewpopbox issue @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: Fix1.2.0after versionpart`Tree Node Model`operationinvalidexception @uyarn

 ## 🌈 1.2.4 `2023-08-31` 
### 🚀 Features
- `Table`: treeformstructure,nohasset `expanded Tree Nodes` case under,data dataoccurchangechange when,autodynamicresetcollapseplacehasexpandnode（ifwant to maintainexpandnode,pleaseusingproperties `expanded Tree Nodes` controlcontrol @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
### 🐞 Bug Fix es
- `Watermark`: modifywatermarknode,notaffectwatermarkdisplay @tingtingcheng6 ([#2459](https://github.com/Tencent/tdesign-react/pull/2459))
- `Table`: @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
 - dragsort + this datapaginationscenario,Fix drag sorteventparameter `current Index/target Index/current/target` etcincorrect issue
 - dragsort + this datapaginationscenario,Fix insecond pageby afterpagination dataindrag Adjustorderafter,willautodynamicnavigateto onepageissue
 - Supportpaginationnonaffected bycontrolusemethoddragsortscenario 
- `Slider`: Fix initialvalueis0 when,label position errordefect @Zzongke ([#2477](https://github.com/Tencent/tdesign-react/pull/2477))
- `Tree`: Support `store.children`callget Childrenmethod @uyarn ([#2480](https://github.com/Tencent/tdesign-react/pull/2480)) 

## 🌈 1.2.3 `2023-08-24` 
### 🐞 Bug Fix es
- `Table`: Fix use Previous error @honkinglin ([#2464](https://github.com/Tencent/tdesign-react/pull/2464))
- `Image Viewer`: Fix after introducingfilepath error @honkinglin ([#2465](https://github.com/Tencent/tdesign-react/pull/2465)) 

## 🌈 1.2.2 `2023-08-24` 
### 🚀 Features
- `Table`: @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
 - treeformstructure,Addcomponentinstancemethod `remove Children`,usein Removesubnode 
 - treeformstructure,Supportviaproperties `expanded Tree Nodes.sync` autobycontrolcontrolexpandnode,nonrequiredproperties
- `Tree`: Add `scroll To`method Supportinvirtual scrollscenario underscrolltospecifiednodeneedrequire @uyarn ([#2460](https://github.com/Tencent/tdesign-react/pull/2460))
### 🐞 Bug Fix es
- `Tag Input`: Fix inputintextwhenbestuck issue @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Table`:
 - clickrowexpand/clickrowselectin,Fix `expand On Row Click`and `select On Row Click` nomethodindependentcontrolcontrolrowclickexecuteinteractionissue @chaishi ([#2452](https://github.com/Tencent/tdesign-react/pull/2452))
 - treeformstructure,Fix componentinstancemethod expandall `expand All` issue @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `Form`: Fix Form Listcomponentusingform set Fields Value, reset exception @nickcdon ([#2406](https://github.com/Tencent/tdesign-react/pull/2406)) 

## 🌈 1.2.1 `2023-08-16` 
### 🚀 Features
- `Anchor`: Add `get Current Anchor` Supportcustomizedhighlightanchorpoint @ontheroad1992 ([#2436](https://github.com/Tencent/tdesign-react/pull/2436))
- `Menu Item`: `on Click` eventadd `value` returnvalue @dexter Bo ([#2441](https://github.com/Tencent/tdesign-react/pull/2441))
- `Form Item`: Add `value Format` function Supportgridstylechange data @honkinglin ([#2445](https://github.com/Tencent/tdesign-react/pull/2445))
### 🐞 Bug Fix es
- `Dialog`: Fix flickerissue @linjunc ([#2435](https://github.com/Tencent/tdesign-react/pull/2435))
- `Select`: @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
 - Fix multiplelost `title` issue
 - enabledfarprocesssearch whennotexecuteinternalfilter
- `Popconfirm`: invalid `class Name` and `style` Props @betavs ([#2420](https://github.com/Tencent/tdesign-react/pull/2420))
- `Date Picker`: Fix hover cell causenotmustrequirewhen opening and closing dropdown @j10ccc ([#2440](https://github.com/Tencent/tdesign-react/pull/2440)) 

 ## 🌈 1.2.0 `2023-08-10` 

### 🚨 Breaking Changes
- `Icon`: @uyarn ([#2429](https://github.com/Tencent/tdesign-react/pull/2429))
 - Add icons
 - Adjusticonsnaming `photo` is `camera`,`books` is `bookmark`, `stop-cirle-1` is `stop-circle-stroke`
 - Remove iconspage

### 🚀 Features
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
 - Add `lazy Load` useinlazyloadentire table
 - editablecell,Add `edit.keep Edit Mode`,useinmaintaincellalwaysiseditmode
 - canfilterselecttable,Supportpass through `attrs/style/class Names` properties, style, class nameetcmessagetocustomizedcomponent
 - canfilterselecttable,whenbefore `filter Value` notsetfiltervaluedefaultvalue when,notagainpass through undefined tofilterselectercomponent,somethesecomponentdefaultvaluemustisarray,notallowis undefined 
### 🐞 Bug Fix es
- `Cascader`: pass in value notin optionsin whenwilldirectlyerror @peng-yin ([#2414](https://github.com/Tencent/tdesign-react/pull/2414))
- `Menu`: Fix sameone `Menu Item` multipletimetrigger `on Change` issue @leezng ([#2424](https://github.com/Tencent/tdesign-react/pull/2424))
- `Drawer`: drawercomponentin `visible` defaultis `true` when,nomethodnormalshow @peng-yin ([#2415](https://github.com/Tencent/tdesign-react/pull/2415))
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
 - virtual scrollscenario,Fix headerwidthandtablecontentwidthnotonecauseissue
 - virtual scrollscenario,Fix defaultscrollbarlength（ position）andscroll afternotonecauseissue 

## 🌈 1.1.17 `2023-07-28`
### 🐞 Bug Fix es
- `Tabs`: Fix list passemptyarray when js error @zhenglianghan ([#2393](https://github.com/Tencent/tdesign-react/pull/2393))
- `List Item Meta`: Fix `description` passcustomizedelement @qijizh ([#2396](https://github.com/Tencent/tdesign-react/pull/2396))
- `Tree`: Fix enabledvirtual scroll whenpartscenario undernoderollback interactionexception issue @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))
- `Tree`: Fix `1.1.15` after versionbasein `level` propertiesoperationnomethodnormalwork issue @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))

## 🌈 1.1.16 `2023-07-26`
### 🚀 Features
- `Time Picker`: @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
 - `disable Time` callback Addmillisecondparameter
 - Optimizedisplaynotoptional whenbetweenoption whenscrolltonotoptionaloptionbodyverify 
- `Dropdown`: Add `panel Top Content` and `panel Bottom Content`,Supportneedrequireonunderextranodescenariousing @uyarn ([#2387](https://github.com/Tencent/tdesign-react/pull/2387))

### 🐞 Bug Fix es
- `Table`:
 - editabletablescenario,Supportset `col Key` valueislinkstyleproperties,like：`a.b.c` @chaishi ([#2381](https://github.com/Tencent/tdesign-react/pull/2381))
 - treeformstructuretable,Fix when `selected Row Keys` invaluein data datainnotsavein when error issue @chaishi ([#2385](https://github.com/Tencent/tdesign-react/pull/2385))
- `Guide`: Fix set `step1` is `-1` whenneedrequirehidecomponentfunctioncan @uyarn ([#2389](https://github.com/Tencent/tdesign-react/pull/2389))

## 🌈 1.1.15 `2023-07-19` 
### 🚀 Features
- `Date Picker`: Optimizeclosepopup afterresetdefaultselectinarea @honkinglin ([#2371](https://github.com/Tencent/tdesign-react/pull/2371))
### 🐞 Bug Fix es
- `Dialog`: Fix `theme=danger` invalid issue @chaishi ([#2365](https://github.com/Tencent/tdesign-react/pull/2365))
- `Popconfirm`: when `confirm Btn/cancel Btn` valuetypeis `Object` whennotpass through @imp2002 ([#2361](https://github.com/Tencent/tdesign-react/pull/2361)) 

## 🌈 1.1.14 `2023-07-12` 
### 🚀 Features
- `Tree`: Supportvirtual scroll @uyarn ([#2359](https://github.com/Tencent/tdesign-react/pull/2359))
- `Table`: treeformstructure,addrowlevelclass name, convenientbusinesssetnotsamelevelstyle @chaishi ([#2354](https://github.com/Tencent/tdesign-react/pull/2354))
- `Radio`: Optimizeoptiongroup changerowcase @ontheroad1992 ([#2358](https://github.com/Tencent/tdesign-react/pull/2358))
- `Upload`: @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
 - Addcomponentinstancemethod,`upload File Percent` useinupdatefileuploadenterdegree
 - `theme=image`,Supportusing `file List Display` customized UI content
 - `theme=image`,Supportclicknameopeningaccess in new windowimage
 - draguploadscenario,Support `accept` filetypelimit

### 🐞 Bug Fix es
- `Upload`: customizeduploadmethod,Fix notcancorrectreturnuploadsuccessorfailure afterfileissue @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

## 🌈 1.1.13 `2023-07-05` 
### 🐞 Bug Fix es
- `Tag`: Fix `children` isnumber `0` when when opening and closing dropdown exception @Hel Kyle ([#2335](https://github.com/Tencent/tdesign-react/pull/2335))
- `Input`: Fix `limit Number` partin `disabled` state understyle issue @uyarn ([#2338](https://github.com/Tencent/tdesign-react/pull/2338))
- `Tag Input`: Fix before positioniconsstyledefect @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))
- `Select Input`: Fix when losing focusnotclearinputcontentdefect @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))

## 🌈 1.1.12 `2023-06-29` 

### 🚀 Features
- `Site`: Support Englishsitepoint @uyarn ([#2316](https://github.com/Tencent/tdesign-react/pull/2316))

### 🐞 Bug Fix es
- `Slider`: Fix numberinputbox `theme` fixedis `column` issue @Ali-ovo ([#2289](https://github.com/Tencent/tdesign-react/pull/2289))
- `Table`: columnwidth Adjustandcustomizedcolumncommonsavescenario,Fix viacustomizedcolumnconfiguretablecolumnnumberquantitychangeless when,tabletotalwidthnomethodagainrestorechangesmall @chaishi ([#2325](https://github.com/Tencent/tdesign-react/pull/2325))

## 🌈 1.1.11 `2023-06-20` 
### 🐞 Bug Fix es
- `Table`: @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
 - candrag Adjustcolumnwidthscenario,Fix `resizable=false` invalid issue,defaultvalueis false
 - this datasortscenario,Fix asyncpullget data when,cancelsort datawillcauseemptylist issue
 - Fix fixedtable + fixedcolumn + virtual scrollscenario,headernotforalignissue
 - editablecell/editablerowscenario,Fix dataalwaysvalidateonone value issue,Adjustisvalidatemostnewinputvalue
 - Fix this datasort,multiplefieldsortscenario,examplecodemissing issue
- `Color Picker`: @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
 - initializeisgradualchangemode when,Supportemptystringasinitialvalue
 - Fix `recent Colors` etcfieldtype issue
 - Fix internal underpulloptionnotpass through `popup Props` defect


## 🌈 1.1.10 `2023-06-13` 
### 🚀 Features
- `Menu`:
 - `Submenu` Add `popup Props` properties,allowpass throughsetbottom layer Popup dialogproperties @xiaosansiji ([#2284](https://github.com/Tencent/tdesign-react/pull/2284))
 - pop upmenuusing Popup refactor @xiaosansiji ([#2274](https://github.com/Tencent/tdesign-react/pull/2274))

### 🐞 Bug Fix es
- `Input Number`: initialvalueis `undefined` / `null`,andsavein `decimal Places` when,notagainenterrowdecimalpointcorrect @chaishi ([#2273](https://github.com/Tencent/tdesign-react/pull/2273))
- `Select`: Fix `on Blur` methodcallbackparameter exception issue @Ali-ovo ([#2281](https://github.com/Tencent/tdesign-react/pull/2281))
- `Dialog`: Fix in SSR environment under error @night-c ([#2280](https://github.com/Tencent/tdesign-react/pull/2280))
- `Table`: Fix componentset `expand On Row Click` is `true` when,clickentirerow error @pe-3 ([#2275](https://github.com/Tencent/tdesign-react/pull/2275))

## 🌈 1.1.9 `2023-06-06` 
### 🚀 Features
- `Date Picker`: Support `on Confirm` event @honkinglin ([#2260](https://github.com/Tencent/tdesign-react/pull/2260))
- `Menu`: Optimizesidebarnavigationmenucollapse when,`Tooltip` displaymenucontent @xiaosansiji ([#2263](https://github.com/Tencent/tdesign-react/pull/2263))
- `Swiper`: navigation type Support `dots` `dots-bar` @carolin913 ([#2246](https://github.com/Tencent/tdesign-react/pull/2246))
- `Table`: Add `on Column Resize Change` event @honkinglin ([#2262](https://github.com/Tencent/tdesign-react/pull/2262))

### 🐞 Bug Fix es
- `Tree Select`: Fix `keys` propertiesnohaspass throughgive `Tree` issue @uyarn ([#2267](https://github.com/Tencent/tdesign-react/pull/2267))
- `Input Number`: Fix partdecimalpointnumbernomethodinput issue @chaishi ([#2264](https://github.com/Tencent/tdesign-react/pull/2264))
- `Image Viewer`: Fix touchcontrolboard zoomoperationexception issue @honkinglin ([#2265](https://github.com/Tencent/tdesign-react/pull/2265))
- `Tree Select`: Fix when `label` is `react Node` scenario underdisplay issue @Ali-ovo ([#2258](https://github.com/Tencent/tdesign-react/pull/2258))

## 🌈 1.1.8 `2023-05-25` 
### 🚀 Features
- `Time Picker`: nohasselectinvalue whennotallowclickconfirmbutton @uyarn ([#2240](https://github.com/Tencent/tdesign-react/pull/2240))

### 🐞 Bug Fix es
- `Form`: Fix `Form List` datapass through issue @honkinglin ([#2239](https://github.com/Tencent/tdesign-react/pull/2239))

## 🌈 1.1.7 `2023-05-19` 
### 🐞 Bug Fix es
- `Tooltip`: Fix arrow offsetissue @uyarn ([#1347](https://github.com/Tencent/tdesign-common/pull/1347))

## 🌈 1.1.6 `2023-05-18` 
### 🚀 Features
- `Tree Select`: Support `panel Conent` API @Arthur Yung ([#2182](https://github.com/Tencent/tdesign-react/pull/2182))

### 🐞 Bug Fix es
- `Select`: Fix cancreate duplicate label optiondefect @uyarn ([#2221](https://github.com/Tencent/tdesign-react/pull/2221))
- `Skeleton`: Fix using `row Col` whenextramultiplerenderonerow theme defect @uyarn ([#2223](https://github.com/Tencent/tdesign-react/pull/2223))
- `Form`:
 - Fix asyncrenderusing `use Watch` error issue @honkinglin ([#2220](https://github.com/Tencent/tdesign-react/pull/2220))
 - Fix `Form List` initialvalueassignvalueinvalid issue @honkinglin ([#2222](https://github.com/Tencent/tdesign-react/pull/2222))

## 🌈 1.1.5 `2023-05-10` 
### 🚀 Features
- `Cascader`: Support `suffix`, `suffix Icon` @honkinglin ([#2200](https://github.com/Tencent/tdesign-react/pull/2200))

### 🐞 Bug Fix es
- `Select Input`: Fix `loading` in `disabled` state underhide issue @honkinglin ([#2196](https://github.com/Tencent/tdesign-react/pull/2196))
- `Image`: Fix componentnot Support `ref` issue @li-jia-nan ([#2198](https://github.com/Tencent/tdesign-react/pull/2198))
- `Back Top`: Support `ref` pass through @li-jia-nan ([#2202](https://github.com/Tencent/tdesign-react/pull/2202))

## 🌈 1.1.4 `2023-04-27` 
### 🚀 Features
- `Select`: Support `panel Top Content` invirtual scrolletcneedrequirescrolldropdownscenariousing,havebodyusing stylepleaseseeexample @uyarn ([#2184](https://github.com/Tencent/tdesign-react/pull/2184))

### 🐞 Bug Fix es
- `Date Picker`: Fix twotimeclickpanelclose exception issue @honkinglin ([#2183](https://github.com/Tencent/tdesign-react/pull/2183))
- `Table`: Fix `use Resize Observer` ssr error @chaishi ([#2175](https://github.com/Tencent/tdesign-react/pull/2175))

## 🌈 1.1.3 `2023-04-21` 
### 🚀 Features
- `Date Picker`: Support `on Preset Click` event @honkinglin ([#2165](https://github.com/Tencent/tdesign-react/pull/2165))
- `Switch`: `on Change` Supportreturn `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
- `Collapse`: `on Change` Supportreturn `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
### 🐞 Bug Fix es
- `Form`: 
 - Fix maindynamic reset not trigger `on Reset` logic @honkinglin ([#2150](https://github.com/Tencent/tdesign-react/pull/2150))
 - Fix `on Values Change` eventreturnparameter issue @honkinglin ([#2169](https://github.com/Tencent/tdesign-react/pull/2169))
- `Select`: Fix multiplemode `size` propertiesnottake effect issue @uyarn ([#2163](https://github.com/Tencent/tdesign-react/pull/2163))
- `Collapse`:
 - Fix `Radio` disablejudgment @duanbaosheng ([#2161](https://github.com/Tencent/tdesign-react/pull/2161))
 - Fix `value` hasdefaultvalue whenaffected bycontrolissue @moecasts ([#2152](https://github.com/Tencent/tdesign-react/pull/2152))
- `Icon`: Fix manifest unifiedoneentry export esm module,documentationisandwhenupdate issue @Layouwen ([#2160](https://github.com/Tencent/tdesign-react/pull/2160))

## 🌈 1.1.2 `2023-04-13` 
### 🚀 Features
- `Date Picker`: Optimizeweekselecterhighlightjudgmentlogicperformance issue @honkinglin ([#2136](https://github.com/Tencent/tdesign-react/pull/2136))
### 🐞 Bug Fix es
- `Dialog`: 
 - Fix set style width nottake effect issue @honkinglin ([#2132](https://github.com/Tencent/tdesign-react/pull/2132))
 - Fix footer render null issue @honkinglin ([#2131](https://github.com/Tencent/tdesign-react/pull/2131))
- `Select`: Fix multiplegroupdisplaystyle exception issue @uyarn ([#2138](https://github.com/Tencent/tdesign-react/pull/2138))
- `Popup`: 
 - Fix windows under scroll Top appeardecimalcausejudgmentscrollbottominvalid @honkinglin ([#2142](https://github.com/Tencent/tdesign-react/pull/2142))
 - Fix criticalpointinitialtimefixedissue @honkinglin ([#2134](https://github.com/Tencent/tdesign-react/pull/2134))
- `Color Picker`: Fix Frame innomethoddragsaturatedanddegreeand slider issue @insekkei ([#2140](https://github.com/Tencent/tdesign-react/pull/2140))

## 🌈 1.1.1 `2023-04-06` 
### 🚀 Features
- `Sticky Tool`: Add `sticky-tool`component @Zekun Wu ([#2065](https://github.com/Tencent/tdesign-react/pull/2065))

### 🐞 Bug Fix es
- `Tag Input`: Fix basein`Tag Input`componentusingfilterselectwhendeleteclosekeywordwhenwilldeletealreadyselectvalue issue @2513483494 ([#2113](https://github.com/Tencent/tdesign-react/pull/2113))
- `Input Number`: Fix inputdecimalby0endwhenfunctioncan exception issue @uyarn ([#2127](https://github.com/Tencent/tdesign-react/pull/2127))
- `Tree`: Fix component data propertiesnotaffected bycontrolissue @PBK-B ([#2119](https://github.com/Tencent/tdesign-react/pull/2119))
- `Form`: Fix initial dataset issue @honkinglin ([#2124](https://github.com/Tencent/tdesign-react/pull/2124))
- `Tree Select`: Fix filter afternomethodexpand issue @honkinglin ([#2128](https://github.com/Tencent/tdesign-react/pull/2128))
- `Popup`: Fix rightkeydisplaypopuptriggerbrowserdefaultevent @honkinglin ([#2120](https://github.com/Tencent/tdesign-react/pull/2120))

## 🌈 1.1.0 `2023-03-30` 
### 🚀 Features
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
 - Supportusing `filter Icon` Supportnotsamecolumnshow nototsamefilterselecticons
 - Supporthorizontaltoscrolltofixedcolumn
- `Button`: Supportdisablestatenot trigger href navigatelogic @honkinglin ([#2095](https://github.com/Tencent/tdesign-react/pull/2095))
- `Back Top`: Add Back Top component @meiqi502 ([#2037](https://github.com/Tencent/tdesign-react/pull/2037))
- `Form`: submit Supportreturn data @honkinglin ([#2096](https://github.com/Tencent/tdesign-react/pull/2096))

### 🐞 Bug Fix es
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
 - Fix SSR environmentin,document is not undefined issue
 - Fix incolumnshowcontrolcontrolscenarioin,nomethoddragswapcolumnorderissue 
 - singlerowselectinfunctioncan,Fix `allow Uncheck: false` invalid issue
- `Dialog`: Fix Dialog on Open eventcall whenmachineissue @honkinglin ([#2090](https://github.com/Tencent/tdesign-react/pull/2090))
- `Date Picker`: Fix `format` is12smallwhencontrolwhenfunctioncan exception issue @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Alert`: Fix close buttonistext whencenterinandfontsize issue @Wen1kang @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Watermark`: Fix `Loading` combinationusing issue @duanbaosheng ([#2094](https://github.com/Tencent/tdesign-react/pull/2094))
- `Notification`: Fix getinstance issue @honkinglin ([#2103](https://github.com/Tencent/tdesign-react/pull/2103))
- `Radio`: Fix ts type issue @honkinglin ([#2102](https://github.com/Tencent/tdesign-react/pull/2102))


## 🌈 1.0.5 `2023-03-23` 
### 🚀 Features
- `Time Picker`: Add `size` API, to control whenbetweeninputboxsize @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))

### 🐞 Bug Fix es
- `Form`: Fix `Form List` initial dataget issue @honkinglin ([#2067](https://github.com/Tencent/tdesign-react/pull/2067))
- `Watermark`: Fix NextJS in document undefined issue @carolin913 ([#2073](https://github.com/Tencent/tdesign-react/pull/2073))
- `Color Picker`: @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
 - Fix HEX colorvaluenomethodmanualdynamicinput issue
 - Fix mostnearusingcolornomethoddelete issue
- `Dialog`: Fix`on Close Btn Click`eventinvalid issue @Arthur Yung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))
- `Bread Crumb`: Fix via options propertiesnomethodconfigure Icon issue @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))


## 🌈 1.0.4 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
 - columnwidth Adjustfunctioncan,updatecolumnwidth Adjustruleruleis：columnwidthsmallernohasexceed when,columnwidth Adjustperformanceis whenbeforecolumnandadjacentcolumnchangechange；columnwidthexceedsaveinhorizontaltoscrollbar when,columnwidth Adjustonlyaffect whenbeforecolumnandcolumntotalwidth
 - editablecell(row)functioncan,Supporteditmode under,datachangechange whenrealwhenvalidate,`col.edit.validate Trigger`
 - onlyhasfixedcolumnsavein when,onlywillappearclass name `.t-table__content--scrollable-to-left` and `.t-table__content--scrollable-to-right`
 - dragfunctioncan,Supportdisablefixedcolumnnotcandrag Adjustorder
- `Upload`: `theme=file-input` fileisempty when,hoverwhennotshowclearbutton @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `Input Number`: Supportthousand separator paste @uyarn ([#2058](https://github.com/Tencent/tdesign-react/pull/2058))
- `Date Picker`: Support `size` properties @honkinglin ([#2055](https://github.com/Tencent/tdesign-react/pull/2055))
### 🐞 Bug Fix es
- `Form`: Fix resetdefaultvalue datatype error @honkinglin ([#2046](https://github.com/Tencent/tdesign-react/pull/2046))
- `Timeline Item`: Fix exporttype @southorange0929 ([#2053](https://github.com/Tencent/tdesign-react/pull/2053))
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
 - Fix table width jitter issue 
 - columnwidth Adjustfunctioncan,Fix Dialog incolumnwidth Adjust issue
 - editable cell, fix dropdown selection component `abort Edit On Event` does not include `on Change` when,dependthenwillin datachangechange whentriggerexiteditstate issue
- `Table`: Fix lazy-load reset bug @Mr Weilian ([#2041](https://github.com/Tencent/tdesign-react/pull/2041))
- `Color Picker`: Fix inputboxnomethodinput issue @insekkei ([#2061](https://github.com/Tencent/tdesign-react/pull/2061))
- `Affix`: Fix fixed judgment issue @lio-mengxiang ([#2048](https://github.com/Tencent/tdesign-react/pull/2048))

## 🌈 1.0.3 `2023-03-09` 
### 🚀 Features
- `Message`: Do not auto-close on mouse hover @Hel Kyle ([#2036](https://github.com/Tencent/tdesign-react/pull/2036))
- `Date Picker`: Support `default Time` @honkinglin ([#2038](https://github.com/Tencent/tdesign-react/pull/2038))

### 🐞 Bug Fix es
- `Date Picker`: Fix monthis0whendisplay whenbeforemonthissue @honkinglin ([#2032](https://github.com/Tencent/tdesign-react/pull/2032))
- `Upload`: Fix `upload.method` invalid issue @i-tengfei ([#2034](https://github.com/Tencent/tdesign-react/pull/2034))
- `Select`: Fix multipleselect allinitialvalueisemptywhenselectin error issue @uyarn ([#2042](https://github.com/Tencent/tdesign-react/pull/2042))
- `Dialog`: Fix dialog vertically centered issue @KMethod ([#2043](https://github.com/Tencent/tdesign-react/pull/2043))

## 🌈 1.0.2 `2023-03-01` 
### 🚀 Features
- `Image`: imagecomponent Supportspecial formatstyle address `.avif` and `.webp` @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `Config Provider`: Add `Image` globalconfigure `global Config.image.replace Image Src`, used to uniformly replace image addresses @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `List`: `list Item Meta` Support `class Name`, `style` properties @honkinglin ([#2005](https://github.com/Tencent/tdesign-react/pull/2005))

### 🐞 Bug Fix es
- `Form`: @honkinglin ([#2014](https://github.com/Tencent/tdesign-react/pull/2014))
 - Fix validation message inheriting error cache issue
 - Remove `Form Item` extra event notification logic
- `Drawer`: Fix scrollbar appears on page after dragging issue @honkinglin ([#2012](https://github.com/Tencent/tdesign-react/pull/2012))
- `Input`: Fix async rendering width calculation issue @honkinglin ([#2010](https://github.com/Tencent/tdesign-react/pull/2010))
- `Textarea`: Adjust limit display position,Fix andtips commonsave whenstyle issue @duanbaosheng ([#2015](https://github.com/Tencent/tdesign-react/pull/2015))
- `Checkbox`: Fix ts type issue @NWYLZW ([#2023](https://github.com/Tencent/tdesign-react/pull/2023))


## 🌈 1.0.1 `2023-02-21` 
### 🚀 Features
- `Popup`: Add `on Scroll ToBottom` event @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Select`: @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
 - Supportvirtual scrollusing
 - Support `autofocus`, `suffix`,`suffix Icon`and other APIs,`on Search`Addcallbackparameter
 - Optionsubcomponent Supportcustomized`title`API
- `Icon`: load wheninjectstyle,Avoidin next environmentin error issue @uyarn ([#1990](https://github.com/Tencent/tdesign-react/pull/1990))
- `Avatar`: componentinternalimage,using Image componentrender,Supportpass through `image Props` to Image component @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Dialog Plugin`: Supportcustomized `visbile` @moecasts ([#1998](https://github.com/Tencent/tdesign-react/pull/1998))
- `Tabs`: Supportdragcanability @duanbaosheng ([#1979](https://github.com/Tencent/tdesign-react/pull/1979))

### 🐞 Bug Fix es
- `Select`: Fix `on Inputchange`trigger whenmachine issue @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Radio`: Fix `disabled` default value issue @honkinglin ([#1977](https://github.com/Tencent/tdesign-react/pull/1977))
- `Table`: Ensureeditablecellmaintaineditstate @moecasts ([#1988](https://github.com/Tencent/tdesign-react/pull/1988))
- `Tag Input`: Fix `0.45.4` after version `Tag Input` add `blur` row behavior causes `Select` / `Cascader` / `Tree Select` cannot filter multiple issue @uyarn ([#1989](https://github.com/Tencent/tdesign-react/pull/1989))
- `Avatar`: Fix image cannot display issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Image`: Fix event type issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Tree`: Fix child nodes cannot be searched after being collapsed issue @honkinglin ([#1999](https://github.com/Tencent/tdesign-react/pull/1999))
- `Popup`: Fix popup show/hide infinite loop issue @honkinglin ([#1991](https://github.com/Tencent/tdesign-react/pull/1991))
- `Form List`: Fix `on Values Change` cannot get latest data issue @honkinglin ([#1992](https://github.com/Tencent/tdesign-react/pull/1992))
- `Drawer`: Fix scrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))
- `Dialog`: Fix scrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))

## 🌈 1.0.0 `2023-02-13` 
### 🚀 Features
- `Dropdown`: submenu level structure adjust,add one layer `t-dropdown__submenu-wrapper` @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

### 🐞 Bug Fix es
- `Tree`: Fix using set Item set node expanded when,not trigger `on Expand` issue @genyuMPj ([#1956](https://github.com/Tencent/tdesign-react/pull/1956))
- `Dropdown`: Fix multiple layer extra long menu position exception issue @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

## 🌈 0.x `2021-03-26 - 2023-02-08`
Go to [Git Hub](https://github.com/Tencent/tdesign-react/blob/develop/packages/tdesign-react/CHANGELOG-0.x.md) view `0.x` changelog

