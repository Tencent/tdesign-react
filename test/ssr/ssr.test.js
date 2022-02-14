import glob from 'glob';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';

function ssrSnapshotTest() {
  const files = glob.sync('./src/**/_example/**.*sx');
  describe('ssr snapshot test', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2021-12-31').getTime());
      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useLayoutEffect: jest.requireActual('react').useEffect, // mock uselayout in ssr
      }));
      // ReactDOM.createPortal = jest.fn((element) => element); // mock createPortal in ssr
    });
    afterEach(() => {
      // ReactDOM.createPortal.mockClear();
    });
    files.forEach((file) => {
      if (file.indexOf('temp') > -1) {
        return;
      }
      it(`renders ${file} correctly`, async () => {
        const demo = require(`../.${file}`);
        const RealDemoComp = demo.default ? demo.default : demo;
        const ElementImageHtml = renderToString(<RealDemoComp />);
        expect(ElementImageHtml).toMatchSnapshot();
      }, 2000);
    });
  });
}

ssrSnapshotTest();
