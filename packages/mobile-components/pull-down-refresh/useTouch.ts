import React, { useState } from 'react';
import getScrollParent from '../_util/getScrollParent';

export function useTouch() {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [diffX, setDiffX] = useState(0);
  const [diffY, setDiffY] = useState(0);
  const start = (event: React.TouchEvent) => {
    const { clientX, clientY } = event.touches[0];
    setStartX(clientX);
    setStartY(clientY);
    setDiffX(0);
    setDiffY(0);
  };
  const move = (event: React.TouchEvent) => {
    const { clientX, clientY } = event.touches[0];
    setDiffY(clientY - startY);
    setDiffX(clientX - startX);
  };
  return {
    startX,
    startY,
    diffX,
    diffY,
    start,
    move,
  };
}

// 缓动函数
export const easeDistance = (distance: number, pullDistance: number) => {
  let innerDistance = distance;
  if (innerDistance > pullDistance) {
    if (innerDistance < pullDistance * 2) {
      innerDistance = pullDistance + (innerDistance - pullDistance) / 2;
    } else {
      innerDistance = pullDistance * 1.5 + (innerDistance - pullDistance * 2) / 4;
    }
  }
  return Math.round(innerDistance);
};

// 确保可滚动的父元素此时处于未滚动状态
export const isReachTop = (e: React.TouchEvent) => {
  const scrollParent = getScrollParent(e.target as Element);
  return !scrollParent || !(scrollParent as Element).scrollTop;
};
