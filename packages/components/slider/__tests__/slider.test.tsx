import React, { useState } from 'react';
import { cleanup, fireEvent, mockTimeout, render, vi } from '@test/utils';

import Slider from '../Slider';

import type { SliderProps } from '../Slider';
import type { SliderValue } from '../type';

function mockSliderRect(container: HTMLElement) {
  const slider = container.querySelector<HTMLElement>('.t-slider');
  // jsdom does not perform layout; the component and mouse handlers remain real.
  vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 100,
    bottom: 20,
    width: 100,
    height: 20,
    toJSON: () => ({}),
  });
  return slider;
}

function dragThumb(container: HTMLElement, index: number, clientX: number) {
  const thumb = container.querySelectorAll<HTMLElement>('.t-slider__button-wrapper')[index];
  fireEvent.mouseDown(thumb, { button: 0, clientX: 0, clientY: 0 });
  try {
    fireEvent.mouseMove(document, { clientX, clientY: 0 });
  } finally {
    fireEvent.mouseUp(document, { clientX, clientY: 0 });
  }
}

function expectThumbPositions(container: HTMLElement, expectedPositions: number[]) {
  const thumbs = container.querySelectorAll<HTMLElement>('.t-slider__button-wrapper');
  expect(thumbs).toHaveLength(expectedPositions.length);
  thumbs.forEach((thumb, index) => {
    expect(thumb.style.left.endsWith('%')).toBe(true);
    const position = Number.parseFloat(thumb.style.left);
    expect(Number.isFinite(position)).toBe(true);
    expect(position).toBeCloseTo(expectedPositions[index]);
  });
}

