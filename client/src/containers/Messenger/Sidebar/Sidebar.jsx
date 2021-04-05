import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory, Route } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Grid, InputBase, InputAdornment, Typography, 
  IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import AuthContext from '../../../context/auth-context';
import useIntersectionObserver from '../../../customHooks/useIntersectionObserver';
import ConversationPreview from '../../../components/ConversationPreview/ConversationPreview';
import UserCard from '../../../components/UserCard/UserCard';
import Conversation from '../Conversation/Conversation';
import sidebarStyle from './SidebarStyle';

const Sidebar = ({ match }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [hasMoreConvos, setHasMoreConvos] = useState(false);
  const [userPageNum, setPageNum] = useState(1);
  const [convoPageNum, setConvoPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const history = useHistory();
  const authContext = useContext(AuthContext);
  const classes = sidebarStyle();

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

  useEffect(() => {
    setLoading(true);
    axios.get(`/users/${authContext.user.id}`)
      .then(res => {
        setCurrentUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  }, [authContext]);

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
          users: [res.data.otherUser]
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
            isOnline={false}
            click={() => convoSelectedHandler(convo._id)} 
          />);
      } else {
        return (
          <ConversationPreview 
            key={convo._id} 
            convo={convo} 
            isOnline={false}
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
            isOnline={true}
            click={() => personSelectedHandler(user)}
          />
        );
      } else {
        return (
          <UserCard 
            key={user._id} 
            user={user} 
            isOnline={true} 
            click={() => personSelectedHandler(user)}
          />
        );
      }
    })
  );
  return (
    <Grid container component='main' className={classes.root}>
      <Grid item sm={3} md={3}>
        <div className={classes.sideBar}>
          {currentUser ? <UserCard user={currentUser} currentUser isOnline={true} /> : null}
          <Typography variant='h5' className={classes.title}>Chats</Typography>
          <InputBase
            className={classes.searchBar}
            variant='outlined' 
            value={query} 
            onChange={searchHandler}
            placeholder='Search'
            startAdornment={(
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            )}
            endAdornment={ query ? (
              <InputAdornment position='end'>
                <IconButton onClick={() => setQuery('')}>
                  <ClearIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            ) : null}
          />
          <div className={classes.conversations}>
            {isSearching ? renderUsers() : conversationDisplay}
          </div>
          {loading ? <CircularProgress size={30} className={classes.loading}/> : null}
        </div>
      </Grid>
      <Grid item sm={9} md={9}>
        <Route path={match.url + '/:id'} exact component={Conversation} />
      </Grid>
    </Grid>
  );
};

export default Sidebar;
