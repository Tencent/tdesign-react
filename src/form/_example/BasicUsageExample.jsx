import React, { useState } from 'react';
import { Form, FormItem } from '@tencent/tdesign-react';

export default function BasicUsage() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Form>
        <FormItem />
        <FormItem />
        <FormItem />
      </Form>
    </div>
  );
}
