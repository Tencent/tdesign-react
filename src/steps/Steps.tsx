import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdStepsProps } from '../_type/components/steps';
import { StyledProps } from '../_type';
import StepItem from './StepItem';
import StepsContext from './StepsContext';

export interface StepsProps extends TdStepsProps, StyledProps {
  children?: React.ReactNode;
}

/**
 * 步骤条组件
 * @param props
 */
function Steps(props: StepsProps) {
  const {
    style,
    current = 1,
    direction = 'horizontal',
    status = 'process',
    theme = 'default',
    sequence = 'positive',
    children,
    onChange,
  } = props;
  const { classPrefix } = useConfig();

  const className = classnames({
    [`${classPrefix}-steps`]: true,
    [`${classPrefix}-steps--horizontal`]: direction === 'horizontal',
    [`${classPrefix}-steps--vertical`]: direction === 'vertical',
    [`${classPrefix}-steps--default-anchor`]: theme === 'default',
    [`${classPrefix}-steps--positive`]: sequence === 'positive',
    [`${classPrefix}-steps--reverse`]: sequence === 'reverse',
    [`${classPrefix}-steps--dot-anchor`]: theme === 'dot',
    [props.className]: !!props.className,
  });

  const previousRef = useRef<number | string>(current);

  // 监听步骤变化
  useEffect(() => {
    const previous = previousRef.current;
    if (previous !== current && onChange) {
      onChange(current, previous);
    }
  }, [current, onChange]);

  return (
    <StepsContext.Provider value={{ current, currentStatus: status, theme }}>
      <div className={className} style={style}>
        {React.Children.map(children, (child: JSX.Element, index: number) => {
          let value = index + 1;
          // 垂直状态下、反序
          if (sequence === 'reverse' && direction === 'vertical') {
            const childs = children as any;
            value = childs.length - index;
          }
          return React.cloneElement(child, { value, ...child.props });
        })}
      </div>
    </StepsContext.Provider>
  );
}

Steps.StepItem = StepItem;
Steps.displayName = 'Steps';

export default Steps;
