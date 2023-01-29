import React from 'react';
import { render, fireEvent } from '@test/utils';

import { Collapse } from '..';
import { TdCollapseProps, TdCollapsePanelProps } from '../type';

const { Panel } = Collapse;

type TestComponentProps = {
  collapse?: TdCollapseProps;
  panel?: TdCollapsePanelProps;
};
const panelContent =
  '这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。';
const CollapseTestComponent = (props: TestComponentProps) => (
  <Collapse {...props?.collapse}>
    <Panel {...props?.panel}>{panelContent}</Panel>
  </Collapse>
);

describe('Collapse Unit Test', () => {
  // 渲染测试
  test('create', async () => {
    const { container, queryByText } = render(<CollapseTestComponent />);
    expect(container.firstElementChild.classList.contains('t-collapse')).toBeTruthy();
    expect(queryByText(panelContent)).toBeInTheDocument();
  });

  // 测试点击事件
  test('click event', async () => {
    const CollapseTest = () => (
      <Collapse defaultExpandAll defaultValue={['default']}>
        <Panel header="这是一个折叠标题" value="default">
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </Panel>
      </Collapse>
    );
    const { container } = render(<CollapseTest />);

    // 获取 element
    const element = container.querySelector('.t-collapse-panel__header');
    expect(element).not.toBeNull();

    // 默认展开，点击关闭
    fireEvent.click(element);
    expect(document.querySelector('.t-collapse-panel__body--collapsed')).toBeNull();

    // 当前关闭，点击展开
    fireEvent.click(element);
    expect(document.querySelector('.t-collapse-panel__body--collapsed')).not.toBeNull();
  });
});
