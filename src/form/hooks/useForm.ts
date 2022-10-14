import { useState, useRef } from 'react';
import type { NamePath } from '../type';
import type { WatchCallBack, InternalHooks, InternalFormInstance, Store } from './interface';
import log from '../../_common/js/log';

export const HOOK_MARK = 'TD_FORM_INTERNAL_HOOKS';

// TODO 后续将所有实例函数迁移到 FormStore 内统一管理
class FormStore {
  private prevStore: Store = {};

  private store: Store = {};

  private forceRootUpdate: () => void;

  constructor(forceRootUpdate: () => void) {
    this.forceRootUpdate = forceRootUpdate;
  }

  public getForm = (): InternalFormInstance => ({
    submit: null,
    reset: null,
    validate: null,
    validateOnly: null,
    clearValidate: null,
    setFields: null,
    setFieldsValue: null,
    setValidateMessage: null,
    getFieldValue: null,
    getFieldsValue: null,
    _init: true,

    getInternalHooks: this.getInternalHooks,
  });

  private getInternalHooks = (key: string): InternalHooks | null => {
    if (key === HOOK_MARK) {
      return {
        notifyWatch: this.notifyWatch,
        registerWatch: this.registerWatch,
        getPrevStore: () => this.prevStore,
        setPrevStore: (store: object) => {
          this.prevStore = store;
        },
      };
    }

    log.warn('Form', '`getInternalHooks` is internal usage. Should not call directly.');
    return null;
  };

  private watchList: WatchCallBack[] = [];

  private registerWatch: InternalHooks['registerWatch'] = (callback) => {
    this.watchList.push(callback);

    return () => {
      this.watchList = this.watchList.filter((fn) => fn !== callback);
    };
  };

  private notifyWatch = (namePath: NamePath = []) => {
    // No need to cost perf when nothing need to watch
    if (this.watchList.length) {
      const values = this.getFieldsValue?.(namePath);

      this.watchList.forEach((callback) => {
        callback(values, namePath);
      });
    }
  };

  // TODO 暂时先从组件初始化时外部 merge 覆盖相关 form 操作函数
  private getFieldsValue = null;
}

export default function useForm(form?: InternalFormInstance) {
  const formRef = useRef<InternalFormInstance>({});
  const [, forceUpdate] = useState({});

  // eslint-disable-next-line
  if (!formRef.current._init) {
    if (form) {
      formRef.current = form;
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
