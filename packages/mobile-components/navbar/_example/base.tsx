import React from 'react';
import { Navbar, Divider } from 'tdesign-mobile-react';
import { CloseIcon, ChevronLeftIcon, HomeIcon, EllipsisIcon } from 'tdesign-icons-react';

const BaseDemo = () => {
  const handleClick = () => {
    console.log('left-click');
  };

  return (
    <>
      <Navbar fixed={false}>标题文字</Navbar>
      <Navbar
        leftArrow
        left={<CloseIcon size={24} />}
        fixed={false}
        right={<EllipsisIcon size={24} />}
        onLeftClick={handleClick}
      >
        标题文字
      </Navbar>
      <Navbar
        fixed={false}
        capsule={
          <div className="custom-capsule">
            <ChevronLeftIcon size={20} className="custom-capsule__icon" />
            <Divider layout="vertical" />
            <HomeIcon size={20} className="custom-capsule__icon" />
          </div>
        }
        titleMaxLength={5}
        onLeftClick={handleClick}
      >
        标题文字
      </Navbar>
    </>
  );
};

export default BaseDemo;
