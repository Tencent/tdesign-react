import React from 'react';
import { fireEvent, render } from '@test/utils';

import { EnhancedTable } from '..';

describe('EnhancedTable', () => {
  describe('scenarios', () => {
    describe('select', () => {
      it('checks the row checkbox for non-tree data', () => {
        const data = [
          { id: 1, name: 'a' },
          { id: 2, name: 'b' },
        ];
        const columns = [
          { colKey: 'row-select', type: 'multiple' as const },
          { colKey: 'name', title: 'name' },
        ];
        const { container } = render(<EnhancedTable rowKey="id" data={data} columns={columns} />);
        const rowCheckbox = container.querySelector('tbody .t-checkbox');
        expect(rowCheckbox).toBeTruthy();
        fireEvent.click(rowCheckbox);
        expect(rowCheckbox.className).toContain('t-is-checked');
      });

      it('still reports the selection through onSelectChange', () => {
        const data = [
          { id: 1, name: 'a' },
          { id: 2, name: 'b' },
        ];
        const columns = [
          { colKey: 'row-select', type: 'multiple' as const },
          { colKey: 'name', title: 'name' },
        ];
        const onSelectChange = vi.fn();
        const { container } = render(
          <EnhancedTable rowKey="id" data={data} columns={columns} onSelectChange={onSelectChange} />,
        );
        fireEvent.click(container.querySelector('tbody .t-checkbox'));
        expect(onSelectChange).toHaveBeenCalled();
        expect(onSelectChange.mock.calls[0][0]).toEqual([1]);
      });
    });
  });
});
