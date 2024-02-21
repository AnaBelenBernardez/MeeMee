import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowButton from "../../components/ArrowButton";
import { AuthContext } from "../../context/AuthContext.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createMeetup } from "../../services/index.js";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";
import BlackArrow from "../../components/BlackArrow";
import "./style.css";
import GMaps from "../../components/GMaps/index.jsx";

function PostEventPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picture: undefined,
    theme: "",
    location: "",
    address: "",
    date: null,
    time: "",
    organizer_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [eventCreated, setEventCreated] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
    if (event.target.name === "description") {
      setDescriptionLength(value.length);
    }
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setFormErrors({
      ...formErrors,
      [event.target.name]: null,
    });

    if (name === "location" || name === "address") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleCreateMeetup = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("Please sign in first");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const organizerId = parseInt(decodedToken.userId, 10);

      const meetupData = new FormData();
      meetupData.append("title", formData.title);
      meetupData.append("description", formData.description);
      meetupData.append("picture", formData.picture, formData.picture.name);
      const theme = formData.theme;
      meetupData.append("theme", theme);
      meetupData.append("location", formData.location);
      meetupData.append("address", formData.address);
      const date = formData.date;
      const formattedDate = `${date.getFullYear()}-${padZero(
        date.getMonth() + 1
      )}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(
        date.getMinutes()
      )}:${padZero(date.getSeconds())}`;

      meetupData.append("date", formattedDate);
      meetupData.append("date", formattedDate);
      meetupData.append("time", formData.time);
      meetupData.append("organizer_id", organizerId);

      await createMeetup(Object.fromEntries(meetupData.entries()), token);

      resetForm();
      setEventCreated(true);
      setShowConfirmation(true);
    } catch (error) {
      alert("Error creating meetup. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      picture: undefined,
      theme: "",
      location: "",
      address: "",
      date: null,
      time: "",
    });
    setFormErrors({});
  };

  const handlePictureChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({
      ...formData,
      picture: selectedFile,
    });

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewImage(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (formData.title.trim() === "") {
      errors.title = "* Title is required";
    } else if (formData.title.length < 5) {
      errors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 40) {
      errors.title = "Title must be at most 40 characters";
    }

    if (formData.description.trim() === "") {
      errors.description = "* Description is required";
    } else if (formData.description.length < 50) {
      errors.description = "Description must be at least 50 characters long";
    } else if (formData.description.length > 255) {
      errors.description = "Description too long";
    }

    if (!formData.picture) {
      errors.picture = "Photo is required";
    } else if (!formData.picture.type.includes("image/")) {
      errors.picture = "Please select a valid image file";
    }

    if (formData.theme.trim() === "") {
      errors.theme = "* Category is required";
    }

    if (formData.location.trim() === "") {
      errors.location = "* City is required";
    } else if (formData.location.length < 2) {
      errors.location = "City name too short";
    } else if (formData.location.length > 40) {
      errors.location = "City must be at most 40 characters";
    }

    if (formData.address.trim() === "") {
      errors.address = "* Address is required";
    } else if (formData.address.length < 5) {
      errors.address = "Address too short";
    } else if (formData.address.length > 100) {
      errors.address = "Address must be at most 100 characters";
    }

    if (!formData.date) {
      errors.date = "* Date is required";
    }

    if (formData.time.trim() === "") {
      errors.time = "* Time is required";
    }

    if (formData.date && formData.time) {
      const selectedDate = new Date(formData.date);
      const selectedTime = formData.time.split(":").map(Number);
      selectedDate.setHours(selectedTime[0]);
      selectedDate.setMinutes(selectedTime[1]);

      const now = new Date();

      const differenceInMilliseconds = selectedDate - now;
      const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

      if (differenceInMilliseconds < twentyFourHoursInMilliseconds) {
        errors.date = "The event must be at least 24 hours from now";
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await handleCreateMeetup();
    }
  };

  useEffect(() => {
    if (eventCreated) {
      setShowConfirmation(true);
    }
  }, [eventCreated]);

  const handleConfirmationAccept = () => {
    setShowConfirmation(false);
    navigate(`/events/${eventCreated}`);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate("/");
  };

  const handleLocationSelect = (ciudad, direccion) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: ciudad,
      address: direccion,
    }));
  };

  const errorMessages = {
    title: formErrors.title,
    description: formErrors.description,
    picture: formErrors.picture,
    theme: formErrors.theme,
    location: formErrors.location,
    address: formErrors.address,
    date: formErrors.date,
    time: formErrors.time,
  };

  return (
    <main className="postevent-page">
      {loading ? (
        <Loading />
      ) : (
        <div className="postevent-container">
          <div className="top-line">
            <h1 className="postevent-title">Event Details</h1>
          </div>
          <div className="formevent-container">
            {showConfirmation && (
              <>
                <div className="overlay"></div>
                <div id="event-created" className="confirmation-box">
                  <p className="no-attendees">Event created successfully!</p>
                  <div className="button-container">
                    {/* <button id="delete-no">Accept</button> */}
                    <button id="close-box" onClick={handleConfirmationClose}>
                      <img
                        src="../icons/cross.svg"
                        alt="Close button"
                        id="close-img"
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="postleft-column">
                <div className="input-container">
                  <input
                    type="text"
                    className="input-reg"
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errorMessages.title && (
                    <div className="error-message">{errorMessages.title}</div>
                  )}
                </div>

                <div className="description-group input-container">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    maxLength={255}
                  />
                  {errorMessages.description && (
                    <div className="error-message">
                      {errorMessages.description}
                    </div>
                  )}
                  <div className="description-count">
                    {descriptionLength}/255
                  </div>
                </div>

                <div className="custom-file-input input-container">
                  <input
                    type="file"
                    name="picture"
                    accept="image/jpeg, image/png"
                    onChange={handlePictureChange}
                    style={{ display: "none" }}
                    id="customFileInput"
                  />
                  <label htmlFor="customFileInput">
                    {errorMessages.picture ? (
                      <div className="error-message">
                        {errorMessages.picture}
                      </div>
                    ) : (
                      <span>Select a photo for your event</span>
                    )}
                    <img
                      src={
                        previewImage ? previewImage : "../../icons/upload.svg"
                      }
                      alt="upload event photo"
                    />
                  </label>
                </div>

                <div className="custom-select input-container">
                  <select
                    className="select-box"
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                  >
                    <option value="">Category</option>
                    <option value="Online Events">Online Events</option>
                    <option value="Videogames">Videogames</option>
                    <option value="Technology">Technology</option>
                    <option value="Board Games">Board Games</option>
                    <option value="Conventions and Cosplay">
                      Conventions and Cosplay
                    </option>
                    <option value="Travel and Outdoors">
                      Travel and Outdoors
                    </option>
                  </select>
                  {errorMessages.theme && (
                    <div className="error-message">{errorMessages.theme}</div>
                  )}
                </div>
              </div>
              <div className="postright-column">
                <GMaps
                  onLocationSelect={(ciudad, direccion) => {
                    setFormData({
                      ...formData,
                      location: ciudad,
                      address: direccion,
                    });
                  }}
                />
                <div className="location-container input-container">
                  <div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="input-reg"
                      placeholder="Select a city"
                      value={formData.location}
                      onChange={handleInputChange}
                      readOnly
                    />
                    {errorMessages.location && (
                      <div className="error-message">
                        {errorMessages.location}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      className="input-reg"
                      id="address"
                      name="address"
                      placeholder="Select an address"
                      value={formData.address}
                      onChange={handleInputChange}
                      readOnly
                    />
                    {errorMessages.address && (
                      <div className="error-message">
                        {errorMessages.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="date-time-container input-container">
                  <div>
                    <DatePicker
                      id="date"
                      name="date"
                      className="input-form"
                      selected={formData.date}
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          date,
                        })
                      }
                      placeholderText="Select a date"
                      dateFormat="dd/MM/yyyy"
                    />
                    {errorMessages.date && (
                      <div className="error-message">{errorMessages.date}</div>
                    )}
                  </div>
                  <div>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className="input-form"
                      placeholder="Select a time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                    {errorMessages.time && (
                      <div id="last-error" className="error-message">
                        {errorMessages.time}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group" id="form-signinbutton">
                <ArrowButton
                  id="form-signinbutton"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default PostEventPage;
