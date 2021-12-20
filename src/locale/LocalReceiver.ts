import React from 'react';
import { Locale, ComponentLocale, LocalRule } from './type';
import { ConfigContext } from '../config-provider';

export interface Placement {
  [propName: string]: string | number;
}

export type LocaleComponentName = Exclude<keyof Locale, 'locale'>;

export function useLocaleReceiver<T extends LocaleComponentName>(
  componentName: string,
  defaultLocale?: Locale[T] | Function,
): [Locale[T], Function] {
  const { locale: tdLocale } = React.useContext(ConfigContext);

  function transformLocale(pattern: LocalRule<Placement>, placement?: Placement): string | Array<string> {
    const REGX = /\{\s*([\w-]+)\s*\}/g;

    if (typeof pattern === 'string') {
      if (!placement || !REGX.test(pattern)) return pattern;
      const translated = pattern.replace(REGX, (_, key) => {
        if (placement) return String(placement[key]);
        return '';
      });
      return translated;
    } if (Array.isArray(pattern)) {
      return pattern.map((p, index) => {
        const translated = p.replace(REGX, (_: string, key: string) => {
          if (placement) return String(placement[index][key]);
          return '';
        });
        return translated;
      });
    } if (typeof pattern === 'function') {
      return pattern(placement);
    }
    return '';
  }

  const componentLocale: ComponentLocale = React.useMemo(() => {
    const locale = defaultLocale || {};
    const localeFromContext = componentName && tdLocale ? tdLocale[componentName] : {};

    return {
      ...(typeof locale === 'function' ? (locale as Function)() : locale),
      ...(localeFromContext || {}),
    };
  }, [componentName, defaultLocale, tdLocale]);

  return [componentLocale, transformLocale];
}
