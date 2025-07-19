import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Firebase/Firebase.config";
import axios from "axios";

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

  const logOut = async () => {
    setLoading(true);
    await axios.post(
      "https://assignment-12-server-side-swart.vercel.app/logout",
      {},
      { withCredentials: true }
    );
    return signOut(auth);
  };

  const updateUser = (userUpdate) => {
    return updateProfile(auth.currentUser, userUpdate);
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (currentUser?.email) {
      try {
        // First check if user exists in MongoDB
        const userExists = await axios.get(
          `https://assignment-12-server-side-swart.vercel.app/users/${currentUser.email}`
        );
        
        if (userExists.data) {
          await axios.post(
            "https://assignment-12-server-side-swart.vercel.app/jwt",
            { email: currentUser.email },
            { withCredentials: true }
          );
        }
      } catch (error) {
        console.log("JWT creation skipped - user not in DB yet");
      }
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

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
