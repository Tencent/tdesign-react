import React, { useState, useMemo } from 'react';
import { InputNumber, InputNumberValue, Space } from 'tdesign-react';
import type { InputNumberProps } from 'tdesign-react';

export default function InputNumberExample() {
  const [value1, setValue1] = useState<InputNumberValue>('');
  const [value2, setValue2] = useState<InputNumberValue>(100);
  const [decimalValue, setDecimalValue] = useState<InputNumberValue>(3.41);
  const [error, setError] = useState<'exceed-maximum' | 'below-minimum'>();

  const tips = useMemo(() => {
    if (error === 'exceed-maximum') return 'number can not be exceed maximum';
    if (error === 'below-minimum') return 'number can not be below minimum';
    return undefined;
  }, [error]);

  const handleChange: InputNumberProps['onChange'] = (v, ctx) => {
    console.info('change', v, ctx);
    setValue2(v);
  };
  const onValidate: InputNumberProps['onValidate'] = ({ error }) => {
    setError(error);
  };
  const handleFocus: InputNumberProps['onFocus'] = (v, ctx) => {
    console.info('focus', v, ctx);
  };
  const handleBlur: InputNumberProps['onBlur'] = (v, ctx) => {
    console.info('blur', v, ctx);
  };
  const handleKeydown: InputNumberProps['onKeydown'] = (v, ctx) => {
    console.info('keydown', v, ctx);
  };
  const handleKeyup: InputNumberProps['onKeyup'] = (v, ctx) => {
    console.info('keyup', v, ctx);
  };
  const handleKeypress: InputNumberProps['onKeypress'] = (v, ctx) => {
    console.info('keypress', v, ctx);
  };
  const handleEnter: InputNumberProps['onEnter'] = (v, ctx) => {
    console.info('enter', v, ctx);
  };

  // inputProps={{ tips }} 和 tips={tips} 均可
  return (
    <Space direction="vertical">
      <InputNumber
        value={decimalValue}
        onChange={setDecimalValue}
        // decimalPlaces={0}
        max={5}
        autoWidth
      />

      <InputNumber
        value={value1}
        onChange={setValue1}
        step={0.18}
        max={5}
        allowInputOverLimit={false}
        style={{ width: 250 }}
      />

      <InputNumber
        value={value2}
        max={15}
        min={-2}
        inputProps={{ tips }}
        suffix="个"
        style={{ width: 300 }}
        onChange={handleChange}
        onValidate={onValidate}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onEnter={handleEnter}
        onKeydown={handleKeydown}
        onKeyup={handleKeyup}
        onKeypress={handleKeypress}
      />
    </Space>
  );
}
