import { useRef, useState, useMemo, ChangeEventHandler, DragEvent, MouseEvent, useEffect } from 'react';
import merge from 'lodash/merge';
import { SizeLimitObj, TdUploadProps, UploadChangeContext, UploadFile, UploadRemoveContext } from '../type';
import {
  getFilesAndErrors,
  validateFile,
  upload,
  getTriggerTextField,
  getDisplayFiles,
  formatToUploadFile,
} from '../../_common/js/upload/main';
import { getFileUrlByFileRaw } from '../../_common/js/upload/utils';
import useControlled from '../../hooks/useControlled';
import { InnerProgressContext, OnResponseErrorContext, SuccessContext } from '../../_common/js/upload/types';
import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

/**
 * 上传组件全部逻辑，方便脱离 UI，自定义 UI 组件
 */
export default function useUpload(props: TdUploadProps) {
  const inputRef = useRef<HTMLInputElement>();
  // TODO: Form 表单控制上传组件是否禁用
  const { disabled, autoUpload, isBatchUpload } = props;
  const { classPrefix } = useConfig();
  const [globalLocale, t] = useLocaleReceiver('upload');
  const [uploadValue, setUploadValue] = useControlled(props, 'files', props.onChange);
  const xhrReq = useRef<{ files: UploadFile[]; xhrReq: XMLHttpRequest }[]>([]);
  const [toUploadFiles, setToUploadFiles] = useState<UploadFile[]>([]);
  const [sizeOverLimitMessage, setSizeOverLimitMessage] = useState('');

  const locale = useMemo(() => merge({}, globalLocale, props.locale), [globalLocale, props.locale]);

  const tipsClasses = `${classPrefix}-upload__tips ${classPrefix}-size-s`;
  const errorClasses = [tipsClasses].concat(`${classPrefix}-upload__tips-error`);
  const placeholderClass = `${classPrefix}-upload__placeholder`;

  // 单文件场景：触发元素文本
  const triggerUploadText = useMemo(() => {
    const field = getTriggerTextField({
      isBatchUpload,
      multiple: props.multiple,
      status: uploadValue?.[0]?.status,
      autoUpload,
    });
    return locale.triggerUploadText[field];
  }, [locale.triggerUploadText, uploadValue, props.multiple, isBatchUpload, autoUpload]);

  const [uploading, setUploading] = useState(false);

  // 文件列表显示的内容（自动上传和非自动上传有所不同）
  const [displayFiles, setDisplayFiles] = useState(uploadValue);
  useEffect(() => {
    const files = getDisplayFiles({
      multiple: props.multiple,
      toUploadFiles,
      uploadValue: [...uploadValue],
      autoUpload,
      isBatchUpload,
    });
    setDisplayFiles(files);
  }, [props.multiple, toUploadFiles, uploadValue, autoUpload, isBatchUpload]);

  const updateProgress = (
    p: InnerProgressContext | SuccessContext | OnResponseErrorContext,
    toFiles: UploadFile[],
    trigger: 'progress' | 'progress-success' | 'progress-fail',
  ) => {
    if (props.autoUpload) {
      setToUploadFiles([...toFiles]);
    } else {
      setUploadValue([...uploadValue], {
        e: p.event,
        trigger,
        index: uploadValue.length,
        file: p.files[0],
      });
    }
  };

  const onResponseError = (p: OnResponseErrorContext, toFiles?: UploadFile[]) => {
    if (!p || !p.files || !p.files[0]) return;
    if (toFiles) {
      updateProgress(p, toFiles, 'progress-fail');
    }
    const { response, event, files } = p;
    props.onOneFileFail?.({
      e: event,
      file: files?.[0],
      currentFiles: files,
      failedFiles: files,
      response,
    });
  };

  const onResponseProgress = (p: InnerProgressContext, toFiles: UploadFile[]) => {
    updateProgress(p, toFiles, 'progress');
    props.onProgress?.({
      e: p.event,
      file: p.file,
      currentFiles: p.files,
      percent: p.percent,
      type: p.type,
      XMLHttpRequest: p.XMLHttpRequest,
    });
  };

  // 只有多个上传请求同时触发时才需 onOneFileSuccess
  const onResponseSuccess = (p: SuccessContext, toFiles: UploadFile[]) => {
    if (props.multiple && !props.uploadAllFilesInOneRequest) {
      updateProgress(p, toFiles, 'progress-success');
      props.onOneFileSuccess?.({
        e: p.event,
        file: p.files[0],
        response: p.response,
      });
    }
  };

  function getSizeLimitError(sizeLimitObj: SizeLimitObj) {
    const limit = sizeLimitObj;
    return limit.message
      ? t(limit.message, { sizeLimit: limit.size })
      : `${t(locale.sizeLimitMessage, { sizeLimit: limit.size })} ${limit.unit}`;
  }

  const handleNotAutoUpload = (toFiles: UploadFile[]) => {
    const tmpFiles = props.multiple && !isBatchUpload ? uploadValue.concat(toFiles) : toFiles;
    if (!tmpFiles.length) return;
    // 图片需要本地预览
    if (['image', 'image-flow'].includes(props.theme)) {
      const list = tmpFiles.map(
        (file) =>
          new Promise((resolve) => {
            getFileUrlByFileRaw(file.raw).then((url) => {
              resolve({ ...file, url: file.url || url });
            });
          }),
      );
      Promise.all(list).then((files) => {
        setUploadValue(files, {
          trigger: 'add',
          index: uploadValue.length,
          file: toFiles[0],
          files: toFiles,
        });
      });
    } else {
      setUploadValue(tmpFiles, {
        trigger: 'add',
        index: uploadValue.length,
        file: toFiles[0],
        files: toFiles,
      });
    }
    // toUploadFiles.current = [];
    setToUploadFiles([]);
  };

  const onFileChange = (files: FileList) => {
    if (disabled) return;
    // @ts-ignore
    props.onSelectChange?.([...files], { currentSelectedFiles: formatToUploadFile([...files], props.format) });
    validateFile({
      uploadValue,
      // @ts-ignore
      files: [...files],
      allowUploadDuplicateFile: props.allowUploadDuplicateFile,
      max: props.max,
      sizeLimit: props.sizeLimit,
      isBatchUpload,
      autoUpload,
      format: props.format,
      beforeUpload: props.beforeUpload,
      beforeAllFilesUpload: props.beforeAllFilesUpload,
    }).then((args) => {
      // 自定义全文件校验不通过
      if (args.validateResult?.type === 'BEFORE_ALL_FILES_UPLOAD') {
        props.onValidate?.({ type: 'BEFORE_ALL_FILES_UPLOAD', files: args.files });
        return;
      }
      // 文件数量校验不通过
      if (args.lengthOverLimit) {
        props.onValidate?.({ type: 'FILES_OVER_LENGTH_LIMIT', files: args.files });
        if (!args.files.length) return;
      }
      // 过滤相同的文件名
      if (args.hasSameNameFile) {
        props.onValidate?.({ type: 'FILTER_FILE_SAME_NAME', files: args.files });
      }
      // 文件大小校验结果处理（已过滤超出限制的文件）
      if (args.fileValidateList instanceof Array) {
        const { sizeLimitErrors, beforeUploadErrorFiles, toFiles } = getFilesAndErrors(
          args.fileValidateList,
          getSizeLimitError,
        );
        const tmpWaitingFiles = autoUpload ? toFiles : toUploadFiles.concat(toFiles);
        props.onWaitingUploadFilesChange?.({ files: tmpWaitingFiles, trigger: 'validate' });
        // 文件大小处理
        if (sizeLimitErrors[0]) {
          setSizeOverLimitMessage(sizeLimitErrors[0].file.response.error);
          props.onValidate?.({ type: 'FILE_OVER_SIZE_LIMIT', files: sizeLimitErrors.map((t) => t.file) });
        } else {
          setSizeOverLimitMessage('');
          // 自定义方法 beforeUpload 拦截的文件
          if (beforeUploadErrorFiles.length) {
            props.onValidate?.({ type: 'CUSTOM_BEFORE_UPLOAD', files: beforeUploadErrorFiles });
          }
        }
        // 如果是自动上传
        if (autoUpload) {
          setToUploadFiles(tmpWaitingFiles);
          uploadFiles(tmpWaitingFiles);
        } else {
          handleNotAutoUpload(tmpWaitingFiles);
        }
      }
    });

    // 清空 <input type="file"> 元素的文件，避免出现重复文件无法选择的情况
    inputRef.current.value = null;
  };

  const onNormalFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onFileChange?.(e.target.files);
  };

  function onDragFileChange(e: DragEvent<HTMLDivElement>) {
    onFileChange?.(e.dataTransfer.files);
  }

  /**
   * 上传文件。对外暴露方法，修改时需谨慎
   * @param toFiles 本地上传的文件列表
   */
  function uploadFiles(toFiles?: UploadFile[]) {
    const notUploadedFiles = uploadValue.filter((t) => t.status !== 'success');
    const files = autoUpload ? toFiles : notUploadedFiles;
    if (!files || !files.length) return;
    xhrReq.current = [];
    setUploading(true);
    upload({
      action: props.action,
      method: props.method,
      headers: props.headers,
      name: props.name,
      withCredentials: props.withCredentials,
      uploadedFiles: uploadValue,
      toUploadFiles: files,
      multiple: props.multiple,
      isBatchUpload,
      autoUpload,
      uploadAllFilesInOneRequest: props.uploadAllFilesInOneRequest,
      useMockProgress: props.useMockProgress,
      data: props.data,
      mockProgressDuration: props.mockProgressDuration,
      requestMethod: props.requestMethod,
      formatRequest: props.formatRequest,
      formatResponse: props.formatResponse,
      onResponseProgress: (p) => onResponseProgress(p, toFiles),
      onResponseSuccess: (p) => onResponseSuccess(p, toFiles),
      onResponseError: (p) => onResponseError(p, toFiles),
      setXhrObject: (xhr) => {
        if (xhr.files[0]?.raw && xhrReq.current.find((item) => item.files[0].raw === xhr.files[0].raw)) return;
        xhrReq.current = xhrReq.current.concat(xhr);
      },
    }).then(({ status, data, list, failedFiles }) => {
      setUploading(false);
      if (status === 'success') {
        // 全部上传成功后，一次性添加（非自动上传已在上一步添加）
        if (props.autoUpload) {
          setUploadValue([...data.files], {
            trigger: 'add',
            file: data.files[0],
          });
        }
        props.onSuccess?.({
          fileList: data.files,
          currentFiles: files,
          file: files[0],
          // 只有全部请求完成后，才会存在该字段
          results: list?.map((t) => t.data),
          // 单文件单请求有一个 response，多文件多请求有多个 response
          response: data.response || list.map((t) => t.data.response),
          XMLHttpRequest: data.XMLHttpRequest,
        });
        xhrReq.current = [];
      } else if (failedFiles?.[0]) {
        props.onFail?.({
          e: data.event,
          file: failedFiles[0],
          failedFiles,
          currentFiles: files,
          response: data.response,
          XMLHttpRequest: data.XMLHttpRequest,
        });
      }

      // 非自动上传，文件都在 uploadValue，不涉及 toUploadFiles
      if (autoUpload) {
        setToUploadFiles(failedFiles);
        props.onWaitingUploadFilesChange?.({ files: failedFiles, trigger: 'uploaded' });
      }
    });
  }

  function onRemove(p: UploadRemoveContext) {
    setSizeOverLimitMessage('');
    const changePrams: UploadChangeContext = {
      e: p.e,
      trigger: 'remove',
      index: p.index,
      file: p.file,
    };
    // remove all files for batchUpload
    if (isBatchUpload || !props.multiple) {
      props.onWaitingUploadFilesChange?.({ files: [], trigger: 'remove' });
      setUploadValue([], changePrams);
      setToUploadFiles([]);
      xhrReq.current = [];
    } else if (!props.autoUpload) {
      uploadValue.splice(p.index, 1);
      setUploadValue([...uploadValue], changePrams);
    } else if (p.index < uploadValue.length) {
      // autoUpload 场景下， p.index < uploadValue.length 表示移除已经上传成功的文件；反之表示移除待上传列表文件
      uploadValue.splice(p.index, 1);
      setUploadValue([...uploadValue], changePrams);
    } else {
      const tmpFiles = [...toUploadFiles];
      tmpFiles.splice(p.index - uploadValue.length, 1);
      // toUploadFiles.current = [...tmpFiles];
      setToUploadFiles([...tmpFiles]);
      props.onWaitingUploadFilesChange?.({ files: [...tmpFiles], trigger: 'remove' });
    }
    props.onRemove?.(p);
  }

  const triggerUpload = () => {
    if (disabled || !inputRef.current) return;
    (inputRef.current as HTMLInputElement).click();
  };

  const cancelUpload = (context?: { file?: UploadFile; e?: MouseEvent<HTMLElement> }) => {
    xhrReq.current?.forEach((item) => {
      item.xhrReq?.abort();
    });
    setUploading(false);

    if (autoUpload) {
      // toUploadFiles.current = toUploadFiles.current.map((item) => ({ ...item, status: 'waiting' }));
      setToUploadFiles(toUploadFiles.map((item) => ({ ...item, status: 'waiting' })));
    } else {
      setUploadValue(
        uploadValue.map((item) => {
          if (item.status !== 'success') {
            return { ...item, status: 'waiting' };
          }
          return item;
        }),
        { trigger: 'abort' },
      );
    }

    if (context?.file && !autoUpload) {
      onRemove?.({ file: context.file, e: context.e, index: 0 });
    }

    props.onCancelUpload?.();
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
    placeholderClass,
    inputRef,
    disabled,
    xhrReq,
    uploadFiles,
    onFileChange,
    onNormalFileChange,
    onDragFileChange,
    onRemove,
    triggerUpload,
    cancelUpload,
  };
}
