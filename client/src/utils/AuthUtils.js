import axios from 'axios';

export const logout = async (authContext, history) => {
  await axios.post('/auth/logout');
  authContext.user = null;
  history.push('/auth');
};
