import './App.css';
import Login from './Login'
import Signup from './Signup'
import axios from 'axios'
import Chatroom from './Chatroom'
import React, { useMemo,useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setUser, updateLastMessageList, updateFriendList, setChatroom, toggleEmojiShow, setOnlineList } from './action'
function App(props) {
  const { user, friendList, chatroom, dispatch, emojiShow, onlineList, lastMessageList } = props;
  const loginCbs = useMemo(() => {
    return bindActionCreators({
      setUser,
      updateFriendList
    }, dispatch)
  }, [dispatch])
  const signUpCbs = useMemo(() => {
    return bindActionCreators({
      setUser
    }, dispatch)
  }, [dispatch])
  const chatRoomCbs = useMemo(() => {
    return bindActionCreators({
      updateFriendList,
      setChatroom,
      setOnlineList,
      toggleEmojiShow,
      updateLastMessageList,
      setUser
    }, dispatch)
  }, [dispatch])
  useEffect(() => {
    let nToken = localStorage.getItem('notificationToken')
    if(nToken){
        axios.get('/users',{
            headers:{
                'Authorization': 'Bearer ' + nToken,
            }
        }).then(res=>{
            const data = res.data;
            if(data.code===0){
                dispatch(setUser({
                    username:data.username,
                    id:data.id
                }));
                if(data.friendList){
                    dispatch(updateFriendList(data.friendList));
                }
            }else if(data.code === 1){
                alert(data.msg);
            }
        })
    }
  }, [dispatch])
  return (
    <div className="App">
      <Switch>
        <Route path="/login">
          <Login user={user} {...loginCbs} />
        </Route>
        <Route path="/signup">
          <Signup {...signUpCbs} user={user} />
        </Route>
        <Route path="/chatroom">
          {
            user==null?<Redirect to='/'></Redirect>:
            <Chatroom onlineList={onlineList}
            user={user}
            chatroom={chatroom}
            emojiShow={emojiShow}
            friendList={friendList}
            lastMessageList={lastMessageList}
            {...chatRoomCbs} />
          }
        </Route>
        <Route path="/">
          <Login user={user} {...loginCbs} />
        </Route>
      </Switch>
    </div>
  );
}

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return {
      dispatch
    }
  }
)(App);
