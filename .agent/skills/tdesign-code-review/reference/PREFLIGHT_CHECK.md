# 前置检查

任一环节未通过时**暂停审查**，并反馈失败原因给用户，禁止使用其它方式猜测 PR 内容。

---

## §P-1 检测是否已安装

```bash
# 确认 gh 已安装
gh --version
```

**若本地没有安装，则进入 §P-2；反之直接进入 §P-3。**

## §P-2 安装 GitHub CLI

根据操作系统及可用的包管理器选择安装方式。

| 操作系统 | 安装方式            | 安装命令                                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| macOS    | Homebrew            | `brew install gh`                                                                                 |
| Windows  | WinGet              | `winget install --id GitHub.cli -e`                                                               |
| 其他情况 | GitHub CLI Releases | 下载并安装对应操作系统的安装包：[GitHub CLI Releases](https://github.com/cli/cli/releases/latest) |

安装完成后，执行以下命令验证：

```bash
# 确认安装后的 gh 版本
gh --version
```

- 验证通过：继续执行 §P-3。
- 验证失败：重新安装，再次验证。

## §P-3 检测是否已登录

```bash
# 确认 gh 已登录
gh auth status
```

- **已登录**：确认存在 active account，进入 §P-4。
- **未登录**：
  1. **告知用户**：接下来需要完成 GitHub 授权，审查暂停至登录成功。
  2. 执行 `gh auth login`，唤起浏览器授权页面，等待用户授权完毕。
  3. 用户完成授权后，再次 `gh auth status`；仍失败则停止并反馈。

## §P-4 通过标准

- `gh --version` 正常。
- `gh auth status` 显示已登录。

完成后回到 `SKILL.md` **§1** 继续执行。
