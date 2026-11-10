import React from 'react';
import { fireEvent, mockDelay, render, vi, waitFor } from '@test/utils';

import { Table } from '..';

import type { PrimaryTableProps } from '../interface';

const DATA = Array.from({ length: 150 }, (_, id) => ({
  id,
  name: `Row ${id}`,
}));
const COLUMNS = [
  { colKey: 'id', title: 'ID', width: 300 },
  { colKey: 'name', title: 'Name', width: 900 },
];
const SCROLL = { type: 'virtual' as const };

function VirtualTable(props: Partial<PrimaryTableProps>) {
  return (
    <Table rowKey="id" columns={COLUMNS} data={DATA} maxHeight={200} scroll={SCROLL} tableLayout="fixed" {...props} />
  );
}

function scroll(element: HTMLElement, left: number) {
  fireEvent.mouseEnter(element);
  fireEvent.scroll(element, { target: { scrollLeft: left } });
  fireEvent.mouseLeave(element);
}

async function getHeader(container: HTMLElement) {
  await waitFor(() => expect(container.querySelector('.t-table__affixed-header-elm')).toBeTruthy());
  return container.querySelector<HTMLElement>('.t-table__affixed-header-elm');
}

describe('Table', () => {
  describe('scenarios', () => {
    describe('virtual header horizontal scrolling', () => {
      beforeEach(() => {
        vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(600);
        vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200);
        vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1200);
        vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
          return this.textContent?.includes('Row ') ? 4000 : 100;
        });
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('synchronizes a header mounted after empty data loads', async () => {
        const { container, rerender } = render(<VirtualTable data={[]} loading />);
        // Let the initial listener registration finish before the asynchronous data arrives.
        await mockDelay(20);
        expect(container.querySelector('.t-table__affixed-header-elm')).toBeNull();

        rerender(<VirtualTable loading={false} />);
        const header = await getHeader(container);
        const body = container.querySelector<HTMLElement>('.t-table__content');
        scroll(header, 240);
        expect(body.scrollLeft).toBe(240);
        scroll(body, 360);
        expect(header.scrollLeft).toBe(360);
      });

      it('synchronizes when data is available on the initial mount', async () => {
        const { container } = render(<VirtualTable />);
        const header = await getHeader(container);
        const body = container.querySelector<HTMLElement>('.t-table__content');
        // The initial mount also has a deferred listener registration.
        await mockDelay(20);
        scroll(header, 180);
        expect(body.scrollLeft).toBe(180);
        scroll(body, 300);
        expect(header.scrollLeft).toBe(300);
      });

      it('synchronizes a remounted header and releases the removed header', async () => {
        const { container, rerender } = render(<VirtualTable />);
        const oldHeader = await getHeader(container);
        await mockDelay(20);
        scroll(oldHeader, 120);
        const body = container.querySelector<HTMLElement>('.t-table__content');
        expect(body.scrollLeft).toBe(120);

        rerender(<VirtualTable showHeader={false} />);
        expect(container.querySelector('.t-table__affixed-header-elm')).toBeNull();
        scroll(oldHeader, 240);
        expect(body.scrollLeft).toBe(120);

        rerender(<VirtualTable />);
        const header = await getHeader(container);
        expect(header).not.toBe(oldHeader);
        scroll(header, 420);
        expect(body.scrollLeft).toBe(420);
      });

      it('keeps non-virtual affixed headers, footers and the body synchronized', async () => {
        const { container } = render(
          <VirtualTable scroll={undefined} headerAffixedTop footerAffixedBottom footData={[DATA[0]]} />,
        );
        const header = await getHeader(container);
        await mockDelay(20);
        const body = container.querySelector<HTMLElement>('.t-table__content');
        const footer = container.querySelector<HTMLElement>('.t-table__affixed-footer-elm');
        expect(footer).toBeTruthy();
        scroll(header, 180);
        expect(body.scrollLeft).toBe(180);
        expect(footer.scrollLeft).toBe(180);
        scroll(body, 300);
        expect(header.scrollLeft).toBe(300);
        expect(footer.scrollLeft).toBe(300);
      });
    });
  });
});
