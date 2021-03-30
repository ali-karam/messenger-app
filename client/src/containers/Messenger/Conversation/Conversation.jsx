import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import conversationStyle from './ConversationStyle';
import { Avatar, CircularProgress, TextField } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import useIntersectionObserver from '../../../customHooks/useIntersectionObserver';

const displayAvatar = (img) => {
  let avatar = img;
  if(typeof img === 'object') {
    avatar = new Buffer.from(img).toString('base64');
  }
  return `data:image/jpeg;base64,${avatar}`
}

const Conversation = () => {
  const classes = conversationStyle();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [text, setText] = useState('');

  const { id } = useParams();
  const observer = useRef();

  useEffect(() => {
    setLoading(true);
    axios.get(`/conversations/${id}?page=${pageNum}`)
      .then(res => {
        setUser(res.data.otherUser);
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

  const latestMsgRef = useCallback(node => {
    if(node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const lastMsgRef = useIntersectionObserver(observer, setPageNum, hasMore, loading);

  let messagesDisplay;
  if(messages) {
    messagesDisplay = messages.slice(0).reverse().map((message, index) => {
      if(messages.length === index + 1) {
        return (
          <p key={message._id} ref={latestMsgRef}>
            {message.creator.username}: {message.message}
          </p>
        );
      } else if(index === 0) {
        return (
          <p key={message._id} ref={lastMsgRef}>
            {message.creator.username}: {message.message}
          </p>
        );
      }
      else {
        return <p key={message._id}>{message.creator.username}: {message.message}</p>
      }
    });
  }
  let userDisplay;
  if(user) {
    userDisplay = (
      <>
        <Avatar
          alt={user.username}
          src={user.avatar ? displayAvatar(user.avatar) : null}
          className={classes.avatar}
        >
          {!user.avatar ? user.username.charAt(0).toUpperCase() : null}
        </Avatar>
        {user.username}
      </>
    )
  }

  const handleEnter = event => {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      
      if(text.trim() !== '') {
        axios.post(`/conversations/${id}`, { message: text })
          .then(res => {
            setMessages(prevMessages => {
              prevMessages.pop();
              return [res.data, ...prevMessages];
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
      setText('');
    }
  };
 
  return (
    <div style={{height: '600px'}}>
      {loading ? <CircularProgress /> : null}
      {userDisplay}
      <div style={{height: 400, justifyContent: 'end', overflow: 'scroll'}}>
        {messagesDisplay}
      </div>
      <TextField
        placeholder='Type something...'
        autoFocus
        multiline
        variant='outlined'
        rowsMax={5}
        spellCheck
        value={text}
        onKeyDown={handleEnter}
        onChange={event => setText(event.target.value)}
      />
    </div>
  );
};

export default Conversation;