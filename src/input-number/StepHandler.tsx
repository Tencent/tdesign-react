import React, { useRef } from 'react';
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

let timer: NodeJS.Timer;
export default function StepHandler(props: StepHandlerProps) {
  const { prefixClassName, theme, onStep, disabledDecrease, disabledIncrease, children } = props;
  const commonClassNames = useCommonClassName();

  const isNormalTheme = theme === 'normal';
  const decreaseIcon = theme === 'column' ? <ChevronDownIcon /> : <RemoveIcon />;
  const increaseIcon = theme === 'column' ? <ChevronUpIcon /> : <AddIcon />;

  const onStepSaver = useRef<any>();
  onStepSaver.current = (params: ChangeContext) => {
    const { type, e } = params;
    if (type === 'reduce') {
      disabledDecrease || onStep({ type, e });
    }
    disabledIncrease || onStep({ type, e });
  };

  const handleMouseDown = (e, type) => {
    onStepSaver.current({ type, e });
    timer = setInterval(() => {
      onStepSaver.current({ type, e });
    }, 500);
  };
  const stopInterval = () => {
    clearInterval(timer);
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
