import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import '../../common/style/web/components/tabs/_index.less';
import TabPanel from './TabPanel';
import TabNav from './TabNav';
import { TabsProps, TabPanelProps } from './TabProps';
import { Combine } from 'src/_type';
import noop from '../_util/noop';

const Tabs: React.FC<TabsProps> = forwardRef(
  (props, ref: React.Ref<HTMLDivElement>) => {
    const { classPrefix } = useConfig();
    const {
      children,
      disabled,
      closable,
      activeName,
      defaultActiveName,
      tabPosition,
      addable,
      onChange = noop,
      onAdd = noop,
      onClose = noop,
    } = props;
    const tabsClassPrefix = `${classPrefix}-tabs`;

    const [tabPanels, setTabPanels] = useState<
      Combine<TabPanelProps, { key: string }>[]
    >([]);
    const [activeId, setActiveId] = useState<string | number>('');
    const [parsedChildren, setParsedChildren] = useState<React.ReactNode>(null);

    const parseTabs = useCallback(
      (children: React.ReactNode) => {
        const panelList = [];
        React.Children.forEach(children, (child) => {
          if (!React.isValidElement(child)) {
            console.error('Tabs的children应为合法React节点');
            return null;
          }
          const { type, props, key } = child;
          if (type !== TabPanel) {
            console.error('Tabs的children类型应为TabPanel');
          }
          const panel = {
            ...props,
            key,
          };

          // 如果设定 tab 的 disabled，那么所有的 panel 都应该 disabled
          if (disabled) {
            Object.assign(panel, {
              disabled: true,
            });
          }
          panelList.push(panel);
        });
        setTabPanels(panelList);
      },
      [disabled]
    );

    useEffect(() => {
      parseTabs(children);
    }, [children, parseTabs]);

    // 设定 activeId
    useEffect(() => {
      const targetName = activeName || defaultActiveName;
      if (
        targetName &&
        tabPanels.filter((panel) => panel.name === targetName).length > 0
      ) {
        const idx = tabPanels.indexOf(
          tabPanels.filter((panel) => panel.name === targetName)[0]
        );
        setActiveId(idx);
        return;
      }
      // 如果没有设定，那么默认 0
      setActiveId(0);
    }, [activeName, tabPanels, defaultActiveName]);

    // 为 active 的 panel 设定 props
    useEffect(() => {
      setParsedChildren(
        React.Children.map(children, (child, idx) => {
          if (React.isValidElement(child)) {
            let active = false;
            if (idx === activeId) {
              active = true;
            }

            return React.cloneElement(child, {
              ...child.props,
              key: child.key,
              active,
            });
          }
        })
      );
    }, [activeId, tabPanels, children]);

    const tabNav = (
      <TabNav
        tabPosition={tabPosition}
        panels={tabPanels}
        activeId={activeId}
        addable={addable}
        onAdd={onAdd}
        onClose={onClose}
        closable={closable}
        onClick={(event, index) => {
          if (!activeName) {
            setActiveId(index);
          }
          onChange(event, tabPanels[index].name);
        }}
        {...props}
      />
    );

    return (
      <div className={classNames(tabsClassPrefix)} ref={ref}>
        {tabPosition !== 'bottom' && tabNav}
        <div className={`${tabsClassPrefix}__content`}>{parsedChildren}</div>
        {tabPosition === 'bottom' && tabNav}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

export default Tabs;
