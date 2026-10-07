import React, { Children, isValidElement, useContext, useImperativeHandle, useRef } from 'react';
import { ConfigContext } from 'tdesign-react';

import type { CSSProperties, ReactNode, Ref } from 'react';
import type { StyledProps } from './native-types';

export const useChatClass = (name: string) => `${useContext(ConfigContext).globalConfig.classPrefix || 't'}-${name}`;
export const renderNode = (node: ReactNode | ((props: any) => ReactNode), props = {}) =>
  typeof node === 'function' ? node(props) : node;
export const eventOf = <T,>(name: string, detail: T) => new CustomEvent(name, { detail });

// Named React children retain the documented slot API without separate React roots.
export const flattenChildren = (children: ReactNode): ReactNode[] => {
  const result: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === React.Fragment) result.push(...flattenChildren(child.props.children));
    else if (child !== null && child !== undefined && child !== false) result.push(child);
  });
  return result;
};
export const namedChildren = (children: ReactNode, name?: string): ReactNode[] =>
  flattenChildren(children).filter(
    (child) => (isValidElement<{ slot?: string }>(child) ? child.props.slot : undefined) === name,
  );
export const slot = (children: ReactNode, name: string, fallback?: ReactNode) => {
  const nodes = namedChildren(children, name);
  return nodes.length ? nodes : fallback;
};
export const rootProps = (
  { className, style }: StyledProps,
  base: string,
): { className: string; style?: CSSProperties } => ({
  className: [base, className].filter(Boolean).join(' '),
  style,
});

export const useElementRef = (
  ref: Ref<HTMLElement | undefined>,
  api?: object,
  existing?: React.MutableRefObject<HTMLDivElement | null>,
) => {
  const local = useRef<HTMLDivElement>(null);
  const root = existing || local;
  useImperativeHandle(ref, () => {
    if (!root.current) return undefined;
    if (api) Object.defineProperties(root.current, Object.getOwnPropertyDescriptors(api));
    return root.current;
  });
  return root;
};
