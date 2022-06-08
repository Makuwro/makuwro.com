import React from "react";
import FormatterButton from "../FormatterButton";

export default function FormatterFileExportComponent({downloadHTML}) {

  return (
    <>
      <FormatterButton iconName="print">
        Print
      </FormatterButton>
      <FormatterButton iconName="code" onClick={downloadHTML}>
        Export to HTML
      </FormatterButton>
    </>
  );

}