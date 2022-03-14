import React from 'react';
import useConfig from '../../_util/useConfig';
import Button from '../../button';
import { TdDatePickerProps } from '../type';

interface DatePickerPresetsProps extends Pick<TdDatePickerProps, 'presets'> {
  onPresetClick: Function;
}

const DatePickerPresets = (props: DatePickerPresetsProps) => {
  const { classPrefix } = useConfig();

  const { presets, onPresetClick } = props;

  return (
    <div className={`${classPrefix}-date-picker__presets`}>
      {presets &&
        Object.keys(presets).map((key: string) => (
          <Button key={key} size="small" variant="text" onClick={() => onPresetClick(presets[key])}>
            {key}
          </Button>
        ))}
    </div>
  );
};

DatePickerPresets.displayName = 'DatePickerPresets';

export default DatePickerPresets;
