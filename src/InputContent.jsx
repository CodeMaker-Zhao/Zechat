import React from 'react'
import './InputContent.css'
import classnames from 'classnames'
import BaiduImage from './baidu.png';

const emoji = [
    '呵呵', '哈哈', '吐舌', '啊', '酷', '怒', '开心', '汗', '泪', '黑线',
    '鄙视', '不高兴', '真棒', '钱', '疑问', '阴险', '吐', '咦', '委屈', '花心',
    '呼', '笑眼', '冷', '太开心', '滑稽', '勉强', '狂汗', '乖', '睡觉', '惊哭',
    '升起', '惊讶', '喷', '爱心', '心碎', '玫瑰', '礼物', '星星月亮', '太阳', '音乐',
    '灯泡', '蛋糕', '彩虹', '钱币', '咖啡', 'haha', '胜利', '大拇指', '弱', 'ok',
];
function EmojiTab(props) {
    const {emojiShow,toggleEmojiShow,addEmoji} = props;
    return(
        <div className="emojiTab" >
            <button className="emojiButton" onClick={()=>{toggleEmojiShow(!emojiShow)}}>&#xe93d;</button>
            <div className="emojibar" style={{visibility:emojiShow?'visible':'hidden'}}>Emoji</div>
            <div className="emojiList" style={{visibility:emojiShow?'visible':'hidden'} }>
                {emoji.map((e,index)=>{
                    return(
                        <div className="emojiBlock" key={e} data-name={e} role="button" onClick={(e)=>{addEmoji(e.currentTarget.dataset.name)}}>
                            <div className="emojiItem" style={{
                            backgroundPosition: `left ${-30 * index}px`,
                            backgroundImage: `url(${BaiduImage})`,
                        }}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function InputContent(props) {
    const {inpRef,emojiShow,addEmoji,toggleEmojiShow} = props;
    return (
        <div className="inputContent">
            <EmojiTab addEmoji={addEmoji} emojiShow={emojiShow} toggleEmojiShow={toggleEmojiShow}/>
            <input className="input" ref={inpRef} placeholder="随便说点什么吧～"></input>
            <i className="submit">&#xe638;</i>
        </div>
    )
}
