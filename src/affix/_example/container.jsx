import React, { useState, useRef, useEffect } from 'react';
import { Affix, Button } from '@tencent/tdesign-react';

import './container.less';

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

  return (
    <div className="affix-container" ref={setContainer}>
      <div className="background">
        <Affix offsetTop={20} container={container} onFixedChange={handleFixedChange} ref={affixRef}>
          <Button onClick={resetPosition}>Container</Button>
        </Affix>
      </div>
    </div>
  );
}
