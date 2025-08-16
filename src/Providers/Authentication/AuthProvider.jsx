import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../Firebase/Firebase.config";
import { AuthContext } from "./AuthContext";

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
      "http://localhost:5000/logout",
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
            `http://localhost:5000/users/${currentUser.email}`
          );

          if (userExists.data) {
            await axios.post(
              "http://localhost:5000/jwt",
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
