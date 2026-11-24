import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { InfoCircleFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import { isArray, isObject } from 'lodash-es';
import parseTNode from '../_util/parseTNode';
import Swiper from '../swiper';
import type { SwiperProps } from '../swiper';
import SwiperItem from '../swiper/SwiperItem';
import { usePrefixClass } from '../hooks/useClass';
import type { StyledProps } from '../common';
import type { TdNoticeBarProps, NoticeBarTrigger, NoticeBarMarquee } from './type';
import useDefault from '../_util/useDefault';
import useDefaultProps from '../hooks/useDefaultProps';
import { noticeBarDefaultProps } from './defaultProps';
import noop from '../_util/noop';

export interface NoticeBarProps extends TdNoticeBarProps, StyledProps {
  touchable?: boolean;
}

type IconType = ReturnType<typeof InfoCircleFilledIcon>;

type frameState = {
  duration: number;
  offset: number;
  listWidth: number;
  itemWidth: number;
  timer: number;
  nextTimer: number;
  scroll: {
    marquee: boolean;
    speed: number;
    loop: number; // 值为 -1 表示循环播放，值为 0 表示不循环播放
    delay: number;
  };
};

const defaultReduceState: () => frameState = () => ({
  duration: 0,
  offset: 0,
  listWidth: 0,
  itemWidth: 0,
  timer: null,
  nextTimer: null,
  scroll: {
    marquee: false,
    speed: 50,
    loop: -1, // 值为 -1 表示循环播放，值为 0 表示不循环播放
    delay: 0,
  },
});

const defaultIcons: Record<TdNoticeBarProps['theme'], IconType> = {
  info: <InfoCircleFilledIcon />,
  success: <CheckCircleFilledIcon />,
  warning: <ErrorCircleFilledIcon />,
  error: <ErrorCircleFilledIcon />,
};

function useAnimationSettingValue() {
  const animationSettingValue = useRef<frameState | null>(null);
  if (!animationSettingValue.current) {
    // 仅为null时进行初始化
    animationSettingValue.current = defaultReduceState();
  }
  const [, setState] = useState(0);

  function updateScroll(obj: Partial<frameState['scroll']>) {
    animationSettingValue.current = {
      ...animationSettingValue.current,
      scroll: {
        ...animationSettingValue.current.scroll,
        ...obj,
      },
    };
    setState(Math.random());
  }

  function updateAnimationFrame(obj: Partial<frameState>) {
    animationSettingValue.current = {
      ...animationSettingValue.current,
      ...obj,
    };
    setState(Math.random());
  }

  function resetFrame(obj: frameState) {
    animationSettingValue.current = obj || defaultReduceState();
    setState(Math.random());
  }

  return {
    animationSettingValue,
    updateScroll,
    updateAnimationFrame,
    resetFrame,
  };
}

const NoticeBar: React.FC<NoticeBarProps> = (props) => {
  const {
    style,
    className,
    content,
    direction,
    interval,
    marquee,
    operation,
    prefixIcon,
    suffixIcon,
    theme = 'info',
    visible,
    defaultVisible,
    touchable = false,
    onClick,
    onChange,
  } = useDefaultProps(props, noticeBarDefaultProps);

  const listDOM = useRef<HTMLDivElement | null>(null);
  const itemDOM = useRef<HTMLDivElement | null>(null);
  const hasBeenExecute = useRef(false);

  const [isShow] = useDefault(visible, defaultVisible, noop);
  const rootClassName = usePrefixClass('notice-bar');
  const containerClassName = classNames(rootClassName, `${rootClassName}--${theme}`, className);
  const { animationSettingValue, updateScroll, updateAnimationFrame } = useAnimationSettingValue();

  useEffect(() => {
    if (!hasBeenExecute.current) {
      if (isShow) {
        hasBeenExecute.current = true;
        handleScrolling();
      }
      return;
    }
    const timer = setTimeout(() => {
      if (isShow) {
        updateAnimationFrame({
          offset: animationSettingValue.current.listWidth,
          duration: 0,
        });
        handleScrolling();
      }
    }, 0);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  function handleScrolling() {
    // 过滤 marquee 为 false
    if (!marquee) {
      return;
    }
    // 过滤 loop 为 0
    if (typeof marquee !== 'boolean' && marquee?.loop === 0) {
      return;
    }

    let updateScrollState: ReturnType<typeof defaultReduceState>['scroll'] = defaultReduceState().scroll;

    // marquee 为 true 时，需要计算滚动的位置
    if (typeof marquee === 'boolean') {
      updateScrollState = {
        ...animationSettingValue.current.scroll,
        ...defaultReduceState().scroll,
        marquee,
      };
    }
    if (isObject(marquee)) {
      const curMarquee = marquee as NoticeBarMarquee;
      updateScrollState = {
        marquee: true,
        loop: typeof curMarquee?.loop === 'undefined' ? updateScrollState.loop : curMarquee.loop,
        speed: curMarquee.speed ?? updateScrollState.speed,
        delay: curMarquee.delay ?? updateScrollState.delay,
      };
    }

    updateScroll(updateScrollState);

    setTimeout(() => {
      const listDOMWidth = listDOM.current?.getBoundingClientRect().width;
      const itemDOMWidth = itemDOM.current?.getBoundingClientRect().width;
      if (!listDOMWidth || !itemDOMWidth) {
        return;
      }
      updateAnimationFrame({
        offset: -itemDOMWidth,
        duration: itemDOMWidth / animationSettingValue.current.scroll.speed,
        listWidth: listDOMWidth,
        itemWidth: itemDOMWidth,
      });
    }, animationSettingValue.current.scroll.delay || 200);
  }

  function handleTransitionend() {
    const { listWidth, itemWidth, scroll } = animationSettingValue.current;
    const { loop, speed } = scroll;
    // 触发再次滚的
    const transitionLoop = loop - 1;
    if (transitionLoop === 0) {
      updateScroll({
        loop: transitionLoop,
        marquee: false,
      });
      return;
    }
    updateScroll({
      loop: transitionLoop,
    });

    flushSync(() => {
      updateAnimationFrame({
        offset: listWidth,
        duration: 0,
      });
    });

    setTimeout(() => {
      updateAnimationFrame({
        offset: -itemWidth,
        duration: (itemWidth + listWidth) / speed,
      });
    }, 0);
  }

  const handleClick = (trigger: NoticeBarTrigger) => {
    onClick?.(trigger);
  };
  // 动画
  const animateStyle = useMemo(
    () => ({
      transform: animationSettingValue.current.offset ? `translateX(${animationSettingValue.current.offset}px)` : '',
      transitionDuration: `${animationSettingValue.current.duration}s`,
      transitionTimingFunction: 'linear',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animationSettingValue.current.offset, animationSettingValue.current.duration],
  );

  const renderPrefixIcon = () => {
    const prefixIconContent = prefixIcon ? parseTNode(prefixIcon) : defaultIcons[theme];
    if (prefixIcon !== null && prefixIconContent) {
      return (
        <div className={`${rootClassName}__prefix-icon`} onClick={() => handleClick('prefix-icon')}>
          {prefixIconContent}
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    const renderShowContent = () => parseTNode(content) || null;
    const renderOperationContent = () => {
      const operationContent = parseTNode(operation);
      if (!operationContent) {
        return null;
      }
      return (
        <span
          className={`${rootClassName}__operation`}
          onClick={(e) => {
            e.stopPropagation();
            handleClick('operation');
          }}
        >
          {operationContent}
        </span>
      );
    };
    return (
      <div ref={listDOM} className={`${rootClassName}__content-wrap`} onClick={() => handleClick('content')}>
        {direction === 'vertical' && isArray(content) ? (
          <Swiper
            className={`${rootClassName}__content--vertical`}
            autoplay
            loop
            direction={direction}
            duration={2000}
            touchable={touchable}
            height={22}
            interval={interval}
            onChange={onChange as SwiperProps['onChange']}
          >
            {content.map((item, index) => (
              <SwiperItem key={index}>
                <div className={`${rootClassName}__content--vertical-item`}>{item}</div>
              </SwiperItem>
            ))}
          </Swiper>
        ) : (
          <div
            ref={itemDOM}
            className={classNames(`${rootClassName}__content`, {
              [`${rootClassName}__content-wrapable`]: !animationSettingValue.current.scroll.marquee,
            })}
            style={animationSettingValue.current.scroll.marquee ? animateStyle : {}}
            onTransitionEnd={handleTransitionend}
          >
            {renderShowContent()}
            {renderOperationContent()}
          </div>
        )}
      </div>
    );
  };

  const renderSuffixIconContent = () => {
    const suffixIconContent = parseTNode(suffixIcon);
    if (!suffixIconContent) {
      return null;
    }
    return (
      <div className={`${rootClassName}__suffix-icon`} onClick={() => handleClick('suffix-icon')}>
        {suffixIconContent}
      </div>
    );
  };
  return isShow ? (
    <div className={containerClassName} style={style}>
      {renderPrefixIcon()}
      {renderContent()}
      {renderSuffixIconContent()}
    </div>
  ) : null;
};

NoticeBar.displayName = 'NoticeBar';

export default NoticeBar;
