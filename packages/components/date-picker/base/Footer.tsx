import React from 'react';
import classNames from 'classnames';
import { isFunction, isObject } from 'lodash-es';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import Button from '../../button';
import useConfig from '../../hooks/useConfig';
import { TdDatePickerProps, TdDateRangePickerProps, DateValue, DateMultipleValue } from '../type';

interface DatePickerFooterProps extends Pick<TdDatePickerProps, 'presetsPlacement' | 'needConfirm'> {
  presets?: TdDatePickerProps['presets'] | TdDateRangePickerProps['presets'];
  onPresetClick?: Function;
  onConfirmClick?: Function;
  selectedValue?: DateValue | DateMultipleValue;
  onTimePanelChange?: () => void;
  enableTimePicker?: TdDateRangePickerProps['enableTimePicker'] | TdDatePickerProps['enableTimePicker'];
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
    needConfirm,
    onTimePanelChange,
  } = props;

  const footerClass = classNames(
    `${classPrefix}-date-picker__footer`,
    `${classPrefix}-date-picker__footer--${presetsPlacement}`,
  );

  // 在日期区间选择器下，可能存在两种时间选择面板的展示方式：并列展示（parallel）和切换展示（switch）
  const isSwitchMode = isObject(enableTimePicker) && enableTimePicker?.mode === 'switch';

  const renderPresets = () => {
    if (presets) {
      if (React.isValidElement(presets)) return presets;

      if (isFunction(presets)) return presets();

      return Object.keys(presets).map((key: string) => (
        <Button
          key={key}
          size="small"
          variant="text"
          onClick={(e) => onPresetClick(presets[key], { e, preset: { [key]: presets[key] } })}
        >
          {key}
        </Button>
      ));
    }

    return null;
  };
  return (
    <div className={footerClass}>
      <div className={`${classPrefix}-date-picker__presets`}>{renderPresets()}</div>
      <div>
        {isSwitchMode && (
          <Button style={{ marginRight: 16 }} size="small" theme="primary" variant="text" onClick={onTimePanelChange}>
            {t(local.selectTime)}
          </Button>
        )}
        {enableTimePicker && needConfirm && (
          <Button disabled={!selectedValue} size="small" theme="primary" onClick={(e) => onConfirmClick({ e })}>
            {confirmText}
          </Button>
        )}
      </div>
    </div>
  );
};

DatePickerFooter.displayName = 'DatePickerFooter';

export default DatePickerFooter;
