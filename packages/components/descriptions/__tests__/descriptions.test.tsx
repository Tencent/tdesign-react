import React from 'react';
import { render, screen } from '@test/utils';

import Descriptions from '../index';

import type { SizeEnum } from '../../common';

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

describe('Descriptions', () => {
  describe('props', () => {
    // bordered
    test('bordered', () => {
      const { container } = render(<Descriptions items={items} title="Shipping address" bordered />);

      expect(container.querySelector('.t-descriptions__body--border')).toBeTruthy();
    });

    // colon
    test('colon', () => {
      const { container } = render(<Descriptions items={items} title="Shipping address" bordered colon />);

      expect(container.querySelector('.t-descriptions__label')).toHaveTextContent('：');
    });

    // size
    test('size', () => {
      const sizeList: SizeEnum[] = ['small', 'medium', 'large'];
      sizeList.forEach((size) => {
        const { container } = render(
          <Descriptions items={items} size={size} title="Shipping address" bordered colon />,
        );
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
    test('items[array<TdDescriptionsItemProps>]', () => {
      const itemsProps = [
        { label: 'Name', content: 'TDesign' },
        { label: <button>Telephone Number</button>, content: '139****0609' },
        { label: 'Area', content: <h3>China Tencent Headquarters</h3> },
        {
          label: <i>Address</i>,
          content: <mark> Shenzhen Penguin Island D1 4A Mail Center</mark>,
        },
      ];
      const { container } = render(<Descriptions items={itemsProps} title={'Shipping address'}></Descriptions>);

      expect(container.querySelector('.t-descriptions')).toBeInTheDocument();
    });

    test('title', () => {
      const { container } = render(<Descriptions items={items} title="Shipping address" />);
      expect(container.querySelector('.t-descriptions')).toBeInTheDocument();
    });

    test('column', () => {
      const borderedProps = {
        items,
        title: 'Shipping address',
        bordered: true,
        colon: true,
      } as const;

      const { container: defaultContainer } = render(<Descriptions {...borderedProps} />);
      const defaultTbody = defaultContainer.querySelector('tbody');
      expect(defaultTbody.querySelectorAll('tr')).toHaveLength(2);
      const defaultSecondTr = defaultTbody.querySelectorAll('tr')[1];
      expect(defaultSecondTr.querySelectorAll('td')).toHaveLength(4);
      expect(defaultSecondTr.querySelectorAll('td')[3].getAttribute('colspan')).toBe('1');

      const { container: singleRowContainer } = render(<Descriptions {...borderedProps} column={4} />);
      const singleRowTbody = singleRowContainer.querySelector('tbody');
      expect(singleRowTbody.querySelectorAll('tr')).toHaveLength(1);
      const singleRowTr = singleRowTbody.querySelectorAll('tr')[0];
      expect(singleRowTr.querySelectorAll('td')).toHaveLength(8);
      expect(singleRowTr.querySelectorAll('td')[7].getAttribute('colspan')).toBe('1');

      const { container: multiRowContainer } = render(<Descriptions {...borderedProps} column={3} />);
      const multiRowTbody = multiRowContainer.querySelector('tbody');
      expect(multiRowTbody.querySelectorAll('tr')).toHaveLength(2);
      const multiRowFirstTr = multiRowTbody.querySelectorAll('tr')[0];
      expect(multiRowFirstTr.querySelectorAll('td')).toHaveLength(6);
      const multiRowSecondTr = multiRowTbody.querySelectorAll('tr')[1];
      expect(multiRowSecondTr.querySelectorAll('td')).toHaveLength(2);
      expect(multiRowSecondTr.querySelectorAll('td')[1].getAttribute('colspan')).toBe('5');
    });

    test('labelStyle and contentStyle', () => {
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

    test('layout[vertical]', () => {
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

    test('itemLayout[vertical]', () => {
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

    test('layout[vertical] itemLayout[vertical]', () => {
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

    test('items with nested Descriptions content[TNode]', () => {
      const itemsContent = [
        {
          label: 'City',
          content: 'Shenzhen',
        },
        {
          label: 'Detail',
          content: 'Penguin Island D1 4A Mail Center',
        },
      ];

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
          content: <Descriptions items={itemsContent} labelStyle={{ background: '#f4f4f4' }} colon />,
        },
      ];
      render(<Descriptions items={items} title="Shipping address" bordered />);
      expect(screen.getByText('Shenzhen')).not.toBeNull();
      expect(screen.getByText('Shenzhen')).toBeInTheDocument();
    });
  });
});
