import React, { Fragment, useMemo } from 'react';
import { TdTreeSelectProps, TreeSelectValue } from './type';
import { TreeOptionData } from '../common';
import Tag from '../tag';
import { NodeOptions } from './TreeSelect';

export interface TreeSelectTagsProps extends TdTreeSelectProps {
  tagList: Array<NodeOptions>;
}

export default function TreeSelectTags(props: TreeSelectTagsProps) {
  const { minCollapsedNum, multiple, collapsedItems, disabled, size, value, data } = props;
  const { tagList, onRemove, onChange, valueDisplay } = props;

  const displaySelectedItems = useMemo(
    () => tagList.slice(0, minCollapsedNum > 0 ? minCollapsedNum : undefined),
    [minCollapsedNum, tagList],
  );

  const collapsedSelectedItems = useMemo(() => {
    if (!multiple || minCollapsedNum <= 0 || !Array.isArray(tagList)) return [];
    return tagList.slice(minCollapsedNum);
  }, [multiple, minCollapsedNum, tagList]);

  if (!tagList.length) return null;

  function removeTag(index: number, data: TreeOptionData, e?: React.MouseEvent<SVGElement | HTMLDivElement>) {
    e?.stopPropagation();
    if (disabled || !Array.isArray(value)) return;

    onRemove?.({ value: value[index], data, e });
    onChange?.(value.filter((_, i) => i !== index) as Array<TreeSelectValue>, null);
  }

  const tags = valueDisplay
    ? valueDisplay({
        value: displaySelectedItems,
        onClose: (index) => {
          index ?? removeTag(index, data);
        },
      })
    : displaySelectedItems.map((tag, index) => (
        <Tag
          key={index}
          size={size}
          closable={!disabled}
          disabled={disabled}
          onClose={({ e }) => removeTag(index, data, e)}
        >
          {tag.label}
        </Tag>
      ));

  const collapsedTags = collapsedSelectedItems.length > 0 && (
    <Fragment key={`collapsed-${collapsedSelectedItems.length}`}>
      {typeof collapsedItems === 'function'
        ? collapsedItems({
            value: tagList,
            collapsedSelectedItems,
            count: collapsedSelectedItems.length,
          })
        : collapsedItems ?? (
            <Tag size={size} disabled={disabled}>
              +{collapsedSelectedItems.length}
            </Tag>
          )}
    </Fragment>
  );

  return (
    <>
      {tags}
      {collapsedTags}
    </>
  );
}
