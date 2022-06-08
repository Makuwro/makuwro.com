import React from "react";
import FormatterButton from "../FormatterButton";
import PropTypes from "prop-types";

export default function FormatterEditListsComponent({toggleList}) {

  return (
    <>
      <section>
        <FormatterButton iconName="format_list_bulleted" disabled onClick={() => toggleList("ul")} />
        <button disabled onClick={() => toggleList("ol")}>
          <span className="material-icons-round">
            format_list_numbered
          </span>
        </button>
      </section>
    </>
  );

}

FormatterEditListsComponent.propTypes = {
  toggleList: PropTypes.func.isRequired
};