import { abridgeName, returnFileSize } from 'tdesign-react/upload/util';
import React, { MouseEvent } from 'react';
import useConfig from 'tdesign-react/_util/useConfig';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon, TimeFilledIcon } from 'tdesign-icons-react';
import { Loading } from 'tdesign-react';

const FileList = (props) => {
  const { listFiles, showInitial, renderDragger, showUploadProgress, remove } = props;
  const { classPrefix: prefix } = useConfig();
  const UPLOAD_NAME = `${prefix}-upload`;
  const renderStatus = ({ file }) => {
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
      <tr>
        <th>文件名</th>
        <th>大小</th>
        <th>状态</th>
        <th>操作</th>
      </tr>
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
    </table>
  );
};

export default FileList;
