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
  const { classPrefix: prefix } = useConfig();
  const UPLOAD_NAME = `${prefix}-upload`;
  const renderStatus = (file: UploadFile) => {
    const STATUS_MAP = {
      success: {
        icon: <CheckCircleFilledIcon />,
        text: '上传成功',
      },
      fail: {
        icon: <ErrorCircleFilledIcon />,
        text: '上传失败',
      },
      progress: {
        icon: <Loading />,
        text: `上传中 ${Math.min(file.percent, 99)}%`,
      },
      waiting: {
        icon: <TimeFilledIcon />,
        text: '待上传',
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
          <th>文件名</th>
          <th>大小</th>
          <th>状态</th>
          <th>操作</th>
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
                删除
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileList;
