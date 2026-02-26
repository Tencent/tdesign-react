import React from 'react';
import DateFooter from '../base/Footer';
import type { SinglePanelProps } from './SinglePanel';
import type { TdDatePickerProps, TdDateRangePickerProps, DateValue, DateMultipleValue } from '../type';

export interface ExtraContentProps
  extends Pick<
    SinglePanelProps,
    'enableTimePicker' | 'presetsPlacement' | 'onPresetClick' | 'onConfirmClick' | 'needConfirm'
  > {
  selectedValue?: DateValue | DateMultipleValue;
  presets?: TdDatePickerProps['presets'] | TdDateRangePickerProps['presets'];
  onTimeModeChange?: () => void;
  isDateRangeContent?: boolean;
  isSwitchTimeMode?: boolean;
}

export default function ExtraContent(props: ExtraContentProps) {
  const {
    presets,
    enableTimePicker,
    presetsPlacement,
    onPresetClick,
    onConfirmClick,
    selectedValue,
    needConfirm,
    isSwitchTimeMode,
  } = props;

  const showPanelFooter = (enableTimePicker && needConfirm) || presets;

  return showPanelFooter ? (
    <DateFooter
      presets={presets}
      onPresetClick={onPresetClick}
      enableTimePicker={enableTimePicker}
      onConfirmClick={onConfirmClick}
      presetsPlacement={presetsPlacement}
      selectedValue={selectedValue}
      needConfirm={needConfirm}
      onTimePanelChange={props.onTimeModeChange}
      isDateRangeContent={props.isDateRangeContent}
      isSwitchTimeMode={isSwitchTimeMode}
    />
  ) : null;
}
