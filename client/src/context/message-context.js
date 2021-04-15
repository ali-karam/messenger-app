import React from 'react';

const messageContext = React.createContext({
  latestMsg: null,
  newLatestMsg: () => {}
});

export default messageContext;
