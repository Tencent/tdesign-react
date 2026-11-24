import React from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';

interface Props {
  pause: boolean;
  duration: number;
  reverse: boolean;
}

const Spinner: React.FC<Props> = (props) => {
  const { pause, duration, reverse } = props;
  const { classPrefix } = useConfig();
  const spinnerList = new Array(12).fill(0);

  return (
    <span
      style={
        pause
          ? { animation: 'none' }
          : {
              animation: `t-rotate ${duration / 1000}s infinite linear`,
              animationTimingFunction: 'steps(12)',
              animationDirection: `${reverse ? 'reverse' : 'normal'}`,
            }
      }
      className={`${classPrefix}-loading__spinner`}
    >
      {spinnerList.map((item, index) => (
        <i
          key={index}
          className={classNames(
            `${classPrefix}-loading__spinner--line`,
            `${classPrefix}-loading__spinner--line-${index + 1}`,
          )}
        ></i>
      ))}
    </span>
  );
};

export default Spinner;
