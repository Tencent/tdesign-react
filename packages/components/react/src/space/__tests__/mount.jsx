import React from 'react';
import { render } from '@test/utils';
import { Button } from '../../button';

export function getSpaceDefaultMount(Space, props, events) {
  return render(
    <Space {...props} {...events}>
      <Button>Text</Button>
      <Button>Text</Button>
      <Button>Text</Button>
    </Space>
  );
}

export default getSpaceDefaultMount;
