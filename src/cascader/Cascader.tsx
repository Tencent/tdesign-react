import React, { useState, useEffect, useMemo } from 'react';

// component
import Panel from './components/Panel';
import Popup from '../popup';
import InputContent from './components/InputContent';

// utils
import useConfig from '../_util/useConfig';
import TreeStore from '../_common/js/tree/tree-store';
import useDefault from '../_util/useDefault';
import { getTreeValue } from './utils/helper';

// common logic
import { treeNodesEffect, treeStoreExpendEffect } from './utils/cascader';

// types
import { CascaderProps, CascaderContextType, TreeNodeValue } from './interface';

const Cascader: React.FC<CascaderProps> = (props) => {
  /**
   * global user props, config, data
   */
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-cascader`;
  const { className, style, defaultValue, onChange, collapsedItems } = props;

  const [value, setValue] = useDefault(props.value, defaultValue, onChange);

  const [visible, setVisible] = useState(false);
  const [treeStore, setTreeStore] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [treeNodes, setTreeNodes] = useState([]);
  const [expend, setExpend] = useState<TreeNodeValue[]>([]);

  // cascaderContext, center status
  const cascaderContext = useMemo(() => {
    const {
      size = 'medium',
      disabled = false,
      checkStrictly = false,
      lazy = true,
      multiple = false,
      filterable = false,
      clearable = false,
      checkProps = {},
      max = 0,
      showAllLevels = true,
      minCollapsedNum = false,
    } = props;
    return {
      size,
      disabled,
      checkStrictly,
      lazy,
      multiple,
      filterable,
      value,
      setValue,
      visible,
      setVisible,
      treeStore,
      checkProps,
      clearable,
      showAllLevels,
      max,
      treeNodes,
      setTreeNodes,
      filterActive,
      setFilterActive,
      inputVal,
      setInputVal,
      setExpend,
      minCollapsedNum,
    } as CascaderContextType;
  }, [props, inputVal, value, setValue, visible, treeStore, treeNodes, filterActive]);

  /**
   * build tree
   */
  const { disabled, options = [], keys, checkStrictly = false, lazy = true, load, valueMode = 'onlyLeaf' } = props;

  const createStore = (onLoad: () => void) => {
    const treeProps = {
      keys: keys || {},
      checkable: true,
      checkStrictly,
      expandMutex: true,
      expandParent: true,
      disabled,
      load,
      lazy,
      valueMode,
      onLoad,
    };
    const store = new TreeStore(treeProps);
    if (!options || (Array.isArray(options) && !options.length)) return;
    store.append(options);
    return store;
  };

  if (!treeStore) {
    const store = createStore(() => {
      // onLoaded callback
      setTimeout(() => {
        store.refreshNodes();
        treeNodesEffect(inputVal, store, setTreeNodes);
      }, 0);
    });
    setTreeStore(store);
  }

  useEffect(() => {
    const treeProps = {
      keys: keys || {},
      checkable: true,
      checkStrictly,
      expandMutex: true,
      expandParent: true,
      disabled,
      load,
      lazy,
      valueMode,
    };
    treeStore.setConfig(treeProps);
  }, [checkStrictly, disabled, keys, lazy, load, options, valueMode, treeStore]);

  // treeStore and expend effect
  useEffect(() => {
    if (!treeStore) return;
    treeStoreExpendEffect(treeStore, value, expend);
  }, [treeStore, value, expend]);

  // value change will effect treeNodes, in filter, inputVal will also change treeNodes
  useEffect(() => {
    if (!treeStore) return;
    treeNodesEffect(inputVal, treeStore, setTreeNodes);
  }, [inputVal, treeStore, value]);

  // tree checked effect
  useEffect(() => {
    if (!treeStore) return;
    treeStore.replaceChecked(getTreeValue(value));
  }, [value, treeStore]);

  useEffect(() => {
    if (!filterActive) {
      setInputVal('');
    }
  }, [filterActive]);

  // panel props
  const { empty = '暂无数据', trigger = 'click' } = props;

  // inputContent props
  const { placeholder = '请输入', onRemove, onBlur, onFocus } = props;

  return (
    <Popup
      placement="bottom-left"
      visible={visible}
      overlayClassName={`${name}-dropdown`}
      destroyOnClose
      {...props?.popupProps}
      content={<Panel cascaderContext={cascaderContext} trigger={trigger} onChange={onChange} empty={empty} />}
    >
      <InputContent
        collapsedItems={collapsedItems}
        cascaderContext={cascaderContext}
        style={style}
        className={className}
        listeners={{
          onRemove,
          onBlur,
          onFocus,
          onChange,
        }}
        placeholder={placeholder}
      />
      <></>
    </Popup>
  );
};

export default Cascader;
