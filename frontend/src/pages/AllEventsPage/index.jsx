import React, { useEffect, useState } from "react";
import { searchMeetups } from "../../services/index.js";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import EventCard from "../../components/EventCard";
import ExploreCategories from "../../components/ExploreCategories/index.jsx";
import EventFilter from "../../components/EventFilter";
import ScrollToTop from "../../components/ScrollToTop";
import ScrollBar from "../../components/ScrollBar";
import ConfirmBox from "../../components/ConfirmBox";
import "./style.css";

function AllEventsPage() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [visibleMeetups, setVisibleMeetups] = useState(50);

  useEffect(() => {
    const fetchMeetups = async () => {
      try {
        const meetupsData = await searchMeetups();
        setMeetups(meetupsData);
      } catch (error) {
        console.error("Error fetching meetups:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    fetchMeetups();
  }, []);

  const now = new Date();
  const filteredAndSortedMeetups = meetups
    .filter((meetup) => new Date(meetup.date) > now)
    .filter((meetup) => !selectedCategory || meetup.theme === selectedCategory)
    .filter(
      (meetup) => !selectedLocation || meetup.location === selectedLocation
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, visibleMeetups);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location) => {
    const formattedLocation = location
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setSelectedLocation(formattedLocation);
  };

  const loadMoreMeetups = () => {
    setVisibleMeetups((prevVisibleMeetups) => prevVisibleMeetups + 20);
  };

  return (
    <main className="events-page">
      <ScrollBar />
      <ScrollToTop />
      <div className="top-section">
        <EventFilter
          locations={getUniqueLocations(meetups)}
          onFilterChange={handleLocationChange}
        />
        <ExploreCategories onCategoryChange={handleCategoryChange} />
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="event-card-container">
          {filteredAndSortedMeetups.length > 0 ? (
            <>
              {filteredAndSortedMeetups.map((meetup) => (
                <EventCard key={meetup.id} meetup={meetup} />
              ))}
              {meetups.length > visibleMeetups &&
                visibleMeetups < meetups.length && (
                  <button onClick={loadMoreMeetups} id="loadmore">
                    Load more
                  </button>
                )}
            </>
          ) : (
            <ConfirmBox id="no-events" message={"No events available"} />
          )}
        </div>
      )}
    </main>
  );
}

const getUniqueLocations = (meetups) => {
  const locationsSet = new Set(meetups.map((meetup) => meetup.location));
  return Array.from(locationsSet);
};

export default AllEventsPage;
