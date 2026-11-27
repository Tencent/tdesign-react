import React from 'react';
import { act, render } from '@test/utils';

import { Dialog } from '..';

const flush = (ms = 0) =>
  act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });

describe('Dialog', () => {
  describe('scenarios', () => {
    describe('lock style', () => {
      beforeEach(() => {
        document.head.querySelectorAll('style[data-id^="td_dialog_"]').forEach((el) => el.remove());
      });

      it('keeps the scroll lock when the dialog reopens within the close delay', async () => {
        const dialog = (visible: boolean) => (
          <Dialog visible={visible} preventScrollThrough mode="modal" header="t" body="b" />
        );
        const { rerender } = render(dialog(true));
        await flush(20);
        expect(document.head.querySelectorAll('style[data-id^="td_dialog_"]').length).toBe(1);

        rerender(dialog(false));
        await flush(30);

        rerender(dialog(true));
        await flush(250);

        expect(document.head.querySelectorAll('style[data-id^="td_dialog_"]').length).toBe(1);
      });

      it('removes the scroll lock after the dialog closes and stays closed', async () => {
        const dialog = (visible: boolean) => (
          <Dialog visible={visible} preventScrollThrough mode="modal" header="t" body="b" />
        );
        const { rerender } = render(dialog(true));
        await flush(20);
        expect(document.head.querySelectorAll('style[data-id^="td_dialog_"]').length).toBe(1);

        rerender(dialog(false));
        await flush(250);

        expect(document.head.querySelectorAll('style[data-id^="td_dialog_"]').length).toBe(0);
      });
    });
  });
});
