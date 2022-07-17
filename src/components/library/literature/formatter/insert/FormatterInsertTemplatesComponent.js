import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterInsertTemplatesComponent() {

  return (
    <>
      <section>
        <FormatterButton iconName="extension">
          Select from my templates
        </FormatterButton>
        <FormatterButton iconName="extension">
          Select from public templates
        </FormatterButton>
      </section>
      <FormatterButton iconName="extension">
        Insert template by name
      </FormatterButton>
    </>
  );

}