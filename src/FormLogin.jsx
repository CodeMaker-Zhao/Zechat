import React,{useEffect} from 'react'
import './FormLogin.css'
import { Form, Input, Button } from 'antd'
import 'antd/dist/antd.css'

export default function FormLogin(props) {
    const {isLogin,onFinish,setUser} = props;
    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }
    const tailLayout = {
        wrapperCol: { offset: 6, span: 16 },
    };
    return (
        <div className='wrapper'>
            <h1>ZeChat</h1>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="username"
                    rules={[{
                        required: true,
                        message: '请输入用户名'
                    }]}
                >
                    <Input placeholder="请输入您的账号"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{
                        required: true,
                        message: '请输入密码'
                    }]}
                >
                    <Input.Password placeholder="请输入您的密码"/>
                </Form.Item>
                <Form.Item
                    {...tailLayout}
                >
                    <Button type="primary" htmlType="submit">
                        {isLogin?'登录':'确认'}
                    </Button>
                    <Button type='link' href={isLogin?'./signup':'./login'} style={{margin: '0 20px'}}>
                        {isLogin?'注册':'返回'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
