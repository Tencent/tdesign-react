import React from 'react';
import { ChatMarkdown } from '@tdesign-react/chat';

const doc = `
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`
  `;

export default function MermaidDemo() {
  return <ChatMarkdown content={doc} />;
}
