import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

const MyRichTextArea = ({ onChange }) => {
  const [editorHtml, setEditorHtml] = useState("");

  const modules = {
    toolbar: [
      [{ "header": "1" }, { "header": "2" }, { "header": "3" }, { "header": "4" }, { "header": "5" }, { "header": "6" }],
      [{ "font": [] }],
      ["bold", "italic"],
      [{ "list": "ordered" }, { "list": "bullet" }],
      ["link"],
    ],
  };

  const handleEditorChange = (value) => {
    setEditorHtml(value);
    onChange(value);
  };



  return (
    <div style={{ overflowY: "auto", resize: "both",maxWidth:"100%",minWidth:"100%",minHeight:"150px" }}>
      <ReactQuill
      style={{height:"200px"}}
        value={editorHtml}
        onChange={handleEditorChange}
        modules={modules}
        
      />
    
    </div>
  );
};

export default MyRichTextArea;
