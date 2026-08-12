import React, { useRef } from 'react';
import { Affix, Button } from 'tdesign-react';

export default function ContainerExample() {
  const containerRef = useRef<HTMLDivElement>();

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
      ref={containerRef}
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
        <Affix zIndex={10} offsetTop={50} container={() => containerRef.current}>
          <Button>Top</Button>
        </Affix>
        <Affix offsetBottom={50} container={() => containerRef.current}>
          <Button>Bottom</Button>
        </Affix>
      </div>
    </div>
  );
}
