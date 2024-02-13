import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { activateUserService, loginUserService } from "../../services/index.js";
import ArrowButton from "../../components/ArrowButton";
import { AuthContext } from "../../context/AuthContext.jsx";
import Loading from "../../components/Loading/index.jsx";
import "./style.css";

function SignInPage() {
  const { setToken, setLogin, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams();
  const [activated, setActivated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    const activateAccount = async (token) => {
      try {
        const response = await activateUserService({ token });
        if (response.message === "Account activated successfully") {
          toast.success("Session initiated successfully!");
          setActivated(true);
        }

        if (response) {
          navigate("/account/myprofile");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    if (!initialLoad && token && !activated) {
      activateAccount(token);
    }
    setInitialLoad(false);
  }, [token, activated, initialLoad, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUserService({ email, password });
      setToken(data);
      setLogin(true);
      setAuth(true);

      if (data) {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  };

  return (
    <main className="signin-page">
      <div className="basic-container" id="signin-container">
        <img className="signin-image" src="/img/show.avif" alt="" />
        <div className="signin-section">
          <div className="signin-header">
            <Link to="/signup" className="link-sign">
              Sign Up
            </Link>
            <Link to="/signin" id="link-signin" className="link-sign">
              Sign In
            </Link>
          </div>
          <h2 className="signin-text">
            <span className="black-text">Glad to see</span>
            <span className="you-text"> you</span>
            <span className="black-text"> again!</span>
          </h2>
          <form onSubmit={submitHandler} autoComplete="off">
            <div className="form-group">
              <input
                className="input-reg"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group" id="signin-password">
              <input
                className="input-reg"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {showPassword ? (
                <img
                  className="eye-icon"
                  src="../../icons/eye_opened.svg"
                  alt="Hide Password"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <img
                  className="eye-icon"
                  src="../../icons/eye_closed.svg"
                  alt="Show Password"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>

            <div className="form-group" id="form-signinbutton">
              <ArrowButton id="signin-button" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SignInPage;
