import React from 'react';
import { render } from '@test/utils';

export function getNormalAutoCompleteMount(AutoComplete, props, events) {
  const options = [
    'FirstKeyword',
    {
      // 自定义选项
      label: () => <div className="custom-node">TNode SecondKeyword</div>,
      // 用于搜索的纯文本
      text: 'SecondKeyword',
    },
    'ThirdKeyword',
  ];
  return render(<AutoComplete value="" options={options} {...props} {...events} />);
}
