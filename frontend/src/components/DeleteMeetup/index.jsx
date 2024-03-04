import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { deleteMeetup } from "../../services/index";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";
import { useTranslation } from "react-i18next";

const DeleteMeetup = ({ meetupId, isOrganizer, onDeleteMeetup }) => {
  const { t } = useTranslation();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [clickedYes, setClickedYes] = useState(false);
  const [clickedNo, setClickedNo] = useState(false);

  const handleDeleteMeetup = async () => {
    try {
      setLoading(true);
      await deleteMeetup(meetupId, token);
      onDeleteMeetup();
    } catch (error) {
      setError("Error deleting meetup: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

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

  return (
    <div>
      {isOrganizer && (
        <div>
          {!confirmDelete && (
            <button
              id="button-deletemeetup"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              <img
                className="event-icon"
                src="../../icons/cross.svg"
                alt="delete event"
              />
              {t("translation.deleteEvent")}
            </button>
          )}
          {confirmDelete && (
            <>
              <div className="overlay"></div>
              <div className="confirmation-box">
                <p className="no-attendees">{t("translation.deleteSure")}</p>

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
        </div>
      )}
    </div>
  );
};

export default DeleteMeetup;
