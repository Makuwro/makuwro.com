import React from "react";
import styles from "../../../../styles/Literature.module.css";
import PropTypes from "prop-types";

export default function LiteratureDropdown({children}) {

  return (
    <section className={styles.dropdownMenu}>
      {children}
    </section>
  );

}

LiteratureDropdown.propTypes = {
  children: PropTypes.any
};