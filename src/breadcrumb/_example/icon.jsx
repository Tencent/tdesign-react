import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { BreadcrumbItem } from '../BreadcrumbItem';
import BooksIcon from '../../icon/icons/BooksIcon';

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
