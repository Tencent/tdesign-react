import { show } from './show';

import type { MouseEvent } from 'react';
import type { TNode } from '../common';
import type { DialogProps } from './index';

export type DialogAlertProps = Omit<DialogProps, 'visible' | 'cancelBtn' | 'actions'> & {
  confirmBtn?: TNode;
  onConfirm?: (context: { e: MouseEvent<HTMLButtonElement> }) => void;
};

export function alert(props: DialogAlertProps) {
  const defaultProps: DialogProps = {
    confirmBtn: '确认',
  };

  return show({
    ...defaultProps,
    ...props,
    cancelBtn: null,
  });
}
