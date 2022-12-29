import React from 'react';
import { Typography, Space } from 'tdesign-react';

const { Text, Link, Copy } = Typography;

export default function ThemeTagExample() {
  return (
    <Space direction="vertical" size="large">
      <Text>TDesign (default)</Text>
      <Text status="secondary" copyable>TDesign (secondary)</Text>
      <Text status="success">TDesign (success)</Text>
      <Text status="warning">TDesign (warning)</Text>
      <Text status="error">TDesign (error)</Text>
      <Text disabled>TDesign (disabled)</Text>
      <Text mark >TDesign (mark)</Text>
      <Text code>TDesign (code)</Text>
      <Text keyboard>TDesign (keyboard)</Text>
      <Text underline>TDesign (underline)</Text>
      <Text delete>TDesign (delete)</Text>
      <Text strong>TDesign (strong)</Text>
      <Text italic>TDesign (italic)</Text>
      <Link href="https://tdesign.tencent.com" target="_blank">TDesign (Link)</Link>
      <Copy text="copy me" tooltips={['copy', 'copied']} />
    </Space>
  );
}
