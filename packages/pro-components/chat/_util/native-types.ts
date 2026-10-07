// Public React contracts. Protocol types are owned by the framework-neutral engine.
import type { CSSProperties, ReactNode } from 'react';
import type * as Core from '@tdesign/ai-chat-engine';
import type { TextareaProps, TooltipProps, UploadFile } from 'tdesign-react';

type TNode<T = any> = ReactNode | ((props: T) => ReactNode);
export interface StyledProps {
  className?: string;
  style?: CSSProperties;
  innerClass?: string;
  innerStyle?: CSSProperties;
  children?: ReactNode;
}
export type TdChatCollapsibleContentProps = {
  defaultCollapsed?: boolean;
  onCollapsedChange?: (e: CustomEvent<boolean>) => void;
};
interface TdAttachmentProtocolFields {
  fileType?: Core.AttachmentItem['fileType'];
  isReference?: Core.AttachmentItem['isReference'];
  width?: Core.AttachmentItem['width'];
  height?: Core.AttachmentItem['height'];
  extension?: Core.AttachmentItem['extension'];
  metadata?: Core.AttachmentItem['metadata'];
}
export interface TdAttachmentItem extends UploadFile, TdAttachmentProtocolFields {
  key?: string;

  description?: string;
}
export interface TdFileCardProps extends StyledProps {
  item: TdAttachmentItem;

  removable?: boolean;

  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;

  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;

  disabled?: boolean;

  imageViewer?: boolean;

  cardType?: 'file' | 'image';
}

export interface TdAttachmentsProps extends StyledProps {
  items: TdAttachmentItem[];

  overflow?: 'scrollX' | 'scrollY' | 'wrap';

  onRemove?: (event: CustomEvent<TdAttachmentItem>) => void;

  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;

  imageViewer?: boolean;

  removable?: boolean;
}

export type ChatLoadingAnimationType = 'skeleton' | 'moving' | 'gradient' | 'circle' | 'dots';
interface ChatLoadingProps {
  text?: string;

  animation?: ChatLoadingAnimationType;
}
export interface TdChatLoadingProps extends ChatLoadingProps, StyledProps {}

export type TdChatActionsName = 'copy' | 'good' | 'bad' | 'replay' | 'share';
export type TdChatActionItem<TName extends string = TdChatActionsName> = {
  name: TName;
  render: TNode;
  ignoreWrapper?: boolean;
};
export type TdChatActionData = {
  event?: MouseEvent;
  active?: boolean;
  [key: string]: unknown;
};
interface ChatActionProps {
  actionBar?: Array<TdChatActionsName | TdChatActionItem<string>> | boolean;

  handleAction?: (name: TdChatActionsName, data: TdChatActionData) => void;

  comment?: Core.ChatComment;

  copyText?: string;

  tooltipProps?: TooltipProps;
}
export interface TdChatActionProps extends ChatActionProps, StyledProps {}

export type TdChatSenderActionName = 'uploadImage' | 'uploadAttachment' | 'attachment' | 'send';
export type UploadActionType = Extract<TdChatSenderActionName, 'uploadImage' | 'uploadAttachment'>;
export interface TdChatSenderUploadProps {
  accept?: string;

  multiple?: boolean;
}
export interface TdChatSenderAction {
  name: TdChatSenderActionName;

  uploadProps?: TdChatSenderUploadProps;
}
export interface TdChatSenderParams {
  value: string;

  attachments?: TdAttachmentItem[];
}
export interface TdChatSenderProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;

  actions?:
    | Array<TdChatSenderActionName | TdChatSenderAction>
    | ((
        preset: Array<{
          name: string;
          render: TNode;
        }>,
      ) => Array<{
        name: string;
        render: TNode;
      }>)
    | TNode
    | boolean;

  suffix?:
    | Array<TdChatSenderActionName | TdChatSenderAction>
    | ((
        preset: Array<{
          name: string;
          render: TNode;
        }>,
      ) => Array<{
        name: string;
        render: TNode;
      }>)
    | TNode
    | boolean;

  loading?: boolean;

  attachmentsProps?: Partial<TdAttachmentsProps>;

  autosize?: TextareaProps['autosize'];

  textareaProps?: Partial<Omit<TextareaProps, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'autosize'>>;

  uploadProps?: TdChatSenderUploadProps;

  sendBtnDisabled?: boolean | ((inputValue: string) => boolean);

  onSend?: (e: CustomEvent<TdChatSenderParams>) => void;

  onStop?: (e: CustomEvent<string>) => void;

  onChange?: (e: CustomEvent<string>) => void;

  onFocus?: (e: CustomEvent<string>) => void;

  onBlur?: (e: CustomEvent<string>) => void;

  onFileSelect?: (e: CustomEvent<TdAttachmentItem[]>) => void;

  onFileRemove?: (e: CustomEvent<TdAttachmentItem[]>) => void;
}
export interface TdChatSenderApi {
  focus: (opts?: FocusOptions) => void;

