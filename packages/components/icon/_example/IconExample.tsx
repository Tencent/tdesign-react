import React, { useState } from 'react';
import {
  LettersTIcon,
  LettersDIcon,
  LettersSIcon,
  LettersEIcon,
  LettersIIcon,
  LettersNIcon,
  LettersGIcon,
  ComponentCheckboxIcon,
  ComponentInputIcon,
  ComponentSwitchIcon,
  ComponentBreadcrumbIcon,
  ComponentDropdownIcon,
  ComponentRadioIcon,
  ComponentStepsIcon,
} from 'tdesign-icons-react';
import { Space, Slider } from 'tdesign-react';

export default function IconExample() {
  const [strokeWidth, setStrokeWidth] = useState(2);
  return (
    <Space direction="vertical">
      <Slider value={strokeWidth} onChange={(v) => setStrokeWidth(Number(v))} min={0.5} max={2.5} step={0.5} />
      <Space breakLine style={{ color: `var(--td-brand-color)` }}>
        <LettersTIcon />
        <LettersDIcon />
        <LettersEIcon strokeWidth={strokeWidth} />
        <LettersSIcon strokeWidth={strokeWidth} />
        <LettersIIcon strokeWidth={strokeWidth} />
        <LettersGIcon strokeWidth={strokeWidth} />
        <LettersNIcon strokeWidth={strokeWidth} />
      </Space>
      <Space breakLine>
        <ComponentCheckboxIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
        <ComponentBreadcrumbIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
        <ComponentInputIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
        <ComponentSwitchIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
        <ComponentDropdownIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
        <ComponentRadioIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
        <ComponentStepsIcon
          strokeWidth={strokeWidth}
          strokeColor={['currentColor', '#0052d9']}
          fillColor={['#bbd3fb', '#f78d94']}
        />
      </Space>
    </Space>
  );
}
