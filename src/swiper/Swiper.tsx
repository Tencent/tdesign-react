import React, { useState, useEffect, useCallback, useMemo, useRef, isValidElement } from 'react';
import classnames from 'classnames';
import { ChevronLeftIcon as TdChevronLeftIcon, ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import noop from '../_util/noop';
import { TdSwiperProps, SwiperChangeSource, SwiperNavigation } from './type';
import { StyledProps } from '../common';
import { swiperDefaultProps } from './defaultProps';

import SwiperItem from './SwiperItem';

export interface SwiperProps extends TdSwiperProps, StyledProps {
  children?: React.ReactNode;
}

enum CreateArrow {
  Default = 'default',
  Fraction = 'fraction',
}

enum ArrowClickDirection {
  Left = 'left',
  Right = 'right',
}

enum MouseAction {
  Enter = 'enter',
  Leave = 'leave',
  Click = 'click',
}

const defaultNavigation: SwiperNavigation = {
  placement: 'inside',
  showSlideBtn: 'always',
  size: 'medium',
  type: 'bars',
};

const Swiper = (props: SwiperProps) => {
  const {
    animation, // 轮播切换动画效果类型
    autoplay, // 是否自动播放
    current, // 当前轮播在哪一项（下标）
    defaultCurrent, // 当前轮播在哪一项（下标），非受控属性
    direction, // 轮播滑动方向，包括横向滑动和纵向滑动两个方向
    duration, // 滑动动画时长
    interval, // 轮播间隔时间
    trigger,
    height,
    loop,
    stopOnHover,
    onChange = noop, // 轮播切换时触发
    className,
    children,
    navigation,
    type,
  } = props;
  const { classPrefix } = useConfig();
  const { ChevronLeftIcon, ChevronRightIcon } = useGlobalIcon({
    ChevronLeftIcon: TdChevronLeftIcon,
    ChevronRightIcon: TdChevronRightIcon,
  });

  let navigationConfig = defaultNavigation;
  let navigationNode = null;
  if (isValidElement(navigation)) {
    navigationNode = navigation;
  } else {
    navigationConfig = { ...defaultNavigation, ...(navigation as SwiperNavigation) };
  }

  const [currentIndex, setCurrentIndex] = useState(defaultCurrent);
  const [needAnimation, setNeedAnimation] = useState(false);
  const [arrowShow, setArrowShow] = useState(navigationConfig.showSlideBtn === 'always');
  const swiperTimer = useRef(null); // 计时器指针
  const swiperAnimationTimer = useRef(null); // 计时器指针
  const isHovering = useRef(false);
  const swiperWrap = useRef(null);
  const preCurrent = useRef(defaultCurrent - 0);

  const getWrapAttribute = (attr) => swiperWrap.current?.parentNode?.[attr];

  // 进行子组件筛选，创建子节点列表
  const childrenList = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child: JSX.Element) => child.type.displayName === SwiperItem.displayName,
      ),
    [children],
  );
  const childrenLength = childrenList.length;

  // 创建渲染用的节点列表
  const swiperItemList = childrenList.map((child: JSX.Element, index: number) =>
    React.cloneElement(child, {
      key: index,
      index,
      currentIndex,
      needAnimation,
      childrenLength,
      getWrapAttribute,
      ...props,
      ...child.props,
    }),
  );
  // 子节点不为空时，复制第一个子节点到列表最后
  if (childrenLength > 0 && type === 'default') {
    const firstEle = swiperItemList[0];
    swiperItemList.push(
      React.cloneElement(firstEle, { ...firstEle.props, key: childrenLength, index: childrenLength }),
    );
  }
  const swiperItemLength = swiperItemList.length;

  // 统一跳转处理函数
  const swiperTo = useCallback(
    (index: number, context: { source: SwiperChangeSource }) => {
      // 事件通知
      onChange(index % childrenLength, context);
      if (index !== currentIndex) {
        // 设置内部 index
        setNeedAnimation(true);
        setCurrentIndex(index);
      }
    },
    [childrenLength, currentIndex, onChange],
  );

  // 定时器
  const setTimer = useCallback(() => {
    if (autoplay && interval > 0) {
      swiperTimer.current = setTimeout(
        () => {
          swiperTo(currentIndex + 1, { source: 'autoplay' });
        },
        currentIndex === 0 ? interval - (duration + 50) : interval, // 当 index 为 0 的时候，表明刚从克隆的最后一项跳转过来，已经经历了duration + 50 的间隔时间，减去即可
      );
    }
  }, [autoplay, currentIndex, duration, interval, swiperTo]);

  const clearTimer = useCallback(() => {
    if (swiperTimer.current) {
      clearTimeout(swiperTimer.current);
      swiperTimer.current = null;
    }
  }, []);

  const isEnd = useCallback(() => {
    if (type === 'card') {
      return !loop && currentIndex + 1 >= swiperItemLength;
    }
    return !loop && currentIndex + 2 >= swiperItemLength;
  }, [loop, currentIndex, swiperItemLength, type]);

  // 监听 current 参数变化
  useEffect(() => {
    if (current !== undefined) {
      const nextCurrent = current % childrenLength;
      if (nextCurrent === 0 && preCurrent.current === childrenLength - 1) {
        swiperTo(childrenLength, { source: 'autoplay' });
      } else {
        swiperTo(nextCurrent, { source: 'autoplay' });
      }
      preCurrent.current = nextCurrent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, childrenLength]);

  // 监听每次轮播结束
  useEffect(() => {
    if (currentIndex + 1 > swiperItemLength && type === 'card') {
      return setCurrentIndex(0);
    }
    if (swiperAnimationTimer.current) {
      clearTimeout(swiperAnimationTimer.current);
      swiperAnimationTimer.current = null;
    }
    swiperAnimationTimer.current = setTimeout(() => {
      setNeedAnimation(false);
      if (isEnd()) {
        clearTimer();
      }
      if (currentIndex + 1 >= swiperItemLength && type !== 'card') {
        setCurrentIndex(0);
      }
    }, duration + 50); // 多 50ms 的间隔时间参考了 react-slick 的动画间隔取值
  }, [currentIndex, swiperItemLength, duration, type, clearTimer, isEnd]);

  useEffect(() => {
    if (!isHovering.current || !stopOnHover) {
      clearTimer();
      setTimer();
    }
  }, [setTimer, clearTimer, stopOnHover]);

  // 鼠标移入移出事件
  const onMouseEnter = () => {
    isHovering.current = true;
    if (stopOnHover) {
      clearTimer();
    }
    if (navigationConfig.showSlideBtn === 'hover') {
      setArrowShow(true);
    }
  };
  const onMouseLeave = () => {
    isHovering.current = false;
    if (!isEnd()) {
      setTimer();
    }
    if (navigationConfig.showSlideBtn === 'hover') {
      setArrowShow(false);
    }
  };

  const navMouseAction = (action: MouseAction, index: number) => {
    if (action === MouseAction.Enter && trigger === 'hover') {
      swiperTo(index, { source: 'hover' });
    }
    if (action === MouseAction.Click && trigger === 'click') {
      swiperTo(index, { source: 'click' });
    }
  };

  const arrowClick = (direction: ArrowClickDirection) => {
    if (needAnimation) {
      return false;
    }
    if (direction === ArrowClickDirection.Right) {
      if (type === 'card') {
        return swiperTo(currentIndex + 1 >= swiperItemLength ? 0 : currentIndex + 1, { source: 'click' });
      }
      return swiperTo(currentIndex + 1, { source: 'click' });
    }
    if (direction === ArrowClickDirection.Left) {
      if (currentIndex - 1 < 0) {
        return swiperTo(childrenLength - 1, { source: 'click' });
      }
      return swiperTo(currentIndex - 1, { source: 'click' });
    }
  };

  const createArrow = (type: CreateArrow) => {
    if (!arrowShow) {
      return '';
    }
    if (navigationConfig.type === 'fraction' && type === CreateArrow.Default) {
      return '';
    }
    const fractionIndex = currentIndex + 1 > childrenLength ? 1 : currentIndex + 1;
    return (
      <div
        className={classnames(`${classPrefix}-swiper__arrow`, {
          [`${classPrefix}-swiper__arrow--default`]: type === 'default',
        })}
      >
        <div className={`${classPrefix}-swiper__arrow-left`} onClick={() => arrowClick(ArrowClickDirection.Left)}>
          <ChevronLeftIcon />
        </div>
        {type === CreateArrow.Fraction ? (
          <div className={`${classPrefix}-swiper__navigation-text-fraction`}>
            {fractionIndex}/{childrenLength}
          </div>
        ) : (
          ''
        )}
        <div className={`${classPrefix}-swiper__arrow-right`} onClick={() => arrowClick(ArrowClickDirection.Right)}>
          <ChevronRightIcon />
        </div>
      </div>
    );
  };

  const createNavigation = () => {
    if (navigationConfig.type === 'fraction') {
      return (
        <div className={classnames(`${classPrefix}-swiper__navigation`, `${classPrefix}-swiper__navigation--fraction`)}>
          {createArrow(CreateArrow.Fraction)}
        </div>
      );
    }
    return navigationNode ? (
      <>{navigationNode}</>
    ) : (
      <ul
        className={classnames(
          `${classPrefix}-swiper__navigation`,
          `${classPrefix}-swiper__navigation-${navigationConfig.type}`,
        )}
      >
        {childrenList.map((_: JSX.Element, i: number) => (
          <li
            key={i}
            className={classnames(`${classPrefix}-swiper__navigation-item`, {
              [`${classPrefix}-is-active`]: i === currentIndex % childrenLength,
            })}
            onClick={() => navMouseAction(MouseAction.Click, i)}
            onMouseEnter={() => navMouseAction(MouseAction.Enter, i)}
            onMouseLeave={() => navMouseAction(MouseAction.Leave, i)}
          >
            <span></span>
          </li>
        ))}
      </ul>
    );
  };

  // 构造 css 对象
  const getWrapperStyle = () => {
    const offsetHeight = height ? `${height}px` : `${getWrapAttribute('offsetHeight')}px`;
    if (type === 'card' || animation === 'fade') {
      return {
        height: offsetHeight,
      };
    }
    if (animation === 'slide') {
      if (direction === 'vertical') {
        return {
          height: offsetHeight,
          msTransform: `translate3d(0, -${currentIndex * 100}%, 0px)`,
          WebkitTransform: `translate3d(0, -${currentIndex * 100}%, 0px)`,
          transform: `translate3d(0, -${currentIndex * 100}%, 0px)`,
          transition: needAnimation ? `transform ${duration / 1000}s ease` : '',
        };
      }
      return {
        msTransform: `translate3d(-${currentIndex * 100}%, 0px, 0px)`,
        WebkitTransform: `translate3d(-${currentIndex * 100}%, 0px, 0px)`,
        transform: `translate3d(-${currentIndex * 100}%, 0px, 0px)`,
        transition: needAnimation ? `transform ${duration / 1000}s ease` : '',
      };
    }
  };

  return (
    <div
      className={classnames(`${classPrefix}-swiper`, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={swiperWrap}
    >
      <div
        className={classnames(`${classPrefix}-swiper__wrap`, {
          [`${classPrefix}-swiper--inside`]: navigationConfig.placement === 'inside',
          [`${classPrefix}-swiper--outside`]: navigationConfig.placement === 'outside',
          [`${classPrefix}-swiper--vertical`]: direction === 'vertical',
          [`${classPrefix}-swiper--large`]: navigationConfig.size === 'large',
          [`${classPrefix}-swiper--small`]: navigationConfig.size === 'small',
        })}
      >
        <div
          className={classnames(`${classPrefix}-swiper__content`, {
            [`${classPrefix}-swiper-fade`]: animation === 'fade',
            [`${classPrefix}-swiper-card`]: type === 'card',
          })}
          style={{ height: '' }}
        >
          <div className={`${classPrefix}-swiper__container`} style={getWrapperStyle()}>
            {swiperItemList}
          </div>
        </div>
        {createNavigation()}
        {createArrow(CreateArrow.Default)}
      </div>
    </div>
  );
};

Swiper.SwiperItem = SwiperItem;

Swiper.displayName = 'Swiper';
Swiper.defaultProps = swiperDefaultProps;

export default Swiper;
