import Collapse from 'antd/lib/collapse/Collapse';
import { CodePaper } from 'components/code-paper/CodePaper';
import { IsolateBlock } from 'components/isolate-block/IsolateBlock';
import { WebFrame } from 'components/web-frame';
import React, { useEffect, useState } from 'react';
import img from '../../../assets/image/panda.png';
import { ImagePreview } from '../ImagePreview';
import './demo.scss';

const { Panel } = Collapse;

const largeSample = 'https://cdn.pixabay.com/photo/2020/03/08/11/21/british-4912211_960_720.jpg';

export const ImagePreviewDemo = () => {
    const [show, setShow] = useState<number | null>(-1);

    const [webImageUrl, setWebImageUrl] = useState('');

    const close = () => {
        setShow(null);
    };

    const showDefault = () => {
        setShow(0);
    };

    const showDefaultLarge = () => {
        setShow(1);
    };

    const showWebImage = (text: string) => {
        if (text) {
            setWebImageUrl(text);
            localStorage.setItem('image-preview-url', text);
        }
        setShow(2);
    };

    // 加载本地缓存url
    useEffect(() => {
        const text = localStorage.getItem('image-preview-url');
        if (text) {
            setWebImageUrl(text);
        }
    }, []);

    function callback(key: any) {
        console.log(key);
    }

    return (
        <div>
            <h2>组件名称：图片预览（ImagePreview）</h2>
            <p>基础操作: 滚轮缩放 拖拽</p>
            <p>菜单操作: 旋转 重置</p>
            <div className="g-table">
                <IsolateBlock>
                    <h4>基本示例</h4>
                    <p>无菜单</p>
                    <img src={img} alt="图片" className="g-sample-image" onClick={showDefault} />
                    <ImagePreview url={img} fixed={true} visible={show === 0} onClose={close} operator={{ bar: null, contextMenu: null }} />
                </IsolateBlock>

                <IsolateBlock>
                    <h4>功能菜单</h4>
                    <p>含默认右键菜单</p>
                    <img alt="图片" className="g-sample-image" src={largeSample} onClick={showDefaultLarge} />
                    <ImagePreview url={largeSample} fixed={true} visible={show === 1} onClose={close} />
                    <br />
                </IsolateBlock>

                <IsolateBlock>
                    <h4>网络图片</h4>
                    <p>默认菜单</p>
                    <p>将想要测试图片地址输入(空白使用默认图片)</p>
                    <CodePaper text={webImageUrl} handleClick={showWebImage} buttonText="显示预览" className="small-size" />
                    <ImagePreview url={webImageUrl} fixed={true} visible={show === 2} onClose={close} />
                </IsolateBlock>
            </div>

            <Collapse defaultActiveKey={['0']} onChange={callback}>
                <Panel header="文档" key="1">
                    <WebFrame url="https://caperso.github.io/gas-pedal/image-preview"></WebFrame>
                </Panel>
            </Collapse>
        </div>
    );
};
