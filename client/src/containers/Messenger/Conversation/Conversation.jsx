import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import conversationStyle from './ConversationStyle';
import { CircularProgress, InputBase, InputAdornment, IconButton } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import useIntersectionObserver from '../../../customHooks/useIntersectionObserver';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Message from '../../../components/Message/Message';

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

  const lastMsgRef = useIntersectionObserver(observer, setPageNum, hasMore, loading);

  let messagesDisplay;
  if(messages) {
    messagesDisplay = messages.map((message, index) => {
      if(messages.length === index + 1) {
        return <Message key={message._id} lastRef={lastMsgRef} message={message} user={user}/>;
      }
      return <Message key={message._id} message={message} user={user}/>;
    });
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
    <div className={classes.root}>
      {user ? <h2>{user.username}</h2> : null}
      {loading ? <CircularProgress size={30}/> : null}
      <div className={classes.messages}>
        {messagesDisplay}
      </div>
      <InputBase
        className={classes.messageBar}
        placeholder='Type something...'
        autoFocus
        multiline
        variant='outlined'
        rowsMax={4}
        spellCheck
        value={text}
        onKeyDown={handleEnter}
        onChange={event => setText(event.target.value)}
        endAdornment={(
          <InputAdornment position='end'>
            <IconButton>
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton>
              <PhotoLibraryIcon/>
            </IconButton>
          </InputAdornment>
        )}
      />
    </div>
  );
};

export default Conversation;
