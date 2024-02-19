import React, { useEffect, useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import AttendeesList from "../../components/AttendeesList/index.jsx";
import AttendeeButton from "../../components/AttendeeButton/index.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getDataUserService } from "../../services/index.js";
import { format } from "date-fns";
import DeleteMeetup from "../../components/DeleteMeetup/index.jsx";
import GMaps from "../../components/GMaps";
import "./style.css";

function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [eventData, setEventData] = useState(null);
  const [organizerUsername, setOrganizerUsername] = useState("");
  const [organizerAvatar, setOrganizerAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [updatingAttendees, setUpdatingAttendees] = useState(false);
  const [isAttendeesListOpen, setIsAttendeesListOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (ciudad, direccion) => {
    setSelectedLocation({ ciudad, direccion });
  };

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = parseInt(decodedToken.userId, 10);

  const updateAttendees = async () => {
    if (updatingAttendees) {
      return;
    }

    try {
      setUpdatingAttendees(true);

      const attendeesResponse = await fetch(
        `${import.meta.env.VITE_APP_BACKEND}/attendees/${id}/list`
      );

      const attendeesData = await attendeesResponse.json();

      if (!attendeesResponse.ok) {
        throw new Error(attendeesData.message);
      }

      if (attendeesData && attendeesData.message) {
        throw new Error(attendeesData.message);
      }

      if (!Array.isArray(attendeesData)) {
        throw new Error("Invalid data format: Expected an array");
      }

      setAttendees(attendeesData);
      setEventData((prevEventData) => ({
        ...prevEventData,
        attendees_count: attendeesData.length,
      }));
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setUpdatingAttendees(false);
    }
  };

  useEffect(() => {
    let unmounted = false;

    const fetchEventData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BACKEND}/meetups/${id}`
        );

        const eventData = await response.json();

        if (!response.ok) {
          throw new Error(eventData.message);
        }

        if (!eventData) {
          navigate("*");
          return;
        }

        if (!unmounted) {
          setEventData(eventData);
        }

        const organizerUserData = await getDataUserService({
          id: eventData.organizer_id,
          token,
        });
        setOrganizerUsername(organizerUserData.username);
        setOrganizerAvatar(organizerUserData.avatar);
        console.log("organizerUserData", organizerUserData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    const fetchAttendees = async () => {
      try {
        const attendeesResponse = await fetch(
          `${import.meta.env.VITE_APP_BACKEND}/attendees/${id}/list`
        );

        const attendeesData = await attendeesResponse.json();

        if (!attendeesResponse.ok) {
          throw new Error(attendeesData.message);
        }

        if (attendeesData && attendeesData.message) {
          throw new Error(attendeesData.message);
        }

        if (!Array.isArray(attendeesData)) {
          throw new Error("Invalid data format: Expected an array");
        }

        setAttendees(attendeesData);
        setEventData((prevEventData) => ({
          ...prevEventData,
          attendees_count: attendeesData.length,
        }));
      } catch (error) {
        // console.error("Error fetching attendees:", error);
      } finally {
        setUpdatingAttendees(false);
      }
    };

    fetchEventData();
    fetchAttendees();

    return () => {
      unmounted = true;
    };
  }, [id, userId, token, navigate]);

  let formattedDate = "No date available";
  let formattedTime = "No time available";

  if (eventData) {
    formattedDate = eventData.date
      ? format(new Date(eventData.date), "dd/MM/yy")
      : "No date available";

    formattedTime = eventData.time
      ? format(new Date(`2022-01-01 ${eventData.time}`), "HH:mm")
      : "No time available";
  }

  return (
    <main className="event-page">
      <div className="green-banner" id="goback-banner">
        <Link to="/events">
          <button id="goback-button">Go back</button>
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : eventData ? (
        <div className="event-container">
          <div className="left-column">
            <h1 className="event-title">{eventData.title}</h1>
            <p id="eventpage-description">{eventData.description}</p>
            <div id="organized-by-container">
              <img
                className="event-icon"
                src="../../icons/person.svg"
                alt="organized by"
              />
              <span id="organized-by">{`Organized by`}</span>
              <span id="organized-by-username">{` ${
                organizerUsername || ""
              }`}</span>
            </div>
            <div>
              {organizerAvatar ? (
                <img
                  id="eventpage-person"
                  src={`${
                    import.meta.env.VITE_APP_BACKEND
                  }/uploads/${organizerAvatar}`}
                  alt={`Avatar of ${organizerUsername || ""}`}
                />
              ) : (
                <img
                  id="eventpage-person"
                  src="/img/default_avatar.png"
                  alt="Default Avatar"
                />
              )}
            </div>
          </div>
          <div className="right-column">
            <div id="eventpage-imgcontainer">
              <img
                id="eventpage-image"
                className="event-icon"
                src={
                  eventData.picture.endsWith(".jpg") ||
                  eventData.picture.endsWith(".jpeg") ||
                  eventData.picture.endsWith(".png") ||
                  eventData.picture.endsWith(".gif")
                    ? `${import.meta.env.VITE_APP_BACKEND}/uploads/${
                        eventData.picture || ""
                      }`
                    : eventData.picture || ""
                }
                alt={`Event: ${eventData.title}`}
              />
            </div>
            <div className="green-banner" id="event-time">
              <img
                className="event-icon"
                src="../../icons/calendar.svg"
                alt="calendar"
              />
              <div className="date-time-info">
                <div id="date-info">{formattedDate} </div>
                <div id="time-info"> {formattedTime}</div>
              </div>
            </div>

            <div
              className={`green-banner ${
                eventData.organizer_id === userId
                  ? "delete-meetup"
                  : "attendee-button"
              }`}
              id="event-going"
              onClick={() => setIsAttendeesListOpen(true)}
            >
              <img
                className="event-icon"
                src="../../icons/attendees.svg"
                alt="signme"
              />
              {eventData.attendees_count} going
            </div>
            <div
              className={`green-banner ${
                eventData.organizer_id === userId
                  ? "delete-meetup"
                  : "attendee-button"
              }`}
              id="event-signme"
            >
              {eventData.organizer_id === userId ? (
                <DeleteMeetup
                  meetupId={id}
                  isOrganizer={true}
                  onDeleteMeetup={() => {
                    navigate("/events");
                  }}
                />
              ) : (
                <AttendeeButton
                  meetupId={id}
                  userId={userId}
                  username={username}
                  token={token}
                  updateAttendees={updateAttendees}
                />
              )}
            </div>
            <div className="event-locationinfo">
              <div className="event-map" id="eventpage-map">
                {eventData.address}
              </div>
              <div className="event-location">
                <p>
                  {" "}
                  <img
                    className="event-icon"
                    src="../../icons/location.svg"
                    alt="location"
                  />
                  {eventData.location}
                </p>
              </div>
            </div>
          </div>
          {isAttendeesListOpen && (
            <AttendeesList
              updateAttendees={updateAttendees}
              onClose={() => setIsAttendeesListOpen(false)}
            />
          )}
        </div>
      ) : (
        <Navigate to="*" />
      )}
    </main>
  );
}

export default EventPage;
