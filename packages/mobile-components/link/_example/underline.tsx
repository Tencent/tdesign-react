import React from 'react';
import { Link } from 'tdesign-mobile-react';

export default function Underline() {
  const clickHandle = () => {
    console.log('click');
  };

  return (
    <div className="demo-content">
      <Link theme="primary" underline onClick={clickHandle}>
        跳转链接
      </Link>
      <Link hover underline>
        跳转链接
      </Link>
    </div>
  );
}
