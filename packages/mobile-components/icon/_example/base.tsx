import React from 'react';
import { IconFont } from 'tdesign-icons-react';

export default function BaseIcon() {
  return (
    <div className="t-demo-iconfont">
      <div className="t-demo-row">
        <p>How do you feel today?</p>
        <IconFont name="sneer" />
        <IconFont name="unhappy" />
        <IconFont name="excited" />
        <IconFont name="surprised" />
        <IconFont name="giggle" />
      </div>
      <br />
      <div className="t-demo-row">
        <p>What is your favourite food?</p>
        <IconFont name="tangerinr" style={{ color: 'orange' }} />
        <IconFont name="bamboo-shoot" style={{ color: 'green' }} />
        <IconFont name="apple" style={{ color: 'red' }} />
        <IconFont name="milk" style={{ color: '#0052D9' }} />
        <IconFont name="peach" style={{ color: 'pink' }} />
      </div>
      <br />
      <div className="t-demo-row">
        <p>How much icons does TDesign Icon includes?</p>
        <IconFont name="numbers-1" style={{ color: 'red' }} />
        <IconFont name="numbers-2" style={{ color: 'green' }} />
        <IconFont name="numbers-0" style={{ color: 'orange' }} />
        <IconFont name="numbers-3" style={{ color: '#0052d9' }} />
      </div>
    </div>
  );
}
