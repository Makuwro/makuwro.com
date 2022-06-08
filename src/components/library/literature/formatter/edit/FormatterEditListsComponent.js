import React from "react";
import FormatterButton from "../FormatterButton";
import PropTypes from "prop-types";

export default function FormatterEditListsComponent({toggleList, contentContainerSelected}) {

  return (
    <>
      <section>
        <FormatterButton iconName="format_list_bulleted" disabled={!contentContainerSelected} onClick={() => toggleList("ul")} />
        <FormatterButton iconName="format_list_numbered" disabled={!contentContainerSelected} onClick={() => toggleList("ol")} />
      </section>
    </>
  );

}

FormatterEditListsComponent.propTypes = {
  toggleList: PropTypes.func.isRequired
};