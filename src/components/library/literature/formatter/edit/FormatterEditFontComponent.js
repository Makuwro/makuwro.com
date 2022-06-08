import React from "react";
import LiteratureDropdown from "../LiteratureDropdown";
import PropTypes from "prop-types";

export default function FormatterEditFontComponent({styles, formatSelection}) {

  return (
    <>
      <section>
        <button id={styles.fontName} className={styles.dropdown} disabled title="Can't change the font yet! Sorry">
          Lexend Deca
          <span className="material-icons-round">
            expand_more
          </span>
        </button>
        <button className={`${styles.dropdown} ${styles.fontSize}`} disabled>
          16
          <span className="material-icons-round">
            expand_more
          </span>
        </button>
        <section>
          <button id={styles.headingSelector} className={styles.dropdown} disabled>
            Normal text
            <span className="material-icons-round">
              expand_more
            </span>
          </button>
          <LiteratureDropdown>
            Test
          </LiteratureDropdown>
        </section>
      </section>
      <section>
        <button disabled>
          <b>B</b>
        </button>
        <button disabled>
          <i>I</i>
        </button>
        <button disabled>
          <u>U</u>
        </button>
        <button disabled>
          <s>S</s>
        </button>
        <button disabled onClick={() => formatSelection("a")} type="button" title="Link">
          <span id={styles.textColor}>C</span>
        </button>
        <button disabled onClick={() => formatSelection("a")} type="button" title="Link">
          🖌️
        </button>
        <button disabled onClick={() => formatSelection("a")} type="button" title="Link">
          <span className="material-icons-round">
            link
          </span>
        </button>
      </section>
    </>
  );

}

FormatterEditFontComponent.propTypes = {
  styles: PropTypes.object.isRequired,
  formatSelection: PropTypes.func.isRequired
};