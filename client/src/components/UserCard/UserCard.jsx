import React from 'react';
import { Card, Avatar } from '@material-ui/core';
import userCardStyle from './UserCardStyle';

const displayAvatar = buffer => {
  const avatar = new Buffer.from(buffer).toString('base64');
  return `data:image/jpeg;base64,${avatar}`
};

const UserCard = ({ user, click, lastRef }) => {
  const classes = userCardStyle();

  return (
    <Card onClick={click} ref={lastRef} className={classes.card}>
      <Avatar
        alt={user.username}
        src={user.avatar ? displayAvatar(user.avatar) : null}
        className={classes.avatar}
      >
        {!user.avatar ? user.username.charAt(0).toUpperCase() : null}
      </Avatar>
      <p className={classes.username}>{user.username}</p>
    </Card>
  );
};

export default UserCard;