import React from 'react';
import { render } from '@test/utils';

import { EnhancedTable } from '..';

describe('EnhancedTable', () => {
  describe('scenarios', () => {
    describe('expand', () => {
      it('honours defaultExpandedTreeNodes for the uncontrolled expanded state', () => {
        const data = [
          {
            key: '0',
            name: '0',
            children: [
              { key: '0-0', name: '0-0' },
              { key: '0-1', name: '0-1' },
            ],
          },
          { key: '1', name: '1' },
        ];
        const columns = [{ colKey: 'name', title: 'name' }];
        const { container } = render(
          <EnhancedTable rowKey="key" data={data} columns={columns} tree={{}} defaultExpandedTreeNodes={['0']} />,
        );
        const rows = [...container.querySelectorAll('tbody tr')].map((tr) => tr.textContent);
        expect(rows).toEqual(['0', '0-0', '0-1', '1']);
      });

      it('does not expand nodes when only defaultSelectedRowKeys is set', () => {
        const data = [
          {
            key: '0',
            name: '0',
            children: [
              { key: '0-0', name: '0-0' },
              { key: '0-1', name: '0-1' },
            ],
          },
          { key: '1', name: '1' },
        ];
        const columns = [{ colKey: 'name', title: 'name' }];
        const { container } = render(
          <EnhancedTable rowKey="key" data={data} columns={columns} tree={{}} defaultSelectedRowKeys={['0']} />,
        );
        const rows = [...container.querySelectorAll('tbody tr')].map((tr) => tr.textContent);
        expect(rows).toEqual(['0', '1']);
      });
    });
  });
});
