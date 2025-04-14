import React from 'react';
import { Breadcrumb, Button, Dropdown } from 'tdesign-react';
import { EllipsisIcon } from 'tdesign-icons-react';

const { BreadcrumbItem } = Breadcrumb;

const options = [
  { content: '页面1'},
  { content: '页面2'},
  { content: '页面3'},
  { content: '页面4'},
  { content: '页面5'},
];

export default function BreadcrumbExample() {
  return (
    <>
      <Breadcrumb maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={1} ellipsis={(props) => (
          <Dropdown>
            <Button icon={<EllipsisIcon />} shape='square' variant='text' />
            <Dropdown.DropdownMenu>
              {props.items.map((item) => (
                <Dropdown.DropdownItem key={String(item.content)}>{item.content}</Dropdown.DropdownItem>
              ))}
            </Dropdown.DropdownMenu>
          </Dropdown>
        )}>
        {options.map((option) => (
          <BreadcrumbItem key={option.content} content={option.content} />
        ))}
      </Breadcrumb>

      <Breadcrumb maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={1} options={options} ellipsis={(props) => (
          <Dropdown>
            <Button icon={<EllipsisIcon />} shape='square' variant='text' />
            <Dropdown.DropdownMenu>
              {props.items.map((item) => (
                <Dropdown.DropdownItem key={String(item.content)}>{item.content}</Dropdown.DropdownItem>
              ))}
            </Dropdown.DropdownMenu>
          </Dropdown>
        )} />
    </>
  );
}
