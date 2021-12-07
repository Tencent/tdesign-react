import React from 'react';
import { Transfer } from 'tdesign-react';

const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
    disabled: i % 4 < 1,
  });
}

export default function SearchExample() {
  return <Transfer data={list} search={true}></Transfer>;
}
