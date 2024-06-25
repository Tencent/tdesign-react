import React from 'react';
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
import { Space } from 'tdesign-react';

export default function IconExample() {
  return (
    <Space direction="vertical">
      <Space breakLine style={{ color: `var(--td-brand-color)` }}>
        <LettersTIcon />
        <LettersDIcon />
        <LettersEIcon />
        <LettersSIcon />
        <LettersIIcon />
        <LettersGIcon />
        <LettersNIcon />
      </Space>
      <Space breakLine>
        <ComponentCheckboxIcon />
        <ComponentBreadcrumbIcon />
        <ComponentInputIcon />
        <ComponentSwitchIcon />
        <ComponentDropdownIcon />
        <ComponentRadioIcon />
        <ComponentStepsIcon />
      </Space>
    </Space>
  );
}
