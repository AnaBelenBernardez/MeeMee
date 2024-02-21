import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const updatePageTitle = () => {
      const currentPath = window.location.pathname;
      let pageTitle = "MeeMee";

      if (currentPath === "/") {
        pageTitle = "Home";
      } else if (currentPath === "/signin") {
        pageTitle = "Sign In";
      } else if (currentPath === "/registered") {
        pageTitle = "";
      } else if (currentPath === "/signup") {
        pageTitle = "Sign Up";
      } else if (currentPath === "/terms") {
        pageTitle = "Terms";
      } else if (currentPath === "/privacy") {
        pageTitle = "Privacy";
      } else if (currentPath === "/cookie") {
        pageTitle = "Cookies";
      } else if (currentPath === "/events") {
        pageTitle = "Events";
      } else if (currentPath === "/postevent") {
        pageTitle = "Post Event";
      } else if (currentPath === "*") {
        pageTitle = "";
      }
      document.title = "MeeMee | " + pageTitle;
    };
    setTimeout(updatePageTitle, 0);
  }, [location]);

  return null;
}

export default PageTitle;
