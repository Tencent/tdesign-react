import React from 'react';
import { Anchor, AnchorItem } from '@tencent/tdesign-react';

export default function AnchorAttach() {
  return (
    <>
      <div style={{ display: 'flex' }} id="/components/anchor/#attach" className="anchor-demo-attach">
        <Anchor attach="#attach">
          <AnchorItem href="/#/components/anchor/#content-1" title="content-1" />
          <AnchorItem href="/#/components/anchor/#content-2" title="content-2" />
          <AnchorItem href="/#/components/anchor/#content-3" title="content-3" />
          <AnchorItem href="/#/components/anchor/#content-4" title="content-4" />
        </Anchor>
        <div id="attach" className="tdesign-demo-item--anchor-container">
          <div id="/components/anchor/#content-1" style={{ background: '#DFEFFF' }}>
            content-1
          </div>
          <div id="/components/anchor/#content-2" style={{ background: '#BFDBF7' }}>
            content-2
          </div>
          <div id="/components/anchor/#content-3" style={{ background: '#9BC5F2' }}>
            content-3
          </div>
          <div id="/components/anchor/#content-4" style={{ background: '#7BAFED' }}>
            content-4
          </div>
          <div id="/components/anchor/#content-5" style={{ background: '#5C99EB' }}>
            content-5
          </div>
        </div>
      </div>
    </>
  );
}
