import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserService, loginUserService } from "../../services/index.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import ArrowButton from "../../components/ArrowButton";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import "./style.css";

function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken, setLogin } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const handleBioChange = (event) => {
    const newBio = event.target.value.slice(0, 255);
    setBio(newBio);
  };

  const characterCount = bio.length;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setAvatar(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setAvatar(null);
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const usernameRegex = /^[a-zA-Z0-9_.-]{4,20}$/;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*_\-\.])(?=.{8,})/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    const errors = {};

    if (!usernameRegex.test(username)) {
      errors.username = t("translation.usernameError");
    }

    if (!emailRegex.test(email)) {
      errors.email = t("translation.emailError");
    }
    if (!passwordRegex.test(pass1)) {
      errors.pass1 = t("translation.passwordErrorUp");
    } else if (pass1 !== pass2) {
      errors.pass2 = t("translation.passwordMatchError");
    }
    if (!avatar) {
      errors.avatar = t("translation.avatarError");
    }
    if (!bio.trim()) {
      errors.bio = t("translation.bioError");
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const userData = new FormData();
      userData.append("username", username);
      userData.append("bio", bio);
      userData.append("email", email);
      userData.append("password", pass1);
      userData.append("avatar", avatar, avatar.name);

      const response = await registerUserService(userData);

      if (response.error) {
        setError(response.error);
        return;
      }

      const loginToken = await loginUserService({ email, password: pass1 });

      setToken(loginToken);
      setLogin(true);

      navigate(`/registered`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(t("translation.registrationConflictError"));
        console.error("Error in handleForm:", error.message);
      } else {
        setError(t("translation.registrationError"));
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  const errorMessages = {
    username: formErrors.username,
    email: formErrors.email,
    pass1: formErrors.pass1,
    pass2: formErrors.pass2,
    bio: formErrors.bio,
    avatar: formErrors.avatar,
  };

  return (
    <main className="signin-page">
      <div className="basic-container">
        <img id="signup-image" src="/img/show.avif" alt="" />
        <div className="signin-section" id="signup-section">
          <div className="signup-header">
            <Link to="/signup" className="link-sign" id="link-signup">
              {t("translation.signUp")}
            </Link>
            <Link to="/signin" className="link-sign">
              {t("translation.signIn")}
            </Link>
          </div>
          <form
            onSubmit={handleForm}
            autoComplete="off"
            noValidate
            encType="multipart/form-data"
          >
            <ul>
              <li className="form-group">
                <input
                  className="input-reg"
                  type="text"
                  id="username"
                  name="username"
                  placeholder={t("translation.usernamePlaceholder")}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {formErrors.username && (
                  <div className="error-message">{formErrors.username}</div>
                )}
              </li>
              <li className="form-group">
                <input
                  className="input-reg"
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t("translation.emailPlaceholder")}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && (
                  <div className="error-message">{formErrors.email}</div>
                )}
              </li>
              <li className="form-group">
                <div id="signup-password">
                  <input
                    className="input-reg"
                    htmlFor="pass1"
                    type={showPassword ? "text" : "password"}
                    id="pass1"
                    name="pass1"
                    placeholder={t("translation.passwordPlaceholder")}
                    onChange={(e) => setPass1(e.target.value)}
                  />
                  {showPassword ? (
                    <img
                      className="eye-icon-up"
                      src="../../icons/eye_opened.svg"
                      alt={t("translation.hidePassword")}
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <img
                      className="eye-icon-up"
                      src="../../icons/eye_closed.svg"
                      alt={t("translation.showPassword")}
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </li>
              <li className="form-group">
                <input
                  className="input-reg"
                  htmlFor="pass2"
                  type={showPassword ? "text" : "password"}
                  id="pass2"
                  name="pass2"
                  placeholder={t("translation.repeatPasswordPlaceholder")}
                  onChange={(e) => setPass2(e.target.value)}
                />
                {formErrors.pass1 && (
                  <div id="pass1-error" className="error-message">
                    {formErrors.pass1}
                  </div>
                )}
                {formErrors.pass2 && (
                  <div className="error-message">{formErrors.pass2}</div>
                )}
              </li>
              <li className="custom-file-input" id="signup-avatar">
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/jpeg, image/png"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar">
                  {formErrors.avatar ? (
                    <div className="error-message">{formErrors.avatar}</div>
                  ) : (
                    <>
                      <span>{t("translation.selectAvatar")}</span>
                    </>
                  )}
                  <img
                    id="upload-avatar"
                    src={previewImage ? previewImage : "../../icons/upload.svg"}
                    alt={t("translation.uploadAvatar")}
                  />
                </label>
              </li>
              <li className="form-group" id="form-bio">
                <textarea
                  className="input-reg"
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder={t("translation.bioPlaceholder")}
                  maxLength={255}
                />
                <div className="character-count">{`${characterCount}/255`}</div>
                {formErrors.bio && (
                  <div className="error-message">{formErrors.bio}</div>
                )}
              </li>
            </ul>
            <div className="form-group" id="form-signinbutton">
              <ArrowButton id="signin-button" type="submit" />
            </div>
            {loading && <Loading />}
          </form>
        </div>
      </div>
    </main>
  );
}

export default SignUpPage;
