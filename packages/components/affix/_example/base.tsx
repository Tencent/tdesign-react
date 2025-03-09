import React, { useState } from 'react';
import { Affix, Button } from 'tdesign-react';

export default function BaseExample() {
  const [top, setTop] = useState(150);

  const handleClick = () => {
    setTop(top + 10);
  };

  return (
    <Affix offsetTop={top} offsetBottom={10}>
      <Button onClick={handleClick}>固钉</Button>
    </Affix>
  );
}
