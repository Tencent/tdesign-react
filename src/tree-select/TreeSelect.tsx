import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react';

import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdTreeSelectProps, TreeSelectValue } from './type';
import { StyledProps, TreeOptionData } from '../common';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';

import Popup from '../popup';
import Tree, { TreeNodeModel, TreeNodeValue } from '../tree';
import TreeStore from '../_common/js/tree/tree-store';

import TreeSelectTags from './TreeSelectTags';
import TreeSelectInput from './TreeSelectInput';
import TreeSelectSuffix from './TreeSelectSuffix';
import useTreeSelectConfig from './useTreeSelectConfig';

export interface TreeSelectProps extends TdTreeSelectProps, StyledProps {}

export interface NodeOptions {
  label: string;
  value: string | number;
}

const TreeSelect = forwardRef((props: TreeSelectProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className: treeSelectClassName,
    style: treeSelectStyle,
    disabled,
    multiple,
    prefixIcon,
    valueType,
    loading,
    max,
    treeProps,
    empty,
    data,
    loadingText,
    filter,
    filterable,
    onClear,
  } = props;
  const { classPrefix } = useConfig();

  const popupRef = useRef(null);
  const treeRef = useRef(null);
  const inputRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [focusing, setFocusing] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [actived, setActived] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [nodeInfo, setNodeInfo] = useState(null);

  const [value, onChange] = useDefault(props.value, props.defaultValue, props.onChange);

  const { selectClassName, popupObject, popupClassName } = useTreeSelectConfig({ visible, ...props });

  // 初始化 Tree 组件未渲染需要提供默认的树形数据结构
  const defaultStore = new TreeStore({ ...treeProps });
  defaultStore.append(data);
  const defaultGetTreeItem = (value: TreeNodeValue) => {
    const node = defaultStore.getNode(value);
    return node?.getModel();
  };

  const selectedMultiple: Array<TreeSelectValue> = useMemo(() => {
    if (multiple && isArray(value) && !isEmpty(value)) {
      return value;
    }
    return [];
  }, [multiple, value]);

  const selectedSingle: string = useMemo(() => {
    if (multiple) return '';

    if (typeof value === 'undefined') {
      return nodeInfo ? nodeInfo.label : '';
    }

    return nodeInfo ? nodeInfo.label : `${value}`;
  }, [multiple, value, nodeInfo]);

  const checked: any = useMemo(() => {
    if (multiple) {
      if (valueType === 'object') {
        return isArray(value) ? value.map((item) => (item as NodeOptions).value) : [];
      }
      return isArray(value) ? value : [];
    }
    return [];
  }, [multiple, valueType, value]);

  const showLoading: boolean = useMemo(() => loading && !disabled, [loading, disabled]);

  const showFilter: boolean = useMemo(() => {
    if (disabled) {
      return false;
    }
    if (!multiple && selectedSingle && (filterable || isFunction(filter))) {
      return visible;
    }
    return filterable || isFunction(filter);
  }, [disabled, multiple, selectedSingle, filterable, visible, filter]);

  const multiLimitDisabled: boolean = useMemo(() => {
    if (multiple && max && isArray(value) && max <= value.length) {
      return true;
    }
    return false;
  }, [multiple, max, value]);

  const realLabel: string = useMemo(() => {
    if (!isEmpty(treeProps) && !isEmpty(treeProps.keys)) {
      return treeProps.keys.label || 'label';
    }
    return 'label';
  }, [treeProps]);

  const realValue: string = useMemo(() => {
    if (!isEmpty(treeProps) && !isEmpty(treeProps.keys)) {
      return treeProps.keys.value || 'value';
    }
    return 'value';
  }, [treeProps]);

  const tagList: Array<TreeSelectValue> = useMemo(() => {
    if (nodeInfo && isArray(nodeInfo)) {
      return nodeInfo.map((node) => node.label);
    }
    return selectedMultiple;
  }, [nodeInfo, selectedMultiple]);

  const filterByText = useCallback(
    (node: TreeNodeModel<TreeOptionData>): boolean => {
      if (isFunction(filter)) {
        const filterValue: boolean | Promise<boolean> = filter(filterText, node);
        if (isBoolean(filterValue)) {
          return filterValue;
        }
      }
      return node.data[realLabel].indexOf(filterText) >= 0;
    },
    [filterText, realLabel, filter],
  );

  useEffect(() => {
    if (valueType === 'object') {
      setActived(isArray(value) ? value.map((item) => (item as NodeOptions).value) : [(value as NodeOptions).value]);
    } else {
      setActived(isArray(value) ? value : [value]);
    }
    changeNodeInfo(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, valueType]);

  function handleClear(e: React.MouseEvent<SVGSVGElement>) {
    e.stopPropagation();

    const defaultValue: TreeSelectValue = multiple ? [] : '';
    onChange?.(defaultValue, null);
    setActived([]);
    setFilterText('');
    setNodeInfo(null);
    onClear?.({ e });
  }

  function changeNodeInfo(value) {
    if (!multiple && value) {
      const nodeValue = valueType === 'object' ? (value as NodeOptions).value : value;
      const node = treeRef.current?.getItem(nodeValue) || defaultGetTreeItem(nodeValue);
      node ? setNodeInfo({ label: node.data[realLabel], value: node.data[realValue] }) : setNodeInfo(null);
    } else if (multiple && isArray(value)) {
      setNodeInfo(
        value.map((value) => {
          const nodeValue = valueType === 'object' ? (value as NodeOptions).value : value;
          const node = treeRef.current?.getItem(nodeValue) || defaultGetTreeItem(nodeValue);
          return node ? { label: node.data[realLabel], value: node.data[realValue] } : {};
        }),
      );
    } else {
      setNodeInfo(null);
    }
  }

  function treeNodeChange(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData> }) {
    let current: TreeSelectValue = value;
    if (valueType === 'object') {
      current = value.map((nodeValue) => {
        const node = treeRef.current.getItem(nodeValue);
        return { label: node.data[realLabel], value: node.data[realValue] };
      });
    }
    onChange?.(current, context);
  }

  function treeNodeActive(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData> }) {
    // 多选模式屏蔽 Active 事件
    if (multiple) return;

    const nodeValue = isEmpty(value) ? '' : value[0];
    const node = treeRef.current.getItem(nodeValue);
    let current: TreeSelectValue = nodeValue;

    if (valueType === 'object' && node) {
      current = { label: node.data[realLabel], value: node.data[realValue] };
    }

    onChange?.(current, context);
    setFilterText('');
    setVisible(false);
  }

  function treeNodeExpand(value: Array<TreeNodeValue>) {
    setExpanded(value);
  }

  function popupVisibleChange(visible: boolean) {
    if (focusing && !visible) {
      setVisible(true);
      return;
    }
    setVisible(visible);
    if (showFilter && visible) {
      inputRef.current?.focus();
    }
  }

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('treeSelect');
  const emptyText = t(local.empty);
  const loadingTextLabel = t(local.loadingText);

  const treeItem = !loading && (
    <Tree
      ref={treeRef}
      value={checked}
      hover
      expandAll
      expandOnClickNode
      data={data}
      activable={!multiple}
      checkable={multiple}
      disabled={disabled || multiLimitDisabled}
      empty={empty || <div className={`${classPrefix}-select-empty`}>{emptyText}</div>}
      filter={filterByText}
      actived={actived}
      expanded={expanded}
      activeMultiple={multiple}
      onChange={treeNodeChange}
      onActive={treeNodeActive}
      onExpand={treeNodeExpand}
      {...treeProps}
    />
  );

  const loadingTip = showLoading && (
    <p className={`${classPrefix}-select-loading-tips`}>
      {loadingText || <div className={`${classPrefix}-select-empty`}>{loadingTextLabel}</div>}
    </p>
  );

  return (
    <div ref={ref} className={treeSelectClassName} style={treeSelectStyle}>
      <Popup
        ref={popupRef}
        className={`${classPrefix}-select-popup-reference`}
        visible={visible}
        disabled={disabled}
        placement={popupObject.placement}
        trigger={popupObject.trigger}
        overlayStyle={popupObject.overlayStyle}
        overlayClassName={popupClassName}
        onVisibleChange={popupVisibleChange}
        expandAnimation={true}
        content={
          <>
            {loadingTip}
            {treeItem}
          </>
        }
      >
        <div
          style={{ minHeight: 30 }}
          className={selectClassName}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {prefixIcon && <span className={`${classPrefix}-select-left-icon`}>{prefixIcon}</span>}

          <TreeSelectTags tagList={tagList} {...props} />

          <TreeSelectInput
            ref={inputRef}
            visible={visible}
            filterText={filterText}
            selectedSingle={selectedSingle}
            setFocusing={setFocusing}
            setFilterText={setFilterText}
            {...props}
          />

          <TreeSelectSuffix
            visible={visible}
            isHover={isHover}
            showLoading={showLoading}
            handleClear={handleClear}
            {...props}
          />
        </div>
      </Popup>
    </div>
  );
});

TreeSelect.displayName = 'TreeSelect';

TreeSelect.defaultProps = {
  clearable: false,
  data: [],
  disabled: false,
  empty: '',
  filterable: false,
  loading: false,
  loadingText: '',
  max: 0,
  multiple: false,
  placeholder: '请输入',
  size: 'medium',
  valueType: 'value',
  minCollapsedNum: 0,
};
export default TreeSelect;
