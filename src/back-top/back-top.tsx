import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import isString from 'lodash/isString';
import { Icon } from 'tdesign-icons-react';
import { TdBackTopProps } from './type';
import useConfig from '../hooks/useConfig';

const isWindow = (obj) => obj !== null && obj.window === window;

export const defaultProps = {
  fixed: true,
  icon: 'backtop',
  target: (() => window) as any,
  text: 'TOP',
  theme: 'default',
  size: 'medium',
  shape: 'square',
};

export const BackTop = (props: TdBackTopProps) => {
  const { size, shape, fixed, icon, target, text, theme } = { ...defaultProps, ...props };

  const backTopDom = useRef<HTMLElement>(target() || defaultProps.target());

  const targetHeight = isWindow(backTopDom.current) ? 0 : backTopDom.current?.offsetTop || 0;

  const [show, setShow] = useState(true);

  const handleScroll = () => {
    if (isWindow(backTopDom.current)) {
      // 当滚动条滚动到超过锚点二分之一个屏幕后，显示回到顶部按钮
      if (window.innerHeight + window.screenY >= document.body.offsetHeight / 2) {
        setShow(true);
      } else {
        setShow(false);
      }
    }
  };

  useEffect(() => {
    const container = backTopDom.current || window;
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [target]);

  const onClick = () => backTopDom.current?.scrollTo({ top: targetHeight, behavior: 'smooth' });

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-back-top`;

  const isDisplayText = text && size !== 'small';

  return (
    <div
      className={classNames(`${name}`, [`${name}--${theme}`, `${name}--${shape}`, `${name}--${size}`], {
        [`${classPrefix}--fixed`]: fixed,
        'back-top--hidden': !show,
        'back-top--show': show,
      })}
      style={{ zIndex: 99999 }}
      onClick={onClick}
    >
      {isString(icon) ? <Icon className={`${name}--icon`} name={icon} /> : icon}
      {isDisplayText && (
        <div className={classNames(`${name}--text`)} style={{ width: 'auto', minWidth: 12, maxWidth: 24 }}>
          {text}
        </div>
      )}
    </div>
  );
};

BackTop.defaultProps = defaultProps;
BackTop.displayName = 'BackTop';

export default BackTop;