  blur: () => void;

  selectFile: () => void;
}

type CherryOptions = NonNullable<
  ConstructorParameters<typeof import('cherry-markdown/dist/cherry-markdown.stream.esm.js').default>[0]
>;

export type TdChatContentMDPresetPlugin = 'katex';
export interface TdChatContentMDPresetConfig {
  preset: TdChatContentMDPresetPlugin;

  enabled?: boolean;

  options?: any;
}

type CherryCodeBlockTheme =
  | 'coy'
  | 'dark'
  | 'default'
  | 'funky'
  | 'okaidia'
  | 'one-dark'
  | 'one-light'
  | 'solarized-light'
  | 'twilight'
  | 'vs-dark'
  | 'vs-light';
export type TdChatContentMDPluginConfig = TdChatContentMDPresetConfig;
export type TdChatContentMDOptions = Omit<CherryOptions, 'id' | 'el' | 'toolbars' | 'themeSettings'> & {
  themeSettings?: {
    codeBlockTheme?: 'light' | 'dark' | CherryCodeBlockTheme;
  };
};
export interface TdChatMarkdownContentProps {
  content?: string;
  options?: TdChatContentMDOptions;
}

export interface TdChatAttachmentContentProps {
  content?: Core.AttachmentItem[];
  onFileClick?: (event: CustomEvent<TdAttachmentItem>) => void;
}

type TdChatContentSearchProps = {
  useCollapse?: boolean;
  collapsed?: boolean;
};
type TdChatContentThinkProps = {
  maxHeight?: number;
  animation?: TdChatLoadingProps['animation'];
  collapsed?: boolean;
  layout?: 'block' | 'border';
};
type TdChatContentSuggestionProps = {
  directSend?: boolean;
};
export type TdChatMessageVariant = 'base' | 'text' | 'outline';
export type TdChatMessageActionName = TdChatActionsName | 'searchResult' | 'searchItem' | 'suggestion' | 'codeCopy';

export type TdChatMessageAction = TdChatActionItem<string>;
type TdChatMessageActionBaseData = TdChatActionData & {
  message?: Core.ChatMessagesData;
};
export type TdChatMessageActionDataMap = {
  [K in TdChatActionsName]: TdChatMessageActionBaseData;
} & {
  searchResult: TdChatMessageActionBaseData & {
    event: MouseEvent;
    content: Core.SearchContent['data'];
  };
  searchItem: TdChatMessageActionBaseData & {
    event: MouseEvent;
    content: Core.ReferenceItem;
  };
  suggestion: TdChatMessageActionBaseData & {
    event: MouseEvent;
    content: Core.SuggestionItem;
  };
  codeCopy: TdChatMessageActionBaseData & {
    code: string;
    lang?: string;
  };
};
export type TdChatMessageActionData = TdChatMessageActionDataMap[TdChatMessageActionName];
export type TdChatMessageActionHandlers = {
  [K in TdChatMessageActionName]?: (data: TdChatMessageActionDataMap[K]) => void;
};
export type TdChatContentProps = {
  markdown?: Omit<TdChatMarkdownContentProps, 'content'>;
  search?: TdChatContentSearchProps;
  thinking?: TdChatContentThinkProps;
  reasoning?: TdChatContentThinkProps;
  suggestion?: TdChatContentSuggestionProps;
  attachments?: Omit<TdChatAttachmentContentProps, 'content'>;
};
export interface TdChatMessageProps {
  actions?: Array<TdChatActionsName | TdChatMessageAction> | boolean;

  animation?: ChatLoadingAnimationType;

  handleActions?: TdChatMessageActionHandlers;

  name?: string | TNode;

  avatar?: string | TNode;

  datetime?: string | TNode;

  role?: Core.ChatMessageRole;

  content?: Core.AIMessageContent[] | Core.UserMessageContent[];

  status?: Core.ChatMessageStatus;

  id?: string;

  variant?: TdChatMessageVariant;

  placement?: 'left' | 'right';

  message?: Core.ChatMessagesData;

  chatContentProps?: TdChatContentProps;
}

export interface TdChatProps extends StyledProps {
  children?: ReactNode;

  layout?: 'single' | 'both';

  reverse?: boolean;

