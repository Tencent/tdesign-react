import React from 'react';
import { Layout, Menu } from 'tdesign-react';
import {
  SearchIcon,
  NotificationFilledIcon,
  HomeIcon,
  DashboardIcon,
  ServerIcon,
  RootListIcon,
  ControlPlatformIcon,
  PreciseMonitorIcon,
  MailIcon,
  UserCircleIcon,
  PlayCircleIcon,
  Edit1Icon,
} from 'tdesign-icons-react';

const { HeadMenu, MenuItem } = Menu;

function BasicUsage() {
  return (
    <Menu theme="light" value="dashboard" style={{ marginRight: 50, height: 550 }}>
      <MenuItem value="dashboard" icon={<DashboardIcon />}>
        仪表盘
      </MenuItem>
      <MenuItem value="resource" icon={<ServerIcon />}>
        
        资源列表
      </MenuItem>
      <MenuItem value="root">
        <RootListIcon />
        根目录
      </MenuItem>
      <MenuItem value="control-platform" icon={<ControlPlatformIcon />}>
        
        调度平台
      </MenuItem>
      <MenuItem value="precise-monitor" icon={<PreciseMonitorIcon />}>
        
        精准监控
      </MenuItem>
      <MenuItem value="mail" icon={<MailIcon />}>
        
        消息区
      </MenuItem>
      <MenuItem value="user-circle" icon={<UserCircleIcon />}>
        
        个人中心
      </MenuItem>
      <MenuItem value="play-circle" icon={<PlayCircleIcon />}>
        
        视频区
      </MenuItem>
      <MenuItem value="edit1" icon={<Edit1Icon />}>
        
        资源编辑
      </MenuItem>
    </Menu>
  );
}

const { Header, Content, Footer, Aside } = Layout;

export default function BasicDivider() {
  return (
    <div className="tdesign-demo-item--layout">
      <Layout>
        <Header>
          <HeadMenu
            value="item1"
            logo={<img width="136" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />}
            operations={
              <div className="t-menu__operations">
                <SearchIcon className="t-menu__operations-icon" />
                <NotificationFilledIcon className="t-menu__operations-icon" />
                <HomeIcon className="t-menu__operations-icon" />
              </div>
            }
          >
            <MenuItem value="item1">已选内容</MenuItem>
            <MenuItem value="item2">菜单内容一</MenuItem>
            <MenuItem value="item3">菜单内容二</MenuItem>
            <MenuItem value="item4" disabled>
              菜单内容三
            </MenuItem>
          </HeadMenu>
        </Header>
        <Layout>
          <Aside style={{ borderTop: '1px solid var(--component-border)' }}>
            <BasicUsage />
          </Aside>
          <Layout>
            <Content>
              <div>Content</div>
            </Content>
            <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
