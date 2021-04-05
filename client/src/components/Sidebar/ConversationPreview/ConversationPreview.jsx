import React from 'react';
import { Card, Typography } from '@material-ui/core';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import conversationPrevStyle from './ConversationPrevStyle';

const displayLastMessage = (message) => {
  if (message.img) {
    return 'Sent a photo';
  }
  return message.text;
};

const ConversationPreview = ({ convo, click, lastRef, isOnline }) => {
  const classes = conversationPrevStyle();
  const otherUser = convo.users[0];
  let lastMessage = null;
  let badge = null;

  if (convo.lastMessage) {
    let creator = 'You';
    let read = true;
    if (convo.lastMessage.creator === otherUser._id) {
      creator = otherUser.username.charAt(0).toUpperCase() + otherUser.username.slice(1);
      read = convo.lastMessage.read;
    }
    lastMessage = (
      <Typography className={`${classes.lastMessage} ${!read ? classes.unread : null}`}>
        {creator}: {displayLastMessage(convo.lastMessage)}
      </Typography>
    );
  }
  if (convo.numUnread > 0) {
    badge = <div className={classes.notification}>{convo.numUnread}</div>;
  }
  return (
    <Card className={classes.card} onClick={click} ref={lastRef}>
      <UserAvatar user={otherUser} className={classes.avatar} isOnline={isOnline} />
      <div className={classes.info}>
        <Typography className={classes.username}>{otherUser.username}</Typography>
        {lastMessage}
      </div>
      {badge}
    </Card>
  );
};

export default ConversationPreview;
