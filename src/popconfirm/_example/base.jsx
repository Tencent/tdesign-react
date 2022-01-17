import React, { useState } from 'react';
import { Button, PopConfirm, MessagePlugin } from 'tdesign-react';

export default function BasicExample() {
  const [visible, setVisible] = useState(true);

  const deleteClickHandler = () => {
    const msg = MessagePlugin.info('提交中', 0);
    setTimeout(() => {
      MessagePlugin.close(msg);
      MessagePlugin.success('提交成功！');
      setVisible(false);
    }, 1000);
  };

  return (
    <div className="tdesign-demo-block-row">
      <PopConfirm content={'确认删除订单吗'}>
        <Button theme="primary">删除订单</Button>
      </PopConfirm>
      <PopConfirm
        visible={visible}
        content={'是否提交审核？（自由控制浮层显示或隐藏）'}
        confirmBtn={<Button size={'small'} onClick={deleteClickHandler}>确定</Button>}
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
      </PopConfirm>
    </div>
  );
}
