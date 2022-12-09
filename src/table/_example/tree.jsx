import React, { useState, useRef, useMemo } from 'react';
import { EnhancedTable, MessagePlugin, Button, Popconfirm, Checkbox, Space, Loading, Link } from 'tdesign-react';
import { ChevronRightIcon, ChevronDownIcon, MoveIcon, AddRectangleIcon, MinusRectangleIcon } from 'tdesign-icons-react';

function getObject(i, currentPage) {
  return {
    id: i,
    key: `申请人 ${i}_${currentPage} 号`,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  };
}

function getData(currentPage = 1) {
  const data = [];
  const pageInfo = `第 ${currentPage} 页`;
  for (let i = 0; i < 5; i++) {
    const obj = getObject(i, currentPage);
    // 第一行不设置子节点
    obj.list = new Array(2).fill(null).map((t, j) => {
      const secondIndex = 100 * j + (i + 1) * 10;
      const secondObj = {
        ...obj,
        id: secondIndex,
        key: `申请人 ${secondIndex}_${currentPage} 号（${pageInfo}）`,
      };
      secondObj.list = new Array(3).fill(null).map((m, n) => {
        const thirdIndex = secondIndex * 1000 + 100 * m + (n + 1) * 10;
        return {
          ...obj,
          id: thirdIndex,
          key: `申请人 ${thirdIndex}_${currentPage} 号（${pageInfo}）`,
          // 子节点懒加载
          list: true,
        };
      });
      return secondObj;
    });
    // 第一行不设置子节点
    if (i === 0) {
      obj.list = [];
    }
    data.push(obj);
  }
  // 懒加载1
  data.push({
    ...getObject(66666, currentPage),
    /** 如果子节点为懒加载，则初始值设置为 true */
    list: true,
    key: '申请人懒加载节点 66666，点我体验',
  });
  // 懒加载2
  data.push({
    ...getObject(88888, currentPage),
    /** 如果子节点为懒加载，则初始值设置为 true */
    list: true,
    key: '申请人懒加载节点 88888，点我体验 ',
  });
  return data;
}

