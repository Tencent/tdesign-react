# 前置检查

执行 `tdesign-code-review` 前，保证本机 **已安装且已登录** `gh`。

任一环节未通过 → **暂停审查**；安装或登录失败时将终端报错反馈用户，不得用其它方式猜 PR 内容。

---

## 1. 检测是否已安装

```bash
command -v gh
gh --version
```

**若本地没有安装，则进入 §2，反之直接进入 §3。**

---

## 2. 安装

仅考虑 **macOS** 与 **Windows**。先识别环境，再按 **A → B** 顺序尝试。

### 识别环境

```bash
uname -s    # Darwin → macOS
uname -m    # arm64 / x86_64（走 B 时选 release 包用）
command -v brew winget 2>/dev/null
```

| 判定                                       | 含义                                                     |
| ------------------------------------------ | -------------------------------------------------------- |
| `uname -s` = `Darwin`                      | macOS                                                    |
| 存在 `winget`                              | Windows（含 WSL 内不适用 winget 的场景时，直接走 **B**） |
| 存在 `brew` 且上式为 macOS                 | 可走 **A** 的 macOS 行                                   |
| 无 `brew` / 无 `winget`，或 **A** 安装报错 | 走 **B. Releases**                                       |

### A. 包管理器（优先）

| 系统    | 前提                     | 命令                                |
| ------- | ------------------------ | ----------------------------------- |
| macOS   | `command -v brew` 成功   | `brew install gh`                   |
| Windows | `command -v winget` 成功 | `winget install --id GitHub.cli -e` |

执行后运行 `gh --version`。成功 → **§3**；失败 → 继续 **B**。

### B. GitHub Releases（兜底）

在 **A 不可用或安装失败** 时使用；**系统与架构仍用上一节同一组命令**（`uname -s` / `uname -m`），不再重复执行识别逻辑，只按下面表选包。

1. 打开最新发布页：[cli/cli releases/latest](https://github.com/cli/cli/releases/latest)（Agent 可用 API：`https://api.github.com/repos/cli/cli/releases/latest` 读取 `assets` 列表）。
2. 按下表在 `assets` 中选中**一个**文件名（以当页实际文件名为准）：

   | 上一节判定的系统 | 再参考 `uname -m` | 选带下列关键字的 asset              |
   | ---------------- | ----------------- | ----------------------------------- |
   | macOS            | `arm64`           | `macOS_arm64`（`.zip` 或 `.pkg`）   |
   | macOS            | `x86_64`          | `macOS_amd64`（`.zip` 或 `.pkg`）   |
   | Windows          | —                 | `windows_amd64`（`.msi` 或 `.zip`） |

3. 下载并安装：`.pkg` / `.msi` 按系统安装器完成；`.zip` 解压后将 `gh` 放入 **PATH**（如 `/usr/local/bin`、`~/bin`）。
4. 执行 `gh --version` 确认；仍失败则停止审查并反馈报错。

与 [官方安装说明](https://github.com/cli/cli#installation) 冲突时，**以当前 release 提供的 asset 为准**。

---

## 3. 检测是否已登录

```bash
gh auth status
```

- **已登录**：确认 active account，进入第 4 节。
- **未登录**：
  1. **告知用户**：接下来要在完成 GitHub 授权（浏览器或 device code），审查暂停至登录成功。
  2. 执行 `gh auth login`。
     帮用户调用起浏览器授权页面。等待用户授权完毕后

  3. 用户完成授权后，再次 `gh auth status`；仍失败则停止并反馈报错原文。

---

## 4. 通过标准

- `command -v gh` 成功且 `gh --version` 正常。
- `gh auth status` 显示已登录。

通过后继续完成 `SKILL.md` 相关流程。
