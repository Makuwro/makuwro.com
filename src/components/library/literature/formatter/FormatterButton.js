import React from "react";
import styles from "../../../../styles/Literature.module.css";
import PropTypes from "prop-types";

export default function FormatterButton({iconName, children, ...props}) {

  return (
    <button {...props} className={styles.wordButton}>
      <span className="material-icons-round">
        {iconName}
      </span>
      {children}
    </button>
  );

}

FormatterButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  children: PropTypes.any
};