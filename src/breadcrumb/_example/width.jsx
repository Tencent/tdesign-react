import React from 'react';
import { Breadcrumb } from 'tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  return (
    <Breadcrumb maxItemWidth="100px">
      <BreadcrumbItem>父级设置100px父级设置100px</BreadcrumbItem>
      <BreadcrumbItem maxWidth="160px">设置最大宽度160px设置最大宽度160px设置最大宽度160px</BreadcrumbItem>
      <BreadcrumbItem maxWidth="240px">
        设置最大宽度240px设置最大宽度240px设置最大宽度240px设置最大宽度240px设置最大宽度240px
      </BreadcrumbItem>
      <BreadcrumbItem>父级设置100px父级设置100px</BreadcrumbItem>
    </Breadcrumb>
  );
}
