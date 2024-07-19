import { useMemo } from 'react';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import type { ImageInfo, TdImageViewerProps } from '../type';

const isImageInfo = (image: string | File | ImageInfo): image is ImageInfo =>
  !!image && !isString(image) && !(image instanceof File);

const checkImages = (images: TdImageViewerProps['images']) => {
  if (!isArray(images)) return [];
  return images.map((item) => {
    if (isImageInfo(item)) {
      return {
        download: true,
        thumbnail: item.mainImage,
        ...item,
      };
    }
    return {
      mainImage: item,
      thumbnail: item,
      download: true,
    };
  });
};

const useList = (images: TdImageViewerProps['images']) => useMemo(() => checkImages(images), [images]);

export default useList;
