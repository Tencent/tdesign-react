import React from 'react';
import classNames from 'classnames';
import { InfoCircleIcon, CheckCircleIcon, CloseCircleIcon } from 'tdesign-icons-react';
import parseTNode from '../_util/parseTNode';
import { TdResultProps } from './type';
import { resultDefaultProps } from './defaultProps';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';

export interface ResultProps extends TdResultProps, NativeProps {}

const Result: React.FC<ResultProps> = (props) => {
  const { description, image, theme, title } = useDefaultProps(props, resultDefaultProps);
  const { classPrefix } = useConfig();
  const rootClassName = `${classPrefix}-result`;
  const resultClassName = classNames(rootClassName, `${rootClassName}--theme-${theme || 'default'}`);

  const renderIcon = () => {
    const defaultIcons = {
      default: InfoCircleIcon,
      success: CheckCircleIcon,
      warning: InfoCircleIcon,
      error: CloseCircleIcon,
    };
    const RenderIcon = defaultIcons[theme];
    return RenderIcon ? <RenderIcon className={`${rootClassName}__icon`} /> : null;
  };
  const renderImage = () => {
    if (!image) {
      return null;
    }
    if (typeof image === 'string') {
      return <img src={image} alt="" />;
    }
    return image;
  };

  const renderThumb = () => {
    const image = renderImage();
    const icon = renderIcon();
    return <div className={`${rootClassName}__thumb`}>{parseTNode(image) || parseTNode(icon)}</div>;
  };

  const renderTitle = () => {
    if (!title) {
      return null;
    }
    return <div className={`${rootClassName}__title`}>{parseTNode(title)}</div>;
  };

  const renderDescription = () => {
    if (!description) {
      return null;
    }
    return <div className={`${rootClassName}__description`}>{parseTNode(description)}</div>;
  };
  return withNativeProps(
    props,
    <div className={resultClassName}>
      {renderThumb()}
      {renderTitle()}
      {renderDescription()}
    </div>,
  );
};
Result.displayName = 'Result';
export default Result;
