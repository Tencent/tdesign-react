import React, { useState } from 'react';
import { Button, Dialog, Space } from 'tdesign-react';

export default function NotModalExample() {
  const [modelessAndDraggable, setModelessAndDraggable] = useState(false);
  const [modeless, setModeless] = useState(false);
  const [modal, setModal] = useState(false);

  return (
    <>
      <Space>
        <Button theme="primary" variant="outline" onClick={() => setModelessAndDraggable(true)}>
          非模态对话框（可拖拽）
        </Button>
        <Button theme="primary" onClick={() => setModeless(true)}>
          非模态对话框（不可拖拽）
        </Button>
        <Button theme="primary" onClick={() => setModal(true)}>
          普通对话框（不可拖拽）
        </Button>
      </Space>

      <Dialog
        mode="modeless"
        header="非模态对话框（可拖拽）"
        draggable
        visible={modelessAndDraggable}
        onClose={() => setModelessAndDraggable(false)}
      >
        <p>This is a dialog</p>
      </Dialog>
      <Dialog mode="modeless" header="非模态对话框（不可拖拽）" visible={modeless} onClose={() => setModeless(false)}>
        <p>This is a dialog</p>
      </Dialog>
      <Dialog header="普通对话框（不可拖拽）" visible={modal} onClose={() => setModal(false)}>
        <p>This is a dialog</p>
      </Dialog>
    </>
  );
}
