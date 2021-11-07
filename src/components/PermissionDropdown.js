import React from "react";
import Dropdown from "./Dropdown";

export default function PermissionDropdown() {

  return (
    <Dropdown key={0} width={125}>
      <li>No access</li>
      <li>Read</li>
      <li>Write</li>
    </Dropdown>
  );

}