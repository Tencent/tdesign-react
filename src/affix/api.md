
### Affix Props
名称 | 类型 | 默认值 | 说明 | 必传
-- | -- | -- | -- | --
container | String / Function | () => (() => window) | 指定滚动的容器。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body。TS 类型：`ScrollContainer` | N
offsetBottom | Number | - |  距离容器顶部达到指定距离后触发固定 | N
offsetTop | Number | - |  距离容器底部达到指定距离后触发固定 | N
onFixedChange | Function |  | 固定状态发生变化时触发。`(affixed: boolean, context: { top: number }) => {}` | N