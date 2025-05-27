:: BASE_DOC ::

## API
### ChatMarkdown Props

name | type | default | description | required
-- | -- | -- | -- | --
content | String | - | 需要渲染的 Markdown 内容 | N
role | String | - | 发送者角色，影响样式渲染 | N
options | MarkdownIt.Options | - | Markdown 解析器基础配置。TS类型：`{ html: true, breaks: true, typographer: true }` | N
pluginConfig | Array | - | 插件配置数组。TS类型：`[ { preset: 'code', enabled: false }, { preset: 'katex', enabled: false } ]` | N

