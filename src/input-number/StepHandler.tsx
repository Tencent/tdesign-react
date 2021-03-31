import * as React from 'react';
import classNames from 'classnames';

import ChevronUpIcon from '../icon/icons/ChevronUpIcon';
import ChevronDownIcon from '../icon/icons/ChevronDownIcon';
import RemoveIcon from '../icon/icons/RemoveIcon';
import AddIcon from '../icon/icons/AddIcon';
import useCommonClassName from '../_util/useCommonClassName';

import { StepHandlerProps } from './InputNumberProps';

export default function StepHandler(props: StepHandlerProps) {
  const { prefixClassName, theme, onStep, disabledDecrease, disabledIncrease } = props;
  const commonClassNames = useCommonClassName();

  const DecreaseIcon = theme === 'column' ? ChevronDownIcon : RemoveIcon;
  const IncreaseIcon = theme === 'column' ? ChevronUpIcon : AddIcon;

  const onStepDecrease = (e) => disabledDecrease || onStep({ type: 'reduce', e });
  const onStepIncrease = (e) => disabledIncrease || onStep({ type: 'add', e });

  return (
    <>
      <span
        className={classNames(`${prefixClassName}__decrease`, {
          [commonClassNames.STATUS.disabled]: disabledDecrease,
        })}
        onClick={onStepDecrease}
      >
        <DecreaseIcon />
      </span>
      <span
        className={classNames(`${prefixClassName}__increase`, {
          [commonClassNames.STATUS.disabled]: disabledIncrease,
        })}
        onClick={onStepIncrease}
      >
        <IncreaseIcon />
      </span>
    </>
  );
}
