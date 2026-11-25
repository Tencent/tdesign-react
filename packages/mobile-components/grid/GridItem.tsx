import React, { useContext, useMemo } from 'react';
import cls from 'classnames';
import { isFunction, isObject, isString } from 'lodash-es';

import parseTNode from '../_util/parseTNode';
import Badge from '../badge';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import Image from '../image';
import { gridItemDefaultProps } from './defaultProps';
import { GridContext } from './GridContext';

import type { FC } from 'react';
import type { TdGridItemProps, TdGridProps } from './type';

const getGridItemWidth = (column: number) => (column > 0 ? `${100 / column}%` : 0);

export interface GridItemProp extends TdGridItemProps, TdGridProps {}

const GridItem: FC<GridItemProp> = (prop) => {
  const { description, image, layout, text, badge, ...resetProps } = useDefaultProps(prop, gridItemDefaultProps);

  const { classPrefix } = useConfig();
  const { align, gutter, column, border } = useContext(GridContext);

  const name = `${classPrefix}-grid-item`;

  const rootClass = useMemo(
    () =>
      cls(name, `${name}--${layout}`, {
        [`${name}--bordered`]: border,
        [`${name}--surround`]: border && gutter,
      }),
    [border, name, gutter, layout],
  );

  const rootStyle = useMemo(() => {
    const percent = getGridItemWidth(column);
    const style: React.CSSProperties = {
      textAlign: ['center', 'left'].includes(align) ? align : 'center',
    };
    if (percent !== 0) {
      style.flexBasis = percent;
    }
    return style;
  }, [column, align]);

  const size = useMemo(() => {
    if (!column || column === 4) return 'middle';
    return column > 4 ? 'small' : 'large';
  }, [column]);

  const gridItemImage = useMemo(() => {
    if (!image) {
      return null;
    }
    let imgProps: Record<string, any>;
    if (isString(image)) {
      imgProps = { src: image };
    }
    if (isObject(image) && !isFunction(image) && !React.isValidElement(image)) {
      imgProps = image;
    }
    return imgProps ? <Image shape="round" {...imgProps} /> : parseTNode(image as React.ReactNode);
  }, [image]);

  return (
    <div {...resetProps} className={rootClass} style={rootStyle}>
      <div className={cls([`${name}__image`, `${name}__image--${size}`])}>
        {badge ? <Badge {...badge}>{gridItemImage}</Badge> : gridItemImage}
      </div>
      <div className={cls([`${name}__content`, `${name}__content--${layout}`])}>
        <div className={cls([`${name}__title`, `${name}__title--${size}`])}>{parseTNode(text)}</div>
        <div className={cls([`${name}__description`, `${name}__description--${layout}`])}>
          {parseTNode(description)}
        </div>
      </div>
    </div>
  );
};

GridItem.displayName = 'GridItem';

export default GridItem;
