import React, { useEffect, FC } from 'react';
import classnames from 'classnames';
import circleAdapter from '@tdesign/common-js/loading/circle-adapter';
import useDomRefCallback from '../hooks/useDomRefCallback';
import useConfig from '../hooks/useConfig';

/**
 * Loading组件 渐变部分实现
 */
const GradientLoading: FC = () => {
  const { classPrefix } = useConfig();
  const [conicRef, setConicRef] = useDomRefCallback();
  const gradientClass = `${classPrefix}-loading__gradient`;

  useEffect(() => {
    const el = conicRef;
    circleAdapter(el);
  }, [conicRef]);

  return (
    <svg
      className={classnames(gradientClass, `${classPrefix}-icon-loading`)}
      viewBox="0 0 12 12"
      version="1.1"
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="0" y="0" width="12" height="12">
        <div className={`${gradientClass}-conic`} ref={setConicRef} />
      </foreignObject>
    </svg>
  );
};

export default GradientLoading;
