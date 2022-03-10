import React from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import Button from '../../button';
import useConfig from '../../_util/useConfig';
import { TdDatePickerProps } from '../type';

interface DatePickerFooterProps extends Pick<TdDatePickerProps, 'enableTimePicker'> {
  onConfirmClick: Function;
  children: React.ReactNode;
}

const DatePickerFooter = (props: DatePickerFooterProps) => {
  const [local, t] = useLocaleReceiver('datePicker');
  const confirmText = t(local.confirm);

  const { classPrefix } = useConfig();

  const { enableTimePicker, onConfirmClick, children } = props;

  return (
    <div className={`${classPrefix}-date-picker__footer`}>
      {children}
      {enableTimePicker && (
        <Button size="small" theme="primary" onClick={() => onConfirmClick()}>
          {confirmText}
        </Button>
      )}
    </div>
  );
};

DatePickerFooter.displayName = 'DatePickerFooter';

export default DatePickerFooter;
