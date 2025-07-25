import React from 'react';
import { t as commonT } from '@tdesign/common-js/global-config/t';
import { ConfigContext, Locale } from '../config-provider';

export interface Placement {
  [propName: string]: string | number;
}

export type TransformPattern = string | Function | Array<string>;

export function useLocaleReceiver<T extends keyof Locale>(componentName: T, defaultLocale?: Locale[T] | Function) {
  const { globalConfig } = React.useContext(ConfigContext);

  function transformLocale(pattern: TransformPattern, placement?: Placement): string;
  function transformLocale(pattern: TransformPattern, placement?: number, data?: Placement): string;
  function transformLocale(pattern: TransformPattern, ...args: any[]): string | Array<string> {
    const REGEXP = /\{\s*([\w-]+)\s*\}/g;
    const placement = args[0];

    if (Array.isArray(pattern)) {
      return pattern.map((p, index) => {
        const translated = p.replace(REGEXP, (_: string, key: string) => {
          if (placement) return String(placement[index][key]);
          return '';
        });
        return translated;
      });
    }
    if (typeof pattern === 'function') {
      return pattern(placement);
    }

    // use commonT for plural
    const data = args[1];
    if (data) {
      return commonT(pattern, placement, data);
    }
    return commonT(pattern, placement);
  }

  /** @TypeA => 确保此参数是属于 globalConfig[componentName] 下的子属性 */
  const componentLocale = React.useMemo<Locale[T] | Function>(() => {
    const locale = defaultLocale || {};
    const connectLocaleByName = globalConfig[componentName];

    const localeFromContext = componentName && globalConfig ? connectLocaleByName : {};

    return {
      ...(typeof locale === 'function' ? (locale as Function)() : locale),
      ...(localeFromContext || {}),
    };
  }, [componentName, defaultLocale, globalConfig]);

  return [componentLocale, transformLocale] as [Locale[T], Function];
}
