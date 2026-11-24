import React, { useState } from 'react';
import { Slider } from 'tdesign-mobile-react';
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

export default function SingleIcon() {
  const [strokeWidth, setStrokeWidth] = useState(2);
  const handleClick = () => {
    console.log('icon is clicked');
  };

  return (
    <div className="t-demo-iconfont">
      <div className="t-demo-row">
        <div className="t-demo-row__slider">
          <Slider value={strokeWidth} onChange={(v) => setStrokeWidth(Number(v))} min={0.5} max={2.5} step={0.5} />
        </div>

        <LettersTIcon strokeWidth={strokeWidth} onClick={handleClick} />
        <LettersDIcon strokeWidth={strokeWidth} />
        <LettersEIcon strokeWidth={strokeWidth} />
        <LettersSIcon strokeWidth={strokeWidth} />
        <LettersIIcon strokeWidth={strokeWidth} />
        <LettersGIcon strokeWidth={strokeWidth} />
        <LettersNIcon strokeWidth={strokeWidth} />
      </div>
      <br />
      <div className="t-demo-row">
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
      </div>
    </div>
  );
}
