import React from 'react';
import { render } from '@test/utils';

const items = [
  {
    label: '1',
    value: 1,
    children: [
      {
        label: '1-1',
        value: '1-1',
      },
      {
        label: '1-2',
        value: '1-2',
      },
    ],
  },
  {
    label: '2',
    value: 2,
  },
];

// base Tree Default mount
export function getTreeDefaultMount(Tree, props, events) {
  return render(<Tree data={items} {...props} {...events} />);
}
