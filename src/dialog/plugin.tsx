import React from 'react';
import ReactDOM from 'react-dom';
import DialogComponent, { DialogProps } from './Dialog';

import { getAttach } from '../_util/dom';
import { DialogOptions, DialogMethod, DialogConfirmMethod, DialogAlertMethod, DialogInstance } from './type';

export interface DialogPluginType extends DialogMethod {
  alert?: DialogAlertMethod;
  confirm?: DialogConfirmMethod;
}

const createDialog: DialogPluginType = (props: DialogOptions): DialogInstance => {
  const dialogRef = React.createRef<DialogInstance>();
  const options = { ...props };
  const { visible = true, destroyOnClose = true } = options;
  const fragment = document.createDocumentFragment();

  ReactDOM.render(
    <DialogComponent {...(options as DialogProps)} visible={visible} ref={dialogRef} isPlugin />,
    fragment,
    () => {
      (document.activeElement as HTMLElement).blur();
    },
  );
  const container = getAttach(options.attach);
  if (container) {
    container.appendChild(fragment);
  } else {
    console.error('attach is not exist');
  }

  const dialogNode: DialogInstance = {
    show: () => {
      container.appendChild(fragment);
      dialogRef.current?.show();
    },
    hide: () => {
      destroyOnClose ? dialogRef.current?.destroy() : dialogRef.current?.hide();
    },
    update: (updateOptions: DialogOptions) => {
      dialogRef.current?.update(updateOptions);
    },
    destroy: () => {
      dialogRef.current?.destroy();
    },
  };
  return dialogNode;
};

const confirm: DialogConfirmMethod = (props: DialogOptions) => createDialog(props);

const alert: DialogAlertMethod = (props: Omit<DialogOptions, 'confirmBtn'>) => {
  const options = { ...props };
  options.cancelBtn = null;
  return createDialog(options);
};

createDialog.alert = alert;
createDialog.confirm = confirm;

export const DialogPlugin = createDialog;
