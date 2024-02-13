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
      navigate("/");
    } catch (error) {
      console.error("Error creating meetup:", error);
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
    setFormData({
      ...formData,
      picture: e.target.files[0],
    });
  };

  const validateForm = () => {
    const errors = {};

    if (formData.title.trim() === "") {
      errors.title = "Title is required";
      toast.error("Title is required");
    } else if (formData.title.length > 40) {
      errors.title = "Title must be at most 40 characters";
      toast.error("Title must be at most 40 characters");
    }

    if (formData.description.trim() === "") {
      errors.description = "Description is required";
      toast.error("Description is required");
    } else if (formData.description.length > 255) {
      errors.description = "Description must be at most 255 characters";
      toast.error("Description must be at most 255 characters");
    }

    if (!formData.picture) {
      errors.picture = "Event photo is required";
      toast.error("Event photo is required");
    } else if (!formData.picture.type.includes("image/")) {
      errors.picture = "Please select a valid image file";
      toast.error("Please select a valid image file");
    }

    if (formData.theme.trim() === "") {
      errors.theme = "Category is required";
      toast.error("Category is required");
    }

    if (formData.location.trim() === "") {
      errors.location = "City is required";
      toast.error("City is required");
    } else if (formData.location.length > 40) {
      errors.location = "City must be at most 40 characters";
      toast.error("City must be at most 40 characters");
    }

    if (formData.address.trim() === "") {
      errors.address = "Address is required";
      toast.error("Address is required");
    } else if (formData.address.length > 100) {
      errors.address = "Address must be at most 100 characters";
      toast.error("Address must be at most 100 characters");
    }

    if (!formData.date) {
      errors.date = "Date is required";
      toast.error("Date is required");
    }

    if (formData.time.trim() === "") {
      errors.time = "Time is required";
      toast.error("Time is required");
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
            <form onSubmit={handleSubmit} autoComplete="off">
              <input
                type="text"
                className="input-reg"
                id="title"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
              />
              <div className="description-group">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  maxLength={255}
                />
                <div className="description-count">{descriptionLength}/255</div>
              </div>
              <div className="custom-file-input">
                <input
                  type="file"
                  name="picture"
                  accept="image/jpeg, image/png"
                  onChange={handlePictureChange}
                  style={{ display: "none" }}
                  id="customFileInput"
                />

                <label htmlFor="customFileInput">
                  Select a file for your event photo
                  <img src="../../icons/upload.svg" alt="upload image icon" />
                </label>
              </div>
              <div className="custom-select">
                <select
                  className="select-box"
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                >
                  <option value="">Category</option>
                  <option value="Social Events">Social Events</option>
                  <option value="Art and Culture">Art and Culture</option>
                  <option value="Videogames">Videogames</option>
                  <option value="Technology">Technology</option>
                  <option value="Travel and Outdoors">
                    Travel and Outdoors
                  </option>
                  <option value="Sports and Fitness">Sports and Fitness</option>
                </select>
              </div>
              <div className="location-container">
                <div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="input-reg"
                    placeholder="Select a city"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
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
                  />
                </div>
              </div>
              <div className="date-time-container">
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
