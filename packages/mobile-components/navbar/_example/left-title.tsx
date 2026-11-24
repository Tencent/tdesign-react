import React from 'react';
import { Navbar } from 'tdesign-mobile-react';
import { EllipsisIcon, HomeIcon } from 'tdesign-icons-react';

const LeftTitleDemo = () => (
  <>
    <Navbar
      title="标题居中"
      leftArrow
      fixed={false}
      right={
        <>
          <EllipsisIcon size={24} />
        </>
      }
    />
    <Navbar
      leftArrow
      left={<span className="custom-left-title">标题左对齐</span>}
      right={
        <>
          <HomeIcon size={24} />
          <EllipsisIcon size={24} />
        </>
      }
      fixed={false}
    />
  </>
);

export default LeftTitleDemo;
