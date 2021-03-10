import * as React from 'react';
import classNames from 'classnames';

import { Icon } from '../icon';
import useCommonClassName from '../_util/useCommonClassName';
import { StepHandlerProps } from './InputNumber.types';

export default function StepHandler(props: StepHandlerProps) {
  const { prefixCls, mode, onStep, disabledDecrease, disabledIncrease } = props;
  const CommonClassNames = useCommonClassName();

  const IconNames = {
    decrease: mode === 'column' ? 'chevron-down' : 'remove',
    increase: mode === 'column' ? 'chevron-up' : 'add',
  };

  const onStepDecrease = (event) => disabledDecrease || onStep({ type: 'reduce', event });
  const onStepIncrease = (event) => disabledIncrease || onStep({ type: 'add', event });

  return (
    <>
      <span
        className={classNames(`${prefixCls}__decrease`, {
          [CommonClassNames.STATUS.disabled]: disabledDecrease,
        })}
        onClick={onStepDecrease}
      >
        <Icon name={IconNames.decrease}></Icon>
      </span>
      <span
        className={classNames(`${prefixCls}__increase`, {
          [CommonClassNames.STATUS.disabled]: disabledIncrease,
        })}
        onClick={onStepIncrease}
      >
        <Icon name={IconNames.increase}></Icon>
      </span>
    </>
  );
}
