import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

const Messenger = () => {
  const [query, setQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [conversations, setConversations] = useState(null);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    if (query.trim() === '') return;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      axios.get('/users', { params: { username: query, page: pageNum } })
        .then(res => {
          setUsers(prevUsers => [...prevUsers, ...res.data.users]);
          setHasMore(res.data.hasNext);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, pageNum]);

  useEffect(() => {
    setUsers([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    axios.get('/conversations')
      .then(res => {
        setConversations(res.data.conversations);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const observer = useRef();
  const lastUserRef = useCallback(node => {
    if(loading) return;
    if(observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) {
        setPageNum(prevPageNum => ++prevPageNum);
      }
    })
    if(node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);

  const searchHandler = (event) => {
    setQuery(event.target.value);
    setPageNum(1);
  };

  const convoSelectHandler = (id) => {
    axios.get(`/conversations/${id}`)
      .then(res => {
        setConversation(res.data.messages);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let conversationDisplay = null;
  let singleConversation = null;
  if(conversations) {
    conversationDisplay = conversations.map(convo => (
      <div key={convo._id} onClick={() => convoSelectHandler(convo._id)}>
        <p >
          {convo.users[0].username}
        </p>
        
        <p>
          {convo.lastMessage.creator === convo.users[0]._id ? convo.users[0].username : 'You'}:
          {convo.lastMessage.message} ({convo.lastMessage.read ? 'read' : 'not-read'})
        </p>
      </div>
    ));
  }
  if(conversation) {
    singleConversation = conversation.map(message => (
      <p key={message._id}>
        {message.creator.username}: {message.message} 
      </p>
    ))
  }
  return (
    <>
      <input type="text" value={query} onChange={searchHandler} />
      {loading ? <CircularProgress /> : null}
      {users.map((user, index) => {
        if(users.length === index + 1) {
          return <p ref={lastUserRef} key={user._id}>{user.username}</p>;
        } else {
          return <p key={user._id}>{user.username}</p>;
        }
      })}
      {conversationDisplay}
      {singleConversation}
    </>
  );
};

export default Messenger;
