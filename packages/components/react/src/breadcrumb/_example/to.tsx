import React from 'react';
import { Breadcrumb } from 'tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem to={{ path: '/' }}>首页</BreadcrumbItem>
      <BreadcrumbItem to={{ path: '/' }}>页面1</BreadcrumbItem>
    </Breadcrumb>
  );
}
