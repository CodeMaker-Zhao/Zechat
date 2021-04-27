import React from 'react'
import classnames from 'classnames'
import './FirendList.css'

function Friend(props) {
    const { friend, setChatroom, chatroom, msgAbr } = props;
    return (
        <div className={classnames('friend', { 'picked': friend === chatroom })} onClick={() => { setChatroom(friend) }}>
            {friend === 'public' ? <i className="groupIcon">&#xe60a;</i>:
            <i className="groupIcon">&#xe62d;</i>}
            <div>
                <h1>{friend}</h1>
                {msgAbr ? <p>{msgAbr.from}: {msgAbr.msg}</p> : '...'}
            </div>
        </div>
    )
}

export default function FirendList(props) {
    const { friendList, setChatroom, chatroom, lastMessageList } = props;
    return (
        <div className='sideMenu'>
            {friendList.map(item => {
                return <Friend
                    friend={item}
                    key={item}
                    chatroom={chatroom}
                    msgAbr={lastMessageList[item]}
                    setChatroom={setChatroom} />
            })}
        </div>
    )
}
