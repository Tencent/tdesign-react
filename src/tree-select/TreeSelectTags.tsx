import React from 'react';
import { TdTreeSelectProps, TreeSelectValue } from '../_type/components/tree-select';
import { TreeOptionData } from '../_type';
import Tag from '../tag';

export interface TreeSelectTagsProps extends TdTreeSelectProps {
  tagList: Array<TreeSelectValue>,
}

export default function TreeSelectTags(props: TreeSelectTagsProps) {
  const { tagList, minCollapsedNum, collapsedItems, disabled, size, value, data, onRemove, onChange } = props;

  if (!tagList.length) return null;

  function removeTag(index: number, data: TreeOptionData, e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.stopPropagation();
    if (disabled || !Array.isArray(value)) return;

    onRemove?.({ value: value[index], data, e });
    onChange?.(value.filter((_, i) => i !== index) as Array<TreeSelectValue>, null);
  }

  let tags = tagList.map((label, index) => (
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

  if (minCollapsedNum) {
    tags = tags.slice(0, minCollapsedNum);

    const nums = tagList.length - minCollapsedNum;
    nums && tags.push(
      <Tag key={`collapsed-${nums}`} size={size} disabled={disabled}>
        { collapsedItems || `+${nums}` }
      </Tag>
    );
  }

  return <>{tags}</>;
}
