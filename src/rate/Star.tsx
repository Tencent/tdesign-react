import React from 'react';
import { StarFilledIcon, StarIcon } from 'tdesign-icons-react';

const Star = (props) => {
  const { isActive, size, style } = props;
  return isActive ? <StarFilledIcon size={size} style={style} /> : <StarIcon size={size} style={style} />;
};

Star.displayName = 'Star';

export default Star;
