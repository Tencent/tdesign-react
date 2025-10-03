import React, { useState } from 'react';

import { Button, Card, ConfigProvider, Dialog, Drawer, Space, Tooltip } from 'tdesign-react';

export default function BasicUsage() {
  const [dialogVisible1, setDialogVisible1] = useState(false);
  const [drawerVisible1, setDrawerVisible1] = useState(false);

  const [dialogVisible2, setDialogVisible2] = useState(false);
  const [drawerVisible2, setDrawerVisible2] = useState(false);

  return (
    <Space size={100}>
      <Card
        header={
          <strong>
            启用全局 z-index 管理
            <br />
            后面打开的组件层级更高
          </strong>
        }
      >
        <ConfigProvider autoZIndex onZIndexChange={(zIndex) => console.log('ZIndex changed:', zIndex)}>
          <Space>
            <Button theme="success" onClick={() => setDialogVisible1(true)}>
              Open Modal
            </Button>
            <Tooltip content="文字提示" visible={true} placement="right">
              <Button variant="outline">Tooltip</Button>
            </Tooltip>
            <Dialog visible={dialogVisible1} onClose={() => setDialogVisible1(false)}>
              我的层级比 Tooltip 高
              <br />
              <Button onClick={() => setDrawerVisible1(true)} style={{ marginTop: '8px' }}>
                Open Drawer
              </Button>
              <Drawer visible={drawerVisible1} onClose={() => setDrawerVisible1(false)}>
                我的层级比 Dialog 高
              </Drawer>
            </Dialog>
          </Space>
        </ConfigProvider>
      </Card>

      <Card
        header={
          <strong>
            关闭全局 z-index 管理
            <br />
            组件层级固定，需要手动设置 zIndex
          </strong>
        }
      >
        <Space>
          <Button theme="warning" onClick={() => setDialogVisible2(true)}>
            Open Modal
          </Button>
          <Tooltip content="文字提示" visible={true} placement="right">
            <Button variant="outline">Tooltip</Button>
          </Tooltip>
          <Dialog visible={dialogVisible2} onClose={() => setDialogVisible2(false)}>
            我的层级比 Tooltip 低
            <br />
            <Button onClick={() => setDrawerVisible2(true)} style={{ marginTop: '8px' }}>
              Open Drawer
            </Button>
            <Drawer visible={drawerVisible2} onClose={() => setDrawerVisible2(false)}>
              我的层级比 Dialog 低
            </Drawer>
          </Dialog>
        </Space>
      </Card>
    </Space>
  );
}
