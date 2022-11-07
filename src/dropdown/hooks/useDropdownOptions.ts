import React, { useMemo } from 'react';
import { DropdownOption } from '../type';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

export const getOptionsFromChildren = (children: React.ReactElement): DropdownOption[] => {
  if (!children) return [];

  if (children.type === DropdownMenu) {
    const groupChildren = children.props.children as React.ReactElement;
    if (Array.isArray(groupChildren)) {
      return getOptionsFromChildren(groupChildren);
    }
  }

  return React.Children.toArray(children)
    .map((item: React.ReactElement) => {
      const groupChildren = item.props?.children;
      const contextRes = item.props?.content;

      if (Array.isArray(groupChildren)) {
        const contentCtx = groupChildren?.filter?.((v) => ![DropdownItem, DropdownMenu].includes(v.type));
        const childrenCtx = groupChildren?.filter?.((v) => [DropdownItem, DropdownMenu].includes(v.type));

        return {
          ...item.props,
          content: contentCtx || groupChildren,
          children: childrenCtx.length > 0 ? getOptionsFromChildren(groupChildren[1]) : null,
        };
      }
      return { ...item.props, content: groupChildren || contextRes, children: null };
    })
    .filter((v) => !!v.content);
};

export default function useDropdownOptions(
  children: (React.ReactChild | React.ReactFragment | React.ReactPortal)[],
  options: DropdownOption[],
): DropdownOption[] {
  const dropdownOptions = useMemo(() => {
    if (options && options.length > 0) return options;
    let dropdownMenuChild: React.ReactElement;
    React.Children.forEach(children, (child: React.ReactChild) => {
      if (!React.isValidElement(child)) return;

      if (child.type === DropdownMenu && (child.props as { children: React.ReactElement }).children) {
        dropdownMenuChild = (child.props as { children: React.ReactElement }).children;
      }
    });
    return getOptionsFromChildren(dropdownMenuChild);
  }, [options, children]);

  return dropdownOptions;
}
