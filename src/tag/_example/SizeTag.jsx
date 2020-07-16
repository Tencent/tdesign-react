import React from "react";
import { Tag } from "../index";

export default function SizeTagExample() {
  const style = { marginRight: 5 };
  return (
    <>
      <Tag size="large" style={style}>large</Tag>
      <Tag size="middle" style={style}>middle</Tag>
      <Tag size="small" style={style}>small</Tag>
    </>
  );
}
