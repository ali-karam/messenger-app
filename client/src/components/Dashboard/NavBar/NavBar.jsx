import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import AuthContext from '../../../context/auth-context';
import SocketContext from '../../../context/socket-context';
import { logout } from '../../../utils/AuthUtils';
import navBarStyle from './NavBarStyle';

const NavBar = () => {
  const classes = navBarStyle();
  const authContext = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const history = useHistory();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title}>Dashboard</Typography>
        <div>
          <Button className={classes.navBtn} onClick={() => history.push('/messenger')}>
            Messenger
          </Button>
          <Button className={classes.navBtn} onClick={() => logout(authContext, history, socket)}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
