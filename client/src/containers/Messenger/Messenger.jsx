import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, Route } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import ConversationPreview from '../../components/ConversationPreview/ConversationPreview';
import UserCard from '../../components/UserCard/UserCard';
import Conversation from './Conversation/Conversation';

const Messenger = ({ match }) => {
  const [query, setQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [conversations, setConversations] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (query.trim() === '') {
      setLoading(false);
      return;
    };
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

  const searchHandler = event => {
    setQuery(event.target.value);
    setPageNum(1);
  };

  const convoSelectedHandler = id => {
    history.push(`/messenger/${id}`);
  };

  const personSelectedHandler = id => {
    axios.post('/conversations', { userId: id })
      .then(res => {
        history.push(`/messenger/${res.data.conversationId}`);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let conversationDisplay = null;
  if(conversations) {
    conversationDisplay = conversations.map(convo => (
        <ConversationPreview 
          key={convo._id} 
          convo={convo} 
          click={() => convoSelectedHandler(convo._id)} 
        />
    ));
  }

  const renderUsers = () => (
    users.map((user, index) => {
      if(users.length === index + 1) {
        return (
          <UserCard 
            lastRef={lastUserRef} 
            key={user._id} 
            user={user} 
            click={() => personSelectedHandler(user._id)}
          />
        );
      } else {
        return <UserCard key={user._id} user={user} click={() => personSelectedHandler(user._id)}/>;
      }
    })
  );
  return (
    <div style={{width: '90%'}}>
      <input type="text" value={query} onChange={searchHandler} />
      {loading ? <CircularProgress /> : null}
      <div style={{marginTop: 20, width: '30%', float: 'left'}}>
        {renderUsers()}
        {conversationDisplay}
      </div>
      <div style={{width: '50%', float: 'right'}}>
        <Route path={match.url + '/:id'} exact component={Conversation} />
      </div>
    </div>
  );
};

export default Messenger;