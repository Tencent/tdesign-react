import React, { useState } from 'react';
import classNames from 'classnames';
import { TabValue, TdTabsProps } from '../_type/components/tabs';
import TabNav from './TabNav';
import { useTabClass } from './useTabClass';
import TabPanel from './TabPanel';

export interface TabsProps extends TdTabsProps {}

const Tabs: React.FC<TabsProps> = (props) => {
  const { children, defaultValue, placement, onRemove } = props;

  // 样式工具引入
  const { tdTabPanelClassPrefix, tdTabsClassPrefix, tdTabsClassGenerator, tdClassGenerator } = useTabClass();

  const [value, setValue] = useState<TabValue>(defaultValue);

  const itemList = React.Children.map(children, (child: any) => {
    if (child && child.type === TabPanel) {
      return child.props;
    }
    return null;
  });

  const renderTabNav = () => (
    <TabNav {...props} activeValue={value} onRemove={onRemove} itemList={itemList} tabClick={setValue} />
  );

  return (
    <div className={classNames(tdTabsClassPrefix)}>
      {placement !== 'bottom' ? renderTabNav() : null}
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
      {placement === 'bottom' ? renderTabNav() : null}
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
