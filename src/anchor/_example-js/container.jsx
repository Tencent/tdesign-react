import React from 'react';
import { Anchor } from 'tdesign-react';

const { AnchorItem } = Anchor;

export default function AnchorAttach() {
  const handleClick = ({ e, href, title }) => {
    e.preventDefault();
    console.log('handleClick', href, title);
  };

  return (
    <>
      <div style={{ display: 'flex' }} id="attach" className="anchor-demo-attach">
        <Anchor container="#anchor-container" onClick={handleClick}>
          <AnchorItem href="#content-1" title="content-1" />
          <AnchorItem href="#content-2" title="content-2" />
          <AnchorItem href="#content-3" title="content-3" />
          <AnchorItem href="#content-4" title="content-4" />
        </Anchor>
        <div
          id="anchor-container"
          style={{ width: '100%', height: '200px', overflow: 'auto', textAlign: 'center', fontSize: '22px' }}
        >
          <div id="content-1" style={{ background: '#DFEFFF', lineHeight: '100px' }}>
            content-1
          </div>
          <div id="content-2" style={{ background: '#BFDBF7', lineHeight: '100px' }}>
            content-2
          </div>
          <div id="content-3" style={{ background: '#9BC5F2', lineHeight: '100px' }}>
            content-3
          </div>
          <div id="content-4" style={{ background: '#7BAFED', lineHeight: '100px' }}>
            content-4
          </div>
          <div id="content-5" style={{ background: '#5C99EB', lineHeight: '100px' }}>
            content-5
          </div>
        </div>
      </div>
    </>
  );
}
