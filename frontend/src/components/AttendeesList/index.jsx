import React, { useState, useEffect, useContext } from "react";
import { getAttendeesByMeetup } from "../../services/index";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import "./style.css";

const AttendeesList = ({ updateAttendees, onClose }) => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendeesData = async () => {
      try {
        const attendeesData = await getAttendeesByMeetup(id, token);

        if (Array.isArray(attendeesData)) {
          setAttendees(attendeesData);
        }
      } catch (error) {
        setError("Error fetching attendees: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeesData();
  }, [id, token, updateAttendees]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const body = document.body;
    if (attendees.length > 0) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    return () => {
      body.style.overflow = "auto";
    };
  }, [attendees]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="overlay"></div>
      <div className="confirmation-box">
        <button id="close-box" onClick={handleClose}>
          <img src="../icons/cross.svg" alt="Close button" id="close-img" />
        </button>
        {attendees.length === 0 ? (
          <p className="no-attendees">No attendees for this event (yet).</p>
        ) : (
          <ul className="event-attendees-list">
            <h2 id="attendee-title">Who else has signed up?</h2>
            <div className="attendees-container">
              {attendees.map((attendee) => (
                <li key={attendee.id}>
                  <div className="attendee-info">
                    <img
                      // src={attendee.avatar}
                      src="https://via.placeholder.com/50"
                      alt={`${attendee.username}'s avatar`}
                      className="list-avatar"
                    />
                    <span>{attendee.username}</span>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        )}
      </div>
    </>
  );
};
export default AttendeesList;
