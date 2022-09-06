import React from 'react';
import { DropdownOption } from '../type';
import DropdownMenu from '../DropdownMenu';

export const getOptionsFromChildren = (children: React.ReactElement): DropdownOption[] => {
  if (!children) return [];

  if (children.type === DropdownMenu) {
    const groupChildren = children.props.children as React.ReactElement;
    if (Array.isArray(groupChildren)) {
      return getOptionsFromChildren(groupChildren);
    }
  }

  if (Array.isArray(children)) {
    return children.map((item: React.ReactElement) => {
      const groupChildren = item.props.children;
      if (Array.isArray(groupChildren)) {
        const contentIdx = groupChildren.findIndex((v) => typeof v === 'string');
        return {
          ...item.props,
          content: groupChildren[contentIdx],
          children: getOptionsFromChildren(groupChildren[1]),
        };
      }
      return { ...item.props, content: item.props.children || item.props.content, children: null };
    });
  }

  return [];
};

export default function useDropdownOptions(
  children: (React.ReactChild | React.ReactFragment | React.ReactPortal)[],
  options: DropdownOption[],
): DropdownOption[] {
  if (options) return options;

  let dropdownMenuChild: React.ReactElement;
  React.Children.forEach(children, (child: React.ReactChild) => {
    if (!React.isValidElement(child)) return;

    if (child.type === DropdownMenu && child.props.children) {
      dropdownMenuChild = child.props.children;
    }
  });
  return getOptionsFromChildren(dropdownMenuChild);
}
