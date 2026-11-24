import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import useDefault from '../_util/useDefault';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import { TdStepsProps } from './type';
import { stepsDefaultProps } from './defaultProps';
import { StepsProvider } from './StepsContext';

export interface StepsProps extends TdStepsProps, NativeProps {
  children?: ReactNode;
}

const Steps: FC<StepsProps> = (props) => {
  const {
    children,
    layout,
    readonly,
    theme,
    current,
    defaultCurrent,
    sequence,
    currentStatus,
    onChange: onCurrentChange,
  } = useDefaultProps(props, stepsDefaultProps);

  const stepsClass = usePrefixClass('steps');

  const [value, onChange] = useDefault(current, defaultCurrent, onCurrentChange);

  const [childrenNodes, setChildrenNodes] = useState<HTMLElement[]>([]);

  const stepsClassName = useMemo(
    () =>
      classNames(stepsClass, `${stepsClass}--${layout}`, `${stepsClass}--${sequence}`, {
        [`${stepsClass}--readonly`]: readonly,
      }),
    [stepsClass, layout, sequence, readonly],
  );

  const relation = useCallback((ele: HTMLElement) => {
    if (ele) {
      setChildrenNodes((prev) => [...prev, ele]);
    }
  }, []);

  const removeRelation = useCallback((ele: HTMLElement) => {
    setChildrenNodes((prev) => prev.filter((item) => item !== ele));
  }, []);

  const onClickItem = useCallback(
    (cur, prev, context) => {
      onChange(cur, prev, context);
    },
    [onChange],
  );

  const memoProviderValues = useMemo(
    () => ({
      childrenNodes,
      current: value,
      relation,
      removeRelation,
      onClickItem,
      currentStatus,
      layout,
      readonly,
      theme,
      sequence,
    }),
    [childrenNodes, value, relation, removeRelation, onClickItem, currentStatus, layout, readonly, theme, sequence],
  );

  return withNativeProps(
    props,
    <StepsProvider value={memoProviderValues}>
      <div className={stepsClassName}>{parseTNode(children)}</div>
    </StepsProvider>,
  );
};

Steps.displayName = 'Steps';

export default Steps;
