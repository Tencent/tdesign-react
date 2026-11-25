import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import SwiperContext from './SwiperContext';

import type { CSSProperties, FC } from 'react';
import type { StyledProps } from '../common';

export interface SwiperItemProps extends StyledProps {
  children?: React.ReactNode;
  hostStyle?: CSSProperties;
}

const SwiperItem: FC<SwiperItemProps> = (originProps) => {
  const props = useDefaultProps(originProps, {});
  const { children, style, hostStyle } = props;
  const swiperItemClass = usePrefixClass('swiper-item');
  const imageHostClass = `${swiperItemClass}--image-host`;
  const { addChild, removeChild, forceContainerHeight } = useContext(SwiperContext);
  const [rootStyle, setRootStyle] = useState(style);
  const hostRef = useRef<HTMLDivElement>(null);
  const [classNameSuffix, setClassNameSuffix] = useState('');

  const updateTranslateStyle = useCallback(
    (transform: string) => {
      setRootStyle({ transform, ...style });
    },
    [style],
  );

  const updateClassNameSuffix = (suffix: string) => {
    setClassNameSuffix(suffix);
  };

  useEffect(() => {
    addChild({ divRef: hostRef, updateTranslateStyle, updateClassNameSuffix });
    const rect = hostRef.current?.getBoundingClientRect();
    forceContainerHeight(rect?.height);
    return () => {
      removeChild(hostRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addChild, removeChild]);

  const itemClassName = useMemo(
    () => classNames(swiperItemClass, classNameSuffix?.length ? `${swiperItemClass}${classNameSuffix}` : ''),
    [classNameSuffix, swiperItemClass],
  );

  const hostClassName = useMemo(
    () => classNames(imageHostClass, classNameSuffix?.length ? `${imageHostClass}${classNameSuffix}` : ''),
    [classNameSuffix, imageHostClass],
  );

  return (
    <div className={itemClassName} style={rootStyle}>
      <div className={hostClassName} ref={hostRef} style={hostStyle}>
        {parseTNode(children)}
      </div>
    </div>
  );
};

SwiperItem.displayName = 'SwiperItem';

export default SwiperItem;
