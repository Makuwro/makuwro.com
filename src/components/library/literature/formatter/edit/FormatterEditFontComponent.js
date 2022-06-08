import React, { useState, useEffect } from "react";
import LiteratureDropdown from "../LiteratureDropdown";
import PropTypes from "prop-types";

export default function FormatterEditFontComponent({styles, formatSelection, changeHeadingType, contentContainerSelected, selectedHeadingTagName = "P"}) {

  const [headingSelectorOpen, setHeadingSelectorOpen] = useState(false);

  useEffect(() => {

    if (!contentContainerSelected) {

      setHeadingSelectorOpen(false);

    }

  }, [contentContainerSelected]);

  return (
    <>
      <section>
        <button id={styles.fontName} className={styles.dropdown} disabled={!contentContainerSelected} title="Can't change the font yet! Sorry">
          Lexend Deca
          <span className="material-icons-round">
            expand_more
          </span>
        </button>
        <button className={`${styles.dropdown} ${styles.fontSize}`} disabled={!contentContainerSelected}>
          16
          <span className="material-icons-round">
            expand_more
          </span>
        </button>
        <section>
          <button id={styles.headingSelector} disabled={!contentContainerSelected} className={styles.dropdown} onClick={() => setHeadingSelectorOpen(!headingSelectorOpen)}>
            {{"P": "Normal text", "H1": "Heading 1", "H2": "Heading 2", "H3": "Heading 3"}[selectedHeadingTagName]}
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
        <button disabled={!contentContainerSelected}>
          <b>B</b>
        </button>
        <button disabled={!contentContainerSelected}>
          <i>I</i>
        </button>
        <button disabled={!contentContainerSelected}>
          <u>U</u>
        </button>
        <button disabled={!contentContainerSelected}>
          <s>S</s>
        </button>
        <button disabled={!contentContainerSelected} onClick={() => formatSelection("a")} type="button" title="Link">
          <span id={styles.textColor}>C</span>
        </button>
        <button disabled={!contentContainerSelected} onClick={() => formatSelection("a")} type="button" title="Link">
          🖌️
        </button>
        <button disabled={!contentContainerSelected} onClick={() => formatSelection("a")} type="button" title="Link">
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