import React, { createContext, useState } from "react";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState(""); 
  const [popup, setPopup] = useState(false);
  const [filesList, setFilesList] = useState([]);
  

  const togglePopup = () => setPopup(!popup);
  const closePopup = () => setPopup(false);

  const addEncryptedFile = (encryptedFile) => {
    setFilesList((prevList) => [...prevList, encryptedFile]);
  };

  return (
    <FileContext.Provider
      value={{
        file,
        setFile,
        
        key,
        setKey,
        popup,
        togglePopup,
        closePopup,
        filesList,
        addEncryptedFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
