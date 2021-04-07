import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/auth-context";

export default function Dashboard() {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const logout = async () => {
    await axios.post('/auth/logout');
    history.push("/auth");
  };

  return (
    <>
      {/* For testing purposes right now, ignore styling */}
      <p>Dashboard</p>
      <p style={{textTransform: 'capitalize'}}>User: {authContext.user.username}</p>
      <button onClick={logout}> Logout </button>
    </>
  );
};