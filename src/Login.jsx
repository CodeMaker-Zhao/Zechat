import axios from 'axios'
import React from 'react'
import { Redirect } from 'react-router'
import FormLogin from './FormLogin.jsx'
const Login = function Login(props){
    const {user,setUser,updateFriendList} = props;
    const onFinish = (values)=>{
        axios.post('/login',{
            username:values.username,
            password:values.password
        }).then(res=>{
            let data = res.data;
            if(data.code === 0){
                setUser({
                    username:data.data.username,
                    id:data.data.id
                });
                if(data.data.friendList){
                    updateFriendList(data.data.friendList);
                }
                localStorage.setItem('notificationToken',data.token);
            }else{
                alert(data.msg);
            }
        })
    }
    return (
        user === null?
        <div className="formWrapper">
            <FormLogin isLogin={true} onFinish={onFinish} setUser={setUser}/>
        </div>
        :<Redirect to='/chatroom'/>
    )
}

export default Login;
