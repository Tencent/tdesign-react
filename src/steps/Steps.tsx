import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdStepsProps } from './type';
import { StyledProps } from '../common';
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
    current = 0,
    layout = 'horizontal',
    theme = 'default',
    sequence = 'positive',
    children,
    onChange,
    options = [],
  } = props;
  const { classPrefix } = useConfig();

  const className = classnames({
    [`${classPrefix}-steps`]: true,
    [`${classPrefix}-steps--horizontal`]: layout === 'horizontal',
    [`${classPrefix}-steps--vertical`]: layout === 'vertical',
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

  const shouldReserve = sequence === 'reverse' && layout === 'vertical';

  // 处理 children 的展示逻辑，生成展示列表供页面循环;
  const childrenList = React.Children.toArray(children);
  const childrenDisplayList = shouldReserve ? childrenList.reverse() : childrenList;

  // 处理 options
  const optionsDisplayList = shouldReserve ? options.reverse() : options;

  // children 优先
  let stepItemList = null;
  if (childrenList.length !== 0) {
    stepItemList = childrenDisplayList.map((child: JSX.Element, index: number) =>
      React.cloneElement(child, { value: index, ...child.props }),
    );
  } else {
    stepItemList = optionsDisplayList.map((v, index) => <StepItem {...v} value={index} key={index} />);
  }

  return (
    <StepsContext.Provider value={{ current, theme }}>
      <div className={className} style={style}>
        {stepItemList}
      </div>
    </StepsContext.Provider>
  );
}

Steps.StepItem = StepItem;
Steps.displayName = 'Steps';

export default Steps;
