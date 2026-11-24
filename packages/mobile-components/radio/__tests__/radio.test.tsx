import React from 'react';
import { describe, expect, render, it, vi, fireEvent } from '@test/utils';
import { CircleIcon, CheckCircleIcon } from 'tdesign-icons-react';

import Radio, { RadioContext } from '../Radio';
import RadioGroup from '../RadioGroup';

const prefix = 't';
const name = `.${prefix}-radio`;

type TRadioIconType = 'circle' | 'line' | 'dot' | 'none';
type TIconStringTestCases = Array<{
  description: string;
  props: { icon: TRadioIconType; defaultChecked?: boolean; disabled?: boolean };
  selector?: string;
  checkIsEmpty?: boolean;
}>;

describe('Radio', () => {
  describe('props', () => {
    it('inject', () => {
      const mockInject = vi.fn((props) => ({ ...props, name: 'injected-group', injected: true }));
      const originalProps = {
        label: 'radio',
        value: 'test',
        checked: false,
      };
      const { container } = render(
        <RadioContext.Provider value={{ inject: mockInject }}>
          <Radio {...originalProps} />
        </RadioContext.Provider>,
      );

      expect(mockInject).toHaveBeenCalledTimes(1);
      expect(mockInject).toHaveBeenCalledWith(originalProps);

      const radioTitle = container.querySelector('.t-radio__title');
      expect(radioTitle.textContent).toBe('radio');

      const radioInput = container.querySelector('input[type="radio"]');
      expect(radioInput).toHaveAttribute('name', 'injected-group');
    });

    it('label[string]', () => {
      const { container } = render(<Radio label="radio" />);
      expect(container.querySelector(name).textContent).toBe('radio');
    });

    it('label[function]', () => {
      const { container } = render(<Radio label={() => 'radio'} />);
      expect(container.querySelector(name).textContent).toBe('radio');
    });

    it('children[string]', () => {
      const { container } = render(<Radio>radio</Radio>);
      expect(container.querySelector(name).textContent).toBe('radio');
    });

    it('children[function]', () => {
      const { container } = render(<Radio>{() => 'radio'}</Radio>);
      expect(container.querySelector(name).textContent).toBe('radio');
    });

    it('content[string]', () => {
      const { container } = render(<Radio content="radio"></Radio>);
      expect(container.querySelector(`${name}__description`).textContent).toBe('radio');

      const { container: containerDisabled } = render(<Radio content="radio" disabled></Radio>);
      expect(containerDisabled.querySelector(`${name}__description--disabled`).textContent).toBe('radio');
    });

    it('content[function]', () => {
      const { container } = render(<Radio content={() => 'radio'}></Radio>);
      expect(container.querySelector(`${name}__description`).textContent).toBe('radio');
    });

    it('disabled[boolean]', () => {
      const { container } = render(<Radio disabled />);
      expect(container.querySelector(`${name}__icon--disabled`)).toBeTruthy();
    });

    it('icon[string]', () => {
      const testCases: TIconStringTestCases = [
        {
          description: 'circle (unchecked)',
          props: { icon: 'circle' },
          selector: `${name}__icon-circle`,
        },
        {
          description: 'circle (checked)',
          props: { icon: 'circle', defaultChecked: true },
          selector: '.t-icon-check-1',
        },
        {
          description: 'line (unchecked)',
          props: { icon: 'line' },
          selector: `${name}__icon-line`,
        },
        {
          description: 'line (checked)',
          props: { icon: 'line', defaultChecked: true },
          selector: `${name}__icon--left .t-icon-check`,
        },
        {
          description: 'dot (unchecked)',
          props: { icon: 'dot' },
          selector: `${name}__icon-dot`,
        },
        {
          description: 'dot (checked)',
          props: { icon: 'dot', defaultChecked: true },
          selector: `${name}__icon--left ${name}__icon-dot`,
        },
        {
          description: 'dot (checked and disabled)',
          props: { icon: 'dot', defaultChecked: true, disabled: true },
          selector: `${name}__icon--left ${name}__icon-dot--disabled`,
        },
        {
          description: 'none (unchecked)',
          props: { icon: 'none' },
          checkIsEmpty: true,
        },
        {
          description: 'none (checked)',
          props: { icon: 'none', defaultChecked: true },
          checkIsEmpty: true,
        },
      ];

      testCases.forEach(({ props, selector, checkIsEmpty }) => {
        const { container } = render(<Radio {...props} />);

        if (checkIsEmpty) {
          const targetEl = container.querySelector(`${name}__icon--left`);
          expect(targetEl).toBeInTheDocument();
          expect(targetEl.childNodes).toHaveLength(0);
          expect(targetEl.textContent.trim()).toBe('');
        } else {
          expect(container.querySelector(selector)).toBeTruthy();
        }
      });

      const disabledIconArray = ['dot', 'circle'] as const;
      disabledIconArray.forEach((iconItem) => {
        const { container: containerDisabled } = render(<Radio icon={iconItem} disabled />);
        expect(containerDisabled.querySelector(`${name}__icon-${iconItem}--disabled`)).toBeTruthy();
      });
    });

    it('icon[TElementArray]', () => {
      const iconArraySingle = [<CheckCircleIcon key="checked" />];
      const { container: containerSingle } = render(<Radio icon={iconArraySingle} />);
      const targetEl = containerSingle.querySelector(`${name}__icon--left`);
      expect(targetEl.childNodes).toHaveLength(0);

      // plural
      const iconArray = [<CheckCircleIcon key="checked" />, <CircleIcon key="unchecked" />];
      const { container } = render(<Radio icon={iconArray} />);
      expect(container.querySelector('.t-icon-circle')).toBeTruthy();

      const { container: containerDefaultChecked } = render(<Radio icon={iconArray} defaultChecked />);
      expect(containerDefaultChecked.querySelector('.t-icon-check-circle')).toBeTruthy();
    });
  });

  describe('events', () => {
    it('onChange', () => {
      const onChange = vi.fn();
      const { container } = render(<Radio onChange={onChange} />);
      const radioInput = container.querySelector('input[type="radio"]');
      expect(radioInput).toBeInTheDocument();

      expect(onChange).toHaveBeenCalledTimes(0);
      fireEvent.click(radioInput);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        true,
        expect.objectContaining({
          e: expect.any(Object),
        }),
      );

      // disabled
      const { container: containerDisabled } = render(<Radio onChange={onChange} disabled />);
      const radioInputDisabled = containerDisabled.querySelector('input[type="radio"]');
      fireEvent.click(radioInputDisabled);
      expect(onChange).toHaveBeenCalledTimes(2);

      // readonly
      const { container: containerReadonly } = render(<Radio onChange={onChange} readonly />);
      const radioInputReadonly = containerReadonly.querySelector('input[type="radio"]');
      fireEvent.click(radioInputReadonly);
      expect(onChange).toHaveBeenCalledTimes(3);

      // contentDisabled
      const { container: containerContentDisabled } = render(
        <Radio label="contentDisabled" contentDisabled onChange={onChange} />,
      );
      const radioContentDisabled = containerContentDisabled.querySelector(`${name}__content`);
      fireEvent.click(radioContentDisabled);
      expect(onChange).toHaveBeenCalledTimes(3);

      // allowUncheck
      const { container: containerAllowUncheck } = render(<Radio defaultChecked allowUncheck onChange={onChange} />);
      const radioInputAllowUncheck = containerAllowUncheck.querySelector(`${name}--block`);
      expect(radioInputAllowUncheck).toBeInTheDocument();
      fireEvent.click(radioInputAllowUncheck);
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(false, expect.objectContaining({ e: expect.any(Object) }));

      const { container: containerNotAllowUncheck } = render(
        <Radio defaultChecked allowUncheck={false} onChange={onChange} />,
      );
      const radioInputNotAllowUncheck = containerNotAllowUncheck.querySelector(`${name}--block`);
      expect(radioInputNotAllowUncheck).toBeInTheDocument();
      fireEvent.click(radioInputNotAllowUncheck);
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(false, expect.objectContaining({ e: expect.any(Object) }));
    });
  });
});

