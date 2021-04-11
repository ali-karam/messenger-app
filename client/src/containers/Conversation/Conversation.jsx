import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import axios from 'axios';
import { CircularProgress, ClickAwayListener, Modal } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Picker from 'emoji-picker-react';
import SocketContext from '../../context/socket-context';
import MessageContext from '../../context/message-context';
import AuthContext from '../../context/auth-context';
import useIntersectionObserver from '../../customHooks/useIntersectionObserver';
import Message from '../../components/Conversation/Message/Message';
import MessageBar from '../../components/Conversation/MessageBar/MessageBar';
import PopupMessage from '../../components/UI/PopupMessage/PopupMessage';
import OtherUserBanner from '../../components/Conversation/OtherUserBanner/OtherUserBanner';
import ImagePreview from '../../components/Conversation/ImagePreview/ImagePreview';
import UserAvatar from '../../components/UI/UserAvatar/UserAvatar';
import conversationStyle from './ConversationStyle';

const Conversation = ({ onlineUsers }) => {
  const classes = conversationStyle();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [text, setText] = useState('');
  const [emojiPickerIsShowing, setEmojiPickerIsShowing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imgPreviewSrc, setImgPreviewSrc] = useState(null);
  const [msgIsRead, setMsgIsRead] = useState(false);

  const { id } = useParams();
  const observer = useRef();
  const lastMsgRef = useIntersectionObserver(observer, setPageNum, hasMore, loading);
  const { socket } = useContext(SocketContext);
  const { newMsg } = useContext(MessageContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    socket.emit('join', { convoId: id });
    socket.emit('read', { convoId: id });
    return () => socket.emit('leave', { convoId: id });
  }, [socket, id]);

  useEffect(() => {
    socket.on('userReadMsg', () => {
      setMsgIsRead(true);
    });
    return () => socket.off('userReadMsg');
  }, [socket]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMsgIsRead(false);
      newMsg(message);
      setMessages((prevMessages) => {
        if (prevMessages.length > 19 && hasMore) {
          prevMessages.pop();
        }
        return [message, ...prevMessages];
      });
      if (message.creator._id !== authContext.user.id) {
        socket.emit('read', { messageId: message._id, convoId: id });
      }
    });
    return () => socket.off('message');
  }, [socket, id, newMsg, hasMore, authContext.user.id]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/conversations/${id}?page=${pageNum}`)
      .then((res) => {
        setOtherUser(res.data.otherUser);
        setMessages((prevMessages) => [...prevMessages, ...res.data.messages]);
        setHasMore(res.data.hasNext);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg('Oops! Something went wrong');
        setLoading(false);
      });
  }, [id, pageNum]);

  useEffect(() => {
    setMessages([]);
  }, [id]);

  const sendMsgToServer = (data) => {
    try {
      socket.emit('sendMessage', { message: data.message, otherUserId: otherUser.id, convoId: id });
    } catch (err) {
      setErrorMsg('Oops! Something went wrong');
    }
  };

  const enterHandler = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (text.trim() !== '') {
        sendMsgToServer({ message: text });
      }
      setText('');
    }
  };

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 1000000) {
      setErrorMsg('File too large. Max size 1MB');
    } else if (file && !file.type.match(/^image\/(jpe?g|png)$/)) {
      setErrorMsg('Image must be either a png, jpg, or jpeg');
    } else {
      setErrorMsg('');
      sendMsgToServer({ message: file });
    }
  };

  const imgClickedHandler = useCallback((img) => {
    setImgPreviewSrc(img);
  }, []);

  const emojiSelector = (
    <ClickAwayListener onClickAway={() => setEmojiPickerIsShowing(false)}>
      <div className={classes.emojiSelector}>
        <Picker
          onEmojiClick={(event, emojiObj) => setText((prevText) => prevText.concat(emojiObj.emoji))}
        />
      </div>
    </ClickAwayListener>
  );

  let messagesDisplay;
  if (messages) {
    messagesDisplay = messages.map((message, index) => {
      if (messages.length === index + 1) {
        return (
          <Message
            key={message._id}
            lastRef={lastMsgRef}
            message={message}
            otherUser={otherUser}
            imgClicked={imgClickedHandler}
          />
        );
      }
      return (
        <Message
          key={message._id}
          message={message}
          otherUser={otherUser}
          latestMsg={index === 0}
          imgClicked={imgClickedHandler}
        />
      );
    });
  }
  let readAvatar;
  if (msgIsRead && otherUser && messages[0] && messages[0].creator._id === authContext.user.id) {
    readAvatar = <UserAvatar user={otherUser} className={classes.readAvatar} />;
  }
  return (
    <div className={classes.root}>
      {otherUser && (
        <OtherUserBanner
          username={otherUser.username}
          isOnline={onlineUsers.includes(otherUser.id)}
        />
      )}
      {loading ? <CircularProgress size={30} className={classes.loading} /> : null}
      <div className={classes.messages}>
        {readAvatar}
        {messagesDisplay}
        {emojiPickerIsShowing ? emojiSelector : null}
      </div>
      <MessageBar
        text={text}
        inputKeyDown={enterHandler}
        inputChange={(event) => setText(event.target.value)}
        emojiBtnClick={() => setEmojiPickerIsShowing((prevIsShowing) => !prevIsShowing)}
        fileChange={fileSelectedHandler}
      />
      <Modal open={imgPreviewSrc !== null} onClose={() => setImgPreviewSrc(null)}>
        <ImagePreview src={imgPreviewSrc} closeClicked={() => setImgPreviewSrc(null)} />
      </Modal>
      <PopupMessage
        open={errorMsg !== ''}
        handleClose={() => setErrorMsg('')}
        type="error"
        message={errorMsg}
      />
    </div>
  );
};

export default Conversation;
