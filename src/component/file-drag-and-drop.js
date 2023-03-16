import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";


const fileTypes = ["json"];

export default function App(props) {
  const {message, onReceiveFile} = props 

  return (
    <div className="h-50 d-flex justify-content-center align-items-center flex-column">
      <h3>{message}</h3>
      <FileUploader
        multiple={false}
        handleChange={onReceiveFile}
        name="file"
        types={fileTypes}
      />
    </div>
  );
}
