import React, { FC, useEffect, useMemo, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import SinglePanel, { SinglePanelProps } from './SinglePanel';

import useConfig from '../../hooks/useConfig';
import Button from '../../button';

import { useTimePickerTextConfig } from '../hooks/useTimePickerTextConfig';
import { DEFAULT_STEPS, DEFAULT_FORMAT } from '../../_common/js/time-picker/const';
import type { TimePickerProps } from '../TimePicker';
import type { TimeRangePickerProps } from '../TimeRangePicker';
import log from '../../_common/js/log';

export interface TimePickerPanelProps extends SinglePanelProps {
  isShowPanel?: boolean;
  isFooterDisplay?: boolean; // 是否展示footer
  handleConfirmClick?: (defaultValue: dayjs.Dayjs | string) => void;
  presets?: TimePickerProps['presets'] | TimeRangePickerProps['presets'];
  activeIndex?: number;
}

type PresetValue = TimePickerPanelProps['presets'][keyof TimePickerPanelProps['presets']];

const TimePickerPanel: FC<TimePickerPanelProps> = (props) => {
  const {
    format = DEFAULT_FORMAT,
    steps = DEFAULT_STEPS,
    handleConfirmClick,
    isFooterDisplay,
    onChange,
    value,
    isShowPanel = true,
    presets = null,
  } = props;
  const [triggerScroll, toggleTriggerScroll] = useState(false); // 触发滚动
  const { classPrefix } = useConfig();

  const TEXT_CONFIG = useTimePickerTextConfig();

  const panelClassName = `${classPrefix}-time-picker__panel`;
  const showNowTimeBtn = !!steps.filter((v) => Number(v) > 1).length;

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

  const resetTriggerScroll = useCallback(() => {
    toggleTriggerScroll(false);
  }, [toggleTriggerScroll]);

  const handlePresetClick = (presetValue: PresetValue) => {
    const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;
    if (typeof props.activeIndex === 'number') {
      if (Array.isArray(presetVal)) {
        props.onChange?.(presetVal[props.activeIndex]);
      } else {
        log.error('TimePicker', `preset: ${presets} 预设值必须是数组!`);
      }
    } else {
      props.onChange?.(presetVal);
    }
  };

  const renderFooter = () => {
    if (presets) {
      return Object.keys(presets).map((preset) => (
        <Button
          key={preset}
          theme="primary"
          size="small"
          variant="text"
          onClick={() => {
            handlePresetClick(presets[preset]);
          }}
        >
          {preset}
        </Button>
      ));
    }

    return !showNowTimeBtn ? (
      <Button
        theme="primary"
        variant="text"
        size="small"
        onClick={() => {
          onChange?.(dayjs().format(format));
        }}
      >
        {TEXT_CONFIG.nowTime}
      </Button>
    ) : null;
  };

  return (
    <div className={panelClassName}>
      <div className={`${panelClassName}-section-body`}>
        <SinglePanel
          {...props}
          onChange={onChange}
          format={format}
          steps={steps}
          value={dayjs(value, format).isValid() ? value : defaultValue}
          triggerScroll={triggerScroll}
          isVisible={isShowPanel}
          resetTriggerScroll={resetTriggerScroll}
        />
      </div>
      {isFooterDisplay ? (
        <div className={`${panelClassName}-section-footer`}>
          <Button
            size="small"
            theme="primary"
            variant="base"
            disabled={!props.value}
            onClick={() => {
              handleConfirmClick?.(defaultValue);
            }}
          >
            {TEXT_CONFIG.confirm}
          </Button>
          {renderFooter()}
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
