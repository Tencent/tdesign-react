# 前置检查

执行 `tdesign-code-review` 前，保证本机 **已安装且已登录** `gh`。

任一环节未通过 → **暂停审查**；安装或登录失败时将终端报错反馈用户，不得用其它方式猜测 PR 内容。

---

## 1. 检测是否已安装

```bash
command -v gh
gh --version
```

**若本地没有安装，则进入 §2，反之直接进入 §3。**

---

## 2. 安装

### 2.1 识别环境

执行：

```bash
uname -s
uname -m
command -v brew
command -v winget
```

根据结果确定系统、架构及可用的包管理器：

| 判定                  | 系统 / 安装路径      |
| --------------------- | -------------------- |
| `uname -s` = `Darwin` | macOS                |
| 存在 `winget`         | Windows              |
| 其他情况              | 使用 GitHub Releases |

### 2.2 优先使用包管理器安装

根据环境执行对应命令：

| 系统                     | 安装命令                            |
| ------------------------ | ----------------------------------- |
| macOS（已安装 Homebrew） | `brew install gh`                   |
| Windows（支持 winget）   | `winget install --id GitHub.cli -e` |

安装完成后执行：

```bash
gh --version
```

验证成功则进入 **§3**；安装失败或包管理器不可用，则继续使用 Releases 安装。

### 2.3 使用 GitHub Releases 安装

1. 打开 [GitHub CLI 最新发布页](https://github.com/cli/cli/releases/latest)，或通过 [GitHub API](https://api.github.com/repos/cli/cli/releases/latest) 获取最新版本的 `assets`。

2. 根据系统和架构选择对应安装包

3. 验证安装

```bash
gh --version
```

验证成功则进入 **§3**；仍然失败则停止后续操作并反馈完整报错。

---

## 3. 检测是否已登录

```bash
gh auth status
```

- **已登录**：确认存在 active account，进入第 4 节。
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
