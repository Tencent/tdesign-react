import React, { useEffect, useRef, useState } from 'react';
import { BrowseIcon, Filter3Icon, ImageAddIcon, Transform1Icon } from 'tdesign-icons-react';
import type {
  SSEChunkData,
  AIMessageContent,
  ChatRequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  TdAttachmentItem,
  TdChatSenderParams,
  UploadFile,
  TdChatMessageConfig,
  TdChatbotApi,
} from '@tdesign-react/chat';
import { ImageViewer, Skeleton, ImageViewerProps, Button, Dropdown, Space, Image } from 'tdesign-react';
import { ChatBot } from '@tdesign-react/chat';

const RatioOptions = [
  {
    content: '1:1 头像',
    value: 1,
  },
  {
    content: '2:3 自拍',
    value: 2 / 3,
  },
  {
    content: '4:3 插画',
    value: 4 / 3,
  },
  {
    content: '9:16 人像',
    value: 9 / 16,
  },
  {
    content: '16:9 风景',
    value: 16 / 9,
  },
];

const StyleOptions = [
  {
    content: '人像摄影',
    value: 'portrait',
  },
  {
    content: '卡通动漫',
    value: 'cartoon',
  },
  {
    content: '风景',
    value: 'landscape',
  },
  {
    content: '像素风',
    value: 'pixel',
  },
];

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign智能生图助手，请先写下你的创意，可以试试上传参考图哦～',
      },
    ],
  },
];

