import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'tdesign-icons-react';
import { Button, Typography } from 'tdesign-react';

const { Text, Paragraph } = Typography;

const textString = `TDesign was founded with the principles of open-source collaboration from the beginning. The collaboration scheme discussion, component design, and API design, including source code, are fully open within the company, garnering widespread attention from internal developers and designers. TDesign follows an equal, open, and strict policy, regardless of the participants' roles.`;

const EllipsisExample = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded(true);
  };

  return (
    <>
      <Paragraph ellipsis>{textString}</Paragraph>
      <Paragraph
        ellipsis={{
          row: 2,
          suffix: ({ expanded }) => (
            <>
              <Button theme="primary" variant="text" style={{ padding: 0, height: '1em' }}>
                {expanded ? 'less' : 'more'}
              </Button>
            </>
          ),
          expandable: true,
          collapsible: true,
        }}
      >
        {textString}
      </Paragraph>
      <Text
        ellipsis={{
          suffix: () => '',
          expandable: false,
          tooltipProps: {
            content: 'long long long text',
          },
          onExpand: handleExpand,
        }}
        style={{ width: isExpanded ? '100%' : 300, display: 'block' }}
      >
        {textString}
      </Text>

      <Paragraph
        ellipsis={{
          suffix: ({ expanded }) => (
            <span>
              {expanded ? (
                <ChevronUpIcon size={16} style={{ marginLeft: 4 }} />
              ) : (
                <ChevronDownIcon style={{ marginLeft: 4 }} size={16} />
              )}
            </span>
          ),
          expandable: true,
        }}
      >
        {textString}
      </Paragraph>
    </>
  );
};

export default EllipsisExample;
