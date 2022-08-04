/* eslint-disable */
import * as fs from 'fs';
import * as path from 'path';
import React, { FunctionComponent, ComponentClass } from 'react';
import { render } from '@testing-library/react';

export interface TestExampleOverrides {
  [exampleFileName: string]: (Component: FunctionComponent<unknown> | ComponentClass<unknown>) => void | Promise<void>;
}

/**
 * 测试组件的所有 Example
 */
export function testExamples(dirname: string, overrides: TestExampleOverrides = {}) {
  const exampleDir = path.resolve(dirname, '../_example');
  if (!fs.existsSync(exampleDir)) {
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const exampleFilename of fs.readdirSync(exampleDir)) {
    if (!/\.(j|t)sx$/.test(exampleFilename)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const Example = require(path.join(exampleDir, exampleFilename)).default;
    if (Example) {
      // prettier-ignore
      const runner = overrides[exampleFilename]
        || (() => {
          const { asFragment } = render(React.createElement(Example));
          expect(asFragment()).toMatchSnapshot();
        });

      test(exampleFilename, runner);
    }
  }
}