// 自定义生图消息内容
const BasicImageViewer = ({ images }) => {
  if (images?.length === 0 || images?.every((img) => img === undefined)) {
    return <Skeleton style={{ width: '600px', margin: '14px 0' }} theme="paragraph" animation="gradient" />;
  }

  return (
    <Space breakLine size={16}>
      {images.map((imgSrc, index) => {
        const trigger: ImageViewerProps['trigger'] = ({ open }) => {
          const mask = (
            <div
              style={{
                background: 'rgba(0,0,0,.6)',
                color: '#fff',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={open}
            >
              <span>
                <BrowseIcon size="16px" name={'browse'} /> 预览
              </span>
            </div>
          );

          return (
            <Image
              alt={'test'}
              src={imgSrc}
              overlayContent={mask}
              overlayTrigger="hover"
              fit="contain"
              style={{
                width: 160,
                height: 160,
                margin: '14px 0',
                border: '4px solid var(--td-bg-color-secondarycontainer)',
                borderRadius: 'var(--td-radius-medium)',
                backgroundColor: '#fff',
              }}
            />
          );
        };

        return <ImageViewer key={index} trigger={trigger} images={images} defaultIndex={index} />;
      })}
    </Space>
  );
};

export default function chatSample() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [ratio, setRatio] = useState(0);
  const [style, setStyle] = useState('');
  const reqParamsRef = useRef<{ ratio: number; style: string; file?: string }>({ ratio: 0, style: '' });
  const [files, setFiles] = useState<TdAttachmentItem[]>([]);
  const [mockMessage, setMockMessage] = React.useState<ChatMessagesData[]>(mockData);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    assistant: {
      placement: 'left',
      actions: ['good', 'bad'],
      handleActions: {
        // 处理消息操作回调
        good: async ({ message, active }) => {
          // 点赞
          console.log('点赞', message, active);
        },
        bad: async ({ message, active }) => {
          // 点踩
          console.log('点踩', message, active);
        },
      },
    },
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
    stream: true,
    // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
    onComplete: (aborted: boolean, params: RequestInit) => {
      console.log('onComplete', aborted, params);
    },
    // 流式对话过程中出错业务自定义行为
    onError: (err: Error | Response) => {
      console.error('Chatservice Error:', err);
    },
    // 流式对话过程中用户主动结束对话业务自定义行为
    onAbort: async () => {},
    // 自定义流式数据结构解析
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        // 图片列表预览（自定义渲染）
        case 'image':
          return {
            type: 'imageview',
            status: 'complete',
            data: JSON.parse(rest.content),
          };
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: ChatRequestParams) => {
      const { prompt } = innerParams;
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'tdesign-chat',
          prompt,
          image: true,
          ...reqParamsRef.current,
        }),
      };
    },
  };

  // 选中文件
  const onAttachClick = () => {
    chatRef.current?.selectFile();
  };
  // 文件上传
  const onFileSelect = (e: CustomEvent<File[]>) => {
    // 添加新文件并模拟上传进度
    const newFile = {
      ...e.detail[0],
      name: e.detail[0].name,
      status: 'progress' as UploadFile['status'],
      description: '上传中',
    };

    setFiles((prev) => [newFile, ...prev]);

    setTimeout(() => {
      setFiles((prevState) =>
        prevState.map((file) =>
          file.name === newFile.name
            ? {
                ...file,
                url: 'https://tdesign.gtimg.com/site/avatar.jpg', // mock返回的图片地址
                status: 'success',
                description: '上传成功',
              }
            : file,
        ),
      );
    }, 1000);
  };
  // 移除文件回调
  const onFileRemove = (e: CustomEvent<File[]>) => {
    setFiles(e.detail);
  };

  // 发送用户消息回调，这里可以自定义修改返回的prompt
  const onSend = (e: CustomEvent<TdChatSenderParams>): ChatRequestParams => {
    const { value, attachments } = e.detail;
    setFiles([]); // 清除掉附件区域
    return {
      attachments,
      prompt: `${value}，要求比例：${
        ratio === 0 ? '默认比例' : RatioOptions.filter(({ value }) => value === ratio)[0].content
      }, 风格：${style ? StyleOptions.filter(({ value }) => value === style)[0].content : '默认风格'}`,
    };
  };

  const switchRatio = (data) => {
    setRatio(data.value);
  };
  const switchStyle = (data) => {
    setStyle(data.value);
  };

  useEffect(() => {
    reqParamsRef.current = {
      ratio,
      style,
      file: 'https://tdesign.gtimg.com/site/avatar.jpg',
    };
  }, [ratio, style]);

  return (
    <div style={{ height: '400px' }}>
      <ChatBot
        ref={chatRef}
        defaultMessages={mockData}
        messageProps={messageProps}
        senderProps={{
          defaultValue: '请为Tdesign设计三张品牌宣传图',
          placeholder: '描述你的生图需求~',
          uploadProps: {
            multiple: false,
            accept: 'image/*',
          },
          attachmentsProps: {
            items: files,
          },
          onSend,
          onFileSelect,
          onFileRemove,
        }}
        chatServiceConfig={chatServiceConfig}
        onMessageChange={(e) => {
          setMockMessage(e.detail);
        }}
      >
        {mockMessage
          ?.map((msg) =>
            msg.content.map((item, index) => {
              switch (item.type) {
                // 示例：图片消息体
                case 'imageview':
                  return (
                    // slot名这里必须保证唯一性
                    <div slot={`${msg.id}-${item.type}-${index}`} key={`${msg.id}-${item.data.id}`}>
                      <BasicImageViewer images={item?.data?.map((img) => img?.url)} />
                    </div>
                  );
              }
              return null;
            }),
          )
          .flat()}
        {/* 自定义输入框底部区域slot，可以增加模型选项 */}
        <div slot="sender-footer-prefix">
          <Space align="center" size={'small'}>
            <Button shape="round" variant="outline" size="small" icon={<ImageAddIcon />} onClick={onAttachClick}>
              参考图
            </Button>
            <Dropdown options={RatioOptions} onClick={switchRatio} trigger="click">
              <Button shape="round" variant="outline" icon={<Transform1Icon size="16" />} size="small">
                {RatioOptions.filter((item) => item.value === ratio)?.[0]?.content || '比例'}
              </Button>
            </Dropdown>
            <Dropdown options={StyleOptions} onClick={switchStyle} trigger="click">
              <Button shape="round" variant="outline" icon={<Filter3Icon size="16" />} size="small">
                {StyleOptions.filter((item) => item.value === style)?.[0]?.content || '风格'}
              </Button>
            </Dropdown>
          </Space>
        </div>
      </ChatBot>
    </div>
  );
}
