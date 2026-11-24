import React from 'react';
import { CellGroup, Cell } from 'tdesign-mobile-react';
import { AppIcon, ServiceIcon, InternetIcon } from 'tdesign-icons-react';

export default function Group() {
  return (
    <CellGroup theme="card">
      <Cell leftIcon={<AppIcon />} title="单行标题" arrow />
      <Cell leftIcon={<ServiceIcon />} title="单行标题" arrow />
      <Cell leftIcon={<InternetIcon />} title="单行标题" arrow />
    </CellGroup>
  );
}
