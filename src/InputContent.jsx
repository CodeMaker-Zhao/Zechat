import React, { useState, useCallback, useEffect } from 'react'
import './InputContent.css'
import readDiskFile from './readDiskFile.js'
import BaiduImage from './baidu.png';
import { useRef } from 'react';
import { Popover } from 'antd';
import axios from 'axios'

const emoji = [
    '呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
    '鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
    '呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
    '升起', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '星星月亮', '太阳', '音乐',
    '灯泡', '蛋糕', '彩虹', '钱币', '咖啡', 'haha', '胜利', '大拇指', '弱', 'ok',
];
function EmojiTab(props) {
    const { emojiShow, toggleEmojiShow, addEmoji, socket, sendExp } = props;
    const [isEmojiShow, exchangeShow] = useState(true);
    return (
        <div className="emojiTab" >
            <button className="emojiButton" onClick={() => { toggleEmojiShow(!emojiShow) }}>&#xe745;</button>
            <div className='emojibar' style={{ visibility: emojiShow ? 'visible' : 'hidden' }}>
                <div onClick={() => exchangeShow(true)}>Emoji</div>
                <div onClick={() => exchangeShow(false)}>搜索表情包</div>
            </div>
            {
                isEmojiShow ?
                    <Emoji addEmoji={addEmoji} emojiShow={emojiShow} /> :
                    <SearchExpression toggleEmojiShow={toggleEmojiShow} emojiShow={emojiShow} sendExp={sendExp} socket={socket} />
            }
        </div>
    )
}

function Emoji(props) {
    const { addEmoji, emojiShow } = props;
    return (
        <div className="emojiList" style={{ visibility: emojiShow ? 'visible' : 'hidden' }}>
            {emoji.map((e, index) => {
                return (
                    <div className="emojiBlock" key={e} data-name={e} role="button" onClick={(e) => { addEmoji(e.currentTarget.dataset.name) }}>
                        <div className="emojiItem" style={{
                            backgroundPosition: `left ${-30 * index}px`,
                            backgroundImage: `url(${BaiduImage})`,
                        }} />
                    </div>
                )
            })}
        </div>
    )
}

function SearchExpression(props) {
    const { socket, emojiShow, sendExp, toggleEmojiShow } = props;
    const [expList, setExpList] = useState([]);
    const serachInp = useRef();
    useEffect(() => {
        socket.on('searchExp', exp => {
            if (exp === '发生未知错误') alert('找不到图片');
            setExpList(exp);
        })
    }, [socket])
    const sendMessage = (node) => {
        let src = node.target.currentSrc;
        toggleEmojiShow(!emojiShow);
        sendExp('$(img)' + src);
    }
    const onSearch = useCallback(
        () => {
            socket.emit('searchExpression', serachInp.current.value)
        },
        [socket],
    )
    return (
        <div className='emojiList' style={{ visibility: emojiShow ? 'visible' : 'hidden' }}>
            <div className='searchBar'>
                <input ref={serachInp} placeholder='在这里输入关键字'></input>
                <button onClick={onSearch}>搜索</button>
            </div>
            {expList.length === 0 ? '' : <div className='expList'>
                {expList.map((item, index) => {
                    return <img onClick={sendMessage} className='exp' alt={index} src={item.image} key={item.image}></img>
                })}
            </div>}
        </div>
    )
}

function OtherTab() {
    async function sendImageMessage(image) {
        if (image.length > 5*1024*1024) {
            alert('要发送的图片过大');
            return;
        }
        axios.post('./file',{
            data:image.result,
            filename:image.filename
        })
    }
    async function handleSendImage() {
        const image = await readDiskFile('blob', 'image/png,image/jpeg,image/gif');
        if (!image) return;
        sendImageMessage(image);
        return null;
    }
    const content = (
        <div>
            <div>上传文件</div>
            <div onClick={handleSendImage}>上传图片</div>
        </div>
    )
    return (
        <div className="otherTab" >
            <Popover placement="top" content={content} trigger="click">
                <i className="popButton">&#xe611;</i>
            </Popover>
        </div>
    )
}

export default function InputContent(props) {
    const { inpRef,emojiShow, addEmoji, toggleEmojiShow, socket, sendExp } = props;
    return (
        <div className="inputContent">
            <EmojiTab addEmoji={addEmoji} socket={socket} sendExp={sendExp} emojiShow={emojiShow} toggleEmojiShow={toggleEmojiShow} />
            <OtherTab />
            <input className="input" ref={inpRef} placeholder="随便说点什么吧～"></input>
            <i className="submit">&#xe638;</i>
        </div>
    )
}