export default function TableTree() {
  const table = useRef(null);
  const [data, setData] = useState(getData());
  const [lazyLoadingData, setLazyLoadingData] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [customTreeExpandAndFoldIcon, setCustomTreeExpandAndFoldIcon] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });

  const resetData = () => {
    const data = getData();
    // 当 keys 发生变化时才会触发更新
    // setData(data);
    // 如果希望无论何时都触发更新请使用 tableRef.current.resetData
    table.current.resetData(data);
  };

  const onEditClick = (row) => {
    const newData = {
      ...row,
      platform: '电子签署',
      type: 'Symbol',
      default: 'undefined',
    };
    table.current.setData(row.key, newData);
    MessagePlugin.success('数据已更新');
  };

  const onDeleteConfirm = (row) => {
    table.current.remove(row.key);
    MessagePlugin.success('删除成功');
  };

  const onLookUp = (row) => {
    const allRowData = table.current.getData(row.key);
    const message = '当前行全部数据，包含节点路径、父节点、子节点、是否展开、是否禁用等';
    MessagePlugin.success(`打开控制台查看${message}`);
    console.log(`${message}：`, allRowData);
  };

  const appendTo = (row) => {
    const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
    table.current.appendTo(row.key, {
      id: randomKey1,
      key: `申请人 ${randomKey1} 号`,
      platform: '电子签署',
      type: 'Number',
    });
    MessagePlugin.success(`已插入子节点申请人 ${randomKey1} 号，请展开查看`);

    // 一次性添加多个子节点。示例代码有效，勿删！!!
    // appendMultipleDataTo(row);
  };

  function appendMultipleDataTo(row) {
    const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
    const randomKey2 = Math.round(Math.random() * Math.random() * 1000) + 10000;
    const newData = [
      {
        id: randomKey1,
        key: `申请人 ${randomKey1} 号`,
        platform: '电子签署',
        type: 'Number',
      },
      {
        id: randomKey2,
        key: `申请人 ${randomKey2} 号`,
        platform: '纸质签署',
        type: 'Number',
      },
    ];
    table.current.appendTo(row?.key, newData);
    MessagePlugin.success(`已插入子节点申请人 ${randomKey1} 和 ${randomKey2} 号，请展开查看`);
  }

  // 当前节点之前，新增兄弟节前
  const insertBefore = (row) => {
    const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
    table.current.insertBefore(row.key, {
      id: randomKey,
      key: `申请人 ${randomKey} 号`,
      platform: '纸质签署',
      type: 'Number',
    });
    MessagePlugin.success(`已插入子节点申请人 ${randomKey} 号，请展开查看`);
  };

  // 当前节点之后，新增兄弟节前
  const insertAfter = (row) => {
    const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
    table.current.insertAfter(row.key, {
      id: randomKey,
      key: `申请人 ${randomKey} 号`,
      platform: '纸质签署',
      type: 'Number',
    });
    MessagePlugin.success(`已插入子节点申请人 ${randomKey} 号，请展开查看`);
  };

  const columns = [
    // 实验中
    {
      // 列拖拽排序必要参数
      colKey: 'drag',
      title: '排序',
      cell: () => <MoveIcon />,
      width: 80,
      align: 'center',
    },
    {
      width: 180,
      colKey: 'key',
      title: '名称',
      ellipsis: true,
    },
    {
      colKey: 'platform',
      title: '签署方式',
      width: 100,
    },
    {
      colKey: 'operate',
      width: 340,
      title: '操作',
      align: 'center',
      // 增、删、改、查 等操作
      cell: ({ row }) => (
        <div className="tdesign-table-demo__table-operations">
          <Link hover="color" style={{ padding: '0 8px' }} onClick={() => appendTo(row)}>
            插入
          </Link>
          <Link hover="color" style={{ padding: '0 8px' }} onClick={() => insertBefore(row)}>
            前插
          </Link>
          <Link hover="color" style={{ padding: '0 8px' }} onClick={() => insertAfter(row)}>
            后插
          </Link>
          <Link hover="color" style={{ padding: '0 8px' }} onClick={() => onEditClick(row)}>
            更新
          </Link>
          <Link hover="color" style={{ padding: '0 8px' }} onClick={() => onLookUp(row)}>
            查看
          </Link>
          <Popconfirm content="确认删除吗" onConfirm={() => onDeleteConfirm(row)}>
            <Link hover="color" style={{ padding: '0 8px' }}>
              删除
            </Link>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onRowToggle = () => {
    const rowIds = [
      '申请人 1_1 号（第 1 页）',
      '申请人 2_1 号（第 1 页）',
      '申请人 3_1 号（第 1 页）',
      '申请人 4_1 号（第 1 页）',
    ];
    rowIds.forEach((id) => {
      // getData 参数为行唯一标识，lodash.get(row, rowKey)
      const rowData = table.current.getData(id);
      table.current.toggleExpandData(rowData);
      // 或者
      // table.current.toggleExpandData({ rowIndex: rowData.rowIndex, row: rowData.row });
    });
  };

  const appendToRoot = () => {
    const key = Math.round(Math.random() * 10010);
    table.current.appendTo('', {
      id: key,
      key: `申请人 ${key}_${1} 号`,
      platform: key % 2 === 0 ? '共有' : '私有',
      type: ['String', 'Number', 'Array', 'Object'][key % 4],
      default: ['-', '0', '[]', '{}'][key % 4],
      detail: {
        position: `读取 ${key} 个数据的嵌套信息值`,
      },
      needed: key % 4 === 0 ? '是' : '否',
      description: '数据源',
    });

    // 同时添加多个元素，示例代码有效勿删
    // appendMultipleDataTo();
  };

  const onExpandAllToggle = () => {
    setExpandAll(!expandAll);
    !expandAll ? table.current.expandAll() : table.current.foldAll();
  };

  const getTreeNode = () => {
    const treeData = table.current.getTreeNode();
    console.log(treeData);
    MessagePlugin.success('树形结构获取成功，请打开控制台查看');
  };

  const renderTreeExpandAndFoldIcon = ({ type, row }) => {
    if (lazyLoadingData?.id === row?.id) {
      return <Loading size="14px" />;
    }
    return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />;
  };

  const onPageChange = (pageInfo) => {
    setPagination({ ...pagination, ...pageInfo });
    setData(getData(pageInfo.current));
  };

  // 懒加载图标渲染
  function lazyLoadingTreeIconRender(params) {
    const { type, row } = params;
    if (lazyLoadingData?.id === row?.id) {
      return <Loading size="14px" />;
    }
    return type === 'expand' ? <AddRectangleIcon /> : <MinusRectangleIcon />;
  }

  const treeExpandIconRender = useMemo(() => {
    // 自定义展开图标
    if (customTreeExpandAndFoldIcon) {
      return renderTreeExpandAndFoldIcon;
    }
    return lazyLoadingTreeIconRender;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyLoadingData, customTreeExpandAndFoldIcon]);

  function onTreeExpandChange(context) {
    console.log(context.rowState.expanded ? '展开' : '收起', context);
    /**
     * 如果是懒加载，请确认自己完成了以下几个步骤
     * 1. 提前设置 children 值为 true；
     * 2. 在 onTreeExpandChange 事件中处理异步数据；
     * 3. 自定义展开图标渲染 lazyLoadingTreeIconRender
     */
    if (context.row.list === true) {
      setLazyLoadingData(context.row);
      const timer = setTimeout(() => {
        appendMultipleDataTo(context.row);
        setLazyLoadingData(null);
        clearTimeout(timer);
      }, 200);
    }
  }

  return (
    <Space direction="vertical">
      <Space>
        <Button onClick={appendToRoot}>添加根节点</Button>
        <Button theme="default" style={{ marginLeft: '16px' }} onClick={resetData}>
          重置/更新数据
        </Button>
        <Button theme="default" style={{ marginLeft: '16px' }} onClick={onRowToggle}>
          展开/收起可见行
        </Button>
        <Button theme="default" style={{ marginLeft: '16px' }} onClick={onExpandAllToggle}>
          {expandAll ? '收起全部' : '展开全部'}
        </Button>
        <Button theme="default" style={{ marginLeft: '16px' }} onClick={getTreeNode}>
          获取全部树形结构
        </Button>
      </Space>
      <Checkbox
        checked={customTreeExpandAndFoldIcon}
        onChange={setCustomTreeExpandAndFoldIcon}
        style={{ verticalAlign: 'middle' }}
      >
        自定义折叠/展开图标
      </Checkbox>
      {/* <!-- !!! 树形结构 EnhancedTable 才支持，普通 Table 不支持 !!! --> */}
      {/* treeNodeColumnIndex 定义第几列作为树结点展开列，默认为第一列 --> */}
      {/* defaultExpandAll 默认展开全部，也可通过实例方法 table.current.expandAll() 自由控制展开或收起 */}
      <EnhancedTable
        ref={table}
        rowKey="key"
        data={data}
        columns={columns}
        tree={{ childrenKey: 'list', treeNodeColumnIndex: 2 /** , defaultExpandAll: true */ }}
        dragSort="row-handler"
        treeExpandAndFoldIcon={treeExpandIconRender}
        pagination={pagination}
        onPageChange={onPageChange}
        onTreeExpandChange={onTreeExpandChange}
      ></EnhancedTable>

      {/* <!-- 第二列展开树结点，缩进为 12px，示例代码有效，勿删 -->
      <!-- indent 定义缩进距离 -->
      <!-- 如果子结点字段不是 'children'，可以使用 childrenKey 定义字段别名，如 `:tree="{ childrenKey: 'list' }"` --> */}
      {/* <EnhancedTable
        ref={table}
        rowKey="key"
        data={data}
        columns={columns}
        tree={{ indent: 12, treeNodeColumnIndex: 1, childrenKey: 'list', defaultExpandAll: true }}
      ></EnhancedTable> */}
    </Space>
  );
}
