---
title: Changelog
docClass: timeline
toc: false
spline: explain
---

## 🌈 1.1.0 `2026-09-11`

### 🚀 Features

- The underlying Web Components have been migrated from `tdesign-web-components` to `@tdesign/web-components-chat` @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
- `ChatEngine`: 
  - A generative UI has been added, featuring built-in json-render Catalog/Registry, custom components, Action, and data binding; it supports stream rendering via AG-UI Activity, as well as compatibility with A2UI v0.9 @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
  - Compatibility with the latest version of AG-UI’s protocol and its reasoning-related fields @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
  - Support for multiple incremental updates of reasoning content and markdown content @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))

### 🐞 Bug Fixes

- `ChatMarkdown`: Fixed an issue where indentation in lists within quoted blocks caused style overlaps @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))
- `ChatSender`: Fixed a problem where pressing Enter during pinyin entry in Chinese input methods led to accidental messages being sent @LzhengH ([#4381](https://github.com/Tencent/tdesign-react/pull/4381))

## 🌈 1.0.2 `2026-02-05`

### 🚀 Features

- **ChatEngine**:
  - Supports adaptation for AG-UI’s Activity-Snapshot/Delta events. A new `useAgentActivity` registration hook has been added, along with corresponding examples provided by @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119)).
  - The ChatEngine event bus mechanism can now be used in scenarios without a UI. Examples are available at @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119)).
  Error handling has been improved for `ToolCallRender` @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119)).
  For several Delta events under the AG-UI protocol, automatic initialization is now supported to handle SSE Chunk streams in cases where no Snapshot is available @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119)).
  Performance of Immutable JSON Patch has been optimized, and the `append` operation is now available for adding strings @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119)).
- **ChatMarkdown**: The issue of increased packaging size caused by dependency on CherryMarkdown has been significantly resolved. Highlighting for code blocks is no longer built-in; businesses need to introduce this functionality manually via configuration @LzhengH @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119)).
- **ChatSender**: The `readyToSend` property now allows for pre-sending validation to be handled  @LzhengH ([#4119](https://github.com/Tencent/tdesign-react/pull/4119).

## 🌈 1.0.0 `2025-11-20`

- Release 1st version
