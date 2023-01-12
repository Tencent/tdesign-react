import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

const { DropdownMenu, DropdownItem } = Dropdown;
export default function BasicDropdown() {
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown minColumnWidth={100} trigger="click">
      <Button variant="text" suffix={<Icon name="chevron-down" size="16" />}>
        更多
      </Button>
      <DropdownMenu>
        <DropdownItem value={1}>
          操作一
          <DropdownMenu>
            <DropdownItem value={11}>操作1-1</DropdownItem>
            <DropdownItem value={12}>
              操作1-2
              <DropdownMenu>
                <DropdownItem value={111}>操作1-1-1</DropdownItem>
                <DropdownItem value={112}>操作1-1-2</DropdownItem>
              </DropdownMenu>
            </DropdownItem>
          </DropdownMenu>
        </DropdownItem>
        <DropdownItem value={2}>
          操作二
          <DropdownMenu>
            <DropdownItem value={21}>
              操作2-1
              <DropdownMenu>
                <DropdownItem value={211}>操作2-1-1</DropdownItem>
                <DropdownItem value={211}>操作2-1-2</DropdownItem>
              </DropdownMenu>
            </DropdownItem>
            <DropdownItem value={22} onClick={clickHandler}>
              操作2-2
            </DropdownItem>
          </DropdownMenu>
        </DropdownItem>
        <DropdownItem value={3}>操作三</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
