import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CircularProgress, ClickAwayListener } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Picker from 'emoji-picker-react';
import useIntersectionObserver from '../../../customHooks/useIntersectionObserver';
import Message from '../../../components/Message/Message';
import MessageBar from '../../../components/MessageBar/MessageBar';
import PopupMessage from '../../../components/UI/PopupMessage/PopupMessage';
import OtherUserBanner from '../../../components/OtherUserBanner/OtherUserBanner';
import conversationStyle from './ConversationStyle';

const Conversation = () => {
  const classes = conversationStyle();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [text, setText] = useState('');
  const [emojiPickerIsShowing, setEmojiPickerIsShowing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { id } = useParams();
  const observer = useRef();

  useEffect(() => {
    setLoading(true);
    axios.get(`/conversations/${id}?page=${pageNum}`)
      .then(res => {
        setOtherUser(res.data.otherUser);
        setMessages(prevMessages => [...prevMessages, ...res.data.messages]);
        setHasMore(res.data.hasNext);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [id, pageNum]);

  useEffect(() => {
    setMessages([]);
  }, [id]);

  const lastMsgRef = useIntersectionObserver(observer, setPageNum, hasMore, loading);

  let messagesDisplay;
  if(messages) {
    messagesDisplay = messages.map((message, index) => {
      if(messages.length === index + 1) {
        return (
          <Message key={message._id} lastRef={lastMsgRef} message={message} otherUser={otherUser} />
        );
      }
      return (
        <Message 
          key={message._id} 
          message={message} 
          otherUser={otherUser} 
          latestMsg={index === 0} 
        />
      );
    });
  }

  const sendMsgToServer = data => {
    axios.post(`/conversations/${id}`, data)
    .then(res => {
      setMessages(prevMessages => {
        prevMessages.pop();
        return [res.data, ...prevMessages];
      });
    })
    .catch(err => {
      setErrorMsg('Oops! Something went wrong');
    });
  };

  const enterHandler = event => {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      
      if(text.trim() !== '') {
        sendMsgToServer({ message: text });
      }
      setText('');
    }
  };

  const fileSelectedHandler = event => {
    const file = event.target.files[0];
    if(file && file.size > 1000000) {
      setErrorMsg('File too large. Max size 1MB');
    } else if(file && !file.type.match(/^image\/(jpe?g|png)$/)) {
      setErrorMsg('Image must be either a png, jpg, or jpeg');
    } else {
      setErrorMsg('');
      const formData = new FormData();
      formData.append('message', file);
      sendMsgToServer(formData);
    }
  };

  const emojiSelectedHandler = (event, emojiObj) => {
    setText(prevText => prevText.concat(emojiObj.emoji));
  };

  const emojiBtnClickHandler = () => {
    setEmojiPickerIsShowing(prevIsShowing => !prevIsShowing);
  };

  const emojiSelector = (
    <ClickAwayListener onClickAway={emojiBtnClickHandler}>
      <div className={classes.emojiSelector}>
        <Picker onEmojiClick={emojiSelectedHandler} />
      </div>
    </ClickAwayListener>
  );
  
  return (
    <div className={classes.root}>
      {otherUser ? <OtherUserBanner username={otherUser.username} isOnline /> : null}
      {loading ? <CircularProgress size={30} className={classes.loading}/> : null}
      <div className={classes.messages}>
        {messagesDisplay}
        {emojiPickerIsShowing ? emojiSelector : null}
      </div>
      <MessageBar 
        text={text} 
        inputKeyDown={enterHandler} 
        inputChange={event => setText(event.target.value)}
        emojiBtnClick={emojiBtnClickHandler}
        fileChange={fileSelectedHandler}
      />
      <PopupMessage 
        open={errorMsg !== ''} 
        handleClose={() => setErrorMsg('')} 
        type='error' 
        message={errorMsg}
      />
    </div>
  );
};

export default Conversation;
