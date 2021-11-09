import React from "react";
import PropTypes from "prop-types";

export default function Home({theme}) {

  // Set the title
  document.title = "Welcome to The Showrunners Wiki!";

  return (
    <>
      <main className={theme !== "night" ? theme : null}>
      
      </main>
    </>
  );

}

Home.propTypes = {
  theme: PropTypes.number
};