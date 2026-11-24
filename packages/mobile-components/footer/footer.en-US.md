:: BASE_DOC ::

## API

### Footer Props

name | type | default | description | required
-- | -- | -- | -- | --
className | String | - | className of component | N
style | Object | - | CSS(Cascading Style Sheets)，Typescript: `React.CSSProperties` | N
links | Array | [] | Typescript: `Array<LinkObj>` `interface LinkObj { name: string; url?: string; target?: string}`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/footer/type.ts) | N
logo | Object | - | Typescript: `FooterLogo` `interface FooterLogo { icon: string; title?: string; url?: string; target?: string; }`。[see more ts definition](https://github.com/Tencent/tdesign-mobile-react/tree/develop/src/footer/type.ts) | N
text | String | '' | \- | N

### CSS Variables

The component provides the following CSS variables, which can be used to customize styles.
Name | Default Value | Description
-- | -- | --
--td-footer-link-color | @brand-color | -
--td-footer-link-dividing-line-color | @text-color-placeholder | -
--td-footer-link-dividing-line-padding | @spacer-1 | -
--td-footer-link-font | @font-body-medium | -
--td-footer-logo-icon-height | 24px | -
--td-footer-logo-icon-margin-right | @spacer | -
--td-footer-logo-icon-width | 24px | -
--td-footer-logo-title-font | @font-title-medium | -
--td-footer-logo-title-url-width | 128px | -
--td-footer-text-color | @text-color-placeholder | -
--td-footer-text-font | @font-body-small | -
--td-footer-text-margin-top | 4px | -
--td-footer-title-color | @text-color-primary | -
