import React, { useState } from 'react';
import { Affix, Button } from 'tdesign-react';

import type { AffixProps } from 'tdesign-react';

export default function BaseExample() {
  const [affixed, setAffixed] = useState(false);

  const handleFixedChange: AffixProps['onFixedChange'] = (affixed, { top }) => {
    console.log('top', top);
    setAffixed(affixed);
  };

  return (
    <Affix offsetTop={150} zIndex={2000} onFixedChange={handleFixedChange}>
      <Button theme={affixed ? 'success' : 'primary'}>Affixed: {`${affixed}`}</Button>
    </Affix>
  );
}
