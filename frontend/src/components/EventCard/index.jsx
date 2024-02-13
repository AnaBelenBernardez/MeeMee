import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import "./style.css";

function EventCard({ meetup }) {
  const [attendeesCount, setAttendeesCount] = useState(0);

  useEffect(() => {
    let unmounted = false;

    const fetchAttendees = async () => {
      try {
        const attendeesResponse = await fetch(
          `${import.meta.env.VITE_APP_BACKEND}/attendees/${meetup.id}/list`
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

        if (!unmounted) {
          setAttendeesCount(attendeesData.length);
        }
      } catch (error) {}
    };

    fetchAttendees();

    return () => {
      unmounted = true;
    };
  }, [meetup.id]);

  const formattedDate = meetup.date
    ? format(new Date(meetup.date), "dd/MM/yy")
    : "Date not available";

  const formattedTime = meetup.time
    ? format(new Date(`2022-01-01 ${meetup.time}`), "HH:mm")
    : "";

  const formatLocation = (location) => {
    return location
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Link to={`/event/${meetup.id}`} style={{ textDecoration: "none" }}>
      <div className="event-card">
        {meetup ? (
          <>
            <img
              className="eventcard-image"
              src={
                meetup.picture.endsWith(".jpg") ||
                meetup.picture.endsWith(".jpeg") ||
                meetup.picture.endsWith(".png") ||
                meetup.picture.endsWith(".gif")
                  ? `${import.meta.env.VITE_APP_BACKEND}/uploads/${
                      meetup.picture || ""
                    }`
                  : meetup.picture
              }
              alt={`Event: ${meetup.title}`}
              width={300}
              height={200}
            />
            <p className="eventcard-location">
              <img
                className="event-icon"
                src="icons/location.svg"
                alt="Location"
              />
              {formatLocation(meetup.location)}
            </p>
            <h1 className="eventcard-title">{meetup.title}</h1>
            <p className="eventcard-theme">{meetup.theme}</p>
            <div className="eventcard-details">
              <div className="eventcard-date">
                <img
                  className="event-icon"
                  src="icons/calendar.svg"
                  alt="Date and hour"
                />
                <div id="event-date-hour">
                  <div id="date-card">{formattedDate} </div>
                  <div id="time-card"> {formattedTime}</div>
                </div>
              </div>
              <div className="eventcard-going">
                <img className="event-icon" src="icons/check.svg" alt="Going" />
                {attendeesCount} going
              </div>
            </div>
          </>
        ) : (
          <p>No event data available.</p>
        )}
      </div>
    </Link>
  );
}

export default EventCard;
