import React from 'react';

const messageContext = React.createContext({
  message: null,
  newMsg: () => {}
});

export default messageContext;
