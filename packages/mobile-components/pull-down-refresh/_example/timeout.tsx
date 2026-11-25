import React, { useState } from 'react';
import { PullDownRefresh, Toast } from 'tdesign-mobile-react';

export default function Demo() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <PullDownRefresh
        refreshTimeout={1000}
        onTimeout={() => {
          Toast({ message: '已超时' });
        }}
        onRefresh={() =>
          new Promise((resolve) => {
            setCount(count + 1);
            setTimeout(() => {
              resolve(1);
            }, 2000);
          })
        }
      >
        <div className="pull-down-refresh-content">已下拉{count}次</div>
      </PullDownRefresh>
    </div>
  );
}
