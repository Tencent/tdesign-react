import React, { FC } from 'react';
import dayjs from 'dayjs';
import SinglePanel, { SinglePanelProps } from './SinglePanel';

import useConfig from '../../_util/useConfig';
import Button from '../../button';

import { TEXT_CONFIG, DEFAULT_STEPS, DEFAULT_FORMAT } from '../consts';

export interface TimePickerPanelProps extends SinglePanelProps {
  // 是否展示footer
  isFooterDisplay?: boolean;
  handleConfirmClick?: () => void;
}

const TimePickerPanel: FC<TimePickerPanelProps> = (props) => {
  const { isFooterDisplay, onChange, format = DEFAULT_FORMAT, steps = DEFAULT_STEPS, handleConfirmClick } = props;
  const { classPrefix } = useConfig();

  const panelClassName = `${classPrefix}-time-picker-panel`;
  const showNowTimeBtn = !!steps.filter((v) => v > 1).length;

  return (
    <div className={panelClassName}>
      <div className={`${panelClassName}-section__body`}>
        <SinglePanel {...props} format={format} steps={steps} />
      </div>
      {isFooterDisplay ? (
        <div className={`${panelClassName}-section__footer`}>
          <Button theme="primary" variant="base" onClick={handleConfirmClick}>
            {TEXT_CONFIG.confirm}
          </Button>
          {!showNowTimeBtn ? (
            <Button theme="primary" variant="text" onClick={() => onChange(dayjs().format(format))}>
              {TEXT_CONFIG.nowtime}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
