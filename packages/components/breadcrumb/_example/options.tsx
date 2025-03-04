import React from 'react';
import { Breadcrumb } from '@tdesign/components';

export default function BreadcrumbExample() {
  const options = [{ content: '页面1' }, { content: '页面2' }, { content: '页面3', href: 'https://github.com/' }];
  return <Breadcrumb options={options} />;
}
