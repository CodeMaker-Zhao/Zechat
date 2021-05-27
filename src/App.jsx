import './App.css';
import Login from './Login'
import axios from 'axios'
import React, { useMemo, useEffect, lazy,Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { setUser, updateLastMessageList, updateFriendList, setChatroom, toggleEmojiShow, setOnlineList } from './action'

const si = import('./Signup')
const ci = import('./Chatroom')

const Signup = lazy(() => si)
const Chatroom = lazy(() => ci)

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
    if (nToken) {
      axios.get('/users', {
        headers: {
          'Authorization': 'Bearer ' + nToken,
        }
      }).then(res => {
        const data = res.data;
        if (data.code === 0) {
          dispatch(setUser({
            username: data.username,
            id: data.id
          }));
          if (data.friendList&&friendList.length===1) {
            dispatch(updateFriendList(data.friendList));
          }
        } else if (data.code === 1) {
          alert(data.msg);
        }
      })
    }
  }, [dispatch,friendList.length])
  useEffect(() => {
    console.log('bg请求');
    axios.get('/bg', {
      responseType: 'blob'
    }).then(res => {
      const url = window.URL.createObjectURL(res.data);
      document.getElementsByClassName('App')[0].style.backgroundImage = 'url(' + url + ')';
    })
  }, [])
  const signupSuspense = (<div className='wrapper'></div>);
  const chatSuspense = (<div className='chatSuspense'></div>)
  return (
    <div className="App">
      <Switch>
        <Route path="/login">
          <Login user={user} {...loginCbs} />
        </Route>
          <Route path="/signup">
            <Suspense fallback={signupSuspense}>
              <Signup {...signUpCbs} user={user} />
            </Suspense>
          </Route>
        <Route path="/chatroom">
          {
            user == null ? <Redirect to='/'></Redirect> :
            <Suspense fallback={chatSuspense}>
              <Chatroom onlineList={onlineList}
                user={user}
                chatroom={chatroom}
                emojiShow={emojiShow}
                friendList={friendList}
                lastMessageList={lastMessageList}
                {...chatRoomCbs} />
            </Suspense>  
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
