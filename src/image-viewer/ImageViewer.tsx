import React from 'react';
import classnames from 'classnames';

import useConfig from 'tdesign-react/_util/useConfig';

export interface TdImageViewerProps {
  name: string;
}

export type ImageViewerProps = TdImageViewerProps;

const ImageViewer = (props: ImageViewerProps) => {
  const { classPrefix } = useConfig();

  console.log('ImageViewerImageViewer', classPrefix, props);

  return (
    <div className={classnames(`${classPrefix}-image-viewer`)}>
      <span className={`${classPrefix}-image-viewer__test`}>123123</span>
    </div>
  );
};

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
