import React from 'react';
import { TdTypographyTextProps } from './type';

type WrapElementType = Pick<
  TdTypographyTextProps,
  'strong' | 'underline' | 'delete' | 'code' | 'mark' | 'keyboard' | 'italic'
>;

export function getWrappedElement(props: WrapElementType, content: React.ReactNode) {
  let currentContent = content;
  function wrap(flag: boolean, tag: string) {
    if (!flag) return;

    currentContent = React.createElement(tag, {}, currentContent);
  }

  wrap(props.strong, 'strong');
  wrap(props.underline, 'u');
  wrap(props.delete, 'del');
  wrap(props.code, 'code');
  wrap(props.mark, 'mark');
  wrap(props.keyboard, 'kbd');
  wrap(props.italic, 'i');

  return currentContent;
}
