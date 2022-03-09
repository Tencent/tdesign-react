import React from 'react';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import { SwiperProps } from './Swiper';

export interface SwiperItemProps extends SwiperProps {
  currentIndex?: number;
  index?: number;
  needAnimation?: boolean;
  childrenLength?: number;
  getWrapAttribute?: (attr: string) => number;
}

const CARD_SCALE = 0.63;

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
  const wrapWidth = getWrapAttribute('offsetWidth');

  const disposeIndex = (index, currentIndex, childrenLength) => {
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
    const denominator = 3.4;
    if (inStage) {
      // if (index === -1) {
      //   console.log('====', (2 - CARD_SCALE) * (index - currentIndex) + 1);
      // }
      // // console.log((parentWidth * ((2 - CARD_SCALE) * (index - currentIndex) + 1)) / denominator, '=======');
      // return (parentWidth * ((2 - CARD_SCALE) * (index - currentIndex) + 1)) / denominator;
      if (index < currentIndex) return -parentWidth * 0.07625;
      if (index === currentIndex) return parentWidth * 0.2925;
      if (index > currentIndex) {
        return parentWidth * 0.66125;
      }
      // return parentWidth - parentWidth * 0.415 * CARD_SCALE - parentWidth * 0.415 * (1 - CARD_SCALE) * 0.5;
    }
    if (index < currentIndex) {
      // console.log('===index', index);
      return (-(1 + CARD_SCALE) * parentWidth) / denominator;
    }
    return ((denominator - 1 + CARD_SCALE) * parentWidth) / denominator;
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

  const getSwiperItemStyle = () => {
    if (animation === 'fade') {
      return {
        opacity: currentIndex === index ? 1 : 0,
        transition: needAnimation ? `opacity ${duration / 1000}s` : '',
      };
    }
    if (type === 'card') {
      const translateIndex =
        index !== currentIndex && childrenLength > 2 ? disposeIndex(index, currentIndex, childrenLength) : index;
      const inStage = Math.round(Math.abs(translateIndex - currentIndex)) <= 1;
      console.log('translateIndex', translateIndex, inStage);
      const translate = calculateTranslate(translateIndex, currentIndex, wrapWidth, inStage).toFixed(2);
      const isActivity = translateIndex === currentIndex;
      return {
        msTransform: `translateX(${translate}px) scale(${isActivity ? 1 : CARD_SCALE})`,
        WebkitTransform: `translateX(${translate}px) scale(${isActivity ? 1 : CARD_SCALE})`,
        transform: `translateX(${translate}px) scale(${isActivity ? 1 : CARD_SCALE})`,
        transition: `transform ${duration / 1000}s`,
        zIndex: getZindex(isActivity, inStage),
        translateIndex,
      };
    }
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
      {/* {
        <div style={{ color: 'red', position: 'absolute', top: '10px', left: '50px', fontSize: '20px' }}>
          {getSwiperItemStyle().translateIndex}
        </div>
      } */}
    </div>
  );
};

SwiperItem.displayName = 'SwiperItem';

export default SwiperItem;
