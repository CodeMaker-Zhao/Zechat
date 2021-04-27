export const ACTION_SET_USER = 'setUser'
export const ACTION_SET_FRIENDLIST = 'setFriendList'
export const ACTION_SET_CHATROOM = 'setChatroom'
export const ACTION_TOGGLE_EMOJI_SHOW = 'toggleEmojiShow'
export const ACTION_SET_ONLINE_LIST = 'setOnlineList'
export const ACTION_SET_LAST_MESSAGE_LIST = 'setLastMessageList'
export function setUser(user){
    return{
        type:ACTION_SET_USER,
        payload:user
    }
}
export function setOnlineList(list) {
    return{
        type:ACTION_SET_ONLINE_LIST,
        payload:list
    }
}
export function setFriendList(friend){
    return{
        type:ACTION_SET_FRIENDLIST,
        payload:friend
    }
}
export function setLastMessageList(message){
    return{
        type:ACTION_SET_LAST_MESSAGE_LIST,
        payload:message
    }
}
export function updateLastMessageList(chatroom,message) {
    return (dispatch,getState)=>{
        const {lastMessageList} = getState();
        const newObj = {};
        newObj[chatroom] = message;
        const newMessageList = Object.assign({},lastMessageList,newObj);
        dispatch(setLastMessageList(newMessageList))
    }
}
export function toggleEmojiShow(show){
    return{
        type:ACTION_TOGGLE_EMOJI_SHOW,
        payload:show
    }
}
export function setChatroom(room) {
    return{
        type:ACTION_SET_CHATROOM,
        payload:room
    }
}
export function updateFriendList(friend){
    return (dispatch,getState)=>{
        const {friendList} = getState();
        dispatch(setFriendList([
            ...friendList,
            ...friend
        ]))
    }
}