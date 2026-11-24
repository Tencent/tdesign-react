import React from 'react';
import cx from 'classnames';

import type { TNode } from '../common';
import type { ActionSheetProps } from './ActionSheet';
import type { ActionSheetItem } from './type';

import { Button } from '../button';
import { Badge } from '../badge';
import { usePrefixClass } from '../hooks/useClass';

type ActionSheetListProps = Pick<ActionSheetProps, 'items'> & {
  onSelected?: (idx: number) => void;
};

export function ActionSheetList(props: ActionSheetListProps) {
  const { items = [], onSelected } = props;

  const actionSheetClass = usePrefixClass('action-sheet');

  const renderTNode = (node: TNode) => {
    if (!node) return null;
    if (typeof node === 'function') {
      return node();
    }
    return node;
  };

  return (
    <div className={cx(`${actionSheetClass}__list`)}>
      {items?.map((item: ActionSheetItem, idx: number) => {
        let label: React.ReactNode;
        let disabled: ActionSheetItem['disabled'];
        let color: ActionSheetItem['color'];

        if (typeof item === 'string') {
          label = <span className={cx([`${actionSheetClass}__list-item-text`])}>{item}</span>;
        } else {
          if (item?.badge) {
            label = (
              <Badge
                count={item?.badge?.count}
                max-count={item?.badge?.maxCount}
                dot={item?.badge?.dot}
                content={item?.badge?.content}
                size={item?.badge?.size}
                offset={item?.badge?.offset}
              >
                <span className={cx([`${actionSheetClass}__list-item-text`])}>{item?.label}</span>
              </Badge>
            );
          } else {
            label = <span className={cx([`${actionSheetClass}__list-item-text`])}>{item?.label}</span>;
          }
          disabled = item?.disabled;
          color = item?.color;
        }

        const prefixIcon = renderTNode(item?.icon);
        const suffixIcon = renderTNode(item?.suffixIcon);
        const desc = item?.description;
        const content = (
          <>
            <div className={`${actionSheetClass}__list-item-content`}>
              {prefixIcon && <div className={`${actionSheetClass}__list-item-icon`}>{prefixIcon}</div>}
              {label}
              {suffixIcon && (
                <div className={`${actionSheetClass}__list-item-icon ${actionSheetClass}__list-item-suffix-icon`}>
                  {suffixIcon}
                </div>
              )}
            </div>
            {desc && <div className={`${actionSheetClass}__list-item-desc`}>{desc}</div>}
          </>
        );

        return (
          <Button
            key={idx}
            variant="text"
            block
            className={cx({
              [`${actionSheetClass}__list-item`]: true,
              [`${actionSheetClass}__list-item--disabled`]: disabled,
            })}
            onClick={() => {
              onSelected?.(idx);
            }}
            disabled={disabled}
            style={{
              color,
            }}
            shape="rectangle"
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
}
