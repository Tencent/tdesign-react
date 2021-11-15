import React from 'react';
import { Breadcrumb } from 'tdesign-react';
import { BooksIcon } from 'tdesign-icons-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BooksIcon />
        页面1
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BooksIcon />
        页面2
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BooksIcon />
        页面3
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
