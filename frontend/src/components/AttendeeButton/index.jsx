import React, { useState, useEffect } from "react";
import {
  createAttendeeService,
  deleteAttendeeService,
} from "../../services/index.js";
import { NavLink } from "react-router-dom";
import "./style.css";

const AttendeeButton = ({ meetupId, userId, token, updateAttendees }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const checkAttendeeStatus = async () => {
      try {
        const attendeesResponse = await fetch(
          `${import.meta.env.VITE_APP_BACKEND}/attendees/${meetupId}/list`
        );
        const attendeesData = await attendeesResponse.json();
        if (attendeesData && attendeesData.message) {
          throw new Error(attendeesData.message);
        }

        if (!Array.isArray(attendeesData)) {
          throw new Error("Invalid data format: Expected an array");
        }

        const userIsAttendee = attendeesData.some(
          (attendee) => attendee.user_id === userId
        );

        setIsAttendee(userIsAttendee);
      } catch (error) {
        console.error("Error checking attendee status:", error);
      }
    };

    checkAttendeeStatus();
  }, [meetupId, userId]);

  const handleAttendeeAction = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAttendee) {
        await createAttendeeService({ meetupId, userId, token });
        setIsAttendee(true);
      } else {
        setShowConfirmation(true);
      }
      updateAttendees();
    } catch (error) {
      console.error("Error during attendance action:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeetup = async () => {
    setShowConfirmation(false);
    try {
      setLoading(true);
      setError(null);
      await deleteAttendeeService({ meetupId, userId, token });
      setIsAttendee(false);
      updateAttendees();
    } catch (error) {
      console.error("Error during attendance cancellation:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="attendee-button">

      {userId === null ? (
        <p className="sign-in-message">Sign in first</p>
      ) : (
        <button
          id="button-signme"
          onClick={handleAttendeeAction}
          disabled={loading}
        >
          <img
            className="event-icon"
            src="../../icons/check.svg"
            alt="signme icon"
            id="icon-signme"
          />
          {isAttendee ? "I changed my mind" : "Sign me up!"}
        </button>
      )}


      {showConfirmation && (
        <>
          <div className="overlay"></div>
          <div className="confirmation-box">
            <p className="no-attendees">
              Are you sure you no longer want to attend this event?
            </p>
            <div className="button-container">
              <button id="delete-yes" onClick={handleDeleteMeetup}>
                Yes
              </button>
              <button id="delete-no" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {!showConfirmation && (
        <button
          id="button-signme"
          onClick={handleAttendeeAction}
          disabled={loading}
        >
          <img
            className="event-icon"
            src="../../icons/check.svg"
            alt="signme icon"
            id="icon-signme"
          />
          {userId === null ? (
            <NavLink id="signin-first" to="/signin">
              Sign in to attend
            </NavLink>
          ) : isAttendee ? (
            "I changed my mind"
          ) : (
            "Sign me up!"
          )}
        </button>
      )}
    </div>
  );
};

export default AttendeeButton;
