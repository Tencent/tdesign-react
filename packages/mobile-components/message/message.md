:: BASE_DOC ::

## API

### Message Props

名称 | 类型 | 默认值 | 描述 | 必传
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，TS 类型：`React.CSSProperties` | N
align | String | left | 文本对齐方式。可选项：left/center。TS 类型：`MessageAlignType` `type MessageAlignType = 'left' \| 'center'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/message/type.ts) | N
closeBtn | TNode | undefined | 关闭按钮，可以自定义。值为 true 显示默认关闭按钮，值为 false 不显示关闭按钮。值类型为 string 则直接显示值，如：“关闭”。也可以完全自定义按钮。TS 类型：`string \| boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
content | TNode | - | 用于自定义消息弹出内容。TS 类型：`string \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
duration | Number | 3000 | 消息内置计时器，计时到达时会触发 duration-end 事件。单位：毫秒。值为 0 则表示没有计时器 | N
icon | TNode | true | 用于自定义消息前面的图标，优先级大于 theme 设定的图标。值为 false 则不显示图标，值为 true 显示 theme 设定图标。TS 类型：`boolean \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
link | TNode | - | 链接名称。值为字符串表示链接名称，值为 `Object` 类型，表示透传至 `Link`。TS 类型：`string \| object \| TNode`。[通用类型定义](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
marquee | Boolean / Object | false | 跑马灯效果。speed 指速度控制；loop 指循环播放次数，值为 -1 表示循环播放，值为 0 表示不循环播放；delay 表示延迟多久开始播放。TS 类型：`boolean \| MessageMarquee` `interface MessageMarquee { speed?: number; loop?: number; delay?: number }`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/message/type.ts) | N
offset | Array | - | 相对于 placement 的偏移量，示例：[-10, 20] 或 ['10px', '8px']。TS 类型：`Array<string \| number>` | N
theme | String | info | 消息组件风格。可选项：info/success/warning/error。TS 类型：`MessageThemeList` `type MessageThemeList = 'info' \| 'success' \| 'warning' \| 'error'`。[详细类型定义](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/message/type.ts) | N
visible | Boolean | false | 是否显示，隐藏时默认销毁组件 | N
defaultVisible | Boolean | false | 是否显示，隐藏时默认销毁组件。非受控属性 | N
zIndex | Number | - | 元素层级，样式默认为 5000 | N
onCloseBtnClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>当关闭按钮存在时，用户点击关闭按钮触发 | N
onDurationEnd | Function |  | TS 类型：`() => void`<br/>计时结束后触发 | N
onLinkClick | Function |  | TS 类型：`(context: { e: MouseEvent }) => void`<br/>当`link`链接存在时，点击链接文本时触发 | N

### CSS Variables

组件提供了下列 CSS 变量，可用于自定义样式。
名称 | 默认值 | 描述
-- | -- | --
--td-message-bg-color | @bg-color-container | -
--td-message-border-radius | @radius-default | -
--td-message-box-shadow | @shadow-4 | -
--td-message-close-icon-color | @text-color-placeholder | -
--td-message-content-color | @text-color-primary | -
--td-message-error-color | @error-color | -
--td-message-info-color | @brand-color | -
--td-message-success-color | @success-color | -
--td-message-warning-color | @warning-color | -
