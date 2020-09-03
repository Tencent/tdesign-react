import React from 'react';
import { HeadMenu, MenuItem, SubMenu } from '@tdesign/react';

export default function BasicUsage() {
  return (
    <HeadMenu theme="dark" height="40px">
      <MenuItem name="1">导航一</MenuItem>
      <SubMenu name="sub-2" title="导航二" subMenuStyle={{ top: '99px' }}>
        <MenuItem name="3">子导航一</MenuItem>
        <MenuItem name="4">子导航二</MenuItem>
      </SubMenu>
      <SubMenu name="sub-3" title="导航三">
        <MenuItem name="7">子导航一</MenuItem>
        <MenuItem name="8">子导航二</MenuItem>
      </SubMenu>
      <MenuItem name="5" disabled>
        导航三
      </MenuItem>
    </HeadMenu>
  );
}
