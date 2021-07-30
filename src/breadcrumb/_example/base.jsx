import React from 'react';
import { Breadcrumb } from '@tencent/tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <Breadcrumb maxItemWidth="150">
      <BreadcrumbItem>页面1</BreadcrumbItem>
      <BreadcrumbItem>页面2页面2页面2页面2页面2页面2页面2页面2</BreadcrumbItem>
      <BreadcrumbItem maxItemWidth="160">
        页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
