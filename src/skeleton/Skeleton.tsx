import React, { useEffect, useRef, useState } from 'react';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';
import { SkeletonRowCol, SkeletonRowColObj, TdSkeletonProps } from './type';

import { StyledProps, Styles } from '../common';
import useConfig from '../hooks/useConfig';
import useCountUp from '../hooks/useCountUp';
import { pxCompat } from '../_util/helper';
import parseTNode from '../_util/parseTNode';
import { skeletonDefaultProps } from './defaultProps';

export type SkeletonProps = TdSkeletonProps & StyledProps;

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

// 超过delay时长，loading仍为true时，为解决骨架屏一闪而过问题，默认骨架屏存在时长50ms
const DEFAULT_DURATION = 500;
// 统计loading时长的最小时间间隔
const DEFAULT_MIN_INTERVAL = 16.7;

const Skeleton = (props: SkeletonProps) => {
  const { animation, loading, rowCol, theme, className, style, children } = props;
  let { delay = 0 } = props;
  // delay最小值为统计loading时长的最小时间间隔，一般在loading时长大于34时，骨架屏才生效
  if (delay > 0 && delay < DEFAULT_MIN_INTERVAL) {
    delay = DEFAULT_MIN_INTERVAL;
  }
  const loadingTime = useRef(0);
  const [ctrlLoading, setCtrlLoading] = useState(loading);
  const { classPrefix } = useConfig();

  const aChange = (currentTime) => {
    loadingTime.current = currentTime;
    if (currentTime > delay) {
      setCtrlLoading(true);
    }
  };
  const aFinish = () => {
    setCtrlLoading(false);
  };
  const { start, stop } = useCountUp({
    onChange: aChange,
    onFinish: aFinish,
  });
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

  // 清除骨架屏
  const clearSkeleton = () => {
    setCtrlLoading(false);
    stop();
  };

  useEffect(() => {
    // 骨架屏无需展示
    if (!loading) {
      // 加载时长超过delay时，需加载DEFAULT_DURATION时长的骨架屏
      if (delay > 0 && loadingTime.current > delay) {
        setCtrlLoading(true);
        const timeout = setTimeout(() => {
          clearSkeleton();
        }, DEFAULT_DURATION);
        return () => clearTimeout(timeout);
      }
      // 直接展示内容
      clearSkeleton();
    } else {
      // 存在delay时，暂不展示骨架屏
      if (delay > 0) {
        setCtrlLoading(false);
        start();
        return stop;
      }
      // 直接展示骨架屏
      setCtrlLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, loading]);

  if (!ctrlLoading) {
    return <>{children || props.content}</>;
  }

  const childrenContent = [];

  if (rowCol) {
    childrenContent.push(renderRowCol(rowCol));
  } else if (theme) {
    childrenContent.push(renderRowCol(ThemeMap[theme]));
  } else {
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
