import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterHelpCreativeSupportComponent() {

  return (
    <FormatterButton iconName="forum" onClick={() => window.open("https://den.makuwro.com/join")}>
      Visit Da Dragon Den
    </FormatterButton>
  );

}