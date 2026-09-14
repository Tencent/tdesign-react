import React, { useEffect, useState } from 'react';
import { act, fireEvent, mockElementSizes, mockIntersectionObserver, render, vi } from '@test/utils';

import Radio, { RadioGroup } from '..';

function getRadioGroupDefaultMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  const options = [
    { label: 'Radio1', value: 1 },
    { label: 'Radio2', value: '2', allowUncheck: true },
    { label: <span className="custom-node">Radio3</span>, value: 3 },
    { label: 'Radio4', value: 4, disabled: true },
  ];
  return render(<RadioGroup options={options} {...props} {...events} />);
}

function getRadioGroupKidsMount(props: Record<string, any> = {}, events: Record<string, any> = {}) {
  return render(
    <RadioGroup {...props} {...events}>
      <Radio value={1}>Radio1</Radio>
      <Radio value="2" allowUncheck>
        Radio2
      </Radio>
      <Radio value="3">Radio3</Radio>
      <Radio value="4" disabled>
        Radio4
      </Radio>
    </RadioGroup>,
  );
}

describe('RadioGroup', () => {
  describe('props', () => {
    test('allowUncheck', () => {
      const onChangeFn = vi.fn();
      const { container } = getRadioGroupDefaultMount({ value: 1, allowUncheck: true }, { onChange: onChangeFn });
      fireEvent.click(container.querySelector('.t-radio'));
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe(undefined);
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
    });

    test('allowUncheck with kids', () => {
      const onChangeFn = vi.fn();
      const { container } = getRadioGroupKidsMount({ value: 1, allowUncheck: true }, { onChange: onChangeFn });
      fireEvent.click(container.querySelector('.t-radio'));
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe(undefined);
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
    });

    test('disabled is equal true', () => {
      const { container } = getRadioGroupDefaultMount({ disabled: true });
      expect(container.querySelectorAll('.t-radio.t-is-disabled').length).toBe(4);
      expect(container).toMatchSnapshot();
    });

    test('disabled is equal true with kids', () => {
      const { container } = getRadioGroupKidsMount({ disabled: true });
      expect(container.querySelectorAll('.t-radio.t-is-disabled').length).toBe(4);
      expect(container).toMatchSnapshot();
    });

    test('disabled radio can not trigger change', () => {
      const onChangeFn = vi.fn();
      const { container } = getRadioGroupDefaultMount({ disabled: true }, { onChange: onChangeFn });
      fireEvent.click(container.querySelector('.t-radio'));
      expect(onChangeFn).not.toHaveBeenCalled();
    });

    test('disabled radio can not trigger change with kids', () => {
      const onChangeFn = vi.fn();
      const { container } = getRadioGroupKidsMount({ disabled: true }, { onChange: onChangeFn });
      fireEvent.click(container.querySelector('.t-radio'));
      expect(onChangeFn).not.toHaveBeenCalled();
    });

    test(`name is equal to 'custom-radio-name'`, () => {
      const { container } = getRadioGroupDefaultMount({
        name: 'custom-radio-name',
      });
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('name')).toBe('custom-radio-name');
      expect(container).toMatchSnapshot();
    });

    test(`name is equal to 'custom-radio-name' with kids`, () => {
      const { container } = getRadioGroupKidsMount({
        name: 'custom-radio-name',
      });
      const domWrapper = container.querySelector('input');
      expect(domWrapper.getAttribute('name')).toBe('custom-radio-name');
      expect(container).toMatchSnapshot();
    });

    test('options works fine. `{".t-radio":4}` should exist', () => {
      const { container } = getRadioGroupDefaultMount();
      expect(container.querySelectorAll('.t-radio').length).toBe(4);
    });

    test('options works fine. `".custom-node"` should exist', () => {
      const { container } = getRadioGroupDefaultMount();
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('options works fine. `{".t-radio.t-is-disabled":1}` should exist', () => {
      const { container } = getRadioGroupDefaultMount();
      expect(container.querySelectorAll('.t-radio.t-is-disabled').length).toBe(1);
    });

    test(`value is equal to '2'`, () => {
      const { container } = getRadioGroupDefaultMount({ value: '2' });
      const domWrapper = container.querySelector('.t-radio.t-is-checked input');
      expect(domWrapper.value).toBe('2');
    });

    test(`value is equal to '2' with kids`, () => {
      const { container } = getRadioGroupKidsMount({ value: '2' });
      const domWrapper = container.querySelector('.t-radio.t-is-checked input');
      expect(domWrapper.value).toBe('2');
    });

    const variantClassNameList = ['t-radio-group__outline', 't-radio-group--primary-filled', 't-radio-group--filled'];
    (['outline', 'primary-filled', 'default-filled'] as const).forEach((item, index) => {
      test(`variant is equal to ${item}`, () => {
        const { container } = render(<RadioGroup variant={item}></RadioGroup>);
        expect(container.firstChild).toHaveClass(variantClassNameList[index]);
      });
    });

    test('value', () => {
      const { container } = render(
        <Radio.Group value="gz">
          <Radio value="gz">广州</Radio>
          <Radio value="sz" disabled>
            深圳
          </Radio>
        </Radio.Group>,
      );
      expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
    });

    test('variant', () => {
      const { container } = render(
        <Radio.Group
          variant="primary-filled"
          defaultValue="北京"
          options={[{ value: '上海', label: '上海' }, { value: '广州', label: '广州', disabled: true }, '北京', 1]}
        />,
      );
      expect(container.firstChild.firstChild).toHaveClass('t-radio');
    });

    test('value is string', () => {
      const { container } = render(<Radio.Group options={['北京', '广州']} value="北京"></Radio.Group>);
      expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
    });

    test('value is number', () => {
      const { container } = render(<Radio.Group options={[1, 2]} value={1}></Radio.Group>);
      expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
    });

    test('defaultValue', () => {
      const { container } = render(
        <Radio.Group defaultValue="gz">
          <Radio value="gz">广州</Radio>
          <Radio value="sz" disabled>
            深圳
          </Radio>
        </Radio.Group>,
      );
      expect(container.firstChild.firstChild).toHaveClass('t-is-checked');
    });

    test('theme radio', () => {
      const { container } = render(
        <Radio.Group
          variant="primary-filled"
          defaultValue="北京"
          options={[{ value: '上海', label: '上海' }, { value: '广州', label: '广州', disabled: true }, '北京', 1]}
        />,
      );
      expect(container.firstChild.firstChild).toHaveClass('t-radio');
    });

    test('theme button', () => {
      const { container } = render(
        <Radio.Group
          variant="primary-filled"
          theme="button"
          defaultValue="北京"
          options={[{ value: '上海', label: '上海' }, { value: '广州', label: '广州', disabled: true }, '北京', 1]}
        />,
      );
      expect(container.firstChild.firstChild).toHaveClass('t-radio-button');
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const fn = vi.fn();
      const { container } = render(
        <Radio.Group defaultValue="sz" onChange={fn}>
          <Radio value="gz">广州</Radio>
          <Radio value="sz" disabled>
            深圳
          </Radio>
        </Radio.Group>,
      );
      fireEvent.click(container.firstChild.firstChild);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('scenarios', () => {
    test('options', () => {
      const { container } = render(
        <Radio.Group
          defaultValue="北京"
          options={[{ value: '上海', label: '上海' }, { value: '广州', label: '广州', disabled: true }, '北京', 1]}
        ></Radio.Group>,
      );
      fireEvent.click(container.firstChild.lastChild);
      expect(container.firstChild.lastChild).toHaveClass('t-is-checked');
    });

    describe('primary-filled bg-block', () => {
      const MOCK_SIZES = [
        { selector: '.t-radio-group', width: 300, height: 40, left: 0, top: 0 },
        {
          selector: '.t-radio-button:nth-child(1)',
          width: 60,
          height: 32,
          left: 4,
          top: 4,
        },
        {
          selector: '.t-radio-button:nth-child(2)',
          width: 60,
          height: 32,
          left: 68,
          top: 4,
        },
        {
          selector: '.t-radio-button:nth-child(3)',
          width: 60,
          height: 32,
          left: 132,
          top: 4,
        },
      ];

      // 根据选项索引获取对应按钮的尺寸数据
      const getButtonSize = (optionIndex: number) => {
        const buttonSelector = `.t-radio-button:nth-child(${optionIndex + 1})`;
        return MOCK_SIZES.find((size) => size.selector === buttonSelector);
      };

      const mockRadioGroupSizes = () => mockElementSizes(MOCK_SIZES);

      test('bg-block not rendered when value changes to empty', async () => {
        const cleanup = mockRadioGroupSizes();

        const TestComponent = () => {
          const [value, setValue] = React.useState<string>('1');
          return (
            <>
              <Radio.Group variant="primary-filled" theme="button" value={value} options={['0', '1', '2']} />
              <button data-testid="clear-btn" onClick={() => setValue('')}>
                Clear
              </button>
            </>
          );
        };

        const { container, getByTestId } = render(<TestComponent />);

        const bgBlock = container.querySelector('.t-radio-group__bg-block') as HTMLElement;
        expect(bgBlock).toBeInTheDocument();

        const expectedSize = getButtonSize(1);
        expect(bgBlock.style.left).toBe(`${expectedSize.left}px`);
        expect(bgBlock.style.top).toBe(`${expectedSize.top}px`);
        expect(bgBlock.style.width).toBe(`${expectedSize.width}px`);
        expect(bgBlock.style.height).toBe(`${expectedSize.height}px`);

        await act(async () => {
          fireEvent.click(getByTestId('clear-btn'));
        });

        expect(container.querySelector('.t-radio-group__bg-block')).not.toBeInTheDocument();

        cleanup();
      });

      test('bg-block updates when options change dynamically', async () => {
        const cleanup = mockRadioGroupSizes();

        const TestComponent = () => {
          const [value, setValue] = useState<string>('1');
          const [options, setOptions] = useState<string[]>(['0']);

          useEffect(() => {
            const timer = setTimeout(() => {
              setOptions(['0', '1', '2']);
            }, 100);
            return () => clearTimeout(timer);
          }, []);

          return (
            <Radio.Group<string>
              variant="primary-filled"
              theme="button"
              value={value}
              options={options}
              onChange={(val) => setValue(val)}
            />
          );
        };

        const { container } = render(<TestComponent />);

        expect(container.querySelector('.t-radio-group__bg-block')).not.toBeInTheDocument();

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 150));
        });

        const bgBlock = container.querySelector('.t-radio-group__bg-block') as HTMLElement;
        expect(bgBlock).toBeInTheDocument();

        const expectedSize = getButtonSize(1);
        expect(bgBlock.style.left).toBe(`${expectedSize.left}px`);
        expect(bgBlock.style.top).toBe(`${expectedSize.top}px`);
        expect(bgBlock.style.width).toBe(`${expectedSize.width}px`);
        expect(bgBlock.style.height).toBe(`${expectedSize.height}px`);

        cleanup();
      });

      test('bg-block updates when component becomes visible from hidden', async () => {
        const cleanup = mockRadioGroupSizes();

        let observerCallback: Function | null = null;
        mockIntersectionObserver(
          {},
          {
            observe: (element: Element, callback: Function) => {
              observerCallback = callback;
              if (!element.closest('[hidden]')) {
                callback([{ isIntersecting: true, target: element }]);
              }
            },
          },
        );

        const TestComponent = () => {
          const [activeNav, setActiveNav] = useState('nav1');
          const [value, setValue] = useState('1');

          const navList = [
            {
              id: 'nav1',
              component: <div>First Nav Content</div>,
            },
            {
              id: 'nav2',
              component: (
                <Radio.Group
                  variant="primary-filled"
                  theme="button"
                  value={value}
                  options={['0', '1', '2']}
                  onChange={(val) => setValue(val)}
                />
              ),
            },
          ];

          return (
            <>
              {navList.map((nav) => (
                <div key={nav.id}>
                  <button data-testid={`nav-${nav.id}`} onClick={() => setActiveNav(nav.id)}>
                    {nav.id}
                  </button>
                  <div data-testid={`content-${nav.id}`} hidden={nav.id !== activeNav}>
                    {nav.component}
                  </div>
                </div>
              ))}
            </>
          );
        };

        const { container, getByTestId } = render(<TestComponent />);

        await act(async () => {
          fireEvent.click(getByTestId('nav-nav2'));
        });

        if (observerCallback) {
          await act(async () => {
            const radioGroup = container.querySelector('.t-radio-group');
            observerCallback([{ isIntersecting: true, target: radioGroup }]);
          });
        }

        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        });

        const bgBlock = container.querySelector('.t-radio-group__bg-block') as HTMLElement;
        expect(bgBlock).toBeInTheDocument();

        const expectedSize = getButtonSize(1);
        expect(bgBlock.style.left).toBe(`${expectedSize.left}px`);
        expect(bgBlock.style.top).toBe(`${expectedSize.top}px`);
        expect(bgBlock.style.width).toBe(`${expectedSize.width}px`);
        expect(bgBlock.style.height).toBe(`${expectedSize.height}px`);

        cleanup();
      });
    });
  });
});
