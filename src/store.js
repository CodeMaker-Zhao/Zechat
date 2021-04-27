import {createStore,combineReducers,applyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),{
        user:null,
        friendList:['public'],
        chatroom:'public',
        emojiShow:false,
        onlineList:[],
        lastMessageList:{}
    },
    applyMiddleware(thunk)
)