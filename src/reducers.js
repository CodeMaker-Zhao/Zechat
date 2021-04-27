import{
    ACTION_SET_USER,
    ACTION_SET_FRIENDLIST,
    ACTION_SET_CHATROOM,
    ACTION_TOGGLE_EMOJI_SHOW,
    ACTION_SET_ONLINE_LIST,
    ACTION_SET_LAST_MESSAGE_LIST
}from './action'

const reducers = {
    user(state=null,action){
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_USER:
                return payload
            default:
                break;
        }
        return state;
    },
    onlineList(state=[],action){
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_ONLINE_LIST:
                return payload;
            default:
                break;
        }
        return state;
    },
    lastMessageList(state={},action){
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_LAST_MESSAGE_LIST:
                return payload;
            default:
                break;
        }
        return state;
    },
    friendList(state=['public'],action){
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_FRIENDLIST:
                return payload;
            default:
                break;
        }
        return state;
    },
    chatroom(state='public',action){
        const {type,payload} = action;
        switch (type) {
            case ACTION_SET_CHATROOM:
                return payload;
            default:
                break;
        }
        return state;
    },
    emojiShow(state=false,action){
        const {type,payload} = action;
        switch (type) {
            case ACTION_TOGGLE_EMOJI_SHOW:
                return payload;
            default:
                break;
        }
        return state;
    }
}

export default reducers;