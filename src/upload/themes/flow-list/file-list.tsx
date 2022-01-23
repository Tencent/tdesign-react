import React, { MouseEvent } from 'react';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon, TimeFilledIcon } from 'tdesign-icons-react';
import { abridgeName, returnFileSize } from '../../util';
import useConfig from '../../../_util/useConfig';
import Loading from '../../../loading';
import type { CommonListProps, FlowListProps } from './index';
import type { UploadFile } from '../../type';

type FileListProps = CommonListProps & Pick<FlowListProps, 'showUploadProgress' | 'remove'>;

const FileList = (props: FileListProps) => {
  const { listFiles, showInitial, renderDragger, showUploadProgress, remove } = props;
  const { classPrefix: prefix, locale } = useConfig();
  const UPLOAD_NAME = `${prefix}-upload`;
  const { progress: progressText, infoTable: infoText } = locale.upload;

  const renderStatus = (file: UploadFile) => {
    const STATUS_MAP = {
      success: {
        icon: <CheckCircleFilledIcon />,
        text: progressText.success,
      },
      fail: {
        icon: <ErrorCircleFilledIcon />,
        text: progressText.fail,
      },
      progress: {
        icon: <Loading />,
        text: `${progressText.uploading} ${Math.min(file.percent, 99)}%`,
      },
      waiting: {
        icon: <TimeFilledIcon />,
        text: progressText.waiting,
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
          <th>{infoText.name}</th>
          <th>{infoText.size}</th>
          <th>{infoText.status}</th>
          <th>{infoText.operation}</th>
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
                {progressText.delete}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileList;
