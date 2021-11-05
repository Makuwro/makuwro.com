import React from "react";
import Header from "./Header";

export default function Home(props) {

  // Set the title
  document.title = "Welcome to The Showrunners Wiki!";

  return (
    <>
      <Header {...props} />
      <main>

      </main>
    </>
  );

}