import axios from 'axios';

export const logout = async (authContext, history, socket) => {
  await axios.post('/auth/logout');
  authContext.user = null;
  socket.close();
  history.push('/auth');
};
