import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../context/auth-context';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { user } = useContext(AuthContext);
    return user ? <Route component={ Component } {...rest} /> : <Redirect to='/login' />;
};

export default ProtectedRoute;
