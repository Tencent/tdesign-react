import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { BrowseIcon, Filter3Icon, ImageAddIcon, Transform1Icon, CopyIcon, EditIcon, SoundIcon } from 'tdesign-icons-react';
import type {
  SSEChunkData,
  AIMessageContent,
  ChatRequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  TdAttachmentItem,
  TdChatSenderParams,
  UploadFile,
  ChatBaseContent,
} from '@tdesign-react/chat';
import { ImageViewer, Skeleton, ImageViewerProps, Button, Dropdown, Space, Image, MessagePlugin } from 'tdesign-react';
import { useChat, ChatList, ChatMessage, ChatSender, isAIMessage } from '@tdesign-react/chat';

/**
 * 自定义内容渲染示例 - AI 生图助手
 * 
 * 本示例展示如何使用 ChatEngine 的插槽机制实现自定义渲染，包括：
 * 1. 自定义内容渲染：扩展自定义内容类型（如图片预览）
 * 2. 自定义操作栏：为消息添加自定义操作按钮
 * 3. 自定义输入框：添加参考图上传、比例选择、风格选择等功能
 * 
 * 插槽类型：
 * - 内容插槽：`${content.type}-${index}` - 用于渲染自定义内容
 * - 操作栏插槽：`actionbar` - 用于渲染自定义操作栏
 * - 输入框插槽：`footer-prefix` - 用于自定义输入框底部区域
 * 
 * 实现步骤：
 * 1. 扩展类型：通过 TypeScript 模块扩展声明自定义内容类型
 * 2. 解析数据：在 onMessage 中返回自定义类型的数据结构
 * 3. 监听变化：通过 useChat Hook 获取 messages 数据
 * 4. 植入插槽：使用 slot 属性渲染自定义组件
 * 
 * 学习目标：
 * - 掌握插槽机制的使用方法
 * - 理解插槽命名规则和渲染时机
 * - 学会扩展自定义内容类型和操作栏
 * - 掌握 ChatSender 的自定义能力
 */

const RatioOptions = [
  { content: '1:1 头像', value: 1 },
  { content: '2:3 自拍', value: 2 / 3 },
  { content: '4:3 插画', value: 4 / 3 },
  { content: '9:16 人像', value: 9 / 16 },
  { content: '16:9 风景', value: 16 / 9 },
];

