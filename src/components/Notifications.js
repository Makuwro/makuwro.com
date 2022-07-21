import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "./Popup";
import PropTypes from "prop-types";
import Notification from "./Notification";

export default function Notifications({shownLocation}) {

  const [popupOpen, setPopupOpen] = useState(false);
  const {pathname} = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (pathname === "/notifications") {

      document.title = "Notifications / Makuwro";
      setPopupOpen(true);

    }

  }, [pathname]);

  function exit() {

    setPopupOpen(false);
    navigate(shownLocation || "/");

  }

  return popupOpen ? (
    <Popup title="Notifications" onClose={exit}>
      <Notification>
        Your supporter membership will expire in <b>three days.</b>
      </Notification>
      {/* <p>You don't got any, but rest assured: we'll tell you if someone likes your furry fanfiction.</p> */}
    </Popup>
  ) : null;

}

Notifications.propTypes = {
  shownLocation: PropTypes.object
};