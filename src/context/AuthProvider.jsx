import { createContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  user: null,
  loading: false,
  login: () => {},
  signOut: () => {},
  register: () => {},
});

const register = ({ email, password }) =>
  createUserWithEmailAndPassword(auth, email, password);

const login = ({ email, password }) =>
  signInWithEmailAndPassword(auth, email, password);

const handleSignOut = () => signOut(auth);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        signOut: handleSignOut,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
