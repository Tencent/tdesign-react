import { MouseEvent } from 'react';
import { TdUploadProps, UploadFile } from './type';
import { StyledProps, TNode } from '../common';

export interface CustomDraggerRenderProps {
  dragActive: boolean;
}

export interface FlowRemoveContext {
  e: MouseEvent<HTMLElement>;
  index?: number;
  file?: UploadFile;
}

export interface UploadProps extends StyledProps, Omit<TdUploadProps, 'files'> {
  files?: Array<TdUploadFile>;
  children?: TNode;
  customDraggerRender?: (props: CustomDraggerRenderProps) => TNode;
  value?: Array<TdUploadFile>;
}

export interface TdUploadFile extends UploadFile {
  // fileList中每个文件的唯一标识
  uid?: string;
  xhr?: XMLHttpRequest;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
