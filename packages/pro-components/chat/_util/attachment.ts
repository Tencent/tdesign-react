import type { AttachmentItem, ChatRequestParams } from '@tdesign/ai-chat-engine';
import type { TdAttachmentItem } from './native-types';
// Files and upload responses remain sender-owned; only protocol data enters Immer.
export const createChatRequestParams = (
  params: Omit<ChatRequestParams, 'attachments'> & {
    attachments?: TdAttachmentItem[] | AttachmentItem[];
  },
): ChatRequestParams => ({
  ...params,
  attachments: params.attachments?.map((source) => {
    const item = source as TdAttachmentItem;
    const extension = item.extension || item.name?.split('.').pop();
    const category = item.type?.split('/')[0];
    let fileType: AttachmentItem['fileType'] = 'txt';
    if (/^(png|jpe?g|gif|bmp|webp|svg)$/i.test(extension || '')) fileType = 'image';
    if (extension === 'pdf') fileType = 'pdf';
    if (/^docx?$/.test(extension || '')) fileType = 'doc';
    if (/^pptx?$/.test(extension || '')) fileType = 'ppt';
    if (category === 'image' || category === 'video' || category === 'audio') fileType = category;
    if (item.fileType) fileType = item.fileType;
    return {
      key: item.key,
      name: item.name,
      size: item.size,
      url: item.url,
      fileType,
      isReference: item.isReference,
      width: item.width,
      height: item.height,
      extension,
      metadata: item.metadata ? JSON.parse(JSON.stringify(item.metadata)) : undefined,
      status: item.status,
      type: item.type,
      description: item.description,
      percent: item.percent,
    } as AttachmentItem;
  }),
});
