import React from 'react';
import { testExamples, render } from '@test/utils';
import Row from '../Row';
import Col from '../Col';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Grid 组件测试', () => {
  test('Grid ', async () => {
    const { container } = render(
      <Row>
        <Col></Col>
      </Row>,
    );

    // 校验默认className
    const defaultClass = ['t-row'];
    expect(container.firstChild).toHaveClass(...defaultClass);
  });
});
