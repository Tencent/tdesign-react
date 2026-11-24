import React from 'react';
import classNames from 'classnames';
import './style/index.less';

const TDemoBlock = (prop) => {
  const { title, summary, padding, children, style } = prop;

  return (
    <>
      <div
        className={classNames('tdesign-mobile-demo-block', { 'tdesign-mobile-demo-block_subtitle': !title })}
        style={style}
      >
        {(title || summary) && (
          <div className="tdesign-mobile-demo-block__header">
            {title && <h2 className="tdesign-mobile-demo-block__title">{title}</h2>}
            {summary && (
              <p
                className={classNames('tdesign-mobile-demo-block__summary', {
                  'tdesign-mobile-demo-block_subtitle': !title,
                })}
              >
                {summary}
              </p>
            )}
          </div>
        )}
        <div className={classNames('tdesign-mobile-demo-block__slot', { 'with-padding': padding })}>{children}</div>
      </div>
    </>
  );
};

export default TDemoBlock;
