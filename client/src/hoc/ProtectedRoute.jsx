import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../context/auth-context';

const ProtectedRoute = ({ component: Component }) => {
    const { user } = useContext(AuthContext);
    return user ? <Route component={ Component } /> : <Redirect to='/login' />;
};

export default ProtectedRoute;