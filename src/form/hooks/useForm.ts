import { useRef } from 'react';
import { FormInstanceFunctions } from '../type';

export default function useForm() {
  const form = useRef<FormInstanceFunctions>({});

  return [form.current];
}
