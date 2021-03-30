import React from 'react';
import { Card, Avatar, Badge } from '@material-ui/core';
import conversationPrevStyle from './ConversationPrevStyle';

const displayLastMessage = (message) => {
  const base64Matcher = new RegExp(
    '(?:[A-Za-z0-9+/]{4}\\n?)*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)'
  );

  if (base64Matcher.test(message)) {
    message = 'sent a photo';
  }
  return message;
};

const ConversationPreview = ({ convo, click, lastRef }) => {
  const classes = conversationPrevStyle();
  const otherUser = convo.users[0];
  let lastMessage = null;
  let badge = null;

  if (convo.lastMessage) {
    let creator = 'You';
    let read = true;
    if (convo.lastMessage.creator === otherUser._id) {
      creator =
          otherUser.username.charAt(0).toUpperCase() +
          otherUser.username.slice(1);
      read = convo.lastMessage.read;
    }
    lastMessage = (
      <p className={!read ? `${classes.unread} ${classes.lastMessage}` : classes.lastMessage}>
        {creator}: {displayLastMessage(convo.lastMessage.message)}
      </p>
    );
  }
  if(convo.numUnread > 0) {
    badge = <Badge badgeContent={convo.numUnread} color="primary" className={classes.notification}/>;
  }
  return (
    <Card className={classes.card} onClick={click} ref={lastRef}>
      <Avatar
        className={classes.avatar}
        alt={otherUser.username}
        src={otherUser.avatar ? `data:image/jpeg;base64,${otherUser.avatar}` : null}
      >
        {!otherUser.avatar ? otherUser.username.charAt(0).toUpperCase() : null}
      </Avatar>
      <div className={classes.info}>
        <p className={classes.username}>{otherUser.username}</p>
        {lastMessage}
      </div>
      {badge}
    </Card>
  );
};

export default ConversationPreview;
