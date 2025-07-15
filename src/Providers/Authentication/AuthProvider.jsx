import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../Firebase/Firebase.config';
import axios from 'axios';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserWithEmail = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const createUserWithGoogle = (provider) => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async() => {
    setLoading(true);
    await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
    return signOut(auth);
  };

  const updateUser = (userUpdate) => {
    return updateProfile(auth.currentUser, userUpdate);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if(currentUser?.email){
        axios.post('http://localhost:5000/jwt', {email: currentUser.email}, {withCredentials: true})
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        })
      }

    });

    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    loading,
    setLoading,
    setUser,
    createUserWithEmail,
    signInUser,
    logOut,
    createUserWithGoogle,
    updateUser,
  };

  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;