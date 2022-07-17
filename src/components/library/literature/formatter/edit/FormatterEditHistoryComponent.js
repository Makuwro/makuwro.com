import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterEditHistoryComponent() {

  return (
    <section>
      <FormatterButton iconName="undo" title="Undo" />
      <FormatterButton iconName="redo" title="Redo" />
    </section>
  );

}