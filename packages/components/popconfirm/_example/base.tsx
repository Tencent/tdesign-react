import React, { useState } from 'react';
import { Button, Popconfirm, MessagePlugin, Space } from 'tdesign-react';

export default function BasicExample() {
  const [visible, setVisible] = useState(false);

  const deleteClickHandler = () => {
    const msg = MessagePlugin.info('提交中', 0);
    setTimeout(() => {
      MessagePlugin.close(msg);
      MessagePlugin.success('提交成功！');
      setVisible(false);
    }, 1000);
  };

  return (
    <Space>
      <Popconfirm content={'确认删除订单吗'} cancelBtn={null}>
        <Button theme="primary">删除订单</Button>
      </Popconfirm>
      <Popconfirm
        visible={visible}
        content={'是否提交审核？（自由控制浮层显示或隐藏）'}
        confirmBtn={
          <Button size={'small'} onClick={deleteClickHandler}>
            确定
          </Button>
        }
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Button
          theme="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          提交审核
        </Button>
      </Popconfirm>
    </Space>
  );
}
