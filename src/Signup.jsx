import React, { memo } from 'react'
import FormLogin from './FormLogin'
import {Redirect} from 'react-router-dom'
import axios from 'axios'
const Signup = memo(function Signup(props) {
    const {setUser,user} = props;
    const onFinish = (values)=>{
        axios.post('/register',{
            username:values.username,
            password:values.password
        }).then(res=>{
            let data = res.data;
            if(data.code===0){
                setUser({
                    username:data.data.username,
                    id:data.data.id
                });
                localStorage.setItem('notificationToken',data.token);
            }else{
                alert(data.msg);
            }
        })
    }
    return (
        user == null ?
        <div>
            <FormLogin isLogin={false} onFinish = {onFinish} setUser={setUser}/>
        </div>
        :
        <Redirect to='/chatroom'/>
    )
})

export default Signup
