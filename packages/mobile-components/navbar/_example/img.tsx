import React from 'react';
import { Navbar } from 'tdesign-mobile-react';
import { EllipsisIcon, HomeIcon } from 'tdesign-icons-react';

const ImgDemo = () => (
  <>
    <Navbar
      left={<img src="https://tdesign.gtimg.com/mobile/demos/logo1.png" className="logo" />}
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

export default ImgDemo;
