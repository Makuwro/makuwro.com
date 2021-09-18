import React from "react";
import "../styles/outline.css";

class Outline extends React.Component {
  
  constructor(props) {
    super(props);
  };

  render() {
    return (<div id="outline">
      <nav>
        <h1>Trust Fall</h1>
        <h1>Description</h1>
        <h1>Plot</h1>
      </nav>
    </div>)
  }
}

export default Outline;