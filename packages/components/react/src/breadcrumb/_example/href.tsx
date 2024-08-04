import React, { useState } from 'react';
import { Breadcrumb } from 'tdesign-react';

const { BreadcrumbItem } = Breadcrumb;

export default function BreadcrumbExample() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Breadcrumb maxItemWidth="150">
        <BreadcrumbItem href="/" target="_blank">
          页面1
        </BreadcrumbItem>
        <BreadcrumbItem href="/react/components/button" disabled>
          页面2
        </BreadcrumbItem>
        <BreadcrumbItem maxItemWidth="160" onClick={() => setCount(count + 1)}>
          页面3
        </BreadcrumbItem>
      </Breadcrumb>

      <div style={{ marginTop: 20 }}>点击计数器：{count}</div>
    </div>
  );
}
