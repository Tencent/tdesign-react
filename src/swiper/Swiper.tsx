import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import { TdSwiperProps } from '../_type/components/swiper';
import { StyledProps } from '../_type';

import SwiperItem from './SwiperItem';

export interface SwiperProps extends TdSwiperProps, StyledProps {
  children?: React.ReactNode;
}

const Swiper = (props: SwiperProps) => {
  const {
    // animation = 'slide', // 轮播切换动画效果类型（暂时没用）
    autoplay = true, // 是否自动播放
    current, // 当前轮播在哪一项（下标）
    defaultCurrent = 0, // 当前轮播在哪一项（下标），非受控属性
    direction = 'horizontal', // 轮播滑动方向，包括横向滑动和纵向滑动两个方向
    duration = 300, // 滑动动画时长
    interval = 5000, // 轮播间隔时间
    onChange = noop, // 轮播切换时触发
    className,
    children,
  } = props;
  const { classPrefix } = useConfig();

  const [currentIndex, setCurrentIndex] = useState(defaultCurrent);
  const [animation, setAnimation] = useState(true);
  const swiperTimer = useRef(null); // 计时器指针
  const isHovering = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 进行子组件筛选，创建子节点列表
  const childrenList = useMemo(
    () => React.Children.toArray(children).filter((child: JSX.Element) => child.type.name === 'SwiperItem'),
    [children],
  );
  const childrenLength = childrenList.length;

  // 创建渲染用的节点列表
  const swiperItemList = childrenList.map((child: JSX.Element, index: number) =>
    React.cloneElement(child, { value: index, ...child.props }),
  );
  // 子节点不为空时，复制第一个子节点到列表最后
  if (childrenLength > 0) {
    const firstEle = swiperItemList[0];
    swiperItemList.push(React.cloneElement(firstEle, { ...firstEle.props, key: `${firstEle.key}-cloned` }));
  }
  const swiperItemLength = swiperItemList.length;

  // 统一跳转处理函数
  const swiperTo = useCallback(
    (index: number) => {
      // 事件通知
      onChange(index % childrenLength);
      // 设置内部 index
      setCurrentIndex(index);
      setAnimation(true);
    },
    [childrenLength, onChange],
  );

  // 定时器
  const setTimer = useCallback(() => {
    if (autoplay && interval > 0) {
      swiperTimer.current = setInterval(() => {
        swiperTo(currentIndex + 1);
      }, interval);
    }
  }, [autoplay, currentIndex, interval, swiperTo]);
  const clearTimer = useCallback(() => {
    if (swiperTimer.current) {
      clearInterval(swiperTimer.current);
      swiperTimer.current = null;
    }
  }, []);

  // 监听 current 参数变化
  useEffect(() => {
    if (current !== undefined) {
      swiperTo(current % childrenLength);
    }
  }, [current, childrenLength, swiperTo]);

  // 在非鼠标 hover 状态时，添加切换下一个组件的定时器
  useEffect(() => {
    // 设置自动播放的定时器
    if (!isHovering.current) {
      clearTimer();
      setTimer();
    }
  }, [clearTimer, setTimer]);

  // 动画完成后取消 css 属性
  useEffect(() => {
    setTimeout(() => {
      setAnimation(false);
      if (currentIndex + 1 === swiperItemLength) {
        setCurrentIndex(0);
      }
    }, duration + 50);
  }, [currentIndex, swiperItemLength, duration, direction]);

  // 鼠标移入移出事件
  const onMouseEnter = () => {
    isHovering.current = true;
    clearTimer();
  };
  const onMouseLeave = () => {
    isHovering.current = false;
    setTimer();
  };

  let wrapperStyle = {};
  if (direction === 'vertical') {
    wrapperStyle = {
      height: `${swiperItemLength * 100}%`,
      top: `-${currentIndex * 100}%`,
      transition: animation ? `top ${duration / 1000}s` : '',
    };
  } else {
    wrapperStyle = {
      width: `${swiperItemLength * 100}%`,
      left: `-${currentIndex * 100}%`,
      transition: animation ? `left ${duration / 1000}s` : '',
    };
  }

  return (
    <div
      className={classnames(`${classPrefix}-swiper`, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 渲染子节点 */}
      <div className={`${classPrefix}-swiper__content`}>
        <div ref={wrapperRef} className={`${classPrefix}-swiper__swiper-wrap--${direction}`} style={wrapperStyle}>
          {swiperItemList}
        </div>
      </div>
      {/* 渲染右侧切换小点 */}
      <ul className={`${classPrefix}-swiper__trigger-wrap`}>
        {childrenList.map((_: JSX.Element, i: number) => (
          <li
            key={i}
            className={i === currentIndex % childrenLength ? `${classPrefix}-swiper__trigger--active` : ''}
            onClick={() => swiperTo(i)}
          />
        ))}
      </ul>
    </div>
  );
};

Swiper.SwiperItem = SwiperItem;
Swiper.displayName = 'Swiper';

export default Swiper;
