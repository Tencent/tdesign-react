import React from 'react';
import { render } from '@test/utils';
import { Input } from '..';

export function getInputGroupDefaultMount(InputGroup, props) {
  return render(
    <InputGroup {...props}>
      <Input />
      <Input />
    </InputGroup>,
  );
}

export default getInputGroupDefaultMount;
