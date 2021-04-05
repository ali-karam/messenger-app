import React from 'react';
import { Card, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import otherUserBannerStyle from './OtherUserBannerStyle';

const OtherUserBanner = ({ username, isOnline }) => {
  const classes = otherUserBannerStyle();

  return (
    <Card className={classes.root}>
      <Typography className={classes.username}>{username}</Typography>
      <div className={classes.status}>
        <span className={`${classes.badge} ${isOnline ? classes.online : null}`}></span>
        <Typography>{isOnline ? 'Online' : 'Offline'}</Typography>
      </div>
      <MoreHorizIcon className={classes.optionsIcon} />
    </Card>
  );
};

export default OtherUserBanner;
