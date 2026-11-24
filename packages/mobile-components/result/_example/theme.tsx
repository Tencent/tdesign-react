import React from 'react';
import { Result, ResultProps } from 'tdesign-mobile-react';

export default function ThemeResult() {
  const resultList: Array<ResultProps> = [
    {
      title: '成功状态',
      theme: 'success',
      description: '描述文字',
    },
    {
      title: '失败状态',
      theme: 'error',
      description: '描述文字',
    },
    {
      title: '警示状态',
      theme: 'warning',
      description: '描述文字',
    },
    {
      title: '默认状态',
      theme: 'default',
      description: '描述文字',
    },
  ];
  return (
    <div>
      {resultList.map((resultInfo) => (
        <Result
          className="space"
          key={resultInfo.theme}
          title={resultInfo.title}
          description={resultInfo.description}
          theme={resultInfo.theme}
        />
      ))}
    </div>
  );
}
