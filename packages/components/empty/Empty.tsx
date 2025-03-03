import React, { isValidElement } from 'react';
import type { ReactNode } from 'react';
import cls from 'classnames';
import { isObject , isString } from 'lodash-es';
import useDefaultProps from '../hooks/useDefaultProps';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { emptyDefaultProps } from './defaultProps';
import type { TdEmptyProps } from './type';
import type { StyledProps } from '../common';
import Image from '../image';
import MaintenanceSvg from './assets/MaintenanceSvg';
import NetworkErrorSvg from './assets/NetworkErrorSvg';
import EmptySvg from './assets/EmptySvg';
import FailSvg from './assets/FailSvg';
import SuccessSvg from './assets/SuccessSvg';

export interface EmptyProps extends TdEmptyProps, StyledProps {}

function getImageIns(data: EmptyProps['image']) {
  let result = data;
  if (isValidElement(data)) {
    result = data;
  } else if (isObject(data)) {
    result = <Image {...(data as any)} />;
  } else if (isString(data)) {
    result = <Image src={data} />;
  }

  return data ? (result as ReactNode) : null;
}

const Empty: React.FC<EmptyProps> = (props) => {
  const {
    image: propsImage,
    imageStyle,
    description: propsDescription,
    title: propsTitle,
    type,
    action,
    style,
    className,
    size = 'medium',
  } = useDefaultProps(props, emptyDefaultProps);

  const { classPrefix, empty } = useConfig();
  const [local, t] = useLocaleReceiver('empty');

  const defaultMaps: {
    [key in EmptyProps['type']]?: Pick<EmptyProps, 'image' | 'title'>;
  } = {
    maintenance: {
      image: empty.image.maintenance || <MaintenanceSvg />,
      title: empty.titleText.maintenance || t(local.titleText.maintenance),
    },
    success: {
      image: empty.image.success || <SuccessSvg />,
      title: empty.titleText.success || t(local.titleText.success),
    },
    fail: {
      image: empty.image.fail || <FailSvg />,
      title: empty.titleText.fail || t(local.titleText.fail),
    },
    'network-error': {
      image: empty.image.networkError || <NetworkErrorSvg />,
      title: empty.titleText.networkError || t(local.titleText.networkError),
    },
    empty: {
      image: empty.image.empty || <EmptySvg />,
      title: empty.titleText.empty || t(local.titleText.empty),
    },
  };

  const defaultSize = {
    small: `${classPrefix}-size-s`,
    medium: `${classPrefix}-size`,
    large: `${classPrefix}-size-l`,
  };

  const prefix = `${classPrefix}-empty`;
  const emptyClasses = cls(prefix, className, defaultSize[size]);
  const titleClasses = cls(`${prefix}__title`);
  const imageClasses = cls(`${prefix}__image`);
  const descriptionClasses = cls(`${prefix}__description`);
  const actionCls = cls(`${prefix}__action`);

  const typeImageProps = defaultMaps[type] ?? null;

  const { image, description, title } = {
    image: propsImage ? propsImage : typeImageProps?.image ?? null,
    title: propsTitle ? propsTitle : typeImageProps?.title ?? null,
    description: propsDescription,
  };

  function renderTitle() {
    if (!title) {
      return null;
    }
    return <div className={titleClasses}>{title}</div>;
  }

  function renderDescription() {
    if (!description) {
      return null;
    }
    return <div className={descriptionClasses}>{description}</div>;
  }

  const imageContent = getImageIns(image);

  return (
    <div className={emptyClasses} style={style}>
      {imageContent ? (
        <div className={imageClasses} style={imageStyle}>
          {imageContent}
        </div>
      ) : null}
      {renderTitle()}
      {renderDescription()}
      {action ? <div className={actionCls}>{action}</div> : null}
    </div>
  );
};

export default Empty;
