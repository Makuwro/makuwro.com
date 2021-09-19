import React from "react";
import "../styles/outline.css";
import PropTypes from "prop-types";

function Outline(props) {

  // Check if we have any content and set up the headers
  return props.headers ? <div id="outline">
    <nav>{props.headers.map(item => React.createElement(item.type, null, item.props.children))}</nav>
  </div> : null;

}

Outline.propTypes = {
  headers: PropTypes.array
};

export default Outline;