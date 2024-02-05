import { useState, useContext, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import ArrowButton from "../../components/ArrowButton";
import { AuthContext } from "../../context/AuthContext.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createMeetup } from "../../services/index.js";
import Loading from "../../components/Loading";

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
        console.log("Token is missing");
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
    }

    if (formData.description.trim() === "") {
      errors.description = "Description is required";
    }

    if (formData.picture && !formData.picture.type.includes("image/")) {
      errors.picture = "Please select a valid image file";
    }

    if (formData.theme.trim() === "") {
      errors.theme = "Category is required";
    }

    if (formData.location.trim() === "") {
      errors.location = "City is required";
    }

    if (formData.address.trim() === "") {
      errors.address = "Address is required";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    }

    if (formData.time.trim() === "") {
      errors.time = "Time is required";
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
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <div className="description-group">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="description"
                  maxLength={255}
                />
              </div>
              <div>
                <input
                  type="file"
                  name="picture"
                  accept="image/jpeg, image/png"
                  onChange={handlePictureChange}
                  style={{ marginBottom: "10px" }}
                />
                {formErrors.picture && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {formErrors.picture}
                  </p>
                )}
              </div>
              <div>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">category</option>
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
              <div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Select a city"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.location && (
                  <p style={{ color: "red" }}>{formErrors.location}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Select an address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.address && (
                  <p style={{ color: "red" }}>{formErrors.address}</p>
                )}
              </div>
              <div>
                <DatePicker
                  id="date"
                  name="date"
                  selected={formData.date}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      date,
                    })
                  }
                  placeholderText="Select a date"
                  dateFormat="dd/MM/yyyy"
                  required
                />
                {formErrors.date && (
                  <p style={{ color: "red" }}>{formErrors.date}</p>
                )}
              </div>
              <div>
                <input
                  type="time"
                  id="time"
                  name="time"
                  placeholder="Select a time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.time && (
                  <p style={{ color: "red" }}>{formErrors.time}</p>
                )}
              </div>

              <ArrowButton
                id="post-button"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              />
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default PostEventPage;
