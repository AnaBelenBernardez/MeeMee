import React, { useState, useEffect, useContext } from "react";
import { getAttendeesByMeetup } from "../../services/index";
import { AuthContext } from "../../context/AuthContext";
import { getDataUserService } from "../../services/index.js";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import "./style.css";
import { useTranslation } from "react-i18next";

const AttendeesList = ({ updateAttendees, onClose }) => {
  const { t } = useTranslation();
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

        const attendeesWithUserData = [];

        for (const userId of attendeesData.map(
          (attendee) => attendee.user_id
        )) {
          try {
            const userData = await getDataUserService({
              id: userId,
              token,
            });

            attendeesWithUserData.push(userData);
          } catch (error) {
            console.error("Error al obtener datos del usuario:", error.message);
          }
        }

        setAttendees(attendeesWithUserData);
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
          <p id="no-attendees" className="no-attendees">
            {t("translation.noAttendees")}
          </p>
        ) : (
          <ul className="event-attendees-list">
            <h2 id="attendee-title">{t("translation.attendeesList")}</h2>
            <div className="attendees-container">
              {attendees.map((attendee) => (
                <li key={attendee.id}>
                  <div className="attendee-info">
                    <img
                      src={`${import.meta.env.VITE_APP_BACKEND}/uploads/${
                        attendee.avatar
                      }`}
                      alt={`${attendee.username}'s avatar`}
                      className="list-avatar"
                      loading="lazy"
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
