import React, { Fragment, useMemo } from 'react';
import { TdTreeSelectProps, TreeSelectValue } from './type';
import { TreeOptionData } from '../common';
import Tag from '../tag';

export interface TreeSelectTagsProps extends TdTreeSelectProps {
  tagList: Array<TreeSelectValue>;
}

export default function TreeSelectTags(props: TreeSelectTagsProps) {
  const { tagList, minCollapsedNum, multiple, collapsedItems, disabled, size, value, data, onRemove, onChange } = props;

  const collapsedSelectedItems = useMemo(() => {
    if (!multiple || minCollapsedNum <= 0 || !Array.isArray(value)) return [];
    const optionsMap: Record<string | number, TreeOptionData> = {};
    function walk(data: TreeOptionData[]) {
      Array.isArray(data) &&
        data.forEach((option) => {
          optionsMap[option.value] = option;
          walk(option.children);
        });
    }
    walk(data);
    return value.slice(minCollapsedNum).map((value) => optionsMap[value as number | string]);
  }, [value, minCollapsedNum, data, multiple]);

  if (!tagList.length) return null;

  function removeTag(index: number, data: TreeOptionData, e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.stopPropagation();
    if (disabled || !Array.isArray(value)) return;

    onRemove?.({ value: value[index], data, e });
    onChange?.(value.filter((_, i) => i !== index) as Array<TreeSelectValue>, null);
  }

  const tags = tagList.slice(0, minCollapsedNum > 0 ? minCollapsedNum : undefined).map((label, index) => (
    <Tag
      key={index}
      size={size}
      closable={!disabled}
      disabled={disabled}
      onClose={({ e }) => removeTag(index, data, e)}
    >
      {label}
    </Tag>
  ));

  if (minCollapsedNum > 0) {
    const nums = tagList.length - minCollapsedNum;
    nums > 0 &&
      tags.push(
        <Fragment key={`collapsed-${nums}`}>
          {typeof collapsedItems === 'function'
            ? collapsedItems({
                value: data,
                collapsedSelectedItems,
                count: nums,
              })
            : collapsedItems ?? (
                <Tag size={size} disabled={disabled}>
                  +{nums}
                </Tag>
              )}
        </Fragment>,
      );
  }

  return <>{tags}</>;
}
