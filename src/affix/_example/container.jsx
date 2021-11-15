import React, { useState, useRef, useEffect } from 'react';
import { Affix, Button } from 'tdesign-react';

export default function ContainerExample() {
  const [container, setContainer] = useState(null);
  const affixRef = useRef(null);

  const handleFixedChange = (affixed, { top }) => {
    console.log('affixed', affixed, top);
  };

  // 重置位置
  const resetPosition = () => affixRef.current.calcInitValue();

  useEffect(() => {
    if (affixRef.current) {
      const { handleScroll } = affixRef.current;
      // 防止 affix 移动到容器外
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const containerStyle = {
    border: '1px solid var(--component-stroke)',
    borderRadius: '3px',
    height: '400px',
    overflowX: 'hidden',
    overflowY: 'auto',
    overscrollBehavior: 'none',
  };

  const backgroundStyle = {
    height: '1500px',
    paddingTop: '200px',
    backgroundColor: '#eee',
    backgroundImage: 'linear-gradient(45deg,#bbb 25%,transparent 0),linear-gradient(45deg,transparent 75%,#bbb 0),linear-gradient(45deg,#bbb 25%,transparent 0),linear-gradient(45deg,transparent 75%,#bbb 0)',
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0,15px 15px,15px 15px,0 0',
  }

  return (
    <div style={containerStyle} ref={setContainer}>
      <div style={backgroundStyle}>
        <Affix offsetTop={20} container={container} onFixedChange={handleFixedChange} ref={affixRef}>
          <Button onClick={resetPosition}>Container</Button>
        </Affix>
      </div>
    </div>
  );
}
