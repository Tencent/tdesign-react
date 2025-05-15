module.exports = [
  { type: 'text', msg: '下面是' },
  { type: 'text', msg: '一个使用' },
  { type: 'text', msg: 'TDesign' },
  { type: 'text', msg: '组件库' },

  { type: 'text', msg: '实现' },

  { type: 'text', msg: '的登' },

  { type: 'text', msg: '录表单' },

  { type: 'text', msg: '组件' },
  { type: 'text', msg: '，以React' },
  { type: 'text', msg: '版本' },
  { type: 'text', msg: '为例：' },
  { type: 'text', msg: '\n\n' },
  {
    type: 'preview',
    data: {
      id: Date.now(),
      enName: 'tdesign-login-form.jsx',
      cnName: 'TDesign登录表单示例，代码开始编写...',
      version: 'v1',
    },
  },
  { type: 'text', msg: '```' },

  { type: 'text', msg: 'js' },

  { type: 'text', msg: 'x' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: 'import' },

  { type: 'text', msg: ' {' },

  { type: 'text', msg: ' Form' },

  { type: 'text', msg: ',' },

  { type: 'text', msg: ' Input' },

  { type: 'text', msg: ',' },

  { type: 'text', msg: ' Button' },

  { type: 'text', msg: ',' },

  { type: 'text', msg: ' Message' },

  { type: 'text', msg: ' }' },

  { type: 'text', msg: ' from' },

  { type: 'text', msg: " '" },

  { type: 'text', msg: 'td' },

  { type: 'text', msg: 'esign' },

  { type: 'text', msg: '-react' },

  { type: 'text', msg: "';\n\n" },

  { type: 'text', msg: 'const' },

  { type: 'text', msg: ' Login' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: ' =' },

  { type: 'text', msg: ' ()' },

  { type: 'text', msg: ' =\u003e' },

  { type: 'text', msg: ' {\n' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: ' const' },

  { type: 'text', msg: ' [' },

  { type: 'text', msg: 'loading' },

  { type: 'text', msg: ',' },

  { type: 'text', msg: ' set' },

  { type: 'text', msg: 'Loading' },

  { type: 'text', msg: ']' },

  { type: 'text', msg: ' =' },

  { type: 'text', msg: ' useState' },

  { type: 'text', msg: '(false' },

  { type: 'text', msg: ');\n\n' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: ' const' },

  { type: 'text', msg: ' onSubmit' },

  { type: 'text', msg: ' =' },

  { type: 'text', msg: ' async' },

  { type: 'text', msg: ' ({' },

  { type: 'text', msg: ' validate' },

  { type: 'text', msg: 'Result' },

  { type: 'text', msg: ' })' },

  { type: 'text', msg: ' =\u003e' },

  { type: 'text', msg: ' {\n' },

  { type: 'text', msg: '   ' },

  { type: 'text', msg: ' if' },

  { type: 'text', msg: ' (' },

  { type: 'text', msg: 'validate' },

  { type: 'text', msg: 'Result' },

  { type: 'text', msg: ' ===' },

  { type: 'text', msg: ' true' },

  { type: 'text', msg: ')' },

  { type: 'text', msg: ' {\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' set' },

  { type: 'text', msg: 'Loading' },

  { type: 'text', msg: '(true' },

  { type: 'text', msg: ');\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' try' },

  { type: 'text', msg: ' {\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' //' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '登录' },

  { type: 'text', msg: '逻辑' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' Message' },

  { type: 'text', msg: '.success' },

  { type: 'text', msg: "('" },

  { type: 'text', msg: '登录' },

  { type: 'text', msg: '成功' },

  { type: 'text', msg: "');\n" },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' }' },

  { type: 'text', msg: ' catch' },

  { type: 'text', msg: ' {\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' Message' },

  { type: 'text', msg: '.error' },

  { type: 'text', msg: "('" },

  { type: 'text', msg: '登录' },

  { type: 'text', msg: '失败' },

  { type: 'text', msg: "');\n" },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' }' },

  { type: 'text', msg: ' finally' },

  { type: 'text', msg: ' {\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' set' },

  { type: 'text', msg: 'Loading' },

  { type: 'text', msg: '(false' },

  { type: 'text', msg: ');\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' }\n' },

  { type: 'text', msg: '   ' },

  { type: 'text', msg: ' }\n' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: ' };\n\n' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: ' return' },

  { type: 'text', msg: ' (\n' },

  { type: 'text', msg: '   ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: ' onSubmit' },

  { type: 'text', msg: '={' },

  { type: 'text', msg: 'on' },

  { type: 'text', msg: 'Submit' },

  { type: 'text', msg: '}\u003e\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '.Form' },

  { type: 'text', msg: 'Item' },

  { type: 'text', msg: ' name' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: 'username' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' label' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: '用户名' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' rules' },

  { type: 'text', msg: '={' },

  { type: 'text', msg: '[{' },

  { type: 'text', msg: ' required' },

  { type: 'text', msg: ':' },

  { type: 'text', msg: ' true' },

  { type: 'text', msg: ' }' },

  { type: 'text', msg: ']' },

  { type: 'text', msg: '}\u003e\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Input' },

  { type: 'text', msg: ' placeholder' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: '请输入' },

  { type: 'text', msg: '用户名' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' /\u003e\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' \u003c/' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '.Form' },

  { type: 'text', msg: 'Item' },

  { type: 'text', msg: '\u003e\n\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '.Form' },

  { type: 'text', msg: 'Item' },

  { type: 'text', msg: ' name' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: 'password' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' label' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: '密码' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' rules' },

  { type: 'text', msg: '={' },

  { type: 'text', msg: '[{' },

  { type: 'text', msg: ' required' },

  { type: 'text', msg: ':' },

  { type: 'text', msg: ' true' },

  { type: 'text', msg: ' }' },

  { type: 'text', msg: ']' },

  { type: 'text', msg: '}\u003e\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Input' },

  { type: 'text', msg: ' type' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: 'password' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' /\u003e\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' \u003c/' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '.Form' },

  { type: 'text', msg: 'Item' },

  { type: 'text', msg: '\u003e\n\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '.Form' },

  { type: 'text', msg: 'Item' },

  { type: 'text', msg: '\u003e\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' \u003c' },

  { type: 'text', msg: 'Button' },

  { type: 'text', msg: ' theme' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: 'primary' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' type' },

  { type: 'text', msg: '="' },

  { type: 'text', msg: 'submit' },

  { type: 'text', msg: '"' },

  { type: 'text', msg: ' loading' },

  { type: 'text', msg: '={' },

  { type: 'text', msg: 'loading' },

  { type: 'text', msg: '}' },

  { type: 'text', msg: ' block' },

  { type: 'text', msg: '\u003e\n' },

  { type: 'text', msg: '          ' },

  { type: 'text', msg: '登录' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '       ' },

  { type: 'text', msg: ' \u003c/' },

  { type: 'text', msg: 'Button' },

  { type: 'text', msg: '\u003e\n' },

  { type: 'text', msg: '     ' },

  { type: 'text', msg: ' \u003c/' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '.Form' },

  { type: 'text', msg: 'Item' },

  { type: 'text', msg: '\u003e\n' },

  { type: 'text', msg: '   ' },

  { type: 'text', msg: ' \u003c/' },

  { type: 'text', msg: 'Form' },

  { type: 'text', msg: '\u003e\n' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: ' );\n' },

  { type: 'text', msg: '};\n' },

  { type: 'text', msg: '```\n\n' },
  {
    type: 'preview',
    data: {
      id: Date.now(),
      enName: 'tdesign-login-form.jsx',
      cnName: 'TDesign登录表单示例，代码生成完成，开始自动化测试...',
      version: 'v1',
    },
  },

  { type: 'text', msg: '这个', paragraph: 'next' },

  { type: 'text', msg: '版本' },

  { type: 'text', msg: '都' },

  { type: 'text', msg: '包含了' },

  { type: 'text', msg: '：\n' },

  { type: 'text', msg: '1' },

  { type: 'text', msg: '.' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '用户名' },

  { type: 'text', msg: '和' },

  { type: 'text', msg: '密码' },

  { type: 'text', msg: '输入' },

  { type: 'text', msg: '框' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '2' },

  { type: 'text', msg: '.' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '必' },

  { type: 'text', msg: '填' },

  { type: 'text', msg: '验证' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '3' },

  { type: 'text', msg: '.' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '加载' },

  { type: 'text', msg: '状态' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '4' },

  { type: 'text', msg: '.' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '基本的' },

  { type: 'text', msg: '登录' },

  { type: 'text', msg: '提交' },

  { type: 'text', msg: '逻辑' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '5' },

  { type: 'text', msg: '.' },

  { type: 'text', msg: ' ' },

  { type: 'text', msg: '消息' },

  { type: 'text', msg: '提示' },

  { type: 'text', msg: '功能' },
  {
    type: 'preview',
    data: {
      id: Date.now(),
      enName: 'tdesign-login-form.jsx',
      cnName:
        'TDesign登录表单示例生产完成，你可以直接运行这个代码查看效果，也可以根据需要修改表单字段、验证规则或界面样式。',
      version: 'v1',
    },
  },
];
