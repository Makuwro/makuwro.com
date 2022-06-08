import React, { useState } from "react";
import LiteratureDropdown from "../LiteratureDropdown";
import PropTypes from "prop-types";

export default function FormatterEditFontComponent({styles, formatSelection, changeHeadingType}) {

  const [headingSelectorOpen, setHeadingSelectorOpen] = useState(false);

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
          <button id={styles.headingSelector} className={styles.dropdown} onClick={() => setHeadingSelectorOpen(!headingSelectorOpen)}>
            Normal text
            <span className="material-icons-round">
              expand_more
            </span>
          </button>
          <LiteratureDropdown open={headingSelectorOpen} onChange={(index) => {

            switch (index) {

              case 0:
                changeHeadingType("p");
                break;

              case 1:
                changeHeadingType("h1");
                break;

              case 2:
                changeHeadingType("h2");
                break;

              case 3:
                changeHeadingType("h3");
                break;

              default:
                // TODO: Send diagnostic data to the developers if the user allows?
                break;

            }
            setHeadingSelectorOpen(false);

          }}>
            <button>
              Normal text
            </button>
            <button>
              <h1>Heading 1</h1>
            </button>
            <button>
              <h2>Heading 2</h2>
            </button>
            <button>
              <h3>Heading 3</h3>
            </button>
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