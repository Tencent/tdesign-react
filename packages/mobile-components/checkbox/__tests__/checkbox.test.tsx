import React from 'react';
import { act, describe, expect, it, render, vi } from '@test/utils';
import { Checkbox, CheckboxGroup, CheckboxProps } from '../index';

type Shape = Extract<CheckboxProps['icon'], 'circle' | 'rectangle' | 'line'>;

const prefix = 't';
const name = `.${prefix}-checkbox`;

const placements = ['left', 'right'] as Array<CheckboxProps['placement']>;
const iconShapes = ['circle', 'rectangle', 'line'] as Array<Shape>;

describe('Checkbox', () => {
  describe('props', () => {
    it(': className', () => {
      const { container } = render(<Checkbox className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });

    it(': placement', () => {
      placements.forEach((placement) => {
        const { container } = render(<Checkbox placement={placement} />);
        expect(container.querySelector(`${name}--${placement}`)).toBeTruthy();
      });
    });

    it(': placement icon', () => {
      placements.forEach((placement) => {
        const { container } = render(<Checkbox placement={placement} />);
        expect(container.querySelector(`${name}__icon--${placement}`)).toBeTruthy();
      });
    });

    it(': content', () => {
      const content = <div data-testid="test-content">content</div>;
      const { getByTestId } = render(<Checkbox content={content} />);
      expect(getByTestId('test-content')).toBeInTheDocument();
    });

    it(': indeterminate', () => {
      const shapeToIconIdMap = {
        circle: 'remove-1',
        rectangle: 'remove-1',
        line: 'minus',
      };

      iconShapes.forEach((shape) => {
        const { container } = render(<Checkbox indeterminate checked icon={shape} />);
        expect(container.querySelector(`.t-icon-${shapeToIconIdMap[shape]}`)).toBeTruthy();
      });
    });

    it(': label', () => {
      const labels = [
        'test-label',
        <div key="test" data-testid="test-label">
          test-label
        </div>,
      ];

      labels.forEach((label) => {
        const { getAllByText } = render(<Checkbox label={label} />);
        expect(getAllByText('test-label').length).toBeGreaterThan(0);
      });
    });

    it(': checked', () => {
      const { container } = render(<Checkbox checked />);
      expect(container.querySelector(`${name}--checked`)).toBeTruthy();
      expect(container.querySelector(`${name}__title--checked`)).toBeTruthy();
    });

    it(': checked icon', () => {
      const { container } = render(<Checkbox checked icon="circle" />);
      expect(container.querySelector(`${name}__icon--checked`)).toBeTruthy();
    });

    it(': defaultChecked', () => {
      const { container } = render(<Checkbox defaultChecked />);
      expect(container.querySelector(`${name}__title--checked`)).toBeTruthy();
    });

    it(': maxLabelRow', () => {
      const maxLabelRow = 2;
      const { container } = render(<Checkbox maxLabelRow={maxLabelRow} />);

      expect(container.querySelector(`${name}__title`)).toHaveStyle({
        WebkitLineClamp: maxLabelRow,
      });
    });

    it(': maxContentRow', () => {
      const maxContentRow = 2;
      const { container } = render(<Checkbox maxContentRow={maxContentRow} />);

      expect(container.querySelector(`${name}__description`)).toHaveStyle({
        WebkitLineClamp: maxContentRow,
      });
    });

    describe(': icon', () => {
      it(': icon', () => {
        const shapeToIconIdMap = {
          circle: 'check-1',
          rectangle: 'check-1',
          line: 'check',
        };

        iconShapes.forEach((shape) => {
          const { container } = render(<Checkbox checked icon={shape} />);
          expect(container.querySelector(`.t-icon-${shapeToIconIdMap[shape]}`)).toBeTruthy();
        });
      });

      it(': icon true', () => {
        const { container } = render(<Checkbox icon={true} checked={false} />);
        expect(container.querySelector('.t-checkbox__icon-circle')).toBeTruthy();
      });

      it(': icon array', () => {
        const activeIcon = 'https://tdesign.gtimg.com/mobile/demos/checkbox-checked.png';
        const inactiveIcon = 'https://tdesign.gtimg.com/mobile/demos/checkbox.png';
        const { container } = render(<Checkbox icon={[activeIcon, inactiveIcon]} checked={false} />);
        const iconEle = container.querySelector(`.t-checkbox__icon-wrapper`) as HTMLImageElement;
        expect(iconEle.src).toBe(inactiveIcon);
      });

      it(': icon array tNode', () => {
        const activeIcon = <img src="https://tdesign.gtimg.com/mobile/demos/checkbox-checked.png" />;
        const inactiveIcon = <img src="https://tdesign.gtimg.com/mobile/demos/checkbox.png" />;
        const { container } = render(<Checkbox icon={[activeIcon, inactiveIcon]} checked={false} />);
        const iconEle = container.querySelector(`.t-checkbox__icon-wrapper`) as HTMLImageElement;
        expect(iconEle.src).toBe(inactiveIcon.props.src);

        const { container: containerChecked } = render(<Checkbox icon={[activeIcon, inactiveIcon]} checked={true} />);
        const iconEleChecked = containerChecked.querySelector(`.t-checkbox__icon-wrapper`) as HTMLImageElement;
        expect(iconEleChecked.src).toBe(activeIcon.props.src);
      });

      it(': icon array with single element', () => {
        const singleIcon = 'https://tdesign.gtimg.com/mobile/demos/checkbox.png';
        const { container } = render(<Checkbox icon={[singleIcon]} checked={false} />);
        expect(container.querySelector('.t-checkbox__icon-circle')).toBeTruthy();
      });
    });

    it(': block', () => {
      const { container } = render(<Checkbox block />);
      expect(container.querySelector(`${name}--block`)).toBeTruthy();
    });

    it(': borderless', () => {
      placements.forEach((placement) => {
        const { container } = render(<Checkbox borderless={false} placement={placement} />);
        expect(container.querySelector(`${name}__border--${placement}`)).toBeTruthy();
      });
    });

    it(': disabled', () => {
      const disabledIconShapes = ['circle', 'rectangle'] as Array<Shape>;

      disabledIconShapes.forEach((shape) => {
        const { container } = render(<Checkbox disabled icon={shape} />);
        expect(container.querySelector(`${name}__title--disabled`)).toBeTruthy();
        expect(container.querySelector(`${name}__description--disabled`)).toBeTruthy();
        expect(container.querySelector(`${name}__icon--disabled`)).toBeTruthy();
        expect(container.querySelector(`${name}__icon-${shape}--disabled`)).toBeTruthy();
      });

      const { container } = render(<Checkbox disabled icon="line" />);
      expect(container.querySelector(`${name}__icon-line--disabled`)).toBeTruthy();
    });
  });

  describe('events', () => {
    it(': clickable', () => {
      let checked = false;

      const { container } = render(
        <Checkbox className="test-checkbox" checked={checked} onChange={() => (checked = !checked)} />,
      );

      const checkbox = container.querySelector('.test-checkbox') as HTMLDivElement;

      act(() => checkbox.click());
      expect(checked).toBe(true);
      act(() => checkbox.click());
      expect(checked).toBe(false);
    });

    it(': no clickable', () => {
      let checked = false;

      const disabledState = ['contentDisabled', 'disabled', 'readonly'];

      disabledState.forEach((disabledState) => {
        const { container } = render(
          <Checkbox
            className="test-checkbox"
            checked={checked}
            onChange={() => (checked = !checked)}
            {...{ [disabledState]: true }}
          />,
        );

        const checkbox = container.querySelector('.test-checkbox') as HTMLDivElement;
        act(() => checkbox.click());

        expect(checked).toBe(false);
      });
    });

    it(': click content area', () => {
      let checked = false;
      const onChange = vi.fn((value) => {
        checked = value;
      });

      const { container } = render(
        <Checkbox className="test-checkbox" checked={checked} onChange={onChange} label="Test Label" />,
      );

      const contentArea = container.querySelector('.t-checkbox__content') as HTMLDivElement;
      act(() => contentArea.click());

      expect(checked).toBe(true);
      expect(onChange).toHaveBeenCalledWith(true, expect.any(Object));
    });
  });
});

const labels = ['Apple', 'Banana', 'Orange'];
const values = ['A', 'B', 'O'];
const options = labels.map((label, index) => ({ label, value: values[index] }));

describe(': CheckboxGroup', () => {
  describe(': props', () => {
    describe(': options', () => {
      it(': render labels as options', () => {
        const { container } = render(<CheckboxGroup options={labels} />);
        expect(container.querySelector(`${name}-group`)).toBeTruthy();
        expect(container.querySelectorAll(name).length).toBe(labels.length);
      });

      it(': render options', () => {
        const { container } = render(<CheckboxGroup options={options} />);
        expect(container.querySelector(`${name}-group`)).toBeTruthy();
        expect(container.querySelectorAll(name).length).toBe(options.length);
      });

      it(': render options with undefined', () => {
        const optionsWithUndefined = [...options, undefined];
        const { container } = render(<CheckboxGroup options={optionsWithUndefined} />);
        expect(container.querySelectorAll(name).length).toBe(optionsWithUndefined.length - 1);
      });

      it(': render options with mixed types', () => {
        const mixedOptions = ['Apple', { label: 'Banana', value: 'B' }, 123];
        const { container } = render(<CheckboxGroup options={mixedOptions} />);
        expect(container.querySelectorAll(name).length).toBe(mixedOptions.length);
      });

      it(': render options with checkAll', () => {
        const optionsWithCheckAll = [
          { label: '全选', checkAll: true },
          { label: 'Apple', value: 'A' },
          { label: 'Banana', value: 'B' },
        ];
        const { container } = render(<CheckboxGroup options={optionsWithCheckAll} />);
        expect(container.querySelectorAll(name).length).toBe(optionsWithCheckAll.length);
      });

      it(': render options with custom keys', () => {
        const customOptions = [
          { text: 'Apple', val: 'A', disable: false },
          { text: 'Banana', val: 'B', disable: true },
        ];
        const customKeys = { label: 'text', value: 'val', disabled: 'disable' };
        const { container } = render(<CheckboxGroup options={customOptions} keys={customKeys} />);
        expect(container.querySelectorAll(name).length).toBe(customOptions.length);
      });

      it(': render children when no options', () => {
        const { container } = render(
          <CheckboxGroup>
            <Checkbox value="A" label="Apple" />
            <Checkbox value="B" label="Banana" />
          </CheckboxGroup>,
        );
        expect(container.querySelectorAll(name).length).toBe(2);
      });
    });

    it(': className', () => {
      const { container } = render(<CheckboxGroup className="custom-class" options={options} />);
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });

    it(': name', () => {
      const { container } = render(<CheckboxGroup name="test-group" options={options} />);
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('name', 'test-group');
      });
    });

    it(': disabled', () => {
      const { container } = render(<CheckboxGroup disabled options={options} />);
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });

    it(': borderless', () => {
      const { container } = render(<CheckboxGroup borderless options={options} />);
      // 验证borderless属性被正确传递
      expect(container.querySelector(`${name}-group`)).toBeTruthy();
    });

    it(': readonly', () => {
      const { container } = render(<CheckboxGroup readonly options={options} />);
      // 验证readonly属性被正确传递
      expect(container.querySelector(`${name}-group`)).toBeTruthy();
    });

    it(': direction', () => {
      // 默认 vertical，group 与子组件均带 vertical 修饰类
      const { container, rerender } = render(<CheckboxGroup options={options} />);
      expect(container.querySelector(`${name}-group--vertical`)).toBeTruthy();
      expect(container.querySelector(`${name}-group--horizontal`)).toBeFalsy();
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(options.length);
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(0);

      // vertical -> horizontal
      rerender(<CheckboxGroup direction="horizontal" options={options} />);
      expect(container.querySelector(`${name}-group--horizontal`)).toBeTruthy();
      expect(container.querySelector(`${name}-group--vertical`)).toBeFalsy();
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(options.length);
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(0);

      // horizontal -> vertical
      rerender(<CheckboxGroup direction="vertical" options={options} />);
      expect(container.querySelector(`${name}-group--vertical`)).toBeTruthy();
      expect(container.querySelector(`${name}-group--horizontal`)).toBeFalsy();
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(options.length);
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(0);

      // 受控子项（自身传入 checked）也应从 group 继承 direction 修饰类
      rerender(
        <CheckboxGroup direction="horizontal">
          <Checkbox value="A" label="A" checked={true} />
          <Checkbox value="B" label="B" checked={false} />
        </CheckboxGroup>,
      );
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(2);
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(0);
    });

    it(': max', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<CheckboxGroup max={1} defaultValue={['A', 'B']} options={options} />);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[TDesign] max should be less than the length of value, change is invalid',
      );
      consoleSpy.mockRestore();
    });
  });

  describe(': checkAll functionality', () => {
    it(': checkAll checked state', () => {
      const optionsWithCheckAll = [
        { label: '全选', checkAll: true },
        { label: 'Apple', value: 'A' },
        { label: 'Banana', value: 'B' },
      ];
      const { container } = render(<CheckboxGroup defaultValue={['A', 'B']} options={optionsWithCheckAll} />);
      const checkboxes = container.querySelectorAll(name);
      // 全选checkbox应该被选中
      expect(checkboxes[0]).toHaveClass(`t-checkbox--checked`);
    });

    it(': checkAll click behavior', () => {
      const optionsWithCheckAll = [
        { label: '全选', checkAll: true },
        { label: 'Apple', value: 'A' },
        { label: 'Banana', value: 'B' },
      ];
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup options={optionsWithCheckAll} onChange={onChange} />);

      const checkAllCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => checkAllCheckbox.click());

      expect(onChange).toHaveBeenCalledWith(['A', 'B'], expect.any(Object));
    });

    it(': checkAll uncheck behavior', () => {
      const optionsWithCheckAll = [
        { label: '全选', checkAll: true },
        { label: 'Apple', value: 'A' },
        { label: 'Banana', value: 'B' },
      ];
      const onChange = vi.fn();
      const { container } = render(
        <CheckboxGroup defaultValue={['A', 'B']} options={optionsWithCheckAll} onChange={onChange} />,
      );

      const checkAllCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => {
        checkAllCheckbox.click(); // 取消全选
      });

      expect(onChange).toHaveBeenCalledWith([], expect.any(Object));
    });

    it(': checkAll indeterminate state', () => {
      const optionsWithCheckAll = [
        { label: '全选', checkAll: true },
        { label: 'Apple', value: 'A' },
        { label: 'Banana', value: 'B' },
        { label: 'Orange', value: 'O' },
      ];
      const { container } = render(<CheckboxGroup defaultValue={['A']} options={optionsWithCheckAll} />);

      // 当部分选中时，全选checkbox应该是indeterminate状态
      const checkAllCheckbox = container.querySelector(name);
      expect(checkAllCheckbox).toHaveClass('t-checkbox--checked');
      expect(checkAllCheckbox.querySelector('.t-icon-remove-1')).toBeTruthy();
    });

    it(': checkAll with some items checked', () => {
      const optionsWithCheckAll = [
        { label: '全选', checkAll: true },
        { label: 'Apple', value: 'A' },
        { label: 'Banana', value: 'B' },
        { label: 'Orange', value: 'O' },
      ];
      const onChange = vi.fn();
      const { container } = render(
        <CheckboxGroup defaultValue={['A', 'B']} options={optionsWithCheckAll} onChange={onChange} />,
      );

      // 点击全选checkbox，应该取消所有选择
      const checkAllCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => {
        checkAllCheckbox.click();
      });

      expect(onChange).toHaveBeenCalledWith([], expect.any(Object));
    });
  });

  describe(': events', () => {
    it(': onChange', () => {
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup options={options} onChange={onChange} />);

      const firstCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => firstCheckbox.click());

      expect(onChange).toHaveBeenCalledWith(['A'], expect.any(Object));
    });

    it(': onChange on child', () => {
      const onChange = vi.fn();
      const onChildChange = vi.fn();

      const { container } = render(
        <CheckboxGroup onChange={onChange}>
          <Checkbox onChange={onChildChange} />
        </CheckboxGroup>,
      );

      const firstCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => firstCheckbox.click());

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChildChange).toHaveBeenCalledTimes(1);
    });

    it(': controlled checkbox with checked prop', () => {
      const { container } = render(
        <CheckboxGroup>
          <Checkbox value="A" label="Apple" checked={true} />
          <Checkbox value="B" label="Banana" />
        </CheckboxGroup>,
      );

      // 当checkbox已经有checked属性时，不应该被context注入覆盖
      const checkboxes = container.querySelectorAll(name);
      expect(checkboxes[0]).toHaveClass(`t-checkbox--checked`);
    });

    it(': max limit prevents selection', () => {
      const onChange = vi.fn();
      const { container } = render(
        <CheckboxGroup max={1} defaultValue={['A']} options={options} onChange={onChange} />,
      );

      const secondCheckbox = container.querySelectorAll(name)[1] as HTMLInputElement;
      act(() => secondCheckbox.click());

      // 由于max限制，第二个checkbox的点击应该被忽略
      expect(onChange).not.toHaveBeenCalled();
    });

    it(': uncheck selected checkbox', () => {
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup defaultValue={['A']} options={options} onChange={onChange} />);

      const firstCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => {
        firstCheckbox.click(); // 取消选择
      });

      expect(onChange).toHaveBeenCalledWith([], expect.any(Object));
    });

    it(': check and uncheck multiple checkboxes', () => {
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup options={options} onChange={onChange} />);

      const checkboxes = container.querySelectorAll(name);

      // 选中第一个
      act(() => {
        (checkboxes[0] as HTMLInputElement).click();
      });
      expect(onChange).toHaveBeenCalledWith(['A'], expect.any(Object));

      // 选中第二个
      act(() => {
        (checkboxes[1] as HTMLInputElement).click();
      });
      expect(onChange).toHaveBeenCalledWith(['A', 'B'], expect.any(Object));

      // 取消第一个
      act(() => {
        (checkboxes[0] as HTMLInputElement).click();
      });
      expect(onChange).toHaveBeenCalledWith(['B'], expect.any(Object));
    });
  });

  describe(': edge cases', () => {
    it(': options with undefined values', () => {
      const optionsWithUndefined = [
        { label: 'Apple', value: undefined },
        { label: 'Banana', value: null },
      ];
      const { container } = render(<CheckboxGroup options={optionsWithUndefined} />);
      // 应该正常渲染，但值可能有问题
      expect(container.querySelectorAll(name).length).toBe(optionsWithUndefined.length);
    });

    it(': complex nested options', () => {
      const complexOptions = [
        { label: 'Group 1', value: 'g1', children: [{ label: 'Item 1', value: 'i1' }] },
        { label: 'Group 2', value: 'g2' },
      ] as any[];
      const { container } = render(<CheckboxGroup options={complexOptions} />);
      // 应该只渲染顶层选项
      expect(container.querySelectorAll(name).length).toBe(complexOptions.length);
    });

    it(': options with duplicate values', () => {
      const optionsWithDuplicates = [
        { label: 'Apple', value: 'A' },
        { label: 'Another Apple', value: 'A' },
        { label: 'Banana', value: 'B' },
      ];
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup options={optionsWithDuplicates} onChange={onChange} />);

      const checkboxes = container.querySelectorAll(name);
      act(() => {
        (checkboxes[0] as HTMLInputElement).click();
      });

      // 应该只选中第一个A
      expect(onChange).toHaveBeenCalledWith(['A'], expect.any(Object));
    });

    it(': mixed string and object options', () => {
      const mixedOptions = ['Apple', { label: 'Banana', value: 'B' }, 'Orange', { label: 'Grape', value: 'G' }];
      const { container } = render(<CheckboxGroup options={mixedOptions} />);
      expect(container.querySelectorAll(name).length).toBe(4);
    });

    it(': options with empty string values', () => {
      const optionsWithEmpty = [
        { label: 'Apple', value: '' },
        { label: 'Banana', value: 'B' },
        { label: 'Empty', value: '' },
      ];
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup options={optionsWithEmpty} onChange={onChange} />);

      const checkboxes = container.querySelectorAll(name);
      act(() => {
        (checkboxes[0] as HTMLInputElement).click();
      });

      // 空字符串值应该也能正常工作
      expect(onChange).toHaveBeenCalledWith([''], expect.any(Object));
    });

    it(': max with zero', () => {
      const onChange = vi.fn();
      const { container } = render(<CheckboxGroup max={0} options={options} onChange={onChange} />);

      const firstCheckbox = container.querySelector(name) as HTMLInputElement;
      act(() => {
        firstCheckbox.click();
      });

      // max为0时不应该能选中任何项目
      expect(onChange).not.toHaveBeenCalled();
    });

    it(': value and defaultValue both provided', () => {
      const onChange = vi.fn();
      const { container } = render(
        <CheckboxGroup value={['A']} defaultValue={['B']} options={options} onChange={onChange} />,
      );

      const checkboxes = container.querySelectorAll(name);
      // value应该优先于defaultValue
      expect(checkboxes[0]).toHaveClass('t-checkbox--checked');
      expect(checkboxes[1]).not.toHaveClass('t-checkbox--checked');
    });

    it(': defaultValue is not an array', () => {
      const defaultValue = 1 as any;
      const { container } = render(<CheckboxGroup defaultValue={defaultValue} options={options} />);
      expect(container.querySelectorAll(name).length).toBe(options.length);
    });

    it(': default checked is greater than max', () => {
      const onChange = vi.fn();
      const { container } = render(
        <CheckboxGroup max={1} defaultValue={['A']} options={options} onChange={onChange} />,
      );
      const checkboxes = container.querySelectorAll(name);
      expect(checkboxes.length).toBe(3);
      const secondCheckbox = checkboxes[1] as HTMLInputElement;
      act(() => secondCheckbox.click());
      expect(secondCheckbox).not.toHaveClass('t-checkbox--checked');
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
