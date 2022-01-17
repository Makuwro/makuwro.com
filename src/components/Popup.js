import React, {useState} from "react";
import PropTypes from "prop-types";
import styles from "../styles/Popup.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import LibraryCreator from "./LibraryCreator";

export default function Popup({title, content}) {

  const [searchParams] = useSearchParams();
  let create = searchParams.get("create");
  let queried = true;
  content = create ? <LibraryCreator category={create} /> : null;
  switch (create) {

    case "art":
      title = "Upload art";
      break;

    case "literature":
      title = "Create literature";
      break;

    case "character":
      title = "Create character";
      break;

    default:
      queried = false;
      break;

  }
  let [open, setOpen] = useState(queried);
  if (queried && !open) {

    setOpen(true);
    return null;

  }
  const navigate = useNavigate();

  return (
    <section id={styles["popup-background"]} className={open ? styles["open"] : null} onClick={() => {

      if (queried) {

        navigate(window.location.pathname + (location.hash ? `#${location.hash}` : ""), {replace: true});
        setOpen(false);
        return;

      }

    }}>
      <section id={styles["popup-container"]} onClick={(event) => event.stopPropagation()}>
        <section id={styles["popup-header"]}>
          <h1>{title}</h1>
        </section>
        <section id={styles["popup-content"]}>{content}</section>
      </section>
    </section>
  );

}

Popup.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.element
};