import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import useDefault from '../_util/useDefault';
import useDefaultProps from '../hooks/useDefaultProps';
import { TdTreeSelectProps, TreeLevel, TreeSelectValue } from './type';
import { treeSelectDefaultProps } from './defaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { convertUnit } from '../_util/convertUnit';
import { TreeOptionData } from '../common';
import { SideBar, SideBarItem } from '../side-bar';
import parseTNode from '../_util/parseTNode';
import { Checkbox } from '../checkbox';
import { Radio, RadioGroup } from '../radio';
import { NativeProps } from '../_util/withNativeProps';

export interface TreeSelectProps extends TdTreeSelectProps, NativeProps {}

const TreeSelect: FC<TreeSelectProps> = (props) => {
  const treeSelectClass = usePrefixClass('tree-select');
  const { value, onChange, height, options, keys, multiple, defaultValue } = useDefaultProps(
    props,
    treeSelectDefaultProps,
  );
  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);
  const [leafLevel, setLeafLevel] = useState(0);
  const [treeOptions, setTreeOptions] = useState<TreeOptionData[][]>([]);

  const buildTreeOptions = () => {
    let level = -1;
    const tmpTreeOptions: TreeOptionData[][] = [];
    let node: TreeOptionData = { children: options };
    if (options.length === 0 || (Array.isArray(value) && value.length === 0)) return;
    while (node && node.children) {
      level += 1;
      const list = (node.children as TreeOptionData[]).map((item: TreeOptionData) => ({
        label: item[keys?.label || 'label'],
        value: item[keys?.value || 'value'],
        disabled: item[keys?.disabled || 'disabled'],
        children: item.children,
      }));
      const thisValue = innerValue?.[level];
      tmpTreeOptions.push([...list]);
      if (thisValue == null) {
        const [firstChild] = list;
        node = firstChild;
      } else {
        const child = list.find((child) => child.value === thisValue);
        node = child ?? list[0];
      }
    }
    setLeafLevel(Math.max(0, level));
    setTreeOptions(tmpTreeOptions);
    if (multiple) {
      const finalValue = innerValue;
      if (finalValue[level] != null && !Array.isArray(finalValue[level])) {
        throw TypeError('应传入数组类型的 value');
      }
    }
  };

  const getTreeClass = (level: number, total: number) => {
    if (level === 0) return 'right';
    if (level === 1 && level !== total - 1) return 'middle';
    return 'left';
  };

  const onRootChange = (level: TreeLevel, itemValue: any) => {
    const newVal = Array.isArray(innerValue) ? [...innerValue] : innerValue;
    newVal[level] = itemValue;
    setInnerValue(newVal, level);
  };

  const handleTreeClick = (itemValue: TreeSelectValue, level: TreeLevel, isDisabled: boolean) => {
    if (isDisabled) return;

    const newVal = Array.isArray(innerValue) ? [...innerValue] : innerValue;
    newVal[level] = itemValue;
    setInnerValue(newVal, level);
  };

  useEffect(() => {
    buildTreeOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue, options, keys, multiple, value]);

  const renderSideBar = (treeOption: TreeOptionData[]) => (
    <SideBar
      defaultValue={innerValue[0]}
      className={`${treeSelectClass}-colum`}
      onClick={(val) => {
        onRootChange(0, val);
      }}
    >
      {treeOption.map((item, index) => (
        <SideBarItem
          key={index}
          label={item.label.toString()}
          value={item.value as string | number}
          disabled={item.disabled}
        ></SideBarItem>
      ))}
    </SideBar>
  );

  const renderMiddleLevel = (treeOption: TreeOptionData[], level: number) =>
    treeOption.map((item) => (
      <div
        key={item.value}
        className={classNames({
          [`${treeSelectClass}__item`]: true,
          [`${treeSelectClass}__item--active`]: item.value === innerValue[level],
          [`${treeSelectClass}__item--disabled`]: item.disabled,
        })}
        onClick={() => handleTreeClick(item.value as TreeSelectValue, level as TreeLevel, item.disabled)}
      >
        {parseTNode(item.label)}
      </div>
    ));

  const renderLeafLevel = (treeOption: TreeOptionData[], level: number) => {
    if (multiple) {
      return (
        <Checkbox.Group
          value={innerValue[level]}
          className={`${treeSelectClass}__checkbox`}
          onChange={(val) => onRootChange(level as TreeLevel, val)}
        >
          {treeOption.map((item) => (
            <Checkbox
              key={item.value}
              value={item.value as string | number}
              maxLabelRow={1}
              icon="line"
              borderless
              placement="right"
              disabled={item.disabled}
              label={item.label}
            />
          ))}
        </Checkbox.Group>
      );
    }
    return (
      <>
        <RadioGroup value={innerValue[level]} onChange={(val) => onRootChange(level as TreeLevel, val)}>
          {treeOption.map((item) => (
            <Radio
              key={item.value}
              value={item.value as string | number}
              icon="line"
              maxLabelRow={1}
              borderless
              placement="right"
              disabled={item.disabled}
            >
              {item.label}
            </Radio>
          ))}
        </RadioGroup>
      </>
    );
  };

  return (
    <div
      className={treeSelectClass}
      style={{
        height: convertUnit(height),
      }}
    >
      {treeOptions.map((item, level) => {
        let levelContent;
        if (level === 0) {
          levelContent = renderSideBar(item);
        } else if (level === leafLevel) {
          levelContent = renderLeafLevel(item, level);
        } else {
          levelContent = renderMiddleLevel(item, level);
        }

        return (
          <div
            key={level}
            className={classNames(
              `${treeSelectClass}__column`,
              `${treeSelectClass}__column--${getTreeClass(leafLevel - level, treeOptions.length)}`,
            )}
          >
            {levelContent}
          </div>
        );
      })}
    </div>
  );
};

TreeSelect.displayName = 'TreeSelect';

export default TreeSelect;
