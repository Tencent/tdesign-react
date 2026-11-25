import React from 'react';
import { Checkbox } from 'tdesign-mobile-react';

export default function () {
  return (
    <Checkbox.Group className="theme-card" defaultValue={['1', '2']}>
      <Checkbox label="多选" value="1" />
      <Checkbox label="多选" value="2" />
      <Checkbox label="多选标题多行多选标题多行多选标题多行多选标题多行多选标题多行多选标题" value="3" />
    </Checkbox.Group>
  );
}
