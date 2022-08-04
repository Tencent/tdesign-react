import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { TdStepsProps, TdStepItemProps } from './type';
import { StyledProps } from '../common';
import StepItem from './StepItem';
import StepsContext from './StepsContext';
import { stepsDefaultProps } from './defaultProps';

export interface StepsProps extends TdStepsProps, StyledProps {
  children?: React.ReactNode;
}

const Steps = forwardRefWithStatics(
  (props: StepsProps, ref) => {
    const { style, readonly, layout, theme, sequence, separator, children, options } = props;
    const { classPrefix } = useConfig();

    const [current, onChange] = useControlled(props, 'current', props.onChange);

    // 整理 StepItem value 映射
    const indexMap = useMemo(() => {
      const map = {};

      if (options) {
        options.forEach((item, index) => {
          if (item.value !== undefined) map[item.value] = index;
        });
      } else {
        React.Children.forEach(children, (child, index) => {
          if (!React.isValidElement(child)) return;
          if (child.props.value !== undefined) map[child.props.value] = index;
        });
      }
      return map;
    }, [options, children]);

    const handleStatus = useCallback(
      (item: TdStepItemProps, index: number) => {
        if (current === 'FINISH') return 'finish';
        if (item.status && item.status !== 'default') return item.status;

        // value 不存在时，使用 index 进行区分每一个步骤
        if (item.value === undefined) {
          if (sequence === 'positive' && index < current) return 'finish';
          if (sequence === 'reverse' && index > current) return 'finish';
        }

        // value 存在，找匹配位置
        if (item.value !== undefined) {
          const matchIndex = indexMap[current];
          if (matchIndex === undefined) {
            console.warn('TDesign Steps Warn: The current `value` is not exist.');
            return 'default';
          }
          if (sequence === 'positive' && index < matchIndex) return 'finish';
          if (sequence === 'reverse' && index > matchIndex) return 'finish';
        }
        const key = item.value ?? index;
        if (key === current) return 'process';
        return 'default';
      },
      [current, sequence, indexMap],
    );

    const stepItemList = useMemo(() => {
      if (options) {
        const optionsDisplayList = sequence === 'reverse' ? options.reverse() : options;

        return options.map((item, index: number) => {
          const stepIndex = sequence === 'reverse' ? optionsDisplayList.length - index - 1 : index;
          return <StepItem key={index} {...item} index={stepIndex} status={handleStatus(item, index)} />;
        });
      }

      const childrenList = React.Children.toArray(children);
      const childrenDisplayList = sequence === 'reverse' ? childrenList.reverse() : childrenList;

      return childrenList.map((child: JSX.Element, index: number) => {
        const stepIndex = sequence === 'reverse' ? childrenDisplayList.length - index - 1 : index;
        return React.cloneElement(child, {
          ...child.props,
          index: stepIndex,
          status: handleStatus(child.props, index),
        });
      });
    }, [options, children, sequence, handleStatus]);

    return (
      <StepsContext.Provider value={{ current, theme, readonly, onChange }}>
        <div
          ref={ref}
          style={style}
          className={classnames({
            [`${classPrefix}-steps`]: true,
            [`${classPrefix}-steps--${theme}-anchor`]: theme,
            [`${classPrefix}-steps--${layout}`]: layout,
            [`${classPrefix}-steps--${sequence}`]: sequence,
            [`${classPrefix}-steps--${separator}-separator`]: separator,
            [props.className]: !!props.className,
          })}
        >
          {stepItemList}
        </div>
      </StepsContext.Provider>
    );
  },
  { StepItem },
);

Steps.displayName = 'Steps';
Steps.defaultProps = stepsDefaultProps;

export default Steps;
