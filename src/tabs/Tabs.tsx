import React, { useState } from 'react';
import classNames from 'classnames';
import { TabValue, TdTabsProps } from '../_type/components/tabs';
import TabNav from './TabNav';
import { useTabClass } from './useTabClass';
import TabPanel from './TabPanel';

export interface TabsProps extends TdTabsProps {}

const Tabs: React.FC<TabsProps> = (props) => {
  const { children, defaultValue, placement } = props;

  // 样式工具引入
  const { tdTabPanelClassPrefix, tdTabsClassPrefix, tdTabsClassGenerator, tdClassGenerator } = useTabClass();

  const [value, setValue] = useState<TabValue>(defaultValue);

  const itemList = React.Children.map(children, (child: any) => {
    if (child && child.type === TabPanel) {
      return child.props;
    }
    return null;
  });

  return (
    <div className={classNames(tdTabsClassPrefix)}>
      {placement !== 'bottom' ? (
        <TabNav
          {...props}
          activeValue={value}
          itemList={itemList}
          tabClick={(v) => {
            setValue(v);
          }}
        />
      ) : null}
      {/* :todo 后续做 children 的结构校验，保证一定是 tabPanel 类型 */}
      <div className={classNames(tdTabsClassGenerator('content'), tdClassGenerator(`is-${placement}`))}>
        <div className={classNames(tdTabPanelClassPrefix)}>
          {React.Children.map(children, (child: any) => {
            if (child && child.type === TabPanel && child.props.value === value) {
              return child;
            }
            return null;
          })}
        </div>
      </div>
      {placement === 'bottom' ? (
        <TabNav
          {...props}
          activeValue={value}
          itemList={itemList}
          tabClick={(v) => {
            setValue(v);
          }}
        />
      ) : null}
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
