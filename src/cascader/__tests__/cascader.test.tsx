import { render, fireEvent, mockTimeout } from '@test/utils';
import React, { useState } from 'react';
import Cascader from '../index';

// TODO
describe('Cascader 组件测试', () => {
  test('dom', () => {
    expect(true).toBe(true);
  });

  test('value is zero should be selected', async () => {
    const popupSelector = '.t-popup';
    const labelText = 'my value is 0 that typeof number';
    const TestComponent = () => {
      const [value, setValue] = useState('');
      const options = [
        {
          value: 0,
          label: labelText,
        },
      ];
      const onChange = (value) => {
        setValue(value);
      };

      return <Cascader options={options} value={value} onChange={onChange} checkStrictly />;
    };
    const { getByText } = render(<TestComponent />);
    fireEvent.click(document.querySelector('input'));
    expect(document.querySelector(popupSelector)).toHaveTextContent(labelText);
    await mockTimeout(() => fireEvent.click(getByText(labelText)));
    expect(document.querySelector('.t-input__inner')).toHaveValue(labelText);
  });
});
