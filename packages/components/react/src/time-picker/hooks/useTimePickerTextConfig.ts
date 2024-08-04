import { useLocaleReceiver } from '../../locale/LocalReceiver';

export const useTimePickerTextConfig = () => {
  const [local, t] = useLocaleReceiver('timePicker');
  return {
    nowTime: t(local.now),
    confirm: t(local.confirm),
    am: t(local.anteMeridiem),
    pm: t(local.postMeridiem),
    placeholder: t(local.placeholder),
    rangePlaceholder: [t(local.placeholder), t(local.placeholder)],
  };
};
