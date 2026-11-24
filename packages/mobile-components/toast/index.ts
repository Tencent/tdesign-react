import { attachMethodsToComponent } from '../_util/attachMethodsToComponent';
import { ToastOptions } from './type';
import * as methods from './methods';

import './style';

export * from './type';

type ToastApi = {
  /** 展示提示 */
  (options?: Partial<ToastOptions> | string): void;
  /** 展示加载提示 */
  loading: (options?: Partial<ToastOptions> | string) => void;
  /** 展示成功提示 */
  success: (options?: Partial<ToastOptions> | string) => void;
  /** 展示警告提示 */
  warning: (options?: Partial<ToastOptions> | string) => void;
  /** 展示失败提示 */
  error: (options?: Partial<ToastOptions> | string) => void;
  /** 关闭提示 */
  clear: () => void;
};

const { success, warning, loading, error, createToast, clear } = methods.default;
const innerToast = (props: ToastOptions) => createToast(props);

export const ToastPlugin: ToastApi = attachMethodsToComponent(innerToast, {
  success,
  warning,
  error,
  loading,
  clear,
});

export const Toast = ToastPlugin;
export default ToastPlugin;
