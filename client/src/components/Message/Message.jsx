import React, { useContext } from 'react';
import { Typography, Avatar } from '@material-ui/core';
import AuthContext from '../../context/auth-context';
import messageStyle from './MessageStyle';
import moment from 'moment';

const displayAvatar = (img) => {
  let avatar = img;
  if(typeof img === 'object') {
    avatar = new Buffer.from(img).toString('base64');
  }
  return `data:image/jpeg;base64,${avatar}`;
};

const displayTimeStamp = date => {
  const isToday = moment(date).isSame(new Date(), 'day');
  const isWeek = moment(date).isSame(new Date(), 'week');
  if(isToday) {
    return moment(date).format('h:mm a');
  }
  if(isWeek) {
    return moment(date).format('dddd h:mm a');
  }
  return moment(date).format('MMM DD, YYYY [at] h:mm a');
};

const Message = ({ message, lastRef, user }) => {
  const authContext = useContext(AuthContext);
  const classes = messageStyle();
  const isLoggedInUser = authContext.user.id === message.creator._id;

  let messageDisplay = (
    <div className={classes.userContent}>
      <Typography className={classes.messageInfo}>
        {displayTimeStamp(message.createdAt)}
      </Typography>
      <Typography 
        ref={lastRef} 
        className={classes.userMsg}
      >
        {message.message}
      </Typography>
    </div>
  );

  if(!isLoggedInUser) {
    messageDisplay = (
      <div className={classes.otherUserContent}>
        <Avatar
          alt={user.username}
          src={user.avatar ? displayAvatar(user.avatar) : null}
          className={classes.avatar}
        >
          {!user.avatar ? user.username.charAt(0).toUpperCase() : null}
        </Avatar>
        <div>
          <Typography className={classes.messageInfo}>
            <span style={{textTransform: 'capitalize'}}>{user.username} </span> 
            {displayTimeStamp(message.createdAt)}
          </Typography>
          <Typography 
            ref={lastRef} 
            className={classes.otherUserMsg}
          >
            {message.message}
          </Typography>
        </div>
      </div>
    );
  }
  return messageDisplay;
};

export default Message;
