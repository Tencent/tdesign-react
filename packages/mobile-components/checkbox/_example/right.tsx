import React from 'react';
import { Checkbox } from 'tdesign-mobile-react';

export default function () {
  return (
    <>
      <Checkbox label="多选" value="checkbox1" />
      <Checkbox label="多选" placement="right" value="checkbox2" defaultChecked />
    </>
  );
}
