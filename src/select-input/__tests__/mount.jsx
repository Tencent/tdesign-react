import React from 'react';
import { render } from '@test/utils';

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: '4' },
  { label: 'tdesign-mobile-vue', value: '5' },
  { label: 'tdesign-mobile-react', value: '6' },
];

function Panel() {
  return (
    <ul className="t-select-input__panel">
      {OPTIONS.map(item => (
        <li key={item.value}>
          <img src="https://tdesign.gtimg.com/demo/demo-image-1.png" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

const value = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-mobile-vue', value: 4 },
  { label: 'tdesign-react-vue', value: 5 },
];

// single select
export function getSelectInputMultipleMount(SelectInput, props, events) {
  return render(
    <SelectInput
      value={value}
      multiple={true}
      panel={(
        <Panel />
      )}
      {...props}
      {...events}
    ></SelectInput>
  );
}
