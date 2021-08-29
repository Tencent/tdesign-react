import React, { FC } from 'react';
import classNames from 'classnames';
import { LoadingIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } from '@tencent/tdesign-react';
import { UploadFile, UploadRemoveContext } from '../_type/components/upload';
import useConfig from '../_util/useConfig';

export interface SingleFileProps {
  file?: UploadFile;
  display?: string;
  placeholder?: string;
  loadingFile?: UploadFile;
  onRemove?: (context: UploadRemoveContext) => void;
}

const SingleFile: FC<SingleFileProps> = (props) => {
  const { display = 'file', loadingFile, onRemove, file } = props;
  const { classPrefix } = useConfig();

  const fileClass = classNames(`${classPrefix}-upload__single`, `${classPrefix}-upload__single-${display}`);

  const showProgress = React.useMemo(() => loadingFile && loadingFile.status === 'progress', [loadingFile]);

  const getInputName = React.useCallback(() => {
    const fileName = file && file.name;
    const loadingName = loadingFile && loadingFile.name;
    return showProgress ? loadingName : fileName;
  }, [file, loadingFile, showProgress]);

  const renderProgress = React.useCallback(() => {
    if (loadingFile.status === 'fail') {
      return <ErrorCircleFilledIcon />;
    }

    return (
      <div className={`${classPrefix}-upload__single-progress`}>
        <LoadingIcon />
        <span className={`${classPrefix}-upload__single-percent`}>{Math.min(loadingFile.percent, 99)}%</span>
      </div>
    );
  }, [classPrefix, loadingFile]);

  // 文本型预览
  const renderFilePreviewAsText = React.useCallback(() => {
    console.log(loadingFile, showProgress);
    if (!loadingFile || !file) return;
    return (
      <div className={`${classPrefix}-upload__single-display-text t-display-text--margin`}>
        <span className={`${classPrefix}-upload__single-name`}>{getInputName()}</span>
        {showProgress ? (
          renderProgress()
        ) : (
          <CloseCircleFilledIcon className={`${classPrefix}-upload-icon-delete`} onClick={onRemove} />
        )}
      </div>
    );
  }, [classPrefix, file, getInputName, loadingFile, onRemove, renderProgress, showProgress]);

  console.log(loadingFile?.status);

  return (
    <div className={fileClass}>
      {props.children}
      {display === 'file' && renderFilePreviewAsText()}
    </div>
  );
};

export default SingleFile;
