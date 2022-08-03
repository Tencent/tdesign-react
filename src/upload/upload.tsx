import React, { ChangeEvent, forwardRef, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import lodashUpdate from 'lodash/update';
import findIndex from 'lodash/findIndex';
import classNames from 'classnames';
import Dialog from '../dialog';
import Dragger from './dragger';
import UploadTrigger from './upload-trigger';
import Tips from './tips';
import request from '../_common/js/upload/xhr';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import SingleFile from './themes/single-file';
import ImageCard from './themes/image-card';
import FlowList from './themes/flow-list/index';
import BooleanRender from './boolean-render';
import { finishUpload, isSingleFile, urlCreator } from './util';
import type { FlowRemoveContext, TdUploadFile, UploadProps } from './types';
import type { ProgressContext, RequestMethodResponse, SuccessContext, UploadFile, UploadRemoveContext } from './type';
import useControlled from '../hooks/useControlled';
import useSizeLimit from './hooks/useSizeLimit';
import { uploadDefaultProps } from './defaultProps';
import log from '../_common/js/log';

const Upload = forwardRef((props: UploadProps, ref) => {
  const {
    method = 'post',
    disabled,
    multiple,
    accept,
    draggable,
    placeholder,
    max = 0,
    name = 'file',
    theme = 'file',
    showUploadProgress = true,
    action,
    tips,
    format,
    data,
    withCredentials,
    autoUpload = true,
    sizeLimit,
    formatResponse,
    beforeUpload,
    onProgress,
    onSuccess,
    onFail,
    onRemove,
    onDragenter,
    onDragleave,
    onDrop,
    onPreview,
    onSelectChange,
    onCancelUpload,
    requestMethod,
    customDraggerRender,
    className,
    style,
    children,
    locale: localeFromProps, // 单组件的文案配置 区别于全局的locale
  } = props;

  const [fileList, onChange] = useControlled(props, 'files', props.onChange);

  const { headers } = props;

  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');
  const uploadRef = useRef<HTMLInputElement>();
  const filesRef = useRef<TdUploadFile[]>(fileList);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toUploadFiles, setToUploadFiles] = useState([]); // 等待上传的文件队列

  // region img preview dialog
  const showImgDialog = ['image', 'image-flow', 'custom'].includes(theme);
  const [showImg, setShowImg] = useState(false);
  const [imgURL, setImgURL] = useState('');
  const closePreview = useCallback(() => {
    setShowImg(false);
    setImgURL('');
  }, []);
  const handleSizeLimit = useSizeLimit();
  // handle event of preview img dialog event
  const handlePreviewImg = useCallback(
    (file: UploadFile, event: MouseEvent<HTMLDivElement>) => {
      if (!file.url) throw new Error('Error file');
      setImgURL(file.url);
      setShowImg(true);
      onPreview?.({ file, e: event });
    },
    [onPreview],
  );
  // end region

  const errorText = t(locale.progress.failText);

  const triggerUpload = () => {
    if (disabled) return;
    uploadRef?.current.click();
  };

  const multiUpdateFileList = (file: TdUploadFile, deleteFile = false) => {
    const nextFileList = [...filesRef.current];
    const fileIndex = nextFileList.findIndex(({ uid }: TdUploadFile) => uid === file.uid);
    if (deleteFile) {
      fileIndex !== -1 && nextFileList.splice(fileIndex, 1);
      return nextFileList;
    }
    if (fileIndex === -1) {
      nextFileList.push(file);
    } else {
      nextFileList[fileIndex] = file;
    }

    return nextFileList;
  };

  const getLimitedFiles = (files: Array<TdUploadFile> = []) => {
    const isSingleMode = isSingleFile(multiple, theme);
    const mergedLen = files.length + fileList.length;

    if (isSingleMode) {
      return files.splice(0, 1);
    }

    // 限制了最大张数
    if (max > 0) {
      const limitedFiles = mergedLen > max ? files.slice(0, max - fileList.length) : files;
      return fileList.concat(limitedFiles);
    }

    return fileList.concat(files);
  };

  const onError = useCallback(
    (options: { event?: ProgressEvent; file: TdUploadFile; response?: any }) => {
      const { event, file, response } = options;
      file.status = 'fail';
      let res = response;
      if (typeof formatResponse === 'function') {
        res = formatResponse(response, { file });
      }

      setErrorMsg(res?.error || errorText);
      const context = { e: event, file };
      const nextFileList = multiUpdateFileList(file, true);
      onChange?.(nextFileList, { trigger: 'upload fail' });
      onFail?.(context);
    },
    [formatResponse, errorText, onChange, onFail],
  );

  const singleDraggable = useMemo(
    () => (!multiple || ['file', 'file-input', 'image', 'custom'].includes(theme)) && draggable,
    [draggable, multiple, theme],
  );

  const handleSingleRemove = (e) => {
    const changeCtx = { trigger: 'remove' };
    // setFileList([]);
    setErrorMsg('');
    onChange?.([], changeCtx);
    onRemove?.({ e });
  };

  const handleSuccess = useCallback(
    ({ e, file: tmpFile, response }: SuccessContext) => {
      const file = tmpFile;
      file.status = 'success';
      file.url = response.url || file.url;
      const context = { e, response, trigger: 'upload-success' };
      const nextFileList = multiUpdateFileList(file);
      const sContext = {
        file,
        fileList: nextFileList,
        e,
        response,
      };
      setToUploadFiles((toUploadFiles) => toUploadFiles.filter((toUploadFile) => toUploadFile.name !== file.name));
      onChange?.(nextFileList, context);
      onSuccess?.(sContext);
    },
    [onChange, onSuccess],
  );

  const handleProgress = useCallback(
    ({ e, file, percent, type = 'mock' }: ProgressContext) => {
      const tmpFile = { ...file };
      tmpFile.percent = percent;
      const progressCtx = { percent, e, file: tmpFile, type };
      const nextFileList = multiUpdateFileList(tmpFile);
      onChange?.(nextFileList, { trigger: 'progress' });
      onProgress?.(progressCtx);
    },
    [onChange, onProgress],
  );

  const handleRequestMethod = useCallback(
    (file: UploadFile) => {
      if (typeof requestMethod !== 'function') {
        console.warn('TDesign Upload Warn: `requestMethod` must be a function.');
        return;
      }
      requestMethod(file).then((res: RequestMethodResponse) => {
        if (!handleRequestMethodResponse(res)) return;
        if (res.status === 'success') {
          return handleSuccess({ file, response: res.response });
        }
        if (res.status === 'fail') {
          const r = res.response || {};
          onError({ file, response: { ...r, error: res.error } });
        }
      });
    },
    [handleSuccess, onError, requestMethod],
  );
  const upload = useCallback(
    async (uploadFile: TdUploadFile): Promise<void> => {
      const file = { ...uploadFile };
      if (file.status !== 'waiting') {
        return;
      }
      if (!action && !requestMethod) {
        log.error('Upload', 'TDesign Upload Error: action or requestMethod is required.');
        return;
      }
      setErrorMsg('');
      // eslint-disable-next-line no-param-reassign
      file.status = 'progress';
      if (requestMethod) {
        return handleRequestMethod(file);
      }
      file.xhr = request({
        method,
        action,
        data,
        file,
        files: [file],
        name,
        onError,
        headers,
        withCredentials,
        onProgress: handleProgress,
        onSuccess: handleSuccess,
      });
    },
    [
      method,
      action,
      data,
      handleProgress,
      handleRequestMethod,
      handleSuccess,
      headers,
      name,
      onError,
      requestMethod,
      withCredentials,
    ],
  );

  function handleRequestMethodResponse(res: RequestMethodResponse) {
    if (!res) {
      log.error('Upload', 'TDesign Upload Error: `requestMethodResponse` is required.');
      return false;
    }
    if (!res.status) {
      log.error(
        'Upload',
        'TDesign Upload Error: `requestMethodResponse.status` is missing, which value is `success` or `fail`',
      );
      return false;
    }
    if (!['success', 'fail'].includes(res.status)) {
      log.error('Upload', 'TDesign Upload Error: `requestMethodResponse.status` must be `success` or `fail`');
      return false;
    }
    if (res.status === 'success' && (!res.response || !res.response.url)) {
      console.warn('TDesign Upload Warn: `requestMethodResponse.response.url` is required, when `status` is `success`');
    }
    return true;
  }

  const formatFiles = (files: File[] = []): TdUploadFile[] =>
    files.map((fileRaw) => {
      const file = typeof format === 'function' ? format(fileRaw) : fileRaw;
      const uploadFile: TdUploadFile = {
        response: undefined,
        url: '',
        raw: fileRaw,
        lastModified: fileRaw.lastModified,
        name: fileRaw.name,
        size: fileRaw.size,
        type: fileRaw.type,
        percent: 0,
        status: 'waiting',
        ...file,
      };
      uploadFile.url = urlCreator()?.createObjectURL(fileRaw);
      return uploadFile;
    });

  const handleBeforeUpload = (file: TdUploadFile): Promise<boolean> => {
    if (typeof beforeUpload === 'function') {
      const r = beforeUpload(file);
      if (r instanceof Promise) return r;
      return Promise.resolve(r);
    }
    if (sizeLimit) {
      const [overrideSize, errorMsg] = handleSizeLimit(file.size, sizeLimit);
      setErrorMsg(errorMsg);
      return Promise.resolve(overrideSize);
    }
    return Promise.resolve(true);
  };

  const uploadFiles = () => {
    const { length } = fileList;
    let count = 0;
    const newFileList = [];
    fileList.forEach((uploadFile) => {
      handleBeforeUpload(uploadFile).then((canUpload) => {
        count += 1;
        if (canUpload) {
          newFileList.push(uploadFile);
          if (autoUpload) {
            upload(uploadFile);
          }
        }
        if (count === length) {
          setToUploadFiles([...new Set([...toUploadFiles, ...newFileList])]);
          onChange?.(newFileList, { trigger: 'remove' });
        }
      });
    });
  };

  const generateUploadFiles = (files: FileList): TdUploadFile[] => {
    const uploadList = formatFiles(Array.from(files));
    return getLimitedFiles(uploadList);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const { files } = event.target;
    const uploadFiles = generateUploadFiles(files);
    onSelectChange?.(uploadFiles);
    uploadRef.current.value = '';
    onChange?.(uploadFiles, { trigger: 'upload' });
    setUploading(true);
  };

  const handleDragChange = (files: FileList): void => {
    if (disabled) return;
    const uploadFiles = generateUploadFiles(files);
    onSelectChange?.(uploadFiles);
    onChange?.(uploadFiles, { trigger: 'drag' });
    setUploading(true);
  };

  const handleDragenter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      onDragenter?.({ e });
    },
    [disabled, onDragenter],
  );

  const handleDragleave = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      onDragleave?.({ e });
    },
    [disabled, onDragleave],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      onDrop?.({ e });
    },
    [disabled, onDrop],
  );

  // TODO
  const cancelUpload = useCallback(() => {
    const files = [...filesRef.current];
    setUploading(false);
    files.forEach((file) => {
      if (file.xhr && file.status === 'progress') {
        file.xhr.abort();
        // eslint-disable-next-line no-param-reassign
        lodashUpdate(file, 'status', () => 'waiting');
        lodashUpdate(file, 'xhr', () => undefined);
      }
    });
    onCancelUpload?.();
    onChange?.(files, { trigger: 'cancelUpload' });
    uploadRef.current.value = '';
  }, [onCancelUpload, onChange]);

  const showUploadList = useMemo(() => multiple && ['file-flow', 'image-flow'].includes(theme), [theme, multiple]);

  const showErrorMsg = useMemo(() => !showUploadList && !!errorMsg, [errorMsg, showUploadList]);

  const showTips = useMemo(() => {
    if (theme === 'file') {
      const noFile = isEmpty(fileList);
      return tips && noFile;
    }
    return Boolean(tips);
  }, [fileList, theme, tips]);

  // region multiple upload
  const handleMultipleRemove = useCallback(
    (options: UploadRemoveContext) => {
      const files = fileList.concat();
      files.splice(options.index, 1);
      onChange?.(files, { trigger: 'remove' });
      onRemove?.(options);
    },
    [fileList, onChange, onRemove],
  );
  const handleListRemove = useCallback(
    (context: FlowRemoveContext) => {
      const { file } = context;
      const index = findIndex(toUploadFiles, (o) => o.name === file.name);
      if (index >= 0) {
        setToUploadFiles((toUploadFiles) => toUploadFiles.splice(index, 1));
      } else {
        const index = findIndex(fileList, (o) => o.name === file.name);
        handleMultipleRemove({ e: context.e, index });
      }
    },
    [fileList, handleMultipleRemove, toUploadFiles],
  );
  const multipleUpload = useCallback(
    (fileList: UploadFile[]) => {
      for (const file of fileList) {
        upload(file);
      }
    },
    [upload],
  );

  React.useEffect(() => {
    if (uploading) {
      uploadFiles();
    }
    // eslint-disable-next-line
  }, [uploading]);

  useMemo(() => {
    const timestamp = Date.now();
    (fileList || []).forEach((file: any, index) => {
      if (!file.uid && !Object.isFrozen(file)) {
        // eslint-disable-next-line no-param-reassign
        file.uid = `td__upload__${timestamp}_${index}__`;
      }
    });

    const finish = fileList.every((file) => finishUpload(file.status));
    setUploading(!finish);
    filesRef.current = fileList;
  }, [fileList]);

  React.useImperativeHandle(ref, () => ({
    upload: uploadRef.current,
    triggerUpload,
  }));

  return (
    <div className={classNames(`${classPrefix}-upload`, className)} style={style}>
      <input
        ref={uploadRef}
        type="file"
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        hidden
        onChange={handleChange}
      />
      <BooleanRender boolExpression={!draggable && theme === 'custom'}>
        <UploadTrigger onClick={triggerUpload} localeFromProps={localeFromProps}>
          {children}
        </UploadTrigger>
      </BooleanRender>
      <BooleanRender boolExpression={!draggable && ['file', 'file-input'].includes(theme)}>
        <SingleFile
          file={fileList && fileList[0]}
          display={theme}
          placeholder={placeholder}
          onRemove={handleSingleRemove}
          showUploadProgress={showUploadProgress}
        >
          <UploadTrigger onClick={triggerUpload} localeFromProps={localeFromProps} />
        </SingleFile>
      </BooleanRender>
      <BooleanRender boolExpression={!draggable && theme === 'image'}>
        <ImageCard
          disabled={disabled}
          multiple={multiple}
          max={max}
          onRemove={handleMultipleRemove}
          onTrigger={triggerUpload}
          files={fileList}
          showUploadProgress={showUploadProgress}
          localeFromProps={localeFromProps}
        />
      </BooleanRender>
      <BooleanRender boolExpression={singleDraggable}>
        <Dragger
          onChange={handleDragChange}
          onDragenter={handleDragenter}
          onDragleave={handleDragleave}
          onDrop={handleDrop}
          file={fileList && fileList[0]}
          display={theme}
          customDraggerRender={customDraggerRender}
          onCancel={cancelUpload}
          onRemove={handleSingleRemove}
          onUpload={(file) => {
            upload(file);
          }}
          onTrigger={triggerUpload}
          localeFromProps={localeFromProps}
        />
      </BooleanRender>
      <BooleanRender boolExpression={showUploadList}>
        <FlowList
          files={fileList}
          placeholder={placeholder}
          toUploadFiles={toUploadFiles}
          remove={handleListRemove}
          showUploadProgress={showUploadProgress}
          upload={multipleUpload}
          cancel={cancelUpload}
          display={theme as 'image-flow' | 'file-flow'}
          onImgPreview={handlePreviewImg}
          onChange={handleDragChange}
          onDragenter={handleDragenter}
          onDragleave={handleDragleave}
          localeFromProps={localeFromProps}
        >
          <UploadTrigger onClick={triggerUpload} localeFromProps={localeFromProps} />
        </FlowList>
      </BooleanRender>
      <BooleanRender boolExpression={showImgDialog}>
        <Dialog
          visible={showImg}
          showOverlay
          width="auto"
          top="10%"
          className={`${classPrefix}-upload__dialog`}
          footer={false}
          header={false}
          onClose={closePreview}
        >
          <p className={`${classPrefix}-dialog__dialog-body-img-box`}>
            <img src={imgURL} alt="" />
          </p>
        </Dialog>
      </BooleanRender>
      <BooleanRender boolExpression={!errorMsg && showTips}>
        <Tips>{tips}</Tips>
      </BooleanRender>
      <BooleanRender boolExpression={showErrorMsg}>
        <Tips type="error">{errorMsg}</Tips>
      </BooleanRender>
    </div>
  );
});

Upload.displayName = 'Upload';
Upload.defaultProps = uploadDefaultProps;

export default Upload;
