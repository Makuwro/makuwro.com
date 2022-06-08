import React from "react";
import FormatterButton from "../FormatterButton";
import PropTypes from "prop-types";

export default function FormatterInsertImagesComponent({requestImage}) {

  return (
    <>
      <section>
        <FormatterButton iconName="file_upload" onClick={requestImage}>
          Insert image from file
        </FormatterButton>
        <FormatterButton iconName="link">
          Insert image from URL
        </FormatterButton>
      </section>
      <FormatterButton iconName="file_open">
        Insert art
      </FormatterButton>
    </>
  );

}

FormatterInsertImagesComponent.propTypes = {
  requestImage: PropTypes.func.isRequired
};