import React from 'react';
import { AngryIcon, SmileIcon } from 'tdesign-icons-react';
import Typography from '../index';

const textString = `TDesign was founded with the principles of open-source collaboration from the beginning. The collaboration scheme discussion, component design, and API design, including source code, are fully open within the company, garnering widespread attention from internal developers and designers. TDesign follows an equal, open, and strict policy, regardless of the participants' roles.`;

export default function BasicTypography() {
  return (
    <>
      <Typography.Text copyable>
        This is a copyable text.
      </Typography.Text>
      <br />
      <Typography.Text
        ellipsis
        copyable={{
          text: textString,
          tooltipProps: {
            content: 'click to copy'
          },
        }}
        style={{display: 'inline-block', width: '50%'}}
      >
        This is a copyable long text. {textString}
      </Typography.Text>
      <br />
      <Typography.Text
        copyable={{
          suffix: ({copied}) => copied ? <SmileIcon /> : <AngryIcon />
        }}
      >
        This is a copyable long text with custom suffix.
      </Typography.Text>
    </>
  );
}
