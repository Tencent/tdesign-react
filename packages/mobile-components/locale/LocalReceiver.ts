import React from 'react';
import { ConfigContext, Locale } from '../config-provider';

export interface Placement {
  [propName: string]: string | number;
}

export type TransformPattern = string | ((placement?: Placement) => string | Array<string>) | Array<string>;

type TransformLocaleFn = (pattern: TransformPattern, placement?: Placement) => string | Array<string>;

export function useLocaleReceiver<T extends keyof Locale>(
  componentName: T,
  defaultLocale?: Locale[T] | (() => Locale[T]),
) {
  const { globalConfig } = React.useContext(ConfigContext);

  const transformLocale: TransformLocaleFn = (pattern: TransformPattern, placement?: Placement) => {
    const REGEXP = /\{\s*([\w-]+)\s*\}/g;
    if (typeof pattern === 'string') {
      if (!placement || !REGEXP.test(pattern)) return pattern;
      const translated = pattern.replace(REGEXP, (_, key) => {
        if (placement) return String(placement[key]);
        return '';
      });
      return translated;
    }
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
    return '';
  };

  /** @TypeA => 确保此参数是属于 globalConfig[componentName] 下的子属性 */
  const componentLocale = React.useMemo<Locale[T] | (() => Locale[T])>(() => {
    const locale = defaultLocale || {};
    const connectLocaleByName = globalConfig[componentName];

    const localeFromContext = componentName && globalConfig ? connectLocaleByName : {};

    return {
      ...(typeof locale === 'function' ? locale() : locale),
      ...(localeFromContext || {}),
    };
  }, [componentName, defaultLocale, globalConfig]);

  return [componentLocale, transformLocale] as [Locale[T], TransformLocaleFn];
}
