import React from 'react';
import { BrowseIcon } from 'tdesign-icons-react';
import { Image } from '../image';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';

interface DefaultTriggerProps {
  // 需要展示的图片
  showImage: string | File;
  // 点击事件
  onClick: () => void;
}

/**
 * 默认触发器
 *
 * @param {DefaultTriggerProps} props 默认触发器属性
 * @returns {JSX.Element} 默认触发器
 */
export const DefaultTrigger: React.FC<DefaultTriggerProps> = ({ showImage, onClick }) => {
  const { classPrefix } = useConfig();
  const [local] = useLocaleReceiver('imageViewer');

  return (
    <div className={`${classPrefix}-image-viewer__trigger`} onClick={onClick}>
      <Image src={showImage} alt="preview" fit="contain" className={`${classPrefix}-image-viewer__trigger-img`} />
      <div className={`${classPrefix}-image-viewer__trigger--hover`}>
        <span>
          <BrowseIcon size="1.4em" className={`${classPrefix}-image-viewer__trigger-icon`} />
          {local.previewText}
        </span>
      </div>
    </div>
  );
};
