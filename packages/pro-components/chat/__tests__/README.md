# Chat 公开契约测试

运行：`pnpm exec vitest run packages/pro-components/chat/__tests__`。现有 `pnpm test` 和 PR CI 会执行这些测试，无须单独的迁移开关。

## 范围

| 模块 | 单项 props / API | 必要组合与行为 |
| --- | --- | --- |
| ChatSender | placeholder、value、defaultValue、disabled、loading、actions、sendBtnDisabled | 受控输入、输入后发送、Enter/Shift/IME、附件载荷与移除、上传配置、textareaProps、focus、回调替换 |
| ChatMessage / ChatActionBar | role、variant、placement、content、actionBar 数组 | 多内容顺序、身份信息与外观、状态与动画、thinking 配置、suggestion 回调、自定义 React 操作 |
| ChatBot | defaultMessages、messageProps、ref | sender/message 配置组合、消息增删顺序、addPrompt、onRequest + SSE onMessage |
| ChatList | children、onScroll、scrollList | 关闭自动滚动时的手动滚动与事件载荷 |
| ChatThinking / Search / Suggestion | content、status、layout、collapsed、useCollapse | 受控折叠、最大高度、内容更新与顺序 |
| Filecard / 附件 | item、disabled、removable | 文件描述、上传进度、点击与移除；通过 Sender 验证附件 overflow 配置 |
| ChatLoading / ChatMarkdown | animation、text、content、options | 动画与文案、Markdown 追加/清空、链接解析配置 |
| Engine hooks | useChat、useAgentToolcall、useAgentActivity | 消息状态同步、注册/注销与清理 |

不枚举所有 props 的笛卡尔积，不快照整个 DOM，不检查组件私有状态或 mock 被测组件。通过真实输入、点击、公开 ref 和网络响应边界验证结果。异步使用 `waitFor`，不使用固定等待或跳过用例。

`helpers.ts` 仅负责查询实际投影的 DOM（含 slot / shadow root），普通 React DOM 也使用同一套查询；少量语义类名用于定位外观状态，不要求固定标签名、层级或图标路径。`setup.ts` 仅补齐 jsdom 缺少的浏览器能力，不能代替真实浏览器中的 CSS、像素、自动滚动和尺寸验收。

## 当前基线的边界

以下问题在未迁移实现（web-components-chat 1.3.3 / React 18）上复现，未写成“必须继续保持”的通过断言，也未屏蔽异常或以 skip 计入覆盖：

- 独立 `Attachments` 在复杂 props 完成赋值前会抛出 `items.map` 异常；目前仅覆盖 Sender 内的附件组合，不能据此认定独立入口通过。
- `ChatActionBar.handleAction`、`ChatSender.sendBtnDisabled` 的函数形式、独立 Search / Suggestion 的函数回调未进入底层 props；对象形式的消息 `handleActions` 另有实际点击测试。`actionBar` 从数组切换为 `false` 也未隐藏操作项。
- ChatBot 成功收到 SSE 回答后，`onChatAfterSend` 未触发；当前验证请求参数及消息结果。
- Sender 的 ref `blur()` 和 Search 的初始 `collapsed=true` 未达到预期；Thinking 的 `defaultCollapsed` 展示还需要浏览器确认。当前覆盖 Thinking 的受控 `collapsed`。
- `onFocus` / `onScroll` 存在额外原生事件转发；测试验证公开 `detail` 数据，不把重复次数固化为契约。

修复这些问题时应补充对应回归用例；迁移前仍需检查这里列出的边界。测试通过表示表中契约通过，不代表完整迁移验收通过。
