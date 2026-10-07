import React, { forwardRef, useState } from 'react';
import {
  CloseCircleFilledIcon,
  FileExcelFilledIcon,
  FileIcon,
  FileImageFilledIcon,
  FileMusicFilledIcon,
  FilePdfFilledIcon,
  FilePowerpointFilledIcon,
  FileWordFilledIcon,
  FileZipFilledIcon,
  LoadingIcon,
  VideoFilledIcon,
} from 'tdesign-icons-react';
import { ImageViewer } from 'tdesign-react';

import { eventOf, rootProps, useChatClass, useElementRef } from '../_util/native';

import type { TdAttachmentItem, TdFileCardProps } from '../_util/native-types';

export const isImage = (item: TdAttachmentItem) =>
  item.fileType === 'image' ||
  item.type?.startsWith('image/') ||
  /^(png|jpe?g|gif|bmp|webp|svg)$/i.test(item.extension?.replace(/^\./, '') || item.name?.split('.').pop() || '');
const sizeLabel = (size: number) => {
  let value = size;
  let index = 0;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(0)} ${units[index]}`;
};
export const Filecard = forwardRef<HTMLElement | undefined, TdFileCardProps>((props, ref) => {
  const { item, removable = true, imageViewer = true, cardType = 'file', disabled = false } = props;
  const [visible, setVisible] = useState(false);
  const root = useElementRef(ref);
  const base = useChatClass('filecard');
  const extension = (item.extension || item.name?.split('.').pop() || '').replace(/^\./, '').toLowerCase();
  const presets = [
    { matches: /^(pdf)$/, icon: FilePdfFilledIcon },
    { matches: /^docx?$/, icon: FileWordFilledIcon },
    { matches: /^xlsx?$/, icon: FileExcelFilledIcon },
    { matches: /^pptx?$/, icon: FilePowerpointFilledIcon },
    { matches: /^(zip|rar|7z|tar|gz)$/, icon: FileZipFilledIcon },
    { matches: /^(mp4|avi|mov|wmv|flv|mkv)$/, icon: VideoFilledIcon },
    { matches: /^(mp3|wav|flac|ape|aac|ogg)$/, icon: FileMusicFilledIcon },
  ];
  let Icon = presets.find((preset) => preset.matches.test(extension))?.icon || FileIcon;
  if (isImage(item)) Icon = FileImageFilledIcon;
  if (item.status === 'progress') Icon = LoadingIcon;
  let description = item.description || (item.size ? sizeLabel(item.size) : '\u00a0');
  if (!item.description && item.status === 'progress') description = `上传中...${item.percent || 0}%`;
  if (!item.description && item.status === 'fail')
    description = typeof item.response === 'string' ? item.response : '上传失败';
  return (
    <div
      ref={root}
      {...rootProps(props, base)}
      data-td-chat="filecard"
      data-card-type={cardType}
      data-status={item.status || 'done'}
    >
      <button
        data-td-chat-button=""
        type="button"
        disabled={disabled}
        aria-label={item.name || '附件'}
        onClick={() => {
          props.onFileClick?.(eventOf('fileClick', item));
          if (imageViewer && isImage(item) && item.url) setVisible(true);
        }}
      >
        {cardType === 'image' && item.url ? <img src={item.url} alt={item.name} /> : <Icon size="24px" />}
        {cardType !== 'image' && (
          <span>
            <strong title={item.name}>{item.name}</strong>
            <small>{description}</small>
          </span>
        )}
      </button>
      {removable && (
        <button
          data-td-chat-button=""
          type="button"
          disabled={disabled}
          aria-label={`移除 ${item.name || '附件'}`}
          className="td-chat-file-remove"
          onClick={() => props.onRemove?.(eventOf('remove', item))}
        >
          <CloseCircleFilledIcon />
        </button>
      )}
      {imageViewer && item.url && (
        <ImageViewer images={[item.url]} visible={visible} onClose={() => setVisible(false)} />
      )}
    </div>
  );
});
Filecard.displayName = 'Filecard';
export default Filecard;
export type { TdFileCardProps } from '../_util/native-types';
