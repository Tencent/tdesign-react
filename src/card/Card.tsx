import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { TdCardProps } from './type';
import Loading from '../loading';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
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

  const renderTitle = title ? <span className={titleClass}>{title}</span> : null;

  const renderSubtitle = subtitle ? <span className={subtitleClass}>{subtitle}</span> : null;

  const renderDescription = description ? <p className={descriptionClass}>{description}</p> : null;

  const renderAvatar = avatar && <div className={avatarClass}>{avatar}</div>;

  const renderHeaderActions = actions && !isPoster2 && <div className={actionClass}>{actions}</div>;
  const renderFooterActions = actions && isPoster2 && <div className={actionClass}>{actions}</div>;

  const renderStatus = status && isPoster2 && <div className={actionClass}>{status}</div>;

  const renderHeader = () => {
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
  };

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
    <div ref={ref} className={cardClass} style={style}>
      {showHeader ? renderHeader() : null}
      {renderCover}
      {renderChildren}
      {renderFooter}
    </div>
  );

  return loading ? <Loading>{card}</Loading> : card;
});

Card.displayName = 'Card';

export default Card;
