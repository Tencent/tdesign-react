import React from 'react';
import { testExamples, render } from '@test/utils';
import Anchor from '../Anchor';

const { AnchorItem } = Anchor;

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Anchor', () => {
  const rootTestID = 'anchorRoot';
  const childTestID = 'anchorChild';
  it('title props', () => {
    const el = (
      <Anchor data-testid={rootTestID}>
        <AnchorItem href="#基础锚点" title="基础锚点" data-testid={childTestID} />
      </Anchor>
    );
    const wrapper = render(el);
    const root = wrapper.getByTestId(rootTestID);
    const title = wrapper.getByText('基础锚点');
    expect(root).toContainElement(title);
  });
});
