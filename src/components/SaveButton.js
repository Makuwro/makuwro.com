import React, { useState } from "react";
import styles from "../styles/Settings.module.css";
import PropTypes from "prop-types";

export default function SaveButton({onClick}) {

  const [status, setStatus] = useState("Save");
  const [savingBlocked, blockSaving] = useState(false);
  let saving = false;
  function saveData() {

    if (saving) return;
    saving = true;
    blockSaving(true);
    if (onClick) onClick();
    setStatus("Saved!");

  }

  return (
    <section id={styles["settings-save-section"]}>
      <section>
        <span>HEY, BUDDY! Remember to save your changes</span>
        <button className={savingBlocked ? "unavailable" : null} onClick={saveData}>{status}</button>
      </section>
    </section>
  );

}

SaveButton.propTypes = {
  onClick: PropTypes.func
};