import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./Authentication.jsx";

export default function PrivateRoute({ children }) {
  const { currentUser } = useContext(AuthContext);
  // checks if user is logged in, otherwise redirects the user to the home page
  return currentUser ? 
  (children
  ) : (<Navigate to="/login" />)
  }
