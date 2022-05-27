import React, { useState, createContext } from "react";
import PropTypes from "prop-types";

const Context = createContext();

export default function PopupManager({children}) {

  const [currentPopup, setCurrentPopup] = useState(null);

  return (
    <Context.Provider value={{
      currentPopup,
      setCurrentPopup
    }}>
      {children}
    </Context.Provider>
  );

}

export {Context as PopupContext}; 

PopupManager.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  warnUnfinished: PropTypes.bool,
  popups: PropTypes.array
};