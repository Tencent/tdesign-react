import { useState, useEffect, useMemo, useRef } from 'react';

import { isEqual, isFunction } from 'lodash-es';

import TreeStore from '@tdesign/common-js/tree-v1/tree-store';
import type { TypeTreeNodeData } from '@tdesign/common-js/tree-v1/types';
import { getTreeValue, getCascaderValue, isEmptyValues, isValueInvalid } from './core/helper';
import { treeNodesEffect, treeStoreExpendEffect } from './core/effect';

import useControlled from '../hooks/useControlled';

import type {
  TreeNode,
  TreeNodeValue,
  TdCascaderProps,
  TreeNodeModel,
  CascaderChangeSource,
  CascaderValue,
} from './interface';

import { TreeOptionData } from '../common';

export const useCascaderContext = (props: TdCascaderProps) => {
  const [innerValue, setInnerValue] = useControlled(props, 'value', props.onChange);
  const [innerPopupVisible, setPopupVisible] = useControlled(props, 'popupVisible', props.onPopupVisibleChange);

  const [inputVal, setInputVal] = useState('');
  const [treeStore, setTreeStore] = useState(null);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [expend, setExpend] = useState<TreeNodeValue[]>([]);
  const [scopeVal, setScopeVal] = useState(undefined);

  const cascaderContext = useMemo(() => {
    const {
      size,
      checkStrictly,
      lazy,
      multiple,
      filterable,
      clearable,
      checkProps,
      max,
      disabled,
      showAllLevels,
      minCollapsedNum,
      valueType,
    } = props;
    return {
      value: scopeVal,
      size,
      checkStrictly,
      lazy,
      multiple,
      filterable,
      clearable,
      checkProps,
      max,
      disabled,
      showAllLevels,
      minCollapsedNum,
      valueType,
      treeStore,
      setValue: (val: CascaderValue, source: CascaderChangeSource, node?: TreeNodeModel) => {
        if (isEqual(val, scopeVal)) return;
        setInnerValue(val, { source, node });
      },
      visible: innerPopupVisible,
      setVisible: setPopupVisible,
      treeNodes,
      setTreeNodes,
      inputVal,
      setInputVal,
      setExpend,
    };
  }, [props, scopeVal, innerPopupVisible, treeStore, treeNodes, inputVal, setInnerValue, setPopupVisible]);

  const isFilterable = useMemo(
    () => Boolean(props.filterable || isFunction(props.filter)),
    [props.filterable, props.filter],
  );

  /**
   * build tree
   */

  const { disabled, options = [], keys = {}, checkStrictly = false, lazy = true, load, valueMode = 'onlyLeaf' } = props;

  const optionCurrent = useRef([]);

  useEffect(() => {
    if (!isEqual(optionCurrent.current, options)) {
      optionCurrent.current = options;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleTreeStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const handleTreeStore = () => {
    if (!treeStore) {
      if (!options.length) return;
      const store = new TreeStore({
        keys: {
          ...keys,
          children: typeof keys.children === 'string' ? keys.children : 'children',
        },
        onLoad: () => {
          setTimeout(() => {
            store.refreshNodes();
            treeNodesEffect(inputVal, store, setTreeNodes, props.filter, checkStrictly);
          });
        },
      });
      store.append(options as Array<TypeTreeNodeData>);

      setTreeStore(store);
    } else {
      treeStore.reload(options);
      treeStore.refreshNodes();
      treeStoreExpendEffect(treeStore, scopeVal, []);
      treeNodesEffect(inputVal, treeStore, setTreeNodes, props.filter, checkStrictly);
    }
  };

  useEffect(() => {
    if (!treeStore) return;
    const treeProps = {
      keys: {
        ...keys,
        children: typeof keys.children === 'string' ? keys.children : 'children',
      },
      checkable: true,
      expandMutex: true,
      expandParent: true,
      checkStrictly,
      disabled,
      load,
      lazy,
      valueMode,
    };
    treeStore.setConfig(treeProps);
  }, [checkStrictly, disabled, keys, lazy, load, valueMode, treeStore]);

  // value 校验逻辑
  useEffect(() => {
    const { setValue, multiple, valueType = 'single' } = cascaderContext;

    if (isValueInvalid(innerValue, cascaderContext)) {
      setValue(multiple ? [] : '', 'invalid-value');
    }

    if (!isEmptyValues(innerValue)) {
      setScopeVal(getCascaderValue(innerValue, valueType, multiple));
    } else {
      setScopeVal(multiple ? [] : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue]);

  useEffect(() => {
    if (!treeStore) return;
    treeStoreExpendEffect(treeStore, scopeVal, expend);
  }, [treeStore, scopeVal, expend]);

  useEffect(() => {
    if (!treeStore) return;
    treeNodesEffect(inputVal, treeStore, setTreeNodes, props.filter, checkStrictly);
  }, [inputVal, treeStore, props.filter, checkStrictly]);

  useEffect(() => {
    if (!treeStore) return;
    treeStore.replaceChecked(getTreeValue(scopeVal));
  }, [options, scopeVal, treeStore, cascaderContext.multiple]);

  useEffect(() => {
    if (!innerPopupVisible && isFilterable) {
      setInputVal('');
    }
  }, [innerPopupVisible, isFilterable]);

  useEffect(() => {
    const { inputVal, treeStore, setTreeNodes } = cascaderContext;
    treeNodesEffect(inputVal, treeStore, setTreeNodes, props.filter, checkStrictly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVal, scopeVal]);

  const getCascaderItems = (arrValue: CascaderValue[]) => {
    const { treeStore } = cascaderContext;
    const optionsData: TreeOptionData[] = [];
    arrValue.forEach((value) => {
      const nodes = treeStore?.getNodes(value);
      nodes && nodes[0] && optionsData.push(nodes[0].data);
    });
    return optionsData;
  };

  return {
    cascaderContext,
    isFilterable,
    innerValue,
    getCascaderItems,
  };
};
