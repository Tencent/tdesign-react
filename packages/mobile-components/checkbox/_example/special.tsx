import React, { useState } from 'react';
import { Checkbox } from 'tdesign-mobile-react';
import { CheckIcon } from 'tdesign-icons-react';

export default function () {
  const [value, setValue] = useState([1, 2]);
  const [value1, setValue1] = useState([1, 2]);

  return (
    <div>
      <Checkbox.Group value={value} onChange={(val) => setValue(val as number[])}>
        {Array.from({ length: 3 }, (_, index) => {
          const n = index + 1;
          const isActive = value.includes(n);
          const cardClass = `card ${isActive ? 'card--active' : ''}`;

          return (
            <div key={n} className={cardClass}>
              {isActive && <CheckIcon className="card__icon" aria-hidden="true" />}
              <Checkbox
                value={n}
                label="多选"
                content="描述信息描述信息描述信息描述信息描述信息"
                icon={false}
                borderless
              />
            </div>
          );
        })}
      </Checkbox.Group>
      <div className="tdesign-mobile-demo-block__summary" style={{ marginLeft: '16px', marginTop: '24px' }}>
        横向卡片多选框
      </div>

      <Checkbox.Group value={value1} onChange={(val) => setValue1(val as number[])} className="horizontal-box">
        {Array.from({ length: 3 }, (_, index) => {
          const n = index + 1;
          const isActive = value1.includes(n);
          const cardClass = `card ${isActive ? 'card--active' : ''}`;

          return (
            <div key={n} className={cardClass}>
              {isActive && <CheckIcon className="card__icon" aria-hidden="true" />}
              <Checkbox value={n} label="多选" icon={false} borderless />
            </div>
          );
        })}
      </Checkbox.Group>
    </div>
  );
}
