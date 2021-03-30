import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Route } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Grid, Box, InputBase, InputAdornment, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ConversationPreview from '../../components/ConversationPreview/ConversationPreview';
import UserCard from '../../components/UserCard/UserCard';
import Conversation from './Conversation/Conversation';
import useIntersectionObserver from '../../customHooks/useIntersectionObserver';
import messengerStyle from './MessengerStyle';

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
  const classes = messengerStyle();

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
    <Grid container>
      <Grid item sm={4} md={5}>
        <Typography variant='h5' className={classes.title}>Chats</Typography>
        <InputBase
          className={classes.searchBar}
          variant='outlined' 
          value={query} 
          onChange={searchHandler}
          placeholder='Search'
          startAdornment= {(
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' />
            </InputAdornment>
          )}
        />
        <div className={classes.loading}>
          {loading ? <CircularProgress size={30} /> : null}
        </div>
        <Box className={classes.conversations}>
          {isSearching ? renderUsers() : conversationDisplay}
        </Box>
      </Grid>
      <Grid item sm={8} md={7}>
        <Route path={match.url + '/:id'} exact component={Conversation} />
      </Grid>
    </Grid>
  );
};

export default Messenger;
