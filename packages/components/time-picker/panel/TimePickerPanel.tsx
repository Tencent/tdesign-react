import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import log from '@tdesign/common-js/log/index';
import { DEFAULT_FORMAT, DEFAULT_STEPS } from '@tdesign/common-js/time-picker/const';

import Button from '../../button';
import useConfig from '../../hooks/useConfig';
import { useTimePickerTextConfig } from '../hooks/useTimePickerTextConfig';
import SinglePanel from './SinglePanel';

import type { FC } from 'react';
import type { TimePickerProps } from '../TimePicker';
import type { TimeRangePickerProps } from '../TimeRangePicker';
import type { SinglePanelProps } from './SinglePanel';

export interface TimePickerPanelProps extends Omit<SinglePanelProps, 'onChange'> {
  isShowPanel?: boolean;
  isFooterDisplay?: boolean; // 是否展示footer
  handleConfirmClick?: (defaultValue: dayjs.Dayjs | string) => void;
  presets?: TimePickerProps['presets'] | TimeRangePickerProps['presets'];
  activeIndex?: number;
  onChange?: (value: string, e?: MouseEvent | UIEvent) => void;
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
  const [triggerScroll, setTriggerScroll] = useState(false); // 触发滚动
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
    if (isShowPanel) setTriggerScroll(true);
  }, [isShowPanel]);

  const resetTriggerScroll = useCallback(() => {
    setTriggerScroll(false);
  }, [setTriggerScroll]);

  const handlePresetClick = (presetValue: PresetValue, e: React.MouseEvent) => {
    const presetVal = typeof presetValue === 'function' ? presetValue() : presetValue;
    if (typeof props.activeIndex === 'number') {
      if (Array.isArray(presetVal)) {
        props.onChange?.(presetVal[props.activeIndex], e.nativeEvent);
      } else {
        log.error('TimePicker', `preset: ${presets} 预设值必须是数组!`);
      }
    } else {
      props.onChange?.(presetVal as string, e.nativeEvent);
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
          onClick={(e) => {
            handlePresetClick(presets[preset], e);
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
        onClick={(e) => {
          onChange?.(dayjs().format(format), e.nativeEvent);
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
          onChange={onChange as unknown as SinglePanelProps['onChange']}
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
