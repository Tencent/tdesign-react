import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import StepItem from './StepItem';
import StepsContext from './StepsContext';
import { stepsDefaultProps } from './defaultProps';

import type { StyledProps } from '../common';
import type { StepItemProps } from './StepItem';
import type { TdStepItemProps, TdStepsProps } from './type';

export interface StepsProps extends TdStepsProps, StyledProps {
  children?: React.ReactNode;
}

const Steps = forwardRefWithStatics(
  (originalProps: StepsProps, ref) => {
    const props = useDefaultProps<StepsProps>(originalProps, stepsDefaultProps);
    const { style, layout, theme, sequence, separator, children, options } = props;
    const { classPrefix } = useConfig();

    const [current, onChange] = useControlled(props, 'current', props.onChange);

    // 整理 StepItem value 映射
    const indexMap = useMemo(() => {
      const map = {};
      if (options) {
        options.forEach((item, index) => {
          if (item.value !== undefined) {
            map[item.value] = index;
          }
        });
      } else {
        React.Children.forEach(children, (child, index) => {
          if (!React.isValidElement(child)) {
            return;
          }
          if ((child as React.ReactElement<any>).props.value !== undefined) {
            map[(child as React.ReactElement<any>).props.value] = index;
          }
        });
      }
      return map;
    }, [options, children]);

    const handleStatus = useCallback(
      (item: TdStepItemProps, index: number) => {
        if (current === 'FINISH') {
          return 'finish';
        }
        if (item.status && item.status !== 'default') {
          return item.status;
        }
        // value 不存在时，使用 index 进行区分每一个步骤
        if (item.value === undefined && typeof current === 'number' && index < current) {
          return 'finish';
        }

        // value 存在，找匹配位置
        if (item.value !== undefined) {
          const matchIndex = indexMap[current];
          if (matchIndex === undefined) {
            console.warn('TDesign Steps Warn: The current `value` is not exist.');
            return 'default';
          }
          if (index < matchIndex) {
            return 'finish';
          }
        }
        const key = item.value ?? index;
        if (key === current) {
          return 'process';
        }
        return 'default';
      },
      [current, indexMap],
    );

    const stepItemList = useMemo<React.ReactNode[]>(() => {
      if (options) {
        const optionsDisplayList = sequence === 'reverse' ? [...options].reverse() : options;
        const optionsDisplayListLength = optionsDisplayList.length;

        return optionsDisplayList.map<React.ReactNode>((item, index) => {
          const stepIndex = sequence === 'reverse' ? optionsDisplayListLength - index - 1 : index;
          return (
            <StepItem key={item.value ?? index} {...item} index={stepIndex} status={handleStatus(item, stepIndex)} />
          );
        });
      }

      const childrenList = React.Children.toArray(children);
      const childrenDisplayList = sequence === 'reverse' ? [...childrenList].reverse() : childrenList;
      const childrenDisplayListLength = childrenDisplayList.length;

      return childrenDisplayList.map((child: React.ReactElement<StepItemProps>, index: number) => {
        const stepIndex = sequence === 'reverse' ? childrenDisplayListLength - index - 1 : index;
        return React.cloneElement(child, {
          ...child.props,
          index: stepIndex,
          status: handleStatus(child.props, stepIndex),
        });
      });
    }, [options, children, sequence, handleStatus]);

    return (
      <StepsContext.Provider
        value={{
          current,
          theme,
          readOnly: props.readOnly || props.readonly,
          onChange,
        }}
      >
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

export default Steps;
