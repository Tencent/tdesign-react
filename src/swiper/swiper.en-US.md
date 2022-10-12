:: BASE_DOC ::

## API

### Swiper Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | 类名 | N
style | Object | - | 样式，Typescript：`React.CSSProperties` | N
animation | String | slide | options：slide/fade | N
autoplay | Boolean | true | \- | N
current | Number | 0 | \- | N
defaultCurrent | Number | 0 | uncontrolled property | N
direction | String | horizontal | options：horizontal/vertical | N
duration | Number | 300 | \- | N
height | Number | - | \- | N
interval | Number | 5000 | \- | N
loop | Boolean | true | \- | N
navigation | TNode | - | Typescript：`SwiperNavigation \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/common.ts) | N
stopOnHover | Boolean | true | \- | N
theme | String | light | options：light/dark | N
trigger | String | hover | options：hover/click | N
type | String | default | options：default/card | N
onChange | Function |  | Typescript：`(current: number, context: { source: SwiperChangeSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/swiper/type.ts)。<br/>`type SwiperChangeSource = 'autoplay' \| 'click' \| 'hover'`<br/> | N

### SwiperNavigation

name | type | default | description | required
-- | -- | -- | -- | --
placement | String | inside | options：inside/outside | N
showSlideBtn | String | always | options：always/hover/never | N
size | String | medium | options：small/medium/large | N
type | String | - | Typescript：`SwiperNavigationType` `type SwiperNavigationType = 'dots' \| 'dots-bar' \| 'bars' \| 'fraction'`。[see more ts definition](https://github.com/Tencent/tdesign-react/blob/develop/src/swiper/type.ts) | N
