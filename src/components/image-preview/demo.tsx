import { CodePaper } from 'components/code-paper/CodePaper';
import React, { useEffect, useState } from 'react';
import img from '../../assets/image/panda.png';
import './demo.scss';
import { ImagePreview } from './ImagePreview';

export const ImagePreviewDemo = () => {
    const [showDefault, setShowDefault] = useState(false);
    const [showWebImage, setShowWebImage] = useState(false);
    const [webImageUrl, setWebImageUrl] = useState('');

    const showDefaultModal = () => {
        setShowDefault(true);
    };

    const showModal = (text: string) => {
        if (text) {
            setWebImageUrl(text);
            localStorage.setItem('image-preview-url', text);
        }
        setShowWebImage(true);
    };

    const closeDefaultPreview = () => {
        setShowDefault(false);
    };

    const closePreview = () => {
        setShowWebImage(false);
    };

    // 加载本地缓存url
    useEffect(() => {
        const text = localStorage.getItem('image-preview-url');
        if (text) {
            setWebImageUrl(text);
        }
    }, []);

    return (
        <div>
            <h3>组件名称：图片预览（ImagePreview）</h3>
            <h4>示例图片</h4>
            <img src={img} alt="图片" onClick={showDefaultModal}></img>
            <ImagePreview url={img} fixed={true} visible={showDefault} onClose={closeDefaultPreview} />
            <br />
            <h4>网络图片</h4>
            <p>将想要测试图片地址输入(空白使用默认图片)</p>
            <CodePaper text={webImageUrl} handleClick={showModal} buttonText="显示预览" className="small-size" />
            <ImagePreview url={webImageUrl} fixed={true} visible={showWebImage} onClose={closePreview} />
        </div>
    );
};
