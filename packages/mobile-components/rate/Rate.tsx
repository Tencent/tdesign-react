import { useSize } from 'ahooks';
import cx from 'classnames';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useDefault from '../_util/useDefault';
import type { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { rateDefaultProps } from './defaultProps';
import { RateIcon } from './RateIcon';
import { RateText } from './RateText';
import { RateTips } from './RateTips';
import type { TdRateProps } from './type';

export interface RateProps extends TdRateProps, StyledProps {}

const TIPS_HIDE_DELAY = 300;
const convertToNumber = (str: string | number, defaultValue = 0) => {
  const value = parseFloat(String(str));
  return isNaN(value) ? defaultValue : value;
};

const Rate = forwardRef<HTMLDivElement, RateProps>((props, ref) => {
  const rateClass = usePrefixClass('rate');

  const {
    style,
    className,
    count,
    gap,
    size,
    color,
    icon,
    allowHalf,
    placement,
    value,
    defaultValue,
    onChange,
    showText,
    texts,
    disabled,
  } = useDefaultProps<RateProps>(props, rateDefaultProps);

  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);

  const wrapRef = useRef<HTMLDivElement>(null);

  const [currentValue, setCurrentValue] = useState(-1);
  const [tipsVisible, setTipsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const controlRef = useRef({
    timer: 0,
    enableClick: true,
    touchStartX: 0,
    enableTouch: false,
    currentValue,
  });

  controlRef.current.enableClick = true;

  const onShowTips = useCallback(() => {
    clearTimeout(controlRef.current.timer);
    setTipsVisible(true);
  }, []);

  const onHideTips = useCallback(() => {
    clearTimeout(controlRef.current.timer);
    setTipsVisible(false);
  }, []);

  // 组件销毁的时候 清除定时器
  useEffect(
    () => () => {
      clearTimeout(controlRef.current.timer);
    },
    [],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      controlRef.current.enableTouch = false;
      const event = e.touches[0];
      if (!event || disabled) {
        return;
      }
      controlRef.current.touchStartX = event.clientX;
    },
    [disabled],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const event = e.touches[0];
      const wrapEle = wrapRef.current;
      if (!event || count < 1 || !wrapEle || disabled) {
        return;
      }

      if (Math.abs(event.clientX - controlRef.current.touchStartX) > 5) {
        controlRef.current.enableTouch = true;
        setIsDragging(true);
        onShowTips();
      }

      if (!controlRef.current.enableTouch) {
        return;
      }

      // 计算
      const wrapRect = wrapEle.getBoundingClientRect();
      const gapNum = convertToNumber(gap);
      const perWidth = (wrapRect.width + gapNum) / count;
      // 左边 - gap / 2 右边 + gap / 2
      const x = event.clientX - wrapRect.x + gapNum / 2;

      let value = Math.min(Math.max(Math.floor(x / perWidth / 0.5) * 0.5 + 0.5, 0), count);
      if (!allowHalf) {
        value = Math.floor(value);
      }

      setCurrentValue(value);
      setTipsVisible(true);
      controlRef.current.currentValue = value;
    },
    [gap, count, allowHalf, onShowTips, disabled],
  );

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (!controlRef.current.enableTouch || disabled) {
      return;
    }
    controlRef.current.enableTouch = false;
    controlRef.current.enableClick = false;
    // 根据记录去修改数据
    setInnerValue(controlRef.current.currentValue);
    clearTimeout(controlRef.current.timer);
    controlRef.current.timer = setTimeout(onHideTips, TIPS_HIDE_DELAY) as any as number;
  }, [onHideTips, setInnerValue, disabled]);

  const wrapSize = useSize(wrapRef);

  const tipsLeft = useMemo(() => {
    if (count < 1 || !wrapSize) {
      return 0;
    }

    const gapNum = convertToNumber(gap);
    const perWidth = (wrapSize.width - (count - 1) * gapNum) / count;
    const index = Math.max(Math.min(Math.ceil(currentValue), count), 1) - 1;

    return (index + 1) * perWidth - perWidth / 2 + index * gapNum;
  }, [wrapSize, count, currentValue, gap]);

  const [clickTime, setClickTime] = useState(0);

  const doubleTips = allowHalf && !isDragging;

  return (
    <div
      style={style}
      className={cx(rateClass, className, {
        [`${rateClass}--disabled`]: disabled,
      })}
      ref={ref}
    >
      <div
        ref={wrapRef}
        className={`${rateClass}__wrapper`}
        style={{ gap: `${gap}px` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {Array(count)
          .fill('')
          .map((_, index) => {
            const itemValue = index + 1;

            const compareValue = isDragging ? currentValue : innerValue;

            return (
              <RateIcon
                key={index}
                color={color}
                size={convertToNumber(size)}
                icon={icon}
                isCurrent={currentValue === itemValue && tipsVisible}
                // 整个 和 半个 都要选中
                isSelected={itemValue < compareValue + 1}
                isHalf={itemValue > compareValue && itemValue < compareValue + 1}
                onClick={(placement) => {
                  if (!controlRef.current.enableClick || disabled) {
                    return;
                  }
                  const value = placement === 'left' && allowHalf ? itemValue - 0.5 : itemValue;
                  setClickTime(Date.now());
                  setCurrentValue(value);
                  onShowTips();
                  controlRef.current.timer = setTimeout(onHideTips, TIPS_HIDE_DELAY) as any as number;
                  setInnerValue(value);
                }}
              />
            );
          })}
      </div>
      {showText ? <RateText texts={texts} value={isDragging ? currentValue : innerValue} /> : null}
      {/* 增加一个时间戳作为 key 保证每次点击的时候 组件都重新创建 防止重复利用 触发 onClickOutSide */}
      {tipsVisible && placement && !disabled && (
        <RateTips
          key={clickTime}
          left={tipsLeft}
          placement={placement}
          onClickOutside={onHideTips}
          data={new Array(doubleTips ? 2 : 1).fill(1).map((_, index) => {
            let isHalf = false;
            if (doubleTips) {
              isHalf = index === 0;
            } else {
              isHalf = Math.ceil(currentValue) !== currentValue;
            }

            let value = currentValue;
            if (doubleTips) {
              if (index === 0) {
                value = Math.ceil(currentValue) - 0.5;
              } else {
                value = Math.ceil(currentValue);
              }
            }

            const actived = doubleTips ? value === currentValue : false;

            return {
              icon: (
                <RateIcon
                  key={index}
                  icon={icon}
                  color={color}
                  isCurrent={false}
                  isSelected={true}
                  isHalf={isHalf}
                  size={convertToNumber(size)}
                />
              ),
              text: value,
              actived,
              onClick: () => {
                if (value === innerValue) {
                  return;
                }
                setInnerValue(value);
                onHideTips();
              },
            };
          })}
        />
      )}
    </div>
  );
});

Rate.displayName = 'Rate';

export default Rate;
