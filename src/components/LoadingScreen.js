import React from "react";

function LoadingScreen() {

  const loadingLines = [
    "Talking to the power...", 
    "One moment please...",
    "Blaming Christian for something..."
  ];

  return <>{loadingLines[Math.floor(Math.random()*loadingLines.length)]}</>;

}

export default LoadingScreen;