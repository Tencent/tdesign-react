import React from 'react';
import { Breadcrumb } from 'tdesign-react';
import { BookmarkIcon } from 'tdesign-icons-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem icon={<BookmarkIcon />}>页面1</BreadcrumbItem>
      <BreadcrumbItem icon={<BookmarkIcon />}>页面2</BreadcrumbItem>
      <BreadcrumbItem icon={<BookmarkIcon />}>页面3</BreadcrumbItem>
    </Breadcrumb>
  );
}
