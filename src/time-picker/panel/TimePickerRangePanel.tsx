import React, { FC } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import SinglePanel, { SinglePanelProps } from './SinglePanel';

import useConfig from '../../_util/useConfig';
import Button from '../../button';

import { TEXT_CONFIG, DEFAULT_STEPS, DEFAULT_FORMAT } from '../consts';

import { TdTimeRangePickerProps } from '../../_type/components/time-picker';

export interface TimeRangePickerPanelProps extends Omit<SinglePanelProps, 'value' | 'onChange'> {
  // 是否展示footer
  isFooterDisplay?: boolean;
  handleConfirmClick?: () => void;
  value: TdTimeRangePickerProps['value'];
  onChange: TdTimeRangePickerProps['onChange'];
}

const TimePickerPanel: FC<TimeRangePickerPanelProps> = (props) => {
  const {
    value = [],
    onChange,
    isFooterDisplay,
    handleConfirmClick,
    steps = DEFAULT_STEPS,
    format = DEFAULT_FORMAT,
  } = props;

  const { classPrefix } = useConfig();

  const [startTime, endTime] = value || [];
  const panelClassName = `${classPrefix}-time-picker-panel`;

  const handlePanelValueChange = (value: string, index: number) => {
    if (index === 0) {
      onChange([value, endTime || value]);
    } else {
      const calStartTime = startTime || dayjs().hour(0).minute(0).second(0).format(format);
      onChange([calStartTime, value]);
    }
  };

  return (
    <div className={classNames(panelClassName, `${panelClassName}-section`)}>
      <div className={`${panelClassName}-section__body`}>
        <SinglePanel
          {...props}
          steps={steps}
          format={format}
          value={startTime}
          onChange={(v) => handlePanelValueChange(v, 0)}
        />
        <SinglePanel
          {...props}
          steps={steps}
          format={format}
          value={endTime}
          onChange={(v) => handlePanelValueChange(v, 1)}
        />
      </div>
      {isFooterDisplay ? (
        <div className={`${panelClassName}-section__footer`}>
          <Button theme="primary" variant="base" onClick={handleConfirmClick}>
            {TEXT_CONFIG.confirm}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
