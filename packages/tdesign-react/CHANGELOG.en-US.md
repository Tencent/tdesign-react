---
title: Changelog
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.16.1 `2025-12-22` 
### 🐞 Bug Fixes
- `Textarea`: Fixed warning issues caused by using `defaultValue` or `readonly` @RylanBot ([#4019](https://github.com/Tencent/tdesign-react/pull/4019))
- `Text`: Fixed error issues caused by reading `undefined` @RylanBot ([#4020](https://github.com/Tencent/tdesign-react/pull/4020))
- `Guide`: Fixed error issues caused by reading `null` in certain scenarios @RylanBot ([#4027](https://github.com/Tencent/tdesign-react/pull/4027))
- `Popup`: 
  - Fixed error issues in SSR environment caused by refactoring in version `1.16.0` @RylanBot ([#4026](https://github.com/Tencent/tdesign-react/pull/4026))
  - Fixed issue where inner popups could not be closed properly in nested scenarios caused by refactoring in version `1.16.0` @RylanBot ([#4023](https://github.com/Tencent/tdesign-react/pull/4023))
### 🚧 Others
- Fixed warning caused by non-existent `sourceMap` references in build artifacts of version `1.16.0` @RylanBot ([#4022](https://github.com/Tencent/tdesign-react/pull/4022))
- `TagInput`: Removed redundant logs introduced in version `1.16.0` @RylanBot ([#4021](https://github.com/Tencent/tdesign-react/pull/4021))

## 🌈 1.16.0 `2025-12-15` 
### 🚨 Breaking Changes
- `MessagePlugin`: Removed message container `id='tdesign-message-container--${placement}'`. Businesses that previously relied on this property should note this change ⚠️ @RylanBot ([#3820](https://github.com/Tencent/tdesign-react/pull/3820))
### 🚀 Features
- Added API `readOnly` to components supporting `readonly`, with the same effect as `readonly`. The original `readonly` will be retained and will be deprecated in future versions. It is recommended to update in time ⚠️ @RylanBot ([#3955](https://github.com/Tencent/tdesign-react/pull/3955))
- Support `.dark` class name, enriching ways to switch to dark mode @liweijie0812 ([common#2355](https://github.com/Tencent/tdesign-common/pull/2355))
- `Dialog`: Optimized rendering phase to avoid child element calculation exceptions. Those who previously had complex content rendering in Dialog should note this change ⚠️ @HaixingOoO ([#3705](https://github.com/Tencent/tdesign-react/pull/3705))
- `Form`: Preserve original HTML effect. When Enter key is pressed on input box, submit event is automatically triggered. If you need to intercept this behavior, you can bind `onEnter={(e)=>e.preventDefault()}` to input box. Those who previously relied on this built-in feature should note this change ⚠️ @RylanBot ([#3943](https://github.com/Tencent/tdesign-react/pull/3943))
- `MessagePlugin`: Added animation effects for opening and closing @RylanBot ([#3820](https://github.com/Tencent/tdesign-react/pull/3820))
- `ImageViewer`: 
  - Added default trigger rendering, defaulting to current image as the default trigger, reducing component usage complexity. Refer to related example changes for details @wonkzhang ([#3819](https://github.com/Tencent/tdesign-react/pull/3819))
  - Optimized format processing and compression ratio when downloading cross-domain images @RylanBot ([#3919](https://github.com/Tencent/tdesign-react/pull/3919))
  - Support direct download of same-domain images, avoiding volume increase and animated image failure caused by secondary conversion @RylanBot ([#3919](https://github.com/Tencent/tdesign-react/pull/3919))
### 🐞 Bug Fixes
- `Textarea`: Corrected initial value corresponding to `status` and class name to `default`, with corresponding adjustments to internal class names. Those who previously covered tips class names should note this change ⚠️ @RylanBot ([#4007](https://github.com/Tencent/tdesign-react/pull/4007))
- `Avatar`: Fixed style inconsistency with design specifications @liweijie0812 ([common#2364](https://github.com/Tencent/tdesign-common/pull/2364))
- `ConfigProvider`: Fixed `tag.closeIcon` not working @RylanBot ([#4004](https://github.com/Tencent/tdesign-react/pull/4004))
- `Form`: Fixed issue where unused components were also packaged due to introduction of extra components when initializing form values @RylanBot ([#3965](https://github.com/Tencent/tdesign-react/pull/3965))
- `Menu`: Fixed default margin and icon size issues of menu options @liweijie0812 ([common#2369](https://github.com/Tencent/tdesign-common/pull/2369))
- `Select`: Optimized user experience of pressing Enter again during keyboard operations @uyarn ([#3989](https://github.com/Tencent/tdesign-react/pull/3989))
- `Tree`: Fixed issue where selected text highlight style was hidden when child nodes were custom Input and other elements @RylanBot ([common#2370](https://github.com/Tencent/tdesign-common/pull/2370))
- `MessagePlugin`: @RylanBot ([#3820](https://github.com/Tencent/tdesign-react/pull/3820))
  - Fixed issue where subsequent global messages were also bound to that node after custom `attach`
  - Fixed issue where `closeAll` could not close all messages
- `EnhancedTable`: Fixed issue where header checkbox state was abnormal when child nodes collapsed @liweijie0812 ([#3988](https://github.com/Tencent/tdesign-react/pull/3988))
- `Table`: 
  - Fixed issue where editable cell data was not synchronized after editing in multi-level header scenarios @RylanBot ([#3982](https://github.com/Tencent/tdesign-react/pull/3982))
  - Fixed missing `context.currentData` in filter scenarios for `onChange` @RylanBot ([#3982](https://github.com/Tencent/tdesign-react/pull/3982))
  - Fixed issues such as header misalignment and empty state not being centered due to unstable table width calculation timing @RylanBot ([#3972](https://github.com/Tencent/tdesign-react/pull/3972))
- `Popup`: 
  - Fixed arrow offset when space is insufficient @RylanBot ([#3980](https://github.com/Tencent/tdesign-react/pull/3980))
  - Set container position to `absolute` uniformly, fixing positioning exceptions in some scenarios @RylanBot ([#3916](https://github.com/Tencent/tdesign-react/pull/3916))
  - Fixed issue where `triggerElement` of string type was not correctly parsed as element selector @RylanBot ([#3940](https://github.com/Tencent/tdesign-react/pull/3940))
  - Fixed issue where popup could not appear normally when `children` was a wrapped component that does not support `ref` penetration @RylanBot ([#3940](https://github.com/Tencent/tdesign-react/pull/3940))
- `PopupPlugin`: Fixed `classPrefix` not working @RylanBot ([#3940](https://github.com/Tencent/tdesign-react/pull/3940))

## 🌈 1.15.11 `2025-12-15` 
### 🚀 Features
- `Textarea`: Support `count` API for custom counting element rendering @RylanBot ([#4003](https://github.com/Tencent/tdesign-react/pull/4003))
### 🐞 Bug Fixes
- `RadioGroup`: Fixed infinite loop issue in NextJS when `variant="default-filled"` and child components contain dynamic content @tingtingcheng6 ([#3921](https://github.com/Tencent/tdesign-react/pull/3921))

## 🌈 1.15.10 `2025-12-12` 
### 🐞 Bug Fixes
- `Drawer`: Fixed callback event incorrect caching issue @uyarn ([#4008](https://github.com/Tencent/tdesign-react/pull/4008))

## 🌈 1.15.9 `2025-11-28` 
### 🚀 Features
- `Cascader`: Support displaying non-leaf nodes in `filterable` options when `valueMode` is `all` or `parentFirst` @lifeiFront ([#3964](https://github.com/Tencent/tdesign-react/pull/3964))
- `Popup`: Added multiple component instance methods: `getOverlay` for getting overlay element, `getOverlayState` for getting overlay hover state, `getPopper` for getting current component popper instance, `update` for updating overlay content @RSS1102 ([#3925](https://github.com/Tencent/tdesign-react/pull/3925))
- `Select`: Support keyboard operations for options @uyarn ([#3969](https://github.com/Tencent/tdesign-react/pull/3969))
- `Swiper`: Support `cardScale` API for controlling card scaling ratio @RylanBot ([#3978](https://github.com/Tencent/tdesign-react/pull/3978))
### 🐞 Bug Fixes
- `Cascader`: Fixed `reserveKeyword` not working @RylanBot ([#3984](https://github.com/Tencent/tdesign-react/pull/3984))
- `Description`: Fixed spacing issue with `itemLayout='vertical'` in borderless mode @mikasayw ([common#2321](https://github.com/Tencent/tdesign-common/pull/2321))
- `Table`: Fixed error in drag-related events when table content is not rendered and `dragSort` is set @lifeiFront ([#3958](https://github.com/Tencent/tdesign-react/pull/3958))
- `Title`: Added fallback mechanism to avoid page white screen caused by incorrect use of `level` @RylanBot ([#3975](https://github.com/Tencent/tdesign-react/pull/3975))
- `Select`: Fixed issue where `onRemove` was not triggered when using backspace key to delete tags @RylanBot ([#3961](https://github.com/Tencent/tdesign-react/pull/3961))
- `Slider`: Fixed slider position abnormality caused by floating-point precision error @RylanBot ([#3947](https://github.com/Tencent/tdesign-react/pull/3947))
- `Swiper`: Fixed `current` initialization error in controlled mode @HaixingOoO ([#3959](https://github.com/Tencent/tdesign-react/pull/3959))
- `Upload`: Fixed lack of support for file array upload @GATING ([common#2078](https://github.com/Tencent/tdesign-common/pull/2078))
- `Calendar`: @shumuuu ([#3938](https://github.com/Tencent/tdesign-react/pull/3938))
  - Fixed issue where month options after termination month were not properly disabled when `range` is within same year
  - Fixed issue where year options incorrectly used month option disable range determination logic
- `Form`: Fixed `readonly` attribute compatibility issues in different components @RylanBot ([#3986](https://github.com/Tencent/tdesign-react/pull/3986))
- `Form`: @RylanBot ([#3957](https://github.com/Tencent/tdesign-react/pull/3957))
  - Fixed FormList related methods not working when nesting three or more levels
  - Fixed issue where `onValueChange` was not triggered during `reset`
  - Fixed issue where `onValuesChange` was not triggered when calling `setFieldsValue` during initialization
  - Fixed `setFieldValues` failure when `name` is a number or contains numbers in non-dynamic form scenarios
  - Optimized `key` generation, elements not refreshed when updated value is same as current form value
- `Tree`: 
  - Fixed issue where filtered nodes were unexpectedly disabled @RylanBot ([#3984](https://github.com/Tencent/tdesign-react/pull/3984))
  - Fixed issue where `setData` did not automatically trigger UI refresh @RylanBot ([common#2283](https://github.com/Tencent/tdesign-common/pull/2283))
- `TreeSelect`: @RylanBot ([#3984](https://github.com/Tencent/tdesign-react/pull/3984))
  - Fixed issue where parent nodes of filtered nodes could still be selected
  - Fixed issue where input content was not cleared on `blur`
### 🚧 Others
- `Slider`: Enhanced component generic support for better `value` and `onChange` interaction @RylanBot ([#3962](https://github.com/Tencent/tdesign-react/pull/3962))

## 🌈 1.15.8 `2025-11-04` 
### 🚀 Features
- `Popup`: Added `onOverlayClick` event to support content panel click triggering @RSS1102 ([#3927](https://github.com/Tencent/tdesign-react/pull/3927))
- `CheckboxGroup`: Support `readonly` API @RylanBot ([#3885](https://github.com/Tencent/tdesign-react/pull/3885))
- `Form`: @RylanBot ([#3885](https://github.com/Tencent/tdesign-react/pull/3885))
  - Support `readonly` API
  - Support `FormRule.pattern` type as `string`
### 🐞 Bug Fixes
- `Select`: Fixed issue where select all function was abnormal in group mode in version `1.15.7` @uyarn ([#3941](https://github.com/Tencent/tdesign-react/pull/3941))
- `Form`: Fixed issue where nested `FormList` could not use `setFields` to update form @RylanBot ([#3930](https://github.com/Tencent/tdesign-react/pull/3930))
- `CheckboxGroup`: Fixed issue where options set to `disabled` would have their status changed by `checkAll` @RylanBot ([#3885](https://github.com/Tencent/tdesign-react/pull/3885))
- `SubMenu`: Fixed issue where `visible` and `onVisibleChange` of custom `popupProps` were not working @RylanBot ([#3912](https://github.com/Tencent/tdesign-react/pull/3912))
- `DatePicker`: Fixed issue where popup would close after selecting date without selecting time when both `enableTimePicker` and `needConfirm={false}` were enabled @RylanBot ([#3860](https://github.com/Tencent/tdesign-react/pull/3860))
- `DateRangePicker`: Fixed issue where manual confirmation was still required when both `enableTimePicker` and `needConfirm={false}` were enabled @achideal ([#3860](https://github.com/Tencent/tdesign-react/pull/3860))
- `Progress`: Fixed issue where custom `label` was hidden when `theme='plump'` was enabled @RylanBot ([#3931](https://github.com/Tencent/tdesign-react/pull/3931))
- `RadioGroup`: @RylanBot 
  - Fixed highlight abnormality when child elements were dynamically updated ([#3922](https://github.com/Tencent/tdesign-react/pull/3922))
  - Fixed issue where highlight block did not disappear when `value` was set to empty ([#3944](https://github.com/Tencent/tdesign-react/pull/3944))
- `Tree`: @RylanBot
  - Fixed issue where child nodes could still be highlighted when parent nodes were disabled when `checkable` was not enabled and `checkStrictly={false}` ([#3828](https://github.com/Tencent/tdesign-react/pull/3828))
  - Fixed issue where parent nodes in semi-checked state could not be unchecked when `disabled` nodes existed ([#3828](https://github.com/Tencent/tdesign-react/pull/3828))
  - Fixed issue where `disabled` node selection status was changed when clicking parent node to select all ([#3828](https://github.com/Tencent/tdesign-react/pull/3828))
  - Fixed abnormality where row node was set to `active` when clicking `operation` area ([#3889](https://github.com/Tencent/tdesign-react/pull/3889))

### 🚧 Others
- `Form`: Optimized underlying logic of `getValidateMessage` method @RylanBot ([#3930](https://github.com/Tencent/tdesign-react/pull/3930))

## 🌈 1.15.7 `2025-10-24` 
### 🚀 Features
- `Avatar`: Added `Click`, `Hover` and `Contextmenu` and other mouse events to support avatar operation scenarios @NWYLZW ([#2906](https://github.com/Tencent/tdesign-react/pull/2906))
- `Dialog`: Support `setConfirmLoading` usage @ZWkang ([#2883](https://github.com/Tencent/tdesign-react/pull/2883))
- `SelectInput`: Support `size` property @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `TimePicker`: Added support for `onPick` event and `presets` API @ZWkang ([#2902](https://github.com/Tencent/tdesign-react/pull/2902))
- `Input`: Added `borderless` API to support borderless mode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `AutoComplete`: Added `borderless` API to support borderless mode @uyarn ([#2884](https://github.com/Tencent/tdesign-react/pull/2884))
- `ColorPicker`: Added `borderless` API to support borderless mode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `DatePicker`: Added `borderless` API to support borderless mode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `TagInput`: Added `borderless` API to support borderless mode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `TimePicker`: Added `borderless` API to support borderless mode @uyarn ([#2878](https://github.com/Tencent/tdesign-react/pull/2878))
- `Scroll`: Adjusted Chrome scrollbar style compatibility method after `1.6.0`, not dependent on `autoprefixer` version @loopzhou ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
### 🐞 Bug Fixes
- `ColorPicker`: Fixed issue where channel button position did not change when switching preview colors @fennghuang ([#2880](https://github.com/Tencent/tdesign-react/pull/2880))
- `Form`: Fixed issue where `FormItem` modification did not trigger listening to `FormList`'s `useWatch` @HaixingOoO ([#2904](https://github.com/Tencent/tdesign-react/pull/2904))
- `Menu`: @uyarn 
  - Fixed issue where using `dist` styles caused submenu position offset due to style priority issues ([#2890](https://github.com/Tencent/tdesign-react/pull/2890))
  - Increased `t-popup__menu` style priority to resolve style abnormality caused by consistent priority within dist ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Pagination`: Fixed issue where entering decimals did not automatically adjust @uyarn ([#2886](https://github.com/Tencent/tdesign-react/pull/2886))
- `Select`: 
   - Fixed `creatable` functionality abnormality @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - Fixed `reserveKeyword`配合 `Option Children` usage abnormality @uyarn ([#2903](https://github.com/Tencent/tdesign-react/pull/2903))
   - Optimized issue where selected style covered disabled style @fython ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
- `Slider`: Fixed issue where `sliderRef.current` could be empty @ZWkang ([#2868](https://github.com/Tencent/tdesign-react/pull/2868))
- `Table`: 
  - Fixed error where data was empty when unloading table @duxphp ([#2900](https://github.com/Tencent/tdesign-react/pull/2900))
  - Fixed abnormality where using fixed columns caused issues in some scenarios after version `1.5.0` @uyarn ([#2889](https://github.com/Tencent/tdesign-react/pull/2889))
- `TagInput`:
  - Fixed issue where `tagProps` was not passed to collapsed options @uyarn ([#2869](https://github.com/Tencent/tdesign-react/pull/2869))
  - Extended `collapsedItems` deletion functionality @HaixingOoO ([#2881](https://github.com/Tencent/tdesign-react/pull/2881))
- `TreeSelect`: Fixed issue where `keys` property had to be set through `treeProps` to work @ZWkang ([#2896](https://github.com/Tencent/tdesign-react/pull/2896))
- `Upload`: 
  - Fixed bug where upload progress could be manually modified @HaixingOoO ([#2901](https://github.com/Tencent/tdesign-react/pull/2901))
  - Fixed style abnormality of image upload in error type @uyarn ([#2905](https://github.com/Tencent/tdesign-react/pull/2905))
### 🚧 Others
- `TagInput`: Added `Size` property related documentation @HaixingOoO ([#2894](https://github.com/Tencent/tdesign-react/pull/2894))
- `Typography`: Removed redundant `defaultProps` @HaixingOoO ([#2866](https://github.com/Tencent/tdesign-react/pull/2866))
- `Upload`: Fixed documentation description about OPTIONS method @Summer-Shen ([#2865](https://github.com/Tencent/tdesign-react/pull/2865))

## 🌈 1.15.6 `2025-10-10` 
### 🐞 Bug Fixes
- `VirtualScroll`: Fixed component warning issue when using virtual scrolling with child components in async request scenarios @uyarn ([#3876](https://github.com/Tencent/tdesign-react/pull/3876))

## 🌈 1.15.5 `2025-10-05` 
### 🐞 Bug Fixes
- `Watermark`: Fixed usage issue in SSR scenarios in version `1.15.2` @Wesley-0808([#3873](https://github.com/Tencent/tdesign-react/pull/3873))
- `Descriptions`: Fixed spacing issue in borderless mode @liweijie0812 ([#3873](https://github.com/Tencent/tdesign-react/pull/3873))

## 🌈 1.15.4 `2025-10-01` 
### 🚀 Features
- `ImageViewer`: Support `trigger` passing image `index` parameter, `trigger`'s `open` method parameters may have type differences with bound element trigger events. If encountering this issue, please change to anonymous function like `()=> open()` @betavs ([#3827](https://github.com/Tencent/tdesign-react/pull/3827))
### 🐞 Bug Fixes
- `Swiper`: Fixed issue where auto-play failed after clicking navigation bar in mobile environment @uyarn ([#3862](https://github.com/Tencent/tdesign-react/pull/3862))
- `List`: Removed redundant code introduced in version `1.15.2` that caused initialization lag when virtual scrolling was enabled @RylanBot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))
- `Select`: Removed redundant code introduced in version `1.15.2` that caused initialization lag when virtual scrolling was enabled @RylanBot ([#3863](https://github.com/Tencent/tdesign-react/pull/3863))

## 🌈 1.15.3 `2025-09-29` 
### 🐞 Bug Fixes
- `Select`: Fixed issue where `OptionGroup`'s `style` and `className` were ineffective @uyarn ([#3855](https://github.com/Tencent/tdesign-react/pull/3855))

## 🌈 1.15.2 `2025-09-29` 
### 🚀 Features
- `Watermark`: Added `layout` API to support generating different layout watermarks, `watermarkText` supports font configuration @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Drawer`: Optimized issue where component content was selected during drag resizing @uyarn ([#3844](https://github.com/Tencent/tdesign-react/pull/3844))
### 🐞 Bug Fixes
- `Watermark`: Fixed issue where entire canvas content was grayscale when multi-line image watermark was configured with grayscale @Wesley-0808 ([#3817](https://github.com/Tencent/tdesign-react/pull/3817))
- `Slider`: Fixed return value and display abnormality caused by precision issue after setting `step` @uyarn ([#3821](https://github.com/Tencent/tdesign-react/pull/3821))
- `TagInput`: Fixed issue where `inputValue` in `onBlur` was always empty @RylanBot ([#3841](https://github.com/Tencent/tdesign-react/pull/3841))
- `Cascader`: Fixed issue where parent node was unexpectedly highlighted when selecting only child node in `single` mode @RylanBot ([#3840](https://github.com/Tencent/tdesign-react/pull/3840))
- `DateRangePickerPanel`: Fixed issue where clicking panel couldn't sync when `preset` involved cross-year dates @RylanBot ([#3818](https://github.com/Tencent/tdesign-react/pull/3818))
- `EnhancedTable`: Fixed issue where position was reset when clicking expand after node drag @RylanBot ([#3780](https://github.com/Tencent/tdesign-react/pull/3780))
- `Table`: @RylanBot 
  - Fixed issue where `onSortChange` always returned `undefined` when `multipleSort` was enabled but `sort` or `defaultSort` was not declared ([#3824](https://github.com/Tencent/tdesign-react/pull/3824))
  - Fixed issue where last row content was blocked when virtual scrolling and `firstFullRow`/`lastFullRow` etc. were enabled simultaneously ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fixed issue where `fixedRows`/`firstFullRow`/`lastFullRow` couldn't be used in combination under virtual scrolling ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fixed issue where scrollbar length was abnormal during virtual scrolling initialization ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fixed issue where fixed header and fixed columns couldn't align ([#3792](https://github.com/Tencent/tdesign-react/pull/3792))
  - Fixed issue where `defaultCurrent` must be declared for correct pagination when `pagination` was uncontrolled ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
  - Fixed issue where clicking pagination still triggered data update when `pagination` was controlled and unchanged ([#3822](https://github.com/Tencent/tdesign-react/pull/3822))
  - Fixed issue where editable cell content wasn't synchronized when `data` changed ([#3826](https://github.com/Tencent/tdesign-react/pull/3826))
- `SelectInput`: @RylanBot ([#3838](https://github.com/Tencent/tdesign-react/pull/3838))
  - Fixed issue where `onBlur` was ineffective when custom `popupVisible={false}`
  - Fixed issue where `onBlur` lacked `tagInputValue` parameter when `multiple` was enabled
- `Select`: 
  - Fixed issue where using `keys` to configure `content` as `label` or `value` was ineffective @RylanBot @uyarn ([#3829](https://github.com/Tencent/tdesign-react/pull/3829))
  - Fixed issue where white screen and scrollbar were unexpectedly reset when dynamically switching to virtual scrolling @RylanBot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))
  - Fixed issue where display data was out of sync when virtual scrolling was enabled and data was dynamically updated @huangchen1031 ([#3839](https://github.com/Tencent/tdesign-react/pull/3839))
- `List`: 
  - Fixed issue where some `ListItem` APIs were ineffective when virtual scrolling was enabled @FlowerBlackG ([#3835](https://github.com/Tencent/tdesign-react/pull/3835))
  - Fixed issue where scrollbar was unexpectedly reset when dynamically switching to virtual scrolling @RylanBot ([#3792](https://github.com/Tencent/tdesign-react/pull/3792)) ([#3836](https://github.com/Tencent/tdesign-react/pull/3836))

## 🌈 1.15.1 `2025-09-12` 
### 🐞 Bug Fixes
- `ImageViewer`: Fixed issue where `imageScale` configuration effect was abnormal @uyarn ([#3814](https://github.com/Tencent/tdesign-react/pull/3814))

## 🌈 1.15.0 `2025-09-11` 
### 🚀 Features
- `Icon`: @uyarn ([#3802](https://github.com/Tencent/tdesign-react/pull/3802))
  - `tdesign-icons-react` released version `0.6.0`, added `align-bottom`, `no-result`, `no-result-filled`, `tree-list`, `wifi-no`, `wifi-no-filled`, `logo-stackblitz-filled`, `logo-stackblitz`, `logo-wecom-filled` icons, removed `video-camera-3`, `video-camera-3-filled`, `list` icons. Those who relied on the following icons should note this upgrade ⚠️ 
  - Icon resources used by on-demand loading support variable stroke width feature, configured through `strokeWidth` property
  - Icon resources used by on-demand loading support multi-color fill feature, configured through `strokeColor` and `fillColor` properties
- `DatePicker`: Support not closing popup when clicking `preset` by overriding `popupProps` @RylanBot ([#3798](https://github.com/Tencent/tdesign-react/pull/3798))
### 🐞 Bug Fixes
- `Tree`: @RylanBot ([#3756](https://github.com/Tencent/tdesign-react/pull/3756))
  - Corrected node property `date-target` spelling to `data-target`, businesses that used this property before should note this change ⚠️
  - Fixed issue where expand/collapse icon display was abnormal after dragging
- `MessagePlugin`: Fixed error when `content` was `''`/`undefined`/`null` @RylanBot ([#3778](https://github.com/Tencent/tdesign-react/pull/3778))
- `Table`: 
  - Fixed page flickering issue caused by `Loading` mounting when `<React.StrictMode>` was not enabled @RylanBot ([#3775](https://github.com/Tencent/tdesign-react/pull/3775))
  - Fixed abnormality where `firstFullRow` size was larger than `size='medium'` when `size='small'` ([common2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Upload`: Fixed `status` update error in drag mode @RSS1102 ([#3801](https://github.com/Tencent/tdesign-react/pull/3801))
- `Input`: Fixed issue where `onFocus` and `onBlur` weren't triggered when `readonly` or disabling `allowInput` @RylanBot ([#3800](https://github.com/Tencent/tdesign-react/pull/3800))
- `Cascader`: 
  - Fixed issue where `valueDisplay` rendering was abnormal when `multiple` and `valueType='full'` were enabled @RSS1102 ([#3809](https://github.com/Tencent/tdesign-react/pull/3809))
  - Fixed issue where bottom options couldn't be selected caused by new features introduced in version `1.11.0` @RylanBot ([#3772](https://github.com/Tencent/tdesign-react/pull/3772))
- `Select`: Avoid frequent repeated triggering of `valueDisplay` rendering when dropdown opens and closes @RylanBot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `TagInput`: Avoid frequent repeated triggering of `valueDisplay` rendering when dropdown opens and closes @RylanBot ([#3808](https://github.com/Tencent/tdesign-react/pull/3808))
- `Dialog`: Fixed infinite loop issue caused by using `ref` in React 19 environment @RylanBot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Drawer`: Fixed infinite loop issue caused by using `ref` in React 19 environment @RylanBot ([#3799](https://github.com/Tencent/tdesign-react/pull/3799))
- `Popup`: Fixed issue where moving out of Trigger element was abnormal when `delay` was set to 0 @HaixingOoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))
- `Tooltip`: Fixed incomplete type issue with `delay` API @HaixingOoO ([#3806](https://github.com/Tencent/tdesign-react/pull/3806))
### 🚧 Others
- `react-render`: Fixed issue where warning about needing to import related modules still appeared after introducing `react-19-adapter` @HaixingOoO ([#3790](https://github.com/Tencent/tdesign-react/pull/3790))

## 🌈 1.14.5 `2025-08-26` 
### 🐞 Bug Fixes
- `Watermark`: Improved watermark component compatibility in SSR scenarios @uyarn ([#3765](https://github.com/Tencent/tdesign-react/pull/3765))

## 🌈 1.14.3 `2025-08-26` 
### 🐞 Bug Fixes
- `Pagination`: Fixed issue where jump icon didn't reset to correct state @phalera ([#3758](https://github.com/Tencent/tdesign-react/pull/3758))
- `Watermark`: @uyarn ([#3760](https://github.com/Tencent/tdesign-react/pull/3760))
  - Fixed issue where default text color lacked transparency in version `1.14.0`
  - Fixed issue where version `1.14.0` was incompatible with SSR scenarios

## 🌈 1.14.2 `2025-08-22` 
### 🐞 Bug Fixes
- `Dialog`: Fixed issue where `draggable` disable failed due to new features introduced in version `1.14.0` @RylanBot ([#3753](https://github.com/Tencent/tdesign-react/pull/3753))

## 🌈 1.14.1 `2025-08-22` 
### 🐞 Bug Fixes
- `Steps`: Fixed issue where icons were repeatedly rendered when `theme` was not `default` caused by version `1.13.2` @RSS1102 ([#3748](https://github.com/Tencent/tdesign-react/pull/3748))

## 🌈 1.14.0 `2025-08-21` 
### 🚀 Features
- `Tabs`: Moved `remove` event from delete icon to outer container to ensure replace icon functionality works normally. Those who overrode delete icon styles should note this change ⚠️ @RSS1102 ([#3736](https://github.com/Tencent/tdesign-react/pull/3736))
- `Card`: Added `headerClassName`, `headerStyle`, `bodyClassName`, `bodyStyle`, `footerClassName`, `footerStyle` for easy customization of card component parts @lifeiFront ([#3737](https://github.com/Tencent/tdesign-react/pull/3737))
- `Form`: `rules` support configuring nested fields for validation @uyarn ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `ImageViewer`: Adjusted `imageScale` internal property values to optional @willsontaoZzz ([#3710](https://github.com/Tencent/tdesign-react/pull/3710))
- `Select`: Support `onCreate` used together with `multiple` @uyarn ([#3717](https://github.com/Tencent/tdesign-react/pull/3717))
- `Table`: Added feature to reset scrollbar to top after pagination change @RSS1102 ([#3729](https://github.com/Tencent/tdesign-react/pull/3729))
- `Tree`: `onDragLeave` and `onDragOver` added `dragNode`, `dropPosition` parameters @phalera ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Upload`: Support uploading specified files in non-auto upload scenarios @uyarn ([#3742](https://github.com/Tencent/tdesign-react/pull/3742))
- `ColorPicker`: Support dragging color board, sliders etc. on mobile @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Dialog`: Support `draggable` property to take effect on mobile @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `ImageViewer`: Support `draggable` property to take effect on mobile @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Slider`: Support dragging on mobile @RylanBot ([#3723](https://github.com/Tencent/tdesign-react/pull/3723))
- `Statistic`: Changed `color` property type to string to support any [CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) supported color values @RSS1102 ([#3706](https://github.com/Tencent/tdesign-react/pull/3706))
### 🐞 Bug Fixes
- `Tree`: @RylanBot
  - Fixed issue where `draggable` was still effective in `disabled` state. Businesses that relied on this error should note this change ⚠️ ([#3740](https://github.com/Tencent/tdesign-react/pull/3740)) 
  - Fixed issue where parent node `disabled` state wasn't associated when `checkStrictly` was false by default ([#3739](https://github.com/Tencent/tdesign-react/pull/3739))
  - Fixed issue where `node` was null in drag-related event callbacks ([#3728](https://github.com/Tencent/tdesign-react/pull/3728))
- `Form`: @uyarn
    - Fixed issue where nested form data construction was affected by outer `FormList` ([#3715](https://github.com/Tencent/tdesign-react/pull/3715))
    - Fixed issue where inner form validation result fields were affected by outer form in nested forms ([#3738](https://github.com/Tencent/tdesign-react/pull/3738))
- `FormList`: Fixed issue where new data couldn't be added when manually setting initial values with `setFields` instead of using `initialData` caused by fix introduced in `1.13.2` @RylanBot ([#3730](https://github.com/Tencent/tdesign-react/pull/3730))
- `Input`: Fixed issue where cursor position wasn't preserved when clicking icon to toggle content visibility in password input @RylanBot ([#3726](https://github.com/Tencent/tdesign-react/pull/3726))
- `Table`: @RylanBot ([#3733](https://github.com/Tencent/tdesign-react/pull/3733))
    - Fixed white screen issue when dynamically updating data with virtual scrolling enabled  
    - Fixed issue where header and table content width didn't sync when virtual scrolling was enabled
    - Fixed issue where scrollbar was unexpectedly reset to first row position when virtual scrolling was enabled
    - Fixed issue where column dragging was ineffective when `dragSort='row-handler-col'` ([#3734](https://github.com/Tencent/tdesign-react/pull/3734))
    - Fixed abnormality where `firstFullRow` size was larger than `size='medium'` when `size='small'` ([common#2253](https://github.com/Tencent/tdesign-common/pull/2253))
- `Watermark`: Fixed issue where text watermark content was not obvious in dark mode @HaixingOoO @liweijie0812 ([#3692](https://github.com/Tencent/tdesign-react/pull/3692))
- `DatePicker`: Optimized panel content display effect when selecting same panel year in year selection mode @uyarn ([#3744](https://github.com/Tencent/tdesign-react/pull/3744))

## 🌈 1.13.2 `2025-08-01` 
### 🐞 Bug Fixes
- `DatePicker`: 
  - Fixed week and quarter mode tag deletion abnormality in multi-select scenarios @betavs ([#3664](https://github.com/Tencent/tdesign-react/pull/3664))
  - Fixed issue where `placeholder` didn't disappear normally in multi-select mode @RylanBot ([#3666](https://github.com/Tencent/tdesign-react/pull/3666))
- `EnhancedTable`: @RylanBot
  - Fixed issue where `data` update failed in async scenarios caused by fix introduced in `1.13.0` version ([#3690](https://github.com/Tencent/tdesign-react/pull/3690)) 
  - Fixed issue where unique key didn't exist when dynamically initializing `columns` using `tree` API ([#3669](https://github.com/Tencent/tdesign-react/pull/3669))
  - Fixed issue where leaf node judgment condition was too broad, causing corresponding style not to render normally @RylanBot ([#3681](https://github.com/Tencent/tdesign-react/pull/3681))
- `SelectInput`: Fixed some bugs caused by setting `display` when getting scrollbar in `useOverlayInnerStyle` @HaixingOoO ([#3677](https://github.com/Tencent/tdesign-react/pull/3677))
- `Textarea`: Fixed issue where `autosize` was ineffective when `Textarea` was mounted in `Dialog` @HaixingOoO ([#3693](https://github.com/Tencent/tdesign-react/pull/3693))
- `ColorPicker`: @RylanBot ([#3667](https://github.com/Tencent/tdesign-react/pull/3667))
  - Reduced multiple conversions across color spaces to reduce error
  - Fixed issue where color update was abnormal when directly long-pressing gradient point and dragging
  - Fixed issue where other input boxes were unexpectedly reset when clearing one input box value
- `Upload`: Ensure upload action is executed after `beforeUpload` completes @RSS1102 ([#3686](https://github.com/Tencent/tdesign-react/pull/3686))
- `Table`: Fixed issue where column name content moved due to column border lines when `resizable` was enabled @QuentinHsu([common#2224](https://github.com/Tencent/tdesign-common/pull/2224))
- `Descriptions`: Fixed left and right padding in borderless mode @liweijie0812 ([common#2219](https://github.com/Tencent/tdesign-common/pull/2219))
- `Steps`: Fixed custom icon and status icon priority issue @RSS1102 ([#3670](https://github.com/Tencent/tdesign-react/pull/3670))
- `Form`: Fixed issue where old data was filled back when adding new data after deleting data in dynamic form @RylanBot ([#3684](https://github.com/Tencent/tdesign-react/pull/3684))

## 🌈 1.13.1 `2025-07-11`
### 🐞 Bug Fixes
- `QRCode`: Fixed `canvas` QR code Safari style compatibility issue @lifeiFront ([common#2207](https://github.com/Tencent/tdesign-common/pull/2207))

## 🌈 1.13.0 `2025-07-10` 
### 🚀 Features
- `React19`: Added adapter compatible with React 19 usage. Please refer to usage documentation for detailed instructions when using in React 19 @HaixingOoO @uyarn([#3640](https://github.com/Tencent/tdesign-react/pull/3640))
- `QRCode`: Added `QRCode` component @lifeiFront @wonkzhang ([#3612](https://github.com/Tencent/tdesign-react/pull/3612))
- `Alert`: Added `closeBtn` API to maintain consistency with other components, `close` will be deprecated in future versions, please adjust to use `closeBtn` as soon as possible ⚠️ @ngyyuusora ([#3625](https://github.com/Tencent/tdesign-react/pull/3625))
- `Form`: Added feature to reset form content when reopening Form @alisdonwang ([#3613](https://github.com/Tencent/tdesign-react/pull/3613))
- `ImageViewer`: Support zooming images with two fingers when using on mobile @RylanBot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
- `locale`: Support proper display of singular/plural scenarios in built-in multilingual English version @YunYouJun ([#3639](https://github.com/Tencent/tdesign-react/pull/3639))
### 🐞 Bug Fixes
- `ColorPicker`: 
  - Fixed issue where color board didn't sync update when clicking gradient point @RylanBot ([#3624](https://github.com/Tencent/tdesign-react/pull/3624))
  - Fixed issue where input box content wasn't reset in invalid character input and multiple clearing scenarios @uyarn ([#3653](https://github.com/Tencent/tdesign-react/pull/3653))
- `Dropdown`: Fixed error issue caused by abnormal dropdown menu node retrieval in some scenarios @uyarn ([#3657](https://github.com/Tencent/tdesign-react/pull/3657))
- `ImageViewer`: @RylanBot ([#3629](https://github.com/Tencent/tdesign-react/pull/3629))
  - Fixed issue where clicking toolbar icon edge couldn't trigger corresponding operation
  - Fixed `z-index` hierarchy relationship abnormality caused by `TooltipLite`
- `Popup`: Fixed arrow position offset caused by `arrow` modifier from popper.js introduced in `1.11.2` @RylanBot ([#3652](https://github.com/Tencent/tdesign-react/pull/3652))
- `Loading`: Fixed icon position error issue on iPad WeChat @Nero978([#3655](https://github.com/Tencent/tdesign-react/pull/3655))
- `Menu`: Fixed issue where `expandMutex` easily failed when nested submenus existed @RylanBot ([#3621](https://github.com/Tencent/tdesign-react/pull/3621))
- `Table`: 
  - Fixed issue where sticky function didn't follow height changes @huangchen1031 ([#3620](https://github.com/Tencent/tdesign-react/pull/3620))
  - Fixed error when `columns` changed dynamically when `showHeader` was `false` @RylanBot ([#3637](https://github.com/Tencent/tdesign-react/pull/3637))
- `EnhancedTable`: Fixed issue where `tree.defaultExpandAll` was ineffective @RylanBot ([#3638](https://github.com/Tencent/tdesign-react/pull/3638))
- `Textarea`: Fixed jittering issue when wrapping after exceeding maximum height @RSS1102 ([#3631](https://github.com/Tencent/tdesign-react/pull/3631))

## 🌈 1.12.3 `2025-06-13` 
### 🚀 Features
- `Form`: Added `requiredMarkPosition` API to define required symbol position @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
- `ConfigProvider`: `FormConfig` in global configuration added `requiredMaskPosition` configuration for globally configuring required symbol position @Wesley-0808 ([#3586](https://github.com/Tencent/tdesign-react/pull/3586))
### 🐞 Bug Fixes
- `Drawer`: Fixed missing `null` declaration in `cancelBtn` and `confirmBtn` types @RSS1102 ([#3602](https://github.com/Tencent/tdesign-react/pull/3602))
- `ImageViewer`: Fixed size abnormality of error images in small window image viewer @RylanBot([#3607](https://github.com/Tencent/tdesign-react/pull/3607))
- `Menu`: Issue where `delay` property in `popupProps` was ineffective in `SubMenu` @RylanBot ([#3599](https://github.com/Tencent/tdesign-react/pull/3599))
- `Menu`: When `expandMutex` was enabled, menu couldn't expand if second-level `SubMenu` existed @RylanBot ([#3601](https://github.com/Tencent/tdesign-react/pull/3601))
- `Select`: Fixed issue where `checkAll` was still triggered when set to `disabled` @RylanBot ([#3563](https://github.com/Tencent/tdesign-react/pull/3563))
- `Table`: Optimized issue where selected column data was inconsistent with displayed column data when closing column configuration popup @RSS1102 ([#3608](https://github.com/Tencent/tdesign-react/pull/3608))
- `TabPanel`: Fixed issue where setting `display` attribute through `style` was ineffective @uyarn ([#3609](https://github.com/Tencent/tdesign-react/pull/3609))
- `Tabs`: Fixed issue where first `TabPanel` was always rendered first when lazy loading was enabled @HaixingOoO ([#3614](https://github.com/Tencent/tdesign-react/pull/3614))
- `TreeSelect`: Fixed issue where `label` API couldn't be used normally @RylanBot ([#3603](https://github.com/Tencent/tdesign-react/pull/3603))

## 🌈 1.12.2 `2025-05-30` 
### 🚀 Features
- `Cascader`: Added support for using `option` method to customize dropdown option content @huangchen1031 ([#3565](https://github.com/Tencent/tdesign-react/pull/3565))
- `MenuGroup`: Added support for using `className` and `style` @wang-ky ([#3568](https://github.com/Tencent/tdesign-react/pull/3568))
- `InputNumber`: `decimalPlaces` added `enableRound` parameter to control whether to enable rounding @RylanBot ([#3564](https://github.com/Tencent/tdesign-react/pull/3564))
- `TagInput`: Optimized mouse cursor display as move cursor when draggable @liweijie0812 ([#3552](https://github.com/Tencent/tdesign-react/pull/3552))
### 🐞 Bug Fixes
- `Card`: Fixed issue where `content` prop was ineffective @RylanBot ([#3553](https://github.com/Tencent/tdesign-react/pull/3553))
- `Cascader`: 
     - Fixed display abnormality when options had overly long text in small sizes @Shabi-x([#3551](https://github.com/Tencent/tdesign-react/pull/3551))
     - Fixed issue where `displayValue` didn't change when async updating `options` after initialization @huangchen1031 ([#3549](https://github.com/Tencent/tdesign-react/pull/3549))
- `DatePicker`: Fixed `onFocus` event timing issue @l123wx ([#3578](https://github.com/Tencent/tdesign-react/pull/3578))
- `Drawer`: Optimized input cursor error caused by `TNode` re-rendering @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
-  `Form`:
    - Fixed issue where setting same value through `setFields` in `onValuesChange` continued to trigger `onValuesChange` causing `re-render` @HaixingOoO ([#3304](https://github.com/Tencent/tdesign-react/pull/3304))
    - Fixed `reset` value initialization error after deleting `field` in `FormList` @l123wx ([#3557](https://github.com/Tencent/tdesign-react/pull/3557))
    - Compatible with scenarios of using `FormItem` alone before version `1.11.7` @uyarn ([#3588](https://github.com/Tencent/tdesign-react/pull/3588))
- `Guide`: Optimized issue where component didn't recalculate position when screen size changed @HaixingOoO ([#3543](https://github.com/Tencent/tdesign-react/pull/3543))
- `List`: Fixed issue where getting child node `props` failed when child nodes were empty @RSS1102 ([#3570](https://github.com/Tencent/tdesign-react/pull/3570))
- `Popconfirm`: Fixed issue where `confirmBtn` property children was ineffective @huangchen1031 ([#3556](https://github.com/Tencent/tdesign-react/pull/3556))
- `Slider`: Fixed issue where last `label` width was insufficient and automatically wrapped @l123wx([#3581](https://github.com/Tencent/tdesign-react/pull/3581))
- `Textarea`: Fixed issue where Chinese input was interrupted @betavs ([#3544](https://github.com/Tencent/tdesign-react/pull/3544))
- `TreeSelect`: Fixed issue where selected values were deleted when clicking already selected value in single-select mode @HaixingOoO ([#3573](https://github.com/Tencent/tdesign-react/pull/3573))
### 🚧 Others
- `Dialog`: Optimized component initialization rendering time @RylanBot ([#3561](https://github.com/Tencent/tdesign-react/pull/3561))

## 🌈 1.12.1 `2025-05-07` 
### 🐞 Bug Fixes
- Fixed compatibility issue with React 18 and below in version 1.12.0 @uyarn ([#3545](https://github.com/Tencent/tdesign-react/pull/3545))

## 🌈 1.12.0 `2025-04-28` 
### 🚀 Features
- `React`: Comprehensively upgraded related dependencies, compatible with usage in React19 @HaixingOoO ([#3438](https://github.com/Tencent/tdesign-react/pull/3438))
- `ColorPicker`: @RylanBot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503)) Businesses using gradient mode should note this change ⚠️
  - Automatically switch between single color and gradient modes based on color values from "trigger/recent colors/preset colors"
  - When only gradient mode is enabled, filter non-gradient color values from "preset colors/current colors"
  - Added format `HEX8`, removed `HSB`
  - Added `enableMultipleGradient` API, enabled by default
- `Drawer`: Added `lazy` property for lazy loading scenarios, `forceRender` has been declared deprecated and will be removed in future versions @RSS1102 ([#3527](https://github.com/Tencent/tdesign-react/pull/3527))
- `Dialog`: Added `lazy` property for lazy loading scenarios, `forceRender` has been declared deprecated and will be removed in future versions @RSS1102 ([#3515](https://github.com/Tencent/tdesign-react/pull/3515))
### 🐞 Bug Fixes
- `ColorPicker`: @RylanBot ([#3503](https://github.com/Tencent/tdesign-react/pull/3503))
  - Fixed issue where gradient points couldn't normally update color and position
  - Fixed return value formatting abnormality when transparency channel was enabled

## 🌈 1.11.8 `2025-04-28` 
### 🚀 Features
- `ConfigProvider`: Support global context configuration acting on Message related plugins @lifeiFront ([#3513](https://github.com/Tencent/tdesign-react/pull/3513))
- `Icon`: Added `logo-miniprogram` Mini Program, `logo-cnb` Cloud Native Build, `seal` Seal, `quote` Quote and other icons @taowensheng1997 @uyarn ([#3517](https://github.com/Tencent/tdesign-react/pull/3517))
- `Upload`: `image-flow` mode supports progress and custom error text @ngyyuusora ([#3525](https://github.com/Tencent/tdesign-react/pull/3525))
- `Select`: Multi-select removing options through panel added `onRemove` callback @QuentinHsu ([#3526](https://github.com/Tencent/tdesign-react/pull/3526))
### 🐞 Bug Fixes
- `InputNumber`: Optimized boundary issues of number input box @Sight-wcg([#3519](https://github.com/Tencent/tdesign-react/pull/3519))
- `Select`:
    - Fixed cursor abnormality and missing complete `option` information in child component callback functions after version `1.11.2` @HaixingOoO @uyarn ([#3520](https://github.com/Tencent/tdesign-react/pull/3520))  ([#3529](https://github.com/Tencent/tdesign-react/pull/3529))
    - Optimized multi-select tag removal related events to different `trigger`, adjusted different trigger scenarios to `clear`, `remove-tag` and `uncheck`, fixed select all option `trigger` error @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
    - Fixed issue where `change` event was triggered when clicking selected option again in single-select mode @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))
    - Fixed issue where `change` event couldn't be triggered when pressing `backspace` in multi-select mode @betavs ([#3388](https://github.com/Tencent/tdesign-react/pull/3388))

## 🌈 1.11.7 `2025-04-18` 
### 🚀 Features
- `ConfigProvider`: Added `isContextEffectPlugin` API, disabled by default. When enabled, global configuration will affect function calls of `Dialog`, `Loading`, `Drawer`, `Notification` and `Popup` components @lifeiFront ([#3488](https://github.com/Tencent/tdesign-react/pull/3488)) ([#3504](https://github.com/Tencent/tdesign-react/pull/3504))
- `Tree`: `checkProps` parameter supports function passing, supporting different `checkProps` settings for different nodes @phalera ([#3501](https://github.com/Tencent/tdesign-react/pull/3501))
- `Cascader`: Added `onClear` event callback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `DatePicker`: Added `onClear` event callback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `TimePicker`: Added `onClear` event callback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
- `ColorPicker`: 
    - Added `clearable` API @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
    - Added `onClear` event callback @RylanBot ([#3509](https://github.com/Tencent/tdesign-react/pull/3509))
### 🐞 Bug Fixes
- `DatePicker`: Ensure corresponding `onVisibleChange` callback when external component actively closes Popup @RylanBot ([#3510](https://github.com/Tencent/tdesign-react/pull/3510))
- `Drawer`: Added `DrawerPlugin` to support function calls, refer to examples for specific usage @Wesley-0808 ([#3381](https://github.com/Tencent/tdesign-react/pull/3381))
- `InputNumber`: Fixed issue where component wasn't controlled by value property @RSS1102 ([#3499](https://github.com/Tencent/tdesign-react/pull/3499))
- `ImageViewer`:
     - Fixed display abnormality when `step` had precision @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
     - Fixed type error where parameters in `imageScale` were required @uyarn ([#3491](https://github.com/Tencent/tdesign-react/pull/3491))
- `Slider`: Fixed issue where size wasn't limited when using `theme` as `col` input box mode when input box was enabled @RSS1102 ([#3500](https://github.com/Tencent/tdesign-react/pull/3500))
- `Tabs`: Optimized issue where sliding buttons were ineffective when tab `label` was too long @wonkzhang ([common#2108](https://github.com/Tencent/tdesign-common/pull/2108))

## 🌈 1.11.6 `2025-04-11` 
### 🚀 Features
- `Breadcrumb`: Added related APIs `ellipsis`, `maxItems`, `itemsAfterCollapse`, `itemsBeforeCollapse` for collapse scenarios, refer to examples for specific usage @moecasts ([#3487](https://github.com/Tencent/tdesign-react/pull/3487))
### 🐞 Bug Fixes
- `RadioGroup`: Optimized switching highlight effect issue @RylanBot ([#3446](https://github.com/Tencent/tdesign-react/pull/3446))
- `Tag`: Fixed issue where `style` priority was lower than `color`, causing scenarios where tag styles couldn't be forcefully overridden @uyarn ([#3492](https://github.com/Tencent/tdesign-react/pull/3492))
- `ColorPicker`: Fixed effect abnormality when switching between single color and gradient @RylanBot ([#3493](https://github.com/Tencent/tdesign-react/pull/3493))
- `Table`: Fixed right-side drag adjustment abnormality in adjustable column width table @uyarn ([#3496](https://github.com/Tencent/tdesign-react/pull/3496))
- `Swiper`: Optimized default container height to avoid navigator position abnormality @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))
### 📝 Documentation
- `Swiper`: Optimized component jump sandbox demo missing example styles @uyarn ([#3490](https://github.com/Tencent/tdesign-react/pull/3490))
### 🚧 Others
- Version `1.12.0` will fully support React 19 usage. For React 19 related usage scenarios, you can upgrade to version `1.12.0-alpha.3` for trial

## 🌈 1.11.4 `2025-04-03` 
### 🐞 Bug Fixes
- `Select`: Fixed issue where empty `options` caused error leading to white screen @2ue ([#3484](https://github.com/Tencent/tdesign-react/pull/3484))
- `Tree`: Fixed issue where clicking and expand logic was still triggered when icon was false @uyarn ([#3485](https://github.com/Tencent/tdesign-react/pull/3485))

## 🌈 1.11.3 `2025-04-01` 
### 🚀 Features
- `ConfigProvider`: `Pagination` added `Jumper` configuration for customizing jump part styles @RylanBot ([#3421](https://github.com/Tencent/tdesign-react/pull/3421))
### 🐞 Bug Fixes
- `Textarea`: Fixed `TextArea` `autofocus` bug and `autosize` ineffective in `Dialog` @HaixingOoO ([#3471](https://github.com/Tencent/tdesign-react/pull/3471))
- `lib`: Fixed `lib` artifact redundant style issue causing abnormality in `next.js` usage and missing version number in version `1.11.2` @uyarn ([#3474](https://github.com/Tencent/tdesign-react/pull/3474))
- `Table`: Fixed pagination state calculation error in controlled method @huangchen1031 ([#3473](https://github.com/Tencent/tdesign-react/pull/3473))

## 🌈 1.11.2 `2025-03-28` 
### 🚀 Features
- `ImageViewer`: Added `onDownload` API for customizing preview image download callback functionality @lifeiFront ([#3408](https://github.com/Tencent/tdesign-react/pull/3408))
- `ConfigProvider`: `Input` added `clearTrigger` configuration for globally configuring show close button when there's value in global mode @RylanBot ([#3412](https://github.com/Tencent/tdesign-react/pull/3412))
- `Descriptions`: Added `tableLayout` property @liweijie0812 ([#3434](https://github.com/Tencent/tdesign-react/pull/3434))
- `Message`: When closing message instance, remove it from global message list to avoid potential memory leak risks @wonkzhang ([#3413](https://github.com/Tencent/tdesign-react/pull/3413))
- `Select`: Group selector added support for filtering functionality @huangchen1031 ([#3430](https://github.com/Tencent/tdesign-react/pull/3430))
- `Tabs`: Added `lazy` API to support configuring lazy loading functionality @HaixingOoO ([#3426](https://github.com/Tencent/tdesign-react/pull/3426))
### 🐞 Bug Fixes
- `ConfigProvider`: Fixed issue where secondary configuration affected non-`Context` range @uyarn ([#3441](https://github.com/Tencent/tdesign-react/pull/3441))
- `Dialog`: Added class names to cancel and confirm buttons for easy customization @RSS1102 ([#3417](https://github.com/Tencent/tdesign-react/pull/3417))
- `Drawer`: Fixed issue where width might be incorrect when getting during drag resizing @wonkzhang ([#3420](https://github.com/Tencent/tdesign-react/pull/3420))
- `Guide`: Fixed ineffective `overlayClassName` pass-through property in `popupProps` @RSS1102 ([#3433](https://github.com/Tencent/tdesign-react/pull/3433))
- `Popup`: Solved issue where component modifier `arrow` property setting was ineffective @wonkzhang ([#3437](https://github.com/Tencent/tdesign-react/pull/3437))
- `Select`: Fixed issue where cursor and `clear` icon existed in `readonly` mode @wonkzhang ([#3436](https://github.com/Tencent/tdesign-react/pull/3436))
- `Table`:
  - Fixed `fixedRows` rendering issue when virtual scrolling was enabled @huangchen1031 ([#3427](https://github.com/Tencent/tdesign-react/pull/3427))
  - Fixed style abnormality of selectable table in Firefox browser @uyarn ([common#2093](https://github.com/Tencent/tdesign-common/pull/2093))
- `Tooltip`: Fixed `mouse` position calculation error in `TooltipLite` under `React 16` @moecasts ([#3465](https://github.com/Tencent/tdesign-react/pull/3465))
- `Tree`: Fixed issue where component reported error after removing nodes in some scenarios @2ue ([#3463](https://github.com/Tencent/tdesign-react/pull/3463))
### 📝 Documentation
- `Card`: Fixed documentation content text error @betavs ([#3448](https://github.com/Tencent/tdesign-react/pull/3448))

## 🌈 1.11.1 `2025-02-28` 
### 🚀 Features
- `Layout`: Child component `Content` added `content` API @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))
### 🐞 Bug Fixes
- `reactRender`: fix `React19` `reactRender` error @HaixingOoO ([#3380](https://github.com/Tencent/tdesign-react/pull/3380))
- `Table`: Fixed footer rendering issue under virtual scrolling @huangchen1031 ([#3383](https://github.com/Tencent/tdesign-react/pull/3383))
- `fix`: Fixed `1.11.0` cjs artifact abnormality @uyarn ([#3392](https://github.com/Tencent/tdesign-react/pull/3392))
### 📝 Documentation
- `ConfigProvider`: Added `globalConfig` API documentation @liweijie0812 ([#3384](https://github.com/Tencent/tdesign-react/pull/3384))

## 🌈 1.11.0 `2025-02-20` 
### 🚀 Features
- `Cascader`: Added support for automatically scrolling to first selected item node when opening menu @uyarn ([#3357](https://github.com/Tencent/tdesign-react/pull/3357))
- `DatePicker`: Adjusted component disabled date `before` and `after` parameter logic, now disables dates before `before` definition and after `after` definition. Those who used related APIs before should note this change ⚠️ @lifeiFront ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `List`: Added `scroll` API to support enabling virtual scrolling for large data volumes @HaixingOoO ([#3363](https://github.com/Tencent/tdesign-react/pull/3363))
- `Menu`: Menu added collapse and expand animation effects @hd10180 ([#3342](https://github.com/Tencent/tdesign-react/pull/3342))
- `TagInput`: Added `maxRows` API for setting maximum display rows @Shabi-x ([#3293](https://github.com/Tencent/tdesign-react/pull/3293))
### 🐞 Bug Fixes
- `Card`: Fixed warning issues in React 19 @HaixingOoO ([#3369](https://github.com/Tencent/tdesign-react/pull/3369))
- `Cascader`: Fixed multi-select dynamic loading usage abnormality @uyarn ([#3376](https://github.com/Tencent/tdesign-react/pull/3376))
- `CheckboxGroup`: Fixed issue where `onChange` `context` parameter lacked `option` @HaixingOoO ([#3349](https://github.com/Tencent/tdesign-react/pull/3349))
- `DatePicker`: Fixed date selection abnormality in negative time zones @lifeiFront ([#3362](https://github.com/Tencent/tdesign-react/pull/3362))
- `Dropdown`: Fixed issue where click event callback `context` parameter didn't match documentation description @uyarn ([#3372](https://github.com/Tencent/tdesign-react/pull/3372))
- `RadioGroup`: Fixed issue in React 19 version @HaixingOoO ([#3364](https://github.com/Tencent/tdesign-react/pull/3364))
- `Tabs`: Fixed style issue when using slidable `Tabs` with `action` @Wesley-0808([#3343](https://github.com/Tencent/tdesign-react/pull/3343))
- `Table`: Fixed issue where Table footer wasn't displayed when switching tabs with `Tabs` @wonkzhang ([#3370](https://github.com/Tencent/tdesign-react/pull/3370))
- `Textarea`: Fixed issue where cursor didn't follow content end when using `autofocus` API and `value` had value @HaixingOoO ([#3358](https://github.com/Tencent/tdesign-react/pull/3358))
- `Transfer`: Fixed `TransferItem` ineffective issue @HaixingOoO ([#3339](https://github.com/Tencent/tdesign-react/pull/3339))
### 🚧 Others
- Adjusted component dependency `lodash` to `lodash-es` @zhangpaopao0609 ([#3345](https://github.com/Tencent/tdesign-react/pull/3345))

## 🌈 1.10.5 `2025-01-16` 
### 🚀 Features
- `RadioGroup`: Added `theme` API to determine child component styles when using options @HaixingOoO ([#3303](https://github.com/Tencent/tdesign-react/pull/3303))
- `Upload`: Added `imageProps` API for passing through `Image` component related properties in image upload scenarios @HaixingOoO ([#3317](https://github.com/Tencent/tdesign-react/pull/3317))
- `AutoComplete`: Added `empty` API to support customizing empty node content @liweijie0812 ([#3319](https://github.com/Tencent/tdesign-react/pull/3319))
- `Drawer`: `sizeDraggable` added support for `SizeDragLimit` type functionality implementation @huangchen1031 ([#3323](https://github.com/Tencent/tdesign-react/pull/3323))
- `Icon`: Added `logo-alipay`, `logo-behance-filled` and other icons, modified `logo-wecom` icon, removed unreasonable `logo-wecom-filled` icon @uyarn ([#3326](https://github.com/Tencent/tdesign-react/pull/3326))
### 🐞 Bug Fixes
- `Select`: Fixed issue where all options values in `onChange` callback `context` didn't contain complete option content @uyarn ([#3305](https://github.com/Tencent/tdesign-react/pull/3305))
- `DateRangePicker`: Logic judgment error when start and end values both existed @betavs ([#3301](https://github.com/Tencent/tdesign-react/pull/3301))
- `Notification`: Fixed rendering node abnormality caused by using `attach` attribute configuration @centuryPark ([#3306](https://github.com/Tencent/tdesign-react/pull/3306))
- `AutoComplete`: Fixed display abnormality when options were empty @betavs ([#3316](https://github.com/Tencent/tdesign-react/pull/3316))
- `Menu`: Fixed issue where `icon` wasn't rendered in `head-menu` @HaixingOoO ([#3320](https://github.com/Tencent/tdesign-react/pull/3320))
- `Statistic`: Fixed precision error during value animation when `decimalPlaces=0` @huangchen1031 ([#3327](https://github.com/Tencent/tdesign-react/pull/3327))
- `ImageViewer`: Fixed flickering when clicking overlay to close when `closeOnOverlay` was enabled @huangchen1031

## 🌈 1.10.4 `2024-12-25` 
### 🚀 Features
- `Tree`: Support `onScroll` API for handling scroll event callbacks @HaixingOoO ([#3295](https://github.com/Tencent/tdesign-react/pull/3295))
- `TooltipLite`: Optimized to completely follow mouse position in `mouse` mode, more consistent with API description @moecasts ([#3267](https://github.com/Tencent/tdesign-react/pull/3267))
### 🐞 Bug Fixes
- `Select`: Fixed issue where select all default return value was wrong @uyarn ([#3298](https://github.com/Tencent/tdesign-react/pull/3298))
- `Upload`: Optimized style issues of some size upload component image display @huangchen1031 ([#3290](https://github.com/Tencent/tdesign-react/pull/3290))
### 📝 Documentation
- `Stackblitz`: Adjusted `Stackblitz` example startup method and fixed issues where some examples couldn't use `stackblitz` or `codesandbox` to run @uyarn ([#3297](https://github.com/Tencent/tdesign-react/pull/3297))

## 🌈 1.10.2 `2024-12-19`
### 🚀 Features
- `Alert`: No longer display `expand more/collapse` button when `maxLine >= message` array length @miownag ([#3281](https://github.com/Tencent/tdesign-react/pull/3281))
- `ConfigProvider`: `attach` property supports configuring `drawer` component, supports globally configuring `drawer` mount position @HaixingOoO ([#3272](https://github.com/Tencent/tdesign-react/pull/3272))
- `DatePicker`: Multi-select mode supports week selection and year selection scenarios @HaixingOoO @uyarn ([#3264](https://github.com/Tencent/tdesign-react/pull/3264))
- `Form`: Added `supportNumberKey` API to support scenarios where number key values were not supported after version `1.9.3`. If you don't need to support number type as form key value, please disable this API @uyarn ([#3277](https://github.com/Tencent/tdesign-react/pull/3277))
- `Radio`: Added support for `reaonly` property of `Radio` and `RadioGroup` @liweijie0812 ([#3280](https://github.com/Tencent/tdesign-react/pull/3280))
- `Tree`: Instance added `setIndeterminate` method to support manually setting semi-select functionality @uyarn ([#3261](https://github.com/Tencent/tdesign-react/pull/3261))
- `DatePicker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `TimePicker`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
- `RangeInput`: Support `label` API @liweijie0812 ([#3276](https://github.com/Tencent/tdesign-react/pull/3276))
### 🐞 Bug Fixes
- `DateRangePicker`: Fixed display abnormality in cross-year scenarios @huangchen1031 ([#3275](https://github.com/Tencent/tdesign-react/pull/3275))
- `Menu`: Optimized menu item click event binding issue to avoid boundary trigger abnormality @huangchen1031 ([#3241](https://github.com/Tencent/tdesign-react/pull/3241))
- `ImageViewer`: Fixed issue where `onClose` was triggered every time `visable` changed when uncontrolled @HaixingOoO ([#3244](https://github.com/Tencent/tdesign-react/pull/3244))
- `CheckboxGroup`: Fixed issue where child elements were not checkboxes causing abnormality @HaixingOoO ([#3253](https://github.com/Tencent/tdesign-react/pull/3253))
- `Form`: Fixed `setFieldValues` functionality abnormality with multi-level form fields after version `1.9.3` @l123wx ([#3279](https://github.com/Tencent/tdesign-react/pull/3279))
- `Form`: Fixed validation ineffective issue when rules involved `0` judgment @RSS1102 ([#3283](https://github.com/Tencent/tdesign-react/pull/3283))
- `Select`: Fixed display abnormality and callback parameter missing when `valueType` was `object` and select all was selected @uyarn ([#3287](https://github.com/Tencent/tdesign-react/pull/3287))
- `SelectInput`: Fixed vertical alignment issue caused by rendering node when there was no `label` @huangchen1031 ([#3278](https://github.com/Tencent/tdesign-react/pull/3278))
- `TextArea`: Optimized height calculation logic under `autosize` during `TextArea` initialization @HaixingOoO ([#3286](https://github.com/Tencent/tdesign-react/pull/3286))
### 🚧 Others
- `Alert`: Optimized test case code types and added tests for `className`, `style` @RSS1102 ([#3284](https://github.com/Tencent/tdesign-react/pull/3284))

## 🌈 1.10.1 `2024-11-28` 
### 🚀 Features
- `DatePicker`: Added `multiple` API to support date picker multi-select functionality, refer to examples for specific usage @HaixingOoO ([#3199](https://github.com/Tencent/tdesign-react/pull/3199))
- `DatePicker`: Added `disableTime` API to more conveniently set disabled time parts @HaixingOoO ([#3226](https://github.com/Tencent/tdesign-react/pull/3226))
- `Dialog`: Added `beforeClose` and `beforeOpen` APIs to execute more callback operations when opening and closing popup @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
- `Drawer`: Added `beforeClose` and `beforeOpen` APIs to execute more callback operations when opening and closing drawer @Wesley-0808 ([#3203](https://github.com/Tencent/tdesign-react/pull/3203))
### 🐞 Bug Fixes
- `ColorPicker`: Fixed issue where some copy in `colorMode` didn't support internationalization @l123wx ([#3221](https://github.com/Tencent/tdesign-react/pull/3221))
- `Form`: Fixed issue where `setFieldsValue` and `setFields` didn't trigger `onValuesChange` @uyarn ([#3232](https://github.com/Tencent/tdesign-react/pull/3232))
- `Notification`: Modified `NotificationPlugin` `offset` property default value to better match conventional habits @huangchen1031 ([#3231](https://github.com/Tencent/tdesign-react/pull/3231))
- `Select`:
  - Fixed `collapsedItems` parameter `collapsedSelectedItems` error @RSS1102 ([#3214](https://github.com/Tencent/tdesign-react/pull/3214))
  - Fixed multi-select dropdown select all functionality failure @huangchen1031 ([#3216](https://github.com/Tencent/tdesign-react/pull/3216))
- `Table`:
  - Fixed filterable table handling `null` type abnormality @2ue ([#3197](https://github.com/Tencent/tdesign-react/pull/3197))
  - Fixed rendering abnormality when cell was number 0 and ellipsis was enabled @uyarn ([#3233](https://github.com/Tencent/tdesign-react/pull/3233))
- `Tree`: Fixed `scrollTo` method scroll abnormal behavior @uyarn ([#3235](https://github.com/Tencent/tdesign-react/pull/3235))
### 📝 Documentation
- `Dialog`: Fixed code example error @RSS1102 ([#3229](https://github.com/Tencent/tdesign-react/pull/3229))
### 🚧 Others
- `TextArea`: Optimized `TextArea` event types @HaixingOoO ([#3211](https://github.com/Tencent/tdesign-react/pull/3211))

## 🌈 1.10.0 `2024-11-15` 
### 🚀 Features
- `Select`: `collapsedItems` method parameter `collapsedSelectedItems` expanded to `options`. Those using `collapsedItems` should note this change ⚠️ @RSS1102 ([#3185](https://github.com/Tencent/tdesign-react/pull/3185))
- `Icon`: @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
  - Icon library released version `0.4.0`, added 907 new icons
  - Naming optimization, `blockchain` renamed to `transform-1`, `gesture-pray-1` renamed to `gesture-open`, `gesture-ranslation-1` renamed to `wave-bye`, `gesture-up-1` renamed to `gesture-typing`, `gesture-up-2` renamed to `gesture-right-slip`, `logo-wechat` renamed to `logo-wechat-stroke-filled`
  - Removed error icons like `tree-list`, `logo-adobe-photoshop-1`
- `Cascader`: In single-select mode when `trigger` was `hover`, automatically close panel after selecting option @uyarn ([#3188](https://github.com/Tencent/tdesign-react/pull/3188))
- `Checkbox`: Added `title` API for scenarios like showing disable reason @uyarn ([#3207](https://github.com/Tencent/tdesign-react/pull/3207))
- `Menu`: Added `tooltipProps` API acting on nodes appearing when first-level menu is collapsed and focused @uyarn ([#3201](https://github.com/Tencent/tdesign-react/pull/3201))
- `Switch`: Added `before-change` API @centuryPark ([#3167](https://github.com/Tencent/tdesign-react/pull/3167))
- `Form`: Added `getValidateMessage` instance method @moecasts ([#3180](https://github.com/Tencent/tdesign-react/pull/3180))
### 🐞 Bug Fixes
- `TagInput`: Fixed issue where selected options could still be deleted by Backspace key in `readonly` mode @RSS1102 ([#3172](https://github.com/Tencent/tdesign-react/pull/3172))
- `Form`: Fixed issue where `FormItem` had abnormality when `name` attribute was set outside `Form` in version `1.9.3` @l123wx ([#3183](https://github.com/Tencent/tdesign-react/pull/3183))
- `Select`: Fixed callback parameter type error when clicking select all button when valueType was object @l123wx ([#3193](https://github.com/Tencent/tdesign-react/pull/3193))
- `Table`: Fixed issue where child nodes weren't displayed normally when dynamically setting `expandTreeNode` @uyarn ([#3202](https://github.com/Tencent/tdesign-react/pull/3202))
- `Tree`: Fixed dynamic `expandAll` functionality abnormality @uyarn ([#3204](https://github.com/Tencent/tdesign-react/pull/3204))
- `Drawer`: Fixed issue where `confirmBtn` and `closeBtn` content couldn't be customized @RSS1102 ([#3191](https://github.com/Tencent/tdesign-react/pull/3191))
### 📝 Documentation
- `Icon`: Optimized icon search functionality to support Chinese and English icon search @uyarn ([#3194](https://github.com/Tencent/tdesign-react/pull/3194))
- `Popup`: Added `popperOption` usage example @HaixingOoO ([#3200](https://github.com/Tencent/tdesign-react/pull/3200))

## 🌈 1.9.3 `2024-10-31` 
### 🐞 Bug Fixes
- `Select`: Fixed `onClose` callback issue under `valueDisplay` @uyarn ([#3154](https://github.com/Tencent/tdesign-react/pull/3154))
- `Typography`: Fixed `Typography` `Ellipsis` functionality issue under Chinese @HaixingOoO ([#3158](https://github.com/Tencent/tdesign-react/pull/3158))
- `Form`: Fixed `FormList` or `FormItem` data `getFieldsValue` issue @HaixingOoO ([#3149](https://github.com/Tencent/tdesign-react/pull/3149))

## 🌈 1.9.2 `2024-10-17` 
### 🚀 Features
- `Form`: Added `setStatus` method to set form item status @moecasts ([#3120](https://github.com/Tencent/tdesign-react/pull/3120))
### 🐞 Bug Fixes
- `Grid`: Fixed `align-items` style issue in some cases @uyarn ([#3139](https://github.com/Tencent/tdesign-react/pull/3139))
- `Table`: Fixed fixed column alignment issue under virtual scrolling @haizw ([#3133](https://github.com/Tencent/tdesign-react/pull/3133))
- `ColorPicker`: Fixed transparent channel abnormality under some scenarios @uyarn ([#3140](https://github.com/Tencent/tdesign-react/pull/3140))
- `DatePicker`: Fixed panel abnormality when clicking close button in single-select mode @uyarn ([#3141](https://github.com/Tencent/tdesign-react/pull/3141))
- `Form`: Fixed data reset abnormality when using `reset` method with multi-level fields @moecasts ([#3143](https://github.com/Tencent/tdesign-react/pull/3143))
- `Calendar`: Fixed invalid date style issue when switching months @uyarn ([#3134](https://github.com/Tencent/tdesign-react/pull/3134))
- `Tree`: Fixed issue where `replaceNodes` triggered nodes to unexpectedly update @uyarn ([#3150](https://github.com/Tencent/tdesign-react/pull/3150))
- `TreeSelect`: Fixed filter functionality abnormality when `tree.checkStrictly` was true @uyarn ([#3151](https://github.com/Tencent/tdesign-react/pull/3151))
- `Textarea`: Fixed abnormality when inputting Chinese in fullscreen mode @uyarn ([#3153](https://github.com/Tencent/tdesign-react/pull/3153))
- `List`: Fixed scroll-to load abnormality when data was empty @uyarn ([#3156](https://github.com/Tencent/tdesign-react/pull/3156))
- `Calendar`: Fixed issue where cell click event wasn't triggered in cell mode @uyarn ([#3157](https://github.com/Tencent/tdesign-react/pull/3157))

## 🌈 1.9.1 `2024-09-26` 
### 🚀 Features
- `Upload`: Added `isBatchUpload` API @uyarn ([#3097](https://github.com/Tencent/tdesign-react/pull/3097))
- `Calendar`: Added `fillWithZero` API to support controlling whether to fill month and day with zero @Leeeahind ([#3103](https://github.com/Tencent/tdesign-react/pull/3103))
- `Tree`: Added `expandOnClick` API to control whether clicking node expands @uyarn ([#3104](https://github.com/Tencent/tdesign-react/pull/3104))
### 🐞 Bug Fixes
- `Grid`: Fixed align-items style issue in some cases @uyarn ([#3118](https://github.com/Tencent/tdesign-react/pull/3118))
- `Upload`: Fixed status abnormality in drag upload scenario @uyarn ([#3124](https://github.com/Tencent/tdesign-react/pull/3124))
- `Menu`: Fixed issue where `popupProps` couldn't be passed through to `SubMenu` @uyarn ([#3127](https://github.com/Tencent/tdesign-react/pull/3127))
- `Select`: Fixed issue where input box couldn't get focus when clicking selected option in multi-select mode @uyarn ([#3129](https://github.com/Tencent/tdesign-react/pull/3129))
- `Table`: Fixed pagination event handling abnormality under virtual scrolling @uyarn ([#3130](https://github.com/Tencent/tdesign-react/pull/3130))
- `Tree`: Fixed mouse event judgment issue when children were empty @uyarn ([#3131](https://github.com/Tencent/tdesign-react/pull/3131))
- `Form`: Fixed `getFieldsValue` functionality abnormality with multi-level fields @moecasts ([#3137](https://github.com/Tencent/tdesign-react/pull/3137))
- `DatePicker`: Fixed display abnormality after `select` value change @uyarn ([#3138](https://github.com/Tencent/tdesign-react/pull/3138))
- `ColorPicker`: Fixed issue where recently used colors couldn't be deleted @uyarn ([#3142](https://github.com/Tencent/tdesign-react/pull/3142))
- `Tree`: Fixed issue where index calculation was abnormal when nodes were deleted @uyarn ([#3143](https://github.com/Tencent/tdesign-react/pull/3143))

## 🌈 1.9.0 `2024-09-12` 
### 🚀 Features
- `AutoComplete`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Select`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `DatePicker`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TimePicker`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Cascader`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TreeSelect`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `ColorPicker`: Added `popupProps` API @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Table`: Added `empty` API to support customizing empty state content @uyarn ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
- `Swiper`: Added navigation animation effect for controlling switching between tabs @Leeeahind ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Dialog`: Added `closeOnOverlayKeydown` API @uyarn ([#3078](https://github.com/Tencent/tdesign-react/pull/3078))
- `Drawer`: Added `closeOnOverlayKeydown` API @uyarn ([#3078](https://github.com/Tencent/tdesign-react/pull/3078))
- `Menu`: Added `submenu` expand and collapse animation @haizw ([#3070](https://github.com/Tencent/tdesign-react/pull/3070))
- `Tabs`: Added `badge` API @uyarn ([#3073](https://github.com/Tencent/tdesign-react/pull/3073))
- `Table`: Added `onPageChange` callback parameter for pagination @uyarn ([#3075](https://github.com/Tencent/tdesign-react/pull/3075))
- `ImageViewer`: Added `closeOnOverlayKeydown` API @uyarn ([#3078](https://github.com/Tencent/tdesign-react/pull/3078))
- `Calendar`: Added `cellAppend` and `cell` APIs to support customizing cell content @Leeeahind ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Image`: Added `onError` callback @uyarn ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
- `DatePicker`: Added `allowSameDay` API to support selecting same day in range selection @uyarn ([#3069](https://github.com/Tencent/tdesign-react/pull/3069))
- `Select`: Added `filterable` API @uyarn ([#3063](https://github.com/Tencent/tdesign-react/pull/3063))
- `TreeSelect`: Added `filterable` API @uyarn ([#3063](https://github.com/Tencent/tdesign-react/pull/3063))
- `Cascader`: Added `filterable` API @uyarn ([#3063](https://github.com/Tencent/tdesign-react/pull/3063))
- `InputNumber`: Added `large` size @uyarn ([#3068](https://github.com/Tencent/tdesign-react/pull/3068))
- `Select`: Added `loading` state @uyarn ([#3072](https://github.com/Tencent/tdesign-react/pull/3072))
- `Table`: Added `onPageChange` callback parameter for pagination @uyarn ([#3075](https://github.com/Tencent/tdesign-react/pull/3075))
- `TimePicker`: Added `filter` method to support time filtering @uyarn ([#3076](https://github.com/Tencent/tdesign-react/pull/3076))
- `Dialog`: Added `mode-less` mode for dialogs without header and footer @uyarn ([#3077](https://github.com/Tencent/tdesign-react/pull/3077))
- `Upload`: Added `http-request` method to support customizing upload request method @uyarn ([#3080](https://github.com/Tencent/tdesign-react/pull/3080))
- `Form`: Added `status` API for `FormList` @uyarn ([#3082](https://github.com/Tencent/tdesign-react/pull/3082))
- `List`: Added `loading` and `asyncLoading` states @uyarn ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `ColorPicker`: Added `show-primary-color-preview` API @uyarn ([#3085](https://github.com/Tencent/tdesign-react/pull/3085))
### 🐞 Bug Fixes
- `AutoComplete`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Select`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `DatePicker`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TimePicker`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Cascader`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `TreeSelect`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `ColorPicker`: Fixed display abnormality when options were empty @uyarn ([#3089](https://github.com/Tencent/tdesign-react/pull/3089))
- `Table`: Fixed issue where empty state wasn't displayed when data was empty and `empty` wasn't set @uyarn ([#3095](https://github.com/Tencent/tdesign-react/pull/3095))
- `Swiper`: Fixed issue where autoplay state was abnormal when using navigation to switch tabs @Leeeahind ([#3084](https://github.com/Tencent/tdesign-react/pull/3084))
- `Dialog`: Fixed issue where close button couldn't be clicked when `closeOnEscKeydown` and `closeOnOverlay` were both false @uyarn ([#3078](https://github.com/Tencent/tdesign-react/pull/3078))
- `Drawer`: Fixed issue where close button couldn't be clicked when `closeOnEscKeydown` and `closeOnOverlay` were both false @uyarn ([#3078](https://github.com/Tencent/tdesign-react/pull/3078))
- `Menu`: Fixed submenu icon color abnormality when collapsed @haizw ([#3070](https://github.com/Tencent/tdesign-react/pull/3070))
- `Tabs`: Fixed issue where `badge` couldn't be displayed when `tab` was null @uyarn ([#3073](https://github.com/Tencent/tdesign-react/pull/3073))
- `Table`: Fixed pagination event handling abnormality under virtual scrolling @uyarn ([#3075](https://github.com/Tencent/tdesign-react/pull/3075))
- `ImageViewer`: Fixed issue where close button couldn't be clicked when `closeOnEscKeydown` and `closeOnOverlay` were both false @uyarn ([#3078](https://github.com/Tencent/tdesign-react/pull/3078))
- `Calendar`: Fixed style issue when customizing cell content @Leeeahind ([#3081](https://github.com/Tencent/tdesign-react/pull/3081))
- `Image`: Fixed error handling issue when using fallback @uyarn ([#3067](https://github.com/Tencent/tdesign-react/pull/3067))
- `DatePicker`: Fixed date selection abnormality when selecting same day in range selection @uyarn ([#3069](https://github.com/Tencent/tdesign-react/pull/3069))
- `Select`: Fixed multi-select tag deletion abnormality @uyarn ([#3063](https://github.com/Tencent/tdesign-react/pull/3063))
- `TreeSelect`: Fixed multi-select tag deletion abnormality @uyarn ([#3063](https://github.com/Tencent/tdesign-react/pull/3063))
- `Cascader`: Fixed multi-select tag deletion abnormality @uyarn ([#3063](https://github.com/Tencent/tdesign-react/pull/3063))
- `InputNumber`: Fixed style issue when `size` was `large` @uyarn ([#3068](https://github.com/Tencent/tdesign-react/pull/3068))
- `Select`: Fixed loading state abnormality @uyarn ([#3072](https://github.com/Tencent/tdesign-react/pull/3072))
- `TimePicker`: Fixed time filtering functionality abnormality @uyarn ([#3076](https://github.com/Tencent/tdesign-react/pull/3076))
- `Form`: Fixed `FormList` status abnormality @uyarn ([#3082](https://github.com/Tencent/tdesign-react/pull/3082))
- `List`: Fixed virtual scrolling abnormality @uyarn ([#3083](https://github.com/Tencent/tdesign-react/pull/3083))
- `ColorPicker`: Fixed primary color preview display abnormality @uyarn ([#3085](https://github.com/Tencent/tdesign-react/pull/3085))

## 🌈 1.8.1 `2024-08-23` 
### 🚀 Features
- `Dialog`: Added `header` and `footer` slots for easy content customization @uyarn ([#3049](https://github.com/Tencent/tdesign-react/pull/3049))
- `Swiper`: Added `type` and `animation` effects for rich switching effects @Leeeahind ([#3055](https://github.com/Tencent/tdesign-react/pull/3055))
- `Table`: Added `onRowMouseUp`, `onRowMouseDown`, `onRowMouseEnter`, `onRowMouseLeave` events @uyarn ([#3057](https://github.com/Tencent/tdesign-react/pull/3057))
### 🐞 Bug Fixes
- `Drawer`: Fixed height inheritance issue @uyarn ([#3058](https://github.com/Tencent/tdesign-react/pull/3058))
- `Image`: Fixed issue where events couldn't be triggered after multiple fast clicks @uyarn ([#3059](https://github.com/Tencent/tdesign-react/pull/3059))
- `Affix`: Fixed container calculation issue @uyarn ([#3060](https://github.com/Tencent/tdesign-react/pull/3060))
- `Select`: Fixed issue where placeholder wasn't cleared after selecting value in filterable mode @uyarn ([#3061](https://github.com/Tencent/tdesign-react/pull/3061))
- `Table`: Fixed virtual scrolling `dataChange` triggering abnormality @uyarn ([#3062](https://github.com/Tencent/tdesign-react/pull/3062))
- `Drawer`: Fixed `confirmLoading` abnormality @uyarn ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `DatePicker`: Fixed month panel style issue @uyarn ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Form`: Fixed form validation error in disabled state @uyarn ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))
- `Tree`: Fixed node deletion causing abnormal scroll position @uyarn ([#3070](https://github.com/Tencent/tdesign-react/pull/3070))
- `TagInput`: Fixed tag deletion event abnormality @uyarn ([#3071](https://github.com/Tencent/tdesign-react/pull/3071))

## 🌈 1.8.0 `2024-08-22` 
### 🚀 Features
- `Typography`: Added `Typography` component @insekkei ([#3020](https://github.com/Tencent/tdesign-react/pull/3020))
- `Input`: Added `align` API @uyarn ([#3025](https://github.com/Tencent/tdesign-react/pull/3025))
- `Select`: Added `panelBottomContent` API for customizing bottom content of popup panel @uyarn ([#3033](https://github.com/Tencent/tdesign-react/pull/3033))
- `DatePicker`: Added `panelBottomContent` API for customizing bottom content of popup panel @uyarn ([#3033](https://github.com/Tencent/tdesign-react/pull/3033))
- `TimePicker`: Added `panelBottomContent` API for customizing bottom content of popup panel @uyarn ([#3033](https://github.com/Tencent/tdesign-react/pull/3033))
- `InputNumber`: Added `large` size @uyarn ([#3038](https://github.com/Tencent/tdesign-react/pull/3038))
- `TreeSelect`: Added `panelBottomContent` API for customizing bottom content of popup panel @uyarn ([#3033](https://github.com/Tencent/tdesign-react/pull/3033))
- `ColorPicker`: Added `panelBottomContent` API for customizing bottom content of popup panel @uyarn ([#3033](https://github.com/Tencent/tdesign-react/pull/3033))
- `Cascader`: Added `panelBottomContent` API for customizing bottom content of popup panel @uyarn ([#3033](https://github.com/Tencent/tdesign-react/pull/3033))
- `Table`: Added `onRowMouseUp`, `onRowMouseDown`, `onRowMouseEnter`, `onRowMouseLeave` events @uyarn ([#3057](https://github.com/Tencent/tdesign-react/pull/3057))
- `Swiper`: Added `onChange` and `onAnimationStart` callbacks @Leeeahind ([#3045](https://github.com/Tencent/tdesign-react/pull/3045))
- `Watermark`: Added `watermarkContent` slot for customizing watermark content @uyarn ([#3047](https://github.com/Tencent/tdesign-react/pull/3047))
- `Dialog`: Added `header` and `footer` slots for easy content customization @uyarn ([#3049](https://github.com/Tencent/tdesign-react/pull/3049))
- `Calendar`: Added `cellAppend` and `cell` APIs to support customizing cell content @Leeeahind ([#3050](https://github.com/Tencent/tdesign-react/pull/3050))
- `Tree`: Added `onRowMouseUp`, `onRowMouseDown`, `onRowMouseEnter`, `onRowMouseLeave` events @uyarn ([#3057](https://github.com/Tencent/tdesign-react/pull/3057))
- `List`: Added `onRowMouseUp`, `onRowMouseDown`, `onRowMouseEnter`, `onRowContentMouseEnter`, `onRowContentMouseLeave`, `onRowMouseLeave` events @uyarn ([#3057](https://github.com/Tencent/tdesign-react/pull/3057))
### 🐞 Bug Fixes
- `Grid`: Fixed `align-items` style issue in some cases @uyarn ([#3028](https://github.com/Tencent/tdesign-react/pull/3028))
- `InputNumber`: Fixed style issue when `size` was `large` @uyarn ([#3038](https://github.com/Tencent/tdesign-react/pull/3038))
- `Table`: Fixed virtual scrolling data change triggering abnormality @uyarn ([#3062](https://github.com/Tencent/tdesign-react/pull/3062))
- `Drawer`: Fixed `confirmLoading` abnormality @uyarn ([#3064](https://github.com/Tencent/tdesign-react/pull/3064))
- `DatePicker`: Fixed month panel style issue @uyarn ([#3065](https://github.com/Tencent/tdesign-react/pull/3065))
- `Form`: Fixed form validation error in disabled state @uyarn ([#3066](https://github.com/Tencent/tdesign-react/pull/3066))
- `Tree`: Fixed node deletion causing abnormal scroll position @uyarn ([#3070](https://github.com/Tencent/tdesign-react/pull/3070))
- `TagInput`: Fixed tag deletion event abnormality @uyarn ([#3071](https://github.com/Tencent/tdesign-react/pull/3071))
- `Dialog`: Fixed `onConfirm` parameter error when `mode` was `default` and using `Plugin` usage @uyarn ([#3030](https://github.com/Tencent/tdesign-react/pull/3030))
- `Image`: Fixed issue where overlay didn't disappear when clicking overlay to close in modeless @uyarn ([#3031](https://github.com/Tencent/tdesign-react/pull/3031))
- `Select`: Fixed selection event abnormality in virtual scrolling mode @uyarn ([#3032](https://github.com/Tencent/tdesign-react/pull/3032))
- `Table`: Fixed editable table validation trigger abnormality @uyarn ([#3034](https://github.com/Tencent/tdesign-react/pull/3034))
- `Tree`: Fixed virtual scrolling data change triggering abnormality @uyarn ([#3062](https://github.com/Tencent/tdesign-react/pull/3062))
- `List`: Fixed scroll-to load abnormality when data was empty @uyarn ([#3035](https://github.com/Tencent/tdesign-react/pull/3035))

## 🌈 1.7.9 `2024-08-07` 
### 🐞 Bug Fixes
- `InputNumber`: Fixed issue where large numbers couldn't be input normally @uyarn ([#2991](https://github.com/Tencent/tdesign-react/pull/2991))
- `Table`: Fixed selectable table style issue @uyarn ([#2992](https://github.com/Tencent/tdesign-react/pull/2992))
- `TreeSelect`: Fixed issue where enter couldn't submit when filter was enabled @uyarn ([#2995](https://github.com/Tencent/tdesign-react/pull/2995))
- `Tree`: Fixed filter abnormality when `keys.children` was configured @uyarn ([#2996](https://github.com/Tencent/tdesign-react/pull/2996))
- `DatePicker`: Fixed year panel invalid date style issue @uyarn ([#2999](https://github.com/Tencent/tdesign-react/pull/2999))
- `Form`: Fixed form validation abnormality when `disabled` was true @uyarn ([#3000](https://github.com/Tencent/tdesign-react/pull/3000))

## 🌈 1.7.8 `2024-08-01` 
### 🐞 Bug Fixes
- `Table`: Fixed issue where event callback missing `selectData` parameter @uyarn ([#2983](https://github.com/Tencent/tdesign-react/pull/2983))
- `Select`: Fixed issue where focus couldn't be obtained by clicking selected option in multi-select mode @uyarn ([#2984](https://github.com/Tencent/tdesign-react/pull/2984))
- `TreeSelect`: Fixed issue where selected options text color was abnormal in filter mode @uyarn ([#2986](https://github.com/Tencent/tdesign-react/pull/2986))
- `DatePicker`: Fixed date selection abnormality after `enableTimePicker` was enabled @uyarn ([#2987](https://github.com/Tencent/tdesign-react/pull/2987))
- `InputNumber`: Fixed step operation value abnormality @uyarn ([#2988](https://github.com/Tencent/tdesign-react/pull/2988))
- `Tree`: Fixed line-through style abnormality for disabled nodes @uyarn ([#2989](https://github.com/Tencent/tdesign-react/pull/2989))
- `Form`: Fixed form validation trigger abnormality @uyarn ([#2990](https://github.com/Tencent/tdesign-react/pull/2990))

## 🌈 1.7.7 `2024-07-18` 
### 🚀 Features
- `Table`: Added `title` and `col` configuration for customizing column group content and column configuration @uyarn ([#2964](https://github.com/Tencent/tdesign-react/pull/2964))
- `Form`: Added `resetType` API to control reset behavior @uyarn ([#2967](https://github.com/Tencent/tdesign-react/pull/2967))
### 🐞 Bug Fixes
- `DatePicker`: Fixed panel height adaptation issue when time picker was enabled @uyarn ([#2968](https://github.com/Tencent/tdesign-react/pull/2968))
- `Form`: Fixed form validation trigger abnormality @uyarn ([#2970](https://github.com/Tencent/tdesign-react/pull/2970))
- `Select`: Fixed multi-select dropdown collapse display abnormality @uyarn ([#2972](https://github.com/Tencent/tdesign-react/pull/2972))
- `TagInput`: Fixed selected item display abnormality when hovering @uyarn ([#2973](https://github.com/Tencent/tdesign-react/pull/2973))
- `Tree`: Fixed expand icon click abnormality @uyarn ([#2975](https://github.com/Tencent/tdesign-react/pull/2975))
- `TreeSelect`: Fixed multi-select dropdown display abnormality @uyarn ([#2976](https://github.com/Tencent/tdesign-react/pull/2976))
- `Table`: Fixed virtual scrolling data change triggering abnormality @uyarn ([#2978](https://github.com/Tencent/tdesign-react/pull/2978))
- `Image`: Fixed overlay event abnormality @uyarn ([#2980](https://github.com/Tencent/tdesign-react/pull/2980))
- `Textarea`: Fixed issue where clear button couldn't be clicked in readonly mode @uyarn ([#2981](https://github.com/Tencent/tdesign-react/pull/2981))
- `TagInput`: Fixed tag deletion event abnormality @uyarn ([#2982](https://github.com/Tencent/tdesign-react/pull/2982))

## 🌈 1.7.6 `2024-06-27` 
### 🚀 Features
- `Calendar`: Added `fillWithZero` API to support controlling whether to fill month and day with zero @Leeeahind ([#2939](https://github.com/Tencent/tdesign-react/pull/2939))
- `Upload`: Added `useCache` API to support controlling whether to use cache for temporary images @uyarn ([#2941](https://github.com/Tencent/tdesign-react/pull/2941))
### 🐞 Bug Fixes
- `Form`: Fixed `resetType` configuration ineffective issue @uyarn ([#2953](https://github.com/Tencent/tdesign-react/pull/2953))
- `InputNumber`: Fixed large number input abnormality @uyarn ([#2954](https://github.com/Tencent/tdesign-react/pull/2954))
- `Table`: Fixed column configuration functionality abnormality @uyarn ([#2955](https://github.com/Tencent/tdesign-react/pull/2955))
- `Tree`: Fixed node filtering abnormality when `keys.children` was configured @uyarn ([#2956](https://github.com/Tencent/tdesign-react/pull/2956))
- `TagInput`: Fixed tag dragging abnormality @uyarn ([#2958](https://github.com/Tencent/tdesign-react/pull/2958))
- `DatePicker`: Fixed panel height adaptation issue when time picker was enabled @uyarn ([#2961](详细的](https://github.com/Tencent/tdesign-react/pull/2961))...

## 🌈 1.7.0 `2024-04-25` 
### 🚀 Features
- `Typography`: Added `Typography` typography component @insekkei ([#2821](https://github.com/Tencent/tdesign-react/pull/2821))
### 🐞 Bug Fixes
- `Table`: When executing data retrieval and updates in `effect` asynchrony, it might cause some bugs @HaixingOoO ([#2848](https://github.com/Tencent/tdesign-react/pull/2848))
- `DatePicker`: Fixed abnormality where month selection jumped to initial state in date picker @uyarn ([#2854](https://github.com/Tencent/tdesign-react/pull/2854))
- `Form`: `useWatch` in certain cases, different `name` caused view issues @HaixingOoO ([#2853](https://github.com/Tencent/tdesign-react/pull/2853))
- `Drawer`: Fixed `1.6.0` closeBtn property default value loss @uyarn ([#2856](https://github.com/Tencent/tdesign-react/pull/2856))
- `Dropdown`: Fixed issue where overlay was still displayed when option length was empty @uyarn ([#2860](https://github.com/Tencent/tdesign-react/pull/2860))
- `Dropdown`: Optimized `Dropdown` `children` pass-through `disabled` @HaixingOoO ([#2862](https://github.com/Tencent/tdesign-react/pull/2862))
- `SelectInput`: Fixed issue where uncontrolled property `defaultPopupVisible` did not work @uyarn ([#2861](https://github.com/Tencent/tdesign-react/pull/2861))
- `Style`: Fixed issue where some node prefixes could not be uniformly replaced @ZWkang  @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))
- `Upload`: Fixed `method` enum value `options` error @summer-shen @uyarn ([#2863](https://github.com/Tencent/tdesign-react/pull/2863))

## 🌈 1.6.0 `2024-04-11` 
### 🚀 Features
- `Portal`: `Portal` added lazy loading `forceRender`, default is `lazy` mode, optimized performance, compatible with `SSR` rendering, potentially has breaking impact on `Dialog` and `Drawer` components ⚠️ @HaixingOoO ([#2826](https://github.com/Tencent/tdesign-react/pull/2826))
### 🐞 Bug Fixes
- `ImageViewer`: Fixed issue where `imageReferrerpolicy` did not affect top thumbnail @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))
- `Descriptions`: Fixed issue where `props` lacked `className` and `style` properties @HaixingOoO ([#2818](https://github.com/Tencent/tdesign-react/pull/2818))
- `Layout`: Fixed page layout jump when adding `Aside` @HaixingOoO ([#2824](https://github.com/Tencent/tdesign-react/pull/2824))
- `Input`: Fixed issue where event bubbling was not prevented in `React16` version @HaixingOoO ([#2833](https://github.com/Tencent/tdesign-react/pull/2833))
- `DatePicker`: Fixed issue where Date type and week selector were abnormal after version `1.5.3` @uyarn ([#2841](https://github.com/Tencent/tdesign-react/pull/2841))
- `Guide`:  
     - Optimized usage in `SSR` @HaixingOoO ([#2842](https://github.com/Tencent/tdesign-react/pull/2842))
     - Fixed component initialization rendering position abnormality in SSR scenario @uyarn ([#2832](https://github.com/Tencent/tdesign-react/pull/2832))
- `Scroll`: Fixed style abnormality of `Table`, `Select` and some components with scrollbars caused by Chrome 121 version supporting scroll width @loopzhou ([common#1765](https://github.com/Tencent/tdesign-vue/pull/1765)) @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Locale`: Optimized language pack for some `DatePicker` modes @uyarn ([#2843](https://github.com/Tencent/tdesign-react/pull/2843))
- `Tree`: Fixed issue where `draggable` property lost responsiveness after initialization @Liao-js ([#2838](https://github.com/Tencent/tdesign-react/pull/2838))
- `Style`: Supported packaging styles through `less` main entry @NWYLZW @uyarn ([common#1757](https://github.com/Tencent/tdesign-common/pull/1757)) ([common#1766](https://github.com/Tencent/tdesign-common/pull/1766))


## 🌈 1.5.5 `2024-03-28` 
### 🐞 Bug Fixes
- `ImageViewer`: Fixed issue where `imageReferrerpolicy` did not affect top thumbnail @uyarn ([#2815](https://github.com/Tencent/tdesign-react/pull/2815))

## 🌈 1.5.4 `2024-03-28` 
### 🚀 Features
- `ImageViewer`: Added `imageReferrerpolicy` API to support scenarios needing Referrerpolicy configuration配合 with Image component @uyarn ([#2813](https://github.com/Tencent/tdesign-react/pull/2813))
### 🐞 Bug Fixes
- `Select`: Fixed issue where `onRemove` event was not triggered normally @Ali-ovo ([#2802](https://github.com/Tencent/tdesign-react/pull/2802))
- `Skeleton`: Fixed issue where `children` was required type @uyarn ([#2805](https://github.com/Tencent/tdesign-react/pull/2805))
- `Tabs`: Provided `action` area default style @HaixingOoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Locale`: Fixed English language pack abnormality for `image` and `imageViewer` @uyarn  @HaixingOoO ([#2808](https://github.com/Tencent/tdesign-react/pull/2808))
- `Image`: `referrerpolicy` parameter was incorrectly passed to outer `div`, actual target should be native `image` tag @NWYLZW ([#2811](https://github.com/Tencent/tdesign-react/pull/2811))

## 🌈 1.5.3 `2024-03-14` 
### 🚀 Features
- `BreadcrumbItem`: Support `onClick` event @HaixingOoO ([#2795](https://github.com/Tencent/tdesign-react/pull/2795))
- `Tag`: Component added `color` API to support custom colors @maoyiluo  @uyarn ([#2799](https://github.com/Tencent/tdesign-react/pull/2799))
### 🐞 Bug Fixes
- `FormList`: Fixed issue where multiple components were stuck @HaixingOoO ([#2788](https://github.com/Tencent/tdesign-react/pull/2788))
- `DatePicker`: Fixed calculation error when `format` and `valueType` were inconsistent @uyarn ([#2798](https://github.com/Tencent/tdesign-react/pull/2798))
### 🚧 Others
- `Portal`: Added Portal test cases @HaixingOoO ([#2791](https://github.com/Tencent/tdesign-react/pull/2791))
- `List`: Improved List test cases @HaixingOoO ([#2792](https://github.com/Tencent/tdesign-react/pull/2792))
- `Alert`: Improved Alert tests, optimized code @HaixingOoO ([#2793](https://github.com/Tencent/tdesign-react/pull/2793))

## 🌈 1.5.2 `2024-02-29` 
### 🚀 Features
- `Cascader`: Added `valueDisplay` and `label` API support @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Descriptions`: Component supports nesting @HaixingOoO ([#2777](https://github.com/Tencent/tdesign-react/pull/2777))
- `Tabs`: Adjusted activated `Tab` underline and `TabHeader` border hierarchy relationship @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
### 🐞 Bug Fixes
- `Grid`: Size calculation error, width compatibility abnormality @NWYLZW ([#2738](https://github.com/Tencent/tdesign-react/pull/2738))
- `Cascader`: Fixed issue where `clearable` clicking clear button triggered `onChange` three times @HaixingOoO ([#2736](https://github.com/Tencent/tdesign-react/pull/2736))
- `Dialog`: Fixed `useDialogPosition` rendering multiple binding events @HaixingOoO ([#2749](https://github.com/Tencent/tdesign-react/pull/2749))
- `Guide`: Fixed custom content functionality failure @zhangpaopao0609 ([#2752](https://github.com/Tencent/tdesign-react/pull/2752))
- `Tree`: Fixed issue where expand icon did not change normally after setting `keys.children` @uyarn ([#2746](https://github.com/Tencent/tdesign-react/pull/2746))
- `Tree`: Fixed `Tree` custom label `setData` rendering issue @HaixingOoO ([#2776](https://github.com/Tencent/tdesign-react/pull/2776))
- `Tree`: Fixed issue where `TreeItem` `checkbox` was compressed when setting `Tree` width, and `label` ellipsis failure @HaixingOoO  @uyarn ([#2780](https://github.com/Tencent/tdesign-react/pull/2780))
- `Select`: @uyarn 
    - Fixed scroll behavior abnormality after selecting options via scroll loading ([#2779](https://github.com/Tencent/tdesign-react/pull/2779))
    - Fixed virtual scrolling functionality abnormality when using `size` API ([#2756](https://github.com/Tencent/tdesign-react/pull/2756))

## 🌈 1.5.1 `2024-01-25` 
### 🚀 Features
- `Popup`: Support using `Plugin` method @HaixingOoO ([#2717](https://github.com/Tencent/tdesign-react/pull/2717))
- `Transfer`: Support `direction` API @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Tabs`: Added `action` API to support customizing right area @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
### 🐞 Bug Fixes
- `Pagination`: `Jump to` adjusted to uppercase to maintain consistency @wangyewei ([#2716](https://github.com/Tencent/tdesign-react/pull/2716))
- `Table`: Fixed issue where `Form` form in `Modal` using `shouldUpdate`卸载 could sometimes not find form methods @duxphp ([#2675](https://github.com/Tencent/tdesign-react/pull/2675))
- `Table`: Column width adjustment and row expansion scenarios, fixed issue where row expansion reset column width adjustment results @chaishi ([#2722](https://github.com/Tencent/tdesign-react/pull/2722))
- `Select`: Fixed scrolling issue of selected content in multi-select state @HaixingOoO ([#2721](https://github.com/Tencent/tdesign-react/pull/2721))
- `Transfer`: Fixed `disabled` API functionality abnormality @uyarn ([#2727](https://github.com/Tencent/tdesign-react/pull/2727))
- `Swiper`: Fixed order confusion when switching carousel animation to left @HaixingOoO ([#2725](https://github.com/Tencent/tdesign-react/pull/2725))
- `Form`: Fixed calculation issue with `^` character @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `Loading`: Fixed issue where `z-index` default value was not set @betavs ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))
- `CheckTag`: Fixed issue where setting `className` would overwrite all existing class names @uyarn ([#2730](https://github.com/Tencent/tdesign-react/pull/2730))
- `TreeSelect`: Fixed `onEnter` event not triggering @uyarn ([#2731](https://github.com/Tencent/tdesign-react/pull/2731))
- `Menu`: Fixed `collapsed` `scroll` style @Except10n ([#2718](https://github.com/Tencent/tdesign-react/pull/2718))
- `Cascader`: Fixed style abnormality in `Safari` when option list was long @uyarn ([#2728](https://github.com/Tencent/tdesign-react/pull/2728))

## 🌈 1.5.0 `2024-01-11` 
### 🚨 Breaking Changes
- `Dialog`: This version fixed incorrect mounting of `className`. Now `className` will only be mounted to upper container element Context of `Dialog`. If you need to directly modify `Dialog` body styles, you can switch to using `dialogClassName` for modification.
### 🚀 Features
- `Descriptions`: Added `Descriptions` description component @HaixingOoO ([#2706](https://github.com/Tencent/tdesign-react/pull/2706))
- `Dialog`: Added `dialogClassName` for handling internal dialog node styles. It is recommended that users who previously modified dialog body styles through `className` switch to using `dialogClassName` @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
### 🐞 Bug Fixes
- `Cascader`: Fixed Cascader `trigger=hover` after filtering, selection operation abnormal bug @HaixingOoO ([#2702](https://github.com/Tencent/tdesign-react/pull/2702))
- `Upload`: Fixed Upload `uploadFilePercent` type undefined @betavs ([#2703](https://github.com/Tencent/tdesign-react/pull/2703))
- `Dialog`: Fixed multiple node mounting errors of Dialog `className`, `className` will only be mounted to ctx element @NWYLZW ([#2639](https://github.com/Tencent/tdesign-react/pull/2639))
- `TreeSelect`: Fixed `suffixIcon` error and added related examples @Ali-ovo ([#2692](https://github.com/Tencent/tdesign-react/pull/2692))

## 🌈 1.4.3 `2024-01-02` 
### 🐞 Bug Fixes
- `AutoComplete`: Fixed issue where pressing Enter when `ActiveIndex=-1` had no match caused error @Ali-ovo ([#2300](https://github.com/Tencent/tdesign-react/pull/2300))
- `Cascader`: Fixed `1.4.2` Cascader single-select filter selection defect @HaixingOoO ([#2700](https://github.com/Tencent/tdesign-react/pull/2700))


## 🌈 1.4.2 `2023-12-28` 
### 🚀 Features
- `Card`: Added `LoadingProps` property @HaixingOoO ([#2677](https://github.com/Tencent/tdesign-react/pull/2677))
- `DatePicker`: `DateRangePicker` added `cancelRangeSelectLimit` to support not limiting RangePicker selection前后 range @uyarn ([#2684](https://github.com/Tencent/tdesign-react/pull/2684))
- `Space`: No longer render a child element when elements are empty @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - Added support for using `uploadPastedFiles` to paste and upload files
  - File input type upload component, added class name `t-upload--theme-file-input`
  - Added support for `uploadPastedFiles`, indicating allow paste upload files
  - Added `cancelUploadButton` and `uploadButton`, supporting custom upload and cancel upload buttons
  - Added `imageViewerProps`, passing all properties of image preview component 
  - Added `showImageFileName`, for controlling whether to display image name
  - Supported passing non-array form as default value
  - Supported `fileListDisplay=null` to hide file list; and added more complete `fileListDisplay` parameter for customizing UI
### 🐞 Bug Fixes
- `Table`: When asynchronously getting latest tree structure data, prioritize using `window.requestAnimationFrame` function to prevent screen flicker @lazybonee ([#2668](https://github.com/Tencent/tdesign-react/pull/2668))
- `Table`: Fixed issue where filter icon could not highlight when filter value was `0/false` @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
- `Cascader`: Fixed abnormal bug when performing selection and clearing content after component filtering @HaixingOoO ([#2674](https://github.com/Tencent/tdesign-react/pull/2674))
- `ColorPicker`: Global setting `border-box` caused color list style issues @carolin913
- `Pagination`: Changed total unit from `项` to `条` to maintain content consistency @dinghuihua ([#2679](https://github.com/Tencent/tdesign-react/pull/2679))
- `InputNumber`: Fixed `min=0` or `max=0` limit invalid issue @chaishi ([#2352](https://github.com/Tencent/tdesign-react/pull/2352))
- `Watermark`: Fixed inline style caused unable to use sticky positioning @carolin913 ([#2685](https://github.com/Tencent/tdesign-react/pull/2685))
- `Calendar`: Fixed card mode not properly displaying week information defect @uyarn ([#2686](https://github.com/Tencent/tdesign-react/pull/2686))
- `Upload`: @chaishi ([#2671](https://github.com/Tencent/tdesign-react/pull/2671))
  - Fixed issue where upload progress could not be updated during manual upload
  - Fixed `uploadFilePercent` parameter type issue
    
## 🌈 1.4.1 `2023-12-14` 
### 🚀 Features
- `Radio`: Support selecting options with Space key @liweijie0812 ([#2638](https://github.com/Tencent/tdesign-react/pull/2638))
- `Dropdown`: Removed special styling handling for left items @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
### 🐞 Bug Fixes
- `AutoComplete`: Fixed error issues when matching some special characters @ZWkang ([#2631](https://github.com/Tencent/tdesign-react/pull/2631))
- `DatePicker`: 
  - Fixed flickering issue when clicking clear button on date @HaixingOoO ([#2641](https://github.com/Tencent/tdesign-react/pull/2641))
  - Fixed issue where suffix icon color changed after date selection was disabled @HaixingOoO  @uyarn ([#2663](https://github.com/Tencent/tdesign-react/pull/2663))
  - Fixed issue where clicking component edge when disabled could still show `Panel` @Zz-ZzzZ ([#2653](https://github.com/Tencent/tdesign-react/pull/2653))
- `Dropdown`: Fixed issue where disabled dropdown menu could be clicked @betavs ([#2648](https://github.com/Tencent/tdesign-react/pull/2648))
- `DropdownItem`: Fixed missing `Divider` type @uyarn ([#2649](https://github.com/Tencent/tdesign-react/pull/2649))
- `Popup`: Fixed issue where `disabled` property was not effective @uyarn ([#2665](https://github.com/Tencent/tdesign-react/pull/2665))
- `Select`: Fixed abnormal trigger of `InputChange` event on blur @uyarn ([#2664](https://github.com/Tencent/tdesign-react/pull/2664))
- `SelectInput`: Fixed popup content width calculation issue @HaixingOoO ([#2647](https://github.com/Tencent/tdesign-react/pull/2647))
- `ImageViewer`: Added default zoom ratio for image preview and option to trigger close event on ESC key press @HaixingOoO ([#2652](https://github.com/Tencent/tdesign-react/pull/2652))
- `Table`: @chaishi
    - Fixed issue where tree nodes in `EnhancedTable` could not expand properly ([#2661](https://github.com/Tencent/tdesign-react/pull/2661))
    - Fixed issue where tree nodes could not expand in virtual scrolling scenario ([#2659](https://github.com/Tencent/tdesign-react/pull/2659))

## 🌈 1.4.0 `2023-11-30`
### 🚀 Features
- `Space`: Added support for component spacing rendering in legacy browsers @chaishi ([#2602](https://github.com/Tencent/tdesign-react/pull/2602))
- `Statistic`: Added statistical value component @HaixingOoO ([#2596](https://github.com/Tencent/tdesign-react/pull/2596))
### 🐞 Bug Fixes
- `ColorPicker`: Fixed issue where adjusting transparency was ineffective when `format` was `hex` with `enableAlpha` @uyarn ([#2628](https://github.com/Tencent/tdesign-react/pull/2628))
- `ColorPicker`: Fixed issue where slider button color above color picker didn't change @HaixingOoO ([#2615](https://github.com/Tencent/tdesign-react/pull/2615))
- `Table`: Fixed `lazyLoad` lazy loading effect @chaishi ([#2605](https://github.com/Tencent/tdesign-react/pull/2605))
- `Tree`: 
    - Fixed style abnormality caused by incorrect `open class` state control logic for tree component nodes @NWYLZW ([#2611](https://github.com/Tencent/tdesign-react/pull/2611))
    - `key` and `index` in API for scrolling to specific node should be optional @uyarn ([#2626](https://github.com/Tencent/tdesign-react/pull/2626))
- `Drawer`: Fixed issue where when `mode` was `push`, the pushed content area was the drawer node's parent node @HaixingOoO ([#2614](https://github.com/Tencent/tdesign-react/pull/2614))
- `Radio`: Fixed issue where form `disabled` was not effective on `Radio` @li-jia-nan ([#2397](https://github.com/Tencent/tdesign-react/pull/2397))
- `Pagination`: Fixed issue where `current` value became 0 when `total` was 0 and `pageSize` changed @betavs ([#2624](https://github.com/Tencent/tdesign-react/pull/2624))
- `Image`: Fixed issue where images didn't trigger native events in SSR mode @HaixingOoO ([#2616](https://github.com/Tencent/tdesign-react/pull/2616))

## 🌈 1.3.1 `2023-11-15` 
### 🚀 Features
- `Upload`: In drag-and-drop upload scenario, trigger `drop` event even when file type is incorrect @chaishi ([#2591](https://github.com/Tencent/tdesign-react/pull/2591))
### 🐞 Bug Fixes
- `Tree`: 
    - Fixed issue where `onClick` event could be triggered without adding `activable` parameter @HaixingOoO ([#2568](https://github.com/Tencent/tdesign-react/pull/2568))
    - Fixed issue where linkage between editable components in editable table was not effective @HaixingOoO ([#2572](https://github.com/Tencent/tdesign-react/pull/2572))
- `Notification`: 
    - Fixed issue where popping two `Notification`s consecutively, only one was actually displayed the first time @HaixingOoO ([#2595](https://github.com/Tencent/tdesign-react/pull/2595))
    - Fixed warning when using `flushSync` in `useEffect`, now using loop `setTimeout` to handle @HaixingOoO ([#2597](https://github.com/Tencent/tdesign-react/pull/2597))
- `Dialog`: 
    - Fixed issue where cursor jumped to end when typing in middle of `Input` component introduced in `Dialog` @HaixingOoO ([#2485](https://github.com/Tencent/tdesign-react/pull/2485))
    - Fixed issue where dialog header title display affected cancel button position @HaixingOoO ([#2593](https://github.com/Tencent/tdesign-react/pull/2593))
- `Popup`: Fixed missing type issue for `PopupRef` @Ricinix ([#2577](https://github.com/Tencent/tdesign-react/pull/2577))
- `Tabs`: Fixed issue where clicking activated tab repeatedly still triggered `onChange` event @HaixingOoO ([#2588](https://github.com/Tencent/tdesign-react/pull/2588))
- `Radio`: Display Radio.Button according to corresponding variant @NWYLZW ([#2589](https://github.com/Tencent/tdesign-react/pull/2589))
- `Input`: Fixed abnormal behavior when setting maximum length and backspacing @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Link`: Fixed issue where front and back icons were not vertically centered @uyarn ([#2598](https://github.com/Tencent/tdesign-react/pull/2598))
- `Select`: Fixed issue with `inputchange` event context parameter @uyarn ([#2600](https://github.com/Tencent/tdesign-react/pull/2600))
- `DatePicker`: Fixed issue where `PaginationMini` was not updated causing abnormal switching behavior @Ricinix ([#2587](https://github.com/Tencent/tdesign-react/pull/2587))
- `Form`: Fixed infinite loop caused by setFields triggering onValuesChange @honkinglin ([#2570](https://github.com/Tencent/tdesign-react/pull/2570))

## 🌈 1.3.0 `2023-10-19` 
### 🚀 Features
- `TimelineItem`: Added click event @Zzongke ([#2545](https://github.com/Tencent/tdesign-react/pull/2545))
- `Tag`: @chaishi ([#2524](https://github.com/Tencent/tdesign-react/pull/2524))
    - Support multiple style tag configurations
    - Support use of tag group `CheckTagGroup`, see example documentation for details
### 🐞 Bug Fixes
- `locale`: Added missing it_IT, ru_RU, zh_TW locales @Zzongke ([#2542](https://github.com/Tencent/tdesign-react/pull/2542))
- `Cascader`: Issue with `source` in `change` event @betavs ([#2544](https://github.com/Tencent/tdesign-react/pull/2544))
- `Tree`: Fixed display result of filtered nodes when `allowFoldNodeOnFilter` is true @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TagInput`: Fixed issue where deleting filter text when there was only one option would accidentally delete selected option @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `TreeSelect`: Adjusted interaction behavior after filtering options to maintain consistency with other implementation frameworks @uyarn ([#2552](https://github.com/Tencent/tdesign-react/pull/2552))
- `Rate`: Fixed issue where multiple texts displayed when mouse moved quickly @Jon-Millent ([#2551](https://github.com/Tencent/tdesign-react/pull/2551))

## 🌈 1.2.6 `2023-09-28` 
### 🚀 Features
- `Table`: Optimized rendering count @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Card`: `title` uses `div` instead of `span` to better conform to specifications in custom scenarios @uyarn ([#2517](https://github.com/Tencent/tdesign-react/pull/2517))
- `Tree`: Support scrolling to specific position by matching single value with key, refer to example code for specific usage @uyarn ([#2519](https://github.com/Tencent/tdesign-react/pull/2519))
### 🐞 Bug Fixes
- `Form`: Fixed formList nested data retrieval exception @honkinglin ([#2529](https://github.com/Tencent/tdesign-react/pull/2529))
- `Table`: Fixed `rowspanAndColspan` rendering issue when data switched @chaishi ([#2514](https://github.com/Tencent/tdesign-react/pull/2514))
- `Cascader`: hover on parent node without child node data didn't update child nodes @betavs ([#2528](https://github.com/Tencent/tdesign-react/pull/2528))
- `DatePicker`: Fixed month switching failure issue @honkinglin ([#2531](https://github.com/Tencent/tdesign-react/pull/2531))
- `Dropdown`: Fixed issue where `Dropdown` disabled API was ineffective @uyarn ([#2532](https://github.com/Tencent/tdesign-react/pull/2532))

## 🌈 1.2.5 `2023-09-14` 
### 🚀 Features
- `Steps`: Global configuration added custom completed icon for steps @Zzongke ([#2491](https://github.com/Tencent/tdesign-react/pull/2491))
- `Table`: Filterable table, `onFilterChange` event added parameter `trigger: 'filter-change' | 'confirm' | 'reset' | 'clear'` to indicate source of filter condition change @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
- `Form`: trigger added `submit` option @honkinglin ([#2507](https://github.com/Tencent/tdesign-react/pull/2507))
- `ImageViewer`: `onIndexChange` event added `trigger` enum value `current` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Image`: @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
    - Added `fallback` for fallback image, displayed when original image fails to load
    - Added support for `src` type as `File`, supporting image preview through `File`
- `Upload`: File list supports displaying thumbnails @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))
    - Support scrolling to specific node by `key` in virtual scrolling scenario
    - Support running `scrollTo` operation when below `threshold` in virtual scrolling scenario
### 🐞 Bug Fixes
- `ConfigProvider`: Fixed issue where language switching was ineffective @uyarn ([#2501](https://github.com/Tencent/tdesign-react/pull/2501))
- `Table`:
    - Filterable table, fixed issue where `resetValue` couldn't reset to specified `resetValue` when clearing filter @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - Tree structure table, fixed issue where expandedTreeNodes.sync and expanded-tree-nodes-change were ineffective when using expandTreeNodeOnClick @chaishi ([#2492](https://github.com/Tencent/tdesign-react/pull/2492))
    - Cell in edit mode, incorrect handling of chained colKey during save, couldn't overwrite original value @Empire-suy ([#2493](https://github.com/Tencent/tdesign-react/pull/2493))
    - Editable table, fixed issue where validation affected each other when multiple editable tables existed @chaishi ([#2498](https://github.com/Tencent/tdesign-react/pull/2498))
- `TagInput`: Fixed size issue of collapsed display options @uyarn ([#2503](https://github.com/Tencent/tdesign-react/pull/2503))
- `Tabs`: Fixed issue where panel content was lost when using list to pass props and destroyOnHide was false @lzy2014love ([#2500](https://github.com/Tencent/tdesign-react/pull/2500))
- `Menu`: Fixed issue where menuitem passing onClick didn't trigger when menu `expandType` was in default mode @Zzongke ([#2502](https://github.com/Tencent/tdesign-react/pull/2502))
- `ImageViewer`: Fixed issue where preview popup couldn't be opened directly through `visible` @chaishi ([#2494](https://github.com/Tencent/tdesign-react/pull/2494))
- `Tree`: Fixed abnormality where some `TreeNodeModel` operations failed after version `1.2.0` @uyarn ([#2509](https://github.com/Tencent/tdesign-react/pull/2509))

## 🌈 1.2.4 `2023-08-31` 
### 🚀 Features
- `Table`: Tree structure, when `expandedTreeNodes` is not set, automatically collapse all expanded nodes when data changes (if you want to keep expanded nodes, please use property `expandedTreeNodes` to control @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
### 🐞 Bug Fixes
- `Watermark`: Modified watermark node without affecting watermark display @tingtingcheng6 ([#2459](https://github.com/Tencent/tdesign-react/pull/2459))
- `Table`: @chaishi ([#2470](https://github.com/Tencent/tdesign-react/pull/2470))
    - Drag sorting + local data pagination scenario, fixed incorrect event parameters `currentIndex/targetIndex/current/target` etc.
    - Drag sorting + local data pagination scenario, fixed issue where automatically jumped to first page after drag and drop sorting in paginated data after second page
    - Supported drag sorting scenario with uncontrolled pagination
- `Slider`: Fixed issue where `label` position was incorrect when initial value was 0 @Zzongke ([#2477](https://github.com/Tencent/tdesign-react/pull/2477))
- `Tree`: Support `store.children` calling getChildren method @uyarn ([#2480](https://github.com/Tencent/tdesign-react/pull/2480)) 

## 🌈 1.2.3 `2023-08-24` 
### 🐞 Bug Fixes
- `Table`: Fixed usePrevious error @honkinglin ([#2464](https://github.com/Tencent/tdesign-react/pull/2464))
- `ImageViewer`: Fixed import file path error @honkinglin ([#2465](https://github.com/Tencent/tdesign-react/pull/2465)) 

## 🌈 1.2.2 `2023-08-24` 
### 🚀 Features
- `Table`: @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
    - Tree structure, added component instance method `removeChildren` for removing child nodes
    - Tree structure, support freely controlling expanded nodes through property `expandedTreeNodes.sync`, non-required property
- `Tree`: Added `scrollTo` method to support scrolling to specified node in virtual scrolling scenario @uyarn ([#2460](https://github.com/Tencent/tdesign-react/pull/2460))
### 🐞 Bug Fixes
- `TagInput`: Fixed issue where input got stuck when typing Chinese @Zzongke ([#2438](https://github.com/Tencent/tdesign-react/pull/2438))
- `Table`:
    - Click row expand/click row select, fixed issue where `expandOnRowClick` and `selectOnRowClick` couldn't independently control row click execution interaction @chaishi ([#2452](https://github.com/Tencent/tdesign-react/pull/2452))
    - Tree structure, fixed component instance method expand all `expandAll` issue @chaishi ([#2453](https://github.com/Tencent/tdesign-react/pull/2453))
- `Form`: Fixed FormList component using form setFieldsValue, reset exception @nickcdon ([#2406](https://github.com/Tencent/tdesign-react/pull/2406)) 

## 🌈 1.2.1 `2023-08-16` 
### 🚀 Features
- `Anchor`: Added `getCurrentAnchor` to support custom highlight anchor @ontheroad1992 ([#2436](https://github.com/Tencent/tdesign-react/pull/2436))
- `MenuItem`: `onClick` event added `value` return value @dexterBo ([#2441](https://github.com/Tencent/tdesign-react/pull/2441))
- `FormItem`: Added `valueFormat` function to support data formatting @honkinglin ([#2445](https://github.com/Tencent/tdesign-react/pull/2445))
### 🐞 Bug Fixes
- `Dialog`: Fixed flickering issue @linjunc ([#2435](https://github.com/Tencent/tdesign-react/pull/2435))
- `Select`: @uyarn ([#2446](https://github.com/Tencent/tdesign-react/pull/2446))
    - Fixed issue of losing `title` in multi-select
    - Don't execute internal filtering when remote search is enabled
- `Popconfirm`: Invalid `className` and `style` Props @betavs ([#2420](https://github.com/Tencent/tdesign-react/pull/2420))
- `DatePicker`: Fixed unnecessary rendering caused by hovering cell @j10ccc ([#2440](https://github.com/Tencent/tdesign-react/pull/2440)) 

## 🌈 1.2.0 `2023-08-10` 
### 🚨 Breaking Changes
- `Icon`: @uyarn ([#2429](https://github.com/Tencent/tdesign-react/pull/2429))
    - Added 960 icons
    - Adjusted icon naming: `photo` to `camera`, `books` to `bookmark`, `stop-cirle-1` to `stop-circle-stroke`
    - Removed `money-circle` icon, please check icon page for details
### 🚀 Features
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - Added `lazyLoad` for lazy loading entire table
    - Editable cell, added `edit.keepEditMode` to keep cell always in edit mode
    - Filterable table, support passing `attrs/style/classNames` properties, styles, class names etc. to custom components
    - Filterable table, when current `filterValue` is not set for default filter value, no longer pass undefined to filter component, some components' default values must be array, not allowed to be undefined
### 🐞 Bug Fixes
- `Cascader`: Error when passed value is not in options @peng-yin ([#2414](https://github.com/Tencent/tdesign-react/pull/2414))
- `Menu`: Fixed issue where same `MenuItem` triggered `onChange` multiple times @leezng ([#2424](https://github.com/Tencent/tdesign-react/pull/2424))
- `Drawer`: Drawer component couldn't display normally when `visible` default was `true` @peng-yin ([#2415](https://github.com/Tencent/tdesign-react/pull/2415))
- `Table`: @chaishi ([#2402](https://github.com/Tencent/tdesign-react/pull/2402))
    - Virtual scrolling scenario, fixed issue where header width and content width were inconsistent
    - Virtual scrolling scenario, fixed issue where default scrollbar length (position) was inconsistent after scrolling

## 🌈 1.1.17 `2023-07-28`
### 🐞 Bug Fixes
- `Tabs`: Fixed js error when list passed empty array @zhenglianghan ([#2393](https://github.com/Tencent/tdesign-react/pull/2393))
- `ListItemMeta`: Fixed `description` passing custom elements @qijizh ([#2396](https://github.com/Tencent/tdesign-react/pull/2396))
- `Tree`: Fixed interaction abnormality where nodes rolled back in some scenarios when virtual scrolling was enabled @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))
- `Tree`: Fixed issue where operations based on `level` property couldn't work properly after version `1.1.15` @uyarn ([#2399](https://github.com/Tencent/tdesign-react/pull/2399))

## 🌈 1.1.16 `2023-07-26`
### 🚀 Features
- `TimePicker`: @uyarn ([#2388](https://github.com/Tencent/tdesign-react/pull/2388))
    - `disableTime` callback added millisecond parameter
    - Optimized experience when scrolling to unavailable options when displaying unavailable time options
- `Dropdown`: Added `panelTopContent` and `panelBottomContent` to support scenarios needing additional top and bottom nodes @uyarn ([#2387](https://github.com/Tencent/tdesign-react/pull/2387))
### 🐞 Bug Fixes
- `Table`:
    - Editable table scenario, support setting `colKey` value as chained property, such as: `a.b.c` @chaishi ([#2381](https://github.com/Tencent/tdesign-react/pull/2381))
    - Tree structure table, fixed error when values in `selectedRowKeys` didn't exist in data @chaishi ([#2385](https://github.com/Tencent/tdesign-react/pull/2385))
- `Guide`: Fixed functionality of hiding component when setting `step1` to `-1` @uyarn ([#2389](https://github.com/Tencent/tdesign-react/pull/2389))

## 🌈 1.1.15 `2023-07-19` 
### 🚀 Features
- `DatePicker`: Optimized resetting default selected area after closing popup @honkinglin ([#2371](https://github.com/Tencent/tdesign-react/pull/2371))
### 🐞 Bug Fixes
- `Dialog`: Fixed issue where `theme=danger` was ineffective @chaishi ([#2365](https://github.com/Tencent/tdesign-react/pull/2365))
- `Popconfirm`: When `confirmBtn/cancelBtn` value type was `Object`, not passed through @imp2002 ([#2361](https://github.com/Tencent/tdesign-react/pull/2361)) 

## 🌈 1.1.14 `2023-07-12` 
### 🚀 Features
- `Tree`: Support virtual scrolling @uyarn ([#2359](https://github.com/Tencent/tdesign-react/pull/2359))
- `Table`: Tree structure, added row level class names for business to set different level styles @chaishi ([#2354](https://github.com/Tencent/tdesign-react/pull/2354))
- `Radio`: Optimized option group wrapping scenario @ontheroad1992 ([#2358](https://github.com/Tencent/tdesign-react/pull/2358))
- `Upload`: @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))
    - Added component instance method `uploadFilePercent` for updating file upload progress
    - `theme=image`, support using `fileListDisplay` to customize UI content
    - `theme=image`, support clicking name to open new window to access image
    - Drag-and-drop upload scenario, support `accept` file type restriction
### 🐞 Bug Fixes
- `Upload`: Custom upload method, fixed issue where uploaded file wasn't correctly returned after upload success or failure @chaishi ([#2353](https://github.com/Tencent/tdesign-react/pull/2353))

## 🌈 1.1.13 `2023-07-05` 
### 🐞 Bug Fixes
- `Tag`: Fixed rendering abnormality when `children` was number `0` @HelKyle ([#2335](https://github.com/Tencent/tdesign-react/pull/2335))
- `Input`: Fixed style issue of `limitNumber` part in `disabled` state @uyarn ([#2338](https://github.com/Tencent/tdesign-react/pull/2338))
- `TagInput`: Fixed style issue of prefix icon @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))
- `SelectInput`: Fixed issue where input content wasn't cleared on blur @uyarn ([#2342](https://github.com/Tencent/tdesign-react/pull/2342))

## 🌈 1.1.12 `2023-06-29` 
### 🚀 Features
- `Site`: Support English site @uyarn ([#2316](https://github.com/Tencent/tdesign-react/pull/2316))
### 🐞 Bug Fixes
- `Slider`: Fixed issue where number input `theme` was fixed to `column` @Ali-ovo ([#2289](https://github.com/Tencent/tdesign-react/pull/2289))
- `Table`: Column width adjustment and custom columns coexistence scenario, fixed issue where table total width couldn't be restored to smaller when table column count became smaller through custom column configuration @chaishi ([#2325](https://github.com/Tencent/tdesign-react/pull/2325))

## 🌈 1.1.11 `2023-06-20` 
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2297](https://github.com/Tencent/tdesign-react/pull/2297))
    - Draggable column width scenario, fixed issue where `resizable=false` was ineffective, default value is false
    - Local data sorting scenario, fixed issue where canceling sort caused empty list when fetching data asynchronously
    - Fixed header misalignment in fixed table + fixed column + virtual scrolling scenario
    - Editable cell/editable row scenario, fixed issue where data always validated previous value, adjusted to validate latest input value
    - Fixed missing example code for local data sorting, multi-field sorting scenario
- `ColorPicker`: @uyarn ([#2301](https://github.com/Tencent/tdesign-react/pull/2301))
    - Support empty string as initial value when initializing as gradient mode
    - Fixed type issues with `recentColors` and other fields
    - Fixed issue where internal dropdown options didn't pass through `popupProps`

## 🌈 1.1.10 `2023-06-13` 
### 🚀 Features
- `Menu`:
    - `Submenu` added `popupProps` property to allow passing settings to underlying Popup popup @xiaosansiji ([#2284](https://github.com/Tencent/tdesign-react/pull/2284))
    - Popup menu refactored using Popup @xiaosansiji ([#2274](https://github.com/Tencent/tdesign-react/pull/2274))
### 🐞 Bug Fixes
- `InputNumber`: When initial value is `undefined`/`null` and `decimalPlaces` exists, no longer perform decimal correction @chaishi ([#2273](https://github.com/Tencent/tdesign-react/pull/2273))
- `Select`: Fixed issue with `onBlur` method callback parameters @Ali-ovo ([#2281](https://github.com/Tencent/tdesign-react/pull/2281))

## 🌈 1.1.9 `2023-06-06` 
### 🚀 Features
- `DatePicker`: Support `onConfirm` event @honkinglin ([#2260](https://github.com/Tencent/tdesign-react/pull/2260))
- `Menu`: Optimized side navigation menu `Tooltip` display when collapsed @xiaosansiji ([#2263](https://github.com/Tencent/tdesign-react/pull/2263))
- `Swiper`: navigation type supports `dots` `dots-bar` @carolin913 ([#2246](https://github.com/Tencent/tdesign-react/pull/2246))
- `Table`: Added `onColumnResizeChange` event @honkinglin ([#2262](https://github.com/Tencent/tdesign-react/pull/2262))
### 🐞 Bug Fixes
- `TreeSelect`: Fixed issue where `keys` property wasn't passed through to `Tree` @uyarn ([#2267](https://github.com/Tencent/tdesign-react/pull/2267))
- `InputNumber`: Fixed issue where some decimal numbers couldn't be input @chaishi ([#2264](https://github.com/Tencent/tdesign-react/pull/2264))
- `ImageViewer`: Fixed touchpad zoom operation abnormality @honkinglin ([#2265](https://github.com/Tencent/tdesign-react/pull/2265))
- `TreeSelect`: Fixed display issue when `label` is `reactNode` @Ali-ovo ([#2258](https://github.com/Tencent/tdesign-react/pull/2258))

## 🌈 1.1.8 `2023-05-25` 
### 🚀 Features
- `TimePicker`: Don't allow clicking confirm button when no value is selected @uyarn ([#2240](https://github.com/Tencent/tdesign-react/pull/2240))
### 🐞 Bug Fixes
- `Form`: Fixed `FormList` data passing issue @honkinglin ([#2239](https://github.com/Tencent/tdesign-react/pull/2239))

## 🌈 1.1.7 `2023-05-19` 
### 🐞 Bug Fixes
- `Tooltip`: Fixed arrow offset issue @uyarn ([#1347](https://github.com/Tencent/tdesign-common/pull/1347))

## 🌈 1.1.6 `2023-05-18` 
### 🚀 Features
- `TreeSelect`: Support `panelConent` API @ArthurYung ([#2182](https://github.com/Tencent/tdesign-react/pull/2182))
### 🐞 Bug Fixes
- `Select`: Fixed issue of creating options with duplicate labels @uyarn ([#2221](https://github.com/Tencent/tdesign-react/pull/2221))
- `Skeleton`: Fixed issue where extra theme row was rendered when using `rowCol` @uyarn ([#2223](https://github.com/Tencent/tdesign-react/pull/2223))
- `Form`:
    - Fixed error when using `useWatch` in async rendering @honkinglin ([#2220](https://github.com/Tencent/tdesign-react/pull/2220))
    - Fixed `FormList` initial value assignment failure issue @honkinglin ([#2222](https://github.com/Tencent/tdesign-react/pull/2222))

## 🌈 1.1.5 `2023-05-10` 
### 🚀 Features
- `Cascader`: Support `suffix`, `suffixIcon` @honkinglin ([#2200](https://github.com/Tencent/tdesign-react/pull/2200))
### 🐞 Bug Fixes
- `SelectInput`: Fixed issue where `loading` was hidden in `disabled` state @honkinglin ([#2196](https://github.com/Tencent/tdesign-react/pull/2196))
- `Image`: Fixed issue where component didn't support `ref` @li-jia-nan ([#2198](https://github.com/Tencent/tdesign-react/pull/2198))
- `BackTop`: Support `ref` pass-through @li-jia-nan ([#2202](https://github.com/Tencent/tdesign-react/pull/2202))

## 🌈 1.1.4 `2023-04-27` 
### 🚀 Features
- `Select`: Support `panelTopContent` for scenarios needing scrolling dropdown like virtual scrolling, see examples for usage @uyarn ([#2184](https://github.com/Tencent/tdesign-react/pull/2184))
### 🐞 Bug Fixes
- `DatePicker`: Fixed panel close abnormality on second click @honkinglin ([#2183](https://github.com/Tencent/tdesign-react/pull/2183))
- `Table`: Fixed `useResizeObserver` ssr error @chaishi ([#2175](https://github.com/Tencent/tdesign-react/pull/2175))

## 🌈 1.1.3 `2023-04-21` 
### 🚀 Features
- `DatePicker`: Support `onPresetClick` event @honkinglin ([#2165](https://github.com/Tencent/tdesign-react/pull/2165))
- `Switch`: `onChange` supports returning `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
- `Collapse`: `onChange` supports returning `event` parameter @carolin913 ([#2162](https://github.com/Tencent/tdesign-react/pull/2162))
### 🐞 Bug Fixes
- `Form`: 
    - Fixed active reset not triggering `onReset` logic @honkinglin ([#2150](https://github.com/Tencent/tdesign-react/pull/2150))
    - Fixed `onValuesChange` event return parameter issue @honkinglin ([#2169](https://github.com/Tencent/tdesign-react/pull/2169))
- `Select`: Fixed issue where `size` property was ineffective in multi-select mode @uyarn ([#2163](https://github.com/Tencent/tdesign-react/pull/2163))
- `Collapse`:
    - Fixed `Radio` disable judgment @duanbaosheng ([#2161](https://github.com/Tencent/tdesign-react/pull/2161))
    - Fixed controlled issue when `value` has default value @moecasts ([#2152](https://github.com/Tencent/tdesign-react/pull/2152))
- `Icon`: Fixed issue where manifest unified entry exported esm module but documentation wasn't updated in time @Layouwen ([#2160](https://github.com/Tencent/tdesign-react/pull/2160))

## 🌈 1.1.2 `2023-04-13` 
### 🚀 Features
- `DatePicker`: Optimized week selector highlight judgment logic performance @honkinglin ([#2136](https://github.com/Tencent/tdesign-react/pull/2136))
### 🐞 Bug Fixes
- `Dialog`: 
    - Fixed issue where setting style width was ineffective @honkinglin ([#2132](https://github.com/Tencent/tdesign-react/pull/2132))
    - Fixed footer rendering null issue @honkinglin ([#2131](https://github.com/Tencent/tdesign-react/pull/2131))
- `Select`: Fixed multi-select group display style abnormality @uyarn ([#2138](https://github.com/Tencent/tdesign-react/pull/2138))
- `Popup`: 
    - Fixed issue where scrollTop decimal under windows caused scroll bottom judgment failure @honkinglin ([#2142](https://github.com/Tencent/tdesign-react/pull/2142))
    - Fixed critical point initial positioning issue @honkinglin ([#2134](https://github.com/Tencent/tdesign-react/pull/2134))
- `ColorPicker`: Fixed issue where saturation and slider couldn't be dragged in Frame @insekkei ([#2140](https://github.com/Tencent/tdesign-react/pull/2140))

## 🌈 1.1.1 `2023-04-06` 
### 🚀 Features
- `StickyTool`: Added `sticky-tool` component @ZekunWu ([#2065](https://github.com/Tencent/tdesign-react/pull/2065))
### 🐞 Bug Fixes
- `TagInput`: Fixed issue where deleting keywords when filtering based on `TagInput` components would delete selected values @2513483494 ([#2113](https://github.com/Tencent/tdesign-react/pull/2113))
- `InputNumber`: Fixed functionality abnormality when inputting decimals ending in 0 @uyarn ([#2127](https://github.com/Tencent/tdesign-react/pull/2127))
- `Tree`: Fixed component data property not controlled issue @PBK-B ([#2119](https://github.com/Tencent/tdesign-react/pull/2119))
- `Form`: Fixed initial data setting issue @honkinglin ([#2124](https://github.com/Tencent/tdesign-react/pull/2124))
- `TreeSelect`: Fixed issue where couldn't expand after filtering @honkinglin ([#2128](https://github.com/Tencent/tdesign-react/pull/2128))
- `Popup`: Fixed right-click showing popup triggering browser default event @honkinglin ([#2120](https://github.com/Tencent/tdesign-react/pull/2120))

## 🌈 1.1.0 `2023-03-30` 
### 🚀 Features
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - Support using `filterIcon` to display different filter icons for different columns
    - Support horizontal scrolling to fixed columns
- `Button`: Support disabled state not triggering href jump logic @honkinglin ([#2095](https://github.com/Tencent/tdesign-react/pull/2095))
- `BackTop`: Added BackTop component @meiqi502 ([#2037](https://github.com/Tencent/tdesign-react/pull/2037))
- `Form`: submit supports returning data @honkinglin ([#2096](https://github.com/Tencent/tdesign-react/pull/2096))
### 🐞 Bug Fixes
- `Table`: @chaishi ([#2089](https://github.com/Tencent/tdesign-react/pull/2089))
    - Fixed document is not undefined issue in SSR environment
    - Fixed issue where column order couldn't be dragged and swapped in column display control scenario
    - Single row selection, fixed `allowUncheck: false` ineffective issue
- `Dialog`: Fixed Dialog onOpen event timing issue @honkinglin ([#2090](https://github.com/Tencent/tdesign-react/pull/2090))
- `DatePicker`: Fixed functionality abnormality when `format` is 12-hour system @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Alert`: Fixed center and font size issues when close button is text @Wen1kang @uyarn ([#2100](https://github.com/Tencent/tdesign-react/pull/2100))
- `Watermark`: Fixed `Loading` combination usage issue @duanbaosheng ([#2094](https://github.com/Tencent/tdesign-react/pull/2094))
- `Notification`: Fixed instance retrieval issue @honkinglin ([#2103](https://github.com/Tencent/tdesign-react/pull/2103))
- `Radio`: Fixed ts type issue @honkinglin ([#2102](https://github.com/Tencent/tdesign-react/pull/2102))

## 🌈 1.0.5 `2023-03-23` 
### 🚀 Features
- `TimePicker`: Added `size` API for controlling time input box size @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))
### 🐞 Bug Fixes
- `Form`: Fixed `FormList` initial data retrieval issue @honkinglin ([#2067](https://github.com/Tencent/tdesign-react/pull/2067))
- `Watermark`: Fixed document undefined issue in NextJS @carolin913 ([#2073](https://github.com/Tencent/tdesign-react/pull/2073))
- `ColorPicker`: @insekkei ([#2074](https://github.com/Tencent/tdesign-react/pull/2074))
    - Fixed issue where HEX color values couldn't be manually input
    - Fixed issue where recently used colors couldn't be deleted
- `Dialog`: Fixed `onCloseBtnClick` event ineffective issue @ArthurYung ([#2080](https://github.com/Tencent/tdesign-react/pull/2080))
- `BreadCrumb`: Fixed issue where Icon couldn't be configured through options property @uyarn ([#2081](https://github.com/Tencent/tdesign-react/pull/2081))

## 🌈 1.0.4 `2023-03-16` 
### 🚀 Features
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - Column width adjustment functionality, updated column width adjustment rule: when column width is small and doesn't exceed, column width adjustment表现为当前列和相邻列的变化；when column width exceeds and horizontal scrollbar exists, column width adjustment only affects current column and total column width
    - Editable cell(row) functionality, support real-time validation when data changes in edit mode, `col.edit.validateTrigger`
    - Only when fixed columns exist will class names `.t-table__content--scrollable-to-left` and `.t-table__content--scrollable-to-right` appear
    - Drag functionality, support disabling fixed columns from being dragged to adjust order
- `Upload`: `theme=file-input` when file is empty, don't show clear button on hover @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
- `InputNumber`: Support thousand separator paste @uyarn ([#2058](https://github.com/Tencent/tdesign-react/pull/2058))
- `DatePicker`: Support `size` property @honkinglin ([#2055](https://github.com/Tencent/tdesign-react/pull/2055))
### 🐞 Bug Fixes
- `Form`: Fixed reset default value data type error @honkinglin ([#2046](https://github.com/Tencent/tdesign-react/pull/2046))
- `TimelineItem`: Fixed export type @southorange0929 ([#2053](https://github.com/Tencent/tdesign-react/pull/2053))
- `Table`: @chaishi ([#2047](https://github.com/Tencent/tdesign-react/pull/2047))
    - Fixed table width jitter issue
    - Column width adjustment functionality, fixed Dialog column width adjustment issue
    - Editable cell, fixed issue where dropdown selection type components `abortEditOnEvent` didn't include `onChange` but still triggered exit edit mode when data changed
- `Table`: Fixed lazy-load reset bug @MrWeilian ([#2041](https://github.com/Tencent/tdesign-react/pull/2041))
- `ColorPicker`: Fixed issue where input box couldn't be input @insekkei ([#2061](https://github.com/Tencent/tdesign-react/pull/2061))
- `Affix`: Fixed fixed judgment issue @lio-mengxiang ([#2048](https://github.com/Tencent/tdesign-react/pull/2048))

## 🌈 1.0.3 `2023-03-09` 
### 🚀 Features
- `Message`: Don't auto-close on mouse hover @HelKyle ([#2036](https://github.com/Tencent/tdesign-react/pull/2036))
- `DatePicker`: Support `defaultTime` @honkinglin ([#2038](https://github.com/Tencent/tdesign-react/pull/2038))
### 🐞 Bug Fixes
- `DatePicker`: Fixed issue where current month was displayed when month was 0 @honkinglin ([#2032](https://github.com/Tencent/tdesign-react/pull/2032))
- `Upload`: Fixed `upload.method` ineffective issue @i-tengfei ([#2034](https://github.com/Tencent/tdesign-react/pull/2034))
- `Select`: Fixed selection error when multi-select select all initial value was empty @uyarn ([#2042](https://github.com/Tencent/tdesign-react/pull/2042))
- `Dialog`: Fixed dialog vertical center issue @KMethod ([#2043](https://github.com/Tencent/tdesign-react/pull/2043))

## 🌈 1.0.2 `2023-03-01` 
### 🚀 Features
- `Image`: Image component supports special format addresses `.avif` and `.webp` @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `ConfigProvider`: Added `Image` global configuration `globalConfig.image.replaceImageSrc` for unified image address replacement @chaishi ([#2021](https://github.com/Tencent/tdesign-react/pull/2021))
- `List`: `listItemMeta` supports `className`, `style` properties @honkinglin ([#2005](https://github.com/Tencent/tdesign-react/pull/2005))
### 🐞 Bug Fixes
- `Form`: @honkinglin ([#2014](https://github.com/Tencent/tdesign-react/pull/2014))
    - Fixed validation information using wrong cache
    - Removed `FormItem` redundant event notification logic
- `Drawer`: Fixed page scrollbar appearance after drag @honkinglin ([#2012](https://github.com/Tencent/tdesign-react/pull/2012))
- `Input`: Fixed async rendering width calculation issue @honkinglin ([#2010](https://github.com/Tencent/tdesign-react/pull/2010))
- `Textarea`: Adjusted limit display position, fixed style issue when coexisting with tips @duanbaosheng ([#2015](https://github.com/Tencent/tdesign-react/pull/2015))
- `Checkbox`: Fixed ts type issue @NWYLZW ([#2023](https://github.com/Tencent/tdesign-react/pull/2023))

## 🌈 1.0.1 `2023-02-21` 
### 🚀 Features
- `Popup`: Added `onScrollToBottom` event @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Select`: @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
    - Support virtual scrolling usage
    - Support `autofocus`, `suffix`, `suffixIcon` and other APIs, `onSearch` added callback parameters
    - Option child component supports custom `title` API
- `Icon`: Inject styles when loading to avoid errors in next environment @uyarn ([#1990](https://github.com/Tencent/tdesign-react/pull/1990))
- `Avatar`: Component internal image uses Image component rendering, support passing `imageProps` to Image component @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `DialogPlugin`: Support custom `visbile` @moecasts ([#1998](https://github.com/Tencent/tdesign-react/pull/1998))
- `Tabs`: Support drag capability @duanbaosheng ([#1979](https://github.com/Tencent/tdesign-react/pull/1979))
### 🐞 Bug Fixes
- `Select`: Fixed `onInputchange` trigger timing issue @uyarn ([#1980](https://github.com/Tencent/tdesign-react/pull/1980))
- `Radio`: Fixed `disabled` default value issue @honkinglin ([#1977](https://github.com/Tencent/tdesign-react/pull/1977))
- `Table`: Ensure editable cells maintain edit state @moecasts ([#1988](https://github.com/Tencent/tdesign-react/pull/1988))
- `TagInput`: Fixed issue where `TagInput` added `blur` behavior after version `0.45.4` caused `Select`/`Cascader`/`TreeSelect` unable to filter multi-select @uyarn ([#1989](https://github.com/Tencent/tdesign-react/pull/1989))
- `Avatar`: Fixed image display issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Image`: Fixed event type issue @chaishi ([#1993](https://github.com/Tencent/tdesign-react/pull/1993))
- `Tree`: Fixed issue where child nodes couldn't be searched after being collapsed @honkinglin ([#1999](https://github.com/Tencent/tdesign-react/pull/1999))
- `Popup`: Fixed popup show/hide infinite loop issue @honkinglin ([#1991](https://github.com/Tencent/tdesign-react/pull/1991))
- `FormList`: Fixed issue where `onValuesChange` couldn't get latest data @honkinglin ([#1992](https://github.com/Tencent/tdesign-react/pull/1992))
- `Drawer`: Fixed scrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))
- `Dialog`: Fixed scrollbar detection issue @honkinglin ([#2001](https://github.com/Tencent/tdesign-react/pull/2001))

## 🌈 1.0.0 `2023-02-13` 
### 🚀 Features
- `Dropdown`: Submenu layer structure adjustment, added one layer `t-dropdown__submenu-wrapper` @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))
### 🐞 Bug Fixes
- `Tree`: Fixed issue where `onExpand` wasn't triggered when using setItem to set node expanded @genyuMPj ([#1956](https://github.com/Tencent/tdesign-react/pull/1956))
- `Dropdown`: Fixed position abnormality issue for multi-layer long menus @uyarn ([#1964](https://github.com/Tencent/tdesign-react/pull/1964))

## 🌈 0.x `2021-03-26 - 2023-02-08`
Go to [GitHub](https://github.com/Tencent/tdesign-react/blob/develop/packages/tdesign-react/CHANGELOG-0.x.md) to view `0.x` changelog