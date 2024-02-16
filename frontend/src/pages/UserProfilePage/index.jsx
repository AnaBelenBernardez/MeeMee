import React, { useState, useEffect } from "react";
import "./style.css";
import { NavLink } from "react-router-dom";
import Loading from "../../components/Loading";

function ProfilePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="profile-page">
      {loading ? (
        <Loading />
      ) : (
        <div className="profile-container">
          <div className="top-line">
            <NavLink
              id="myaccount"
              className="profile-title"
              to="/user/:nickname"
            >
              My Account
            </NavLink>
            <NavLink id="myevents" className="profile-title" to="">
              My Events
            </NavLink>
            <NavLink id="events-saved" className="profile-title" to="">
              Events Saved
            </NavLink>
          </div>
          <div className="profile-details">
            <div className="left-column">
              <h2>User's name</h2>
              <img
                id="userphoto-profile"
                src="../../userPhoto/user2.jpg"
                alt=""
              />
              <div className="profile-buttons">
                <button id="edit-button">
                  <img
                    src="../../icons/edit-profile.svg"
                    className="event-icon"
                    alt="edit profile icon"
                  />
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="profile-text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Est,
                quam vel? Et officia, quia corporis excepturi ipsum facilis
                provident repudiandae, accusantium tempore fuga, dolor culpa. Et
                debitis ullam voluptas modi!
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProfilePage;
