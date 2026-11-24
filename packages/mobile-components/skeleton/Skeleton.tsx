import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { isArray, isNumber } from 'lodash-es';
import { SkeletonRowCol, SkeletonRowColObj, TdSkeletonProps } from './type';
import { StyledProps, Styles } from '../common';
import { skeletonDefaultProps } from './defaultProps';
import { pxCompat } from '../_util/helper';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';

export interface SkeletonProps extends TdSkeletonProps, StyledProps {}

const ThemeMap: Record<TdSkeletonProps['theme'], SkeletonRowCol> = {
  avatar: [{ type: 'circle', size: '48px' }],
  image: [{ type: 'rect', size: '72px' }],
  text: [
    [
      { width: '24%', height: '16px', marginRight: '16px' },
      { width: '76%', height: '16px' },
    ],
    1,
  ],
  paragraph: [1, 1, 1, { width: '55%' }],
};

const Skeleton: React.FC<SkeletonProps> = (props) => {
  const skeletonClass = usePrefixClass('skeleton');
  const { className, style, children, animation, delay, loading, rowCol, theme } = useDefaultProps<SkeletonProps>(
    props,
    skeletonDefaultProps,
  );

  const renderCols = (_cols: number | SkeletonRowColObj | Array<SkeletonRowColObj>) => {
    let cols: Array<SkeletonRowColObj> = [];
    if (isArray(_cols)) {
      cols = _cols;
    } else if (isNumber(_cols)) {
      cols = new Array(_cols).fill({ type: 'text' });
    } else {
      cols = [_cols as SkeletonRowColObj];
    }

    const getColItemClass = (obj: SkeletonRowColObj) =>
      classNames(`${skeletonClass}__col`, `${skeletonClass}--type-${obj.type || 'text'}`, {
        [`${skeletonClass}--animation-${animation}`]: animation,
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
        'borderRadius',
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

    return cols.map((obj, index) => (
      <div key={index} className={getColItemClass(obj)} style={getColItemStyle(obj)}>
        {parseTNode(obj.content)}
      </div>
    ));
  };

  const renderRowCol = (_rowCol?: SkeletonRowCol) => {
    const renderedRowCol: SkeletonRowCol = _rowCol;

    return renderedRowCol.map<React.ReactNode>((item, index) => (
      <div key={index} className={`${skeletonClass}__row`}>
        {renderCols(item)}
      </div>
    ));
  };

  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (!loading) {
      setIsLoading(loading);
      return;
    }

    if (delay > 0) {
      const timeout = setTimeout(() => {
        setIsLoading(loading);
      }, delay);
      return () => clearTimeout(timeout);
    }

    setIsLoading(loading);
  }, [delay, loading]);

  if (!isLoading) {
    return <>{parseTNode(children)}</>;
  }

  const childrenContent: React.ReactNode[] = [];

  // 保持优先级： rowCol > theme，增加默认值兜底
  if (rowCol) {
    childrenContent.push(renderRowCol(rowCol));
  } else if (theme) {
    childrenContent.push(renderRowCol(ThemeMap[theme]));
  } else if (!theme && !rowCol) {
    // 什么都不传时，传入默认 rowCol
    childrenContent.push(
      renderRowCol([
        [
          { width: '24%', height: '16px', marginRight: '16px' },
          { width: '76%', height: '16px' },
        ],
        1,
      ]),
    );
  }

  return (
    <div className={className} style={style}>
      {childrenContent}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
