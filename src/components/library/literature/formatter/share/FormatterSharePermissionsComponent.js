import React from "react";
import FormatterButton from "../FormatterButton";
import PropTypes from "prop-types";

export default function FormatterSharePermissionsComponent({navigate}) {

  return (
    <FormatterButton iconName="manage_accounts" onClick={() => navigate("?mode=edit&action=manage-permissions")}>
      Manage permissions
    </FormatterButton>
  );

}

FormatterSharePermissionsComponent.propTypes = {
  navigate: PropTypes.func.isRequired
};