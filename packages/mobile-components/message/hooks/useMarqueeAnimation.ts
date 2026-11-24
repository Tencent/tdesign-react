import { useMemoizedFn, useMount } from 'ahooks';
import { set } from 'lodash-es';
import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import type { MessageMarquee } from '../type';

export default function useMarqueeAnimation(
  marquee: boolean | MessageMarquee,
  containerRef: RefObject<HTMLDivElement>,
  messageRef: RefObject<HTMLDivElement>,
) {
  const messageMarquee = useMemo<MessageMarquee | null>(() => {
    const DEFAULT_MARQUEE = {
      speed: 50,
      loop: -1,
      delay: 300,
    };

    if (!marquee) {
      return null;
    }

    if (marquee === true) {
      return DEFAULT_MARQUEE;
    }

    return {
      loop: Math.max(marquee.loop, -1) ?? DEFAULT_MARQUEE.loop,
      speed: Math.max(marquee.speed, 1) ?? DEFAULT_MARQUEE.speed,
      delay: Math.max(marquee.delay, 0) ?? DEFAULT_MARQUEE.delay,
    };
  }, [marquee]);

  const [playedCount, setPlayedCount] = useState(0);
  useEffect(() => {
    setPlayedCount(0);
  }, [messageMarquee]);

  const setAnimationStyle = useMemoizedFn((animationStyle: React.CSSProperties) => {
    if (!messageRef.current) {
      return;
    }
    Object.entries(animationStyle).forEach(([key, value]) => {
      set(messageRef.current.style, key, value);
    });
  });

  const isPlayingAnimation = useRef(false);

  const playAnimation = useMemoizedFn((playedCount: number) => {
    if (isPlayingAnimation.current) {
      return () => {};
    }

    if (
      !messageMarquee ||
      messageMarquee.loop === 0 ||
      (playedCount >= messageMarquee.loop && messageMarquee.loop !== -1)
    ) {
      return () => {};
    }

    const animationContext = {
      textWrapDOMWidth: containerRef.current?.getBoundingClientRect().width,
      textDOMWidth: messageRef.current?.getBoundingClientRect().width,
    };

    const offset = -animationContext.textDOMWidth;

    isPlayingAnimation.current = true;
    const timeout = setTimeout(() => {
      if (playedCount === 0) {
        setAnimationStyle({
          transform: offset ? `translateX(${offset}px)` : '',
          transitionDuration: `${animationContext.textDOMWidth / messageMarquee.speed}s`,
          transitionTimingFunction: 'linear',
        });
      } else {
        setAnimationStyle({
          transform: offset ? `translateX(${offset}px)` : '',
          transitionDuration: `${(animationContext.textWrapDOMWidth + animationContext.textDOMWidth) / messageMarquee.speed}s`,
          transitionTimingFunction: 'linear',
        });
      }
    }, messageMarquee.delay);

    return () => {
      clearTimeout(timeout);
    };
  });
  useEffect(() => {
    const end = playAnimation(playedCount);

    return () => {
      end();
    };
  }, [playAnimation, playedCount]);

  const transitionEndHandler = useMemoizedFn(() => {
    isPlayingAnimation.current = false;
    const animationContext = {
      textWrapDOMWidth: containerRef.current?.getBoundingClientRect().width,
      textDOMWidth: messageRef.current?.getBoundingClientRect().width,
    };

    setAnimationStyle({
      transform: `translateX(${animationContext.textWrapDOMWidth + animationContext.textDOMWidth}px)`,
      transitionDuration: '0s',
    });
    setPlayedCount((playedCount) => playedCount + 1);
  });
  useMount(() => {
    messageRef.current?.addEventListener('transitionend', transitionEndHandler);

    return () => {
      messageRef.current?.removeEventListener('transitionend', transitionEndHandler);
    };
  });
}
