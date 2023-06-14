import { render, fireEvent, vi, waitFor } from '@test/utils';
import React from 'react';
import Menu from '../index';

describe('Menu 组件测试', () => {
  const { HeadMenu, SubMenu, MenuItem, MenuGroup } = Menu;
  const renderSubmenu = ({
    collapsed = false,
    defaultExpanded = [],
    expanded,
  }: {
    collapsed?: boolean;
    defaultExpanded?: string[];
    expanded?: string[];
  }) =>
    render(
      <Menu collapsed={collapsed} defaultExpanded={defaultExpanded} expanded={expanded}>
        <MenuItem value="0">仪表盘</MenuItem>
        <SubMenu title={<span>资源列表</span>} value="1">
          <MenuItem value="1-1">
            <span>菜单二</span>
          </MenuItem>
        </SubMenu>
        <SubMenu title={<span>调度平台</span>} value="2">
          <SubMenu title="二级菜单-1" value="2-1">
            <MenuItem value="3-1">三级菜单-1</MenuItem>
          </SubMenu>
          <MenuItem value="2-2">
            <span>二级菜单-2</span>
          </MenuItem>
        </SubMenu>
      </Menu>,
    );

  test('menu collapsed works fine', async () => {
    const { container } = renderSubmenu({ collapsed: true });
    expect(container.firstChild).toHaveClass('t-is-collapsed');
    expect(container.querySelectorAll('.t-submenu.t-is-opened').length).toBe(0);
    const submenu = container.querySelectorAll('.t-submenu').item(1);
    fireEvent.mouseEnter(submenu);
    expect(document.querySelector('.t-menu__popup')).not.toBeNull();
    expect(document.querySelector('.t-menu__popup')?.className.includes('t-is-opened')).toBeTruthy();

    fireEvent.mouseLeave(submenu);
    const popup = await waitFor(() => document.querySelector('.t-menu__popup'));
    expect(popup?.className.includes('t-is-opened')).not.toBeTruthy();
  });

  test('menu defaultExpanded works fine', () => {
    const { container, queryByText } = renderSubmenu({ defaultExpanded: ['1'] });
    expect(container.firstChild).not.toHaveClass('t-is-collapsed');
    expect(container.querySelectorAll('.t-submenu.t-is-opened').length).toBe(1);
    expect(queryByText('菜单二').parentElement.parentElement.parentElement.style.maxHeight).not.toBe('0');
    expect(queryByText('二级菜单-1').parentElement.parentElement.parentElement.style.maxHeight).toBe('0');
  });

  test('menu expanded works fine', () => {
    const { container, queryByText } = renderSubmenu({ expanded: ['1'] });
    expect(container.firstChild).not.toHaveClass('t-is-collapsed');
    expect(container.querySelectorAll('.t-submenu.t-is-opened').length).toBe(1);
    expect(queryByText('菜单二').parentElement.parentElement.parentElement.style.maxHeight).not.toBe('0');
    expect(queryByText('二级菜单-1').parentElement.parentElement.parentElement.style.maxHeight).toBe('0');
  });

  test('menu 测试单层导航', () => {
    const onItemClickFn = vi.fn();
    const { container, queryByText } = render(
      <HeadMenu>
        <MenuItem value="0" onClick={onItemClickFn}>
          <span>菜单1</span>
        </MenuItem>
      </HeadMenu>,
    );
    expect(container.querySelector('.t-menu--light')).toBeInTheDocument();
    expect(queryByText('菜单1')).toBeInTheDocument();
    fireEvent.click(queryByText('菜单1'));
    expect(onItemClickFn).toHaveBeenCalledTimes(1);
  });

  test('menu 测试双层导航', async () => {
    const onChangeFn = vi.fn();
    const onExpandFn = vi.fn();
    const { container, queryByText, getByText } = render(
      <HeadMenu
        theme="dark"
        onChange={onChangeFn}
        onExpand={onExpandFn}
        operations={<div>我是operations</div>}
        value="4"
      >
        <SubMenu value="sub-0" title="菜单1">
          <MenuItem value="1">子菜单1</MenuItem>
          <MenuItem value="2">子菜单2</MenuItem>
        </SubMenu>
        <SubMenu value="sub-1" title="菜单2">
          <MenuItem value="3">子菜单3</MenuItem>
          <MenuItem value="4">子菜单4</MenuItem>
        </SubMenu>
      </HeadMenu>,
    );
    expect(container.querySelector('.t-menu--dark')).toBeInTheDocument();
    expect(queryByText('我是operations')).toBeInTheDocument();
    expect(queryByText('菜单1')).toBeInTheDocument();

    const element1 = await waitFor(() => container.querySelector('t-head-menu__submenu'));
    expect(element1).toBeNull();
    fireEvent.click(getByText('菜单2'));
    fireEvent.click(getByText('子菜单3'));
    expect(onChangeFn).toHaveBeenCalledTimes(2);
  });

  test('menu 测试单层侧边导航', () => {
    const clickFn = vi.fn();
    const { container, queryByText, getByText } = render(
      <Menu onChange={clickFn}>
        <MenuItem value={'0'}>
          <span>仪表盘</span>
        </MenuItem>
        <MenuItem value={'1'}>
          <span>资源列表</span>
        </MenuItem>
      </Menu>,
    );
    expect(container.querySelector('.t-default-menu')).toBeInTheDocument();
    expect(queryByText('仪表盘')).toBeInTheDocument();
    fireEvent.click(getByText('资源列表'));
    expect(clickFn).toHaveBeenCalledTimes(1);
  });

  test('menu 平铺式侧边导航', () => {
    const onExpandFn = vi.fn();
    const onChangeFn = vi.fn();
    const { queryByText, getByText } = render(
      <Menu onExpand={onExpandFn} onChange={onChangeFn}>
        <MenuItem value="0">仪表盘</MenuItem>
        <SubMenu value="1" title={<span>资源列表</span>}>
          <MenuItem value="1-1" disabled>
            <span>菜单二</span>
          </MenuItem>
        </SubMenu>
      </Menu>,
    );
    expect(queryByText('仪表盘')).toBeInTheDocument();
    fireEvent.click(getByText('资源列表'));
    expect(queryByText('菜单二')).toBeInTheDocument();
    expect(onExpandFn).toHaveBeenCalledTimes(1);
  });

  test('menu 测试分组导航', () => {
    const clickFn = vi.fn();
    const { container, queryByText, getByText } = render(
      <Menu onChange={clickFn}>
        <MenuGroup title="主导航">
          <MenuItem value="item1">仪表盘</MenuItem>
        </MenuGroup>
        <MenuGroup title="组件">
          <SubMenu title="列表项" value="2-1">
            <MenuItem value="2-1-1">基础列表项</MenuItem>
          </SubMenu>
        </MenuGroup>
      </Menu>,
    );
    expect(container.querySelector('.t-menu-group')).toBeInTheDocument();
    expect(queryByText('仪表盘')).toBeVisible();
    expect(container.querySelectorAll('.t-submenu').length).toBe(1);
    fireEvent.click(getByText('仪表盘'));
    expect(clickFn).toHaveBeenCalledTimes(1);
    const ulNode = queryByText('基础列表项').parentElement.parentElement;
    expect(ulNode.style.maxHeight).toBe('0');
    fireEvent.click(getByText('列表项'));
    expect(ulNode.style.maxHeight).not.toBe('0');
  });
});
