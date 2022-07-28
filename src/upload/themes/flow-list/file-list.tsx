import React, { MouseEvent } from 'react';
import {
  TimeFilledIcon as TdTimeFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
  ErrorCircleFilledIcon as TdErrorCircleFilledIcon,
} from 'tdesign-icons-react';
import { abridgeName, returnFileSize } from '../../util';
import useConfig from '../../../hooks/useConfig';
import useGlobalIcon from '../../../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import Loading from '../../../loading';
import type { CommonListProps, FlowListProps } from './index';
import type { UploadFile } from '../../type';

type FileListProps = CommonListProps & Pick<FlowListProps, 'showUploadProgress' | 'remove'>;

const FileList = (props: FileListProps) => {
  const { listFiles, showInitial, renderDragger, showUploadProgress, remove } = props;
  const { classPrefix: prefix } = useConfig();
  const { TimeFilledIcon, CheckCircleFilledIcon, ErrorCircleFilledIcon } = useGlobalIcon({
    TimeFilledIcon: TdTimeFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
    ErrorCircleFilledIcon: TdErrorCircleFilledIcon,
  });
  const [locale, t] = useLocaleReceiver('upload');
  const UPLOAD_NAME = `${prefix}-upload`;
  const { progress: progressText, file: infoText, triggerUploadText } = locale;

  const renderStatus = (file: UploadFile) => {
    const STATUS_MAP = {
      success: {
        icon: <CheckCircleFilledIcon />,
        text: t(progressText.successText),
      },
      fail: {
        icon: <ErrorCircleFilledIcon />,
        text: t(progressText.failText),
      },
      progress: {
        icon: <Loading />,
        text: `${t(progressText.uploadingText)} ${Math.min(file.percent, 99)}%`,
      },
      waiting: {
        icon: <TimeFilledIcon />,
        text: t(progressText.waitingText),
      },
    };

    if (file.status === 'progress' && !showUploadProgress) return null;
    return (
      <div className={`${UPLOAD_NAME}__flow-status`}>
        {STATUS_MAP[file.status].icon}
        <span>{STATUS_MAP[file.status].text}</span>
      </div>
    );
  };

  return (
    <table className={`${UPLOAD_NAME}__flow-table`}>
      <thead>
        <tr>
          <th>{t(infoText.fileNameText)}</th>
          <th>{t(infoText.fileSizeText)}</th>
          <th>{t(infoText.fileStatusText)}</th>
          <th>{t(infoText.fileOperationText)}</th>
        </tr>
      </thead>
      <tbody>
        {showInitial && (
          <tr>
            <td colSpan={4}>{renderDragger()}</td>
          </tr>
        )}
        {listFiles.map((file, index) => (
          <tr key={index}>
            <td>{abridgeName(file.name, 7, 10)}</td>
            <td>{returnFileSize(file.size)}</td>
            <td>{renderStatus(file)}</td>
            <td>
              <span
                className={`${UPLOAD_NAME}__flow-button`}
                onClick={(e: MouseEvent<HTMLElement>) => remove({ e, index, file })}
              >
                {t(triggerUploadText.delete)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileList;
