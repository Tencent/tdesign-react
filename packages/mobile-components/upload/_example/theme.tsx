import type { MouseEvent } from 'react';
import React from 'react';
import { Toast, Upload } from 'tdesign-mobile-react';
import type { RequestMethodResponse, UploadFile } from 'tdesign-mobile-react';

// 示例图片 URL
const IMAGE_URL = 'https://tdesign.gtimg.com/mobile/demos/upload6.png';

// 判断文件是否为图片（依据 MIME 或文件名后缀）
const isImageFile = (file: UploadFile) => {
  const mime = file.raw?.type || file.type || '';
  const name = file.name || '';
  return /^image\//.test(mime) || /\.(png|jpg|jpeg|webp|gif|bmp|svg|avif|heic|heif)$/i.test(name);
};

// 自定义上传方法（不接服务端，模拟返回）
const requestMethod = (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const fileList = Array.isArray(files) ? files : [files];
      resolve({
        status: 'success',
        response: {
          files: fileList.map((file) => ({
            ...file,
            // 仅图片类型兜底使用示例图片 URL，其它文件不设置 url，避免前缀图标被误判为图片
            url: file.url || (isImageFile(file) ? IMAGE_URL : undefined),
            status: 'success',
          })),
        },
      });
    }, 1000);
  });

// 示例1：宫格布局 - 展示各种文件类型和上传状态
const gridFiles: UploadFile[] = [
  // 文件类 loading（无百分比）
  {
    name: 'loading-file.txt',
    type: 'text/plain',
    status: 'progress',
  },
  // 文件类 loading（有百分比）
  {
    name: 'loading-file2.txt',
    type: 'text/plain',
    status: 'progress',
    percent: 68,
  },
  // 文件类 reload/failed（显示 refresh 图标）
  {
    name: 'failed-file.txt',
    type: 'text/plain',
    status: 'fail',
  },
  // 文件类 failed（显示 close-circle-filled 图标）
  {
    name: 'error-file.txt',
    type: 'text/plain',
    status: 'fail',
  },
  // Excel 文件 done
  {
    name: 'report.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 150 * 1024,
    status: 'success',
  },
  // PDF 文件 done
  {
    name: 'document.pdf',
    type: 'application/pdf',
    size: 320 * 1024,
    status: 'success',
  },
  // PPT 文件 done
  {
    name: 'presentation.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 512 * 1024,
    status: 'success',
  },
  // Word 文件 done
  {
    name: 'article.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 256 * 1024,
    status: 'success',
  },
  // 图片 loading（有图片背景）
  {
    url: IMAGE_URL,
    name: 'image-loading.png',
    type: 'image/png',
    status: 'progress',
  },
  // 图片 percent（有百分比）
  {
    url: IMAGE_URL,
    name: 'image-percent.png',
    type: 'image/png',
    status: 'progress',
    percent: 68,
  },
  // 图片 reload/failed
  {
    url: IMAGE_URL,
    name: 'image-reload.png',
    type: 'image/png',
    status: 'fail',
  },
  // 图片 failed
  {
    url: IMAGE_URL,
    name: 'image-failed.png',
    type: 'image/png',
    status: 'fail',
  },
  // 图片 done
  {
    url: IMAGE_URL,
    name: 'image-done.png',
    type: 'image/png',
    status: 'success',
  },
];

// 示例2：列表布局 - 展示各种文件类型和上传状态
const listFiles: UploadFile[] = [
  // loading 状态
  {
    name: 'Technical Design Document.pdf',
    size: 217 * 1024,
    type: 'application/pdf',
    status: 'progress',
    percent: 30,
  },
  // failed 状态
  {
    name: 'Technical Design Document.pdf',
    size: 217 * 1024,
    type: 'application/pdf',
    status: 'fail',
  },
  // 图片 done
  {
    url: IMAGE_URL,
    name: 'Design Mockup.png',
    size: 1024 * 1024,
    type: 'image/png',
    status: 'success',
  },
  // 视频 done
  {
    name: 'Product Demo.mp4',
    size: 5 * 1024 * 1024,
    type: 'video/mp4',
    status: 'success',
  },
  // Word done
  {
    name: 'Project Proposal.docx',
    size: 128 * 1024,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'success',
  },
  // Excel done
  {
    name: 'Financial Report.xlsx',
    size: 256 * 1024,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'success',
  },
  // PDF done
  {
    name: 'User Manual.pdf',
    size: 512 * 1024,
    type: 'application/pdf',
    status: 'success',
  },
  // PPT done
  {
    name: 'Quarterly Review.pptx',
    size: 768 * 1024,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    status: 'success',
  },
];

export default function ThemeDemo() {
  // 点击图片预览时触发
  const onPreview = (options: { file: UploadFile; index: number; e: MouseEvent<HTMLDivElement> }) => {
    const { file, index } = options;
    if (!isImageFile(file) && file.status === 'success') {
      Toast('该文件不支持预览');
    }
    console.log(`预览文件：${file}，索引：${index}，状态：${file.status}，地址：${file.url || '无'}`);
  };

  return (
    <>
      <div className="upload-demo">
        <div className="upload-title">宫格布局上传</div>
        <Upload
          draggable
          defaultFiles={gridFiles}
          multiple
          max={20}
          requestMethod={requestMethod}
          onPreview={onPreview}
        />
      </div>

      <div className="upload-demo">
        <div className="upload-title">列表布局上传</div>
        <Upload
          draggable
          defaultFiles={listFiles}
          theme="list"
          multiple
          max={20}
          requestMethod={requestMethod}
          onPreview={onPreview}
        />
      </div>
    </>
  );
}
