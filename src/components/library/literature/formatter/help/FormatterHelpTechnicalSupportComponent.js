import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterHelpTechnicalSupport() {

  return (
    <>
      <section>
        <FormatterButton iconName="support">
          Visit the help center
        </FormatterButton>
        <FormatterButton iconName="report_problem">
          Report a problem
        </FormatterButton>
      </section>
      <section>
        <FormatterButton iconName="build_circle">
          Suggest a feature
        </FormatterButton>
      </section>
    </>
  );

}