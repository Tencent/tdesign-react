import React from 'react';
import type { CSSProperties, ReactElement } from 'react';
import cls from 'classnames';
import { assign, keys } from 'lodash-es';

export interface NativeProps<S extends string = never> {
  className?: string;
  style?: CSSProperties & Partial<Record<S, string>>;
}

export default function withNativeProps<P extends NativeProps>(props: P, element: ReactElement<P>) {
  const elementProps = element.props;
  const nativeProps: NativeProps & Record<string, any> = {};
  if (props.className) {
    nativeProps.className = cls(elementProps.className, props.className);
  }
  if (props.style) {
    nativeProps.style = assign({}, elementProps.style, props.style);
  }
  keys(props).forEach((key) => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      nativeProps[key] = props[key];
    }
  });
  if (keys(nativeProps).length) {
    return React.cloneElement(element, assign({}, elementProps, nativeProps));
  }
  return element;
}
