import React from 'react';
import '../../style/mobile/index.less';

const TDemoHeader = (prop) => {
  const { title, summary } = prop;
  return (
    <>
      <div className="tdesign-mobile-demo-header">
        <h1 className="tdesign-mobile-demo-header__title">{title}</h1>
        <p className="tdesign-mobile-demo-header__summary">{summary}</p>
      </div>
    </>
  );
};

export default TDemoHeader;
