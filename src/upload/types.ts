import { ReactNode } from 'react';
import { UploadFile, TdUploadProps } from './type';

export interface UploadProps extends Omit<TdUploadProps, 'files'> {
  files?: Array<TdUploadFile>;
  children?: ReactNode | undefined;
  value?: Array<TdUploadFile>;
}

export interface TdUploadFile extends UploadFile {
  // fileList中每个文件的唯一标识
  uid?: string;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
