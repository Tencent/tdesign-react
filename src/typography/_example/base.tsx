import React from 'react';
import { Typography, Space } from 'tdesign-react';

const { Title, Text, Paragraph } = Typography;

export default function BasicExample() {
  return (
    <>
      <Title>What is TDesign</Title>
      <Text mark>
        TDesign is an enterprise-level design system accumulated by Tencent&apos;s various business teams.
      </Text>
      <Paragraph>
        <Text strong>
          TDesign features a unified design values, consistent design language, and visual style, helping users form
          continuous and coherent perceptions of the experience.
        </Text>{' '}
        Based on this, TDesign offers out-of-the-box UI component libraries, design guidelines, and design assets,
        elegantly and efficiently freeing design and development from repetitive tasks. Simultaneously, it facilitates
        easy extension on top of TDesign, enabling a better alignment with business requirements.
      </Paragraph>
      <Title level="h2">Comprehensive</Title>
      <Paragraph>
        TDesign Support <Text code>Vue 2</Text>, <Text code>Vue 3</Text>, <Text code>React</Text>, components for
        Desktop Application and <Text code>Vue 3</Text>, <Text code>Wechat MiniProgram</Text> components for Mobile
        Application.
      </Paragraph>

      <Space direction="vertical" size={12}>
        <Paragraph>
          <ul>
            <li>Features</li>
            <li>
              Comprehensive
              <ul>
                <li>Consistency</li>
                <li>Usability</li>
              </ul>
            </li>
            <li>Join TDesign </li>
          </ul>

          <ol>
            <li>Features</li>
            <li>
              Comprehensive
              <ol type="a">
                <li>Consistency</li>
                <li>Usability</li>
              </ol>
            </li>
            <li>Join TDesign</li>
          </ol>
        </Paragraph>
      </Space>
    </>
  );
}
