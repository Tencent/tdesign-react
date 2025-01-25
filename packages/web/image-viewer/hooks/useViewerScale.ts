import { ImageViewerScale } from '../type';

const useViewerScale = (viewerScale) => {
  const result: ImageViewerScale = {
    minWidth: 1000,
    minHeight: 1000,
  };
  if (viewerScale?.minWidth !== undefined) result.minWidth = viewerScale.minWidth;
  if (viewerScale?.minHeight !== undefined) result.minHeight = viewerScale.minHeight;
  return result;
};

export default useViewerScale;
