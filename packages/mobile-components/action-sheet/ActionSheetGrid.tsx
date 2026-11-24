import React, { useMemo } from 'react';
import cx from 'classnames';
import type { ActionSheetProps } from './ActionSheet';
import type { ActionSheetItem } from './type';
import type { TNode } from '../common';
import { Grid, GridItem } from '../grid';
import { Swiper } from '../swiper';
import { usePrefixClass } from '../hooks/useClass';

type ActionSheetGridProps = Pick<ActionSheetProps, 'items'> & {
  onSelected?: (idx: number) => void;
  count?: number;
};

export function ActionSheetGrid(props: ActionSheetGridProps) {
  const { items = [], count = 8, onSelected } = props;

  const actionSheetClass = usePrefixClass('action-sheet');

  const gridColumn = Math.ceil(count / 2);
  const pageNum = Math.ceil(items.length / count);

  const actionItems = useMemo(() => {
    const res: ActionSheetProps['items'][] = [];
    for (let i = 0; i < pageNum; i++) {
      const temp = items.slice(i * count, (i + 1) * count);
      res.push(temp);
    }
    return res;
  }, [items, count, pageNum]);

  return (
    <div
      className={cx({
        [`${actionSheetClass}__grid`]: true,
        [`${actionSheetClass}__grid--swiper`]: pageNum > 1,
        [`${actionSheetClass}__dots`]: pageNum > 1,
      })}
    >
      <Swiper
        autoplay={false}
        className={cx(`${actionSheetClass}__swiper-wrap--base`, pageNum > 1 && `${actionSheetClass}__swiper-wrap`)}
        loop={false}
        navigation={pageNum > 1 ? { type: 'dots' } : undefined}
        direction="horizontal"
        height={pageNum > 1 ? 208 : 196}
      >
        {actionItems.map((item, idx1) => (
          <Swiper.SwiperItem key={idx1}>
            <Grid gutter={0} column={gridColumn} style={{ width: '100%' }}>
              {item.map((it: ActionSheetItem, idx2: number) => {
                let label: string;
                let image: TNode;
                let badge: ActionSheetItem['badge'];
                if (typeof it === 'string') {
                  label = it;
                } else {
                  label = it.label;
                  image = it.icon;
                  badge = it.badge;
                }
                return (
                  <GridItem
                    key={`${idx1}-${idx2}`}
                    image={image}
                    text={label}
                    description={it.description}
                    badge={badge}
                    // @ts-ignore
                    onClick={() => {
                      onSelected?.(idx1 * count + idx2);
                    }}
                  />
                );
              })}
            </Grid>
          </Swiper.SwiperItem>
        ))}
      </Swiper>
    </div>
  );
}
