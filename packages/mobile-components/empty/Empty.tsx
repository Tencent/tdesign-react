import React from 'react';
import TImage from '../image';
import { TdEmptyProps } from './type';
import { StyledProps } from '../common';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';

export interface EmptyProps extends TdEmptyProps, StyledProps {}

const Empty: React.FC<EmptyProps> = (props) => {
  const { action, description, icon, image } = props;

  const emptyClass = usePrefixClass('empty');

  const renderThumb = () => {
    const tNodeImage = parseTNode(image);
    if (tNodeImage) {
      return typeof image === 'string' ? <TImage src={image} /> : tNodeImage;
    }

    const tNodeIcon = parseTNode(icon);
    if (tNodeIcon) {
      return <div className={`${emptyClass}__icon`}>{tNodeIcon}</div>;
    }
    return null;
  };

  return (
    <div className={`${emptyClass}`}>
      <div className={`${emptyClass}__thumb`}>{renderThumb()}</div>
      {description && <div className={`${emptyClass}__description`}>{parseTNode(description)}</div>}
      {action && <div className={`${emptyClass}__actions`}>{action}</div>}
    </div>
  );
};

Empty.displayName = 'Empty';

export default Empty;
