import React, { useState } from 'react';
import { Menu, MenuItem, SubMenu } from '@tdesign/react';

export default function BasicUsage() {
  const [active, setActive] = useState(null);

  return (
    <Menu
      theme="dark"
      mode="popup"
      active={active}
      onChange={(v) => setActive(v)}
    >
      <MenuItem name="1">导航一</MenuItem>
      <SubMenu name="sub-1" title="导航二">
        <MenuItem name="3">子导航一</MenuItem>
        <MenuItem name="4">子导航二</MenuItem>
      </SubMenu>
      <SubMenu name="sub-2" title="导航三">
        <MenuItem name="5">子导航一</MenuItem>
        <MenuItem name="6">子导航二</MenuItem>
      </SubMenu>
      <MenuItem name="7" disabled>
        导航四
      </MenuItem>
    </Menu>
  );
}
