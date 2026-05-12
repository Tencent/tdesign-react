import React from 'react';
import { AngryIcon, SmileIcon } from 'tdesign-icons-react';
import { Typography } from 'tdesign-react';

const { Text } = Typography;

const textString = `TDesign was founded with the principles of open-source collaboration from the beginning. The collaboration scheme discussion, component design, and API design, including source code, are fully open within the company, garnering widespread attention from internal developers and designers. TDesign follows an equal, open, and strict policy, regardless of the participants' roles.`;

export default function CopyableExample() {
  return (
    <>
      <Text copyable>This is a copyable text.</Text>
      <br />
      <Text
        ellipsis
        copyable={{
          text: textString,
          tooltipProps: {
            content: 'click to copy',
          },
        }}
        style={{ display: 'inline-block', width: '50%' }}
      >
        This is a copyable long text. {textString}
      </Text>
      <br />
      <Text
        copyable={{
          suffix: ({ copied }) => (copied ? <SmileIcon /> : <AngryIcon />),
        }}
      >
        This is a copyable long text with custom suffix.
      </Text>
    </>
  );
}
