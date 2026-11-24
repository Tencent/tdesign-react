import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import useConfig from '../../hooks/useConfig';
/* eslint-disable */
import circleAdapter from '../../_common/js/loading/circle-adapter'; // @ts-ignore

interface Props {
  pause: boolean;
  duration: number;
  reverse: boolean;
}

const Gradient: React.FC<Props> = (props) => {
  const { pause, duration, reverse } = props;
  const { classPrefix } = useConfig();
  const circle = useRef(null);

  useEffect(() => {
    if (circle.current) {
      circleAdapter(circle.current);
    }
  }, []);

  return (
    <svg
      style={
        pause
          ? { animation: 'none' }
          : {
              animation: `t-spin ${duration / 1000}s linear infinite`,
              animationDirection: `${reverse ? 'reverse' : 'normal'}`,
            }
      }
      className={classNames(`${classPrefix}-loading__gradient`, `${classPrefix}-icon-loading`)}
      viewBox="0 0 14 14"
      version="1.1"
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="1" y="1" width="12" height="12">
        <div ref={circle} className={`${classPrefix}-loading__gradient-conic`} />
      </foreignObject>
    </svg>
  );
};

export default Gradient;
