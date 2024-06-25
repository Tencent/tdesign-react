import React from 'react';
import {Image, ImageViewer, Popup, Space} from 'tdesign-react';
import { BrowseIcon, EllipsisIcon } from 'tdesign-icons-react';

const imgH = 'https://tdesign.gtimg.com/demo/demo-image-3.png';
const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

const listItemStyle = {
  display: 'block',
  borderRadius: 'var(--td-radius-default)',
  height: '28px',
  lineHeight: '20px',
  cursor: 'pointer',
  padding: '3px 5px',
  color: 'var(--td-text-color-primary)',
  transition: 'background-color .2s cubic-bezier(.38,0,.24,1)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '--ripple-color': 'var(--td-bg-color-container-active)'
}

const ImageViewerIconList = ({ list, onClick }) => (
  <ul style={{ padding: '2px' }}>
    {list.map((it, index) => (
      <li key={index} style={listItemStyle} onClick={() => onClick(it, index)}>
        <span>{it.label}</span>
      </li>
    ))}
  </ul>
);
export default function BasicImageViewer() {
  const images = [img, imgH, imgV];

  const trigger = ({open}) => {
    const listCommon = (
      <ImageViewerIconList onClick={open} list={images.map((i, index) => ({ label: `图片${index}` }))} />
    );

    const mask = (
      <div
        style={{
          background: 'rgba(0,0,0,.6)',
          color: '#fff',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={open}
      >
        <span><BrowseIcon size="16px" name={'browse'}/> 预览</span>
      </div>
    );

    return (
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'content-box',
        border: '4px solid var(--td-bg-color-secondarycontainer)',
        borderRadius: 'var(--td-radius-medium)',
      }}>
        <Image
          alt={'test'}
          src={img}
          overlayContent={mask}
          overlayTrigger="hover"
          fit="contain"
          style={{
            width: 240,
            height: 240,
            backgroundColor: '#fff'
          }}
        />
        <div style={{
          width: '100%',
          height: '56px',
          padding: '0 16px',
          lineHeight: '56px',
          position: 'absolute',
          bottom: '0',
          color: 'var(--td-text-color-anti)',
          backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, 0) 100%)',
          display: 'flex',
          boxSizing: 'border-box',
          zIndex: 1
        }}>
          <span style={{flex: 1}}>相册封面标题</span>
          <span style={{ cursor: 'pointer' }}>
            <BrowseIcon size={16} onClick={open} />
            <Popup
              trigger="click"
              content={listCommon}
              placement="right-bottom"
              overlayStyle={{ width: '140px', padding: '6px' }}
              destroyOnClose
            >
              <EllipsisIcon size={16}/>
            </Popup>
          </span>
        </div>
      </div>

    )
  }

  return (
    <Space breakLine size={16}>
      <ImageViewer trigger={trigger} images={images} title="相册封面标题" />
    </Space>
  );
}
