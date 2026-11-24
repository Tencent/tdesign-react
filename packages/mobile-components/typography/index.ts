import _Typography from './Typography';
import _Text from './Text';
import _Title from './Title';
import _Paragraph from './Paragraph';

import './style/index.js';

export type { TextProps } from './Text';
export type { TitleProps } from './Title';
export type { ParagraphProps } from './Paragraph';
export * from './type';

export const Typography = _Typography;
export const TypographyText = _Text;
export const TypographyTitle = _Title;
export const TypographyParagraph = _Paragraph;

export default Typography;
