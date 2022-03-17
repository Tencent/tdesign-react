/* eslint-disable */
import glob from 'glob';
import React from 'react';
import { renderToString } from 'react-dom/server';

function ssrSnapshotTest() {
  const files = glob.sync('./src/**/_example/**.*sx');
  describe('ssr snapshot test', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2021-12-31').getTime());
    });
    files.forEach((file) => {
      if (file.indexOf('temp') > -1) {
        return;
      }
      it(`renders ${file} correctly`, async () => {
        const demo = require(`../.${file}`);
        const RealDemoComp = demo.default ? demo.default : demo;
        if (typeof RealDemoComp === 'function') {
          const ElementImageHtml = renderToString(<RealDemoComp />);
          expect(ElementImageHtml).toMatchSnapshot();
        }
      }, 2000);
    });
  });
}

ssrSnapshotTest();
