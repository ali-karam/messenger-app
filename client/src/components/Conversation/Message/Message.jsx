import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import { bufferToImgSrc } from '../../../utils/ImageUtils';
import AuthContext from '../../../context/auth-context';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import messageStyle from './MessageStyle';

const displayTimestamp = (date) => {
  const isToday = moment(date).isSame(new Date(), 'day');
  const isWeek = moment(date).isSame(new Date(), 'week');
  if (isToday) {
    return moment(date).format('h:mm a');
  }
  if (isWeek) {
    return moment(date).format('dddd h:mm a');
  }
  return moment(date).format('MMM DD, YYYY [at] h:mm a');
};

const Message = ({ message, lastRef, otherUser, latestMsg, imgClicked }) => {
  const authContext = useContext(AuthContext);
  const classes = messageStyle();
  const isLoggedInUser = authContext.user.id === message.creator._id;

  const displayMessage = (message) => {
    if (message.img) {
      return (
        <img
          src={bufferToImgSrc(message.img)}
          alt={`${otherUser.username} sent`}
          onClick={() => imgClicked(bufferToImgSrc(message.img))}
          className={classes.messageImg}
        />
      );
    }
    return (
      <Typography ref={lastRef} className={classes.messageText}>
        {message.text}
      </Typography>
    );
  };

  let readAvatar;
  if (latestMsg && isLoggedInUser && message.read) {
    readAvatar = <UserAvatar user={otherUser} className={classes.avatar} />;
  }

  let messageDisplay = (
    <div className={classes.userContent}>
      <Typography className={classes.messageInfo}>{displayTimestamp(message.createdAt)}</Typography>
      {displayMessage(message)}
      {readAvatar}
    </div>
  );

  if (!isLoggedInUser) {
    messageDisplay = (
      <div className={classes.otherUserContent}>
        <UserAvatar user={otherUser} className={classes.avatar} />
        <div>
          <Typography className={classes.messageInfo}>
            <span style={{ textTransform: 'capitalize' }}>{otherUser.username} </span>
            {displayTimestamp(message.createdAt)}
          </Typography>
          {displayMessage(message)}
        </div>
      </div>
    );
  }
  return messageDisplay;
};

export default React.memo(Message);
