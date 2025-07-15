import React from 'react';
import useAuth from '../Hooks/useAuth';
import Spinner from '../Components/Spinner/Spinner';
import useUserRole from '../Hooks/useUserRole';
import { Navigate } from 'react-router';

const AdminRoutes = ({children}) => {
    const {user, loading} = useAuth();
    const {role, isRoleLoading} = useUserRole();
    if(loading || isRoleLoading){
        return <Spinner/>
    }
    if(!user || role !== 'admin'){
        return <Navigate to='/forbidden' state={{from: location}} replace></Navigate>
    }
    return children
};

export default AdminRoutes;