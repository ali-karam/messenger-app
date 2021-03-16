import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, user, ...rest}) => (
    <Route {...rest} render={props => (
        user ? <Component {...props} {...rest} /> : <Redirect to='/login' />
    )}/>
);

export default ProtectedRoute;