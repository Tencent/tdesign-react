import { noop } from 'lodash';
import { useState, ReactNode } from 'react';
import { MenuState, SetMenuState, MenuMode } from '../MenuContext';
import checkSubMenuChildExpanded from '../_util/checkSubMenuChildExpanded';
import { TdMenuProps, TdHeadMenuProps, MenuValue } from './../../_type/components/menu/index';
interface UseMenuContextProps extends Extract<TdMenuProps, TdHeadMenuProps> {
  children: ReactNode;
  mode: MenuMode;
}

function useMenuContext({
  defaultValue,
  defaultExpanded,
  expandMutex,
  children,
  onExpand = noop,
  onChange = noop,
  onCollapsed = noop,
  value,
  expanded,
  collapsed,
  expandType,
  theme,
  mode,
}: UseMenuContextProps) {
  const [state, setState] = useState<MenuState>({
    active: defaultValue,
    expanded: defaultExpanded,
    collapsed: collapsed || false,
  });

  const setStateValue: SetMenuState = (menuState) => setState({ ...state, ...menuState });

  const handleExpandChange = (value: MenuValue, expanded: MenuValue[]) => {
    let nextExpand = [];
    const index = expanded.indexOf(value);

    // 已经展开
    if (index > -1) {
      // 互斥情况
      if (expandMutex) {
        nextExpand = expanded.slice(0, index);
      } else {
        nextExpand = expanded.filter((item) => item !== value);
      }
    } else {
      // 未展开
      if (expandMutex) {
        nextExpand = checkSubMenuChildExpanded(children, expanded, value);
      } else {
        nextExpand = [...expanded, value];
      }
    }
    onExpand(nextExpand);
    setState({ expanded: nextExpand });
  };

  const handleCollapsed: typeof onCollapsed = ({ collapsed, e }) => {
    onCollapsed({ collapsed, e });
    setStateValue({ collapsed });
  };

  return {
    value: {
      onExpand: handleExpandChange,
      onChange,
      active: value || state.active,
      expanded: expanded || state.expanded,
      collapsed: collapsed || state.collapsed,
      setState: setStateValue,
      expandMutex,
      expandType: collapsed ? 'popup' : expandType,
      mode,
      theme,
      onCollapsed: handleCollapsed,
    },
  };
}

export default useMenuContext;
