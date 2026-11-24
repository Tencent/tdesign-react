import React from 'react';
import TImage from '../image';
import { TdFooterProps } from './type';
import { StyledProps } from '../common';
import { footerDefaultProps } from './defaultProps';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';

export interface FooterProps extends TdFooterProps, StyledProps {}

const Footer: React.FC<FooterProps> = (originProps) => {
  const props = useDefaultProps(originProps, footerDefaultProps);

  const { links, text, logo, className, style } = props;

  const footerClass = usePrefixClass('footer');
  const footerLinkClass = usePrefixClass('footer__link');

  return (
    <div className={`${footerClass} ${className || ''}`} style={style}>
      {logo && (
        <a className={`${footerClass}__logo`} href={logo.url} target={logo.target}>
          {logo.icon && <TImage className={`${footerClass}__${logo.title ? 'icon' : 'title-url'}`} src={logo.icon} />}
          {logo.title && <span className={`${footerClass}__title`}>{logo.title}</span>}
        </a>
      )}
      {links.length ? (
        <div className={`${footerLinkClass}-list`}>
          {links.map((link, index) => (
            <React.Fragment key={link.url}>
              <a href={link.url} target={link.target} className={`${footerLinkClass}-item`}>
                {link.name}
              </a>
              {index !== links.length - 1 && <div className={`${footerLinkClass}-line`}>|</div>}
            </React.Fragment>
          ))}
        </div>
      ) : null}
      {text && <div className={`${footerClass}__text`}>{text}</div>}
    </div>
  );
};

Footer.displayName = 'Footer';

export default Footer;
