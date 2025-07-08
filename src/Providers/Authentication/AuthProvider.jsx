import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    

    const userInfo = {
        user,
        loading,
        setLoading,
        setUser
    }

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
};

export default AuthProvider;