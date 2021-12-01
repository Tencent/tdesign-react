import React from 'react';
import useConfig from '../../_util/useConfig';
import { TdDatePickerProps } from '../type';
import Button from '../../button';

export interface CalendarPresetsProps {
  onClickRange: Function;
  presets: TdDatePickerProps['presets'];
}

const CalendarPresets = (props: CalendarPresetsProps) => {
  const { presets, onClickRange } = props;
  const { classPrefix } = useConfig();

  return (
    <div className={`${classPrefix}-date-picker-presets`}>
      <ul>
        {presets &&
          Object.keys(presets).map((key: string) => (
            <li key={key}>
              <Button variant="text" onClick={() => onClickRange(presets[key])}>
                {key}
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
};

CalendarPresets.displayName = 'CalendarPresets';

export default CalendarPresets;
