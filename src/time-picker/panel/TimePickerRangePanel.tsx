import React, { FC, useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import SinglePanel, { SinglePanelProps } from './SinglePanel';

import useConfig from '../../_util/useConfig';
import Button from '../../button';

import { useTimePickerTextConfig } from '../const';
import { DEFAULT_STEPS, DEFAULT_FORMAT } from '../../_common/js/time-picker/const';

import { TdTimeRangePickerProps, TimeRangeValue } from '../type';

export interface TimeRangePickerPanelProps extends Omit<SinglePanelProps, 'value' | 'onChange'> {
  isFooterDisplay?: boolean; // 是否展示footer
  handleConfirmClick?: (value: TimeRangeValue) => void;
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

  const TEXT_CONFIG = useTimePickerTextConfig();
  const { classPrefix } = useConfig();

  const [startTime, endTime] = value || [];

  const panelClassName = `${classPrefix}-time-picker__panel-section`;

  const handlePanelValueChange = (value: string, index: number) => {
    if (index === 0) {
      onChange([value, endTime || value]);
    } else {
      const calStartTime = startTime || dayjs().hour(0).minute(0).second(0).format(format);
      onChange([calStartTime, value]);
    }
  };

  const defaultValue = useMemo(() => {
    if (value && value.length === 0) {
      return [dayjs().format(format), dayjs().format(format)];
    }
    return value;
  }, [value, format]);

  return (
    <div className={classNames(panelClassName)}>
      <div className={`${panelClassName}-body`}>
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
        <div className={`${panelClassName}-footer`}>
          <Button
            theme="primary"
            variant="base"
            size="small"
            onClick={() => {
              handleConfirmClick(defaultValue);
            }}
          >
            {TEXT_CONFIG.confirm}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
