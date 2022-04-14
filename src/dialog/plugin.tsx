import React from 'react';
import ReactDOM from 'react-dom';
import DialogComponent, { DialogProps } from './Dialog';

import { getAttach } from '../_util/dom';
import { DialogOptions, DialogMethod, DialogConfirmMethod, DialogAlertMethod, DialogInstance } from './type';

export interface DialogPlugin extends DialogMethod {
  alert?: DialogAlertMethod;
  confirm?: DialogConfirmMethod;
}

const createDialog: DialogPlugin = (props: DialogOptions): DialogInstance => {
  const dialogRef = React.createRef<DialogInstance>();
  const options = { ...props };
  const div = document.createElement('div');

  ReactDOM.render(
    <DialogComponent {...(options as DialogProps)} visible={true} ref={dialogRef} isPlugin />,
    div,
    () => {
      (document.activeElement as HTMLElement).blur();
    },
  );
  const container = getAttach(options.attach);
  if (container) {
    container.appendChild(div);
  } else {
    console.error('attach is not exist');
  }

  const dialogNode: DialogInstance = {
    show: () => {
      container.appendChild(div);
      dialogRef.current?.show();
    },
    hide: () => {
      div?.parentNode?.removeChild(div);
      dialogRef.current?.hide();
    },
    update: (updateOptions: DialogOptions) => {
      dialogRef.current?.update(updateOptions);
    },
    destroy: () => {
      dialogRef.current?.destroy();
      div?.parentNode?.removeChild(div);
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
