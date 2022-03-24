import React from 'react';
import classNames from 'classnames';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import Button from '../../button';
import useConfig from '../../_util/useConfig';
import { TdDatePickerProps } from '../type';

interface DatePickerFooterProps extends Pick<TdDatePickerProps, 'enableTimePicker' | 'presets' | 'presetsPlacement'> {
  onPresetClick: Function;
  onConfirmClick: Function;
}

const DatePickerFooter = (props: DatePickerFooterProps) => {
  const [local, t] = useLocaleReceiver('datePicker');
  const confirmText = t(local.confirm);

  const { classPrefix } = useConfig();

  const { enableTimePicker, onConfirmClick, presetsPlacement = 'bottom', presets, onPresetClick } = props;

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
              <Button key={key} size="small" variant="text" onClick={(e) => onPresetClick(presets[key], { e })}>
                {key}
              </Button>
            ))}
        </div>
      }
      {enableTimePicker && (
        <Button size="small" theme="primary" onClick={(e) => onConfirmClick({ e })}>
          {confirmText}
        </Button>
      )}
    </div>
  );
};

DatePickerFooter.displayName = 'DatePickerFooter';

export default DatePickerFooter;
