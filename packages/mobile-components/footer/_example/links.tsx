import React from 'react';
import { Footer } from 'tdesign-mobile-react';

const text = 'Copyright © 2019-2023 TDesign.All Rights Reserved.';

const links = [
  [
    {
      name: '底部链接',
      url: '',
    },
  ],
  [
    {
      name: '底部链接',
      url: '',
    },
    {
      name: '底部链接',
      url: '',
    },
  ],
];

export default function LinksDemo() {
  return (
    <>
      <div className="footer-example">
        <Footer text={text} links={links[0]} />
      </div>

      <div className="footer-example">
        <Footer text={text} links={links[1]} />
      </div>
    </>
  );
}
