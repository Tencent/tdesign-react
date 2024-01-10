import React from 'react';
import { render } from '@test/utils';
import Descriptions from '../index';
import { SizeEnum } from '../../common';

const { DescriptionsItem } = Descriptions;

const items = [
  {
    label: 'Name',
    content: 'TDesign',
  },
  {
    label: 'Telephone Number',
    content: '139****0609',
  },
  {
    label: 'Area',
    content: 'China Tencent Headquarters',
  },
  {
    label: 'Address',
    content: 'Shenzhen Penguin Island D1 4A Mail Center',
  },
];

describe('Descriptions 组件测试', () => {
  // base
  test('base', () => {
    const { container } = render(<Descriptions items={items} title="Shipping address" />);

    expect(container.querySelector('.t-descriptions')).toBeInTheDocument();
  });

  // bordered
  test('bordered', () => {
    const { container } = render(<Descriptions items={items} title="Shipping address" bordered />);

    expect(container.querySelector('.t-descriptions__body--border')).toBeTruthy();
  });

  // colon
  test('colon', () => {
    const { container } = render(<Descriptions items={items} title="Shipping address" bordered colon />);

    expect(container.querySelector('.t-descriptions__label')).toHaveTextContent(':');
  });

  // column
  test('column=2', () => {
    const { container } = render(<Descriptions items={items} title="Shipping address" bordered colon />);

    const tbody = container.querySelector('tbody');

    // 检查 tbody 下面是否只有 2 个 tr 元素
    expect(tbody.querySelectorAll('tr')).toHaveLength(2);

    const secondTr = tbody.querySelectorAll('tr')[1];

    // 检查第 2 个 tr 元素中是否只有 4 个 td 元素
    expect(secondTr.querySelectorAll('td')).toHaveLength(4);

    // 检查第 2 个 tr 元素中的第 4 个 td 元素是否具有 colspan 属性，并检查其值是否为 1
    expect(secondTr.querySelectorAll('td')[3].getAttribute('colspan')).toBe('1');
  });

  test('column:4', () => {
    const { container } = render(<Descriptions items={items} column={4} title="Shipping address" bordered colon />);

    const tbody = container.querySelector('tbody');

    // 检查 tbody 下面是否只有 1 个 tr 元素
    expect(tbody.querySelectorAll('tr')).toHaveLength(1);

    const firstTr = tbody.querySelectorAll('tr')[0];

    // 检查第 1 个 tr 元素中是否只有 8 个 td 元素
    expect(firstTr.querySelectorAll('td')).toHaveLength(8);

    // 检查第 2 个 tr 元素中的第 4 个 td 元素是否具有 colspan 属性，并检查其值是否为 1
    expect(firstTr.querySelectorAll('td')[7].getAttribute('colspan')).toBe('1');
  });

  // custom-style
  test('custom-style', () => {
    const customLabelClassName: React.CSSProperties = {
      width: '100px',
      textAlign: 'left',
    };
    const customContentClassName: React.CSSProperties = {
      textAlign: 'center',
    };

    const { container } = render(
      <Descriptions
        items={items}
        title="Shipping address"
        bordered
        colon
        labelStyle={customLabelClassName}
        contentStyle={customContentClassName}
      />,
    );

    expect(container.querySelector('.t-descriptions__label')).toHaveStyle('width: 100px; text-align: left;');
    expect(container.querySelector('.t-descriptions__content')).toHaveStyle('text-align: center;');
  });

  // direction
  test('layout=horizontal columns=3', () => {
    const { container } = render(<Descriptions items={items} column={3} title="Shipping address" bordered colon />);
    const tbody = container.querySelector('tbody');

    // 检查 tbody 下面是否只有 2 个 tr 元素
    expect(tbody.querySelectorAll('tr')).toHaveLength(2);

    // 检查第 1 个 tr 元素中是否只有 6 个 td 元素
    const firstTr = tbody.querySelectorAll('tr')[0];
    expect(firstTr.querySelectorAll('td')).toHaveLength(6);

    // 检查第 2 个 tr 元素中是否只有 2 个 td 元素
    const secondTr = tbody.querySelectorAll('tr')[1];
    expect(secondTr.querySelectorAll('td')).toHaveLength(2);

    // 检查第 2 个 tr 元素中的第 2 个 td 元素是否具有 colspan 属性，并检查其值是否为 5
    const secondTrTd = secondTr.querySelectorAll('td')[1];
    expect(secondTrTd.getAttribute('colspan')).toBe('5');
  });

  // vertical
  test('layout=vertical columns=3', () => {
    const { container } = render(
      <Descriptions items={items} column={3} layout="vertical" title="Shipping address" bordered colon />,
    );
    const tbody = container.querySelector('tbody');

    // 检查 tbody 下面是否只有 4 个 tr 元素
    expect(tbody.querySelectorAll('tr')).toHaveLength(4);

    // 检查第 1 个 tr 元素中是否只有 2 个 td 元素
    const firstTr = tbody.querySelectorAll('tr')[0];
    expect(firstTr.querySelectorAll('td')).toHaveLength(2);

    // 检查第 3 个 tr 元素中是否只有 2 个 td 元素
    const thirdTr = tbody.querySelectorAll('tr')[2];
    expect(thirdTr.querySelectorAll('td')).toHaveLength(2);

    // 检查第 3 个 tr 元素中的第 1 个 td 元素是否具有 colspan 属性，并检查其值是否为 1
    const thirdTrTd = thirdTr.querySelectorAll('td')[0];
    expect(thirdTrTd.getAttribute('colspan')).toBe('1');
  });

  //  itemLayout=vertical
  it('itemLayout=vertical', () => {
    const { container } = render(
      <Descriptions items={items} column={3} itemLayout="vertical" title="Shipping address" bordered colon />,
    );

    const tbody = container.querySelector('tbody');
    // 检查 tbody 下面是否只有 4 个 tr 元素
    expect(tbody.querySelectorAll('tr')).toHaveLength(4);

    // 检查第 1 个 tr 元素中是否只有 3 个 td 元素
    const firstTr = tbody.querySelectorAll('tr')[0];
    expect(firstTr.querySelectorAll('td')).toHaveLength(3);

    // 检查第 3 个 tr 元素中是否只有 1 个 td 元素
    const thirdTr = tbody.querySelectorAll('tr')[2];
    expect(thirdTr.querySelectorAll('td')).toHaveLength(1);

    // 检查第 3 个 tr 元素中的第 1 个 td 元素是否具有 colspan 属性，并检查其值是否为 3
    const thirdTrTd = thirdTr.querySelectorAll('td')[0];
    expect(thirdTrTd.getAttribute('colspan')).toBe('3');
  });

  //  layout=vertical itemLayout=vertical
  it('layout=vertical itemLayout=vertical', () => {
    const { container } = render(
      <Descriptions
        items={items}
        column={3}
        layout="vertical"
        itemLayout="vertical"
        title="Shipping address"
        bordered
        colon
      />,
    );

    const tbody = container.querySelector('tbody');
    // 检查 tbody 下面是否只有 8 个 tr 元素
    expect(tbody.querySelectorAll('tr')).toHaveLength(8);

    // 检查第 1 个 tr 元素中是否只有 1 个 td 元素
    const firstTr = tbody.querySelectorAll('tr')[0];
    expect(firstTr.querySelectorAll('td')).toHaveLength(1);

    // 检查第 7 个 tr 元素中是否只有 1 个 td 元素
    const thirdTr = tbody.querySelectorAll('tr')[2];
    expect(thirdTr.querySelectorAll('td')).toHaveLength(1);

    // 检查第 7 个 tr 元素中的第 1 个 td 元素是否具有 colspan 属性，并检查其值是否为 1
    const thirdTrTd = thirdTr.querySelectorAll('td')[0];
    expect(thirdTrTd.getAttribute('colspan')).toBe('1');
  });

  // size
  test(':size', () => {
    const sizeList: SizeEnum[] = ['small', 'medium', 'large'];
    sizeList.forEach((size) => {
      const { container } = render(<Descriptions items={items} size={size} title="Shipping address" bordered colon />);
      const body = container.querySelector('.t-descriptions__body');
      expect(body).toHaveClass(`t-size-${size.slice(0, 1)}`);
    });
  });

  // jsx
  test('jsx and DescriptionsItem span', () => {
    const { container } = render(
      <Descriptions>
        <DescriptionsItem label="Name">TDesign</DescriptionsItem>
        <DescriptionsItem label="Telephone Number">139****0609</DescriptionsItem>
        <DescriptionsItem label="Area">China Tencent Headquarters</DescriptionsItem>
        <DescriptionsItem label="Address" content="test" span={2}>
          Shenzhen Penguin Island D1 4A Mail Center
        </DescriptionsItem>
      </Descriptions>,
    );

    expect(container.querySelector('.t-descriptions')).toBeInTheDocument();
  });

  // props jsx
  test('props jsx', () => {
    const itemsProps = [
      { label: 'Name', content: 'TDesign' },
      { label: <button>Telephone Number</button>, content: '139****0609' },
      { label: 'Area', content: <h3>China Tencent Headquarters</h3> },
      { label: <i>Address</i>, content: <mark> Shenzhen Penguin Island D1 4A Mail Center</mark> },
    ];
    const { container } = render(<Descriptions items={itemsProps} title={'Shipping address'}></Descriptions>);

    expect(container.querySelector('.t-descriptions')).toBeInTheDocument();
  });
});
