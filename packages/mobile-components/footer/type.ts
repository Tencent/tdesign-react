/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

export interface TdFooterProps {
  /**
   * 链接列表。name 表示链接名称， url 表示跳转链接，target 表示跳转方式，如：当前页面打开、新页面打开等，同 HTML 属性 target 含义相同
   * @default []
   */
  links?: Array<LinkObj>;
  /**
   * 图标配置。`logo.icon` 表示图标链接地址，`logo.title` 表示标题文本，`logo.url` 表示链接跳转地址，`logo.target` 表示跳转方式
   */
  logo?: FooterLogo;
  /**
   * 版权信息
   * @default ''
   */
  text?: string;
}

export interface LinkObj {
  name: string;
  url?: string;
  target?: string;
}

export interface FooterLogo {
  icon: string;
  title?: string;
  url?: string;
  target?: string;
}
