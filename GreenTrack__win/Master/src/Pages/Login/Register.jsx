import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import avatar from "../Images/avatar.png";

function Register() {
  const [responseMessage, setResponseMessage] = useState(); // response message like Successfully made accuont or email in use
  const [errorOccured, setErrorOccured] = useState(false); // just used to keep track of an error occurisng so we can display success message
  // variables for control error msg and sign up msg
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    setErrorOccured(false); // resetting this back to false as an error is yet to be done
    setLoading(true); // setting it to loading
    // preventDefault() just stops the form from reloading the page, easy for development but can get rid of it if you want
    e.preventDefault();
    // getting the values from the form
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = { avatar };
    const userId = Math.random() * (2000);

    // async create user
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // user info
        const user = userCredential.user||123;
        // store file
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);
        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update profile
              await updateProfile(user, {
                displayName,
                photoURL: downloadURL
              });
              //create user on firestore
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName,
                email,
                photoURL: downloadURL,
                userId: userId
              });

              // successful then home page as youre logging in
              setLoading(false);
              navigate("/home");
            } catch (err) {
              // if encounts error print log and show error msg and forbid loading
              console.log(err);
              setErrorOccured(true);
              setLoading(false);
            }
          });
        });
      })
      .catch((error) => {
        setErrorOccured(true);
        setLoading(false);
        switch (error.code) {
          case "auth/email-already-in-use":
            setResponseMessage(`Email address already in use.`);
            break;
          case "auth/invalid-email":
            setResponseMessage(`Email address is invalid.`);
            break;
          case "auth/operation-not-allowed":
            setResponseMessage(`Error during sign up.`);
            break;
          case "auth/weak-password":
            setResponseMessage("Password should be atleast 6 characters long.");
            break;
          default:
            setResponseMessage(error.message);
            break;
        }
      });
  };
  return (
    <>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Sign up</span>
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Name" name="name" />
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <input style={{ display: "none" }} type="file" id="file" />
            <button disabled={loading}>Sign up</button>
            {errorOccured && (
              <span className="errorMessage">{responseMessage}</span>
            )}
          </form>
          <p>
            Have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
