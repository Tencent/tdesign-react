import { useLocaleReceiver } from '../locale/LocalReceiver';

export const useTimePickerTextConfig = () => {
  const [local, t] = useLocaleReceiver('timePicker');
  return {
    nowtime: t(local.now),
    confirm: t(local.confirm),
    am: t(local.anteMeridiem),
    pm: t(local.postMeridiem),
    placeholder: t(local.placeholder),
  };
};

export const AM = 'am';
export const PM = 'pm';
export const MERIDIEM_LIST = [AM, PM];

export const DEFAULT_STEPS = [1, 1, 1];
export const DEFAULT_FORMAT = 'HH:mm:ss';
