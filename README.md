## ZeChat

最近在学习React，自己撸了一个聊天室项目，前端使用了React + Redux + Antd，后端使用了Express + MongoDB，服务端socket服务使用了socket.io，这是第一个自己做的项目，代码架构可能还不是那么清晰，如果有什么问题或者建议的话，欢迎在issue中讨论。

## 功能介绍

- [x] 登录/注册
- [x] JWT用于身份验证
- [x] 发送表情
- [x] 显示在线列表
- [x] 支持群聊和私聊
- [x] 添加好友
- [x] 好友列表显示最新消息

## 使用方法

1、[下载服务端](https://github.com/CodeMaker-Zhao/ZeChat_Server/tree/master)

```
git clone https://github.com/CodeMaker-Zhao/ZeChat_Server.git;
cd server;
npm install;//安装依赖
npm run start;//启动服务器
```

2、下载客户端代码

```
git clone https://github.com/CodeMaker-Zhao/Zechat.git;
cd ZeChat;
npm install;//安装依赖
npm run start;//启动客户端
```

3、在浏览器输入localhost:3000端口即可进入

## 效果图
[](./screenshot.png)
[](./screenshot2.png)