  listProps?: TdChatListProps;

  autoSendPrompt?: string;

  defaultMessages?: Array<Core.ChatMessagesData>;

  messageProps?: TdChatMessageConfig | ((msg: Core.ChatMessagesData) => TdChatMessageConfigItem);

  senderProps?: TdChatSenderProps;

  chatServiceConfig?: Core.ChatServiceConfigSetter;

  injectCSS?: TdChatInjectCSS;

  onMessageChange?: (e: CustomEvent<Core.ChatMessagesData[]>) => void;

  onChatReady?: (e: CustomEvent<Record<string, never>>) => void;

  onChatAfterSend?: (e: CustomEvent<Core.ChatRequestParams>) => void;

  onChatStop?: (e: CustomEvent<Record<string, never>>) => void;

  onChatMessageAction?: (e: CustomEvent<TdChatMessageActionEvent>) => void;
}
export interface TdChatMessageActionEvent {
  action: TdChatMessageActionName;
  data: TdChatMessageActionData;
}
export interface TdChatInjectCSS {
  ChatSender?: string;

  chatList?: string;

  chatItem?: string;
}
export interface TdChatListScrollToOptions {
  behavior?: 'auto' | 'smooth';
  to?: 'top' | 'bottom';
}
export interface TdChatbotApi {
  sendUserMessage: (params: Core.ChatRequestParams) => Promise<void>;

  sendSystemMessage: (msg: string) => void;

  sendAIMessage: (options?: {
    params?: Core.ChatRequestParams;
    content?: Core.AIMessageContent[];
    sendRequest?: boolean;
  }) => Promise<void>;

  setMessages: (messages: Core.ChatMessagesData[], mode?: Core.ChatMessageSetterMode) => void;

  clearMessages: () => void;

  abortChat: () => Promise<void>;

  addPrompt: (prompt: string, autoFocus?: boolean) => void;

  scrollList: (opt?: TdChatListScrollToOptions) => void;

  selectFile: () => void;

  readonly chatMessageValue: Core.ChatMessagesData[];

  readonly chatStatus: Core.ChatStatus;

  readonly senderLoading: boolean;

  readonly isChatEngineReady: boolean;

  regenerate: (keepVersion?: boolean) => Promise<void>;

  registerMergeStrategy: <T extends Core.AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) => void;
}
export type TdChatMessageConfigItem = Omit<TdChatMessageProps, 'message'>;
export type TdChatMessageConfig = {
  [key in ModelRoleEnum]?: TdChatMessageConfigItem;
};
export type ScrollPosition = NonNullable<TdChatListScrollToOptions['to']>;
export interface TdChatListProps {
  children?: ReactNode;

  autoScroll?: boolean;

  defaultScrollTo?: ScrollPosition;
  onScroll?: (
    e: CustomEvent<{
      scrollTop: number;
    }>,
  ) => void;
}
export interface TdChatListApi {
  scrollList: (opt?: TdChatListScrollToOptions) => void;
}
export interface TdChatCodeProps {
  lang: string;
  code: string;
}
export interface MetaData {
  avatar?: string;

  name?: string;

  [key: string]: any;
}
export type ModelRoleEnum = Core.ChatMessageRole;

export type Layout = NonNullable<TdChatProps['layout']>;

export interface FetchSSEOptions {
  success?: (res: SSEEvent) => void;
  fail?: () => void;
  complete?: (isOk: boolean, msg?: string, requestid?: string) => void;
}

export interface SSEEvent {
  type: string | null;
  data: string | null;
}

export interface BackBottomParams {
  behavior?: TdChatListScrollToOptions['behavior'];
}

export type TdChatSearchContentData = Core.SearchContent['data'];
export type TdChatSearchContentProps = {
  content?: TdChatSearchContentData;
  status?: Core.ChatMessageStatus;
  handleSearchResultClick?: ({ event, content }: { event: MouseEvent; content: TdChatSearchContentData }) => void;
  handleSearchItemClick?: ({ event, content }: { event: MouseEvent; content: Core.ReferenceItem }) => void;
} & TdChatContentProps['search'];

export type TdChatSuggestionContentProps = {
  content?: Core.SuggestionItem[];
  handlePromptClick?: ({ event, content }: { event: MouseEvent; content: Core.SuggestionItem }) => void;
};

type TdChatThinkBaseProps = {
  content?: {
    text?: string;
    title?: string;
  };
  status?: Core.ChatMessageStatus;
} & TdChatContentProps['thinking'];
export type TdChatThinkContentProps = TdChatCollapsibleContentProps & TdChatThinkBaseProps;
