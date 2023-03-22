//https://github.com/satansdeer/react-firebase-auth/blob/master/src/Auth.js
import React, { useEffect, useState, useContext } from "react";
import { auth } from "./firebase.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    // checking for user on page reload and page load
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  // firebase takes a second to register if the user is logged in, so we display this while it loads
  // if we didnt make it load, the app would error with undefined objects of user
  if (pending) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
