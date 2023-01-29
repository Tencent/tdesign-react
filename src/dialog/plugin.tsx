import React from 'react';
import { render } from '../_util/react-render';
import DialogComponent, { DialogProps } from './Dialog';

import { getAttach } from '../_util/dom';
import { DialogOptions, DialogMethod, DialogConfirmMethod, DialogAlertMethod, DialogInstance } from './type';
import log from '../_common/js/log';

export interface DialogPluginType extends DialogMethod {
  alert: DialogAlertMethod;
  confirm: DialogConfirmMethod;
}

const createDialog: DialogPluginType = (props: DialogOptions): DialogInstance => {
  const dialogRef = React.createRef<DialogInstance>();
  const options = { ...props };
  const fragment = document.createDocumentFragment();

  render(<DialogComponent {...(options as DialogProps)} visible={true} ref={dialogRef} isPlugin />, fragment);

  const container = getAttach(options.attach);
  if (container) {
    container.appendChild(fragment);
  } else {
    log.error('Dialog', 'attach is not exist');
  }

  const dialogNode: DialogInstance = {
    show: () => {
      requestAnimationFrame(() => {
        container.appendChild(fragment);
        dialogRef.current?.show();
      });
    },
    hide: () => {
      requestAnimationFrame(() => {
        dialogRef.current?.destroy();
      });
    },
    update: (updateOptions: DialogOptions) => {
      requestAnimationFrame(() => {
        dialogRef.current?.update(updateOptions);
      });
    },
    destroy: () => {
      requestAnimationFrame(() => {
        dialogRef.current?.destroy();
      });
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
