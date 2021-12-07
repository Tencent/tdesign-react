import React, { useState, useMemo, useEffect } from 'react';
import difference from 'lodash/difference';
import classnames from 'classnames';

import { ChevronRightIcon, ChevronLeftIcon } from 'tdesign-icons-react';
import { TdTransferProps, DataOption, TransferValue, TransferListType } from './type';
import useConfig from '../_util/useConfig';
import Button from '../button';
import TransferList from './TransferList';
import { getDefaultValue, getJSX } from './utils';
import { TNode, StyledProps } from '../common';

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
    data = [],
    search = false,
    checked,
    defaultChecked = [],
    onCheckedChange,
    value,
    defaultValue = [],
    onChange,
    empty,
    disabled = false,
    pagination,
    title,
    operation,
    footer,
    transferItem,
    content,
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

  const isTargetControled = 'value' in props;
  const isCheckedControled = 'checked' in props;

  const { classPrefix } = useConfig();
  const transferClassName = `${classPrefix}-transfer`;

  const [sourceData, targetData] = useMemo(() => {
    const { source, target } = state;
    const { source: searchSource, target: searchTarget } = searchState;
    return [
      source.filter((item) => !searchSource || item.label.indexOf(searchState.source) > -1),
      target.filter((item) => !searchTarget || item.label.indexOf(searchState.target) > -1),
    ];
  }, [searchState, state]);

  const [SourceEmptyCmp, TargetEmptyCmp] = getDefaultValue(empty, '暂无数据').map((item) => getJSX(item));
  const [sourceDisable, targetDisable] = getDefaultValue(disabled, false);
  const [sourcePagonation, targetPagonation] = getDefaultValue(pagination);
  const [sourceTitle, targetTitle] = getDefaultValue(title).map((item) => getJSX(item));
  const [leftOperation, rightOperation] = getDefaultValue(operation, [
    () => <ChevronRightIcon />,
    () => <ChevronLeftIcon />,
  ]).map((item) => getJSX(item));
  const [sourceFooter, targetFooter] = getDefaultValue(footer).map((item) => getJSX(item));
  const [sourceTransferItem, targetTransferItem] = getDefaultValue(transferItem);
  const [sourceContent, targetContent] = getDefaultValue(content);

  const transfromSource = () => {
    const { source, target } = state;
    const sourceCheckeds = source.filter((item) => checkeds.source.includes(item.value));
    const newSoure = difference(source, sourceCheckeds);
    const newTarget = [...target, ...sourceCheckeds];

    if (isTargetControled) {
      onChange?.(
        newTarget.map((t) => t.value),
        {
          type: 'source',
          movedValue: sourceCheckeds.map((s) => s.value),
        },
      );
    } else {
      setState({ ...state, source: newSoure, target: [...newTarget] });
      setCheckeds({ ...checkeds, source: [] });
    }
  };
  const transfromTarget = () => {
    const { source, target } = state;
    const targetCheckeds = target.filter((item) => checkeds.target.includes(item.value));
    const newTarget = difference(target, targetCheckeds);

    if (isTargetControled) {
      onChange?.(
        newTarget.map((t) => t.value),
        {
          type: 'target',
          movedValue: targetCheckeds.map((s) => s.value),
        },
      );
    } else {
      setState({ ...state, source: [...source, ...targetCheckeds], target: newTarget });
      setCheckeds({ ...checkeds, target: [] });
    }
  };

  const OperationsCmp = () => {
    const isSourceDisabled = sourceDisable || !checkeds.source.length;
    const isTargetDisabled = targetDisable || !checkeds.target.length;

    return (
      <div className={`${transferClassName}-operations`}>
        <Button
          key={isSourceDisabled ? 'right-outline' : 'right-base'}
          variant={isSourceDisabled ? 'outline' : 'base'}
          disabled={isSourceDisabled}
          onClick={transfromSource}
        >
          {leftOperation}
        </Button>
        <Button
          key={isSourceDisabled ? 'left-outline' : 'left-base'}
          variant={isTargetDisabled ? 'outline' : 'base'}
          disabled={isTargetDisabled}
          onClick={transfromTarget}
        >
          {rightOperation}
        </Button>
      </div>
    );
  };

  const handleCheckChange = (value: Array<TransferValue>, type: TransferListType) => {
    const { source: sourceChecked, target: targetChecked } = checkeds;
    const inverseMap = { source: 'target', target: 'source' };

    isCheckedControled
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
    if (isTargetControled && Array.isArray(value)) {
      const newTarget = data.filter((item) => value.includes(item.value));
      const newSource = difference(data, newTarget);
      setState({ source: [...newSource], target: [...newTarget] });
      setCheckeds({ source: [], target: [] });
    }
  }, [value, data, isTargetControled]);

  // checked 受控
  useEffect(() => {
    const { source, target } = state;
    if (isCheckedControled && Array.isArray(checked)) {
      const newSourceChecked = source
        .filter((item) => !item.disabled && checked.includes(item.value))
        .map((item) => item.value);
      const newTargetChecked = target
        .filter((item) => !item.disabled && checked.includes(item.value))
        .map((item) => item.value);
      setCheckeds({ source: newSourceChecked, target: newTargetChecked });
    }
  }, [checked, state, isCheckedControled]);

  return (
    <div
      className={classnames(transferClassName, {
        [`${transferClassName}-search`]: search,
        [`${transferClassName}-pagination`]: pagination,
        [`${transferClassName}-footer`]: footer,
      })}
    >
      <TransferList
        className={`${transferClassName}-list-source`}
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
      ></TransferList>
      {OperationsCmp()}
      <TransferList
        className={`${transferClassName}-list-target`}
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
      ></TransferList>
    </div>
  );
};

Transfer.displayName = 'Transfer';

export default Transfer;
