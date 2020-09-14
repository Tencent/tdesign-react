import React from 'react';
import { testExamples, render, getByText, fireEvent } from '@test/utils';
import Tag from '../Tag';
import CheckTag from '../CheckTag';
import ClosableTag from '../_example/ClosableTag';
import DisableTag from '../_example/DisableTag';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Tag 组件测试', () => {
  test('tag 默认的样式和class', async () => {
    const tagTitle = '默认标签';
    const { container } = render(<Tag>{tagTitle}</Tag>);

    // span标签 内容正常显示
    getByText(container, (_, element) => element.tagName.toLowerCase() === 'span');

    // 校验默认className
    const defaultClass = ['t-tag', 't-tag--dark', 't-tag--middle', 't-tag--square'];
    expect(container.firstChild).toHaveClass(...defaultClass);
  });

  test('ClosableTag 点击后关闭按钮', async () => {
    const tagRegExp = /点击关闭/;

    const { queryAllByText, getByText } = render(<ClosableTag></ClosableTag>);
    // 点击i标签后，关闭一个，3个变2个
    expect(queryAllByText(tagRegExp).length).toEqual(3);
    fireEvent.click(getByText('点击关闭0').querySelector('i'));
    expect(queryAllByText(tagRegExp).length).toEqual(2);
  });

  test('Tag  文字超长截断', async () => {
    const tagLabel = '超长省略文本标签超长省略文本标签';

    const { container } = render(<Tag maxWidth={150}>{tagLabel}</Tag>);
    // 最长宽度为150
    expect(container.firstChild).toHaveStyle({ 'max-width': '150px' });
  });
});

describe('CheckTag 组件测试', () => {
  test('CheckTag 选中后变色', async () => {
    const testTagText = '标签1';
    const checkedClass = 't-tag--checked';

    const { getByText, container } = render(<CheckTag>{testTagText}</CheckTag>);
    // 点击后变色
    expect(container.firstChild).not.toHaveClass(checkedClass);
    fireEvent.click(getByText(testTagText));
    expect(container.firstChild).toHaveClass(checkedClass);
  });

  test('Tag 无效时不能点击', async () => {
    const { getByText } = render(<DisableTag />);

    fireEvent.click(getByText('有效标签'));
    fireEvent.click(getByText('无效标签'));

    expect(getByText('有效已选中')).not.toBeNull();
  });
});
