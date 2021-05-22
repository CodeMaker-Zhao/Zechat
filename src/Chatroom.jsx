import React, { useEffect, useCallback, useRef, useState } from 'react'
import './Chatroom.css'
import ChatContent from './ChatContent'
import io from 'socket.io-client'
import FirendList from './FirendList'
import PropTypes from 'prop-types'
import InputContent from './InputContent'
import { FireFilled } from '@ant-design/icons';

import { Popover, Popconfirm, message as msa } from 'antd';
const socket = io();

var windowStatus = 'focus';
window.onfocus = () => {
    windowStatus = 'focus';
}
window.onblur = () => {
    windowStatus = 'blur';
};

const notification = function (title, msg) {
    let options = {
        body: msg
    }
    let n;
    if (!window.Notification) {
        console.log('浏览器不支持通知');
    } else {
        if (Notification.permission === 'granted') {
            n = new Notification(title, options)
        } else if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('用户同意授权');
                    n = new Notification(title, options); // 显示通知
                } else if (permission === 'default') {
                    console.warn('用户关闭授权 未刷新页面之前 可以再次请求授权');
                } else {
                    // denied
                    console.log('用户拒绝授权 不能显示通知');
                }
            });
        } else {
            console.log('用户曾经拒绝过');
        }
    }
    if(n){
        n.onclick = function handleClick() {
            window.focus();
            this.close();
        };
        setTimeout(n.close.bind(n), 3000);
    }
}

export default function Chatroom(props) {
    const {
        user,
        setUser,
        updateFriendList,
        chatroom,
        setChatroom,
        friendList,
        toggleEmojiShow,
        emojiShow,
        onlineList,
        setOnlineList,
        lastMessageList,
        updateLastMessageList
    } = props;
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
        [user, friendList]
    )
    const inpRef = useRef(null);
    const mainRef = useRef(null);
    const [messageList, setMessageList] = useState([]);
    useEffect(() => {
        socket.emit('username', user.username);
        socket.on('updateOnlineList', (list) => {
            let olist = [];
            for (let key of Object.keys(list)) {
                if (list[key] != null) {
                    olist.push(key);
                }
            }
            setOnlineList(olist);
        })
    }, [user, setOnlineList])
    useEffect(() => {
        const text = document.getElementsByClassName('input')[0];
        const submit = document.getElementsByClassName('submit')[0];
        const cur = inpRef.current;
        const myFunction = function (e) {
            if (e.keyCode === 13 && e.shiftKey !== true && e.target.value !== '') {
                socket.emit('chat', JSON.stringify({
                    msg: e.target.value,
                    from: user.username,
                    to: chatroom,
                    id: user.id
                }))
                e.target.value = "";
            }
        }
        const clickFunction = () => {
            socket.emit('chat', JSON.stringify({
                msg: cur.value,
                from: user.username,
                id: user.id,
                to: chatroom
            }))
            cur.value = "";
        }
        text.addEventListener('keyup', myFunction)
        submit.addEventListener('click', clickFunction)
        return () => {
            submit.removeEventListener('click', clickFunction);
            text.removeEventListener('keyup', myFunction);
        }
    }, [chatroom, user])
    useEffect(() => {
        let myFunction = (e) => {
            const el = e.target.closest('.emojiTab')
            if (!el && emojiShow) {
                toggleEmojiShow(false);
            }
        }
        const main = mainRef.current;
        main.addEventListener('click', myFunction);
        return () => {
            main.removeEventListener('click', myFunction);
        }
    }, [mainRef, emojiShow, toggleEmojiShow])
    useEffect(() => {
        socket.on('chat', (msg) => {
            msg = JSON.parse(msg);
            if (Array.isArray(msg)) {
                setMessageList(messageList => [...messageList, ...msg]);
                msg.forEach(item => {
                    if (item.to === 'public') {
                        updateLastMessageList('public', item);
                    } else {
                        const toc = item.to === user.username ? item.from : item.to;
                        updateLastMessageList(toc, item);
                    }
                })
            } else {
                setMessageList(messageList => [...messageList, msg]);
                if (msg.to === 'public') {
                    updateLastMessageList('public', msg);
                } else {
                    const toc = msg.to === user.username ? msg.from : msg.to;
                    updateLastMessageList(toc, msg);
                }
                let title = msg.from + '对';
                if (msg.to === 'public') {
                    title = title + '大家说:'
                } else {
                    title = title + '你说'
                }
                
                if (windowStatus === 'blur') {
                    notification(title,msg.msg);
                }
            }

        })
        socket.on('add_concat', (from) => {
            console.log(from);
            updateFriendList([from]);
        })
    }, [updateFriendList, updateLastMessageList, user.username])
    const addEmoji = useCallback(
        (e) => {
            const inp = inpRef.current;
            inp.value += `#(${e})`;
            inp.focus();
            toggleEmojiShow(false);
        },
        [toggleEmojiShow]
    )
    const exit = useCallback(
        () => {
            setUser(null);
            localStorage.removeItem('notificationToken');
            window.location = '/login'
        }, [setUser]
    )

    const sendExp = (msg) => {
        socket.emit('chat', JSON.stringify({
            msg,
            from: user.username,
            to: chatroom,
            id: user.id
        }))
    }

    const sendImg = (msg) => {
        socket.emit('chat', JSON.stringify({
            msg,
            from: user.username,
            to: chatroom,
            id: user.id
        }))
    }

    const sendFile = (msg) => {
        socket.emit('chat', JSON.stringify({
            msg,
            from: user.username,
            to: chatroom,
            id: user.id
        }))
    }
    const text = <span>在线列表</span>;
    const content = (
        <div>

            {onlineList.map((item, index) => {
                return item === user.username ?
                    <p className="onlineMine" key={index}>{item}</p> :
                    <Popconfirm
                        placement="bottom"
                        icon={<FireFilled style={{ color: 'red' }} />}
                        onConfirm={() => { add_concat(item) }}
                        title='您要添加对方为好友嘛?'
                        key={index}
                        >
                        <p className="onlineItem">{item}</p>
                    </Popconfirm>
            })}
        </div>
    );
    return (
        <div className="chatroom">
            <div className="banner">
                <h1>Welcome, {user.username}</h1>
                <Popconfirm
                    className="exit"
                    placement="bottomRight"
                    onConfirm={() => { exit() }}
                    title='您要确定退出嘛?'
                >
                    <i className="popButton">&#xe72e;</i>
                </Popconfirm>
                <Popover className="popover" placement="bottomRight" title={text} content={content} trigger="click">
                    <i className="popButton">&#xe660;</i>
                </Popover>
            </div>
            <div className="content">
                <FirendList
                    friendList={friendList}
                    chatroom={chatroom}
                    setChatroom={setChatroom}
                    lastMessageList={lastMessageList}
                />
                <div className="mainContent" ref={mainRef}>
                    <ChatContent
                        socket={socket}
                        chatroom={chatroom}
                        messageList={messageList}
                        user={user}
                        friendList={friendList}
                        updateLastMessageList={updateLastMessageList}
                        />

                    <InputContent
                        inpRef={inpRef}
                        socket={socket}
                        sendExp={sendExp}
                        sendFile={sendFile}
                        sendImg={sendImg}
                        addEmoji={addEmoji}
                        emojiShow={emojiShow}
                        toggleEmojiShow={toggleEmojiShow} />
                </div>
            </div>
        </div>
    )
}

Chatroom.propTypes = {
    user: PropTypes.object.isRequired
}