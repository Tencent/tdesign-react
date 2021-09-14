import React from 'react';
import { Td<%= PascalCaseComponent %>Props } from '../_type/components/<%= component %>';

export type <%= PascalCaseComponent %>Props = Td<%= PascalCaseComponent %>Props;


const <%= PascalCaseComponent %> = (props: <%= PascalCaseComponent %>Props) => {

  return (
    <div></div>
  );
};

<%= PascalCaseComponent %>.displayName = '<%= PascalCaseComponent %>';

export default <%= PascalCaseComponent %>;
