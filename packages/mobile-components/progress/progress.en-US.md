:: BASE_DOC ::

## API

### Progress Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
color | String / Object / Array | '' | Typescript: `string \| Array<string> \| Record<string, string>` | N
label | TNode | true | Typescript: `string \| boolean \| TNode`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/blob/develop/src/common.ts) | N
percentage | Number | 0 | \- | N
size | String / Number | 'default' | \- | N
status | String | - | options: success/error/warning/active。Typescript: `ProgressStatus` `type ProgressStatus = 'success' \| 'error' \| 'warning' \| 'active'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/progress/type.ts) | N
strokeWidth | String / Number | - | \- | N
theme | String | line | options: line/plump/circle。Typescript: `ProgressTheme` `type ProgressTheme = 'line' \| 'plump' \| 'circle'`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/progress/type.ts) | N
trackColor | String | '' | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-progress-info-dark-color | @text-color-primary | -
--td-progress-info-light-color | @font-white-1 | -
--td-progress-inner-bg-color-active | @bg-color-container | -
--td-progress-inner-bg-color-error | @error-color | -
--td-progress-inner-bg-color-success | @success-color | -
--td-progress-inner-bg-color-warning | @warning-color | -
--td-progress-circle-icon-size | 48px | -
--td-progress-circle-inner-bg-color | @font-white-1 | -
--td-progress-circle-label-font | @font-title-extraLarge | -
--td-progress-inner-bg-color | @brand-color | -
--td-progress-track-bg-color | @bg-color-component | -
