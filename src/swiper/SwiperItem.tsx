import React from 'react';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import { SwiperProps } from './Swiper';

export interface SwiperItemProps extends SwiperProps {
  currentIndex?: number;
  index?: number;
  needAnimation?: boolean;
  childrenLength?: number;
  getWrapAttribute?: (attr: string) => number;
}

const CARD_SCALE = 210 / 332; // 缩放比例
const itemWidth = 0.415; // 依据设计稿使用t-swiper__card控制每个swiper的宽度为41.5%

const disposeIndex = (index: number, currentIndex: number, childrenLength: number) => {
  if (currentIndex === 0 && index === childrenLength - 1) {
    return -1;
  }
  if (currentIndex === childrenLength - 1 && index === 0) {
    return childrenLength;
  }
  if (index < currentIndex - 1 && currentIndex - index >= childrenLength / 2) {
    return childrenLength + 1;
  }
  if (index > currentIndex + 1 && index - currentIndex >= childrenLength / 2) {
    return -2;
  }

  return index;
};

const calculateTranslate = (index: number, currentIndex: number, parentWidth: number, inStage: boolean) => {
  if (inStage) {
    return (parentWidth * ((index - currentIndex) * (1 - itemWidth * CARD_SCALE) - itemWidth + 1)) / 2;
  }
  if (index < currentIndex) {
    return (-itemWidth * (1 + CARD_SCALE) * parentWidth) / 2;
  }
  return ((2 + itemWidth * (CARD_SCALE - 1)) * parentWidth) / 2;
};

const getZindex = (isActivity, inStage) => {
  if (isActivity) {
    return 2;
  }
  if (inStage) {
    return 1;
  }
  return 0;
};

const SwiperItem = (props: SwiperItemProps) => {
  const {
    children,
    currentIndex,
    index,
    animation,
    duration = 300,
    needAnimation,
    type = 'default',
    childrenLength,
    getWrapAttribute,
  } = props;
  const { classPrefix } = useConfig();

  const getSwiperItemStyle = () => {
    if (animation === 'fade') {
      return {
        opacity: currentIndex === index ? 1 : 0,
        transition: needAnimation ? `opacity ${duration / 1000}s` : '',
      };
    }
    if (type === 'card') {
      const wrapWidth = getWrapAttribute('offsetWidth');
      const translateIndex =
        index !== currentIndex && childrenLength > 2 ? disposeIndex(index, currentIndex, childrenLength) : index;
      const inStage = Math.round(Math.abs(translateIndex - currentIndex)) <= 1;
      const translate = calculateTranslate(translateIndex, currentIndex, wrapWidth, inStage).toFixed(2);
      const isActivity = translateIndex === currentIndex;
      const zIndex = getZindex(isActivity, inStage);
      return {
        msTransform: `translateX(${translate}px) scale(${isActivity ? 1 : CARD_SCALE})`,
        WebkitTransform: `translateX(${translate}px) scale(${isActivity ? 1 : CARD_SCALE})`,
        transform: `translateX(${translate}px) scale(${isActivity ? 1 : CARD_SCALE})`,
        transition: `transform ${duration / 1000}s ease`,
        zIndex,
      };
    }
    return {};
  };

  return (
    <div
      className={classnames(`${classPrefix}-swiper__container__item`, {
        [`${classPrefix}-swiper__card`]: type === 'card',
        [`${classPrefix}-is-active`]: type === 'card' && index === currentIndex,
        [`${classPrefix}-swiper__fade`]: animation === 'fade',
      })}
      style={getSwiperItemStyle()}
    >
      {children}
    </div>
  );
};

SwiperItem.displayName = 'SwiperItem';

export default SwiperItem;
