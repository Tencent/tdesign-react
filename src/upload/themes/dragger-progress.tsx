import React, { FC, useCallback } from 'react';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import Button from '../../button';
import Loading from '../../loading';
import useConfig from '../../_util/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { UploadFile, UploadRemoveContext } from '../type';
import { returnFileSize, abridgeName, getCurrentDate } from '../util';

export interface DraggerProgressProps {
  display?: string;
  file?: UploadFile;
  onTrigger?: () => void;
  onRemove?: (context: UploadRemoveContext) => void;
  onUpload?: () => void;
}

const DraggerProgress: FC<DraggerProgressProps> = (props) => {
  const { file, onUpload, onRemove, display, onTrigger } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');
  const { progress: progressText, infoTable: infoText } = locale;
  const reUpload = (e) => {
    onRemove?.({ e, file, index: 0 });
    onTrigger?.();
  };

  const showResultOperate = React.useMemo(() => ['success', 'fail'].includes(file?.status), [file]);

  const handleRemove = (e) => {
    onRemove?.({ e, file, index: 0 });
  };

  const renderUploading = useCallback(() => {
    if (file?.status === 'fail') {
      return <ErrorCircleFilledIcon />;
    }
    if (file?.status === 'progress') {
      return (
        <div className="t-upload__single-progress">
          <Loading loading={true} size="small" />
          <span className="t-upload__single-percent">{Math.min(file?.percent || 0, 99)}%</span>
        </div>
      );
    }
  }, [file]);

  return (
    <div className={`${classPrefix}-upload__dragger-progress`}>
      {display === 'image' && (
        <div className="t-upload__dragger-img-wrap">{file && <img src={file?.url || 'default.png'} alt="" />}</div>
      )}
      <div className={`${classPrefix}-upload__dragger-progress-info`}>
        <div className={`${classPrefix}-upload__dragger-text`}>
          <span className={`${classPrefix}-upload__single-name`}>{abridgeName(file?.name)}</span>
          {file?.status !== 'success' && renderUploading()}
          {file?.status === 'success' && <CheckCircleFilledIcon />}
        </div>
        <small className={`${classPrefix}-size-s`}>
          {t(infoText.size)}：{returnFileSize(file?.size)}
        </small>
        <small className={`${classPrefix}-size-s`}>
          {t(infoText.date)}：{getCurrentDate()}
        </small>
        {!['success', 'fail'].includes(file?.status) && (
          <div className={`${classPrefix}-upload__dragger-btns`}>
            <Button
              theme="primary"
              variant="text"
              className={`${classPrefix}-upload__dragger-progress-cancel`}
              onClick={handleRemove}
            >
              {t(progressText.cancel)}
            </Button>
            <Button theme="primary" variant="text" onClick={onUpload}>
              {t(progressText.start)}
            </Button>
          </div>
        )}
        {showResultOperate && (
          <div className="t-upload__dragger-btns">
            <Button theme="primary" variant="text" className="t-upload__dragger-progress-cancel" onClick={reUpload}>
              {t(progressText.reupload)}
            </Button>
            <Button theme="primary" variant="text" onClick={handleRemove}>
              {t(progressText.delete)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggerProgress;
