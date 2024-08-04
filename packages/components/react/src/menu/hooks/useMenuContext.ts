import noop from 'lodash/noop';
import { useState, ReactNode } from 'react';
import { MenuState, SetMenuState, MenuMode } from '../MenuContext';
import checkSubMenuChildExpanded from '../_util/checkSubMenuChildExpanded';
import { TdMenuProps, TdHeadMenuProps, MenuValue } from '../type';

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
    } else if (expandMutex) {
      // 未展开
      nextExpand = checkSubMenuChildExpanded(children, expanded, value);
    } else {
      nextExpand = [...expanded, value];
    }
    onExpand(nextExpand);
    setState({ expanded: nextExpand });
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
    },
  };
}

export default useMenuContext;
