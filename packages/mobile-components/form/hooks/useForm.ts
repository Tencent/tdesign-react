import { useRef, useState } from 'react';
import type { NamePath } from '../type';
import type { InternalFormInstance, InternalHooks, Store, WatchCallBack } from './interface';

export const HOOK_MARK = 'TD_FORM_INTERNAL_HOOKS';

export type Task = { args: any[]; name: string };

// TODO 后续将所有实例函数迁移到 FormStore 内统一管理
class FormStore {
  private prevStore: Store = {};

  private store: Store = {};

  private forceRootUpdate: () => void;

  public taskQueue: Task[] = [];

  constructor(forceReRender: () => void) {
    this.forceRootUpdate = forceReRender;
  }

  public flashQueue = () => {
    this.taskQueue.forEach((task) => {
      (this as any)[task.name]?.apply(this, [...task.args]);
    });
    this.taskQueue = [];
  };

  public getForm = (): InternalFormInstance => ({
    _init: true,
    store: this.store,
    getFieldsValue: null,
    getFieldValue: null,
    setFieldsValue: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'setFieldsValue' });
    },
    setFields: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'setFields' });
    },
    getValidateMessage: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'getValidateMessage' });
    },
    submit: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'submit' });
    },
    reset: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'reset' });
    },
    clearValidate: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'clearValidate' });
    },
    setValidateMessage: (...args: any[]) => {
      this.taskQueue.push({ args, name: 'setValidateMessage' });
    },
    validate: null,
    validateOnly: null,
    getInternalHooks: this.getInternalHooks,
  });

  private watchList: WatchCallBack[] = [];

  private registerWatch: InternalHooks['registerWatch'] = (callback) => {
    this.watchList.push(callback);

    return () => {
      this.watchList = this.watchList.filter((fn) => fn !== callback);
    };
  };

  private notifyWatch = (namePath: NamePath = []) => {
    if (this.watchList.length) {
      const values = (this as any).getFieldsValue?.(true) || {};

      this.watchList.forEach((callback) => {
        callback(values, namePath);
      });
    }
  };

  private getInternalHooks = (key: string): InternalHooks | null => {
    if (key === HOOK_MARK) {
      return {
        setForm: (formInstance: any) => {
          Object.keys(formInstance).forEach((k) => {
            (this as any)[k] = formInstance[k];
          });
        },
        flashQueue: this.flashQueue,
        notifyWatch: this.notifyWatch,
        registerWatch: this.registerWatch,
        getPrevStore: () => this.prevStore,
        setPrevStore: (store: Store) => {
          this.prevStore = store;
        },
      };
    }
    return null;
  };
}

export default function useForm(form?: InternalFormInstance) {
  const formRef = useRef<InternalFormInstance>(Object.create({}));
  const [, forceUpdate] = useState({});

  // eslint-disable-next-line no-underscore-dangle
  if (!formRef.current._init) {
    if (form) {
      formRef.current = form;
      // Reset store when reopening
      formRef.current.store = {};
    } else {
      // Create a new FormStore if not provided
      const forceReRender = () => {
        forceUpdate({});
      };

      const formStore: FormStore = new FormStore(forceReRender);

      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
}
