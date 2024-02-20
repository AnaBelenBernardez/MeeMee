import React, { useState, useEffect } from "react";
import EventCard from "../EventCard";
import Loading from "../Loading";
import { searchMeetups } from "../../services/index.js";
import { Link } from "react-router-dom";
import NoNextEvents from "../NoNextEvents";
import CustomLeftArrow from "../CustomLeftArrow";
import CustomRightArrow from "../CustomRightArrow";
import "./style.css";

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

function NextEvents() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSlides, setVisibleSlides] = useState(4);

  useEffect(() => {
    const fetchMeetups = async () => {
      try {
        const meetupsData = await searchMeetups();
        setMeetups(meetupsData);
      } catch (error) {
        console.error("Error fetching meetups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetups();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 1500) {
        setVisibleSlides(4);
      } else if (screenWidth <= 1500 && screenWidth > 1200) {
        setVisibleSlides(3);
      } else {
        setVisibleSlides(2);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const now = new Date();
  const filteredAndSortedMeetups = meetups
    .filter((meetup) => new Date(meetup.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const firstTenMeetups = filteredAndSortedMeetups.slice(0, 10);

  return (
    <div className="next-events">
      {loading ? (
        <Loading />
      ) : firstTenMeetups.length > 0 ? (
        <div className="event-cards-container">
          <div className="green-banner" id="nextevents-banner">
            <p>Next Events!</p>
          </div>
          <CarouselProvider
            naturalSlideWidth={40}
            naturalSlideHeight={45}
            totalSlides={firstTenMeetups.length}
            visibleSlides={visibleSlides}
            infinite="true"
            interval={2000}
            isPlaying={true}
          >
            <div className="carousel-controls">
              <ButtonBack id="buttonback">
                <CustomLeftArrow />
              </ButtonBack>
              <ButtonNext id="buttonnext">
                <CustomRightArrow />
              </ButtonNext>
            </div>
            <Slider className="slider">
              {firstTenMeetups.map((meetup) => (
                <Slide key={meetup.id}>
                  <EventCard meetup={meetup} />
                </Slide>
              ))}
            </Slider>
          </CarouselProvider>
        </div>
      ) : (
        <NoNextEvents />
      )}
    </div>
  );
}

export default NextEvents;
