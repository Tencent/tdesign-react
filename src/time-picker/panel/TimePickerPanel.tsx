import React, { FC, useEffect, useMemo, useState, MouseEvent } from 'react';
import dayjs from 'dayjs';
import SinglePanel, { SinglePanelProps } from './SinglePanel';

import useConfig from '../../hooks/useConfig';
import Button from '../../button';

import { useTimePickerTextConfig } from '../hooks/useTimePickerTextConfig';
import { DEFAULT_STEPS, DEFAULT_FORMAT } from '../../_common/js/time-picker/const';

export interface TimePickerPanelProps extends SinglePanelProps {
  isShowPanel?: boolean;
  isFooterDisplay?: boolean; // 是否展示footer
  handleConfirmClick?: (defaultValue: dayjs.Dayjs | string) => void;
}

const TimePickerPanel: FC<TimePickerPanelProps> = (props) => {
  const {
    format = DEFAULT_FORMAT,
    steps = DEFAULT_STEPS,
    handleConfirmClick,
    isFooterDisplay,
    onChange,
    value,
    isShowPanel = true,
  } = props;
  const [triggerScroll, toggleTriggerScroll] = useState(false); // 触发滚动
  const { classPrefix } = useConfig();

  const TEXT_CONFIG = useTimePickerTextConfig();

  const panelClassName = `${classPrefix}-time-picker__panel`;
  const showNowTimeBtn = !!steps.filter((v) => v > 1).length;

  const defaultValue = useMemo(() => {
    const formattedValue = dayjs(value, format);
    if (value && formattedValue.isValid()) {
      return formattedValue.format(format);
    }

    return dayjs().hour(0).minute(0).second(0).format(format);
  }, [value, format]);

  useEffect(() => {
    if (isShowPanel) toggleTriggerScroll(true);
  }, [isShowPanel]);

  const handleOnChange = (v: string, e: MouseEvent<HTMLDivElement>) => {
    props.onChange(v);
    props.onPick?.(v, { e });
  };

  return (
    <div className={panelClassName}>
      <div className={`${panelClassName}-section-body`}>
        <SinglePanel
          {...props}
          onChange={handleOnChange}
          format={format}
          steps={steps}
          value={dayjs(value, format).isValid() ? value : defaultValue}
          triggerScroll={triggerScroll}
          isVisible={isShowPanel}
          resetTriggerScroll={() => toggleTriggerScroll(false)}
        />
      </div>
      {isFooterDisplay ? (
        <div className={`${panelClassName}-section-footer`}>
          <Button
            theme="primary"
            variant="base"
            disabled={!props.value}
            onClick={() => {
              handleConfirmClick(defaultValue);
            }}
            size="small"
          >
            {TEXT_CONFIG.confirm}
          </Button>
          {!showNowTimeBtn ? (
            <Button theme="primary" variant="text" size="small" onClick={() => onChange(dayjs().format(format))}>
              {TEXT_CONFIG.nowTime}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
