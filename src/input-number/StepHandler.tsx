import React, { useRef } from 'react';
import classNames from 'classnames';

import {
  AddIcon as TdAddIcon,
  RemoveIcon as TdRemoveIcon,
  ChevronUpIcon as TdChevronUpIcon,
  ChevronDownIcon as TdChevronDownIcon,
} from 'tdesign-icons-react';
import useGlobalIcon from '../hooks/useGlobalIcon';
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

let timer: NodeJS.Timer;
const triggerDelay = 500;
const stepDelay = 200;
export default function StepHandler(props: StepHandlerProps) {
  const { prefixClassName, theme, onStep, disabledDecrease, disabledIncrease, children } = props;
  const commonClassNames = useCommonClassName();
  const { AddIcon, RemoveIcon, ChevronUpIcon, ChevronDownIcon } = useGlobalIcon({
    AddIcon: TdAddIcon,
    RemoveIcon: TdRemoveIcon,
    ChevronUpIcon: TdChevronUpIcon,
    ChevronDownIcon: TdChevronDownIcon,
  });

  const isNormalTheme = theme === 'normal';
  const decreaseIcon = theme === 'column' ? <ChevronDownIcon /> : <RemoveIcon />;
  const increaseIcon = theme === 'column' ? <ChevronUpIcon /> : <AddIcon />;

  const onStepSaver = useRef<any>();
  onStepSaver.current = (params: ChangeContext) => {
    const { type, e } = params;
    if (type === 'reduce') {
      disabledDecrease || onStep({ type, e });
      return;
    }
    disabledIncrease || onStep({ type, e });
  };

  const handleMouseDown = (e, type) => {
    onStepSaver.current({ type, e });
    setTimeout(() => {
      timer = setInterval(() => {
        onStepSaver.current({ type, e });
      }, stepDelay);
    }, triggerDelay);
  };
  const stopInterval = () => {
    clearInterval(timer);
    setTimeout(() => {
      clearInterval(timer);
    }, triggerDelay);
  };

  return (
    <>
      {!isNormalTheme && (
        <Button
          variant="outline"
          className={classNames(`${prefixClassName}__decrease`, {
            [commonClassNames.STATUS.disabled]: disabledDecrease,
          })}
          onMouseDown={(e) => {
            handleMouseDown(e, 'reduce');
          }}
          onMouseUp={stopInterval}
          onMouseLeave={stopInterval}
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
          onMouseDown={(e) => {
            handleMouseDown(e, 'add');
          }}
          onMouseUp={stopInterval}
          onMouseLeave={stopInterval}
          icon={increaseIcon}
          shape="square"
        ></Button>
      )}
    </>
  );
}
