import React from 'react';
import { Button, Popconfirm, Space } from 'tdesign-react';

export default function InheritExample() {
  return (
    <Space>
      <Popconfirm theme={'default'} content={'直接使用 placement 进行设置'} placement={'bottom'}>
        <Button theme="default" variant="outline">
          浮层出现在下方
        </Button>
      </Popconfirm>
      <Popconfirm
        theme={'default'}
        content="透传属性到 Popup 组件进行设置"
        popupProps={{
          placement: 'right',
        }}
        confirmBtn={
          <Button theme={'primary'} size={'small'}>
            确定提交
          </Button>
        }
        cancelBtn={
          <Button theme={'default'} size={'small'} variant={'outline'}>
            我再想想
          </Button>
        }
      >
        <Button theme="default" variant="outline">
          浮层出现在右侧
        </Button>
      </Popconfirm>
    </Space>
  );
}
