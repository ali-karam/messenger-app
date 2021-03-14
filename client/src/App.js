import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
// import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuthContext from "./context/auth-context";

import "./App.css";

function App() {
  
  const [userId, setUserId] = useState(null);

  const login = (id) => {
    setUserId(id);
  };

  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route exact path="/">
        <Redirect to="/signup" />
      </Route>
      <Route render={() => <h1>Page not found</h1>}/>
    </Switch>
  );

  if(userId !== null) {
    routes = (
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        <Route render={() => <h1>Page not found</h1>}/>
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{userId, login}}>
      <MuiThemeProvider theme={theme}>
          <BrowserRouter>
           {routes}
          </BrowserRouter>
      </MuiThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
