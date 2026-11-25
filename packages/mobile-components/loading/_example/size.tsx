import React from 'react';
import { Loading } from 'tdesign-mobile-react';

export default function SizeLoading() {
  return (
    <>
      <div>
        <div className="loading-demo__summary mb-16">大尺寸</div>
        <Loading size="26px" text="加载中..." />
      </div>
      <div>
        <div className="loading-demo__summary mt-24 mb-16">中尺寸</div>
        <Loading size="22px" text="加载中..." />
      </div>
      <div>
        <div className="loading-demo__summary mt-24 mb-16">小尺寸</div>
        <Loading size="20px" text="加载中..." />
      </div>
    </>
  );
}
