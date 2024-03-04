import React, { useState, useEffect } from "react";
import {
  createAttendeeService,
  deleteAttendeeService,
} from "../../services/index.js";
import { NavLink } from "react-router-dom";
import "./style.css";
import { useTranslation } from "react-i18next";

const AttendeeButton = ({ meetupId, userId, token, updateAttendees }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [clickedYes, setClickedYes] = useState(false);
  const [clickedNo, setClickedNo] = useState(false);

  const handleYesMouseDown = () => {
    setClickedYes(true);
    setTimeout(() => {
      setClickedYes(false);
    }, 100);
  };

  const handleYesMouseUp = () => {
    setClickedYes(false);
  };

  const handleNoMouseDown = () => {
    setClickedNo(true);
    setTimeout(() => {
      setClickedNo(false);
    }, 100);
  };

  const handleNoMouseUp = () => {
    setClickedNo(false);
  };

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
      {/* {userId === null ? (
        <p className="sign-in-message">{t("translation.signInFirst")}</p>
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
          {isAttendee
            ? t("translation.IchangedMyMind")
            : t("translation.signMeUp")}
        </button>
      )} */}

      {showConfirmation && (
        <>
          <div className="overlay"></div>
          <div id="confirmation-box-attend">
            <p className="no-attendees">{t("translation.changedMind")}</p>
            <div className="button-container">
              <button
                id="delete-yes"
                onMouseDown={handleYesMouseDown}
                onMouseUp={handleYesMouseUp}
                className={clickedYes ? "clicked-animation" : ""}
                onClick={handleDeleteMeetup}
              >
                {t("translation.yes")}
              </button>
              <button
                id="delete-no"
                onMouseDown={handleNoMouseDown}
                onMouseUp={handleNoMouseUp}
                className={clickedNo ? "clicked-animation" : ""}
                onClick={handleCancelDelete}
              >
                {t("translation.cancel")}
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
            <NavLink id="signin-first" className="sign-in-message" to="/signin">
              {t("translation.signInFirst")}
            </NavLink>
          ) : isAttendee ? (
            t("translation.IchangedMyMind")
          ) : (
            t("translation.signMeUp")
          )}
        </button>
      )}
    </div>
  );
};

export default AttendeeButton;
