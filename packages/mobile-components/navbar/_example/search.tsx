import React from 'react';
import { EllipsisIcon, HomeIcon } from 'tdesign-icons-react';
import { Navbar, Search } from 'tdesign-mobile-react';

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
