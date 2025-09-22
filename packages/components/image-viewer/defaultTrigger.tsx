import React, { useMemo, type FC } from 'react';
import { BrowseIcon } from 'tdesign-icons-react';
import { Image } from '../image';
import useConfig from '../hooks/useConfig';

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
export const DefaultTrigger: FC<DefaultTriggerProps> = ({ showImage, onClick }) => {
  const { classPrefix } = useConfig();

  const maskEl = useMemo(
    () => (
      <div className={`${classPrefix}-image-viewer__trigger-hover`} onClick={onClick}>
        <BrowseIcon name={'browse'} className={`${classPrefix}-image-viewer__trigger-icon`} />
        <span>预览</span>
      </div>
    ),
    [classPrefix, onClick],
  );

  return (
    <Image
      src={showImage}
      overlayContent={maskEl}
      overlayTrigger="hover"
      fit="contain"
      className={`${classPrefix}-image-viewer__trigger`}
    />
  );
};
