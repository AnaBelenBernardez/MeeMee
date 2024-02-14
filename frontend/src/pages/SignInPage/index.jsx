import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUserService } from "../../services/index.js";
import ArrowButton from "../../components/ArrowButton";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./style.css";

function SignInPage() {
  const { setToken, setLogin, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { token } = useParams();
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    const activateAccount = async () => {
      if (!token || activated) return;
      try {
        const response = await activateUserService({ token });
        if (response.message === "Account activated successfully") {
          setActivated(true);
          navigate("/");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, activated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const data = await loginUserService(formData);
      setToken(data);
      setLogin(true);
      setAuth(true);
      navigate("/");
    } catch (error) {
      setFormErrors({
        general: "Email or password is incorrect, please check your data.",
      });
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    const errors = {};

    if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email";
    }

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const errorMessages = {
    email: formErrors.email,
    password: formErrors.password,
    general: formErrors.general,
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
          <form onSubmit={submitHandler} autoComplete="off" noValidate>
            <div className="form-group">
              <input
                className="input-reg"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errorMessages.email && (
                <div className="error-message">{errorMessages.email}</div>
              )}
            </div>
            <div className="form-group" id="signin-password">
              <input
                className="input-reg"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              {errorMessages.password && (
                <div className="error-message">{errorMessages.password}</div>
              )}
              {errorMessages.general && (
                <div className="error-message">{errorMessages.general}</div>
              )}
              <img
                className="eye-icon"
                src={
                  showPassword
                    ? "../../icons/eye_opened.svg"
                    : "../../icons/eye_closed.svg"
                }
                alt={showPassword ? "Hide Password" : "Show Password"}
                onClick={togglePasswordVisibility}
              />
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
