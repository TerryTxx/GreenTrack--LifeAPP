import { React, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import TrackPage from "./Pages/Home/Trackpage";
import Register from "./Pages/Login/Register";
import Login from "./Pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { AuthProvider } from "./Authentication";
import 'bootstrap/dist/css/bootstrap.min.css';
import FooterNav from "./Pages/Footer/Footer";
import Me from "./Pages/Me/Me";
import Orders from "./Pages/Orders/Orders";
import Layout from "./Pages/Layout";
import { auth } from "./firebase.js";
<link rel="manifest" crossorigin="use-credentials" href="manifest.json"/>

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // checking for user on page reload and page load
    auth.onAuthStateChanged((user) => {
      if(user != null){
        setCurrentUser(user);
        setEmail(user.email);
      }
    });
  }, [currentUser, email]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* signed out routes */}
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          {/* signed in routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
             <Route index element={<TrackPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="trackPage" element={<TrackPage />} />
            <Route path="me" element={<Me />} />
            <Route path="order" element={<Orders />} />
          </Route>
        </Routes>
        {currentUser? (<FooterNav />):(<div></div>)}
      </BrowserRouter>
    </AuthProvider>

  );
}
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
