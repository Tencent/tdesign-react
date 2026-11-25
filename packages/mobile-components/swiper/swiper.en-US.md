:: BASE_DOC ::

## API

### Swiper Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
animation | String | slide | options: slide | N
autoplay | Boolean | true | \- | N
current | Number | 0 | \- | N
defaultCurrent | Number | 0 | uncontrolled property | N
direction | String | horizontal | options: horizontal/vertical | N
duration | Number | 300 | \- | N
height | String / Number | - | \- | N
interval | Number | 5000 | \- | N
loop | Boolean | true | \- | N
navigation | TNode | true | Typescript: `SwiperNavigation \| TNode \| Boolean`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
nextMargin | String / Number | 0 | \- | N
previousMargin | String / Number | 0 | \- | N
type | String | default | options: default/card | N
onChange | Function |  | Typescript: `(current: number, context: { source: SwiperChangeSource }) => void`<br/>[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/swiper/type.ts)。<br/>`type SwiperChangeSource = 'autoplay' \| 'touch' \| 'nav'`<br/> | N
onClick | Function |  | Typescript: `(index: number) => void`<br/> | N

### SwiperNavigation

name | type | default | description | required
-- | -- | -- | -- | --
minShowNum | Number | - | \- | N
paginationPosition | String | bottom | options: top-left/top/top-right/bottom-left/bottom/bottom-right/left/right | N
placement | String | inside | options: inside/outside | N
showControls | Boolean | false | \- | N
type | String | - | Typescript: `SwiperNavigationType` `type SwiperNavigationType = 'dots' \| 'dots-bar' \| 'fraction'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/swiper/type.ts) | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-swiper-border-radius | 8px | -
--td-swiper-item-left-padding | 6px | -
--td-swiper-item-right-padding | 6px | -
--td-swiper-placement-outside-padding | calc(@spacer-1 + @swiper-nav-dot-size) | -
--td-swiper-nav-btn-bg-color | @font-gray-3 | -
--td-swiper-nav-btn-color | @font-white-1 | -
--td-swiper-nav-btn-size | 24px | -
--td-swiper-nav-dot-active-color | @font-white-1 | -
--td-swiper-nav-dot-color | @font-white-2 | -
--td-swiper-nav-dot-size | 6px | -
--td-swiper-nav-dots-bar-active-width | 20px | -
--td-swiper-nav-fraction-bg-color | @font-gray-3 | -
--td-swiper-nav-fraction-color | @font-white-1 | -
--td-swiper-nav-fraction-font | @font-body-small | -
--td-swiper-nav-fraction-height | 24px | -
--td-swiper-nav-outside-bg | @gray-color-3 | -
--td-swiper-nav-outside-bg-active | @brand-color | -
