import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import Step from './Step';
import StepsContext from './StepsContext';
import { StepsProps } from './StepsProps';

/**
 * 步骤条组件
 * @param props
 */
export default function Steps(props: StepsProps) {
  const {
    style,
    current = 1,
    direction = 'horizontal',
    status,
    type = 'default',
    sequence = 'positive',
    children,
    onChange,
  } = props;
  const { classPrefix } = useConfig();

  const className = classnames({
    [`${classPrefix}-steps`]: true,
    [`${classPrefix}-steps--horizontal`]: direction === 'horizontal',
    [`${classPrefix}-steps--vertical`]: direction === 'vertical',
    [`${classPrefix}-steps--default-anchor`]: type === 'default',
    [`${classPrefix}-steps--positive`]: sequence === 'positive',
    [`${classPrefix}-steps--reverse`]: sequence === 'reverse',
    [`${classPrefix}-steps--dot-anchor`]: type === 'dot',
    [props.className]: !!props.className,
  });

  const previousRef = useRef<number>(current);

  // 监听步骤变化
  useEffect(() => {
    const previous = previousRef.current;
    if (previous !== current && onChange) {
      onChange(current, previous);
    }
  }, [current, onChange]);

  return (
    <StepsContext.Provider value={{ current, currentStatus: status, type }}>
      <div className={className} style={style}>
        {React.Children.map(children, (child: JSX.Element, index: number) => {
          let stepNumber = index + 1;
          // 垂直状态下、反序
          if (sequence === 'reverse' && direction === 'vertical') {
            const childs = children as any;
            stepNumber = childs.length - index;
          }
          return React.cloneElement(child, { stepNumber });
        })}
      </div>
    </StepsContext.Provider>
  );
}

Steps.Step = Step;
Steps.displayName = 'Steps';
