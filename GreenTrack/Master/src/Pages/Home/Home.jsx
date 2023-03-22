import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import background_unlogin from "../Images/background_unlogin.png";
import { AuthContext } from "../../Authentication.jsx";

function Home() {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <div className="background-home">
        <section>
          <div className="text-container">
            <h1 className="home-title">Record your green track here, in GreenTrack app</h1>
            <p className="home-slogon">
              Track your future, your present and see your past, the power to
              progressing is in tracking
            </p>
            <div className="home-button-container">
              {currentUser ? ( // if we're logged in display these buttons
                <>
                  <Link to="/trackPage">Get Started</Link>
                  <Link>Do something</Link>
                </>
              ) : (
                /* otherwise display these ones */
                <>
                  <Link to="/register">Sign up for free</Link>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="home-right">
          <div className="image-container">
            <img
              src={background_unlogin}
              alt="cool deadlift man"
              className="home-image"
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
