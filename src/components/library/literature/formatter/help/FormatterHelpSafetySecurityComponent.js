import React from "react";
import FormatterButton from "../FormatterButton";
import PropTypes from "prop-types";

export default function FormatterHelpSafetySecurityComponent({navigate}) {

  return (
    <FormatterButton iconName="flag">
      Report abuse
    </FormatterButton>
  );

}

FormatterHelpSafetySecurityComponent.propTypes = {
  navigate: PropTypes.func.isRequired
};