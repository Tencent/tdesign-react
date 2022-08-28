import React, { MouseEvent, ReactNode } from 'react';
import { CloseIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import TLoading from '../loading';
import { TdUploadProps, UploadFile } from './type';
// import { abridgeName } from './util';
import { GlobalConfigProvider } from '../config-provider/type';

export interface RemoveContext {
  e: MouseEvent<HTMLElement | HTMLDivElement | SVGSVGElement>;
  file: UploadFile;
  index: number;
}

export interface NormalFileProps {
  files: TdUploadProps['files'];
  toUploadFiles: TdUploadProps['files'];
  displayFiles: TdUploadProps['files'];
  theme: TdUploadProps['theme'];
  placeholder: TdUploadProps['placeholder'];
  tips?: TdUploadProps['tips'];
  classPrefix: string;
  global: GlobalConfigProvider['upload'];
  sizeOverLimitMessage?: string;
  autoUpload?: boolean;
  tipsClasses?: string;
  errorClasses?: string[];
  children?: ReactNode;
  fileListDisplay?: TdUploadProps['fileListDisplay'];
  onRemove?: (p: RemoveContext) => void;
}

export default function NormalFile(props: NormalFileProps) {
  const prefix = `${props.classPrefix}-upload`;
  // const inputTextClass = [`${props.classPrefix}-input__inner`, { [`${prefix}__placeholder`]: true }];
  const classes = [`${prefix}__single`, `${prefix}__single-${props.theme}`];

  const renderProgress = (percent: number) => (
    <div className={`${prefix}__single-progress`}>
      <TLoading />
      <span className={`${prefix}__single-percent`}>{percent}%</span>
    </div>
  );

  // 文本型预览
  const renderFilePreviewAsText = (files: UploadFile[]) => {
    if (props.theme !== 'file') return null;
    return files.map((file, index) => (
      <div className={`${prefix}__single-display-text ${prefix}__display-text--margin`} key={file.name + index}>
        <span className={`${prefix}__single-name`}>{file.name}</span>
        {file.status === 'progress' && renderProgress(file.percent)}
        {(!file.status || file.status === 'success' || !props.autoUpload) && (
          <CloseIcon className={`${prefix}__icon-delete`} onClick={(e) => props.onRemove({ e, file, index })} />
        )}
      </div>
    ));
  };

  // 输入框型预览
  const renderFilePreviewAsInput = () => {
    if (props.theme !== 'file-input') return;
    // const renderResult = () => {
    // if (!!props.loadingFile && props.loadingFile.status === 'fail') {
    //   return <ErrorCircleFilledIcon />;
    // }
    // if (props.file && props.file.name && !props.loadingFile) {
    //   return <CheckCircleFilledIcon />;
    // }
    // return '';
    // };
    return null;
    // return (
    //   <div className={`${prefix}__single-input-preview ${props.classPrefix}-input`}>
    //     <div className={inputTextClass}>
    //       {<span className={`${prefix}__single-input-text`}>{abridgeName('', 4, 6)}</span>}
    //       {/* {showProgress.value && renderProgress()} */}
    //       {renderResult()}
    //     </div>
    //   </div>
    // );
  };

  const { displayFiles } = props;
  const fileListDisplay = props.fileListDisplay?.({ displayFiles });
  return (
    <div className={classNames(classes)}>
      {renderFilePreviewAsInput()}
      {props.children}
      {props.tips && <small className={classNames(props.tipsClasses)}>{props.tips}</small>}
      {props.placeholder && !displayFiles[0] && (
        <small className={classNames(props.tipsClasses)}>{props.placeholder}</small>
      )}

      {fileListDisplay || renderFilePreviewAsText(displayFiles)}

      {props.sizeOverLimitMessage && (
        <small className={classNames(props.errorClasses)}>{props.sizeOverLimitMessage}</small>
      )}
      {props.toUploadFiles
        ?.filter((t) => t.response?.error)
        .map((file, index) => (
          <small className={classNames(props.errorClasses)} key={file.name + index}>
            {file.name} {file.response?.error}
          </small>
        ))}
    </div>
  );
}

NormalFile.displayName = 'NormalFile';
