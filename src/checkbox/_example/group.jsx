import React, { useState } from 'react';
import { Checkbox } from 'tdesign-react';

const options = [
  {
    value: '北京',
    label: '北京',
  },
  {
    value: '上海',
    label: '上海',
  },
  {
    value: '广州',
    label: '广州',
  },
];

export default function CheckboxExample() {
  const [disabled, setDisabled] = useState(false);
  const [city, setCity] = useState(['北京']);

  function handleSelectAll(checked) {
    const nextVal = checked ? ['北京', '上海', '广州'] : [];
    setCity(nextVal);
  }

  const indeterminate = !!(options.length > city.length && city.length);
  const checkAll = options.length === city.length;

  return (
    <div className="tdesign-demo-block-column">
      {city.length && <div>选中值: {city.join('、')}</div>}
      <div>
        <Checkbox checked={checkAll} indeterminate={indeterminate} onChange={handleSelectAll}>
          全选
        </Checkbox>
        <Checkbox checked={disabled} onChange={(value) => setDisabled(value)}>
          禁用全部
        </Checkbox>
      </div>

      <Checkbox.Group disabled={disabled} value={city} onChange={(value) => setCity(value)}>
        {options.map((item) => (
          <Checkbox key={item.value} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
}