describe('RadioGroup', () => {
  describe('props', () => {
    it('options', () => {
      const options = [1, 'radio'];

      const { container } = render(<RadioGroup options={options} />);
      const targetEl = container.querySelector(`${name}-group`);
      expect(targetEl.childNodes).toHaveLength(2);
      const targetElTitleNumber = container.querySelectorAll(`${name}-group ${name}__title`)[0];
      expect(targetElTitleNumber.textContent.trim()).toBe('1');
      const targetElTitleString = container.querySelectorAll(`${name}-group ${name}__title`)[1];
      expect(targetElTitleString.textContent.trim()).toBe('radio');

      const optionsObj = [
        {
          value: 'radio',
          label: 'radio',
        },
      ];
      const { container: containerOptionsObj } = render(<RadioGroup options={optionsObj} />);
      const targetElOptionsObj = containerOptionsObj.querySelector(`${name}-group`);
      expect(targetElOptionsObj.childNodes).toHaveLength(1);
      const targetElTitle = containerOptionsObj.querySelector(`${name}-group ${name}__title`);
      expect(targetElTitle.textContent.trim()).toBe('radio');
    });

    it('direction', () => {
      const options = [1, 2];

      // 默认 vertical，group 与子组件均带 vertical 修饰类
      const { container, rerender } = render(<RadioGroup options={options} />);
      expect(container.querySelector(`${name}-group--vertical`)).toBeTruthy();
      expect(container.querySelector(`${name}-group--horizontal`)).toBeFalsy();
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(2);
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(0);

      // vertical -> horizontal
      rerender(<RadioGroup direction="horizontal" options={options} />);
      expect(container.querySelector(`${name}-group--horizontal`)).toBeTruthy();
      expect(container.querySelector(`${name}-group--vertical`)).toBeFalsy();
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(2);
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(0);

      // horizontal -> vertical
      rerender(<RadioGroup direction="vertical" options={options} />);
      expect(container.querySelector(`${name}-group--vertical`)).toBeTruthy();
      expect(container.querySelector(`${name}-group--horizontal`)).toBeFalsy();
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(2);
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(0);

      // 受控子项（自身传入 checked）也应从 group 继承 direction 修饰类
      rerender(
        <RadioGroup direction="horizontal">
          <Radio value="1" label="1" checked={true} />
          <Radio value="2" label="2" checked={false} />
        </RadioGroup>,
      );
      expect(container.querySelectorAll(`${name}--horizontal`)).toHaveLength(2);
      expect(container.querySelectorAll(`${name}--vertical`)).toHaveLength(0);
    });

    it('inject', () => {
      const { container } = render(
        <RadioGroup>
          <Radio label="test" value="test" checked={true} />
        </RadioGroup>,
      );
      const radioInput = container.querySelector('input[type="radio"]');
      expect(radioInput).toBeChecked();

      const onChange = vi.fn();
      const { container: containerTestChange } = render(
        <RadioGroup>
          <Radio onChange={onChange} />
        </RadioGroup>,
      );
      const radioInputTestChange = containerTestChange.querySelector('input[type="radio"]');
      fireEvent.click(radioInputTestChange);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('events', () => {
    it('onChange', () => {
      const options = [1, 2];
      const onChange = vi.fn();

      const { container } = render(<RadioGroup options={options} onChange={onChange} />);
      const radioInput = container.querySelector('input[type="radio"]');
      expect(radioInput).toBeInTheDocument();
      fireEvent.click(radioInput);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
