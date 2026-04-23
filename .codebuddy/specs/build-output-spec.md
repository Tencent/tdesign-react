# TDesign 构建产物规范 (Build Output Spec)

> 本规范定义 TDesign 组件库的 6 种构建产物格式、目录结构标准和 package.json 入口配置。
> 源文档: `packages/common/develop-install.md`

## 产物目录结构总览

```bash
├─ dist/                       # UMD 格式（CDN/浏览器直引）
├─ es/                         # ES Modules + CSS 文件
├─ esm/                        # ES Modules + Less 源文件引用
├─ lib/                        # ES Modules（无样式）
├─ cjs/                        # CommonJS 格式
├─ LICENSE
├─ CHANGELOG.md
├─ README.md
└─ package.json
```

---

## 1. dist（UMD 格式）

**用途**：浏览器 `<script>` 标签直接引用，CDN 分发

**产物结构**：
```bash
dist/
├─ tdesign.js           # 未压缩版本
├─ tdesign.js.map       # SourceMap
├─ tdesign.min.js       # 压缩版本
├─ tdesign.min.js.map   # 压缩版 SourceMap
├─ tdesign.css          # 未压缩样式
├─ tdesign.css.map      # 样式 SourceMap
└─ tdesign.min.css      # 压缩样式
```

**技术要求**：
- 打包所有组件代码和样式为单文件
- 采用 UMD 模块标准
- 兼容现代浏览器，支持 SSR
- 样式入口：`common/style/web/index.less`
- 必须生成 `.min` 和 `.map` 文件

---

## 2. es（ES Modules + CSS）

**用途**：现代构建工具（webpack/rollup）按需引入，支持 tree-shaking

**产物结构**：
```bash
es/
├─ button/
│   ├─ style/
│   │   ├─ css.js          # import './index.css';
│   │   ├─ index.css       # 编译后的 CSS
│   │   └─ index.js        # import './index.less';
│   ├─ button.js
│   ├─ button.d.ts
│   ├─ index.js
│   └─ index.d.ts
├─ index.js
└─ index.d.ts
```

**技术要求**：
- 每个组件独立编译，生成对应 JS 和 `.d.ts` 文件
- 组件文件夹下生成 `style/` 目录，包含编译后的 CSS
- Babel runtime helpers 内联到每个组件
- 不编译测试文件和文档文件

---

## 3. esm（ES Modules + Less 引用）

**用途**：需要自定义主题的场景，引用 Less 源文件

**产物结构**：
```bash
esm/
├─ button/
│   ├─ style/
│   │   └─ index.js        # import 'tdesign-react/esm/button/style/index.less';
│   ├─ button.js
│   ├─ button.d.ts
│   ├─ index.js
│   └─ index.d.ts
├─ index.js
└─ index.d.ts
```

**技术要求**：
- `style/index.js` 链接到未编译的 Less 源文件
- 适用于需要覆盖 Design Token 的项目
- 其他要求同 `es/`

---

## 4. lib（ES Modules 无样式）

**用途**：搭配 `dist/tdesign.min.css` 全量样式使用

**产物结构**：
```bash
lib/
├─ button/
│   ├─ button.js
│   ├─ button.d.ts
│   ├─ index.js
│   └─ index.d.ts
├─ index.js
└─ index.d.ts
```

**技术要求**：
- 不包含任何样式代码
- 用户需单独引入 `dist/tdesign.min.css`
- 其他要求同 `es/`

---

## 5. cjs（CommonJS 格式）

**用途**：Node.js 环境或旧版构建工具

**产物结构**：
```bash
cjs/
├─ button/
│   ├─ button.js
│   ├─ button.d.ts
│   ├─ index.js
│   └─ index.d.ts
├─ index.js
└─ index.d.ts
```

**技术要求**：
- 采用 CommonJS 模块标准（`module.exports`）
- 不包含样式代码
- 支持 SSR

---

## 6. package.json 入口配置

```json
{
  "files": [
    "es",
    "esm",
    "lib",
    "cjs",
    "dist",
    "LICENSE",
    "README.md",
    "CHANGELOG.md"
  ],
  "sideEffects": [
    "dist/*",
    "site/*",
    "es/**/style/**",
    "esm/**/style/**",
    "es/_util/react-19-adapter.js",
    "esm/_util/react-19-adapter.js",
    "lib/_util/react-19-adapter.js"
  ],
  "main": "lib/index.js",
  "module": "es/index.js",
  "unpkg": "dist/tdesign.min.js",
  "jsdelivr": "dist/tdesign.min.js",
  "typings": "es/index.d.ts"
}
```

### 字段说明

| 字段 | 值 | 说明 |
|------|-----|------|
| `main` | `lib/index.js` | Node.js / CommonJS 入口 |
| `module` | `es/index.js` | ES Modules 入口（webpack/rollup 优先使用） |
| `unpkg` | `dist/tdesign.min.js` | unpkg CDN 入口 |
| `jsdelivr` | `dist/tdesign.min.js` | jsdelivr CDN 入口 |
| `typings` | `es/index.d.ts` | TypeScript 类型声明入口 |
| `sideEffects` | 数组 | 标记有副作用的文件，保护样式文件和 react-19-adapter 不被 tree-shaking |

---

## 构建产物校验清单

在发布前，请确保以下检查项全部通过：

- [ ] `dist/` 目录包含 7 个文件（js/min.js/css/min.css + map）
- [ ] `es/`、`esm/`、`lib/`、`cjs/` 目录结构完整
- [ ] 所有 `.d.ts` 类型声明文件已生成
- [ ] `package.json` 入口字段指向正确
- [ ] `sideEffects` 配置包含所有样式相关路径
- [ ] 各格式产物可正常导入运行
