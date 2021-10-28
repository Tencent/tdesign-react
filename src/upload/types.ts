import { ReactNode } from 'react';
import { UploadFile, ProgressContext, TdUploadProps } from '../_type/components/upload';

export interface XhrSuccessContext {
  e: ProgressEvent;
  file: UploadFile;
  response: any;
}

export interface UploadProps extends Omit<TdUploadProps, 'files'> {
  files?: Array<TdUploadFile>;
  children?: ReactNode | undefined;
  value?: Array<TdUploadFile>;
}

export interface TdUploadFile extends UploadFile {
  // fileList中每个文件的唯一标识
  uid?: string;
  // xhr?: XMLHttpRequest;
}

export interface XhrOptions {
  action: string;
  withCredentials: boolean;
  headers: { [key: string]: string };
  data: { [key: string]: any } | Function;
  file: UploadFile;
  name: string;
  onError: ({ event, file, response }: { event: ProgressEvent; file?: UploadFile; response?: any }) => void;
  onSuccess: (context: XhrSuccessContext) => void;
  onProgress: (context: ProgressContext) => void;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
