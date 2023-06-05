import React, { useEffect, useState } from 'react';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';
import { SkeletonRowCol, SkeletonRowColObj, TdSkeletonProps } from './type';

import { StyledProps, Styles } from '../common';
import useConfig from '../hooks/useConfig';
import { pxCompat } from '../_util/helper';
import parseTNode from '../_util/parseTNode';
import { skeletonDefaultProps } from './defaultProps';

export type SkeletonProps = TdSkeletonProps & StyledProps & { children: React.ReactNode };

const ThemeMap: Record<TdSkeletonProps['theme'], SkeletonRowCol> = {
  text: [1],
  avatar: [{ type: 'circle', size: '56px' }],
  paragraph: [1, 1, { width: '70%' }],
  'avatar-text': [[{ type: 'circle' }, { type: 'text', height: '32px' }]],
  tab: [{ height: '30px' }, { height: '200px' }],
  article: [
    { type: 'rect', height: '30px', width: '100%' },
    { type: 'rect', height: '200px', width: '100%' },
    ...[3, 2, 2, 2].map((value) => Array(value).fill({ type: 'text', height: '30px' })),
  ],
};

const Skeleton = (props: SkeletonProps) => {
  const { animation, loading, rowCol, theme, className, style, delay = 0, children } = props;

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-skeleton`; // t-skeleton

  const renderCols = (_cols: Number | SkeletonRowColObj | Array<SkeletonRowColObj>) => {
    const getColItemClass = (obj: SkeletonRowColObj) =>
      classNames(`${name}__col`, `${name}--type-${obj.type || 'text'}`, {
        [`${name}--animation-${animation}`]: animation,
      });

    const getColItemStyle = (obj: SkeletonRowColObj): Styles => {
      const styleName = [
        'width',
        'height',
        'marginRight',
        'marginLeft',
        'margin',
        'size',
        'background',
        'backgroundColor',
      ];
      const style: Styles = {};
      styleName.forEach((name) => {
        if (name in obj) {
          const px = pxCompat(obj[name]);
          if (name === 'size') {
            [style.width, style.height] = [px, px];
          } else {
            style[name] = px;
          }
        }
      });
      return style;
    };

    let cols: Array<SkeletonRowColObj> = [];
    if (Array.isArray(_cols)) {
      cols = _cols;
    } else if (isNumber(_cols)) {
      cols = new Array(_cols).fill({ type: 'text' });
    } else {
      cols = [_cols as SkeletonRowColObj];
    }

    return cols.map((item, index) => (
      <div key={index} className={getColItemClass(item)} style={getColItemStyle(item)}>
        {parseTNode(item.content)}
      </div>
    ));
  };

  const renderRowCol = (_rowCol?: SkeletonRowCol) => {
    const renderedRowCol: SkeletonRowCol = _rowCol || rowCol;

    return renderedRowCol.map((item, index) => (
      <div key={index} className={`${name}__row`}>
        {renderCols(item)}
      </div>
    ));
  };

  const [ctrlLoading, setCtrlLoading] = useState(loading);

  useEffect(() => {
    if (delay > 0 && !loading) {
      const timeout = setTimeout(() => {
        setCtrlLoading(loading);
      }, delay);
      return () => clearTimeout(timeout);
    }

    setCtrlLoading(loading);
  }, [delay, loading]);

  if (!ctrlLoading) {
    return <>{children}</>;
  }

  const childrenContent = [];
  if (theme && !rowCol) {
    childrenContent.push(renderRowCol(ThemeMap[theme]));
  }
  if (rowCol) {
    childrenContent.push(renderRowCol(rowCol));
  }
  if (!theme && !rowCol) {
    // 什么都不传时，传入默认 rowCol
    childrenContent.push(renderRowCol([1, 1, 1, { width: '70%' }]));
  }

  return (
    <div className={className} style={style}>
      {childrenContent}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';
Skeleton.defaultProps = skeletonDefaultProps;

export default Skeleton;
