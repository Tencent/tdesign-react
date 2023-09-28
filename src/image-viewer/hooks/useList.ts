import { useEffect, useState } from 'react';
import { ImageInfo } from '../type';

const checkImages = (images) =>
  images.map((image) => {
    let result: ImageInfo = { mainImage: '' };
    if (typeof image === 'object' && !(image instanceof File)) {
      result = image;
    } else {
      result.mainImage = image;
      result.thumbnail = image;
    }
    return result;
  });

const useList = (images) => {
  const [list, setList] = useState(() => checkImages(images));

  useEffect(() => {
    setList(checkImages(images));
  }, [images]);

  return list;
};

export default useList;
