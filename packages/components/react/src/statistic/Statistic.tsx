import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import {
  ArrowTriangleDownFilledIcon as TDArrowTriangleDownFilledIcon,
  ArrowTriangleUpFilledIcon as TDArrowTriangleUpFilledIcon,
} from 'tdesign-icons-react';
import { TdStatisticProps } from './type';
import { statisticDefaultProps } from './defaultProps';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useDefaultProps from '../hooks/useDefaultProps';
import useIsFirstRender from '../hooks/useIsFirstRender';

import Skeleton from '../skeleton';
import Tween from '../_common/js/statistic/tween';
import { COLOR_MAP } from '../_common/js/statistic/utils';

export interface StatisticProps extends TdStatisticProps, StyledProps {}

export interface StatisticRef {
  start: (from?: number, to?: number) => void;
}

const Statistic = forwardRef<StatisticRef, StatisticProps>((props, ref) => {
  const {
    animation,
    animationStart,
    color,
    decimalPlaces,
    extra,
    format,
    loading,
    prefix,
    separator,
    suffix,
    title,
    trend,
    trendPlacement,
    unit,
    value,
  } = useDefaultProps<StatisticProps>(props, statisticDefaultProps);
  const { classPrefix } = useConfig();
  const { ArrowTriangleUpFilledIcon } = useGlobalIcon({ ArrowTriangleUpFilledIcon: TDArrowTriangleUpFilledIcon });
  const { ArrowTriangleDownFilledIcon } = useGlobalIcon({
    ArrowTriangleDownFilledIcon: TDArrowTriangleDownFilledIcon,
  });

  /**
   * init value
   */
  const [innerValue, setInnerValue] = useState(animation?.valueFrom ?? value);
  const numberValue = useMemo(() => (isNumber(value) ? value : 0), [value]);
  const tween = useRef(null);
  const isFirstRender = useIsFirstRender();

  const start = (from: number = animation?.valueFrom ?? 0, to: number = numberValue) => {
    if (from !== to) {
      tween.current = new Tween({
        from: {
          value: from,
        },
        to: {
          value: to,
        },
        duration: animation?.duration,
        onUpdate: (keys) => {
          setInnerValue(keys.value);
        },
        onFinish: () => {
          setInnerValue(to);
        },
      });
      tween.current?.start();
    }
  };

  const formatValue = useMemo(() => {
    let formatInnerValue: number | string | undefined = innerValue;

    if (isFunction(format)) {
      return format(formatInnerValue);
    }
    const options = {
      minimumFractionDigits: decimalPlaces || 0,
      maximumFractionDigits: decimalPlaces || 20,
      useGrouping: !!separator,
    };
    // replace的替换的方案仅能应对大部分地区
    formatInnerValue = formatInnerValue.toLocaleString(undefined, options).replace(/,|，/g, separator);

    return formatInnerValue;
  }, [innerValue, decimalPlaces, separator, format]);

  const valueStyle = useMemo(
    () => ({
      color: COLOR_MAP[color] || color,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color],
  );

  useEffect(() => {
    //  第一次渲染不执行，否则导致初始formValue失效
    if (isFirstRender) return;

    setInnerValue(value);

    animationStart && animation && start();

    return () => {
      if (tween.current) {
        tween.current.stop();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    animationStart && animation && !tween.current && start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationStart]);

  useImperativeHandle(ref, () => ({
    start,
  }));

  const trendIcons = {
    increase: <ArrowTriangleUpFilledIcon />,
    decrease: <ArrowTriangleDownFilledIcon />,
  };

  const trendIcon = trend ? trendIcons[trend] : null;

  const prefixRender = prefix || (trendIcon && trendPlacement !== 'right' ? trendIcon : null);
  const suffixRender = suffix || (trendIcon && trendPlacement === 'right' ? trendIcon : null);

  return (
    <div className={`${classPrefix}-statistic`}>
      {title && <div className={`${classPrefix}-statistic-title`}>{title}</div>}
      <Skeleton animation="gradient" theme="text" loading={!!loading}>
        <div className={`${classPrefix}-statistic-content`} style={valueStyle}>
          {prefixRender && <span className={`${classPrefix}-statistic-content-prefix`}>{prefixRender}</span>}
          <span className={`${classPrefix}-statistic-content-value`}>{formatValue}</span>
          {unit && <span className={`${classPrefix}-statistic-content-unit`}>{unit}</span>}
          {suffixRender && <span className={`${classPrefix}-statistic-content-suffix`}>{suffixRender}</span>}
        </div>
      </Skeleton>
      {extra && <div className={`${classPrefix}-statistic-extra`}>{extra}</div>}
    </div>
  );
});

Statistic.displayName = 'Statistic';
export default Statistic;
