import './style';

import React, { forwardRef, Fragment, useImperativeHandle } from 'react';
import classNames from 'classnames';

import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import { countDownDefaultProps } from './defaultProps';
import useCountDown from './hooks/useCountDown';

import type { StyledProps } from '../common';
import type { TdCountDownProps } from './type';

export interface CountDownRef {
  start: () => void;
  reset: () => void;
  pause: () => void;
}

export interface CountDownProps extends TdCountDownProps, StyledProps {}

const CountDown = forwardRef<CountDownRef, CountDownProps>((props, ref) => {
  const {
    className,
    style,
    autoStart,
    content,
    children,
    millisecond,
    size,
    splitWithUnit,
    time,
    format,
    theme,
    onChange,
    onFinish,
  } = useDefaultProps<CountDownProps>(props, countDownDefaultProps);

  const countDownClass = usePrefixClass('count-down');

  const { timeText, timeList, timeData, start, reset, pause } = useCountDown({
    autoStart,
    millisecond,
    time,
    format,
    onChange,
    onFinish,
  });

  useImperativeHandle(ref, () => ({ start, reset, pause }));

  if (!timeText) return null;

  const rootClasses = classNames(
    countDownClass,
    `${countDownClass}--${theme}`,
    `${countDownClass}--${size}`,
    className,
  );

  const renderContent = () => {
    if (content !== 'default') {
      return parseTNode(content || children, timeData);
    }

    return timeList.map(({ digit, unit, match }) => (
      <Fragment key={match}>
        <span className={`${countDownClass}__item`}>{digit}</span>
        {unit && (
          <span
            className={classNames([
              `${countDownClass}__split`,
              `${countDownClass}__split--${splitWithUnit ? 'text' : 'dot'}`,
            ])}
          >
            {unit}
          </span>
        )}
      </Fragment>
    ));
  };

  return (
    <div className={rootClasses} style={style}>
      {renderContent()}
    </div>
  );
});

CountDown.displayName = 'CountDown';

export default CountDown;
