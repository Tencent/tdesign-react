import React, { useState, useEffect, useMemo } from 'react';

// component
import Panel from './Panel';
import Popup from '../popup';
import InputContent from './InputContent';

// utils
import useConfig from '../_util/useConfig';
import TreeStore from '../_common/js/tree/tree-store';

// types
import { CascaderProps, CascaderContextType, TreeNode, TreeNodeValue, TreeOptionData } from './interface';

const Cascader: React.FC<CascaderProps> = (props) => {
  /**
   * global user props, config, data
   */
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-cascader`;
  const { className, style, value = [], multiple } = props;

  const [visible, setVisible] = useState(false);
  const [treeStore, setTreeStore] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [model, setModel] = useState(value);
  const [treeNodes, setTreeNodes] = useState([]);

  // cascaderContext
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
      max = undefined,
      showAllLevels = true,
    } = props;
    return {
      size,
      disabled,
      checkStrictly,
      lazy,
      multiple,
      filterable,
      model,
      setModel,
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
    } as CascaderContextType;
  }, [props, model, visible, treeStore, treeNodes, filterActive]);

  /**
   * build tree and globals tree logic
   */
  const {
    disabled,
    options = [],
    keys,
    checkStrictly = false,
    lazy = true,
    load,
    onChange,
    valueMode = 'onlyLeaf',
  } = props;

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
    const store = new TreeStore(treeProps);
    if (!options || (Array.isArray(options) && !options.length)) return;
    store.append(options);
    setTreeStore(store);
  }, [checkStrictly, disabled, keys, lazy, load, options, valueMode]);

  /**
   * value change effect
   */

  useEffect(() => {
    if (!treeStore) return;
    let treeValue: TreeNodeValue[] = [];
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        treeValue = (value as TreeOptionData[]).map((val) => val.value);
      } else if (value.length) {
        treeValue = value as TreeNodeValue[];
      }
    } else if (value) {
      if (typeof value === 'object') {
        treeValue = [(value as TreeOptionData).value];
      } else {
        treeValue = [value];
      }
    }

    if (!treeValue.length && visible && multiple) return;

    if (Array.isArray(treeValue)) {
      treeStore.replaceChecked(treeValue);
    }
    // init expanded
    if (Array.isArray(treeValue)) {
      const expandedMap = new Map();
      // get first value
      const [val] = treeValue;
      if (val) {
        expandedMap.set(val, true);
        const node = treeStore.getNode(val);
        node.getParents().forEach((tn: TreeNode) => {
          expandedMap.set(tn.value, true);
        });
        const expandedArr = Array.from(expandedMap.keys());
        treeStore.setExpanded(expandedArr);
      }
    }
    treeStore.refreshNodes();
    const nodes = treeStore.getNodes().filter((node: TreeNode) => node.visible);
    setTreeNodes(nodes);
  }, [value, treeStore, model, visible, multiple]);

  useEffect(() => {
    setModel(value);
  }, [value]);

  useEffect(() => {
    if (!treeStore) return;
    if (!multiple) {
      treeStore.replaceChecked([model]);
    } else {
      treeStore.replaceChecked(model);
    }
    treeStore.refreshNodes();
  }, [model, treeStore, multiple]);

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
