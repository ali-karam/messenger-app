import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useHistory, Route } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import AuthContext from '../../context/auth-context';
import SocketContext from '../../context/socket-context';
import MessageContext from '../../context/message-context';
import useIntersectionObserver from '../../customHooks/useIntersectionObserver';
import ConversationPreview from '../../components/Sidebar/ConversationPreview/ConversationPreview';
import UserCard from '../../components/Sidebar/UserCard/UserCard';
import Conversation from '../Conversation/Conversation';
import Searchbar from '../../components/Sidebar/Searchbar/Searchbar';
import PopupMessage from '../../components/UI/PopupMessage/PopupMessage';
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
  const [errorMsg, setErrorMsg] = useState('');

  const history = useHistory();
  const authContext = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageContext = useContext(MessageContext);
  const classes = sidebarStyle();

  const observer = useRef();
  const convoObserver = useRef();
  const lastUserRef = useIntersectionObserver(observer, setPageNum, hasMoreUsers, loading);
  const lastConvoRef = useIntersectionObserver(
    convoObserver,
    setConvoPageNum,
    hasMoreConvos,
    loading
  );

  const convoUpdateHandler = useCallback(
    (message) => {
      const convoId = message.conversation._id;
      const msg = message.img ? 'Sent a photo' : message.text;
      const convoIndex = conversations.findIndex((convo) => convo.id === convoId);

      if (convoIndex > -1) {
        const path = history.location.pathname;
        const pathId = path.substring(path.lastIndexOf('/') + 1);
        const isRead = pathId === convoId;

        const newConvos = [...conversations];
        const selectedConvo = newConvos[convoIndex];
        newConvos.splice(convoIndex, 1);
        selectedConvo.lastMessage = {
          creator: message.creator._id,
          read: isRead,
          text: msg,
          _id: message._id
        };
        newConvos.unshift(selectedConvo);
        setConversations(newConvos);
      }
    },
    [conversations, history.location.pathname]
  );

  useEffect(() => {
    socket.on('newMessage', (message) => {
      convoUpdateHandler(message);
    });
  }, [socket, conversations, convoUpdateHandler]);

  useEffect(() => {
    if (messageContext.message) {
      convoUpdateHandler(messageContext.message);
      messageContext.newMsg(null);
    }
  }, [messageContext, conversations, convoUpdateHandler]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/${authContext.user.id}`)
      .then((res) => {
        setCurrentUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        errorHandler();
      });
  }, [authContext.user.id]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/conversations?page=${convoPageNum}`)
      .then((res) => {
        setConversations((prevConvos) => [...prevConvos, ...res.data.conversations]);
        setHasMoreConvos(res.data.hasNext);
        setLoading(false);
      })
      .catch((err) => {
        errorHandler();
      });
  }, [convoPageNum]);

  useEffect(() => {
    if (query.trim() === '') {
      setIsSearching(false);
      setLoading(false);
      return;
    }
    setIsSearching(true);
    setLoading(true);

    const timeoutId = setTimeout(() => {
      axios
        .get(`/users?username=${query}&page=${userPageNum}`)
        .then((res) => {
          setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
          setHasMoreUsers(res.data.hasNext);
          setLoading(false);
        })
        .catch((err) => {
          errorHandler();
        });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [query, userPageNum]);

  useEffect(() => {
    setUsers([]);
  }, [query]);

  const errorHandler = () => {
    setErrorMsg('Oops! Something went wrong');
    setLoading(false);
  };

  const searchHandler = (event) => {
    setQuery(event.target.value);
    setPageNum(1);
  };

  const convoSelectedHandler = (id) => {
    setQuery('');
    const convoIndex = conversations.findIndex((convo) => convo.id === id);
    if (convoIndex > -1 && conversations[convoIndex].lastMessage) {
      const newConvos = [...conversations];
      newConvos[convoIndex].lastMessage.read = true;
      setConversations(newConvos);
    }
    history.push(`/messenger/${id}`);
  };

  const personSelectedHandler = (user) => {
    axios
      .post('/conversations', { userId: user._id })
      .then((res) => {
        const newConvo = {
          _id: res.data.conversationId,
          users: [res.data.otherUser]
        };
        const convoIndex = conversations.findIndex((convo) => convo.id === res.data.conversationId);
        setConversations((prevConvos) => {
          if (convoIndex > -1) {
            prevConvos[convoIndex].lastMessage.read = true;
            return prevConvos;
          }
          return [newConvo, ...prevConvos];
        });
        setQuery('');
        history.push(`/messenger/${res.data.conversationId}`);
      })
      .catch((err) => {
        setErrorMsg('Oops! Something went wrong');
      });
  };

  const renderUsers = () => {
    return users.map((user, index) => {
      if (users.length === index + 1) {
        return (
          <UserCard
            lastRef={lastUserRef}
            key={user._id}
            user={user}
            isOnline={true}
            click={() => personSelectedHandler(user)}
          />
        );
      }
      return (
        <UserCard
          key={user._id}
          user={user}
          isOnline={true}
          click={() => personSelectedHandler(user)}
        />
      );
    });
  };

  let conversationDisplay = null;
  if (conversations && !isSearching) {
    conversationDisplay = conversations.map((convo, index) => {
      if (conversations.length === index + 1) {
        return (
          <ConversationPreview
            lastRef={lastConvoRef}
            key={convo._id}
            convo={convo}
            isOnline={false}
            click={() => convoSelectedHandler(convo._id)}
          />
        );
      }
      return (
        <ConversationPreview
          key={convo._id}
          convo={convo}
          isOnline={false}
          click={() => convoSelectedHandler(convo._id)}
        />
      );
    });
  }
  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={isSearching ? 9 : 3} sm={3}>
        <div className={classes.sideBar}>
          {currentUser ? <UserCard user={currentUser} currentUser isOnline={true} /> : null}
          <Typography variant="h5" className={classes.title}>
            Chats
          </Typography>
          <Searchbar
            searchHandler={searchHandler}
            clearHandler={() => setQuery('')}
            query={query}
          />
          <div className={classes.conversations}>
            {isSearching ? renderUsers() : conversationDisplay}
          </div>
          {loading ? <CircularProgress size={30} className={classes.loading} /> : null}
        </div>
        <PopupMessage
          open={errorMsg !== ''}
          handleClose={() => setErrorMsg('')}
          type="error"
          message={errorMsg}
        />
      </Grid>
      <Grid item xs={isSearching ? 3 : 9} sm={9}>
        <Route path={match.url + '/:id'} exact component={Conversation} />
      </Grid>
    </Grid>
  );
};

export default Sidebar;
