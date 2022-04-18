import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { TdCardProps } from './type';
import Loading from '../loading';
import { StyledProps } from '../common';

import useConfig from '../_util/useConfig';
import useCommonClassName from '../_util/useCommonClassName';

export interface CardProps extends TdCardProps, StyledProps {}

const Card = forwardRef((props: CardProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    actions,
    avatar,
    bordered = false,
    children,
    className,
    cover,
    description,
    footer,
    header,
    headerBordered,
    hoverShadow,
    loading = false,
    shadow = false,
    size = 'medium',
    style = {},
    subtitle,
    title,
    theme,
  } = props;

  const { classPrefix } = useConfig();
  const commonClassNames = useCommonClassName();

  const cardClass = classNames(className, 't-card', {
    [`${classPrefix}-card--bordered`]: bordered,
    [commonClassNames.SIZE.small]: size === 'small',
    [`${classPrefix}__shadow`]: shadow,
    [`${classPrefix}-card--shadow-hover`]: hoverShadow,
  });

  const headerClass = classNames(className, '', {
    [`${classPrefix}-card__header`]: header,
    [`${classPrefix}-card__title--bordered`]: headerBordered,
  });

  const titleClass = classNames(className, '', {
    [`${classPrefix}-card__title`]: title,
  });

  const subtitleClass = classNames(className, '', {
    [`${classPrefix}-card__subtitle`]: subtitle,
  });

  const actionClass = classNames(className, '', {
    [`${classPrefix}-card__actions`]: actions,
  });

  const footerClass = classNames(className, '', {
    [`${classPrefix}-card__footer`]: footer,
  });

  const coverClass = classNames(className, '', {
    [`${classPrefix}-card__cover`]: cover,
  });

  const avatarClass = classNames(className, '', {
    [`${classPrefix}-card__avatar`]: avatar,
  });

  const bodyClass = classNames(className, '', {
    [`${classPrefix}-card__body`]: children,
  });

  const descriptionClass = classNames(className, '', {
    [`${classPrefix}-card__description`]: description,
  });

  const isPoster2 = theme === 'poster2';

  const renderDescription = description && <p className={descriptionClass}>{description}</p>;

  const renderTitle = title && <span className={titleClass}>{title}</span>;

  const renderSubtitle = subtitle && <span className={subtitleClass}>{subtitle}</span>;

  const renderAvatar = avatar && <div className={avatarClass}>{avatar}</div>;

  const renderActions = actions && <div className={actionClass}>{actions}</div>;

  const renderFooter = footer && (
    <div className={footerClass}>
      <div className={`${classPrefix}-card__footer-wrapper`}>{footer}</div>
      {isPoster2 && actions && renderActions}
    </div>
  );

  const renderCover = cover && (
    <div className={coverClass}>
      <img src={cover}></img>
    </div>
  );

  if (loading) {
    return (
      <Loading>
        <div className={cardClass}></div>
      </Loading>
    );
  }

  return (
    <div ref={ref} className={cardClass} style={style}>
      {!isPoster2 && (header || actions) && (
        <div className={headerClass}>
          <div className={`${classPrefix}-card__header-wrapper`}>
            {renderAvatar}
            <div>
              {renderTitle}
              {renderSubtitle}
              {renderDescription}
            </div>
          </div>
          {renderActions}
        </div>
      )}
      {renderCover}
      {children && <div className={bodyClass}>{children}</div>}
      {renderFooter}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
