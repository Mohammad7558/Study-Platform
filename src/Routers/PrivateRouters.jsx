import React from 'react';
import useAuth from '../Hooks/useAuth';
import Spinner from '../Components/Spinner/Spinner';
import { Navigate, useLocation } from 'react-router';

const PrivateRouters = ({children}) => {
    const location = useLocation();

    const {user, loading} = useAuth();

    if(loading){
        return <Spinner/>
    }

    if(!user){
        return <Navigate to='/login' state={{from: location}} replace></Navigate>
    }

    return children
};

export default PrivateRouters;