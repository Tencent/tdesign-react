import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react';
import classNames from 'classnames';

import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import { TdTreeSelectProps, TreeSelectValue } from '../_type/components/tree-select';
import { StyledProps, TreeOptionData } from '../_type';
import useCommonClassName from '../_util/useCommonClassName';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';

import Popup, { PopupProps } from '../popup';
import IconCloseCircleFilled from '../icon/icons/CloseCircleFilledIcon';
import IconLoading from '../icon/icons/LoadingIcon';
import Tag from '../tag';
import Tree, { TreeNodeModel, TreeNodeValue } from '../tree';
import TreeStore from '../_common/js/tree/tree-store';
import FakeArrow from '../common/FakeArrow';

import Input, { InputValue } from '../input';

export interface TreeSelectProps extends TdTreeSelectProps, StyledProps {}

export interface NodeOptions {
  label: string;
  value: string | number;
}

const defaultPopupProps: PopupProps = {
  trigger: 'click',
  placement: 'bottom-left',
  overlayClassName: '',
  overlayStyle: (trigger) => ({
    width: `${trigger.offsetWidth}px`,
  }),
};

const TreeSelect = forwardRef((props: TreeSelectProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className: treeSelectClassName,
    style: treeSelectStyle,
    disabled,
    size,
    multiple,
    prefixIcon,
    popupProps,
    valueType,
    clearable,
    loading,
    max,
    placeholder,
    treeProps,
    empty,
    data,
    loadingText,
    filter,
    filterable,
    onSearch,
    onBlur,
    onFocus,
    onClear,
    onRemove,
  } = props;
  const { classPrefix } = useConfig();
  const CLASSNAMES = useCommonClassName();

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

  const selectClass = classNames(`${classPrefix}-select`, {
    [CLASSNAMES.STATUS.disabled]: disabled,
    [CLASSNAMES.STATUS.active]: visible,
    [CLASSNAMES.SIZE[size]]: size,
    [`${classPrefix}-has-prefix`]: prefixIcon,
    [`${classPrefix}-select-selected`]: selectedSingle || !isEmpty(selectedMultiple),
  });

  const popupObject = useMemo(() => Object.assign(defaultPopupProps, popupProps), [popupProps]);
  const popupClass = classNames(popupObject.overlayClassName, `${classPrefix}-select-dropdown`, 'narrow-scrollbar');

  const checked: any = useMemo(() => {
    if (multiple) {
      if (valueType === 'object') {
        return isArray(value) ? value.map((item) => (item as NodeOptions).value) : [];
      }
      return isArray(value) ? value : [];
    }
    return [];
  }, [multiple, valueType, value]);

  const showArrow: boolean = useMemo(
    () =>
      !clearable ||
      !isHover ||
      disabled ||
      (!multiple && !value && value !== 0) ||
      (multiple && isArray(value) && isEmpty(value)),
    [clearable, isHover, disabled, multiple, value],
  );

  const showLoading: boolean = useMemo(() => loading && !disabled, [loading, disabled]);
  const showClose: boolean = useMemo(
    () =>
      clearable &&
      isHover &&
      !disabled &&
      ((!multiple && (!!value || value === 0)) || (multiple && !isEmpty(value as Array<TreeSelectValue>))),
    [clearable, isHover, disabled, multiple, value],
  );

  const showFilter: boolean = useMemo(() => {
    if (disabled) {
      return false;
    }
    if (!multiple && selectedSingle && (filterable || isFunction(filter))) {
      return visible;
    }
    return filterable || isFunction(filter);
  }, [disabled, multiple, selectedSingle, filterable, visible, filter]);

  const showPlaceholder: boolean = useMemo(() => {
    if (
      !showFilter &&
      ((isString(value) && value === '' && !selectedSingle) || (isArray(value) && isEmpty(value)) || value === null)
    ) {
      return true;
    }
    return false;
  }, [showFilter, value, selectedSingle]);

  const multiLimitDisabled: boolean = useMemo(() => {
    if (multiple && max && isArray(value) && max <= value.length) {
      return true;
    }
    return false;
  }, [multiple, max, value]);

  const filterPlaceholder: string = useMemo(() => {
    if (multiple && isArray(value) && !isEmpty(value)) {
      return '';
    }
    if (!multiple && selectedSingle) {
      return selectedSingle;
    }
    return placeholder;
  }, [multiple, value, selectedSingle, placeholder]);

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

  function handleChange(value, node: TreeNodeModel<TreeOptionData>) {
    onChange?.(value, { node });
  }

  function handleClear(e: React.MouseEvent<SVGSVGElement>) {
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
          return { label: node.data[realLabel], value: node.data[realValue] };
        }),
      );
    } else {
      setNodeInfo(null);
    }
  }

  function onInput(value) {
    setFilterText(value);
    onSearch?.(value);
  }

  function handleBlur(value: InputValue, context: { e: React.FocusEvent<HTMLDivElement> }) {
    setFocusing(false);
    onBlur?.({ value, e: context.e });
  }

  function handleFocus(value: InputValue, context: { e: React.FocusEvent<HTMLDivElement> }) {
    setFocusing(true);
    onFocus?.({ value, e: context.e });
  }

  function treeNodeChange(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData> }) {
    let current: TreeSelectValue = value;
    if (valueType === 'object') {
      current = value.map((nodeValue) => {
        const node = treeRef.current.getItem(nodeValue);
        return { label: node.data[realLabel], value: node.data[realValue] };
      });
    }
    handleChange(current, context.node);
  }

  function treeNodeActive(value: Array<TreeNodeValue>, context: { node: TreeNodeModel<TreeOptionData> }) {
    // 多选模式屏蔽 Active 事件
    if (multiple) return;

    const nodeValue = isEmpty(value) ? '' : value[0];
    const node = treeRef.current.getItem(nodeValue);
    let current: TreeSelectValue = nodeValue;

    if (valueType === 'object') {
      current = { label: node.data[realLabel], value: node.data[realValue] };
    }

    handleChange(current, context.node);
    setFilterText('');
    setVisible(false);
  }

  function treeNodeExpand(value: Array<TreeNodeValue>) {
    setExpanded(value);
  }

  function removeTag(index: number, data: TreeOptionData, e: React.MouseEvent<SVGElement, MouseEvent>) {
    if (disabled) {
      return;
    }
    onRemove?.({ value: value[index], data, e });
    isArray(value) && value.splice(index, 1);
    onChange?.(value as Array<TreeSelectValue>, null);
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
      empty={empty || <div className={`${classPrefix}-select-empty`}>暂无数据</div>}
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

  const searchInput = showFilter && (
    <Input
      ref={inputRef}
      value={filterText}
      className={`${classPrefix}-select-input`}
      size={size}
      disabled={disabled}
      placeholder={filterPlaceholder}
      onInput={onInput}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );

  const tagItem = tagList.map((label, index) => (
    <Tag
      key={index}
      size={size}
      closable={!disabled}
      disabled={disabled}
      onClose={({ e }) => removeTag(index, null, e)}
    >
      {label}
    </Tag>
  ));

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
        overlayClassName={popupClass}
        onVisibleChange={popupVisibleChange}
        content={
          <>
            {showLoading && (
              <p className={`${classPrefix}-select-loading-tips`}>
                {loadingText || <div className={`${classPrefix}-select-empty`}>加载中</div>}
              </p>
            )}
            {treeItem}
          </>
        }
      >
        <div
          style={{ minHeight: 30 }}
          className={selectClass}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {prefixIcon && <span className={`${classPrefix}-select-left-icon`}>{prefixIcon}</span>}
          {showPlaceholder && <span className={`${classPrefix}-select-placeholder`}>{placeholder}</span>}
          {tagItem}
          {!multiple && !showPlaceholder && !showFilter && (
            <span className={`${classPrefix}-select-selectedSingle`}>{selectedSingle}</span>
          )}
          {searchInput}
          {showArrow && !showLoading && (
            <FakeArrow overlayClassName={`${classPrefix}-select-right-icon`} isActive={visible} disabled={disabled} />
          )}
          {showClose && !showLoading && (
            <IconCloseCircleFilled className={`${classPrefix}-select-right-icon`} size={size} onClick={handleClear} />
          )}
          {showLoading && (
            <IconLoading className={`${classPrefix}-select-right-icon ${classPrefix}-select-active-icon`} size={size} />
          )}
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
};
export default TreeSelect;
