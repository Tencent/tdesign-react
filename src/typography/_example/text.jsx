import React from 'react';
import { Space } from 'tdesign-react';
import Typography from '../index';

const { Text } = Typography;

export default function TextExample() {
  return (
    <Space direction="vertical">
      <Text theme="primary">TDesign (primary)</Text>
      <Text theme="secondary">TDesign (secondary)</Text>
      <Text disabled>TDesign (disabled)</Text>
      <Text theme="success">TDesign (success)</Text>
      <Text theme="warning">TDesign (warning)</Text>
      <Text theme="error">TDesign (error)</Text>
      <Text mark="pink">TDesign (mark)</Text>
      <Text code>TDesign (code)</Text>
      <Text keyboard>TDesign (keyboard)</Text>
      <Text underline>TDesign (underline)</Text>
      <Text delete>TDesign (delete)</Text>
      <Text strong>TDesign (strong)</Text>
      <Text italic>TDesign (italic)</Text>
    </Space>
  );
}
