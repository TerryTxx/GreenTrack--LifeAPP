import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../firebase";
import "./Register.css";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/trackPage");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Log in</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" name="email" defaultValue="thor@gamil.com"/>
          <input type="password" placeholder="Password" name="password" defaultValue="123456"/>
          <button>Sign In</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          {/* Don't have an account? <Link to="/register">Register</Link> */}
        </p>
      </div>
    </div>
  );
};
export default Login;
