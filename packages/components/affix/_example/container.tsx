import React, { useState } from 'react';
import { Affix, Button } from 'tdesign-react';

export default function ContainerExample() {
  const [container, setContainer] = useState(null);

  const backgroundStyle = {
    height: '1500px',
    backgroundColor: '#eee',
    backgroundImage:
      'linear-gradient(45deg,#bbb 25%,transparent 0),linear-gradient(45deg,transparent 75%,#bbb 0),linear-gradient(45deg,#bbb 25%,transparent 0),linear-gradient(45deg,transparent 75%,#bbb 0)',
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0,15px 15px,15px 15px,0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  } as React.CSSProperties;

  return (
    <div
      ref={setContainer}
      style={{
        border: '1px solid var(--component-stroke)',
        borderRadius: '3px',
        height: '400px',
        overflowX: 'hidden',
        overflowY: 'auto',
        overscrollBehavior: 'none',
      }}
    >
      <div style={backgroundStyle}>
        <Affix zIndex={10} offsetTop={50} container={container}>
          <Button>Top</Button>
        </Affix>
        <Affix offsetBottom={50} container={container}>
          <Button>Bottom</Button>
        </Affix>
      </div>
    </div>
  );
}
