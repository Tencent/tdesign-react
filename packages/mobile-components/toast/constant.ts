export enum ToastThemeListEnum {
  success = 'success',
  warning = 'warning',
  error = 'error',
  loading = 'loading',
}

export enum IconType {
  success = 'check-circle',
  warning = 'error-circle',
  error = 'close-circle',
  loading = 'loading',
}

export const defaultProps = {
  duration: 2000,
  visible: true,
  content: '',
  icon: false,
};
