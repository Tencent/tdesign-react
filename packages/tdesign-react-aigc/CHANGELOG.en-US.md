---
title: Changelog
docClass: timeline
toc: false
spline: explain
---

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

### 📝 Documentation

- For **ChatEngine**, AI-friendly documentation has been added: AGENTS.md and llm.txt @carolin913 ([#4119](https://github.com/Tencent/tdesign-react/pull/4119))

## 🌈 1.0.0 `2026-11-20`

- Release 1st version
