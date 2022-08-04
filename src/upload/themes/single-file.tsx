import React, { FC, useCallback } from 'react';
import classNames from 'classnames';
import {
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import Loading from '../../loading';
import { UploadFile, UploadRemoveContext } from '../type';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';

export interface SingleFileProps {
  file?: UploadFile;
  display?: string;
  placeholder?: string;
  onRemove?: (context: UploadRemoveContext) => void;
  showUploadProgress: boolean;
}

const SingleFile: FC<SingleFileProps> = (props) => {
  const { display = 'file', onRemove, file, showUploadProgress } = props;
  const { classPrefix } = useConfig();
  const { CloseCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });

  const fileClass = classNames(`${classPrefix}-upload__single`, `${classPrefix}-upload__single-${display}`);

  const showProgress = showUploadProgress && file && file.status !== 'success';

  const inputName = file?.name;

  const handleRemove = useCallback(
    (e) => {
      onRemove?.({
        e,
        file,
        index: 0,
      });
    },
    [file, onRemove],
  );

  const renderProgress = useCallback(() => {
    if (file?.status === 'fail') {
      return <ErrorCircleFilledIcon />;
    }

    return (
      <div className={`${classPrefix}-upload__single-progress`}>
        <Loading loading={true} size="small" />
        <span className={`${classPrefix}-upload__single-percent`}>{Math.min(file?.percent || 0, 99)}%</span>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classPrefix, file]);

  // 文本型预览
  const renderFilePreviewAsText = useCallback(() => {
    if (!inputName) return;
    return (
      <div className={`${classPrefix}-upload__single-display-text ${classPrefix}-upload__display-text--margin`}>
        <span className={`${classPrefix}-upload__single-name`}>{inputName}</span>
        {showProgress ? (
          renderProgress()
        ) : (
          <CloseCircleFilledIcon className={`${classPrefix}-upload__icon-delete`} onClick={handleRemove} />
        )}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classPrefix, inputName, renderProgress, showProgress, handleRemove]);

  return (
    <div className={fileClass}>
      {props.children}
      {display === 'file' && renderFilePreviewAsText()}
    </div>
  );
};

export default SingleFile;
