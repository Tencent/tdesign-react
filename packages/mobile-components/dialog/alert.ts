import { MouseEvent } from 'react';
import { TNode } from '../common';
import { show } from './show';
import { DialogProps } from './index';

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
