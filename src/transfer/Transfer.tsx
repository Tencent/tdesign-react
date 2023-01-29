import React, { useState, useMemo, useEffect } from 'react';
import difference from 'lodash/difference';
import classnames from 'classnames';

import { ChevronRightIcon as TdChevronRightIcon, ChevronLeftIcon as TdChevronLeftIcon } from 'tdesign-icons-react';
import { TdTransferProps, DataOption, TransferValue, TransferListType } from './type';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import Button from '../button';
import TransferList from './TransferList';
import { filterCheckedTreeNodes, getTargetNodes, getDefaultValue, getJSX, getLeafNodes } from './utils';
import { TNode, StyledProps } from '../common';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { transferDefaultProps } from './defaultProps';

export interface TransferProps extends TdTransferProps, StyledProps {
  content?: Array<TNode>;
}

interface StateInterface {
  source: DataOption[];
  target: DataOption[];
}

interface CheckedInterface {
  source: Array<TransferValue>;
  target: Array<TransferValue>;
}

const Transfer: React.FunctionComponent<TransferProps> = (props) => {
  const {
    data,
    search,
    checked,
    defaultChecked,
    onCheckedChange,
    value,
    defaultValue,
    onChange,
    empty,
    disabled,
    pagination,
    title,
    operation,
    footer,
    transferItem,
    content,
    tree,
    showCheckAll,
  } = props;
  const [state, setState] = useState<StateInterface>(() => ({
    source: data.filter((item) => !defaultValue.includes(item.value)),
    target: data.filter((item) => defaultValue.includes(item.value)),
  }));
  const [checkeds, setCheckeds] = useState<CheckedInterface>(() => ({
    source: state.source
      .filter((item) => !item.disabled && defaultChecked.includes(item.value))
      .map((item) => item.value),
    target: state.target
      .filter((item) => !item.disabled && defaultChecked.includes(item.value))
      .map((item) => item.value),
  }));
  const [searchState, setSearchState] = useState<{ source: string; target: string }>({ source: '', target: '' });

  const isTargetControlled = 'value' in props;
  const isCheckedControlled = 'checked' in props;

  const { classPrefix } = useConfig();
  const { ChevronRightIcon, ChevronLeftIcon } = useGlobalIcon({
    ChevronLeftIcon: TdChevronLeftIcon,
    ChevronRightIcon: TdChevronRightIcon,
  });
  const transferClassName = `${classPrefix}-transfer`;

  const [local, t] = useLocaleReceiver('transfer');

  const [sourceData, targetData] = useMemo(() => {
    const { source, target } = state;
    const { source: searchSource, target: searchTarget } = searchState;
    return [
      source.filter((item) => !searchSource || item.label.indexOf(searchState.source) > -1),
      target.filter((item) => !searchTarget || item.label.indexOf(searchState.target) > -1),
    ];
  }, [searchState, state]);

  const [SourceEmptyCmp, TargetEmptyCmp] = getDefaultValue(empty, t(local.empty)).map((item) => getJSX(item));
  const [sourceDisable, targetDisable] = getDefaultValue(disabled, false);
  const [sourcePagonation, targetPagonation] = getDefaultValue(pagination);
  const [sourceTitle, targetTitle] = getDefaultValue(title as any as any).map((item) => getJSX(item));
  const [leftOperation, rightOperation] = getDefaultValue(operation as any, [
    () => <ChevronRightIcon />,
    () => <ChevronLeftIcon />,
  ]).map((item) => getJSX(item));
  const [sourceFooter, targetFooter] = getDefaultValue(footer as any).map((item) => getJSX(item));
  const [sourceTransferItem, targetTransferItem] = getDefaultValue(transferItem);
  const [sourceContent, targetContent] = getDefaultValue(content);

  const [showCheckAllSource, showCheckAllTarget] = useMemo(
    () =>
      Array.isArray(showCheckAll) ? [showCheckAll[0] ?? true, showCheckAll[1] ?? true] : [showCheckAll, showCheckAll],
    [showCheckAll],
  );

  const transformSource = () => {
    const { source, target } = state;
    const sourceCheckeds = source.filter((item) => checkeds.source.includes(item.value));
    let newSource = difference(source, sourceCheckeds);
    let newTarget = [...target, ...sourceCheckeds];
    let newTargetValue = newTarget.map((t) => t.value);

    // 树结构处理 source/target 节点数据
    if (tree) {
      newSource = filterCheckedTreeNodes(source, checkeds.source);
      newTarget = getTargetNodes(newSource, data);
      newTargetValue = getLeafNodes(newTarget).map((t) => t.value);
    }
    if (isTargetControlled) {
      onChange?.(newTargetValue, {
        type: 'source',
        movedValue: sourceCheckeds.map((s) => s.value),
      });
    } else {
      setState({ ...state, source: newSource, target: [...newTarget] });
      setCheckeds({ ...checkeds, source: [] });
    }
  };
  const transformTarget = () => {
    const { source, target } = state;
    const targetCheckeds = target.filter((item) => checkeds.target.includes(item.value));
    let newSource = [...source, ...targetCheckeds];
    let newTarget = difference(target, targetCheckeds);
    let newTargetValue = newTarget.map((t) => t.value);

    // 树结构处理 source/target 节点数据
    if (tree) {
      newTarget = filterCheckedTreeNodes(target, checkeds.target);
      newSource = getTargetNodes(newTarget, data);
      newTargetValue = getLeafNodes(newTarget).map((t) => t.value);
    }
    if (isTargetControlled) {
      onChange?.(newTargetValue, {
        type: 'target',
        movedValue: targetCheckeds.map((s) => s.value),
      });
    } else {
      setState({ ...state, source: newSource, target: newTarget });
      setCheckeds({ ...checkeds, target: [] });
    }
  };

  const OperationsCmp = () => {
    const isSourceDisabled = sourceDisable || !checkeds.source.length;
    const isTargetDisabled = targetDisable || !checkeds.target.length;

    return (
      <div className={`${transferClassName}__operations`}>
        <Button
          key={isSourceDisabled ? 'right-outline' : 'right-base'}
          variant="outline"
          disabled={isSourceDisabled}
          onClick={transformSource}
        >
          {leftOperation}
        </Button>
        <Button
          key={isSourceDisabled ? 'left-outline' : 'left-base'}
          variant="outline"
          disabled={isTargetDisabled}
          onClick={transformTarget}
        >
          {rightOperation}
        </Button>
      </div>
    );
  };

  const handleCheckChange = (value: Array<TransferValue>, type: TransferListType) => {
    const { source: sourceChecked, target: targetChecked } = checkeds;
    const inverseMap = { source: 'target', target: 'source' };
    isCheckedControlled
      ? onCheckedChange?.({
          type,
          checked: value.concat(checkeds[inverseMap[type]]),
          sourceChecked,
          targetChecked,
        })
      : setCheckeds({ ...checkeds, [type]: value });
  };

  // value 受控
  useEffect(() => {
    if (isTargetControlled && Array.isArray(value)) {
      let newTarget = data.filter((item) => value.includes(item.value));
      let newSource = difference(data, newTarget);
      // 树结构处理 source/target 节点数据
      if (tree) {
        newSource = filterCheckedTreeNodes(data, value);
        newTarget = getTargetNodes(newSource, data);
      }
      setState({ source: [...newSource], target: [...newTarget] });
      setCheckeds({ source: [], target: [] });
    }
  }, [value, data, isTargetControlled, tree]);

  // checked 受控
  useEffect(() => {
    const { source, target } = state;
    if (isCheckedControlled && Array.isArray(checked)) {
      const newSourceChecked = source
        .filter((item) => !item.disabled && checked.includes(item.value))
        .map((item) => item.value);
      const newTargetChecked = target
        .filter((item) => !item.disabled && checked.includes(item.value))
        .map((item) => item.value);
      setCheckeds({ source: newSourceChecked, target: newTargetChecked });
    }
  }, [checked, state, isCheckedControlled]);

  return (
    <div
      className={classnames(transferClassName, {
        [`${transferClassName}__search`]: search,
        [`${transferClassName}__pagination`]: pagination,
        [`${transferClassName}__footer`]: footer,
        [`${transferClassName}--with-tree`]: tree,
      })}
    >
      <TransferList
        className={`${transferClassName}__list-source`}
        data={sourceData}
        search={search}
        checked={checkeds.source}
        empty={SourceEmptyCmp}
        disabled={sourceDisable}
        pagination={sourcePagonation}
        title={sourceTitle}
        footer={sourceFooter}
        transferItem={sourceTransferItem}
        content={sourceContent}
        onCheckbox={(value) => handleCheckChange(value, 'source')}
        onSearch={(val: string) => setSearchState({ ...searchState, source: val })}
        tree={tree}
        showCheckAll={showCheckAllSource}
      ></TransferList>
      {OperationsCmp()}
      <TransferList
        className={`${transferClassName}__list-target`}
        data={targetData}
        search={search}
        checked={checkeds.target}
        empty={TargetEmptyCmp}
        disabled={targetDisable}
        pagination={targetPagonation}
        title={targetTitle}
        footer={targetFooter}
        transferItem={targetTransferItem}
        content={targetContent}
        onCheckbox={(value) => handleCheckChange(value, 'target')}
        onSearch={(val: string) => setSearchState({ ...searchState, target: val })}
        tree={tree}
        showCheckAll={showCheckAllTarget}
      ></TransferList>
    </div>
  );
};

Transfer.displayName = 'Transfer';
Transfer.defaultProps = transferDefaultProps;

export default Transfer;
