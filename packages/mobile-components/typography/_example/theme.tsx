import React from 'react';
import { TypographyText } from 'tdesign-mobile-react';

export default function ThemeDemo() {
  return (
    <div className="tdesign-mobile-typography-demo tdesign-mobile-typography-demo--theme">
      <TypographyText theme="primary">主色</TypographyText>
      <TypographyText theme="success">成功</TypographyText>
      <TypographyText theme="warning">警告</TypographyText>
      <TypographyText theme="error">错误</TypographyText>
      <TypographyText mark>标记</TypographyText>
    </div>
  );
}
