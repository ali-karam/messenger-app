import React from "react";

const authContext = React.createContext({
  user: null,
  login: () => {}
});

export default authContext;