import React, { useContext, useState } from 'react';
import { Card, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../../context/auth-context';
import { logout } from '../../../utils/AuthUtils';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import userCardStyle from './UserCardStyle';

const UserCard = ({ user, click, lastRef, currentUser, isOnline }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const classes = userCardStyle();

  const optionBtn = (
    <>
      <IconButton
        className={classes.optionBtn}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuItem onClick={() => history.push('/dashboard')}>Dashboard</MenuItem>
        <MenuItem onClick={() => logout(authContext, history)}>Logout</MenuItem>
      </Menu>
    </>
  );
  return (
    <Card
      onClick={click}
      ref={lastRef}
      className={`${classes.card} ${currentUser ? classes.currentUser : null}`}
    >
      <UserAvatar user={user} className={classes.avatar} isOnline={isOnline} />
      <Typography className={classes.username}>{user.username}</Typography>
      {currentUser ? optionBtn : null}
    </Card>
  );
};

export default UserCard;
