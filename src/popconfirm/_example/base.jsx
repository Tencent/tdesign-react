import React, { useState } from 'react';
import { Button, PopConfirm, Message } from 'tdesign-react';

export default function BasicExample() {
  const [visible, setVisible] = useState(false);

  const deleteClickHandler = () => {
    const msg = Message.info('提交中', 0);
    setTimeout(() => {
      Message.close(msg);
      Message.success('提交成功！');
      setVisible(false);
    }, 1000);
  };

  return (
    <div className="tdesign-demo-block-row">
      <PopConfirm content={'确定删除订单吗'}>
        <Button theme="primary">删除订单</Button>
      </PopConfirm>
      <PopConfirm
        content={'你看到了吗'}
        confirmBtn={<Button theme={'primary'} variant={'outline'} size={'small'}>看到了</Button>}
        cancelBtn={null}
      >
        <Button theme="primary">点我看按钮</Button>
      </PopConfirm>
      <PopConfirm
        visible={visible}
        content={'是否提交审核？（自定义按钮内容）'}
        confirmBtn={<Button size={'small'} onClick={deleteClickHandler}>删除</Button>}
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
      <PopConfirm>
        <Button theme="primary" disabled>禁用按钮</Button>
      </PopConfirm>
    </div>
  );
}
