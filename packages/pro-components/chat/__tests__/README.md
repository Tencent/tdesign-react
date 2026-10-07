# Chat migration contracts

This suite continues PR #4408's API, composition and visible-behavior guards after the webc-to-React migration. It intentionally avoids enumerating every prop combination or preserving webc node structure.

- `chat-sender`: controlled/uncontrolled input, CustomEvent detail, Enter/Shift+Enter/IME/loading/disabled behavior, focus/blur/file refs, attachment ownership, ConfigProvider and React context.
- `chat-message`: composition, empty fragments, metadata/segment overrides, pending/error/complete updates and multiple segments within one message in document order.
- `chatbot`: public ref methods and state, message updates, prompt/action callbacks, sender/message prop composition, explicit empty history and a successful SSE response with afterSend detail.
- `chat-actionbar`: interactive feedback, custom React actions and false disabling all actions.
- `chat-content-parts`: thinking collapse, search default collapse and search/suggestion callbacks, file status and disabled actions, attachment item identity and removal.
- `chat-markdown`: the renderer callback contract preserves default code copying, custom transformations and cancellation; actual clipboard behavior is verified in the browser sandbox.
- `chat-loading`: the five documented animations announce loading; animation appearance belongs to browser acceptance.
- `chat-list`: public scrolling methods and scroll callback detail.
- `chat-engine-hooks`: StrictMode engine lifetime, inline empty defaults preserving live state, and agent state initialization/read/write behavior.
- Existing json-render sanitization tests remain unchanged.

The original PR's weak source-export tests now belong to `pnpm check:chat-package`, which imports the actual release entry without a DOM, checks public component exports, renders components on the server, checks shipped styles and rejects leftover webc/secondary-root dependencies. Actual browser consumers exercise all component exports and real Cherry rendering.

The unit composition tests mock only Markdown rendering; they cannot establish Markdown browser behavior or pixel parity. The independent baseline/candidate package acceptance sandbox supplies that evidence. Source tests contain no fixed sleeps, webc-specific queries or skipped migration cases. Readiness waits use visible output or public state. The setup is local to Chat tests and its scrollTo implementation updates scroll offsets; it is not injected into the basic component suite.

## Changes from the pre-migration guards

- Retain the public contract intent; consolidate repetitive shape/class-only assertions into meaningful behavior checks.
- Remove recursive shadow DOM queries, unconditional 100–800ms sleeps, CSS animation class assertions and custom-element icon selectors.
- Replace all three skipped migration cases with executed interaction/false-action/SSE cases.
- Correct multi-segment ordering to test two segments in one component rather than two independent renders.
- Scope environment shims to Chat. The original globally injected no-op scrollTo caused the Table pagination CI failure; the original Table test now passes unchanged.
- Keep the common workspace child package declarations from the original PR.

Run `pnpm test:chat`, `pnpm check:chat-package` after `pnpm build:aigc`, and the existing `pnpm lint` / `pnpm test` gates. Passing these does not replace actual browser interaction and visual acceptance.
