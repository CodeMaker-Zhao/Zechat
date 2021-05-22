import React, { Fragment, useEffect, useRef, useMemo, useState, useCallback } from 'react'
import classnames from 'classnames'
import { Popconfirm, message as msa } from 'antd';
import { FireFilled } from '@ant-design/icons';
import './ChatContent.css'
import BaiduImage from './baidu.png'
const emoji = [
    '呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
    '鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
    '呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
    '升起', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '星星月亮', '太阳', '音乐',
    '灯泡', '蛋糕', '彩虹', '钱币', '咖啡', 'haha', '胜利', '大拇指', '弱', 'ok',
];

function Message(props) {
    const { user, message, showTime, add_concat } = props;
    let [time] = useState(new Date(Number(message.date)).toLocaleTimeString());
    const msg = useMemo(() => {
        let content,type = 'string';
        if(/#\((.+?)\)/.test(message.msg)){
            content = message.msg.replace(/#\((.+?)\)/g, (r, e) => {
                const index = emoji.indexOf(e);
                if (index !== -1) {
                    return `<div class="icon"  style="background-position: left ${-30
                        * index}px;background-image: url(${BaiduImage})" alt="${r}"></div>`;
                }
                return r;
            })
        }else if(/\$\(img\)/.test(message.msg)){
            type = 'img';
            content = message.msg.replace(/\$\(img\)/,'')
        }else{
            content = message.msg;
        }
        if (type==='string') {
            return (
                <div className="msgicon" dangerouslySetInnerHTML={{ __html: content }}>

                </div>
            );
        } else if (type==='img') {
            return (
                <div >
                    <img className='exp' alt='消息图片' src={content}></img>
                </div>
            )
        }

    }, [message])
    return (
        <Fragment>
            {showTime ? <div className='time'>
                {time}
            </div> : ''}
            <div className={classnames({ 'mine': user.id === message.id, 'others': user.id !== message.id })}>
                {user.id === message.id ? '' : <div className='info'>
                    <Popconfirm
                        placement="bottom"
                        icon={<FireFilled style={{ color: 'red' }} />}
                        onConfirm={() => { add_concat(message.from) }}
                        title='您要添加对方为好友嘛?'>
                        <i className='iconfont'>
                            &#xe62d;</i>
                    </Popconfirm>
                </div>}
                <div className='userInfo'>
                    <div className="username">
                        {message.from}
                    </div>
                    <div className='message'>
                        <span className='top'></span>
                        <span className='bot'></span>
                        {msg}
                    </div>
                </div>
                {user.id === message.id ? <div className='info'>
                    <i className='iconfont'>
                        &#xe62d;
                </i>
                </div> : ''}
            </div>
        </Fragment>
    )
}

export default function ChatContent(props) {
    const { messageList, user, socket, chatroom, friendList } = props;
    const msl = useRef(null);
    let lastTime;
    const add_concat = useCallback(
        (item) => {
            const msgObj = {
                from: user.username,
                to: item,
            };
            if (friendList.includes(item)) {
                msa.info('已经是你的好友');
            } else {
                socket.emit('add_concat', JSON.stringify(msgObj))
                msa.info('已发送请求');
            }
        },
        [socket, user, friendList]
    )
    useEffect(() => {
        msl.current.scrollTop = msl.current.scrollHeight - msl.current.clientHeight
    }, [messageList, msl, chatroom]);
    return (
        <div ref={msl} className="messageList">
            {messageList.map((item) => {
                let showTime = false;
                if (chatroom === 'public' && item.to === 'public') {
                    if (lastTime === undefined) {
                        showTime = true;
                        lastTime = item.date;
                    } else if (item.date - lastTime > 1000 * 60) {
                        showTime = true;
                        lastTime = item.date;
                    }
                    return <Message add_concat={add_concat} socket={socket} user={user} message={item} key={item.date} showTime={showTime} />
                } else if (chatroom === item.to || (chatroom === item.from && user.username === item.to)) {
                    if (lastTime === undefined) {
                        showTime = true;
                        lastTime = item.date;
                    } else if (item.date - lastTime > 1000 * 60) {
                        showTime = true;
                        lastTime = item.date;
                    }
                    return <Message add_concat={add_concat} socket={socket} user={user} message={item} key={item.date} showTime={showTime} />
                }
                return '';
            })}
        </div>
    )
}
