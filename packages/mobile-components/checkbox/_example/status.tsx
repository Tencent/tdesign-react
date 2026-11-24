import React from 'react';
import { Checkbox } from 'tdesign-mobile-react';

export default function () {
  return (
    <Checkbox.Group className="box" defaultValue={['checkbox1']} disabled>
      <Checkbox label="选项禁用-已选" value="checkbox1" />
      <Checkbox label="选项禁用-默认" value="checkbox2" />
    </Checkbox.Group>
  );
}
