import React from 'react';
import { Navbar } from 'tdesign-mobile-react';
import { EllipsisIcon, HomeIcon } from 'tdesign-icons-react';

const SizeDemo = () => (
  <>
    <Navbar
      title="标题文字"
      leftArrow
      fixed={false}
      right={
        <>
          <HomeIcon size={24} />
          <EllipsisIcon size={24} />
        </>
      }
    />
    <Navbar
      style={{ marginBottom: 0 }}
      leftArrow
      left={<span className="custom-title">返回</span>}
      right={
        <>
          <HomeIcon size={24} />
          <EllipsisIcon size={24} />
        </>
      }
      fixed={false}
    />
    <div className="header-title">大尺寸标题</div>
  </>
);

export default SizeDemo;
