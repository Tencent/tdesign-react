import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { BreadcrumbItem } from '../BreadcrumbItem';

export default function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem to={{ path: '/' }}>首页</BreadcrumbItem>
      <BreadcrumbItem to={{ path: '/' }}>页面1</BreadcrumbItem>
    </Breadcrumb>
  );
}
