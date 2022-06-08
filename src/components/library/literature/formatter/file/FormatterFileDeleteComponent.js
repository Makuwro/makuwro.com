import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterFileDeleteComponent({deleteLiterature}) {

  return (
    <FormatterButton iconName="delete_forever" onClick={deleteLiterature}>
      Delete blog post
    </FormatterButton>
  );

}