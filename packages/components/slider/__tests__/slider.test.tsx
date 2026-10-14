import React, { useState } from 'react';
import { fireEvent, mockTimeout, render } from '@test/utils';

import Slider from '../Slider';

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
  });
});
