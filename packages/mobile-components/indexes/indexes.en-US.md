:: BASE_DOC ::

## API

### Indexes Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
current | String / Number | - | \- | N
defaultCurrent | String / Number | - | uncontrolled property | N
indexList | Array | - | Typescript: `Array<string \| number>` | N
showFullIndex | Boolean | false | `0.21.4`。Typescript: `Boolean` | N
sticky | Boolean | true | Typescript: `Boolean` | N
stickyOffset | Number | 0 | \- | N
onChange | Function |  | Typescript: `(index: string \| number) => void`<br/> | N
onSelect | Function |  | Typescript: `(index: string \| number) => void`<br/> | N


### IndexesAnchor Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
index | String / Number | - | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-indexes-sidebar-active-bg-color | @brand-color | -
--td-indexes-sidebar-active-color | @text-color-anti | -
--td-indexes-sidebar-color | @text-color-primary | -
--td-indexes-sidebar-font | @font-body-small | -
--td-indexes-sidebar-item-size | 20px | -
--td-indexes-sidebar-right | 8px | -
--td-indexes-sidebar-tips-bg-color | @brand-color-light | -
--td-indexes-sidebar-tips-color | @brand-color | -
--td-indexes-sidebar-tips-font | @font-title-extraLarge | -
--td-indexes-sidebar-tips-right | calc(100% + 16px) | -
--td-indexes-sidebar-tips-size | 48px | -
--td-indexes-anchor-active-bg-color | @bg-color-container | -
--td-indexes-anchor-active-color | @brand-color | -
--td-indexes-anchor-active-font-weight | 600 | -
--td-indexes-anchor-bg-color | @bg-color-secondarycontainer | -
--td-indexes-anchor-color | @text-color-primary | -
--td-indexes-anchor-font | @font-body-medium | -
