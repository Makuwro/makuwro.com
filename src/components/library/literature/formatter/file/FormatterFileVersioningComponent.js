import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterFileVersioningComponent() {

  return (
    <>
      <FormatterButton iconName="cloud_upload">
        Import from local autosave
      </FormatterButton>
      <FormatterButton iconName="history">
        View version history
      </FormatterButton>
    </>
  );

}