const StyleOptions = [
  { content: '人像摄影', value: 'portrait' },
  { content: '卡通动漫', value: 'cartoon' },
  { content: '风景', value: 'landscape' },
  { content: '像素风', value: 'pixel' },
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

// 1. 扩展自定义消息体类型
declare global {
  interface AIContentTypeOverrides {
    imageview: ChatBaseContent<
      'imageview',
      Array<{
        id?: number;
        url: string;
      }>
    >;
  }
}

// 2. 自定义生图消息内容
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

// 3. 自定义操作栏组件
const CustomActionBar = ({ textContent }: { textContent: string }) => {
  const handlePlayAudio = () => {
    MessagePlugin.info('播放语音');
  };

  const handleEdit = () => {
    MessagePlugin.info('编辑消息');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    MessagePlugin.success('已复制到剪贴板');
  };

  return (
    <Space size="small" style={{ marginTop: 6 }}>
      <Button shape="square" variant="text" size="small" onClick={handlePlayAudio} title="播放语音">
        <SoundIcon />
      </Button>
      <Button shape="square" variant="text" size="small" onClick={handleEdit} title="编辑">
        <EditIcon />
      </Button>
      <Button shape="square" variant="text" size="small" onClick={() => handleCopy(textContent)} title="复制">
        <CopyIcon />
      </Button>
    </Space>
  );
};

// 4. 自定义输入框底部控制栏组件
const SenderFooterControls = ({
  ratio,
  style,
  onAttachClick,
  onRatioChange,
  onStyleChange,
}: {
  ratio: number;
  style: string;
  onAttachClick: () => void;
  onRatioChange: (data: any) => void;
  onStyleChange: (data: any) => void;
}) => (
  <Space align="center" size={'small'}>
    <Button shape="round" variant="outline" size="small" icon={<ImageAddIcon />} onClick={onAttachClick}>
      参考图
    </Button>
    <Dropdown options={RatioOptions} onClick={onRatioChange} trigger="click">
      <Button shape="round" variant="outline" icon={<Transform1Icon size="16" />} size="small">
        {RatioOptions.filter((item) => item.value === ratio)?.[0]?.content || '比例'}
      </Button>
    </Dropdown>
    <Dropdown options={StyleOptions} onClick={onStyleChange} trigger="click">
      <Button shape="round" variant="outline" icon={<Filter3Icon size="16" />} size="small">
        {StyleOptions.filter((item) => item.value === style)?.[0]?.content || '风格'}
      </Button>
    </Dropdown>
  </Space>
);

export default function CustomContent() {
  const senderRef = useRef<any>(null);
  const [ratio, setRatio] = useState(0);
  const [style, setStyle] = useState('');
  const reqParamsRef = useRef<{ ratio: number; style: string; file?: string }>({ ratio: 0, style: '' });
  const [files, setFiles] = useState<TdAttachmentItem[]>([]);
  const [inputValue, setInputValue] = useState('请为Tdesign设计三张品牌宣传图');

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

  // 使用 useChat Hook 创建聊天引擎
  const { chatEngine, messages, status } = useChat({
    defaultMessages: mockData,
    chatServiceConfig,
  });

  // 选中文件
  const onAttachClick = () => {
    senderRef.current?.selectFile();
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
  const onSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value, attachments } = e.detail;
    setFiles([]); // 清除掉附件区域
    const enhancedPrompt = `${value}，要求比例：${
      ratio === 0 ? '默认比例' : RatioOptions.filter((item) => item.value === ratio)[0].content
    }, 风格：${style ? StyleOptions.filter((item) => item.value === style)[0].content : '默认风格'}`;

    await chatEngine.sendUserMessage({
      attachments,
      prompt: enhancedPrompt,
    });
    setInputValue('');
  };

  // 停止生成
  const onStop = () => {
    chatEngine.abortChat();
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

  // 渲染自定义内容
  const renderMessageContent = (msg: ChatMessagesData, item: AIMessageContent, index: number): ReactNode => {
    if (item.type === 'imageview') {
      // 内容插槽命名规则：`${content.type}-${index}`
      return (
        <div slot={`${item.type}-${index}`} key={`${msg.id}-imageview-${index}`}>
          <BasicImageViewer images={item?.data?.map((img) => img?.url)} />
        </div>
      );
    }
    return null;
  };

  // 渲染自定义操作栏
  const renderActionBar = (message: ChatMessagesData): ReactNode => {
    if (isAIMessage(message) && message.status === 'complete') {
      // 提取消息文本内容用于复制
      const textContent = message.content
        ?.filter((item) => item.type === 'text' || item.type === 'markdown')
        .map((item) => item.data)
        .join('\n') || '';

      // 操作栏插槽命名规则：actionbar
      return (
        <div slot='actionbar' key={`${message.id}-actionbar`}>
          <CustomActionBar textContent={textContent} />
        </div>
      );
    }
    return null;
  };

  // 渲染消息内容体
  const renderMsgContents = (message: ChatMessagesData): ReactNode => (
    <>
      {message.content?.map((item, index) => renderMessageContent(message, item, index))}
      {renderActionBar(message)}
    </>
  );

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ChatList messages={messages}>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message as any}
              placement={message.role === 'user' ? 'right' : 'left'}
              variant={message.role === 'user' ? 'base' : 'text'}
              avatar={message.role === 'user' ? 'https://tdesign.gtimg.com/site/avatar.jpg' : undefined}
            >
              {renderMsgContents(message)}
            </ChatMessage>
          ))}
        </ChatList>
      </div>

      <ChatSender
        ref={senderRef}
        value={inputValue}
        placeholder="描述你的生图需求~"
        loading={status === 'pending' || status === 'streaming'}
        uploadProps={{
          multiple: false,
          accept: 'image/*',
        }}
        attachmentsProps={{
          items: files,
        }}
        onChange={(e) => setInputValue(e.detail)}
        onSend={onSend}
        onStop={onStop}
        onFileSelect={onFileSelect}
        onFileRemove={onFileRemove}
      >
        {/* 自定义输入框底部区域slot */}
        <div slot="footer-prefix">
          <SenderFooterControls
            ratio={ratio}
            style={style}
            onAttachClick={onAttachClick}
            onRatioChange={switchRatio}
            onStyleChange={switchStyle}
          />
        </div>
      </ChatSender>
    </div>
  );
}
