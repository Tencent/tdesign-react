import React, { useState } from 'react';
import { Switch, Space } from 'tdesign-react';

export default function SwitchBeforeChange() {
  const [resolveChecked, setResolveChecked] = useState(true);
  const [rejectedChecked, setRejectedChecked] = useState(true);
  const [loadingResolve, setLoadingResolve] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  const beforeChangeResolve = (): Promise<boolean> => {
    setLoadingResolve(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setLoadingResolve(false);
        resolve(true);
      }, 1000);
    });
  };

  const beforeChangeReject = (): Promise<boolean> => {
    setLoadingReject(true);
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        setLoadingReject(false);
        reject(new Error('reject'));
      }, 1000);
    });
  };

  const onChangeResolve = (v: boolean) => {
    console.log(v);
    setResolveChecked(v);
  };

  const onChangeReject = (v: boolean) => {
    console.log(v);
    setRejectedChecked(v);
  };

  return (
    <Space>
      <Switch
        size="large"
        loading={loadingResolve}
        onChange={onChangeResolve}
        value={resolveChecked}
        beforeChange={beforeChangeResolve}
      />
      <Switch
        size="large"
        loading={loadingReject}
        onChange={onChangeReject}
        value={rejectedChecked}
        beforeChange={beforeChangeReject}
      />
    </Space>
  );
}
