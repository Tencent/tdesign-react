import React from 'react';
import {
  CloseIcon as TdCloseIcon,
  TimeFilledIcon as TdTimeFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
} from 'tdesign-icons-react';
import classNames from 'classnames';
import { abridgeName } from '@tdesign/common-js/upload/utils';
import parseTNode from '../../_util/parseTNode';
import TLoading from '../../loading';
import Link from '../../link';
import { UploadFile } from '../type';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import { CommonDisplayFileProps } from '../interface';

export interface NormalFileProps extends CommonDisplayFileProps {
  multiple: boolean;
}

export default function NormalFile(props: NormalFileProps) {
  const { theme, disabled, classPrefix, locale } = props;

  const { CloseIcon, TimeFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } =
    useGlobalIcon({
      CloseIcon: TdCloseIcon,
      TimeFilledIcon: TdTimeFilledIcon,
      CheckCircleFilledIcon: TdCheckCircleFilledIcon,
      ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
      CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    });

  const uploadPrefix = `${classPrefix}-upload`;

  const renderProgress = (percent: number) => (
    <div className={`${uploadPrefix}__single-progress`}>
      <TLoading />
      <span className={`${uploadPrefix}__single-percent`}>{percent || 0}%</span>
    </div>
  );

  // 文本型预览
  const renderFilePreviewAsText = (files: UploadFile[]) => {
    if (theme !== 'file') return null;
    if (!props.multiple && files[0]?.status === 'fail' && props.autoUpload) {
      return null;
    }
    return files.map((file, index) => {
      const fileName = props.abridgeName && file.name ? abridgeName(file.name, ...props.abridgeName) : file.name;
      return (
        <div
          className={`${uploadPrefix}__single-display-text ${uploadPrefix}__display-text--margin`}
          key={file.name + index + file.percent + file.status}
        >
          {file.url ? (
            <Link href={file.url} target="_blank" hover="color" size="small" className={`${uploadPrefix}__single-name`}>
              {fileName}
            </Link>
          ) : (
            <span className={`${uploadPrefix}__single-name`}>{fileName}</span>
          )}
          {file.status === 'fail' && (
            <div className={`${uploadPrefix}__flow-status ${uploadPrefix}__file-fail`}>
              <ErrorCircleFilledIcon />
            </div>
          )}
          {file.status === 'waiting' && (
            <div className={`${uploadPrefix}__flow-status ${uploadPrefix}__file-waiting`}>
              <TimeFilledIcon />
            </div>
          )}
          {file.status === 'progress' && renderProgress(file.percent)}
          {!disabled && file.status !== 'progress' && (
            <CloseIcon className={`${uploadPrefix}__icon-delete`} onClick={(e) => props.onRemove({ e, file, index })} />
          )}
        </div>
      );
    });
  };

  // 输入框型预览
  const renderFilePreviewAsInput = () => {
    const file = props.displayFiles[0];
    const inputTextClass = [
      `${classPrefix}-input__inner`,
      { [`${uploadPrefix}__placeholder`]: !props.displayFiles[0] },
    ];
    const disabledClass = disabled ? `${classPrefix}-is-disabled` : '';
    const fileName =
      props.abridgeName?.length && file?.name ? abridgeName(file.name, ...props.abridgeName) : file?.name;
    return (
      <div className={`${uploadPrefix}__single-input-preview ${classPrefix}-input ${disabledClass}`}>
        <div className={classNames(inputTextClass)}>
          <span
            className={classNames(`${uploadPrefix}__single-input-text`, {
              [props.placeholderClass]: props.placeholder && !file?.name,
            })}
          >
            {file?.name ? fileName : props.placeholder}
          </span>
          {file?.status === 'progress' && renderProgress(file.percent)}
          {file?.status === 'waiting' && (
            <TimeFilledIcon className={`${uploadPrefix}__status-icon ${uploadPrefix}__file-waiting`} />
          )}
          {file?.name && file.status === 'success' && (
            <CheckCircleFilledIcon className={`${uploadPrefix}__status-icon`} />
          )}
          {file?.name && file.status === 'fail' && (
            <ErrorCircleFilledIcon className={`${uploadPrefix}__status-icon ${uploadPrefix}__file-fail`} />
          )}
          {Boolean(!disabled && file?.name) && (
            <CloseCircleFilledIcon
              className={`${uploadPrefix}__single-input-clear`}
              onClick={(e) => props.onRemove({ e, file, index: 0 })}
            />
          )}
        </div>
      </div>
    );
  };

  const { displayFiles, fileListDisplay } = props;

  const fileListDisplayNode = parseTNode(fileListDisplay, {
    onRemove: props.onRemove,
    toUploadFiles: props.toUploadFiles,
    sizeOverLimitMessage: props.sizeOverLimitMessage,
    locale: props.locale,
    files: displayFiles,
  });

  const classes = [`${uploadPrefix}__single`, `${uploadPrefix}__single-${theme}`];
  return (
    <div className={classNames(classes)}>
      {theme === 'file-input' && renderFilePreviewAsInput()}

      {props.children}

      {theme === 'file' && props.placeholder && !displayFiles[0] && (
        <small className={classNames([props.tipsClasses, props.placeholderClass])}>{props.placeholder}</small>
      )}

      {fileListDisplayNode === null ? null : fileListDisplayNode || renderFilePreviewAsText(displayFiles)}

      {/* 单文件上传失败要显示失败的原因 */}
      {!props.multiple && displayFiles[0]?.status === 'fail' && theme === 'file' ? (
        <small className={classNames(props.errorClasses)}>
          {displayFiles[0].response?.error || locale.progress.failText}
        </small>
      ) : null}
    </div>
  );
}

NormalFile.displayName = 'NormalFile';
