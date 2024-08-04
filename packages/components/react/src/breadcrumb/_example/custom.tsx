import React from 'react';
import { Breadcrumb } from 'tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <>
      <Breadcrumb maxItemWidth="150" separator={'>>'}>
        <BreadcrumbItem>页面1</BreadcrumbItem>
        <BreadcrumbItem>页面2</BreadcrumbItem>
        <BreadcrumbItem maxItemWidth="160">页面3</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb maxItemWidth="150" separator={'/////'}>
        <BreadcrumbItem>页面1</BreadcrumbItem>
        <BreadcrumbItem>页面2</BreadcrumbItem>
        <BreadcrumbItem maxItemWidth="160">页面3</BreadcrumbItem>
      </Breadcrumb>
    </>
  );
}
