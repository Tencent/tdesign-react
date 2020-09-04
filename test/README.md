# 测试规范

## 1. 单元测试

```
npm run test
```

## 2. E2E 测试

### 如何运行

#### CLI 运行

```
npm run cypress
```

#### GUI 界面运行

```
npm run cypress-gui
```

### 测试规范

使用 BDD 模式进行开发，必须在流水线里面通过单元测试。

```js
describe('测试按钮组件', () => {
  beforeEach(() => {
    // 打开某个页面
    cy.visit('/#/components/button');
  });
  // 测试用例定义
  it('case1: 测试三种按钮类型，内容，渲染正确的类型跟内容', function() {
  });
  it('case2: 测试按钮尺寸，渲染正确的大小', function() {
  });
  it('case3: 测试带图标按钮，按钮内容里的图标位置', function() {
  });
  it('case4: 测试loading状态的按钮', function() {
  });
});
```

### 测试示例

```js
describe('测试按钮组件', () => {
  beforeEach(() => {
    // 打开某个页面
    cy.visit('/#/components/button');
  });
  // 测试用例定义
  it('case1: 测试三种按钮类型，内容，渲染正确的类型跟内容', function() {
    cy.get('.button')
      .should(ele => {
        expect(ele).to.have.text('按钮1');
      });
    ...
  });
  it('case2: 测试按钮尺寸，渲染正确的大小', function() {
  });
  it('case3: 测试带图标按钮，按钮内容里的图标位置', function() {
  });
  it('case4: 测试loading状态的按钮', function() {
  });
});
```

### 注意事项

e2e 测试放在 test/e2e/ 目录下
