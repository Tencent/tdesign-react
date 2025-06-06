import React from 'react';
import log from '@tdesign/common-js/log/index';
import { render } from '../_util/react-render';
import DialogComponent, { DialogProps } from './Dialog';

import { getAttach } from '../_util/dom';
import { DialogOptions, DialogMethod, DialogConfirmMethod, DialogAlertMethod, DialogInstance } from './type';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';

export interface DialogPluginType extends DialogMethod {
  alert: DialogAlertMethod;
  confirm: DialogConfirmMethod;
}

const createDialog: DialogPluginType = (props: DialogOptions): DialogInstance => {
  const dialogRef = React.createRef<DialogInstance>();
  const options = { ...props };
  const { visible = true } = options;

  const fragment = document.createDocumentFragment();

  const dGlobalConfig = ConfigProvider.getGlobalConfig();
  render(<PluginContainer globalConfig={dGlobalConfig}><DialogComponent {...(options as DialogProps)} visible={visible} ref={dialogRef} isPlugin /></PluginContainer>, fragment);const container = getAttach(options.attach);
  
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
    setConfirmLoading: (loading: boolean) => {
      requestAnimationFrame(() => {
        dialogRef.current?.setConfirmLoading(loading);
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
