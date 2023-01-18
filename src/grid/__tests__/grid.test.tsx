import React from 'react';
import { render } from '@test/utils';
import Row from '../Row';
import Col from '../Col';

describe('Grid 组件测试', () => {
  test('Grid ', async () => {
    window.innerWidth = 1500;
    const { container } = render(
      <Row gutter={12}>
        <Col></Col>
      </Row>,
    );
    // 校验默认className
    const defaultClass = ['t-row'];
    expect(container.firstChild).toHaveClass(...defaultClass);
  });

  test('Row gutter', async () => {
    // 校验默认className
    const defaultClass = ['t-row'];
    window.innerWidth = 1300;

    // number
    const { container: container1 } = render(
      <Row gutter={12}>
        <Col span={1}></Col>
      </Row>,
    );

    // Array<number>
    const { container: container2 } = render(
      <Row gutter={[6, 6]}>
        <Col span={2}></Col>
      </Row>,
    );

    // Array<GutterObject>
    const { container: container3 } = render(
      <Row
        gutter={[
          { xs: 4, sm: 8, md: 12 },
          { xs: 4, sm: 8, md: 12 },
        ]}
      >
        <Col span={3}></Col>
      </Row>,
    );

    // Object
    const { container: container4 } = render(
      <Row gutter={{ xs: 4, sm: 8, md: 12 }}>
        <Col span={4}></Col>
      </Row>,
    );

    const col1 = container1.querySelector('.t-col-1');
    expect(col1).not.toBeNull();
    const col2 = container2.querySelector('.t-col-2');
    expect(col2).not.toBeNull();
    const col3 = container3.querySelector('.t-col-3');
    expect(col3).not.toBeNull();
    const col4 = container4.querySelector('.t-col-4');
    expect(col4).not.toBeNull();

    expect(container1.firstChild).toHaveClass(...defaultClass);
    expect(container2.firstChild).toHaveClass(...defaultClass);
    expect(container3.firstChild).toHaveClass(...defaultClass);
    expect(container4.firstChild).toHaveClass(...defaultClass);
  });

  test('Col flex', async () => {
    window.innerWidth = 800;
    // number
    const { container: container1 } = render(
      <Row>
        <Col flex={2}>
          <div>2 / 5</div>
        </Col>
        <Col flex={3}>
          <div>3 / 5</div>
        </Col>
      </Row>,
    );

    // string
    const { container: container2 } = render(
      <Row gutter={12}>
        <Col flex={'100px'}>
          <div>2 / 5</div>
        </Col>
        <Col flex={'100px'}>
          <div>3 / 5</div>
        </Col>
      </Row>,
    );

    // auto
    const { container: container3 } = render(
      <Row gutter={12}>
        <Col flex={'auto'}>
          <div>2 / 5</div>
        </Col>
        <Col flex={'auto'}>
          <div>3 / 5</div>
        </Col>
      </Row>,
    );
    expect(container1.firstChild.firstChild).toHaveStyle({ flex: '2 2 auto' });
    expect(container2.firstChild.firstChild).toHaveStyle({ flex: '0 0 100px' });
    expect(container3.firstChild.firstChild).toHaveStyle({ flexBasis: 'auto' });
  });
});
