import React, { useState } from "react";
import styles from "../styles/Settings.module.css";
import Dropdown from "./Dropdown";
import PropTypes from "prop-types";

export default function FormattingTools({onSaveButton, onChange}) {

  const [status, setStatus] = useState("Save");
  const [savingBlocked, blockSaving] = useState(false);
  let saving = false;
  function saveData() {

    if (saving) return;
    saving = true;
    blockSaving(true);
    if (onSaveButton) onSaveButton();
    setStatus("Saved!");

  }

  const optionChanged = () => onChange && onChange();

  return (
    <section id={styles["settings-save-section"]}>
      <section>
        <section style={{display: "flex"}}>
          <Dropdown width={125} defaultOption="Paragraph" onChange={optionChanged}>
            <li>Paragraph</li>
            <li>Heading 1</li>
            <li>Heading 2</li>
            <li>Heading 3</li>
          </Dropdown>
          <button style={{marginLeft: "1rem"}}>
            <b>b</b>
          </button>
          <button style={{marginLeft: "5px"}}>
            <i>i</i>
          </button>
          <button style={{marginLeft: "5px"}}>
            <u>u</u>
          </button>
          <button style={{marginLeft: "5px"}}>Link</button>
        </section>
        <button className={savingBlocked ? "unavailable" : null} onClick={saveData}>{status}</button>
      </section>
    </section>
  );

}

FormattingTools.propTypes = {
  onSaveButton: PropTypes.func,
  onChange: PropTypes.func
};