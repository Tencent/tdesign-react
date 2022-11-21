import React, { useState, useMemo } from 'react';
import { InputNumber, Space } from 'tdesign-react';

export default function InputNumberExample() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState(100);
  const [decimalValue, setDecimalValue] = useState(3.41);
  const [error, setError] = useState();

  const tips = useMemo(() => {
    if (error === 'exceed-maximum') return 'number can not be exceed maximum';
    if (error === 'below-minimum') return 'number can not be below minimum';
    return undefined;
  }, [error]);

  function handleChange(v, ctx) {
    console.info('change', v, ctx);
    setValue2(v);
  }
  function onValidate({ error }) {
    setError(error);
  }
  function handleFocus(v, ctx) {
    console.info('focus', v, ctx);
  }
  function handleBlur(v, ctx) {
    console.info('blur', v, ctx);
  }
  function handleKeydown(v, ctx) {
    console.info('keydown', v, ctx);
  }
  function handleKeyup(v, ctx) {
    console.info('keyup', v, ctx);
  }
  function handleKeypress(v, ctx) {
    console.info('keypress', v, ctx);
  }
  function handleEnter(v, ctx) {
    console.info('enter', v, ctx);
  }

  // inputProps={{ tips }} 和 tips={tips} 均可
  return (
    <Space direction="vertical">
      <InputNumber
        value={decimalValue}
        onChange={setDecimalValue}
        decimalPlaces={0}
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
