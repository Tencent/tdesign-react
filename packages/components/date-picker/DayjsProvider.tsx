import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export interface DayjsProviderProps {
  children: React.ReactNode;
}

export default function DayjsProvider(props: DayjsProviderProps) {
  const [locale] = useLocaleReceiver('datePicker');
  const { dayjsLocale } = locale;

  dayjs.locale(dayjsLocale);

  useEffect(() => {
    if (dayjsLocale !== dayjs.locale()) {
      dayjs.locale(dayjsLocale);
    }
  }, [dayjsLocale]);

  return <>{props.children}</>;
}

export function withDayjsProvider<T extends React.ComponentType<any>>(Component: T): T {
  const WrappedComponent = React.forwardRef<React.ElementRef<T>, React.ComponentPropsWithoutRef<T>>((props, ref) => (
    <DayjsProvider>
      {/* @ts-ignore */}
      <Component ref={ref} {...props} />
    </DayjsProvider>
  ));

  WrappedComponent.displayName = Component.displayName;
  // @ts-ignore
  return WrappedComponent as T;
}