describe('Slider', () => {
  describe('props', () => {
    test('marks[object/array]', async () => {
      const View = (marks: any) => {
        const { container } = render(<Slider layout="vertical" marks={marks} />);
        return container;
      };

      const marks = { 10: '10°C', 20: '20°C' };
      expect(View(marks).querySelector('.t-slider__mark').firstElementChild.textContent).toBe(marks[10]);

      expect(View([1, 100]).querySelectorAll('.t-slider__mark')).toHaveLength(1);
      expect(View('err').querySelectorAll('.t-slider__mark')).toHaveLength(1);
      expect(View(['']).querySelectorAll('.t-slider__mark')).toHaveLength(1);
    });

    test('label[string]', async () => {
      const SliderView = () => {
        const [value, setValue] = useState(10);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };

        return <Slider value={value} onChange={onChange} min={10} max={100} layout="vertical" label={`${value}°C`} />;
      };

      const buttonSelector = '.t-slider__button-wrapper';

      render(<SliderView />);
      expect(document.querySelector(buttonSelector)).not.toBeNull();

      fireEvent.mouseEnter(document.querySelector(buttonSelector));
      expect(document.querySelector('.t-popup__content').textContent).toBe('10°C');
    });
  });

  describe('events', () => {
    test('onChange with inputNumberProps', async () => {
      const SliderView = () => {
        const [value, setValue] = useState(10);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };

        return (
          <>
            <Slider
              value={value}
              onChange={onChange}
              min={10}
              max={100}
              layout="vertical"
              inputNumberProps={{ theme: 'row' }}
            />
            <p id="slider_value">{value}</p>
          </>
        );
      };

      const inputSelector = 'input';

      render(<SliderView />);
      expect(document.querySelector(inputSelector)).not.toBeNull();
      expect(document.querySelector('#slider_value')).not.toBeNull();

      let value = '80';
      fireEvent.change(document.querySelector(inputSelector), {
        target: { value },
      });
      fireEvent.click(document.querySelector(inputSelector));
      expect(document.querySelector('#slider_value').textContent).toBe(value);

      value = '10000';
      fireEvent.change(document.querySelector(inputSelector), {
        target: { value },
      });
      fireEvent.click(document.querySelector(inputSelector));
      expect(document.querySelector('#slider_value').textContent).not.toBe(value);

      value = '1';
      fireEvent.change(document.querySelector(inputSelector), {
        target: { value },
      });
      fireEvent.click(document.querySelector(inputSelector));
      expect(document.querySelector('#slider_value').textContent).not.toBe(value);
    });

    test('onChange with marks interaction', async () => {
      const marks = { 10: '10°C', 20: '20°C' };
      const SliderView = () => {
        const [value, setValue] = useState(1);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };
        return (
          <>
            <Slider value={value} onChange={onChange} min={1} max={100} layout="vertical" marks={marks} />
            <p id="slider_value">{value}</p>
          </>
        );
      };

      const index = 0;
      const { getByText } = render(<SliderView />);
      expect(document.querySelector('#slider_value')).not.toBeNull();

      fireEvent.click(getByText(Object.values(marks)[index]));
      expect(document.querySelector('#slider_value').textContent).toBe(Object.keys(marks)[index]);

      fireEvent.click(document.querySelector('.t-slider__mark'));
      expect(document.querySelector('#slider_value').textContent).toBe('1');
    });
  });

  describe('scenarios', () => {
    test('layout and value preserve tooltip visibility across pointer interactions', async () => {
      render(<Slider layout="horizontal" value={50} />);

      expect(document.querySelector('.t-slider__button-wrapper')).not.toBeNull();

      fireEvent.mouseEnter(document.querySelector('.t-slider__button-wrapper'));
      expect(document.querySelector('.t-popup__content')).not.toBeNull();

      fireEvent.mouseDown(document.querySelector('.t-slider__button-wrapper'));
      expect(document.querySelector('.t-popup__content')).not.toBeNull();

      fireEvent.mouseUp(document.querySelector('.t-slider__button-wrapper'));
      expect(document.querySelector('.t-popup__content')).not.toBeNull();

      fireEvent.mouseLeave(document.querySelector('.t-slider__button-wrapper'));
      await mockTimeout(() => expect(document.querySelector('.t-popup__content')).toBeNull());
    });

    describe('empty range', () => {
      afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
      });

      const controlledValues: Array<[string, SliderValue | undefined]> = [
        ['undefined', undefined],
        ['empty array', []],
        ['existing pair', [0, 20]],
      ];

      test.each(controlledValues)('drags both ends with a controlled %s', (_, initialValue) => {
        const onChange = vi.fn();
        const onChangeEnd = vi.fn();
        const ControlledSlider = () => {
          const [value, setValue] = useState<SliderValue | undefined>(initialValue);
          return (
            <Slider
              range
              label={false}
              value={value}
              onChange={(nextValue) => {
                onChange(nextValue);
                setValue(nextValue);
              }}
              onChangeEnd={onChangeEnd}
            />
          );
        };
        const { container } = render(<ControlledSlider />);
        mockSliderRect(container);

        dragThumb(container, 1, 60);
        expect(onChange).toHaveBeenLastCalledWith([0, 60]);
        expect(onChangeEnd).toHaveBeenLastCalledWith([0, 60]);
        expectThumbPositions(container, [0, 60]);

        dragThumb(container, 0, 20);
        expect(onChange).toHaveBeenLastCalledWith([20, 60]);
        expect(onChangeEnd).toHaveBeenLastCalledWith([20, 60]);
        expectThumbPositions(container, [20, 60]);
        expect(onChange).toHaveBeenCalledTimes(2);
      });

      const uncontrolledValues: Array<[string, SliderProps]> = [
        ['omitted value', {}],
        ['empty default value', { defaultValue: [] }],
        ['existing default pair', { defaultValue: [0, 20] }],
      ];

      test.each(uncontrolledValues)('retains both ends with an uncontrolled %s', (_, props) => {
        const onChange = vi.fn();
        const { container } = render(<Slider range label={false} {...props} onChange={onChange} />);
        mockSliderRect(container);

        dragThumb(container, 1, 60);
        expect(onChange).toHaveBeenLastCalledWith([0, 60]);
        expectThumbPositions(container, [0, 60]);

        dragThumb(container, 0, 20);
        expect(onChange).toHaveBeenLastCalledWith([20, 60]);
        expectThumbPositions(container, [20, 60]);
      });

      test('keeps a single slider value scalar', () => {
        const onChange = vi.fn();
        const { container } = render(<Slider label={false} onChange={onChange} />);
        mockSliderRect(container);

        dragThumb(container, 0, 60);

        expect(onChange).toHaveBeenLastCalledWith(60);
        expectThumbPositions(container, [60]);
      });

      const scalarValues: Array<[string, SliderProps]> = [
        ['value', { value: 70 }],
        ['defaultValue', { defaultValue: 70 }],
      ];

      test.each(scalarValues)('preserves scalar callbacks for an explicit numeric %s', (_, props) => {
        const onChange = vi.fn();
        const { container } = render(<Slider<number> range label={false} {...props} onChange={onChange} />);
        mockSliderRect(container);
        expectThumbPositions(container, [0, 70]);

        dragThumb(container, 1, 60);

        expect(onChange).toHaveBeenLastCalledWith(60);
      });

      const explicitZeroValues: Array<[string, SliderProps]> = [
        ['value', { value: 0 }],
        ['defaultValue', { defaultValue: 0 }],
      ];

      test.each(explicitZeroValues)('preserves scalar callbacks for an explicit zero %s', (_, props) => {
        const onChange = vi.fn();
        const { container } = render(
          <Slider<number> range label={false} min={-20} max={20} {...props} onChange={onChange} />,
        );
        mockSliderRect(container);
        expectThumbPositions(container, [0, 50]);

        dragThumb(container, 1, 75);

        expect(onChange).toHaveBeenLastCalledWith(10);
      });

      test('opens an empty range by clicking the rail', () => {
        const onChange = vi.fn();
        const { container } = render(<Slider range label={false} defaultValue={[]} onChange={onChange} />);
        const slider = mockSliderRect(container);

        fireEvent.click(slider, { clientX: 60, clientY: 0 });

        expect(onChange).toHaveBeenLastCalledWith([0, 60]);
        expectThumbPositions(container, [0, 60]);
      });

      test('opens an empty range by clicking a mark', () => {
        const onChange = vi.fn();
        const { container, getByText } = render(
          <Slider range label={false} defaultValue={[]} marks={{ 60: 'Sixty' }} onChange={onChange} />,
        );

        fireEvent.click(getByText('Sixty'));

        expect(onChange).toHaveBeenLastCalledWith([0, 60]);
        expectThumbPositions(container, [0, 60]);
      });

      test.each([
        [20, [20, 40]],
        [60, [40, 60]],
      ])('opens a collapsed pair toward a rail click at %s', (clientX, expectedValue) => {
        const onChange = vi.fn();
        const { container } = render(<Slider range label={false} defaultValue={[40, 40]} onChange={onChange} />);
        const slider = mockSliderRect(container);

        fireEvent.click(slider, { clientX, clientY: 0 });

        expect(onChange).toHaveBeenLastCalledWith(expectedValue);
      });

      test('keeps the left thumb preference at the midpoint of a non-collapsed pair', () => {
        const onChange = vi.fn();
        const { container } = render(<Slider range label={false} defaultValue={[20, 80]} onChange={onChange} />);
        const slider = mockSliderRect(container);

        fireEvent.click(slider, { clientX: 50, clientY: 0 });

        expect(onChange).toHaveBeenLastCalledWith([50, 80]);
      });

      const unchangedValues: Array<[string, SliderProps]> = [
        ['controlled undefined', { value: undefined }],
        ['empty default value', { defaultValue: [] }],
        ['omitted value', {}],
      ];

      test.each(unchangedValues)('ends an unchanged drag without emitting a change for %s', (_, props) => {
        const onChange = vi.fn();
        const onChangeEnd = vi.fn();
        const { container } = render(
          <Slider range label={false} {...props} onChange={onChange} onChangeEnd={onChangeEnd} />,
        );
        mockSliderRect(container);
        expect(onChange).not.toHaveBeenCalled();

        dragThumb(container, 1, 0);

        expect(onChange).not.toHaveBeenCalled();
        expect(onChangeEnd).toHaveBeenCalledTimes(1);
        expect(onChangeEnd).toHaveBeenLastCalledWith([0, 0]);
      });

      test('keeps an explicit undefined value controlled when the parent does not accept changes', () => {
        const onChange = vi.fn();
        const { container } = render(<Slider range label={false} value={undefined} onChange={onChange} />);
        mockSliderRect(container);

        dragThumb(container, 1, 60);

        expect(onChange).toHaveBeenLastCalledWith([0, 60]);
        expectThumbPositions(container, [0, 0]);
      });

      const changingMinimumValues: Array<[string, SliderProps]> = [
        ['controlled empty array', { value: [] }],
        ['omitted value', {}],
      ];

      test.each(changingMinimumValues)('uses the current positive minimum for %s', (_, props) => {
        const onChange = vi.fn();
        const { container, rerender } = render(
          <Slider range label={false} min={20} max={100} {...props} onChange={onChange} />,
        );
        mockSliderRect(container);
        expectThumbPositions(container, [0, 0]);

        rerender(<Slider range label={false} min={40} max={100} {...props} onChange={onChange} />);
        expectThumbPositions(container, [0, 0]);
        expect(onChange).not.toHaveBeenCalled();

        dragThumb(container, 1, 50);

        expect(onChange).toHaveBeenLastCalledWith([40, 70]);
      });

      test('preserves the implicit zero endpoint when zero is within the range', () => {
        const onChange = vi.fn();
        const { container } = render(<Slider range label={false} min={-20} max={20} onChange={onChange} />);
        mockSliderRect(container);
        expectThumbPositions(container, [0, 50]);

        dragThumb(container, 0, 25);

        expect(onChange).toHaveBeenLastCalledWith([-10, 0]);
        expectThumbPositions(container, [25, 50]);
      });

      const initiallyEmptyValues: Array<[string, SliderProps]> = [
        ['omitted value', {}],
        ['empty default value', { defaultValue: [] }],
      ];

      test.each(initiallyEmptyValues)('retains a pair selected from an %s when the minimum changes', (_, props) => {
        const onChange = vi.fn();
        const { container, rerender } = render(
          <Slider range label={false} min={0} max={100} {...props} onChange={onChange} />,
        );
        mockSliderRect(container);
        dragThumb(container, 1, 75);
        dragThumb(container, 0, 25);
        expect(onChange).toHaveBeenLastCalledWith([25, 75]);
        expectThumbPositions(container, [25, 75]);
        onChange.mockClear();

        rerender(<Slider range label={false} min={-25} max={100} {...props} onChange={onChange} />);

        expectThumbPositions(container, [40, 80]);
        expect(onChange).not.toHaveBeenCalled();
        dragThumb(container, 1, 60);
        expect(onChange).toHaveBeenLastCalledWith([25, 50]);
      });

      test('does not reset an existing pair when the minimum changes', () => {
        const onChange = vi.fn();
        const { container, rerender } = render(
          <Slider range label={false} min={10} max={110} defaultValue={[30, 70]} onChange={onChange} />,
        );
        mockSliderRect(container);

        rerender(<Slider range label={false} min={20} max={120} defaultValue={[30, 70]} onChange={onChange} />);
        expectThumbPositions(container, [10, 50]);
        expect(onChange).not.toHaveBeenCalled();

        dragThumb(container, 1, 80);

        expect(onChange).toHaveBeenLastCalledWith([30, 100]);
      });

      test('keeps an initially omitted range default when a numeric defaultValue is added later', () => {
        const onChange = vi.fn();
        const { container, rerender } = render(<Slider range label={false} min={20} max={100} onChange={onChange} />);
        mockSliderRect(container);
        expectThumbPositions(container, [0, 0]);

        rerender(<Slider range label={false} min={20} max={100} defaultValue={70} onChange={onChange} />);

        expectThumbPositions(container, [0, 0]);
        expect(onChange).not.toHaveBeenCalled();
        dragThumb(container, 1, 50);
        expect(onChange).toHaveBeenLastCalledWith([20, 60]);
        expectThumbPositions(container, [0, 50]);
      });

      test('keeps an initially numeric range default scalar when defaultValue is removed later', () => {
        const onChange = vi.fn();
        const { container, rerender } = render(
          <Slider<number> range label={false} defaultValue={70} onChange={onChange} />,
        );
        mockSliderRect(container);
        expectThumbPositions(container, [0, 70]);

        rerender(<Slider<number> range label={false} onChange={onChange} />);

        expectThumbPositions(container, [0, 70]);
        expect(onChange).not.toHaveBeenCalled();
        dragThumb(container, 1, 60);
        expect(onChange).toHaveBeenLastCalledWith(60);
        expectThumbPositions(container, [0, 60]);
      });
    });
  });
});
