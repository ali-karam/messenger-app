import React from 'react';
import { Avatar } from '@material-ui/core';
import { bufferToImgSrc } from '../../../utils/ImageUtils';
import userAvatarStyle from './UserAvatarStyle';

const UserAvatar = ({ user, className, isOnline }) => {
  const classes = userAvatarStyle();

  let status;
  if(isOnline !== undefined) {
    status = <span className={`${classes.status} ${isOnline ? classes.online : null}`}></span>;
  }
  return (
    <>
      <Avatar
        className={`${classes.default} ${className}`}
        alt={user.username}
        src={user.avatar ? bufferToImgSrc(user.avatar) : null}
      >
        {!user.avatar ? user.username.charAt(0).toUpperCase() : null}
      </Avatar>
      {status}
    </>
  );
};

export default UserAvatar;
