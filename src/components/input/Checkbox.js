import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Checkbox.module.css";

export default function Checkbox({checked, required = false, children, onClick}) {

  return (
    <section className={styles.checkbox}>
      <input type="checkbox" required={required} onChange={() => onClick && onClick(!checked)} checked={checked} />
      <label onClick={() => onClick && onClick(!checked)}>
        <span>
          {children}
        </span>
      </label>
    </section>
  );

}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  required: PropTypes.bool,
  children: PropTypes.node,
  defaultChecked: PropTypes.bool,
  onClick: PropTypes.func
};