import { useEffect, useMemo, useRef, useState } from 'react';
import { isArray, isEqual, isFunction } from 'lodash-es';

import { pathToKey } from '@tdesign/common-js/tree-v1/tree-node-model';
import TreeStore from '@tdesign/common-js/tree-v1/tree-store';
import type { TypeTreeNodeData } from '@tdesign/common-js/tree-v1/types';

import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import { treeNodesEffect, treeStoreExpendEffect } from './core/effect';
import { getTreeValue, isEmptyValues, isValueInvalid } from './core/helper';
import { cascaderDefaultProps } from './defaultProps';

import type { TreeOptionData } from '../common';
import type {
  CascaderChangeSource,
  CascaderValue,
  TdCascaderProps,
  TreeNode,
  TreeNodeModel,
  TreeNodeValue,
} from './interface';

export const useCascaderContext = (originalProps: TdCascaderProps) => {
  const props = useDefaultProps(originalProps, cascaderDefaultProps);
  const { disabled, options, keys = {}, checkStrictly, lazy, multiple, reserveKeyword, valueMode, load } = props;

  const [innerValue, setInnerValue] = useControlled(props, 'value', props.onChange);
  const [innerPopupVisible, setPopupVisible] = useControlled(props, 'popupVisible', props.onPopupVisibleChange);

  const [inputVal, setInputVal] = useState('');
  const [treeStore, setTreeStore] = useState(null);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [expend, setExpend] = useState<TreeNodeValue[]>([]);
  const [scopeVal, setScopeVal] = useState(undefined);

  // valueMode = 'parentFirst' || 'all' 和 checkStrictly 都允许父节点被选中
  const isParentFilterable = useMemo(
    () => !!((['parentFirst', 'all'].includes(props.valueMode) || props.checkStrictly) && inputVal),
    [props.valueMode, props.checkStrictly, inputVal],
  );

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
      isParentFilterable,
    };
  }, [
    props,
    scopeVal,
    innerPopupVisible,
    treeStore,
    treeNodes,
    inputVal,
    setInnerValue,
    setPopupVisible,
    isParentFilterable,
  ]);

  const isFilterable = useMemo(
    () => Boolean(props.filterable || isFunction(props.filter)),
    [props.filterable, props.filter],
  );

  /**
   * build tree
   */

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
        allowDuplicateValue: props.valueType === 'full',
        onLoad: () => {
          setTimeout(() => {
            store.refreshNodes();
            treeNodesEffect(inputVal, store, setTreeNodes, props.filter, isParentFilterable);
          });
        },
      });
      store.append(options as Array<TypeTreeNodeData>);

      setTreeStore(store);
    } else {
      treeStore.reload(options);
      treeStore.refreshNodes();
      treeStoreExpendEffect(treeStore, scopeVal, [], props.valueType);
      treeNodesEffect(inputVal, treeStore, setTreeNodes, props.filter, isParentFilterable);
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
    const { setValue, multiple } = cascaderContext;

    if (isValueInvalid(innerValue, cascaderContext)) {
      setValue(multiple ? [] : '', 'invalid-value');
    }

    if (!isEmptyValues(innerValue)) {
      setScopeVal(innerValue);
    } else {
      setScopeVal(multiple ? [] : '');
    }

    if (multiple && !reserveKeyword) {
      setInputVal('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue, multiple, reserveKeyword]);

  useEffect(() => {
    if (!treeStore) return;
    treeStoreExpendEffect(treeStore, scopeVal, expend, props.valueType);
  }, [treeStore, scopeVal, expend, props.valueType]);

  useEffect(() => {
    if (!treeStore) return;
    treeNodesEffect(inputVal, treeStore, setTreeNodes, props.filter, isParentFilterable);
  }, [inputVal, treeStore, props.filter, isParentFilterable]);

  useEffect(() => {
    if (!treeStore) return;

    const { valueType } = props;

    const getCheckedKeys = (): TreeNodeValue[] => {
      if (valueType !== 'full') {
        return getTreeValue(scopeVal);
      }

      const isValidPath = (path: unknown): path is TreeNodeValue[] => Array.isArray(path) && path.length > 0;

      // 多选模式
      if (multiple && Array.isArray(scopeVal)) {
        return (scopeVal as TreeNodeValue[][]).filter(isValidPath).map(pathToKey);
      }

      // 单选模式
      return isValidPath(scopeVal) ? [pathToKey(scopeVal)] : [];
    };

    treeStore.replaceChecked(getCheckedKeys());
  }, [options, scopeVal, treeStore, multiple, props]);

  useEffect(() => {
    if (!innerPopupVisible && isFilterable) {
      setInputVal('');
    }
  }, [innerPopupVisible, isFilterable]);

  useEffect(() => {
    const { inputVal, treeStore, setTreeNodes } = cascaderContext;
    treeNodesEffect(inputVal, treeStore, setTreeNodes, props.filter, isParentFilterable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVal, scopeVal, isParentFilterable]);

  const getCascaderItems = (
    arrValue: CascaderValue[],
    valueType: TdCascaderProps['valueType'],
    multiple: TdCascaderProps['multiple'],
  ) => {
    const { treeStore } = cascaderContext;
    if (!treeStore) return [];

    const optionsData: TreeOptionData[] = [];

    const pushNodeData = (node?: TreeNode) => {
      if (node?.data) optionsData.push(node.data);
    };

    if (valueType === 'full') {
      const values = multiple ? arrValue : [arrValue];
      values.forEach((v) => {
        if (isArray(v) && v.length) {
          pushNodeData(treeStore.getNode(v as TreeNodeValue[]));
        }
      });
      return optionsData;
    }

    arrValue.forEach((v) => {
      const node = treeStore.getNodes(v)?.[0];
      pushNodeData(node);
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
