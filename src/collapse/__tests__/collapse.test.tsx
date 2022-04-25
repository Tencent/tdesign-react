import React from 'react';
import { testExamples, render } from '@test/utils';
import Collapse from '../Collapse';
import CollapsePanal from '../CollapsePanel';
import { TdCollapseProps, TdCollapsePanelProps } from '../type';

// 测试组件代码 Example 快照
testExamples(__dirname);

type TestComponentProps = {
  collapse?: TdCollapseProps;
  panel?: TdCollapsePanelProps;
};
const panelContent =
  '这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。';
const CollapseTestComponent = (props: TestComponentProps) => (
  <Collapse {...props?.collapse}>
    <CollapsePanal {...props?.panel}>{panelContent}</CollapsePanal>
  </Collapse>
);

describe('Collapse Unit Test', () => {
  test('create', async () => {
    const { container, queryByText } = render(<CollapseTestComponent />);
    expect(container.firstChild.classList.contains('t-collapse')).toBeTruthy();
    expect(queryByText(panelContent)).toBeInTheDocument();
  });
});
