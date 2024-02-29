import React, { useEffect } from 'react';
import classNames from 'classnames';
import { TabValue, TdTabsProps } from './type';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import TabNav from './TabNav';
import { useTabClass } from './useTabClass';
import TabPanel from './TabPanel';
import { StyledProps } from '../common';
import { tabsDefaultProps } from './defaultProps';
import useDragSorter from '../_util/useDragSorter';
import useDefaultProps from '../hooks/useDefaultProps';

export interface TabsProps extends TdTabsProps, StyledProps {
  children?: React.ReactNode;
}

const Tabs = forwardRefWithStatics(
  (originalProps: TabsProps, ref: React.Ref<HTMLDivElement>) => {
    const props = useDefaultProps<TabsProps>(originalProps, tabsDefaultProps);
    const {
      defaultValue,
      children,
      list,
      placement,
      value: tabValue,
      dragSort,
      className,
      style,
      onRemove,
      onChange,
    } = props;

    // 样式工具引入
    const { tdTabsClassPrefix, tdTabsClassGenerator, tdClassGenerator } = useTabClass();
    const targetClassNameRegExpStr = `^${tdTabsClassPrefix}(__nav-item|__nav-item-wrapper|__nav-item-text-wrapper)`;

    const { getDragProps } = useDragSorter({
      ...props,
      sortOnDraggable: dragSort,
      onDragOverCheck: {
        x: true,
        targetClassNameRegExp: new RegExp(targetClassNameRegExpStr),
      },
    });

    const memoChildren = React.useMemo<React.ReactNode | React.ReactNode[]>(() => {
      if (!list || list.length === 0) {
        return children;
      }
      return list.map<React.ReactNode>((panelProps) => <TabPanel key={panelProps.value} {...panelProps} />);
    }, [children, list]);

    const itemList = React.Children.map(memoChildren, (child: React.ReactElement) => {
      if (child && child.type === TabPanel) {
        return child.props;
      }
      return null;
    });

    // 当未设置默认值时，默认选中第一个。
    const [value, setValue] = React.useState<TabValue>(
      defaultValue === undefined && Array.isArray(itemList) && itemList.length !== 0 ? itemList[0].value : defaultValue,
    );

    useEffect(() => {
      if (tabValue !== undefined) {
        setValue(tabValue);
      }
    }, [tabValue]);

    const handleChange = React.useCallback(
      (v: TabValue) => {
        if (tabValue === undefined) {
          setValue(v);
        }
        onChange?.(v);
      },
      [tabValue, onChange],
    );

    const handleClickTab = React.useCallback(
      (v: TabValue) => {
        if (tabValue === undefined) {
          setValue(v);
        }
      },
      [tabValue],
    );

    const headerNode = React.useMemo<React.ReactNode>(
      () => (
        <div className={classNames(tdTabsClassGenerator('header'), tdClassGenerator(`is-${placement}`))}>
          <TabNav
            {...props}
            getDragProps={getDragProps}
            activeValue={value}
            onRemove={onRemove}
            itemList={itemList}
            tabClick={handleClickTab}
            onChange={handleChange}
          />
        </div>
      ),
      [
        props,
        getDragProps,
        value,
        onRemove,
        itemList,
        handleClickTab,
        handleChange,
        placement,
        tdTabsClassGenerator,
        tdClassGenerator,
      ],
    );

    return (
      <div ref={ref} className={classNames(tdTabsClassPrefix, className)} style={style}>
        {placement !== 'bottom' ? headerNode : null}
        <div className={classNames(tdTabsClassGenerator('content'), tdClassGenerator(`is-${placement}`))}>
          {React.Children.map(memoChildren, (child: any) => {
            if (child && child.type === TabPanel) {
              if (child.props.value === value) {
                return child;
              }
              if (child.props.destroyOnHide === false) {
                return <TabPanel {...child.props} style={{ display: 'none' }}></TabPanel>;
              }
            }
            return null;
          })}
        </div>
        {placement === 'bottom' ? headerNode : null}
      </div>
    );
  },
  { TabPanel },
);

Tabs.displayName = 'Tabs';

export default Tabs;
