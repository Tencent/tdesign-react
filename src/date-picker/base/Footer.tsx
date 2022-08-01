import React from 'react';
import classNames from 'classnames';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import Button from '../../button';
import useConfig from '../../hooks/useConfig';
import { TdDatePickerProps, TdDateRangePickerProps, DateValue } from '../type';

interface DatePickerFooterProps extends Pick<TdDatePickerProps, 'enableTimePicker' | 'presetsPlacement'> {
  presets?: TdDatePickerProps['presets'] | TdDateRangePickerProps['presets'];
  onPresetClick?: Function;
  onConfirmClick?: Function;
  selectedValue?: DateValue;
}

const DatePickerFooter = (props: DatePickerFooterProps) => {
  const [local, t] = useLocaleReceiver('datePicker');
  const confirmText = t(local.confirm);

  const { classPrefix } = useConfig();

  const {
    enableTimePicker,
    onConfirmClick,
    presetsPlacement = 'bottom',
    presets,
    onPresetClick,
    selectedValue,
  } = props;

  const footerClass = classNames(
    `${classPrefix}-date-picker__footer`,
    `${classPrefix}-date-picker__footer--${presetsPlacement}`,
  );

  return (
    <div className={footerClass}>
      {
        <div className={`${classPrefix}-date-picker__presets`}>
          {presets &&
            Object.keys(presets).map((key: string) => (
              <Button
                key={key}
                size="small"
                variant="text"
                onClick={(e) => onPresetClick(presets[key], { e, preset: { [key]: presets[key] } })}
              >
                {key}
              </Button>
            ))}
        </div>
      }
      {enableTimePicker && (
        <Button disabled={!selectedValue} size="small" theme="primary" onClick={(e) => onConfirmClick({ e })}>
          {confirmText}
        </Button>
      )}
    </div>
  );
};

DatePickerFooter.displayName = 'DatePickerFooter';

export default DatePickerFooter;
