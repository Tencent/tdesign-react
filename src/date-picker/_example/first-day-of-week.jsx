import React, { useState } from 'react';
import { DatePicker, Radio } from 'tdesign-react';

export default function YearDatePicker() {
  const [startWeek, setStartWeek] = useState(1);

  return (
    <div className="tdesign-demo-block-column">
      <div>
        <Radio.Group variant="default-filled" value={startWeek} onChange={(value) => setStartWeek(value)}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Radio.Button key={i} value={i}>{i}</Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <DatePicker firstDayOfWeek={startWeek} />
    </div>
  );
}
