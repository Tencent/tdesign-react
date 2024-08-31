import React from 'react';
import type { TreeSelectProps } from './TreeSelect';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import useConfig from '../hooks/useConfig';

export const useTreeSelectLocale = (props: TreeSelectProps) => {
  const { classPrefix } = useConfig();
  const [local, t] = useLocaleReceiver('treeSelect');
  const emptyText: string = t(local.empty);
  const placeholderText: string = t(local.placeholder);
  const loadingTextLabel: string = t(local.loadingText);
  return {
    empty: props.empty ?? <div className={`${classPrefix}-select__empty`}>{emptyText}</div>,
    loadingItem: (
      <p className={`${classPrefix}-select__loading-tips`}>
        {props.loadingText ?? <div className={`${classPrefix}-select__empty`}>{loadingTextLabel}</div>}
      </p>
    ),
    placeholder: props.placeholder ?? placeholderText,
  };
};
