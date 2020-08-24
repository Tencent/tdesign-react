// TODO: remove this lint
// SFC has specified a displayName, but not worked.
/* eslint-disable react/display-name */
import * as React from 'react';
import LocaleProvider, { Locale } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import ConfigContext, { ConfigConsumer, ConfigConsumerProps } from './ConfigContext';
import { SizeType, SizeContextProvider } from './SizeContext';

export { ConfigContext, ConfigConsumer, ConfigConsumerProps };

export interface ConfigProviderProps {
  attach?: (triggerNode: HTMLElement) => HTMLElement;
  classPrefix?: string;
  children?: React.ReactNode;
  locale?: Locale;
  componentSize?: SizeType;
}

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const renderProvider = (context: ConfigConsumerProps, legacyLocale: Locale) => {
    const { children, attach, locale, componentSize } = props;

    const config: ConfigConsumerProps = {
      ...context,
      locale: locale || legacyLocale,
    };

    if (attach) {
      config.attach = attach;
    }

    return (
      <SizeContextProvider size={componentSize}>
        <ConfigContext.Provider value={config}>
          <LocaleProvider locale={locale || legacyLocale}>{children}</LocaleProvider>
        </ConfigContext.Provider>
      </SizeContextProvider>
    );
  };

  return (
    <LocaleReceiver>
      {(_, __, legacyLocale) => (
        <ConfigConsumer>
          {(context) => renderProvider(context, legacyLocale as Locale)}
        </ConfigConsumer>
      )}
    </LocaleReceiver>
  );
};

export default ConfigProvider;
