import type { ChangeEvent, MouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isString, isFunction } from 'lodash-es';
import type { InnerProgressContext, OnResponseErrorContext } from '../../_common/js/upload/types';
import type { SizeLimitObj, TdUploadProps, UploadChangeContext, UploadFile, UploadRemoveContext } from '../type';
import { getFileList, IMAGE_REGEXP } from '../../_common/js/upload/utils';
import {
  formatToUploadFile,
  getDisplayFiles,
  getFilesAndErrors,
  upload,
  validateFile,
} from '../../_common/js/upload/main';
import useDefaultProps from '../../hooks/useDefaultProps';
import { uploadDefaultProps } from '../defaultProps';
import useDefault from '../../_util/useDefault';

export type ValidateParams = Parameters<TdUploadProps['onValidate']>[0];

export default function useUpload(props: TdUploadProps) {
  const {
    allowUploadDuplicateFile,
    capture,
    action,
    disabled,
    autoUpload,
    multiple,
    files,
    defaultFiles,
    max,
    sizeLimit,
    headers,
    method,
    withCredentials,
    useMockProgress,
    data,
    beforeUpload,
    format,
    formatRequest,
    formatResponse,
    requestMethod,
    onChange,
    onFail,
    onProgress,
    onSuccess,
    onSelectChange,
    onValidate,
  } = useDefaultProps(props, uploadDefaultProps);
  const [uploadValue, setUploadValue] = useDefault(files, defaultFiles, onChange);
  const [isUploading, setUploading] = useState(false);
  const [toUploadFiles, setToUploadFiles] = useState<UploadFile[]>([]);
  const [sizeOverLimitMessage, setSizeOverLimitMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrReq = useRef<{ files: UploadFile[]; xhrReq: XMLHttpRequest }[]>([]);
  const objectUrlsRef = useRef<string[]>([]);

  const displayFiles = useMemo(
    () =>
      getDisplayFiles({
        multiple,
        toUploadFiles,
        uploadValue,
        autoUpload,
        isBatchUpload: false,
      }),
    [multiple, toUploadFiles, uploadValue, autoUpload],
  );

  const isImageFile = (file: UploadFile): boolean => {
    const fileType = file.raw?.type || file.type || '';
    const url = file.url || '';
    return /^image\//.test(fileType) || IMAGE_REGEXP.test(fileType) || IMAGE_REGEXP.test(url);
  };

  // 为图片文件生成 objectUrl，实现选择后立即回显预览
  const createObjectUrl = (file: UploadFile): UploadFile => {
    if (file.raw && isImageFile(file) && !file.url) {
      const objectUrl = URL.createObjectURL(file.raw);
      objectUrlsRef.current.push(objectUrl);
      return { ...file, url: objectUrl };
    }
    return file;
  };

  // 组件卸载时释放生成的 objectUrl
  useEffect(
    () => () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    },
    [],
  );

  const uploadFilePercent = ({ file, percent }: { file: UploadFile; percent: number }) => {
    const index = toUploadFiles.findIndex((item) => item.raw === file.raw);
    setToUploadFiles((toUploadFiles: UploadFile[]) => {
      const newUploadFiles = [...toUploadFiles];
      newUploadFiles[index] = { ...toUploadFiles[index], percent };
      return newUploadFiles;
    });
  };

  const updateFilesProgress = () => {
    if (!autoUpload) {
      return;
    }
    setToUploadFiles([...toUploadFiles]);
  };

  const onResponseError = (e: OnResponseErrorContext) => {
    if (!e || !e.files || !e.files[0]) {
      return;
    }
    const { event, files } = e;
    updateFilesProgress();
    // 单选或多文件替换，需要清空上一次上传成功的文件
    if (!multiple) {
      setUploadValue([], {
        trigger: 'progress-fail',
        e: event,
        file: files[0],
      });
    }
  };

  // 多文件上传场景，单个文件进度
  const onResponseProgress = (p: InnerProgressContext) => {
    const { event, file, files, percent, type, XMLHttpRequest } = p;
    updateFilesProgress();
    onProgress?.({
      e: event,
      currentFiles: files,
      file,
      percent,
      type,
      XMLHttpRequest,
    });
  };

  // 多文件上传场景，单文件上传成功后
  const onResponseSuccess = () => {
    // 只有多个上传请求同时触发时才需 onOneFileSuccess
    if (multiple) {
      updateFilesProgress();
    }
  };

  const t = function <T>(pattern: T, ...args: any[]) {
    const [data] = args;
    if (isString(pattern)) {
      if (!data) return pattern;
      const regular = /\{\s*([\w-]+)\s*\}/g;
      return pattern.replace(regular, (match, key) => {
        if (data) {
          return String(data[key]);
        }
        return '';
      });
    }
    if (isFunction(pattern)) {
      // 重要：组件的渲染必须存在参数 h，不能移除
      if (!args.length) {
        return null;
      }
      return pattern(...args);
    }
    return '';
  };

  const getSizeLimitError: (sizeLimitObj: SizeLimitObj) => any = (sizeLimitObj: SizeLimitObj) => {
    const limit = sizeLimitObj;
    return limit.message
      ? t(limit.message, { sizeLimit: limit.size })
      : `${t('', { sizeLimit: limit.size })} ${limit.unit}`;
  };

  const handleNotAutoUpload = (toFiles: UploadFile[]) => {
    const tmpFiles = multiple ? uploadValue.concat(toFiles) : toFiles;
    if (!tmpFiles.length) return;
    // 使用 URL.createObjectURL 为图片文件生成即时预览 URL
    const filesWithUrl = tmpFiles.map((file) => {
      if (file.url) return file;
      return createObjectUrl(file);
    });
    setUploadValue(filesWithUrl as UploadFile[], {
      trigger: 'add',
      index: uploadValue.length,
      file: toFiles[0],
      files: toFiles,
    });
    setToUploadFiles([]);
  };

  const onFileChange = (files: File[]) => {
    if (disabled) {
      return;
    }
    const params = { currentSelectedFiles: formatToUploadFile([...files], props.format) };
    onSelectChange?.([...files], params);
    validateFile({
      uploadValue,
      files: [...files],
      allowUploadDuplicateFile,
      capture,
      max,
      sizeLimit,
      autoUpload,
      format,
      beforeUpload,
    }).then((args) => {
      // 自定义全文件校验不通过
      if (args.validateResult?.type === 'BEFORE_ALL_FILES_UPLOAD') {
        const params: ValidateParams = { type: 'BEFORE_ALL_FILES_UPLOAD', files: args.files as UploadFile[] };
        onValidate?.(params);
        return;
      }
      // 文件数量校验不通过
      if (args.lengthOverLimit) {
        const params: ValidateParams = { type: 'FILES_OVER_LENGTH_LIMIT', files: args.files as UploadFile[] };
        onValidate?.(params);
        if (!(args.files as UploadFile[]).length) return;
      }
      // 过滤相同的文件名
      if (args.hasSameNameFile) {
        const params: ValidateParams = { type: 'FILTER_FILE_SAME_NAME', files: args.files as UploadFile[] };
        onValidate?.(params);
      }
      // 文件大小校验结果处理（已过滤超出限制的文件）
      if (args.fileValidateList instanceof Array) {
        const { sizeLimitErrors, beforeUploadErrorFiles, toFiles } = getFilesAndErrors(
          args.fileValidateList,
          getSizeLimitError,
        );
        // 自动上传模式下，为图片文件生成 objectUrl 以实现选择后立即回显预览
        const filesWithPreview = autoUpload ? toFiles.map(createObjectUrl) : toFiles;
        const tmpWaitingFiles = autoUpload ? filesWithPreview : [...toUploadFiles].concat(filesWithPreview);
        setToUploadFiles(tmpWaitingFiles);
        // 文件大小处理
        if (sizeLimitErrors[0]) {
          setSizeOverLimitMessage(sizeLimitErrors[0]?.file?.response?.error);
          onValidate?.({
            type: 'FILE_OVER_SIZE_LIMIT',
            files: sizeLimitErrors.map((t) => t.file),
          });
        } else {
          setSizeOverLimitMessage('');
          // 自定义方法 beforeUpload 拦截的文件
          if (beforeUploadErrorFiles.length) {
            const params: ValidateParams = { type: 'CUSTOM_BEFORE_UPLOAD', files: beforeUploadErrorFiles };
            onValidate?.(params);
          }
        }
        // 如果是自动上传
        if (autoUpload) {
          uploadFiles(tmpWaitingFiles);
        } else {
          handleNotAutoUpload(tmpWaitingFiles);
        }
      }
    });

    // 清空 <input type="file"> 元素的文件，避免出现重复文件无法选择的情况
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onNormalFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = getFileList(e.target.files as FileList);
    onFileChange?.(fileList);
  };

  /**
   * 上传文件。对外暴露方法，修改时需谨慎
   * @param toFiles 本地上传的文件列表
   */
  function uploadFiles(toFiles?: UploadFile[]) {
    const notUploadedFiles = uploadValue.filter((t) => t.status !== 'success');
    const files = autoUpload ? toFiles || toUploadFiles : notUploadedFiles;
    if (!files || !files.length) {
      return;
    }
    setUploading(true);
    xhrReq.current = [];
    upload({
      action,
      headers,
      method,
      withCredentials,
      uploadedFiles: uploadValue,
      toUploadFiles: files,
      multiple,
      autoUpload,
      useMockProgress,
      data,
      requestMethod,
      formatRequest,
      formatResponse,
      onResponseProgress,
      onResponseSuccess,
      onResponseError,
      setXhrObject: (xhr) => {
        if (xhr.files[0]?.raw && xhrReq.current.find((item) => item.files[0]?.raw === xhr.files[0].raw)) {
          return;
        }
        xhrReq.current = xhrReq.current.concat(xhr);
      },
    }).then(
      // 多文件场景时，全量文件完成后
      ({ status, data, list, failedFiles }) => {
        setUploading(false);
        if (status === 'success') {
          if (autoUpload) {
            setUploadValue([...(data?.files as UploadFile[])], {
              trigger: 'add',
              file: (data?.files as UploadFile[])[0],
            });
          }
          xhrReq.current = [];
          onSuccess?.({
            fileList: data?.files,
            currentFiles: files,
            file: files[0],
            // 只有全部请求完成后，才会存在该字段
            // @ts-ignore
            results: list?.map((t) => t.data),
            // 单文件单请求有一个 response，多文件多请求有多个 response
            response: data?.response || list?.map((t) => t.data?.response),
            XMLHttpRequest: data?.XMLHttpRequest,
          });
        } else if (failedFiles?.[0]) {
          onFail?.({
            e: data?.event,
            file: failedFiles[0],
            failedFiles,
            currentFiles: files,
            response: data?.response,
            XMLHttpRequest: data?.XMLHttpRequest,
          });
        }

        // 非自动上传，文件都在 uploadValue，不涉及 toUploadFiles
        if (autoUpload) {
          setToUploadFiles(failedFiles);
        }
      },
    );
  }

  function onInnerRemove(p: UploadRemoveContext) {
    setSizeOverLimitMessage('');
    p.e.stopPropagation?.();
    const changePrams: UploadChangeContext = {
      e: p.e,
      trigger: 'remove',
      index: p.index,
      file: p.file,
    };
    // remove all files for batchUpload
    if (!multiple) {
      setToUploadFiles([]);
      setUploadValue([], changePrams);
    } else if (!autoUpload) {
      const curUploadValue = [...uploadValue];
      curUploadValue.splice(p.index, 1);
      setUploadValue([...curUploadValue], changePrams);
    } else {
      // autoUpload 场景下， p.index < uploadValue.length 表示移除已经上传成功的文件；反之表示移除待上传列表文件
      // eslint-disable-next-line
      if (p.index < uploadValue.length) {
        const curUploadValue = [...uploadValue];
        curUploadValue.splice(p.index, 1);
        setUploadValue([...curUploadValue], changePrams);
      } else {
        const curToUploadFiles = [...toUploadFiles];
        curToUploadFiles.splice(p.index - uploadValue.length, 1);
        setToUploadFiles(curToUploadFiles);
      }
    }
    props.onRemove?.(p);
  }

  const cancelUpload = (context?: { file?: UploadFile; e?: MouseEvent }) => {
    xhrReq.current?.forEach((item) => {
      item.xhrReq?.abort();
    });
    setUploading(false);

    if (autoUpload) {
      setToUploadFiles((toUploadFiles) => toUploadFiles.map((item) => ({ ...item, status: 'waiting' })));
    } else {
      const newUploadValue = uploadValue.map((item) => {
        if (item.status !== 'success') {
          return { ...item, status: 'waiting' };
        }
        return item;
      });
      setUploadValue(newUploadValue as UploadFile[], { trigger: 'abort' });
    }

    if (context?.file && !autoUpload) {
      onInnerRemove?.({ file: context.file, e: context.e as MouseEvent<HTMLElement>, index: 0 });
    }
  };

  return {
    toUploadFiles,
    uploadValue,
    displayFiles,
    sizeOverLimitMessage,
    isUploading,
    inputRef,
    disabled,
    xhrReq,
    isImageFile,
    uploadFilePercent,
    uploadFiles,
    onFileChange,
    onNormalFileChange,
    onInnerRemove,
    cancelUpload,
    setUploadValue,
  };
}
