import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TabValue, TdTabsProps } from './type';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import TabNav from './TabNav';
import { useTabClass } from './useTabClass';
import TabPanel from './TabPanel';
import { StyledProps } from '../common';
import { tabsDefaultProps } from './defaultProps';

export interface TabsProps extends TdTabsProps, StyledProps {
  children?: React.ReactNode;
}

const Tabs = forwardRefWithStatics(
  (props: TabsProps, ref) => {
    const { children, list, placement, onRemove, value: tabValue, onChange, className, style } = props;
    let { defaultValue } = props;

    // 样式工具引入
    const { tdTabsClassPrefix, tdTabsClassGenerator, tdClassGenerator } = useTabClass();

    const memoChildren = useMemo(() => {
      if (!list || list.length === 0) {
        return children;
      }
      return list.map((panelProps) => <TabPanel key={panelProps.value} {...panelProps} />);
    }, [children, list]);

    const itemList = React.Children.map(memoChildren, (child: any) => {
      if (child && child.type === TabPanel) {
        return child.props;
      }
      return null;
    });

    // 当未设置默认值时，默认选中第一个。
    if (defaultValue === undefined && Array.isArray(itemList) && itemList.length !== 0) {
      defaultValue = itemList[0].value;
    }

    const [value, setValue] = useState<TabValue>(defaultValue);

    useEffect(() => {
      tabValue !== undefined && setValue(tabValue);
    }, [tabValue]);

    const handleChange = (v) => {
      if (tabValue === undefined) {
        setValue(v);
      }
      onChange?.(v);
    };

    const handleClickTab = (v) => {
      if (tabValue === undefined) {
        setValue(v);
      }
    };

    const renderHeader = () => (
      <div className={classNames(tdTabsClassGenerator('header'), tdClassGenerator(`is-${placement}`))}>
        <TabNav
          {...props}
          activeValue={value}
          onRemove={onRemove}
          itemList={itemList}
          tabClick={handleClickTab}
          onChange={handleChange}
        />
      </div>
    );

    return (
      <div ref={ref} className={classNames(tdTabsClassPrefix, className)} style={style}>
        {placement !== 'bottom' ? renderHeader() : null}
        <div className={classNames(tdTabsClassGenerator('content'), tdClassGenerator(`is-${placement}`))}>
          {React.Children.map(memoChildren, (child: any) => {
            if (child && child.type === TabPanel) {
              if (child.props.value === value) {
                return child;
              }
              if (child.props.destroyOnHide === false) {
                return <TabPanel style={{ display: 'none' }}>{child.props.children}</TabPanel>;
              }
            }
            return null;
          })}
        </div>
        {placement === 'bottom' ? renderHeader() : null}
      </div>
    );
  },
  { TabPanel },
);

Tabs.displayName = 'Tabs';
Tabs.defaultProps = tabsDefaultProps;

export default Tabs;
