import { ElementRef, MutableRefObject, useMemo } from 'react';
import TreeStore from '@tdesign/common-js/tree-v1/tree-store';
import type { TypeTreeNodeData } from '@tdesign/common-js/tree-v1/types';
import type { TreeSelectValue } from '../type';
import Tree, { TreeNodeValue } from '../../tree';
import { usePersistFn } from '../../hooks/usePersistFn';
import { treeSelectDefaultProps } from '../defaultProps';

import type { NodeOptions, TreeSelectProps } from '../TreeSelect';

export const useTreeSelectUtils = (
  { data, treeProps, valueType }: TreeSelectProps,
  treeRef: MutableRefObject<ElementRef<typeof Tree>>,
) => {
  const defaultStore = useMemo(() => {
    const store = new TreeStore({
      ...treeSelectDefaultProps.treeProps,
      ...treeProps,
    });
    store.append(data as Array<TypeTreeNodeData>);
    return store;
  }, [data, treeProps]);

  const getNodeItem = usePersistFn((value: string | number) => {
    if (treeRef.current) {
      return treeRef.current.getItem(value);
    }
    return defaultStore.getNode(value)?.getModel();
  });

  const formatValue = usePersistFn((value: TreeNodeValue | null, label = String(value)) => {
    const valueKey = treeProps?.keys?.value ?? 'value';
    const labelKey = treeProps?.keys?.label ?? 'label';
    return value && valueType === 'object' ? { [valueKey]: value, [labelKey]: label } : value;
  });

  const normalizeValue = usePersistFn((value: TreeSelectValue) => {
    const valueKey = treeProps?.keys?.value ?? 'value';
    const labelKey = treeProps?.keys?.label ?? 'label';
    const realValue = valueType === 'value' ? (value as string) : (value as NodeOptions)?.[valueKey];
    const node = getNodeItem(realValue);
    const realLabel = valueType === 'object' ? value?.[labelKey] : undefined;
    return {
      value: realValue,
      label: node?.label ?? realLabel ?? String(realValue),
    };
  });

  return {
    getNodeItem,
    formatValue,
    normalizeValue,
  };
};
