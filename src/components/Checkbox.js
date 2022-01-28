import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/Checkbox.module.css";

export default function Checkbox({required = false, children, defaultChecked = false}) {

  const [checked, setChecked] = useState(defaultChecked);

  function toggle() {

    setChecked(!checked);

  }
  
  return (
    <section className={styles.checkbox}>
      <input type="checkbox" required={required} onClick={() => toggle()} checked={checked} />
      <label onClick={() => toggle()}>
        <span>
          {children}
        </span>
      </label>
    </section>
  );

}

Checkbox.propTypes = {
  required: PropTypes.bool,
  children: PropTypes.node,
  defaultChecked: PropTypes.bool
};