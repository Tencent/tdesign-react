import { useEffect, useState } from 'react';
import { ImageInfo } from '../type';

const checkImages = (images) =>
  images.map((image) => {
    const result: ImageInfo = { mainImage: '' };
    if (typeof image === 'string' || !image) result.mainImage = image;
    else {
      result.mainImage = image.mainImage;
      result.thumbnail = image.thumbnail;
      result.download = image.download;
    }
    return result;
  });

// 业务组件
const useList = (images) => {
  const [list, setList] = useState(() => checkImages(images));

  useEffect(() => {
    setList(checkImages(images));
  }, [images]);

  return list;
};

export default useList;
