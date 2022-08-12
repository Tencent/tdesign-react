import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

const { DropdownSubmenu, DropdownItem } = Dropdown;
export default function BasicDropdown() {
  const clickHandler = (data) => {
    // MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    // <Dropdown minColumnWidth={'100px'} onClick={clickHandler}>
    <Dropdown minColumnWidth={'100px'}>
      <Button variant="text" suffix={<Icon name="chevron-down" size="16" />}>
        更多
      </Button>
      <DropdownSubmenu>
        <DropdownItem value={1}>
          操作一
          <DropdownSubmenu>
            <DropdownItem value={11}>
              操作1-1
              <DropdownSubmenu>
                <DropdownItem value={111}>操作1-1-1</DropdownItem>
                <DropdownItem value={112}>操作1-1-2</DropdownItem>
              </DropdownSubmenu>
            </DropdownItem>
            <DropdownItem value={12}>操作1-2</DropdownItem>
          </DropdownSubmenu>
        </DropdownItem>
        <DropdownItem value={2}>
          操作二
          <DropdownSubmenu>
            <DropdownItem value={21}>
              操作2-1
              <DropdownSubmenu>
                <DropdownItem value={211}>操作2-1-1</DropdownItem>
                <DropdownItem value={211}>操作2-1-2</DropdownItem>
              </DropdownSubmenu>
            </DropdownItem>
            <DropdownItem value={22} onClick={clickHandler}>
              操作2-2
            </DropdownItem>
          </DropdownSubmenu>
        </DropdownItem>
      </DropdownSubmenu>
    </Dropdown>
  );
}
