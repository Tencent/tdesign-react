import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

const { DropdownMenu, DropdownItem } = Dropdown;
export default function BasicDropdown() {
  const getContent = () => <div>操作一</div>;
  const options = [
    {
      content: getContent(),
      value: 1,
      child: [
        {
          content: '选项八',
          value: 9,
          child: [
            {
              content: '选项七',
              value: 7,
            },
            {
              content: '选项八',
              value: 8,
            },
          ],
        },
      ],
    },
    {
      content: '选项二',
      value: 2,
      child: [
        {
          content: '选项五',
          value: 5,
          child: [
            {
              content: '选项七',
              value: 7,
            },
            {
              content: '选项八',
              value: 8,
            },
          ],
        },
        {
          content: '选项六',
          value: 6,
        },
      ],
    },
    {
      content: '选项三',
      value: 3,
      child: [
        {
          content: '选项十',
          value: 10,
        },
      ],
    },
    {
      content: getContent(),
      value: 4,
      child: [
        {
          content: '选项十一',
          value: 11,
          onClick(...arg) {
            console.log(...arg);
          },
        },
      ],
    },
  ];
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown minColumnWidth={'100px'} onClick={clickHandler} debug={true}>
      <Button variant="text">
        <span style={{ display: 'inline-flex' }}>
          更多
          <Icon name="chevron-down" size="16" />
        </span>
      </Button>
      <DropdownMenu debug={true}>
        {options.map((e, idx) => (
          <DropdownItem key={idx} {...e}>
            {e.child &&
              e.child.map((item, i) => (
                <DropdownItem key={idx + i} {...item}>
                  {item.child &&
                    item.child.map((sub, l) => (
                      <DropdownItem key={idx + i + l} {...sub}>
                        {sub.content}
                      </DropdownItem>
                    ))}
                  {item.content}
                </DropdownItem>
              ))}
            {e.content}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
