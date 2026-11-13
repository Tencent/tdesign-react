# Bug Fix 审查细则

## §A 从 PR 摘录要点

| 字段     | 来源                                            |
| -------- | ----------------------------------------------- |
| Issue    | `Fixes #` / `Closes #` / 正文链接               |
| 组件     | `packages/components/<name>/` 或 PR 标题        |
| 复现材料 | 正文中的代码片段、CodeSandbox、StackBlitz、截图 |

---

## §B 缺陷验证

**前置**：工作区干净；`git fetch` 后位于 `develop` 分支：

```bash
git checkout develop
git pull origin develop
```

在 `develop` 上验证时需要先从 diff 复制用例到本地。

### B1 选择验证方式

| 情况                    | 做法                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| **PR 描述里有复现代码** | 改写为 Vitest 用例，写入组件 `__tests__/` 下的 **临时文件** `review-pr-<N>.test.tsx`  |
| **PR diff 含测试变更**  | 将 diff 中的用例落到本地临时文件（或与既有 `*.test.tsx` 同结构的 `test(...)`）        |
| **以上皆无**            | 根据 §A 触发条件 **构造最小场景**，编写**预期会失败**的用例（断言「修复后的正确行为」 |

### B2 在 develop 分支上证明可复现

```bash
pnpm test -- packages/components/<component>/__tests__/review-pr-<N>.test.tsx
```

| 结果     | 含义                                                           |
| -------- | -------------------------------------------------------------- |
| **失败** | 与描述一致，缺陷成立（继续 B3）                                |
| **通过** | 未复现：核对触发条件、是否依赖 Common 子模块版本、用例是否过弱 |

### B3 在 PR 分支上证明已修复

```bash
git fetch origin pull/<N>/head:pr-<N>
git checkout pr-<N>
pnpm test -- review-pr-<N>.test.tsx
```

| 结果                    | 含义                            |
| ----------------------- | ------------------------------- |
| **通过**                | 修复有效                        |
| **仍失败**              | **blocker**：修复未覆盖触发条件 |
| **PR 已含正式回归用例** | 以 PR 文件为准                  |
