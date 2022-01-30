import React from 'react';
import classNames from 'classnames';

import { ChevronUpIcon, ChevronDownIcon, RemoveIcon, AddIcon } from 'tdesign-icons-react';
import useCommonClassName from '../_util/useCommonClassName';
import Button from '../button';

import { InputNumberProps, ChangeContext } from './InputNumber';

export interface StepHandlerProps {
  prefixClassName: string;
  theme: InputNumberProps['theme'];
  onStep: React.Dispatch<ChangeContext>;
  disabledDecrease: boolean;
  disabledIncrease: boolean;
  children: React.ReactElement;
}

export default function StepHandler(props: StepHandlerProps) {
  const { prefixClassName, theme, onStep, disabledDecrease, disabledIncrease, children } = props;
  const commonClassNames = useCommonClassName();

  const isNormalTheme = theme === 'normal';
  const decreaseIcon = theme === 'column' ? <ChevronDownIcon /> : <RemoveIcon />;
  const increaseIcon = theme === 'column' ? <ChevronUpIcon /> : <AddIcon />;

  const onStepDecrease = (e) => disabledDecrease || onStep({ type: 'reduce', e });
  const onStepIncrease = (e) => disabledIncrease || onStep({ type: 'add', e });

  return (
    <>
      {!isNormalTheme && (
        <Button
          variant="outline"
          className={classNames(`${prefixClassName}__decrease`, {
            [commonClassNames.STATUS.disabled]: disabledDecrease,
          })}
          onClick={onStepDecrease}
          icon={decreaseIcon}
          shape="square"
        ></Button>
      )}

      {children}
      {!isNormalTheme && (
        <Button
          variant="outline"
          className={classNames(`${prefixClassName}__increase`, {
            [commonClassNames.STATUS.disabled]: disabledIncrease,
          })}
          onClick={onStepIncrease}
          icon={increaseIcon}
          shape="square"
        ></Button>
      )}
    </>
  );
}
