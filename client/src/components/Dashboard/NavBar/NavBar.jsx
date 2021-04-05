import React, { useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import AuthContext from '../../../context/auth-context';
import navBarStyle from './NavBarStyle';

const NavBar = () => {
  const classes = navBarStyle();
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const logout = async () => {
    await axios.post('/auth/logout');
    authContext.user = null;
    history.push('/auth');
  };
  return (
    <AppBar position='static'>
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title}>Dashboard</Typography>
        <div>
          <Button className={classes.navBtn} onClick={() => history.push('/messenger')}>
          Messenger
          </Button>
          <Button className={classes.navBtn} onClick={logout}>
          Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
