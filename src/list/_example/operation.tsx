import React from 'react';
import { List, Space, Link, Button } from 'tdesign-react';
import { EditIcon, DownloadIcon } from 'tdesign-icons-react';

const { ListItem, ListItemMeta } = List;

const avatarUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';

export default function BasicList() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <List>
        <ListItem
          action={
            <Space>
              <Link theme="primary" hover="color">
                操作1
              </Link>
              <Link theme="primary" hover="color">
                操作2
              </Link>
              <Link theme="primary" hover="color">
                操作3
              </Link>
            </Space>
          }
        >
          <ListItemMeta image={avatarUrl} title="列表主内容" description="列表内容列表内容" />
        </ListItem>
        <ListItem
          action={
            <Space>
              <Link theme="primary" hover="color">
                操作1
              </Link>
              <Link theme="primary" hover="color">
                操作2
              </Link>
              <Link theme="primary" hover="color">
                操作3
              </Link>
            </Space>
          }
        >
          <ListItemMeta image={avatarUrl} title="列表主内容" description="列表内容列表内容" />
        </ListItem>
      </List>

      <List split>
        <ListItem
          action={
            <Space>
              <Button variant="text" shape="square">
                <EditIcon />
              </Button>
              <Button variant="text" shape="square">
                <DownloadIcon />
              </Button>
            </Space>
          }
        >
          <ListItemMeta image={avatarUrl} title="列表主内容" description="列表内容列表内容" />
        </ListItem>
        <ListItem
          action={
            <Space>
              <Button variant="text" shape="square">
                <EditIcon />
              </Button>
              <Button variant="text" shape="square">
                <DownloadIcon />
              </Button>
            </Space>
          }
        >
          <ListItemMeta image={avatarUrl} title="列表主内容" description="列表内容列表内容" />
        </ListItem>
      </List>
    </Space>
  );
}
