import React, { ChangeEvent, forwardRef, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import Dialog from '../dialog';
import Dragger from './dragger';
import UploadTrigger from './upload-trigger';
import Tips from './tips';
import request from '../_common/js/upload/xhr';
import useConfig from '../_util/useConfig';
import SingleFile from './themes/single-file';
import ImageCard from './themes/image-card';
import FlowList from './themes/flow-list/index';
import BooleanRender from './boolean-render';
import { finishUpload, isSingleFile, updateFileList } from './util';
import type { FlowRemoveContext, TdUploadFile, UploadProps } from './types';
import type {
  ProgressContext,
  RequestMethodResponse,
  SuccessContext,
  TdUploadProps,
  UploadFile,
  UploadRemoveContext,
} from './type';
import useDefaultValue from './hooks/useDefaultValue';
import useSizeLimit from './hooks/useSizeLimit';

const urlCreator = window.webkitURL || window.URL;

const Upload: React.ForwardRefRenderFunction<unknown, UploadProps> = (props, ref) => {
  const {
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
    headers,
    withCredentials,
    autoUpload = true,
    files: fileList = [],
    sizeLimit,
    formatResponse,
    beforeUpload,
    onProgress,
    onChange,
    onSuccess,
    onFail,
    onRemove,
    onDragenter,
    onDragleave,
    requestMethod,
    customDraggerRender,
    children,
  } = useDefaultValue<Array<TdUploadFile>, UploadProps>(props, []);

  const { classPrefix } = useConfig();
  const uploadRef = useRef<HTMLInputElement>();
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
  const handlePreviewImg = useCallback((event: MouseEvent, file: UploadFile) => {
    if (!file.url) throw new Error('Error file');
    setImgURL(file.url);
    setShowImg(true);
  }, []);
  // endregion

  const triggerUpload = () => {
    if (disabled) return;
    uploadRef?.current.click();
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

      setErrorMsg(res?.error || '上传失败');
      const context = { e: event, file };
      const nextFileList = updateFileList(file, fileList);
      // setFileList((prevFileList) => updateFileList(file, prevFileList));
      onChange?.(nextFileList, { trigger: 'upload fail' });
      onFail?.(context);
    },
    [fileList, formatResponse, onChange, onFail],
  );

  const singleDraggable = useMemo(
    () => !multiple && draggable && ['file', 'file-input', 'image', 'custom'].includes(theme),
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
      const nextFileList = updateFileList(file, fileList);
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
    [fileList, onChange, onSuccess],
  );

  const handleProgress = useCallback(
    ({ e, file, percent, type = 'mock' }: ProgressContext) => {
      const tmpFile = { ...file };
      tmpFile.percent = percent;
      const progressCtx = { percent, e, file: tmpFile, type };
      const nextFileList = updateFileList(tmpFile, fileList);
      // setFileList((prevFileList) => updateFileList(tmpFile, prevFileList));
      onChange?.(nextFileList, { trigger: 'progress' });
      onProgress?.(progressCtx);
    },
    [fileList, onChange, onProgress],
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
        console.error('TDesign Upload Error: action or requestMethod is required.');
        return;
      }
      setErrorMsg('');
      // eslint-disable-next-line no-param-reassign
      file.status = 'progress';
      if (requestMethod) {
        return handleRequestMethod(file);
      }
      request({
        action,
        data,
        file,
        name,
        onError,
        headers,
        withCredentials,
        onProgress: handleProgress,
        onSuccess: handleSuccess,
      });
    },
    [
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
      console.error('TDesign Upload Error: `requestMethodResponse` is required.');
      return false;
    }
    if (!res.status) {
      console.error(
        'TDesign Upload Error: `requestMethodResponse.status` is missing, which value is `success` or `fail`',
      );
      return false;
    }
    if (!['success', 'fail'].includes(res.status)) {
      console.error('TDesign Upload Error: `requestMethodResponse.status` must be `success` or `fail`');
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
        raw: fileRaw,
        lastModified: fileRaw.lastModified,
        name: fileRaw.name,
        size: fileRaw.size,
        type: fileRaw.type,
        percent: 0,
        status: 'waiting',
        ...file,
      };
      uploadFile.url = urlCreator.createObjectURL(fileRaw);
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
      if (errorMsg) {
        setErrorMsg(errorMsg);
      }
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
    setUploading(true);
    uploadRef.current.value = '';
    onChange?.(uploadFiles, { trigger: 'upload' });
  };

  const handleDragChange = (files: FileList): void => {
    if (disabled) return;
    const uploadFiles = generateUploadFiles(files);
    setUploading(true);
    onChange?.(uploadFiles, { trigger: 'drag' });
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

  // TODO
  const cancelUpload = useCallback(() => {
    if (!fileList[0]) {
      urlCreator?.revokeObjectURL(fileList[0].url);
    }
    uploadRef.current.value = '';
  }, [fileList]);

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
    (fileList || []).forEach((file, index) => {
      if (!file.uid && !Object.isFrozen(file)) {
        // eslint-disable-next-line no-param-reassign
        file.uid = `td__upload__${timestamp}_${index}__`;
      }
    });

    const finish = fileList.every((file) => finishUpload(file.status));
    setUploading(!finish);
  }, [fileList]);

  React.useImperativeHandle(ref, () => ({
    upload: uploadRef.current,
    triggerUpload,
  }));

  return (
    <div className={`${classPrefix}-upload`}>
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
        <UploadTrigger onClick={triggerUpload}>{children}</UploadTrigger>
      </BooleanRender>
      <BooleanRender boolExpression={!draggable && ['file', 'file-input'].includes(theme)}>
        <SingleFile
          file={fileList && fileList[0]}
          display={theme}
          placeholder={placeholder}
          onRemove={handleSingleRemove}
          showUploadProgress={showUploadProgress}
        >
          <UploadTrigger onClick={triggerUpload} />
        </SingleFile>
      </BooleanRender>
      <BooleanRender boolExpression={!draggable && theme === 'image'}>
        <ImageCard
          multiple={multiple}
          max={max}
          onRemove={handleMultipleRemove}
          onTrigger={triggerUpload}
          files={fileList}
          showUploadProgress={showUploadProgress}
        />
      </BooleanRender>
      <BooleanRender boolExpression={singleDraggable}>
        <Dragger
          onChange={handleDragChange}
          onDragenter={handleDragenter}
          onDragleave={handleDragleave}
          file={fileList && fileList[0]}
          display={theme}
          customDraggerRender={customDraggerRender}
          onCancel={cancelUpload}
          onRemove={handleSingleRemove}
          onUpload={(file) => {
            upload(file);
          }}
          onTrigger={triggerUpload}
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
        >
          <UploadTrigger onClick={triggerUpload} />
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
};

export default forwardRef<unknown, TdUploadProps>(Upload);
