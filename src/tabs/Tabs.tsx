import React, { forwardRef, useEffect, useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
import { Combine } from '../_type';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import TabPanel from './TabPanel';
import TabNav from './TabNav';
import { TabsProps, TabPanelProps } from './TabProps';

const Tabs: React.FC<TabsProps> = forwardRef((props, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const {
    children,
    disabled,
    closable,
    activeName,
    className,
    defaultActiveName,
    tabPosition,
    addable,
    onChange = noop,
    onAdd = noop,
    onClose = noop,
    style = {},
  } = props;
  const tabsClassPrefix = `${classPrefix}-tabs`;

  const [tabPanels, setTabPanels] = useState<Combine<TabPanelProps, { key: string }>[]>([]);
  const [activeId, setActiveId] = useState<string | number>('');
  const [parsedChildren, setParsedChildren] = useState<React.ReactNode>(null);

  // 判断是否 init ，如果 init ，active Tab不应再改变
  const isInit = useRef<boolean>(false);

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
    [disabled],
  );

  useEffect(() => {
    parseTabs(children);
  }, [children, parseTabs]);

  // 设定 activeId
  useEffect(() => {
    const targetName = activeName || defaultActiveName;
    if (isInit.current && !activeName) return;
    if (!isInit.current) isInit.current = true;
    if (targetName && tabPanels.filter((panel) => panel.name === targetName).length > 0) {
      const idx = tabPanels.indexOf(tabPanels.filter((panel) => panel.name === targetName)[0]);
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
      }),
    );
  }, [activeId, tabPanels, children]);

  const handleChange = (event, index) => {
    if (!activeName) {
      setActiveId(index);
    }
    onChange(event, String(tabPanels[index].name));
  };

  const handleClose = (event, an) => {
    if (!activeName) {
      if (tabPanels.length === 1) {
        setActiveId('');
      } else if (activeId >= tabPanels.length - 1) {
        // close 时的处理
        const nextActiveId = tabPanels.length - 2 >= 0 ? tabPanels.length - 2 : '';
        setActiveId(nextActiveId);
      } else {
        setActiveId(activeId);
      }
    }
    onClose(event, an);
  };

  const tabNav = (
    <TabNav
      {...props}
      tabPosition={tabPosition}
      panels={tabPanels}
      activeId={activeId}
      addable={addable}
      onAdd={onAdd}
      onClose={handleClose}
      closable={closable}
      onClick={handleChange}
    />
  );

  return (
    <div className={classNames(className, tabsClassPrefix)} style={style} ref={ref}>
      {tabPosition !== 'bottom' && tabNav}
      <div className={`${tabsClassPrefix}__content`}>{parsedChildren}</div>
      {tabPosition === 'bottom' && tabNav}
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
