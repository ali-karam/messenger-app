import React, { useState, useEffect } from 'react';
import { MuiThemeProvider, LinearProgress } from '@material-ui/core';
import { theme } from './themes/theme.js';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Auth from './containers/Auth/Auth';
import Dashboard from './containers/Dashboard/Dashboard';
import AuthContext from './context/auth-context';
import SocketContext from './context/socket-context';
import MessageContext from './context/message-context';
import ProtectedRoute from './hoc/ProtectedRoute';
import Sidebar from './containers/Sidebar/Sidebar';

import './App.css';

function App() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [latestMsg, setLatestMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .post('/auth/validtoken')
      .then((res) => {
        if (res.data) {
          setUser(res.data);
          history.push(history.location.state.from);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        history.replace('/auth');
        setIsLoading(false);
      });
  }, [history]);

  useEffect(() => {
    if (user) {
      const newSocket = io('/', { query: { userId: user.id } });
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [user]);

  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <SocketContext.Provider value={{ socket: socket }}>
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <MessageContext.Provider value={{ latestMsg: latestMsg, newLatestMsg: setLatestMsg }}>
          <ProtectedRoute path="/messenger" component={Sidebar} />
        </MessageContext.Provider>
      </SocketContext.Provider>
      <Route exact path="/">
        <Redirect to="/auth" />
      </Route>
      <Route render={() => <h1>Page not found</h1>} />
    </Switch>
  );
  if (isLoading) {
    routes = <LinearProgress />;
  }

  return (
    <AuthContext.Provider value={{ user: user, login: setUser }}>
      <MuiThemeProvider theme={theme}>
        {routes}
        <ProtectedRoute />
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
