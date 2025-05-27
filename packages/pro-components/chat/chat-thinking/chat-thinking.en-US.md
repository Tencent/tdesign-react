:: BASE_DOC ::

## API
### ChatThinking Props

name | type | default | description | required
-- | -- | -- | -- | --
content | Object | - | 思考内容对象。TS类型：`{ text?: string; title?: string }` | N
status | MessageStatus/Function | - | 思考状态。可选项：complete/stop/error/pending | N
maxHeight | Number | - | 内容区域最大高度 | N
animation | String | circle | 加载动画类型。可选项： circle/moving/gradient | N
collapsed | Boolean | false | 是否默认折叠 | N
layout | String | block | 布局方式。可选项： block/border | N

