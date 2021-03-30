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
  const [conversations, setConversations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [convoPageNum, setConvoPageNum] = useState(1);
  const [hasMoreConvos, setHasMoreConvos] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (query.trim() === '') {
      doneSearchingHandler();
      setLoading(false);
      return;
    };
    setIsSearching(true);
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
    axios.get(`/conversations?page=${convoPageNum}`)
      .then(res => {
        console.log(res.data.conversations)
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

  const convoObserver = useRef();
  const lastConvoRef = useCallback(node => {
    if(loading) return;
    if(convoObserver.current) {
      convoObserver.current.disconnect();
    }
    convoObserver.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMoreConvos) {
        setConvoPageNum(prevPageNum => ++prevPageNum);
      }
    })
    if(node) {
      convoObserver.current.observe(node);
    }
  }, [loading, hasMoreConvos]);

  const searchHandler = event => {
    setQuery(event.target.value);
    setPageNum(1);
  };

  const doneSearchingHandler = () => {
    setIsSearching(false);
    setQuery('');
  };

  const convoSelectedHandler = id => {
    doneSearchingHandler();
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
        doneSearchingHandler();
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
          />
        );
      } else {
        return (
          <ConversationPreview 
            key={convo._id} 
            convo={convo} 
            click={() => convoSelectedHandler(convo._id)} 
          />
        );
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