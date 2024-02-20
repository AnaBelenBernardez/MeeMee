import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import Loading from "../../components/Loading/index.jsx";
import "./style.css";

function SignOutButton() {
  const { auth, logoutHandler } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      await logoutHandler();
      toast.success("See you later 🐊!", {
        style: {
          backgroundColor: "#b528eb",
          color: "#7def51",
          fontFamily: "IBM Plex Mono",
          fontWeight: "600",
          borderRadius: "0px",
          border: "2px solid var(--text)",
          boxShadow: "3px 3px 0 1px rgba(24, 3, 37)",
          textAlign: "center",
          padding: "2rem",
        },
      });
      navigate("/");
    } catch (error) {
      toast.error("Error signing out. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-out-button">
      {loading ? (
        <Loading duration={400} />
      ) : (
        <>
          {auth ? (
            <NavLink onClick={handleSignOut} className="sign-out-link">
              Sign Out
            </NavLink>
          ) : (
            <NavLink to="/signin" className="sign-out-link">
              Sign In
            </NavLink>
          )}
        </>
      )}
    </div>
  );
}

export default SignOutButton;
