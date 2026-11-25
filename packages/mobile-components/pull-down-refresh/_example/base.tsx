import React from 'react';
import { PullDownRefresh } from 'tdesign-mobile-react';

export default function BaseDemo({ children }) {
  return (
    <div className="tdesign-mobile-wrapper">
      <PullDownRefresh
        loadingBarHeight={66}
        loadingProps={{}}
        loadingTexts={['下拉刷新', '松开刷新', '正在刷新', '刷新完成']}
        onChange={(value) => {
          console.log('[onChange]', value);
        }}
        onRefresh={() =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(1);
            }, 2000);
          })
        }
      >
        {children}
      </PullDownRefresh>
    </div>
  );
}
