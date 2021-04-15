import React, { useContext } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import AuthContext from '../context/auth-context';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const history = useHistory();
    const { user } = useContext(AuthContext);
    return user ? <Route component={ Component } {...rest} /> : 
        <Redirect to={{pathname: '/auth', state: {from: history.location.pathname}}} />;
};

export default ProtectedRoute;
