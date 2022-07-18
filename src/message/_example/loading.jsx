import React, { useState } from 'react';
import { Message, Button, Space } from 'tdesign-react';

export default function () {
  const [successLoading, setSuccessLoading] = useState(false);
  const [warningLoading, setWarningLoading] = useState(false);

  const resetDisabled = successLoading || warningLoading;

  const resetMethod = () => {
    if (!successLoading && !warningLoading) {
      setSuccessLoading(true);
      setWarningLoading(true);
      setTimeout(() => {
        setSuccessLoading(false);
        setWarningLoading(false);
      }, 10000);
    }
  };

  return (
    <Space direction="vertical">
      <Message duration={0} theme="loading">
        用于表示操作正在生效的过程中
      </Message>
      <Message duration={0} theme={successLoading ? 'loading' : 'success'}>
        用于表示操作顺利达成(10s)
      </Message>
      <Message duration={0} theme={warningLoading ? 'loading' : 'warning'}>
        用于表示普通操作失败中断(10s)
      </Message>
      <Button style={{ marginTop: 16 }} onClick={resetMethod} disabled={resetDisabled}>
        重置
      </Button>
    </Space>
  );
}
