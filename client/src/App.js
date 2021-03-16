import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
// import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuthContext from "./context/auth-context";
import ProtectedRoute from "./hoc/ProtectedRoute";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const login = (user) => {
    setUser(user);
  };

  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <ProtectedRoute path="/dashboard" component={Dashboard} user={user} />
      <Route exact path="/">
        <Redirect to="/signup" />
      </Route>
      <Route render={() => <h1>Page not found</h1>}/>
    </Switch>
  );

  return (
    <AuthContext.Provider value={{user: user, login}}>
      <MuiThemeProvider theme={theme}>
        {routes}
        <ProtectedRoute/>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
