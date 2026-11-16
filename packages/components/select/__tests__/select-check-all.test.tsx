import React from 'react';
import { cleanup, fireEvent, render } from '@test/utils';

import { Select } from '..';

const flush = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('Select', () => {
  // 弹层是 teleport 到 body 的，render 的 container 里看不到，
  // 只能查 document。不清理的话残留节点会串到后面的用例（E-001）。
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  describe('scenarios', () => {
    describe('check all', () => {
      it('re-selects every option after one option is unchecked', async () => {
        const options = [
          { label: 'All', checkAll: true },
          { label: 'Apple', value: 'apple' },
          { label: 'Orange', value: 'orange' },
          { label: 'Banana', value: 'banana' },
        ];
        const calls: any[] = [];
        const { container } = render(
          <Select
            multiple
            options={options}
            onChange={(v: any) => {
              calls.push(v);
            }}
          />,
        );
        await flush();
        fireEvent.click(container.querySelector('input'));
        await flush();

        const optionEl = (text: string) =>
          [...document.querySelectorAll('.t-select-option')].find((el) => el.textContent.includes(text));

        expect(optionEl('All')).toBeTruthy();
        fireEvent.click(optionEl('All'));
        await flush();
        expect(calls[calls.length - 1]).toEqual(['apple', 'orange', 'banana']);

        fireEvent.click(optionEl('Orange'));
        await flush();
        expect(calls[calls.length - 1]).toEqual(['apple', 'banana']);

        fireEvent.click(optionEl('All'));
        await flush();
        expect(calls[calls.length - 1]).toEqual(['apple', 'orange', 'banana']);
      });
    });
  });
});
