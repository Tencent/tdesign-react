import { ReactNode } from 'react';
import { StyledProps } from '../common';
import { TdUploadProps, UploadRemoveContext } from './type';
import { GlobalConfigProvider } from '../config-provider/type';

export interface CommonDisplayFileProps {
  files: TdUploadProps['files'];
  toUploadFiles: TdUploadProps['files'];
  displayFiles: TdUploadProps['files'];
  theme: TdUploadProps['theme'];
  placeholder: TdUploadProps['placeholder'];
  classPrefix: string;
  tips?: TdUploadProps['tips'];
  locale?: GlobalConfigProvider['upload'];
  sizeOverLimitMessage?: string;
  autoUpload?: boolean;
  disabled?: boolean;
  uploading?: boolean;
  tipsClasses?: string;
  errorClasses?: string[];
  children?: ReactNode;
  fileListDisplay?: TdUploadProps['fileListDisplay'];
  onRemove?: (p: UploadRemoveContext) => void;
}

export interface UploadProps extends StyledProps, Omit<TdUploadProps, 'files'> {
  children?: ReactNode;
}
