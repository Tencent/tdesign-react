import { useEffect, useState } from 'react';
import log from '../_common/js/log';
import { getFileUrlByFileRaw } from '../_common/js/upload/utils';

export function useImagePreviewUrl(imgUrl: string | File) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!imgUrl) return;
    if (typeof imgUrl === 'string') {
      setPreviewUrl(imgUrl);
      return;
    }
    getFileUrlByFileRaw(imgUrl).then(
      (url) => {
        setPreviewUrl(url);
      },
      () => {
        log.error('Image', 'Image.src is not a valid file');
      },
    );
  }, [imgUrl]);

  return { previewUrl };
}

export default useImagePreviewUrl;
