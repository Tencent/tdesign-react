import React from 'react';
import { Breadcrumb } from 'tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <Breadcrumb maxItemWidth="200px" theme="light">
      <BreadcrumbItem>页面1</BreadcrumbItem>
      <BreadcrumbItem>页面2页面2页面2页面2页面2页面2页面2页面2</BreadcrumbItem>
      <BreadcrumbItem maxWidth="120px">
        页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3页面3
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
