import React, { FC, Fragment } from 'react';
import classNames from 'classnames';
import { LoadingIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } from '@tencent/tdesign-react';
import { UploadFile, UploadRemoveContext } from '../_type/components/upload';
import useConfig from '../_util/useConfig';

export interface SingleFileProps {
  file?: UploadFile;
  display?: string;
  placeholder?: string;
  onRemove?: (context: UploadRemoveContext) => void;
}

const SingleFile: FC<SingleFileProps> = (props) => {
  const { display = 'file', onRemove, file } = props;
  const { classPrefix } = useConfig();

  const fileClass = classNames(`${classPrefix}-upload__single`, `${classPrefix}-upload__single-${display}`);

  const showProgress = React.useMemo(() => file && file.status !== 'success', [file]);

  const inputName = React.useMemo(() => file && file.name, [file]);

  const handleRemove = React.useCallback(
    (e) => {
      onRemove?.({
        e,
        file,
        index: 0,
      });
    },
    [file, onRemove],
  );

  const renderProgress = React.useCallback(() => {
    if (file?.status === 'fail') {
      return <ErrorCircleFilledIcon />;
    }

    return (
      <Fragment>
        <div className={`${classPrefix}-upload__single-progress`}>
          <LoadingIcon />
          <span className={`${classPrefix}-upload__single-percent`}>{Math.min(file?.percent || 0, 99)}%</span>
        </div>
      </Fragment>
    );
  }, [classPrefix, file]);

  // 文本型预览
  const renderFilePreviewAsText = React.useCallback(() => {
    if (!inputName) return;
    return (
      <div className={`${classPrefix}-upload__single-display-text t-display-text--margin`}>
        <span className={`${classPrefix}-upload__single-name`}>{inputName}</span>
        {showProgress ? (
          renderProgress()
        ) : (
          <CloseCircleFilledIcon className={`${classPrefix}-upload-icon-delete`} onClick={handleRemove} />
        )}
      </div>
    );
  }, [classPrefix, inputName, renderProgress, showProgress, handleRemove]);

  return (
    <div className={fileClass}>
      {props.children}
      {display === 'file' && renderFilePreviewAsText()}
    </div>
  );
};

export default SingleFile;
