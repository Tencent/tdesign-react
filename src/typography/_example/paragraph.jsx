import React from 'react';
import { Typography } from 'tdesign-react';

const { Paragraph, Title } = Typography;

export default function ThemeTagExample() {
  return (
    <Typography>
      <Title level={3}>TDesign 是什么</Title>
      <Paragraph>TDesign 是腾讯各业务团队在服务业务过程中沉淀的一套企业级设计体系。</Paragraph>
      <Paragraph>
        TDesign 具有统一的 价值观，一致的设计语言和视觉风格，帮助用户形成连续、统一的体验认知。在此基础上，TDesign
        提供了开箱即用的 UI 组件库、设计指南 和相关设计资产，以优雅高效的方式将设计和研发从重复劳动中解放出来，同时方便大家在 TDesign
        的基础上扩展，更好的的贴近业务需求。
      </Paragraph>
    </Typography>
  );
}
