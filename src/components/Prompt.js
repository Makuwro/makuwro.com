import React from "react";
import styles from "../styles/Settings.module.css";

export default function Prompt(props) {

  return props.visible[0] ? (
    <section id={styles["settings-prompt"]}>
      <section>
        <h1>{props.title[0]}</h1>
        <section>{props.description[0]}</section>
        <section id={styles["settings-prompt-selection"]}>{props.options[0]}</section>
      </section>
      <div onClick={() => props.visible[1](false)}></div>
    </section>
  ) : null;

}