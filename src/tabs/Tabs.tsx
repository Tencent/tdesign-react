import React, { useState } from 'react';
import classNames from 'classnames';
import { TabValue, TdTabsProps } from '../_type/components/tabs';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import TabNav from './TabNav';
import { useTabClass } from './useTabClass';
import TabPanel from './TabPanel';

export interface TabsProps extends TdTabsProps {
  children?: React.ReactNode;
}

const Tabs = forwardRefWithStatics((props: TabsProps, ref) => {
  const { children, placement, onRemove } = props;
  let { defaultValue } = props;

  // 样式工具引入
  const { tdTabsClassPrefix, tdTabsClassGenerator, tdClassGenerator } = useTabClass();

  const itemList = React.Children.map(children, (child: any) => {
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

  const renderTabNav = () => (
    <TabNav {...props} activeValue={value} onRemove={onRemove} itemList={itemList} tabClick={setValue} />
  );

  return (
    <div ref={ref} className={classNames(tdTabsClassPrefix)}>
      {placement !== 'bottom' ? renderTabNav() : null}
      <div className={classNames(tdTabsClassGenerator('content'), tdClassGenerator(`is-${placement}`))}>
        {React.Children.map(children, (child: any) => {
          if (child && child.type === TabPanel) {
            if (child.props.value === value) {
              return child;
            }
            // 实现 renderOnHide
            if (child.props.renderOnHide) {
              return <TabPanel style={{ display: 'none' }}>{child.props.children}</TabPanel>;
            }
          }
          return null;
        })}
      </div>
      {placement === 'bottom' ? renderTabNav() : null}
    </div>
  );
}, { TabPanel });

Tabs.displayName = 'Tabs';

export default Tabs;
