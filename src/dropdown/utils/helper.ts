import React from 'react';
import { DropdownOption } from '../type';
import DropdownMenu from '../DropdownMenu';

export const getOptionsFromChildren = (children: React.ReactElement): DropdownOption[] => {
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
      return { ...item.props, content: item.props.children || item.props.content };
    });
  }

  return [];
};
