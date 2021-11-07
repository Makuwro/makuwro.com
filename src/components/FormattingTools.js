import React, { useState } from "react";
import styles from "../styles/Settings.module.css";
import Dropdown from "./Dropdown";
import PropTypes from "prop-types";

export default function FormattingTools({dropdownOption, onSaveButton, onChange, onViewChange}) {

  const [status, setStatus] = useState("Save");
  const [savingBlocked, blockSaving] = useState(false);
  const [view, setView] = useState("Visual");
  let saving = false;
  const saveData = () => {

    if (saving) return;
    saving = true;
    blockSaving(true);
    if (onSaveButton) onSaveButton();
    setStatus("Saved!");

  };

  const optionChanged = () => onChange && onChange();

  return (
    <section id={styles["settings-save-section"]}>
      <section>
        <section style={{display: "flex"}}>
          <Dropdown width={125} option={dropdownOption || "Paragraph"} onChange={optionChanged}>
            <li>Paragraph</li>
            <li>Heading 1</li>
            <li>Heading 2</li>
            <li>Heading 3</li>
          </Dropdown>
        </section>
        <section>
          <button>
            <b>b</b>
          </button>
          <button>
            <i>i</i>
          </button>
          <button>
            <u>u</u>
          </button>
          <button>
            <s>s</s>
          </button>
          <button>Link</button>
          <button>List</button>
        </section>
        <section>
          <button onClick={() => setView("Source")}>{view}</button>
          <button className={savingBlocked ? "unavailable" : null} onClick={saveData}>{status}</button>
        </section>
      </section>
    </section>
  );

}

FormattingTools.propTypes = {
  onSaveButton: PropTypes.func,
  onChange: PropTypes.func,
  dropdownOption: PropTypes.string,
  onViewChange: PropTypes.func
};