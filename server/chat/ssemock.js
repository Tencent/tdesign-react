const cors = require('cors');
const express = require('express');
const chunks = require('./data/normal');
const chunksChart = require('./data/chart');
const chunksCode = require('./data/code');
const chunksImage = require('./data/image');
const agentChunks = require('./data/agent');

const app = express();
app.use(cors());
app.use(express.json()); // 添加JSON解析中间件

// 统一SSE响应头设置
const setSSEHeaders = (res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    Connection: 'keep-alive',
    'Content-Encoding': 'none',
  });
};

app.post('/sse/test', (req, res) => {
  res.send('Hello sse!');
});
app.post('/sse/agent', (req, res) => {
  console.log('Received POST body:', req.body); // 打印请求体
  setSSEHeaders(res);

  // 将chunks转换为SSE格式消息
  const messages = agentChunks.map((chunk) => {
    switch (chunk.type) {
      case 'text':
        return `event: message\ndata: ${JSON.stringify({
          type: 'text',
          msg: chunk.msg,
        })}\n\n`;
      case 'agent':
        return `event: ${chunk.type}\ndata: ${JSON.stringify({
          type: 'agent',
          id: chunk.id,
          state: chunk.state,
          content: chunk.content,
        })}\n\n`;
      default:
        return `event: ${chunk.type}\ndata: ${JSON.stringify({
          type: '',
          id: chunk.id,
          content: chunk.content,
        })}\n\n`;
    }
  });

  sendStream(res, messages, 300, req);
});

// 支持POST请求的SSE端点
app.post('/sse/normal', (req, res) => {
  console.log('Received POST body:', req.body); // 打印请求体
  setSSEHeaders(res);

  let mockdata = chunks;
  const { think = false, search = false, chart = false, code = false, image = false } = req.body;
  if (chart) {
    mockdata = chunksChart;
  }

  if (code) {
    mockdata = chunksCode;
  }

  if (image) {
    mockdata = chunksImage;
  }

  // 根据参数过滤不需要的chunk类型
  const filteredChunks = mockdata.filter((chunk) => {
    if (!think && chunk.type === 'think') return false;
    if (!search && chunk.type === 'search') return false;
    return true;
  });

  // 将chunks转换为SSE格式消息
  const messages = filteredChunks.map((chunk) => {
    switch (chunk.type) {
      case 'text':
        return `event: message\ndata: ${JSON.stringify({
          ...chunk,
        })}\n\n`;

      case 'search':
        return `event: message\ndata: ${JSON.stringify({
          type: 'search',
          title: chunk.title,
          content: chunk.content,
        })}\n\n`;

      case 'think':
        return `event: message\ndata: ${JSON.stringify(chunk)}\n\n`;

      case 'image':
        return `event: media\ndata: ${JSON.stringify({
          type: 'image',
          content: chunk.content,
        })}\n\n`;

      case 'weather':
        return `event: custom\ndata: ${JSON.stringify({
          type: 'weather',
          id: chunk.id,
          content: chunk.content,
        })}\n\n`;
      case 'chart':
        return `event: custom\ndata: ${JSON.stringify({
          type: 'chart',
          content: {
            ...chunk.data,
            id: Math.random() * 10000,
          },
        })}\n\n`;

      case 'preview':
        return `event: custom\ndata: ${JSON.stringify({
          type: 'preview',
          content: chunk.data,
        })}\n\n`;

      case 'suggestion':
        return `event: suggestion\ndata: ${JSON.stringify({
          type: 'suggestion',
          content: chunk.content,
        })}\n\n`;
      case 'error':
        return `event: error\ndata: ${JSON.stringify({
          type: 'error',
          content: chunk.content,
        })}\n\n`;
      default:
        return `event: ${chunk.type}\ndata: ${chunk.content}\n\n`;
    }
  });
  sendStream(res, messages, 100, req);
});

// 带鉴权的POST请求
app.post('/sse/auth', (req, res) => {
  // 检查授权头
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: '未授权' });
    return;
  }

  setSSEHeaders(res);
});

// 流发送工具函数
function sendStream(res, messages, interval, req) {
  let index = 0;
  const timer = setInterval(() => {
    if (index < messages.length) {
      // 添加写入状态检查
      if (!req.socket.writable) {
        console.log('Socket not writable');
        clearInterval(timer);
        return res.end();
      }
      res.write(messages[index]);
      index++;
    } else {
      clearInterval(timer);
      res.end();
    }
  }, interval);
}

// 模拟文件上传接口
app.post('/file/upload', (req, res) => {
  // 模拟延迟
  setTimeout(() => {
    res.json({
      code: 200,
      result: {
        cdnurl: `https://tdesign.gtimg.com/site/avatar.jpg`,
        size: 1024,
        width: 800,
        height: 600,
      },
    });
  }, 300);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SSE Mock Server: http://localhost:${PORT}`);
});
