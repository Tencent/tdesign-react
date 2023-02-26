import React from 'react';
import { BackTop, Divider } from 'tdesign-react';

const style = {
  content: {
    width: '400px',
    height: '100px',
    overFlow: 'hidden',
    display: 'flex',
  },
};

export default function ButtonExample() {
  return (
    <div style={style.container}>
      <BackTop text="返回顶部" />
      <div style={style.content}>
        {/* // them: default */}
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop fixed={false} size="medium" shape="square" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop fixed={false} size="medium" shape="circle" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop fixed={false} size="small" shape="square" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop fixed={false} size="small" shape="circle" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
      </div>

      <div style={style.content}>
        {/* // them: primary */}
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="primary" fixed={false} size="medium" shape="square" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="primary" fixed={false} size="medium" shape="circle" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="primary" fixed={false} size="small" shape="square" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="primary" fixed={false} size="small" shape="circle" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
      </div>

      <div style={style.content}>
        {/* // them: dark */}
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="dark" fixed={false} size="medium" shape="square" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="dark" fixed={false} size="medium" shape="circle" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="dark" fixed={false} size="small" shape="square" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
        <BackTop theme="dark" fixed={false} size="small" shape="circle" />
        <Divider align="center" dashed={false} layout="vertical"></Divider>
      </div>
    </div>
  );
}
