import { noop } from 'lodash-es';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { MenuMode, MenuState, SetMenuState } from '../MenuContext';
import { MenuTree } from '../_util/getMenuTree';
import type { MenuValue, TdHeadMenuProps, TdMenuProps } from '../type';

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

  const menuTree = useMemo(() => new MenuTree(children, expandMutex), [children, expandMutex]);

  useEffect(() => {
    const currExpanded = expanded || state.expanded || [];
    menuTree.setExpanded(currExpanded);
  }, [expanded, state.expanded, menuTree]);

  const handleExpandChange = (value: MenuValue) => {
    menuTree.expandNode(value);
    const nextExpanded = menuTree.getExpanded();
    onExpand(nextExpanded);
    setState((prevState) => ({
      ...prevState,
      expanded: nextExpanded,
    }));
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
