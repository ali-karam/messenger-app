import React, { useState, useEffect } from "react";
import { MuiThemeProvider, LinearProgress } from "@material-ui/core";
import { theme } from "./themes/theme.js";
// import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import axios from "axios";
import Auth from "./containers/Auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import AuthContext from "./context/auth-context";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Messenger from "./containers/Messenger/Messenger";

import "./App.css";

function App() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.post('/auth/validtoken')
      .then(res => {
        if(res.data) {
          setUser(res.data);
          history.push(history.location.state.from);
        }
        setIsLoading(false);
      })
      .catch(err => {
        history.replace('/auth');
        setIsLoading(false);
      });
  }, [history]);

  let routes = (
    <Switch>
      <Route path="/auth" component={Auth} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/messenger" component={Messenger}/>
      <Route exact path="/">
        <Redirect to="/auth" />
      </Route>
      <Route render={() => <h1>Page not found</h1>}/>
    </Switch>
  );
  if(isLoading) {
    routes = <LinearProgress />
  }

  return (
    <AuthContext.Provider value={{user: user, login: setUser}}>
      <MuiThemeProvider theme={theme}>
        {routes}
        <ProtectedRoute/>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;