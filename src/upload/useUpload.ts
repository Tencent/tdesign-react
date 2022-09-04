import { useRef, useState, useMemo, ChangeEventHandler } from 'react';
import { SizeLimitObj, TdUploadProps, UploadFile } from './type';
import {
  getFilesAndErrors,
  validateFile,
  upload,
  getTriggerTextField,
  getDisplayFiles,
} from '../_common/js/upload/main';
import useControlled from '../hooks/useControlled';
import { InnerProgressContext, OnResponseErrorContext, SuccessContext } from '../_common/js/upload/types';
import { RemoveContext } from './NormalFile';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';

/**
 * 上传组件全部逻辑，方便脱离 UI，自定义 UI 组件
 */
export default function useUpload(props: TdUploadProps) {
  const inputRef = useRef();
  // TODO: Form 表单控制上传组件是否禁用
  const { disabled } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');
  const [uploadValue, setUploadValue] = useControlled(props, 'files', props.onChange);
  // TODO: 可能存在多个请求，一个不够
  const [xhrReq, setXhrReq] = useState<XMLHttpRequest>();
  const [toUploadFiles, setToUploadFiles] = useState<UploadFile[]>([]);
  const [sizeOverLimitMessage, setSizeOverLimitMessage] = useState('');

  const tipsClasses = `${classPrefix}-upload__tips ${classPrefix}-size-s`;
  const errorClasses = [tipsClasses].concat(`${classPrefix}-upload__tips-error`);

  // 单文件场景：触发元素文本
  const triggerUploadText = useMemo(() => {
    const field = getTriggerTextField({
      multiple: props.multiple,
      status: uploadValue?.[0]?.status,
    });
    return locale.triggerUploadText[field];
  }, [locale.triggerUploadText, props.multiple, uploadValue]);

  const [uploading, setUploading] = useState(false);

  // 文件列表显示的内容（自动上传和非自动上传有所不同）
  const displayFiles = useMemo(
    () => getDisplayFiles({ multiple: props.multiple, toUploadFiles, uploadValue }),
    [props.multiple, toUploadFiles, uploadValue],
  );

  const onResponseError = (p: OnResponseErrorContext) => {
    if (!p) return;
    const { response, event, files } = p;
    props.onOneFileFail?.({
      e: event,
      file: files?.[0],
      currentFiles: files,
      failedFiles: files,
      response,
    });
  };

  const onResponseProgress = (p: InnerProgressContext) => {
    props.onProgress?.({
      e: p.event,
      file: p.file,
      currentFiles: p.files,
      percent: p.percent,
      type: p.type,
    });
  };

  // 只有多个上传请求同时触发时才需 onOneFileSuccess
  const onResponseSuccess = (p: SuccessContext) => {
    if (!props.multiple || props.uploadAllFilesInOneRequest) return;
    props.onOneFileSuccess?.({
      e: p.event,
      file: p.files[0],
      response: p.response,
    });
  };

  function getSizeLimitError(sizeLimitObj: SizeLimitObj) {
    const limit = sizeLimitObj;
    return limit.message
      ? t(limit.message, { sizeLimit: limit.size })
      : `${t(locale.sizeLimitMessage, { sizeLimit: limit.size })} ${limit.unit}`;
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (props.disabled) return;
    const { files } = event.target;
    // @ts-ignore
    props.onSelectChange?.([...files], { currentSelectedFiles: toUploadFiles });
    validateFile({
      uploadValue,
      // @ts-ignore
      files: [...files],
      allowUploadDuplicateFile: props.allowUploadDuplicateFile,
      max: props.max,
      sizeLimit: props.sizeLimit,
      format: props.format,
      beforeUpload: props.beforeUpload,
      beforeAllFilesUpload: props.beforeAllFilesUpload,
    }).then((args) => {
      // 自定义全文件校验不通过
      if (args.validateResult?.type === 'BEFORE_ALL_FILES_UPLOAD') return;
      // 文件数量校验不通过
      if (args.lengthOverLimit) {
        props.onValidate?.({ type: 'FILES_OVER_LENGTH_LIMIT', files: args.files });
      }
      // 文件大小校验结果处理
      if (args.fileValidateList instanceof Array) {
        const { sizeLimitErrors, toFiles } = getFilesAndErrors(args.fileValidateList, getSizeLimitError);
        const tmpWatingFiles = props.autoUpload ? toFiles : toUploadFiles.concat(toFiles);
        setToUploadFiles(tmpWatingFiles);
        props.onWaitingUploadFilesChange?.({ files: tmpWatingFiles, trigger: 'validate' });
        // 错误信息处理
        if (sizeLimitErrors[0]) {
          setSizeOverLimitMessage(sizeLimitErrors[0].file.response.error);
          props.onValidate?.({ type: 'FILE_OVER_SIZE_LIMIT', files: sizeLimitErrors.map((t) => t.file) });
          return;
        }
        setSizeOverLimitMessage('');
        // 如果是自动上传
        if (props.autoUpload) {
          uploadFiles(toFiles);
        }
      }
    });
  };

  /**
   * 上传文件
   * 对外暴露方法，修改时需谨慎
   */
  function uploadFiles(toFiles?: UploadFile[]) {
    const files = toFiles || toUploadFiles;
    setUploading(true);
    upload({
      action: props.action,
      uploadedFiles: uploadValue,
      toUploadFiles: files,
      multiple: props.multiple,
      isBatchUpload: props.isBatchUpload,
      uploadAllFilesInOneRequest: props.uploadAllFilesInOneRequest,
      useMockProgress: props.useMockProgress,
      data: props.data,
      requestMethod: props.requestMethod,
      formatRequest: props.formatRequest,
      formatResponse: props.formatResponse,
      onResponseProgress,
      onResponseSuccess,
      onResponseError,
      setXhrObject: (val) => {
        setXhrReq(val);
      },
    }).then(({ status, data, list, failedFiles }) => {
      if (status === 'success') {
        setUploadValue(data.files, {
          e: data.event,
          trigger: 'add',
          index: uploadValue.length,
          file: data.files[0],
        });
        props.onSuccess?.({
          fileList: data.files,
          currentFiles: toUploadFiles,
          // 只有全部请求完成后，才会存在该字段
          results: list?.map((t) => t.data),
        });
      } else {
        props.onFail({
          e: data.event,
          file: failedFiles?.[0],
          failedFiles,
          currentFiles: files,
          response: data.response,
        });
      }
      setToUploadFiles(failedFiles);
      props.onWaitingUploadFilesChange?.({ files: failedFiles, trigger: 'uploaded' });

      setUploading(false);
    }, onResponseError);
  }

  function onRemove(p: RemoveContext) {
    setSizeOverLimitMessage('');
    const tmpFiles = [...uploadValue];
    tmpFiles.splice(p.index, 1);
    setUploadValue(tmpFiles, {
      e: p.e,
      trigger: 'remove',
      index: p.index,
      file: p.file,
    });

    const index = toUploadFiles.findIndex((t) => t.raw === p.file.raw);
    if (index >= 0) {
      const tmpToFiles = [...toUploadFiles];
      tmpToFiles.splice(index, 1);
      setToUploadFiles(tmpToFiles);
      props.onWaitingUploadFilesChange?.({ files: tmpToFiles, trigger: 'remove' });
    }

    props.onRemove?.(p);
  }

  const triggerUpload = () => {
    if (disabled) return;
    (inputRef.current as HTMLInputElement).click();
  };

  const cancelUpload = () => {
    xhrReq.abort();
  };

  return {
    t,
    locale,
    classPrefix,
    triggerUploadText,
    toUploadFiles,
    uploadValue,
    displayFiles,
    sizeOverLimitMessage,
    uploading,
    tipsClasses,
    errorClasses,
    inputRef,
    disabled,
    uploadFiles,
    onFileChange,
    onRemove,
    triggerUpload,
    cancelUpload,
  };
}
