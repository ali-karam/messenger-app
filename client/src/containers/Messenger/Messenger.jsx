import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Route } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import ConversationPreview from '../../components/ConversationPreview/ConversationPreview';
import UserCard from '../../components/UserCard/UserCard';
import Conversation from './Conversation/Conversation';
import useIntersectionObserver from '../../customHooks/useIntersectionObserver';

const Messenger = ({ match }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [hasMoreConvos, setHasMoreConvos] = useState(false);
  const [userPageNum, setPageNum] = useState(1);
  const [convoPageNum, setConvoPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (query.trim() === '') {
      setIsSearching(false);
      setLoading(false);
      return;
    };
    setIsSearching(true);
    setLoading(true);

    const timeoutId = setTimeout(() => {
      axios.get(`/users?username=${query}&page=${userPageNum}`)
        .then(res => {
          setUsers(prevUsers => [...prevUsers, ...res.data.users]);
          setHasMoreUsers(res.data.hasNext);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, userPageNum]);

  useEffect(() => {
    setUsers([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    axios.get(`/conversations?page=${convoPageNum}`)
      .then(res => {
        setConversations(prevConvos => [...prevConvos, ...res.data.conversations]);
        setHasMoreConvos(res.data.hasNext);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [convoPageNum]);

  const observer = useRef();
  const convoObserver = useRef();
  const lastUserRef = useIntersectionObserver(observer, setPageNum, hasMoreUsers, loading);
  const lastConvoRef = useIntersectionObserver(convoObserver, setConvoPageNum, hasMoreConvos, loading);

  const searchHandler = event => {
    setQuery(event.target.value);
    setPageNum(1);
  };

  const convoSelectedHandler = id => {
    setQuery('');
    history.push(`/messenger/${id}`);
  };

  const personSelectedHandler = user => {
    axios.post('/conversations', { userId: user._id })
      .then(res => {
        const newConvo = {
          _id: res.data.conversationId,
          users: [user]
        };
        if(res.data.lastMesssage) {
          newConvo.lastMessage = res.data.lastMessage;
        }
        setConversations(prevConvos => {
          if(prevConvos.some(convo => convo._id === res.data.conversationId)) {
            return prevConvos;
          }
          return [newConvo, ...prevConvos];
        });
        setQuery('');
        history.push(`/messenger/${res.data.conversationId}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let conversationDisplay = null;
  if(conversations && !isSearching) {
    conversationDisplay = conversations.map((convo, index) => {
      if(conversations.length === index + 1) {
        return (
          <ConversationPreview 
            lastRef={lastConvoRef}
            key={convo._id} 
            convo={convo} 
            click={() => convoSelectedHandler(convo._id)} 
          />);
      } else {
        return (
          <ConversationPreview 
            key={convo._id} 
            convo={convo} 
            click={() => convoSelectedHandler(convo._id)} 
          />);
      }
    });
  }

  const renderUsers = () => (
    users.map((user, index) => {
      if(users.length === index + 1) {
        return (
          <UserCard 
            lastRef={lastUserRef} 
            key={user._id} 
            user={user} 
            click={() => personSelectedHandler(user)}
          />
        );
      } else {
        return <UserCard key={user._id} user={user} click={() => personSelectedHandler(user)}/>;
      }
    })
  );
  return (
    <div style={{width: '90%'}}>
      <input type="text" value={query} onChange={searchHandler} />
      {loading ? <CircularProgress /> : null}
      <div style={{marginTop: 20, width: '30%', float: 'left'}}>
        {isSearching ? renderUsers() : null}
        {conversationDisplay}
      </div>
      <div style={{width: '50%', float: 'right'}}>
        <Route path={match.url + '/:id'} exact component={Conversation} />
      </div>
    </div>
  );
};

export default Messenger;
