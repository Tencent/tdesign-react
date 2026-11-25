import React from 'react';
import { AppIcon, InternetIcon, ServiceIcon } from 'tdesign-icons-react';
import { Cell, CellGroup } from 'tdesign-mobile-react';

export default function Group() {
  return (
    <CellGroup theme="card">
      <Cell leftIcon={<AppIcon />} title="单行标题" arrow />
      <Cell leftIcon={<ServiceIcon />} title="单行标题" arrow />
      <Cell leftIcon={<InternetIcon />} title="单行标题" arrow />
    </CellGroup>
  );
}
