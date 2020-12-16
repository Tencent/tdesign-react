import React from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';
import { FolderIcon, FolderOpenIcon, FilePasteIcon } from '../../icon';

function renderTreeIcon(node) {
  const { expanded, vmIsLeaf } = node;
  let iconView = null;
  if (vmIsLeaf) {
    iconView = <FilePasteIcon />;
  } else if (expanded) {
    iconView = <FolderOpenIcon />;
  } else {
    iconView = <FolderIcon />;
  }
  return <>{iconView}</>;
}

export default function TreeExample() {
  const data = [
    {
      children: [
        {
          label: '我是节点1-1',
        },
        {
          label: '我是节点1-2',
          children: [
            {
              label: '我是节点1-2-1',
            },
            {
              label: '我是节点1-2-2',
            },
            {
              label: '我是节点1-2-3',
            },
          ],
        },
        {
          label: '我是节点1-3',
        },
      ],
      label: '我是节点1',
    },
    {
      children: [
        {
          label: '我是节点2-1',
        },
        {
          label: '我是节点2-2',
        },
        {
          label: '我是节点2-3',
        },
      ],
      label: '我是节点2',
    },
  ];

  // ReactNode 类型，所有节点图标一致
  // const icon = <FolderIcon />;
  // Function 类型，根据节点状态，动态设置不同图标
  const icon = renderTreeIcon;

  return (
    <>
      <Tree data={data} expandLevel={1} expandOnClickNode={true} icon={icon} checkable={true} />
    </>
  );
}
