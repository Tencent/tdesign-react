import React, { useState, useEffect, useRef, FC } from 'react';
import classnames from 'classnames';

import useConfig from '../_util/useConfig';

/**
 * Loading组件 渐变部分实现
 */
const GradientLoading: FC = () => {
  const { classPrefix } = useConfig();
  const [styleFromEnv, setStyleFromEnv] = useState({});
  const conicRef = useRef();

  const gradientClass = `${classPrefix}-loading__gradient`;

  useEffect(() => {
    const el = conicRef?.current;
    let basicStyle = {};

    if (el) {
      const { fontSize, color } = getComputedStyle(el);
      // to fix the browser compat of foreignObject in Safari,
      // https://bugs.webkit.org/show_bug.cgi?id=23113
      const ua = window?.navigator?.userAgent;
      const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
      if (isSafari) {
        basicStyle = {
          transformOrigin: '-1px -1px',
          transform: `scale(${parseInt(fontSize, 10) / 14})`,
        };
      }
      if (color) {
        const matched = color.match(/[\d.]+/g);
        const endColor = `rgba(${matched[0]}, ${matched[1]}, ${matched[2]}, 0)`;
        setStyleFromEnv({
          ...basicStyle,
          background: `conic-gradient(from 90deg at 50% 50%,${endColor} 0deg, ${color} 360deg)`,
        });
      } else {
        setStyleFromEnv({
          ...basicStyle,
          background: '',
        });
      }
    }
  }, []);

  return (
    <svg
      className={classnames(gradientClass, `${classPrefix}-icon-loading`)}
      viewBox="0 0 14 14"
      version="1.1"
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="1" y="1" width="12" height="12">
        <div className={`${gradientClass}-conic`} style={styleFromEnv} ref={conicRef} />
      </foreignObject>
    </svg>
  );
};
export default GradientLoading;
