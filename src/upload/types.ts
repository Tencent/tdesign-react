import { UploadFile, TdUploadProps, ProgressContext, SuccessContext } from '../_type/components/upload';

export type UploadProps = TdUploadProps;

export interface XhrOptions {
  action: string;
  withCredentials: boolean;
  headers: { [key: string]: string };
  data: { [key: string]: any } | Function;
  file: UploadFile;
  name: string;
  onError: ({ event, file, response }: { event: ProgressEvent; file?: UploadFile; response?: any }) => void;
  onSuccess: (context: SuccessContext) => void;
  onProgress: (context: ProgressContext) => void;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
