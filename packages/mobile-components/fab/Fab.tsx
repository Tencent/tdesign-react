import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { reconvertUnit } from '../_util/convertUnit';
import Button from '../button';
import { TdFabProps } from './type';
import { fabDefaultProps } from './defaultProps';
import { StyledProps } from '../common';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import useEventListener from '../hooks/useEventListener';
import parseTNode from '../_util/parseTNode';

export interface FabProps extends TdFabProps, StyledProps {
  children?: React.ReactNode;
}

const Fab: React.FC<FabProps> = (originProps) => {
  const props = useDefaultProps(originProps, fabDefaultProps);
  const { children, buttonProps, icon = null, text, onClick } = props;

  const fabClass = usePrefixClass('fab');

  const fabRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [fabButtonSize, setFabButtonSize] = useState({
    width: 48,
    height: 48,
  });

  const [btnSwitchPos, setBtnSwitchPos] = useState({
    x: 16,
    y: 32,
  });
  const switchPosRef = useRef({
    hasMoved: false, // exclude click event
    x: btnSwitchPos.x, // right
    y: btnSwitchPos.y, // bottom
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  const getDocSize = () => ({
    width: Math.min(window.innerWidth, document.documentElement.clientWidth, screen.width),
    height: Math.min(window.innerHeight, document.documentElement.clientHeight, screen.height),
  });

  const getBounds = () => ({
    topThreshold: reconvertUnit(props.yBounds?.[0] ?? 0),
    bottomThreshold: reconvertUnit(props.yBounds?.[1] ?? 0),
    leftBound: reconvertUnit(props.xBounds?.[0] ?? 0),
    rightBound: reconvertUnit(props.xBounds?.[1] ?? 0),
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.({ e });
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    props.onDragStart?.({ e });

    switchPosRef.current.startX = e.touches[0].clientX;
    switchPosRef.current.startY = e.touches[0].clientY;
  };

  const getSwitchButtonSafeAreaXY = (x: number, y: number): [number, number] => {
    const { topThreshold, bottomThreshold, leftBound, rightBound } = getBounds();
    const { width: docWidth, height: docHeight } = getDocSize();

    const maxY = docHeight - fabButtonSize.height - topThreshold;
    // x 是 right 值：最小为右边界 rightBound（最靠右），最大为 docWidth - width - leftBound（最靠左）
    const minX = rightBound;
    const maxX = docWidth - fabButtonSize.width - leftBound;

    return [Math.max(minX, Math.min(maxX, x)), Math.max(bottomThreshold, Math.min(maxY, y))];
  };

  const onTouchMove = (e: TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!props.draggable || e.touches.length <= 0) {
      return;
    }

    const offsetX = e.touches[0].clientX - switchPosRef.current.startX;
    const offsetY = e.touches[0].clientY - switchPosRef.current.startY;
    const [newX, newY] = getSwitchButtonSafeAreaXY(
      Math.floor(switchPosRef.current.x - offsetX),
      Math.floor(switchPosRef.current.y - offsetY),
    );

    switchPosRef.current.hasMoved = true;

    setBtnSwitchPos((prev) => {
      const next = { ...prev };
      if (props.draggable !== 'vertical') {
        next.x = newX;
        switchPosRef.current.endX = newX;
      }
      if (props.draggable !== 'horizontal') {
        next.y = newY;
        switchPosRef.current.endY = newY;
      }
      return next;
    });
  };

  useEventListener(fabRef, 'touchmove', onTouchMove, { passive: false });

  const setSwitchPosition = (switchX: number, switchY: number) => {
    const [newSwitchX, newSwitchY] = getSwitchButtonSafeAreaXY(switchX, switchY);
    switchPosRef.current.x = newSwitchX;
    switchPosRef.current.y = newSwitchY;

    // 使用函数式更新避免闭包陷阱
    setBtnSwitchPos((prev) => {
      const newPos = { ...prev };
      if (props.draggable !== 'vertical') {
        newPos.x = newSwitchX;
      }
      if (props.draggable !== 'horizontal') {
        newPos.y = newSwitchY;
      }
      return newPos;
    });
  };

  const handleMagnet = () => {
    if (!props.magnet) {
      return;
    }
    const { width: docWidth } = getDocSize();
    const { leftBound, rightBound } = getBounds();
    const leftX = docWidth - fabButtonSize.width - leftBound;
    const rightX = rightBound;

    let targetX: number;
    if (props.magnet === 'left') {
      targetX = leftX;
    } else if (props.magnet === 'right') {
      targetX = rightX;
    } else {
      const currentRight = switchPosRef.current.x;
      const currentLeft = docWidth - fabButtonSize.width - currentRight;
      targetX = currentLeft < currentRight ? leftX : rightX;
    }

    setSwitchPosition(targetX, switchPosRef.current.y);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!switchPosRef.current.hasMoved) {
      return;
    }
    props.onDragEnd?.({ e });
    switchPosRef.current.startX = 0;
    switchPosRef.current.startY = 0;
    switchPosRef.current.hasMoved = false;
    setSwitchPosition(switchPosRef.current.endX, switchPosRef.current.endY);

    handleMagnet();
  };

  const getFabOriginStyle = () => {
    if (!fabRef.current) {
      return { right: 0, bottom: 0 };
    }
    const info = window.getComputedStyle(fabRef.current);
    return {
      right: +(reconvertUnit(info.right) || 0),
      bottom: +(reconvertUnit(info.bottom) || 0),
    };
  };

  const resetDraggableParams = () => {
    const { right, bottom } = getFabOriginStyle();

    switchPosRef.current.x = right;
    switchPosRef.current.y = bottom;
    setBtnSwitchPos({ x: right, y: bottom });
  };

  // useLayoutEffect 在绘制前同步初始化位置，避免首次渲染闪动
  useLayoutEffect(() => {
    setMounted(true);
    resetDraggableParams();

    const button = fabRef.current?.querySelector(`.${fabClass}__button`) || fabRef.current?.firstElementChild || null;
    if (button) {
      const info = window.getComputedStyle(button);
      setFabButtonSize({
        width: +reconvertUnit(info.width),
        height: +reconvertUnit(info.height),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // style 变更时重置拖拽参数
  useEffect(() => {
    if (mounted) {
      resetDraggableParams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.style]);

  const defaultContent = (
    <Button
      size="large"
      theme="primary"
      shape={props.text ? 'round' : 'circle'}
      className={`${fabClass}__button`}
      {...(buttonProps as TdFabProps['buttonProps'])}
      icon={icon}
    >
      {text}
    </Button>
  );

  const fabClasses = [fabClass, !switchPosRef.current.hasMoved && props.magnet ? `${fabClass}--animation` : '']
    .filter(Boolean)
    .join(' ');

  const fabStyle =
    mounted && props.draggable
      ? {
          right: `${btnSwitchPos.x}px`,
          bottom: `${btnSwitchPos.y}px`,
        }
      : props.style || {
          right: `${btnSwitchPos.x}px`,
          bottom: `${btnSwitchPos.y}px`,
        };

  return (
    <div
      ref={fabRef}
      className={fabClasses}
      style={fabStyle}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {parseTNode(children, null, defaultContent)}
    </div>
  );
};

Fab.displayName = 'Fab';
export default Fab;
