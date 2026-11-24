import React from 'react';
import { TypographyText, TypographyTitle, TypographyParagraph } from 'tdesign-mobile-react';

export default function CombinationDemo() {
  return (
    <div className="tdesign-mobile-typography-demo tdesign-mobile-typography-demo--inline">
      <TypographyTitle>What is TDesign</TypographyTitle>
      <TypographyText mark>
        TDesign is an enterprise-level design system accumulated by Tencent&apos;s various business teams.
      </TypographyText>
      <TypographyParagraph>
        <TypographyText strong>
          TDesign features a unified design values, consistent design language, and visual style, helping users form
          continuous and coherent perceptions of the experience.
        </TypographyText>{' '}
        Based on this, TDesign offers out-of-the-box UI component libraries, design guidelines, and design assets,
        elegantly and efficiently freeing design and development from repetitive tasks. Simultaneously, it facilitates
        easy extension on top of TDesign, enabling a better alignment with business requirements.
      </TypographyParagraph>
      <TypographyTitle>Comprehensive</TypographyTitle>
      <TypographyParagraph>
        TDesign Support <TypographyText code>Vue 2</TypographyText>, <TypographyText code>Vue 3</TypographyText>,{' '}
        <TypographyText code>React</TypographyText> components for Desktop Application and{' '}
        <TypographyText code>Vue 3</TypographyText>, <TypographyText code>Wechat MiniProgram</TypographyText> components
        for Mobile Application.
      </TypographyParagraph>
      <TypographyParagraph>
        <ul>
          <li>Features</li>
          <li>
            Comprehensive
            <ul>
              <li>Consistency</li>
              <li>Usability</li>
            </ul>
          </li>
          <li>Join TDesign</li>
        </ul>
      </TypographyParagraph>
      <TypographyParagraph>
        <ol>
          <li>Features</li>
          <li>
            Comprehensive
            <ol>
              <li>Consistency</li>
              <li>Usability</li>
            </ol>
          </li>
          <li>Join TDesign</li>
        </ol>
      </TypographyParagraph>
    </div>
  );
}
