import React, {useEffect} from 'react';
import {ImageViewer} from 'tdesign-react';
import {BrowseIcon} from "tdesign-icons-react";

const classStyles = `
<style>
.tdesign-demo-image-viewer__ui-image {
    width: 100%;
    height: 100%;
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    border-radius: var(--td-radius-small);
    overflow: hidden;
}

.tdesign-demo-image-viewer__ui-image--hover {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, .6);
    color: var(--td-text-color-anti);
    line-height: 22px;
    transition: .2s;
}

.tdesign-demo-image-viewer__ui-image:hover .tdesign-demo-image-viewer__ui-image--hover {
    opacity: 1;
    cursor: pointer;
}

.tdesign-demo-image-viewer__ui-image--img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
    position: absolute;
}

.tdesign-demo-image-viewer__ui-image--footer {
    padding: 0 16px;
    height: 56px;
    width: 100%;
    line-height: 56px;
    font-size: 16px;
    position: absolute;
    bottom: 0;
    color: var(--td-text-color-anti);
    background-image: linear-gradient(0deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    box-sizing: border-box;
}

.tdesign-demo-image-viewer__ui-image--title {
    flex: 1;
}

.tdesign-demo-popup__reference {
    margin-left: 16px;
}

.tdesign-demo-image-viewer__ui-image--icons .tdesign-demo-icon {
    cursor: pointer;
}

.tdesign-demo-image-viewer__base {
    width: 160px;
    height: 160px;
    margin: 10px;
    border: 4px solid var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
}
</style>
`


const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const trigger = ({onOpen}) => (
    <div className={`tdesign-demo-image-viewer__ui-image`}>
      <img
        alt={'test'}
        src={img}
        className={`tdesign-demo-image-viewer__ui-image--img`}
      />
      <div className={`tdesign-demo-image-viewer__ui-image--hover`} onClick={onOpen}>
        <span><BrowseIcon size="1.4em" name={'browse'}/> 预览</span>
      </div>
    </div>
  )

  const images = [{
    mainImage: imgV,
    thumbnail: img
  }]

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <>
      <div className="tdesign-demo-image-viewer__ui-image tdesign-demo-image-viewer__base">
        <ImageViewer trigger={trigger} images={images}/>
      </div>
      <div className="tdesign-demo-image-viewer__ui-image tdesign-demo-image-viewer__base">
        <ImageViewer trigger={trigger} images={[images[0].mainImage]}/>
      </div>
    </>
  );
}
