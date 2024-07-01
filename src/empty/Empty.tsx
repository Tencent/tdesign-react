import React, { useMemo } from 'react';
import cls from 'classnames';
import useDefaultProps from '../hooks/useDefaultProps';
import { emptyDefaultProps } from './defaultProps';
import { TdEmptyProps } from './type';
import Image, { ImageProps } from '../image';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';

export type EmptyProps = TdEmptyProps & StyledProps;

// todo(zwkang): add default settings
const defaultMaps: {
  [key in EmptyProps['type']]?: Pick<EmptyProps, 'image' | 'description' | 'title'>;
} = {};

const Empty = (props: EmptyProps) => {
  const {
    image: propsImage,
    imageStyle,
    description: propsDescription,
    title: propsTitle,
    type,
    action,
    style,
  } = useDefaultProps(props, emptyDefaultProps);
  const { classPrefix } = useConfig();

  const name = `${classPrefix}-empty`;
  const titleClasses = cls(`${name}__title`);
  const descriptionClasses = cls(`${name}__description`);

  const { image, description, title } = {
    image: propsImage,
    title: propsTitle,
    description: propsDescription,
    ...(defaultMaps[type] ?? null),
  };

  function renderTitle() {
    if (typeof title === 'string') {
      return <div className={titleClasses}>{title}</div>;
    }
    if (typeof title !== 'undefined') {
      return title;
    }

    return null;
  }

  function renderDescription() {
    if (typeof title === 'string') {
      return <div className={descriptionClasses}>{description}</div>;
    }
    if (typeof description !== 'undefined') {
      return description;
    }
    return null;
  }

  const imageProps = useMemo(() => {
    const result: ImageProps = {};
    if (typeof image === 'string') {
      result.src = image;
    }
    if (typeof image === 'object') {
      Object.assign(result, image);
    }

    if (imageStyle) {
      result.style = imageStyle;
    }

    return result;
  }, [image, imageStyle]);

  function renderImage() {
    if (typeof image === 'string' || typeof image === 'object') {
      return <Image {...imageProps} />;
    }

    return null;
  }

  return (
    <div className={name} style={style}>
      {renderImage()}

      {renderTitle()}

      {renderDescription()}

      {action}
    </div>
  );
};

export default Empty;
