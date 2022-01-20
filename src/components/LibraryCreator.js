import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Library.module.css";
import NotFound from "./NotFound";
import Dropdown from "./Dropdown";

export default function LibraryCreator({category, username}) {

  const titles = {
    art: "Upload art",
    character: "Create a character",
    literature: "Create literature"
  };
  let title;
  let page;
  let avatarRef;
  let urlRef;
  let state = {
    name: useState(""),
    description: useState(""),
    avatarURL: useState("https://f2.toyhou.se/file/f2-toyhou-se/users/Christian?19"),
    characterURL: useState(""),
    tags: useState(""),
    art: useState()
  };
  let updateAvatar;
  let updateInput;

  // Make sure the category is valid
  title = category ? titles[category] : "Create something";
  if (category && !titles[category]) return <NotFound />;

  // Change the page title
  document.title = `${title} / Makuwro`;

  switch (category) {

    case "literature":
      
      break;

    default:
      break;

  }

  return (
    <section id={styles["library-creator"]}>
      {page}
    </section>
  );

}

LibraryCreator.propTypes = {
  category: PropTypes.string,
  username: PropTypes.string,
  popup: PropTypes.element
};