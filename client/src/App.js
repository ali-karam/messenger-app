import React, { useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
// import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { Route, Redirect, Switch, useHistory } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AuthContext from "./context/auth-context";
import ProtectedRoute from "./hoc/ProtectedRoute";

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
          history.replace('/dashboard');
        }
        setIsLoading(false);
      })
      .catch(err => {
        history.replace('/login');
        setIsLoading(false);
      });
  }, [history]);

  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <Route exact path="/">
        <Redirect to="/signup" />
      </Route>
      <Route render={() => <h1>Page not found</h1>}/>
    </Switch>
  );
  if(isLoading) {
    routes = <div></div>
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