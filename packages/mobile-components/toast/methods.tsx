import React from 'react';
import { isObject } from 'lodash-es';
import { render, unmount } from '../_util/react-render';
import { TdToastProps, ToastOptions } from './type';
import { defaultProps, ToastThemeListEnum } from './constant';
import Toast from './Toast';
import { getAttach } from '../_util/dom';

function getToastProps(props: ToastOptions) {
  return typeof props === 'string' ? { message: props } : props;
}

let el: HTMLElement | null;
let curProps: TdToastProps | null;

const destroyToast = (targetEl: HTMLElement | null, targetProps?: TdToastProps | null, invokeClose = false) => {
  if (!targetEl) return;

  const onClose = () => {
    if (invokeClose) targetProps?.onClose?.();
  };
  const remove = () => {
    targetEl.parentNode?.removeChild(targetEl);
  };

  const unmountResult = unmount(targetEl);
  if (unmountResult && typeof (unmountResult as Promise<void>).then === 'function') {
    (unmountResult as Promise<void>).then(remove).finally(onClose);
    return;
  }

  remove();
  onClose();
};

const clear = () => {
  if (!el) return;

  const targetEl = el;
  const targetProps = curProps;
  el = null;
  curProps = null;
  destroyToast(targetEl, targetProps, true);
};

const createToast = (props: ToastOptions) => {
  const config = { ...defaultProps, ...getToastProps(props) } as TdToastProps;

  clear();

  const currentEl = document.createElement('div');
  el = currentEl;

  const container = getAttach(isObject(props) ? props.attach : 'body');
  if (container) {
    container.appendChild(currentEl);
  } else {
    console.error('attach is not exist');
  }

  render(
    <Toast
      {...{
        ...config,
        el: currentEl,
        onClose: () => {
          config.onClose?.();
          config.onDestroy?.();
          if (el === currentEl) {
            el = null;
            curProps = null;
          }
        },
      }}
    />,
    currentEl,
  );
  curProps = config;

  return {
    destroy: () => {
      if (el !== currentEl) {
        destroyToast(currentEl, config, true);
        return;
      }
      clear();
    },
  };
};

export default {
  createToast,
  success: (props: ToastOptions) => createToast({ ...getToastProps(props), theme: ToastThemeListEnum.success }),
  warning: (props: ToastOptions) => createToast({ ...getToastProps(props), theme: ToastThemeListEnum.warning }),
  error: (props: ToastOptions) => createToast({ ...getToastProps(props), theme: ToastThemeListEnum.error }),
  loading: (props: ToastOptions) => createToast({ ...getToastProps(props), theme: ToastThemeListEnum.loading }),
  clear,
};
