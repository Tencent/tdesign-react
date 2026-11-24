import './style';
import { attachMethodsToComponent } from '../_util/attachMethodsToComponent';
import { alert } from './alert';
import { confirm } from './confirm';
import _Dialog, { DialogProps } from './Dialog';
import { show } from './show';
import { DialogAlertMethod, DialogConfirmMethod, DialogMethod } from './type';

export type { DialogProps } from './Dialog';
export type { DialogShowProps } from './show';
export type { DialogAlertProps } from './alert';
export type { DialogConfirmProps } from './confirm';
export * from './type';

export interface DialogPluginType extends DialogMethod {
  alert?: DialogAlertMethod;
  confirm?: DialogConfirmMethod;
}

export const DialogPlugin: DialogPluginType = attachMethodsToComponent(show, {
  alert,
  confirm,
});

export interface DialogType extends React.FC<DialogProps> {
  alert?: DialogAlertMethod;
  confirm?: DialogConfirmMethod;
}

export const Dialog: DialogType = attachMethodsToComponent(_Dialog, {
  alert,
  confirm,
});

export default Dialog;
