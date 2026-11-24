import { MouseEvent } from 'react';
import { TNode } from '../common';
import { show } from './show';
import { DialogProps } from './index';

export type DialogConfirmProps = Omit<DialogProps, 'visible' | 'actions'> & {
  confirmBtn?: TNode;
  cancelBtn?: TNode;
  onCancel?: (context: { e: MouseEvent<HTMLButtonElement> }) => void;
  onConfirm?: (context: { e: MouseEvent<HTMLButtonElement> }) => void;
};

export function confirm(props: DialogConfirmProps) {
  const defaultProps: DialogProps = {
    confirmBtn: '确认',
    cancelBtn: '取消',
  };

  return show({
    ...defaultProps,
    ...props,
  });
}
