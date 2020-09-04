import React from 'react';
import { Addon } from '@tdesign/react';

export default function AddonExample() {
  return (
    <>
      <Addon prepend="http://">
        <div className="t-input">
          <input defaultValue="qq.com" type="text" className="t-input__inner" />
        </div>
      </Addon>
      <Addon append=".com">
        <div className="t-input">
          <input type="text" className="t-input__inner" />
        </div>
      </Addon>
    </>
  );
}
