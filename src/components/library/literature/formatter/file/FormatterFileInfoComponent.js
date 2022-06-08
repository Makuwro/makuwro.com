import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterFileInfoComponent() {

  return (
    <>
      <FormatterButton iconName="link">
        Change blog URL
      </FormatterButton>
      <FormatterButton iconName="subject">
        Word count
      </FormatterButton>
    </>
  );

}