import React, { forwardRef, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { TdCardProps } from './type';
import Loading from '../loading';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useCommonClassName from '../hooks/useCommonClassName';
import { cardDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface CardProps extends TdCardProps, StyledProps {}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    actions,
    avatar,
    bordered,
    children,
    className,
    cover,
    description,
    footer,
    header,
    headerBordered,
    hoverShadow,
    loading,
    shadow,
    size,
    style,
    subtitle,
    title,
    theme,
    status,
    loadingProps,
  } = useDefaultProps<CardProps>(props, cardDefaultProps);

  const { classPrefix } = useConfig();
  const commonClassNames = useCommonClassName();
  // 是否为海报风格2
  const isPoster2 = theme === 'poster2';

  const cardClass = classNames(`${classPrefix}-card`, className, {
    [commonClassNames.SIZE.small]: size === 'small',
    [`${classPrefix}-card--bordered`]: bordered,
    [`${classPrefix}-card--shadow`]: shadow,
    [`${classPrefix}-card--shadow-hover`]: hoverShadow,
  });

  const showHeader =
    header || title || subtitle || description || avatar || (actions && !isPoster2) || (status && isPoster2);

  const headerClass = classNames({
    [`${classPrefix}-card__header`]: showHeader,
    [`${classPrefix}-card__title--bordered`]: headerBordered,
  });

  const titleClass = classNames({
    [`${classPrefix}-card__title`]: title,
  });

  const subtitleClass = classNames({
    [`${classPrefix}-card__subtitle`]: subtitle,
  });

  const actionClass = classNames({
    [`${classPrefix}-card__actions`]: actions,
  });

  const footerClass = classNames({
    [`${classPrefix}-card__footer`]: footer,
  });

  const coverClass = classNames({
    [`${classPrefix}-card__cover`]: cover,
  });

  const avatarClass = classNames({
    [`${classPrefix}-card__avatar`]: avatar,
  });

  const bodyClass = classNames({
    [`${classPrefix}-card__body`]: children,
  });

  const descriptionClass = classNames({
    [`${classPrefix}-card__description`]: description,
  });

  const renderTitle = useMemo(()=>title ? <div className={titleClass}>{title}</div> : null,[title, titleClass]);

  const renderSubtitle = useMemo(()=>subtitle ? <div className={subtitleClass}>{subtitle}</div> : null,[subtitle, subtitleClass]);

  const renderDescription = useMemo(()=>description ? <p className={descriptionClass}>{description}</p> : null,[description, descriptionClass]);

  const renderAvatar = useMemo(()=>avatar && <div className={avatarClass}>{avatar}</div>,[avatar, avatarClass]);

  const renderHeaderActions = useMemo(()=>actions && !isPoster2 && <div className={actionClass}>{actions}</div>,[actionClass, actions, isPoster2]);
  const renderFooterActions = useMemo(()=>actions && isPoster2 && <div className={actionClass}>{actions}</div>,[actionClass, actions, isPoster2]);

  const renderStatus = useMemo(()=>status && isPoster2 && <div className={actionClass}>{status}</div>,[actionClass, isPoster2, status]);

  const renderHeader = useCallback(() => {
    if (header) {
      return <div className={headerClass}>{header}</div>;
    }
    return (
      <div className={headerClass}>
        <div className={`${classPrefix}-card__header-wrapper`}>
          {renderAvatar}
          <div>
            {renderTitle}
            {renderSubtitle}
            {renderDescription}
          </div>
        </div>
        {renderHeaderActions}
        {renderStatus}
      </div>
    );
  },[classPrefix, header, headerClass, renderAvatar, renderDescription, renderHeaderActions, renderStatus, renderSubtitle, renderTitle]);

  const childrenNode = useMemo<React.ReactNode>(()=>{

    const renderCover = cover ? (
      <div className={coverClass}>{typeof cover === 'string' ? <img src={cover} alt=""></img> : cover}</div>
    ) : null;
  
    const renderChildren = children && <div className={bodyClass}>{children}</div>;
  
    const renderFooter = footer && (
      <div className={footerClass}>
        <div className={`${classPrefix}-card__footer-wrapper`}>{footer}</div>
        {renderFooterActions}
      </div>
    );

    const card = (
      <>
        {showHeader ? renderHeader() : null}
        {renderCover}
        {renderChildren}
        {renderFooter}
      </>
    );
    if (!Reflect.has(props, 'loading')) {
      return card;
    } if (React.isValidElement(loading)) {
      return React.cloneElement(loading, null, card);
    } 
    return  (
      <Loading {...loadingProps} loading={!!loading}>
        {card}
      </Loading>
    );
  },[bodyClass, children, classPrefix, cover, coverClass, footer, footerClass, loading, loadingProps, props, renderFooterActions, renderHeader, showHeader]);

  return (
    <div ref={ref} className={cardClass} style={style}>
      {childrenNode}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
