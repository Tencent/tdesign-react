import React from 'react';
import { render } from '@test/utils';

const items = [
  {
    label: '第1一段',
    value: 1,
    children: [
      {
        label: '第二段',
        value: '1-1',
      },
      {
        label: '第二段',
        value: '1-2',
      },
    ],
  },
  {
    label: '第1二段',
    value: 2,
  },
];

// base Tree Default mount
export function getTreeDefaultMount(Tree, props, events) {
  return render(<Tree data={items} {...props} {...events} />);
}
