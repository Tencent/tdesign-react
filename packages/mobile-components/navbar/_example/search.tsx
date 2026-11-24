import React from 'react';
import { Navbar, Search } from 'tdesign-mobile-react';
import { HomeIcon, EllipsisIcon } from 'tdesign-icons-react';

const SearchDemo = () => (
  <Navbar
    fixed={false}
    left={<Search shape="round" placeholder="搜索预设文案"></Search>}
    right={
      <>
        <HomeIcon size={24} />
        <EllipsisIcon size={24} />
      </>
    }
  ></Navbar>
);

export default SearchDemo;
