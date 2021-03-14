import React from "react";

const authContext = React.createContext({
  userId: null,
  login: () => {}
});

export default authContext;
