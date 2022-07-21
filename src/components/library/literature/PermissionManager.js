import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Popup from "../../Popup";

function PermissionManager() {

  const [searchParams] = useSearchParams();
  const [popup, setPopup] = useState(null);
  const mode = searchParams.get("mode");
  const action = searchParams.get("action");

  useEffect(() => {

    if (mode === "edit" && action === "manage-permissions") {

      setPopup(
        <Popup title="Manage permissions">
          
        </Popup>
      );

    }

  }, [mode, action]);

  return popup;

}

export default PermissionManager;