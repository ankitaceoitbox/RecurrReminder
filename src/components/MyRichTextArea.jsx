import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import "./global.css"
const MyRichTextArea = ({ onChange }) => {
  const [editorHtml, setEditorHtml] = useState("");
  const quillRef = useRef(null);
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().on("text-change", () => {
        const editorHtml = quillRef.current.getEditor().root.innerHTML;
        setEditorHtml(editorHtml);
        onChange(editorHtml);
      });
    }
  }, [onChange]);




  const modules = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],     
      [{ 'font': []}],
      [{ 'align': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link']
    ],
  };
  




  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  

  return (
    <div style={{ overflowY: "auto", maxWidth: "100%", minWidth: "100%", minHeight: "250px" }}>
     
      <div className="quill-toolbar">
        {/* ReactQuill toolbar */}
        <ReactQuill
        theme="snow"
          ref={quillRef}
          value={editorHtml}
          modules={modules}
          formats={formats}
        />
      </div>
   
    </div>
  );
};

export default MyRichTextArea;
