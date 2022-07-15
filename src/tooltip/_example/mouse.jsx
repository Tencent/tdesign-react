import React from 'react';
import { Tooltip } from 'tdesign-react';

export default function MouseTitle() {
  return (
    <Tooltip content="文案比较长长长确实很长" placement="mouse">
      <a id="testa" href="#">
        文案比较长...
      </a>
    </Tooltip>
  );
}
